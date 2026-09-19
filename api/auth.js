const L = require("./_lib");
const day = 24*3600*1000;
const emailOk = e=>/^\S+@\S+\.\S+$/.test(e||"");
async function session(e){ return {token: await L.sign({uid:e.id, exp:Date.now()+14*day}), user:L.publicUser(e)}; }
const stamp = ()=>new Date().toLocaleString("fr-FR").slice(0,17);

module.exports = L.wrap(async (req, res)=>{
  if(req.method!=="POST") return L.send(res, 405, {error:"Méthode non autorisée."});
  const b = L.body(req), action = b.action;
  const email = String(b.email||"").trim().toLowerCase();

  if(action==="setup"){
    const st = await L.loadSettings();
    if((st.employees||[]).length) return L.send(res, 403, {error:"L'application est déjà initialisée."});
    if(!b.nom || !emailOk(email) || String(b.password||"").length<8) return L.send(res, 400, {error:"Nom, e-mail valide et mot de passe de 8 caractères minimum requis."});
    const e = {id:"E1", nom:String(b.nom).slice(0,80), email, telephone:"", poste:"Directeur", role:"directeur", statut:"actif", ajoute:new Date().toLocaleDateString("fr-FR"), pwd:L.hashPassword(b.password)};
    st.employees = [e];
    st.company = {nom:b.company ? String(b.company).slice(0,80) : "Maître Toiturier", telephone:"", email:"", site:"", adresse:"", siret:"", iban:"", devisValidite:30, acomptePct:30};
    await L.setJson("mt:settings", st);
    return L.send(res, 200, await session(e));
  }

  if(action==="login"){
    if(!emailOk(email)) return L.send(res, 400, {error:"E-mail ou mot de passe incorrect."});
    if(!(await L.rateLimit("mt:rl:"+email, 10, 900))) return L.send(res, 429, {error:"Trop de tentatives. Réessayez dans 15 minutes."});
    const st = await L.loadSettings();
    const e = (st.employees||[]).find(x=>x.email.toLowerCase()===email);
    if(e){
      if(!L.checkPassword(String(b.password||""), e.pwd)) return L.send(res, 401, {error:"E-mail ou mot de passe incorrect."});
      if(e.statut!=="actif") return L.send(res, 403, {error:"Votre accès est suspendu. Contactez la direction."});
      return L.send(res, 200, await session(e));
    }
    const r = (st.requests||[]).find(x=>x.email.toLowerCase()===email);
    if(r && L.checkPassword(String(b.password||""), r.pwd)){
      return L.send(res, 403, {error: r.statut==="en attente" ? "Votre demande d’accès est en attente de validation par la direction." : "Votre demande d’accès a été refusée. Contactez la direction."});
    }
    return L.send(res, 401, {error:"E-mail ou mot de passe incorrect."});
  }

  if(action==="signup"){
    if(!b.nom || !emailOk(email)) return L.send(res, 400, {error:"Indiquez votre nom et une adresse e-mail valide."});
    if(String(b.password||"").length<8) return L.send(res, 400, {error:"Le mot de passe doit contenir au moins 8 caractères."});
    if(!(await L.rateLimit("mt:rls:"+(req.headers["x-forwarded-for"]||"ip"), 10, 3600))) return L.send(res, 429, {error:"Trop de demandes. Réessayez plus tard."});
    const st = await L.loadSettings();
    if((st.employees||[]).some(e=>e.email.toLowerCase()===email) || (st.requests||[]).some(r=>r.email.toLowerCase()===email && r.statut!=="refusé")) return L.send(res, 409, {error:"Un accès existe déjà pour cette adresse e-mail."});
    st.requests = (st.requests||[]).filter(r=>r.email.toLowerCase()!==email);
    st.requests.push({id:"R"+Date.now(), nom:String(b.nom).slice(0,80), email, telephone:String(b.tel||"").slice(0,30), poste:String(b.poste||"").slice(0,40), pwd:L.hashPassword(b.password), date:stamp(), statut:"en attente"});
    await L.setJson("mt:settings", st);
    return L.send(res, 200, {ok:true});
  }

  if(action==="forgot"){
    if(emailOk(email) && await L.rateLimit("mt:rlf:"+email, 3, 3600)){
      const st = await L.loadSettings();
      st.resets = (st.resets||[]).filter(r=>r.email.toLowerCase()!==email);
      st.resets.push({id:"P"+Date.now(), email, date:stamp(), statut:"à traiter"});
      await L.setJson("mt:settings", st);
    }
    return L.send(res, 200, {ok:true}); // réponse neutre : pas d'énumération de comptes
  }

  const a = await L.authenticate(req);
  if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
  if(action==="me") return L.send(res, 200, {user:L.publicUser(a.user)});
  if(action==="changepwd"){
    if(String(b.password||"").length<8) return L.send(res, 400, {error:"Au moins 8 caractères."});
    const e = a.settings.employees.find(x=>x.id===a.user.id);
    e.pwd = L.hashPassword(b.password); e.mustChange = false;
    await L.setJson("mt:settings", a.settings);
    return L.send(res, 200, {ok:true});
  }
  L.send(res, 400, {error:"Action inconnue."});
});
