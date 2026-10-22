// Signature à distance d'un devis : le salarié crée un lien à usage unique, le client signe depuis son téléphone.
// POST {action:"create"}  (salarié connecté) → {token}
// GET  ?action=status&token=  (salarié connecté) → état + signature
// GET  ?token=                (public) → résumé du devis à signer
// POST {action:"submit", token, nom, image}  (public) → enregistre la signature
const L = require("./_lib");
const crypto = require("crypto");
const key = t=>"mt:sign:"+t;
const okTok = t=>/^[a-f0-9]{32,64}$/.test(String(t||""));
const DAY = 86400000;

function clip(s, n){ return String(s==null?"":s).slice(0, n); }
function cleanSummary(s){
  s = s || {};
  return {
    entreprise: clip(s.entreprise, 120), client: clip(s.client, 120), numero: clip(s.numero, 60), objet: clip(s.objet, 300),
    date: clip(s.date, 40), validite: clip(s.validite, 40), paiement: clip(s.paiement, 600), cgv: clip(s.cgv, 20000), reserves: clip(s.reserves, 2000),
    totaux: {ht: clip(s.totaux&&s.totaux.ht, 30), tva: clip(s.totaux&&s.totaux.tva, 30), ttc: clip(s.totaux&&s.totaux.ttc, 30)},
    lignes: (Array.isArray(s.lignes)?s.lignes:[]).slice(0, 80).map(l=>({titre:clip(l.titre,200), designation:clip(l.designation,1500), qte:clip(l.qte,20), pu:clip(l.pu,30), tva:clip(l.tva,10), total:clip(l.total,30)}))
  };
}
function ip(req){ return clip((req.headers["x-forwarded-for"]||"").split(",")[0] || (req.socket&&req.socket.remoteAddress) || "", 60); }

module.exports = L.wrap(async (req, res)=>{
  const q = req.query || {};

  if(req.method==="GET" && q.action==="status"){
    const a = await L.authenticate(req);
    if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
    if(!okTok(q.token)) return L.send(res, 400, {error:"Lien invalide."});
    const r = await L.getJson(key(q.token));
    if(!r) return L.send(res, 404, {error:"Lien introuvable ou expiré."});
    return L.send(res, 200, {status:r.status, signedAt:r.signedAt||null, nom:r.nom||null, image:r.status==="signed" ? r.image : null});
  }

  if(req.method==="GET"){
    if(!okTok(q.token)) return L.send(res, 400, {error:"Lien invalide."});
    if(!(await L.rateLimit("mt:rl:signget:"+ip(req), 60, 600))) return L.send(res, 429, {error:"Trop de tentatives, réessayez dans quelques minutes."});
    const r = await L.getJson(key(q.token));
    if(!r || r.exp < Date.now()) return L.send(res, 404, {error:"Ce lien de signature est introuvable ou a expiré. Demandez-en un nouveau à l'entreprise."});
    return L.send(res, 200, {status:r.status, signedAt:r.signedAt||null, nom:r.nom||null, summary:r.summary});
  }

  if(req.method!=="POST") return L.send(res, 405, {error:"Méthode non autorisée."});
  const b = L.body(req);

  if(b.action==="create"){
    const a = await L.authenticate(req);
    if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
    const token = crypto.randomBytes(24).toString("hex");
    await L.setJson(key(token), {status:"pending", by:a.user.id, dossierId:clip(b.dossierId,40), devisId:clip(b.devisId,60), summary:cleanSummary(b.summary), created:Date.now(), exp:Date.now()+30*DAY});
    return L.send(res, 200, {token});
  }

  if(b.action==="submit"){
    if(!okTok(b.token)) return L.send(res, 400, {error:"Lien invalide."});
    if(!(await L.rateLimit("mt:rl:signpost:"+ip(req), 15, 600))) return L.send(res, 429, {error:"Trop de tentatives, réessayez dans quelques minutes."});
    const r = await L.getJson(key(b.token));
    if(!r || r.exp < Date.now()) return L.send(res, 404, {error:"Ce lien de signature est introuvable ou a expiré."});
    if(r.status==="signed") return L.send(res, 409, {error:"Ce devis a déjà été signé."});
    const nom = clip(b.nom, 120).trim();
    if(nom.length<2) return L.send(res, 400, {error:"Indiquez votre nom."});
    const image = String(b.image||"");
    if(!/^data:image\/png;base64,/.test(image)) return L.send(res, 400, {error:"Signature invalide."});
    if(image.length>400000) return L.send(res, 413, {error:"Signature trop lourde."});
    if(image.length<1500) return L.send(res, 400, {error:"Dessinez votre signature dans le cadre."});
    Object.assign(r, {status:"signed", nom, image, signedAt:Date.now(), ip:ip(req), ua:clip(req.headers["user-agent"],200)});
    await L.setJson(key(b.token), r);
    return L.send(res, 200, {ok:true});
  }

  L.send(res, 400, {error:"Action inconnue."});
});
