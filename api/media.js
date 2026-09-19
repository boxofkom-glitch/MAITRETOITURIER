const L = require("./_lib");
const crypto = require("crypto");
module.exports = L.wrap(async (req, res)=>{
  const a = await L.authenticate(req);
  if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
  if(req.method==="GET"){
    const id = String((req.query||{}).id||"");
    if(!/^m[a-f0-9]{16,40}$/.test(id)) return L.send(res, 400, {error:"Identifiant invalide."});
    const v = await L.kv("GET", "mt:m:"+id);
    return v ? L.send(res, 200, {dataUrl:v}) : L.send(res, 404, {error:"Photo introuvable."});
  }
  if(req.method!=="POST") return L.send(res, 405, {error:"Méthode non autorisée."});
  const b = L.body(req);
  const d = String(b.dataUrl||"");
  if(!/^data:image\/(jpeg|png|webp);base64,/.test(d)) return L.send(res, 400, {error:"Image invalide."});
  if(d.length>900000) return L.send(res, 413, {error:"Image trop lourde (réduisez-la)."});
  const id = "m"+crypto.randomBytes(12).toString("hex");
  await L.kv("SET", "mt:m:"+id, d);
  L.send(res, 200, {id});
});
