// Bibliothèque commune des fonctions serveur (Vercel, Node). Aucune dépendance externe.
// Stockage : Redis REST (Upstash / Vercel KV). Variables : KV_REST_API_URL + KV_REST_API_TOKEN
// (ou UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
const crypto = require("crypto");

const URL_ = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const configured = () => !!(URL_() && TOKEN_());

async function kv(...cmd){
  const r = await fetch(URL_(), {method:"POST", headers:{Authorization:"Bearer "+TOKEN_(), "Content-Type":"application/json"}, body:JSON.stringify(cmd)});
  const j = await r.json();
  if(j.error) throw new Error(j.error);
  return j.result;
}
async function pipeline(cmds){
  const r = await fetch(URL_()+"/pipeline", {method:"POST", headers:{Authorization:"Bearer "+TOKEN_(), "Content-Type":"application/json"}, body:JSON.stringify(cmds)});
  const j = await r.json();
  return j.map(x=>{ if(x.error) throw new Error(x.error); return x.result; });
}
async function getJson(key){ const v = await kv("GET", key); return v ? JSON.parse(v) : null; }
async function setJson(key, val){ return kv("SET", key, JSON.stringify(val)); }

// ---- mots de passe (scrypt) ----
function hashPassword(pwd){
  const salt = crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(pwd, salt, 32).toString("hex");
  return "scrypt$"+salt+"$"+h;
}
function checkPassword(pwd, stored){
  if(!stored) return false;
  const [algo, salt, h] = stored.split("$");
  if(algo!=="scrypt") return false;
  const c = crypto.scryptSync(pwd, salt, 32);
  const b = Buffer.from(h, "hex");
  return c.length===b.length && crypto.timingSafeEqual(c, b);
}
function randomPassword(){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from(crypto.randomBytes(10)).map(b=>chars[b%chars.length]).join("");
}

// ---- jetons signés ----
let SECRET_CACHE = null;
async function secret(){
  if(process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if(SECRET_CACHE) return SECRET_CACHE;
  let s = await kv("GET", "mt:secret");
  if(!s){ s = crypto.randomBytes(32).toString("hex"); await kv("SET", "mt:secret", s, "NX"); s = await kv("GET", "mt:secret"); }
  SECRET_CACHE = s; return s;
}
const b64 = b=>Buffer.from(b).toString("base64url");
async function sign(payload){
  const body = b64(JSON.stringify(payload));
  const mac = crypto.createHmac("sha256", await secret()).update(body).digest("base64url");
  return body+"."+mac;
}
async function verify(token){
  if(!token || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const good = crypto.createHmac("sha256", await secret()).update(body).digest("base64url");
  const a = Buffer.from(mac), b = Buffer.from(good);
  if(a.length!==b.length || !crypto.timingSafeEqual(a, b)) return null;
  const p = JSON.parse(Buffer.from(body, "base64url").toString());
  return p.exp > Date.now() ? p : null;
}

// ---- réglages (équipe, accès, entreprise) ----
async function loadSettings(){
  return (await getJson("mt:settings")) || {employees:[], requests:[], invitations:[], resets:[], access:null, company:null, materielLib:null};
}
function publicUser(e){ return {id:e.id, nom:e.nom, email:e.email, role:e.role, poste:e.poste||"", telephone:e.telephone||"", mustChange:!!e.mustChange}; }
function sanitizeSettings(st, user){
  const out = {
    employees: (st.employees||[]).map(e=>({id:e.id, nom:e.nom, email:e.email, telephone:e.telephone||"", poste:e.poste||"", role:e.role, statut:e.statut, ajoute:e.ajoute||""})),
    access: st.access, company: st.company, materielLib: st.materielLib, custom: st.custom||null
  };
  if(user && user.role==="directeur"){
    out.requests = (st.requests||[]).map(r=>({id:r.id, nom:r.nom, email:r.email, telephone:r.telephone||"", poste:r.poste||"", date:r.date, statut:r.statut}));
    out.invitations = st.invitations||[]; out.resets = st.resets||[];
  }
  return out;
}

// ---- requête HTTP ----
async function authenticate(req){
  const h = req.headers.authorization || "";
  const p = await verify(h.startsWith("Bearer ") ? h.slice(7) : "");
  if(!p) return null;
  const st = await loadSettings();
  const e = (st.employees||[]).find(x=>x.id===p.uid);
  if(!e || e.statut!=="actif") return null;
  return {user:e, settings:st};
}
function send(res, code, obj){ res.statusCode = code; res.setHeader("Content-Type","application/json"); res.setHeader("Cache-Control","no-store"); res.end(JSON.stringify(obj)); }
function body(req){
  if(req.body && typeof req.body==="object") return req.body;
  try{ return JSON.parse(req.body||"{}"); }catch(e){ return {}; }
}
function wrap(fn){
  return async (req, res)=>{
    try{
      if(!configured()) return send(res, 503, {error:"Serveur non configuré : ajoutez la base Redis (voir docs/DEPLOIEMENT_SERVEUR.md)."});
      await fn(req, res);
    }catch(e){ send(res, 500, {error:"Erreur serveur.", detail:String(e.message||e).slice(0,200)}); }
  };
}
async function rateLimit(key, max, windowSec){
  const n = await kv("INCR", key);
  if(n===1) await kv("EXPIRE", key, windowSec);
  return n<=max;
}

// ---- envoi d'e-mail réel (Resend). Facultatif : sans RESEND_API_KEY, l'appli reste en mode
// « préparer le message » (le salarié l'envoie lui-même depuis sa messagerie). ----
const mailConfigured = () => !!process.env.RESEND_API_KEY;
async function sendMail({to, subject, html, text, replyTo}){
  if(!mailConfigured()) throw new Error("Envoi automatique non configuré (RESEND_API_KEY absente).");
  const from = process.env.MAIL_FROM || "Maître Toiturier <onboarding@resend.dev>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, text, reply_to: replyTo || undefined })
  });
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error((j && (j.message || j.error)) || "Envoi refusé par le service d'e-mail.");
  return j;
}

module.exports = {configured, kv, pipeline, getJson, setJson, hashPassword, checkPassword, randomPassword, sign, verify, loadSettings, publicUser, sanitizeSettings, authenticate, send, body, wrap, rateLimit, mailConfigured, sendMail};
