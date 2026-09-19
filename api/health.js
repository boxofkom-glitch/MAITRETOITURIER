const L = require("./_lib");
module.exports = async (req, res)=>{
  try{
    if(!L.configured()) return L.send(res, 200, {ok:true, configured:false, needsSetup:false});
    const st = await L.loadSettings();
    L.send(res, 200, {ok:true, configured:true, needsSetup:!(st.employees||[]).some(e=>e.role==="directeur")});
  }catch(e){ L.send(res, 200, {ok:true, configured:false, error:String(e.message||e).slice(0,120)}); }
};
