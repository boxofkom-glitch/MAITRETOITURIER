const L = require("./_lib");
const emailOk = e => /^\S+@\S+\.\S+$/.test(e||"");

module.exports = L.wrap(async (req, res)=>{
  const a = await L.authenticate(req);
  if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
  if(req.method!=="POST") return L.send(res, 405, {error:"Méthode non autorisée."});
  if(!L.mailConfigured()) return L.send(res, 503, {error:"Envoi automatique non configuré."});

  const b = L.body(req);
  const to = String(b.to||"").trim();
  if(!emailOk(to)) return L.send(res, 400, {error:"Adresse e-mail du destinataire invalide."});
  const subject = String(b.subject||"").slice(0,200);
  const html = String(b.html||"");
  const text = String(b.text||"");
  if(!subject || !html) return L.send(res, 400, {error:"Message incomplet."});
  if(!(await L.rateLimit("mt:rlmail:"+a.user.id, 40, 3600))) return L.send(res, 429, {error:"Trop d'e-mails envoyés cette heure-ci. Réessayez plus tard."});

  try{
    await L.sendMail({to, subject, html, text, replyTo: a.user.email});
    L.send(res, 200, {ok:true});
  }catch(e){
    L.send(res, 502, {error:"L'e-mail n'a pas pu être envoyé : "+String(e.message||e).slice(0,150)});
  }
});
