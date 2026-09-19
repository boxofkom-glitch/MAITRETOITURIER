// Serveur de développement local : fichiers statiques + fonctions /api + faux Redis en mémoire (sans compte, sans réseau).
// Usage : node dev-server.js   →  http://localhost:5183   (les données sont perdues à l'arrêt)
const http = require("http"), fs = require("fs"), path = require("path");
const PORT = process.env.PORT || 5183;

// ---- mini Redis REST (commandes utilisées par l'API) ----
const store = new Map(), zsets = new Map(), sets = new Map();
function cmd(a){
  const [c, k, ...r] = a; const C = String(c).toUpperCase();
  switch(C){
    case "GET": return store.has(k) ? store.get(k) : null;
    case "SET": { if(r.includes("NX") && store.has(k)) return null; store.set(k, String(r[0])); return "OK"; }
    case "DEL": return store.delete(k) ? 1 : 0;
    case "MGET": return [k, ...r].map(x=>store.has(x) ? store.get(x) : null);
    case "INCR": { const n = (parseInt(store.get(k)||"0",10))+1; store.set(k, String(n)); return n; }
    case "EXPIRE": return 1;
    case "SADD": { const s = sets.get(k) || new Set(); r.forEach(x=>s.add(x)); sets.set(k, s); return 1; }
    case "SREM": { const s = sets.get(k); if(s) r.forEach(x=>s.delete(x)); return 1; }
    case "SMEMBERS": return [...(sets.get(k)||[])];
    case "ZADD": { const z = zsets.get(k) || new Map(); z.set(r[1], parseFloat(r[0])); zsets.set(k, z); return 1; }
    case "ZREM": { const z = zsets.get(k); if(z) r.forEach(x=>z.delete(x)); return 1; }
    case "ZRANGEBYSCORE": { const z = zsets.get(k) || new Map(); const min = parseFloat(String(r[0]).replace("(","")); return [...z.entries()].filter(([,s])=>s>=min).map(([m])=>m); }
  }
  throw new Error("commande non gérée : "+C);
}
process.env.KV_REST_API_URL = "http://localhost:"+PORT+"/__kv";
process.env.KV_REST_API_TOKEN = "dev";

const api = {};
["health","auth","data","settings","media"].forEach(n=>{ api[n] = require("./api/"+n+".js"); });
const MIME = {".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css", ".png":"image/png", ".jpg":"image/jpeg", ".json":"application/json", ".svg":"image/svg+xml", ".ico":"image/x-icon", ".webmanifest":"application/manifest+json"};

http.createServer((req, res)=>{
  const u = new URL(req.url, "http://x");
  let raw = ""; req.on("data", c=>raw += c);
  req.on("end", ()=>{
    if(u.pathname==="/__kv" || u.pathname==="/__kv/pipeline"){
      try{
        const b = JSON.parse(raw||"[]");
        const out = u.pathname.endsWith("pipeline") ? b.map(x=>({result:cmd(x)})) : {result:cmd(b)};
        res.setHeader("Content-Type","application/json"); return res.end(JSON.stringify(out));
      }catch(e){ res.statusCode = 200; return res.end(JSON.stringify({error:String(e.message)})); }
    }
    if(u.pathname.startsWith("/api/")){
      const fn = api[u.pathname.slice(5)];
      if(!fn){ res.statusCode = 404; return res.end("{}"); }
      req.query = Object.fromEntries(u.searchParams); req.body = raw ? (()=>{ try{ return JSON.parse(raw); }catch(e){ return {}; } })() : undefined;
      return fn(req, res);
    }
    let p = path.join(__dirname, decodeURIComponent(u.pathname==="/" ? "/index.html" : u.pathname));
    if(!p.startsWith(__dirname) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.statusCode = 404; return res.end("404"); }
    res.setHeader("Content-Type", MIME[path.extname(p)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    fs.createReadStream(p).pipe(res);
  });
}).listen(PORT, ()=>console.log("Maître Toiturier (dev) : http://localhost:"+PORT));
