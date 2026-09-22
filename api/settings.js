const L = require("./_lib");
const ROLES = ["admin","tech","sales"];

module.exports = L.wrap(async (req, res)=>{
  const a = await L.authenticate(req);
  if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
  const st = a.settings, isDir = a.user.role==="directeur";
  if(req.method==="GET") return L.send(res, 200, {settings:L.sanitizeSettings(st, a.user)});
  if(req.method!=="POST") return L.send(res, 405, {error:"Méthode non autorisée."});
  const b = L.body(req);
  if(b.action==="materiel"){
    if(!Array.isArray(b.lib)) return L.send(res, 400, {error:"Bibliothèque invalide."});
    st.materielLib = b.lib.slice(0,60).map(l=>({id:String(l.id).slice(0,40), label:String(l.label).slice(0,80), items:(l.items||[]).slice(0,80).map(x=>String(x).slice(0,120))}));
    await L.setJson("mt:settings", st);
    return L.send(res, 200, {ok:true});
  }
  if(!isDir) return L.send(res, 403, {error:"Réservé au directeur."});

  if(b.action==="put"){
    const inc = b.settings || {};
    if(inc.access) st.access = inc.access;
    if(inc.company) st.company = inc.company;
    if(inc.materielLib) st.materielLib = inc.materielLib;
    if(inc.custom) st.custom = inc.custom;
    if(inc.invitations) st.invitations = inc.invitations;
    if(inc.resets) st.resets = inc.resets;
    // équipe : modifier ou supprimer des comptes existants ; jamais en créer, jamais toucher aux mots de passe
    if(Array.isArray(inc.employees)){
      const byId = {}; inc.employees.forEach(e=>{ byId[e.id] = e; });
      st.employees = st.employees.filter(e=>e.role==="directeur" || byId[e.id]).map(e=>{
        const x = byId[e.id]; if(!x || e.role==="directeur") return e;
        return Object.assign(e, {nom:String(x.nom||e.nom).slice(0,80), telephone:String(x.telephone||"").slice(0,30), poste:String(x.poste||"").slice(0,40), statut:x.statut==="suspendu"?"suspendu":"actif", role:ROLES.includes(x.role)?x.role:e.role});
      });
    }
    await L.setJson("mt:settings", st);
    return L.send(res, 200, {ok:true});
  }
  if(b.action==="accept"){
    const r = st.requests.find(x=>x.id===b.rid && x.statut==="en attente");
    if(!r) return L.send(res, 404, {error:"Demande introuvable."});
    if(!ROLES.includes(b.role)) return L.send(res, 400, {error:"Rôle invalide."});
    const id = "E"+(st.employees.reduce((m,e)=>Math.max(m, parseInt(String(e.id).slice(1),10)||0),0)+1);
    st.employees.push({id, nom:r.nom, email:r.email, telephone:r.telephone, poste:r.poste, role:b.role, statut:"actif", ajoute:new Date().toLocaleDateString("fr-FR"), pwd:r.pwd});
    r.statut = "accepté";
    (st.invitations||[]).forEach(iv=>{ if(iv.email.toLowerCase()===r.email.toLowerCase()) iv.statut = "acceptée"; });
    await L.setJson("mt:settings", st);
    return L.send(res, 200, {ok:true, id});
  }
  if(b.action==="refuse"){
    const r = st.requests.find(x=>x.id===b.rid);
    if(r) r.statut = "refusé";
    await L.setJson("mt:settings", st);
    return L.send(res, 200, {ok:true});
  }
  if(b.action==="resetpw"){
    const e = st.employees.find(x=>x.id===b.eid);
    if(!e) return L.send(res, 404, {error:"Compte introuvable."});
    const tmp = L.randomPassword();
    e.pwd = L.hashPassword(tmp); e.mustChange = true;
    (st.resets||[]).forEach(r=>{ if(r.email.toLowerCase()===e.email.toLowerCase()) r.statut = "traité"; });
    await L.setJson("mt:settings", st);
    return L.send(res, 200, {ok:true, password:tmp});
  }
  L.send(res, 400, {error:"Action inconnue."});
});
