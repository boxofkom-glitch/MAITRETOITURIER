const L = require("./_lib");
const dkey = id=>"mt:d:"+id;
const okId = id=>/^[A-Za-z0-9_-]{1,40}$/.test(String(id||""));

async function readMany(ids){
  const out = [];
  for(let i=0;i<ids.length;i+=100){
    const chunk = ids.slice(i, i+100);
    const vals = chunk.length ? await L.kv("MGET", ...chunk.map(dkey)) : [];
    vals.forEach((v,j)=>{ if(v){ const o = JSON.parse(v); out.push({id:chunk[j], rev:o.rev, data:o.data}); } });
  }
  return out;
}

module.exports = L.wrap(async (req, res)=>{
  const a = await L.authenticate(req);
  if(!a) return L.send(res, 401, {error:"Session expirée : reconnectez-vous."});
  const u = a.user;

  if(req.method==="GET"){
    const since = parseInt((req.query||{}).since, 10) || 0;
    const now = Date.now();
    let ids, deleted = [];
    if(since){
      ids = await L.kv("ZRANGEBYSCORE", "mt:changes", String(since), "+inf");
      deleted = await L.kv("ZRANGEBYSCORE", "mt:del", String(since), "+inf");
    } else ids = await L.kv("SMEMBERS", "mt:dossiers");
    const dossiers = await readMany(ids||[]);
    const [c, p] = await L.pipeline([["GET","mt:contracts"],["GET","mt:parrainages"]]);
    return L.send(res, 200, {now, dossiers, deleted:deleted||[], contracts:c?JSON.parse(c):{rev:0,data:[]}, parrainages:p?JSON.parse(p):{rev:0,data:[]}, settings:L.sanitizeSettings(a.settings, u)});
  }

  if(req.method!=="POST") return L.send(res, 405, {error:"Méthode non autorisée."});
  const b = L.body(req), results = [], now = Date.now();
  for(const it of (b.dossiers||[])){
    if(!okId(it.id) || !it.data) continue;
    const cur = await L.getJson(dkey(it.id));
    const curRev = cur ? cur.rev : 0;
    if(curRev !== (it.baseRev||0)){ results.push({id:it.id, conflict:true, rev:curRev, data:cur?cur.data:null}); continue; }
    const rev = curRev+1;
    await L.pipeline([["SET", dkey(it.id), JSON.stringify({rev, upd:now, by:u.id, data:it.data})], ["SADD","mt:dossiers",it.id], ["ZADD","mt:changes",String(now),it.id], ["ZREM","mt:del",it.id]]);
    results.push({id:it.id, rev});
  }
  for(const id of (b.deletes||[])){
    if(!okId(id)) continue;
    if(!["directeur","admin"].includes(u.role)){ results.push({id, denied:true}); continue; }
    await L.pipeline([["DEL",dkey(id)],["SREM","mt:dossiers",id],["ZREM","mt:changes",id],["ZADD","mt:del",String(now),id]]);
    results.push({id, deleted:true});
  }
  const lists = {};
  for(const name of ["contracts","parrainages"]){
    const it = b[name]; if(!it || !Array.isArray(it.data)) continue;
    const cur = (await L.getJson("mt:"+name)) || {rev:0, data:[]};
    if(cur.rev !== (it.baseRev||0)){ lists[name] = {conflict:true, rev:cur.rev, data:cur.data}; continue; }
    await L.setJson("mt:"+name, {rev:cur.rev+1, data:it.data});
    lists[name] = {rev:cur.rev+1};
  }
  L.send(res, 200, {now, results, lists});
});
