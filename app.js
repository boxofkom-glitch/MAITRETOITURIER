/* ToitPilot / Maître Toiturier — CRM demo clone. Static, in-memory, no backend. */

const POINTS = [
  "Couverture et état des tuiles",
  "Éléments de finition et zinguerie",
  "Étanchéité",
  "Charpente",
  "Isolation et ventilation",
  "Humidité et infiltrations",
  "État général et sécurité",
  "Entretien, mousses et lichens"
];

const CONSERVER_JUSTIF = "Le contrôle visuel renseigné indique un bon état. Aucun remplacement n’est justifié par les constats de cette visite, sous réserve des limites d’accès.";

const ANOMALY_VOCAB = {
  casse:      {icon:"💥", label:"Cassé(e)", risk:"une dégradation qui s’aggrave et laisse progressivement passer l’eau"},
  fissure:    {icon:"〰️", label:"Fissuré(e)", risk:"une dégradation qui s’aggrave et laisse progressivement passer l’eau"},
  deplace:    {icon:"↔️", label:"Déplacé(e) / glissé(e)", risk:"un risque de chute de l’élément lors d’un prochain épisode de vent fort"},
  souleve:    {icon:"⬆️", label:"Soulevé(e) / décollé(e)", risk:"une entrée d’eau au point de soulèvement lors de pluies battantes"},
  manquant:   {icon:"❌", label:"Manquant(e)", risk:"une zone non protégée, exposée directement aux intempéries"},
  malfixe:    {icon:"🔩", label:"Mal fixé(e)", risk:"un risque de chute de l’élément et une perte d’étanchéité au point de fixation"},
  corrode:    {icon:"🟤", label:"Corrodé(e) / rouillé(e)", risk:"une perte progressive d’étanchéité de l’élément concerné"},
  perce:      {icon:"🕳️", label:"Trou / percé(e)", risk:"un passage d’eau direct au niveau de la perforation"},
  eau:        {icon:"💧", label:"Trace d’eau / fuite", risk:"une aggravation de l’humidité dans les matériaux environnants si la source n’est pas traitée"},
  mousse:     {icon:"🌿", label:"Mousse / salissure / bouché", risk:"une rétention d’humidité qui accélère le vieillissement de la couverture"},
  use:        {icon:"🧱", label:"Poreuse(s) / usée(s)", risk:"une absorption d’eau croissante et un vieillissement accéléré du matériau"},
  affaisse:   {icon:"📉", label:"Affaissé(e) / déformé(e)", risk:"une aggravation progressive de la déformation en l’absence d’intervention"},
  ruissellement:{icon:"🌊", label:"Ruissellement", risk:"un dégât des eaux visible si la source n’est pas traitée rapidement"},
  joint:      {icon:"🧱", label:"Joint / mortier dégradé", risk:"une infiltration au niveau du joint dégradé"},
  recouvrement:{icon:"⚠️", label:"Recouvrement insuffisant", risk:"une infiltration lors de pluies battantes"},
  bois_humide:{icon:"💧", label:"Bois humide", risk:"un développement de champignons lignivores qui fragilisent le bois"},
  moisissure: {icon:"🍄", label:"Moisissure", risk:"une dégradation continue du matériau et un risque pour la qualité de l’air"},
  insectes:   {icon:"🐛", label:"Traces d’insectes xylophages", risk:"une propagation de l’attaque aux pièces de bois saines avoisinantes"},
  ventil:     {icon:"🌬️", label:"Ventilation insuffisante / obstruée", risk:"une accumulation d’humidité dans les combles qui favorise la dégradation de la charpente"},
  isolant:    {icon:"📉", label:"Isolant tassé / insuffisant", risk:"une perte de performance thermique de la toiture"},
  instable:   {icon:"⚠️", label:"Élément instable", risk:"un risque de chute pouvant blesser des personnes ou endommager des biens"},
  secu:       {icon:"🔩", label:"Équipement de sécurité absent / non conforme", risk:"un risque accru lors de toute intervention future en toiture"},
  autre:      {icon:"❓", label:"Autre", risk:"une évolution incertaine du désordre constaté"}
};

// Bibliothèque de connaissances "Le saviez-vous ?" (validée, pas improvisée par l'IA à
// chaque génération — voir le cahier des charges brochure). Distincte du champ "risk" de
// ANOMALY_VOCAB (qui sert à la phrase de vigilance personnalisée) : ici on explique le rôle
// général de l'élément et un mécanisme possible, jamais une aggravation certaine.
const DID_YOU_KNOW = {
  casse:      { title:"Un élément endommagé protège moins bien", text:"Un élément de couverture cassé assure moins pleinement sa fonction de protection contre les intempéries. Une exposition prolongée peut favoriser des infiltrations, selon sa position et l’état des éléments environnants." },
  fissure:    { title:"Une fissure peut évoluer avec le temps", text:"Un élément fissuré perd une partie de son étanchéité. Les cycles de gel et de chaleur peuvent, avec le temps, accentuer la fissure existante." },
  deplace:    { title:"Un élément déplacé rompt la continuité de la couverture", text:"Un élément déplacé peut laisser un passage d’eau localisé et, selon les conditions de vent, mérite d’être surveillé." },
  souleve:    { title:"Un soulèvement peut fragiliser l’étanchéité", text:"Un élément soulevé peut laisser l’eau s’infiltrer par en dessous lors de pluies battantes, même si aucune fuite n’est visible en usage courant." },
  manquant:   { title:"Une zone non couverte reste exposée", text:"L’absence d’un élément de couverture laisse la zone concernée directement exposée aux intempéries, sans la protection habituellement assurée." },
  malfixe:    { title:"Une fixation défaillante concerne la tenue de l’élément", text:"Un élément mal fixé peut bouger avec le temps et le vent, avec un risque de perte d’étanchéité au point de fixation." },
  corrode:    { title:"Le rôle de la zinguerie dans la gestion de l’eau", text:"Les éléments de zinguerie assurent l’étanchéité et l’évacuation de l’eau aux points singuliers de la toiture. Leur dégradation progressive peut réduire cette fonction avec le temps." },
  perce:      { title:"Une perforation crée un passage d’eau direct", text:"Un élément percé ne remplit plus sa fonction d’étanchéité au point concerné, avec un passage d’eau possible lors des précipitations." },
  eau:        { title:"Une trace d’humidité mérite d’être suivie", text:"Une trace d’eau peut avoir des origines diverses. Sans identification précise de la source, l’humidité peut continuer à progresser dans les matériaux environnants." },
  mousse:     { title:"Le rôle de l’entretien face aux mousses et lichens", text:"Une accumulation durable de mousses peut favoriser la rétention d’humidité sur certains matériaux de couverture. Avec le temps, cela peut contribuer à leur vieillissement et mérite une surveillance adaptée." },
  use:        { title:"Un matériau poreux absorbe davantage l’eau", text:"Un matériau devenu poreux avec l’âge absorbe davantage d’eau qu’à l’origine, ce qui peut accélérer son vieillissement au fil des saisons." },
  affaisse:   { title:"Une déformation traduit souvent une évolution progressive", text:"Un affaissement constaté résulte généralement d’une évolution progressive. Une surveillance permet de suivre son évolution dans le temps." },
  ruissellement:{ title:"Le rôle des évacuations d’eaux pluviales", text:"Une évacuation d’eau obstruée peut perturber l’écoulement normal des eaux pluviales et favoriser débordements ou ruissellements indésirables." },
  joint:      { title:"Le rôle des joints d’étanchéité", text:"Les joints assurent l’étanchéité aux points singuliers de la toiture (solins, noues, pénétrations). Leur dégradation progressive peut réduire la qualité de l’étanchéité à ces endroits." },
  recouvrement:{ title:"Le recouvrement conditionne l’étanchéité de la couverture", text:"Un recouvrement insuffisant entre éléments peut laisser l’eau s’infiltrer lors de pluies battantes ou poussées par le vent, même sans dommage visible sur les éléments eux-mêmes." },
  bois_humide:{ title:"Le bois humide est plus vulnérable", text:"Un taux d’humidité élevé dans le bois de charpente peut favoriser, avec le temps, le développement de champignons lignivores qui fragilisent progressivement la structure." },
  moisissure: { title:"Une moisissure traduit une humidité persistante", text:"La présence de moisissure traduit généralement une humidité persistante. Sans traitement de la cause, elle peut continuer à se développer." },
  insectes:   { title:"Les insectes xylophages fragilisent le bois", text:"Des traces d’insectes xylophages peuvent, avec le temps, se propager aux pièces de bois saines avoisinantes si elles ne sont pas traitées." },
  ventil:     { title:"Le rôle de la ventilation de toiture", text:"Une ventilation insuffisante peut favoriser l’accumulation d’humidité dans les combles, ce qui peut à terme affecter la charpente et l’isolation." },
  isolant:    { title:"Un isolant tassé perd en performance", text:"Un isolant tassé assure moins bien sa fonction thermique, ce qui peut se traduire par une perte de confort et une hausse de la consommation énergétique." },
  instable:   { title:"Un élément instable présente un risque immédiat", text:"Un élément instable en toiture présente un risque de chute pouvant affecter des personnes ou des biens, et justifie une sécurisation rapide de la zone." },
  secu:       { title:"Le rôle des équipements de sécurité en toiture", text:"Un équipement de sécurité absent ou non conforme augmente le risque lors de toute intervention future sur la toiture." }
};
function pickDidYouKnow(pt){
  if(!pt || !pt.problems || !pt.problems.length) return null;
  for(const pid of pt.problems){ if(DID_YOU_KNOW[pid]) return DID_YOU_KNOW[pid]; }
  return null;
}

const POINT_ANOMALIES = {
  "Couverture et état des tuiles": ["casse","fissure","deplace","souleve","manquant","malfixe","use","mousse","autre"],
  "Éléments de finition et zinguerie": ["casse","deplace","manquant","mousse","eau","joint","corrode","autre"],
  "Étanchéité": ["fissure","souleve","perce","corrode","eau","joint","recouvrement","autre"],
  "Charpente": ["bois_humide","moisissure","fissure","affaisse","insectes","autre"],
  "Isolation et ventilation": ["isolant","ventil","eau","manquant","autre"],
  "Humidité et infiltrations": ["eau","moisissure","ruissellement","affaisse","autre"],
  "État général et sécurité": ["instable","secu","affaisse","autre"],
  "Entretien, mousses et lichens": ["mousse","use","autre"]
};

const EXTENT_OPTIONS = [
  {id:"un", icon:"1️⃣", label:"Un / ponctuel"},
  {id:"plusieurs", icon:"2️⃣", label:"Plusieurs / localisé"},
  {id:"beaucoup", icon:"3️⃣", label:"Beaucoup / plusieurs zones"},
  {id:"general", icon:"🌐", label:"Généralisé"},
  {id:"indetermine", icon:"❓", label:"Non déterminé"}
];
const ZONE_VERSANT_OPTIONS = [
  {id:"avant", icon:"⬆️", label:"Avant"},
  {id:"arriere", icon:"⬇️", label:"Arrière"},
  {id:"gauche", icon:"⬅️", label:"Gauche"},
  {id:"droite", icon:"➡️", label:"Droite"}
];
const ZONE_POSITION_OPTIONS = [
  {id:"bas", icon:"🔽", label:"Bas de toiture"},
  {id:"milieu", icon:"⏺", label:"Milieu"},
  {id:"haut", icon:"🔼", label:"Haut de toiture"}
];
const ETAT_OPTIONS = [
  {id:"Bon état", icon:"🟢", label:"BON"},
  {id:"À surveiller", icon:"🟡", label:"MOYEN"},
  {id:"Défaut constaté", icon:"🔴", label:"MAUVAIS"},
  {id:"Urgent", icon:"⚫", label:"URGENT"},
  {id:"Pas vu", icon:"⚪", label:"PAS VU"},
  {id:"Non présent", icon:"⚪", label:"NON PRÉSENT"}
];
const AUTO_ADVANCE_ETATS = ["Bon état","Pas vu","Non présent"];

const SYNTH_OBS_OPTIONS = [
  "Inspection visuelle sur les zones accessibles.",
  "Accès limité sur certaines zones.",
  "État cohérent avec l’âge du bâtiment.",
  "Plusieurs points de vigilance identifiés.",
  "Aucune anomalie majeure constatée.",
  "Traces d’entretien antérieur visibles.",
  "Signes d’usure liés aux intempéries."
];
const SYNTH_PRECO_OPTIONS = [
  "Devis détaillé à transmettre.",
  "Contrôle complémentaire recommandé.",
  "Entretien préventif conseillé (nettoyage, démoussage).",
  "Intervention rapide recommandée (points urgents).",
  "Suivi périodique conseillé.",
  "Aucune intervention immédiate nécessaire."
];

function freshPoint(){
  return { etat:"Non contrôlé", problems:[], extent:"", zones:[], comment:"", decisionTouched:false, observation:"", decision:"Contrôle complémentaire", pourquoi:"", travaux:"", risque:"", photos:[] };
}

function extentPhrase(extentId){
  switch(extentId){
    case "un": return "Le désordre est ponctuel : un seul élément est concerné.";
    case "plusieurs": return "Le désordre est localisé : plusieurs éléments sont concernés.";
    case "beaucoup": return "Le désordre concerne un nombre important d’éléments, sur plusieurs zones.";
    case "general": return "Le désordre est généralisé à l’ensemble de la zone contrôlée.";
    default: return "";
  }
}
function zonePhrase(zones){
  if(!zones || !zones.length) return "";
  const versantLabels = {avant:"avant",arriere:"arrière",gauche:"gauche",droite:"droite"};
  const positionLabels = {bas:"en partie basse",milieu:"au milieu",haut:"en partie haute"};
  const versants = zones.filter(z=>versantLabels[z]).map(z=>versantLabels[z]);
  const positions = zones.filter(z=>positionLabels[z]).map(z=>positionLabels[z]);
  const parts = [];
  if(versants.length) parts.push("sur le versant "+versants.join(", "));
  if(positions.length) parts.push(positions.join(", "));
  if(!parts.length) return "";
  return "Localisation constatée : "+parts.join(", ")+".";
}
function problemLabels(problemIds){
  return (problemIds||[]).map(id=>ANOMALY_VOCAB[id] ? ANOMALY_VOCAB[id].label.toLowerCase() : id);
}

function reformulatePoint(pointName, p){
  if(p.etat==="Bon état"){
    p.observation = `Aucune anomalie n’a été observée sur cet élément (${pointName.toLowerCase()}) lors du contrôle visuel des zones accessibles.`;
    p.decision = "Conserver";
    p.pourquoi = CONSERVER_JUSTIF;
    p.travaux = "";
    p.risque = "Aucun risque identifié à ce jour, sous réserve du maintien d’un entretien courant.";
    return;
  }
  if(p.etat==="Pas vu"){
    p.observation = "Cette zone n’a pas pu être contrôlée lors de la visite (accès non sécurisé ou élément non visible).";
    p.decision = "Contrôle complémentaire";
    p.pourquoi = "L’accès restreint ne permet pas de confirmer l’état de cette zone.";
    p.travaux = "Prévoir un contrôle complémentaire avec un accès adapté (nacelle, ligne de vie).";
    p.risque = "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite.";
    return;
  }
  if(p.etat==="Non présent"){
    p.observation = "Cet élément n’est pas présent sur cette toiture.";
    p.decision = "Conserver";
    p.pourquoi = "";
    p.travaux = "";
    p.risque = "";
    return;
  }
  if(p.etat==="Non contrôlé"){
    p.observation = ""; p.pourquoi=""; p.travaux=""; p.risque="";
    return;
  }

  // À surveiller / Défaut constaté / Urgent
  const labels = problemLabels(p.problems);
  const sentences = [];
  if(labels.length){
    const cap = labels[0].charAt(0).toUpperCase()+labels[0].slice(1);
    sentences.push(`Le contrôle visuel a permis de constater : ${[cap,...labels.slice(1)].join(", ")}.`);
  } else {
    sentences.push("Une anomalie a été constatée sur cet élément lors du contrôle visuel.");
  }
  const ext = extentPhrase(p.extent);
  if(ext) sentences.push(ext);
  const zone = zonePhrase(p.zones);
  if(zone) sentences.push(zone);
  if(p.comment && p.comment.trim()) sentences.push(`Remarque du technicien : « ${p.comment.trim()} ».`);
  p.observation = sentences.join(" ");

  if(!p.decisionTouched){
    if(p.etat==="Urgent") p.decision = "Réparer";
    else if(p.etat==="Défaut constaté") p.decision = (p.extent==="general"||p.extent==="beaucoup") ? "Remplacer" : "Réparer";
    else p.decision = "Surveiller";
  }

  if(p.etat==="Urgent"){
    p.pourquoi = "Le caractère urgent de ce constat justifie une intervention prioritaire, afin de limiter les conséquences pour le bâtiment et ses occupants.";
  } else if(p.etat==="Défaut constaté"){
    p.pourquoi = (p.extent==="general"||p.extent==="beaucoup")
      ? "L’étendue du désordre ne permet pas une réparation ponctuelle durable ; une intervention plus complète est nécessaire."
      : "Le désordre reste localisé à ce stade ; une reprise ciblée est proportionnée aux constats réalisés lors de cette visite.";
  } else {
    p.pourquoi = "L’anomalie constatée ne présente pas de caractère urgent à ce jour, mais mérite d’être surveillée afin d’anticiper une dégradation.";
  }

  const zoneConcernee = labels.join(", ") || "zone concernée";
  if(p.decision==="Réparer") p.travaux = `Prévoir une réparation ciblée des éléments concernés (${zoneConcernee}).`;
  else if(p.decision==="Remplacer") p.travaux = `Prévoir le remplacement des éléments concernés (${zoneConcernee}).`;
  else if(p.decision==="Surveiller") p.travaux = "Aucune intervention immédiate ; un contrôle est recommandé lors de la prochaine visite d’entretien.";
  else p.travaux = "Prévoir un contrôle complémentaire avant de définir précisément les travaux nécessaires.";

  const riskClauses = [...new Set((p.problems||[]).map(id=>ANOMALY_VOCAB[id]?.risk).filter(Boolean))];
  p.risque = riskClauses.length
    ? `Non traité, ce désordre peut entraîner : ${riskClauses.join(" ; ")}.`
    : "Une évolution du désordre n’est pas exclue si aucune intervention n’est réalisée.";
}

function savePointFieldsFromDOM(){
  if(!state.dossierId) return;
  const d = byId(state.dossierId);
  if(!d) return;
  const pointName = POINTS[state.diagStep-1];
  if(!pointName) return;
  const p = d.diagnostic.points[pointName];
  if(!p) return;
  // Ne flush/reformule que si les champs du diagnostic sont réellement présents dans le DOM
  // (on est sur l'étape diagnostic de CE point) — sinon un change event ailleurs dans l'app
  // (ex. filtre agenda, select devis) écraserait silencieusement le point en cours (bug corrigé).
  const decisionEl = document.getElementById("ptDecision");
  const commentEl = document.getElementById("ptComment");
  const problemsEl = document.getElementById("selProblems");
  const extentEl = document.getElementById("selExtent");
  const versantEl = document.getElementById("selVersant");
  const positionEl = document.getElementById("selPosition");
  if(!decisionEl && !commentEl && !problemsEl && !extentEl && !versantEl && !positionEl) return;
  if(decisionEl) p.decision = decisionEl.value;
  if(commentEl) p.comment = commentEl.value;
  if(problemsEl) p.problems = Array.from(problemsEl.selectedOptions).map(o=>o.value);
  if(extentEl) p.extent = extentEl.value;
  if(versantEl || positionEl){
    const versant = versantEl ? Array.from(versantEl.selectedOptions).map(o=>o.value) : [];
    const position = positionEl ? Array.from(positionEl.selectedOptions).map(o=>o.value) : [];
    p.zones = [...versant, ...position];
  }
  if(p.etat && p.etat!=="Non contrôlé") reformulatePoint(pointName, p);
}
function saveDevisLinesFromDOM(){
  if(!state.dossierId) return;
  const d = byId(state.dossierId);
  if(!d) return;
  const dv = latestDevis(d);
  if(!dv || dv.statut!=="Brouillon") return;
  const rows = document.querySelectorAll(".devis-line-input");
  if(!rows.length) return;
  rows.forEach(inp=>{
    const idx = parseInt(inp.dataset.idx,10);
    const line = dv.lignes[idx];
    if(!line) return;
    if(inp.dataset.field==="designation") line.designation = inp.value;
    else if(inp.dataset.field==="qte") line.qte = parseFloat(inp.value)||0;
    else if(inp.dataset.field==="prixUnitaire") line.prixUnitaireCt = Math.round((parseFloat(inp.value)||0)*100);
    else if(inp.dataset.field==="tva") line.tvaPct = parseFloat(inp.value)||0;
  });
}

function saveSynthFieldsFromDOM(){
  if(!state.dossierId) return;
  const d = byId(state.dossierId);
  if(!d) return;
  const isLast = state.diagStep === POINTS.length+1;
  if(!isLast) return;
  const s = d.diagnostic.synthese;
  const tcEl = document.getElementById("synTypeCouverture");
  if(tcEl) s.typeCouverture = tcEl.value;
  const surfEl = document.getElementById("synSurface");
  if(surfEl) s.surface = surfEl.value;
  const conclEl = document.getElementById("synConclusion");
  if(conclEl) s.conclusion = conclEl.value;
  const obsEl = document.getElementById("synObsSel");
  if(obsEl){
    const chosen = Array.from(obsEl.selectedOptions).map(o=>o.textContent.trim());
    if(chosen.length) s.observations = chosen.join(" ");
  }
  const precoEl = document.getElementById("synPrecoSel");
  if(precoEl){
    const chosen = Array.from(precoEl.selectedOptions).map(o=>o.textContent.trim());
    if(chosen.length) s.preconisations = chosen.join(" ");
  }
}
function freshDiagnostic(){
  const points = {};
  POINTS.forEach(p=>points[p]=freshPoint());
  return {
    points,
    synthese:{ typeCouverture:"Tuiles terre cuite", surface:"", observations:"", preconisations:"", conclusion:"" },
    rapportPret:false,
    rapportPartage:false
  };
}

function claireDiagnostic(){
  const d = freshDiagnostic();
  d.points["Couverture et état des tuiles"] = {
    etat:"Défaut constaté",
    problems:["fissure"],
    observation:"Exemple fictif : trois éléments de couverture fissurés sont signalés sur une zone localisée.",
    decision:"Réparer",
    pourquoi:"Le désordre décrit est localisé. Une reprise ciblée est proposée ; aucun constat documenté ne justifie une rénovation complète de la couverture.",
    travaux:"Remplacer les éléments fissurés identifiés et contrôler les raccords de la zone concernée.",
    risque:"Une tuile fissurée non traitée laisse progressivement passer l’eau vers la charpente et les combles, avec un risque d’infiltration qui s’aggrave à chaque épisode de pluie ou de gel.",
    photos:[{name:"photo-1.jpg"},{name:"photo-2.jpg"}]
  };
  d.points["Étanchéité"] = {
    etat:"Défaut constaté",
    problems:["joint"],
    observation:"Exemple fictif : raccord d’étanchéité à vérifier au droit d’une pénétration.",
    decision:"Contrôle complémentaire",
    pourquoi:"L’origine exacte du passage d’eau doit être confirmée avant de définir la réparation.",
    travaux:"Contrôler le raccord accessible et compléter les observations avant chiffrage.",
    risque:"Sans identification précise de l’origine, l’humidité peut continuer à progresser dans les matériaux et provoquer des dégâts cachés plus importants que la fuite visible.",
    photos:[{name:"photo-1.jpg"}]
  };
  POINTS.forEach(p=>{
    if(p==="Couverture et état des tuiles"||p==="Étanchéité") return;
    d.points[p] = { etat:"Bon état", observation:"", decision:"Conserver", pourquoi:CONSERVER_JUSTIF, travaux:"", risque:"Aucun risque identifié à ce jour, sous réserve du maintien d’un entretien courant.", photos:[] };
  });
  d.synthese = {
    typeCouverture:"Tuiles terre cuite",
    surface:"110",
    observations:"Plusieurs éléments de couverture sont fissurés. Présence de dépôts dans les évacuations d’eaux pluviales. Inspection visuelle des zones accessibles uniquement.",
    preconisations:"Remplacer les éléments endommagés, nettoyer les gouttières et contrôler les raccords d’étanchéité. Prévoir une visite de contrôle après intervention.",
    conclusion:"Travaux recommandés"
  };
  d.rapportPret = true;
  d.rapportPartage = false;
  return d;
}

function marcDiagnostic(){
  const d = freshDiagnostic();
  POINTS.forEach(p=>{
    d.points[p] = { etat:"Bon état", observation:"", decision:"Conserver", pourquoi:CONSERVER_JUSTIF, travaux:"", risque:"Aucun risque identifié à ce jour, sous réserve du maintien d’un entretien courant.", photos:[] };
  });
  d.synthese = {
    typeCouverture:"Tuiles béton",
    surface:"95",
    observations:"Toiture en bon état général après réfection. Aucune anomalie relevée sur les zones accessibles.",
    preconisations:"Prévoir un contrôle périodique dans le cadre du contrat d’entretien souscrit.",
    conclusion:"Bon état général"
  };
  d.rapportPret = true;
  d.rapportPartage = false;
  return d;
}

function seedDossiers(){
  const base = (over)=>Object.assign({
    telephone:"06 00 00 00 00",
    typeBatiment:"Maison individuelle",
    infosGenerales:"Accès à confirmer avec le client avant la visite.",
    notes:[],
    historique:[{date:"12 sept., 01:34", auteur:"Administration", texte:"Demande créée dans la démonstration."}],
    commercialStage:"À contacter",
    montant:0,
    prochaineRelance:null,
    compteRendu:"",
    visiteDate:null,
    diagnostic:freshDiagnostic(),
    devis:[],
    factures:[]
  }, over);

  return [
    base({ id:"TP-1048", client:"Marie Laurent", ville:"Bordeaux", motif:"Infiltration dans les combles", priorite:"Urgente", statut:"Nouvelle", technicien:null, commercial:"Sarah Durand", email:"client1048@example.com", adresse:"12 rue des Tilleuls" }),
    base({ id:"TP-1047", client:"Pierre Dubois", ville:"Mérignac", motif:"Contrôle de couverture", priorite:"Normale", statut:"Nouvelle", technicien:null, commercial:"Lucas Robert", email:"client1047@example.com", adresse:"12 rue des Tilleuls" }),
    base({ id:"TP-1046", client:"Sophie Martin", ville:"Pessac", motif:"Gouttières à vérifier", priorite:"Infiltration signalée", statut:"Nouvelle", technicien:null, commercial:"Sarah Durand", email:"client1046@example.com", adresse:"12 rue des Tilleuls" }),
    base({ id:"TP-1045", client:"Thomas Moreau", ville:"Le Bouscat", motif:"Tuiles déplacées après le vent", priorite:"Urgente", statut:"Planifié", technicien:"Julien Bernard", commercial:"Sarah Durand", email:"client1045@example.com", adresse:"12 rue des Tilleuls", visiteDate:"13 sept.", visiteHeure:"09:00" }),
    base({ id:"TP-1044", client:"Camille Rousseau", ville:"Bordeaux", motif:"Bilan avant travaux", priorite:"Normale", statut:"Planifié", technicien:"Léa Petit", commercial:"Lucas Robert", email:"client1044@example.com", adresse:"12 rue des Tilleuls", visiteDate:"13 sept.", visiteHeure:"14:00" }),
    base({ id:"TP-1043", client:"Antoine Garnier", ville:"Talence", motif:"Contrôle annuel de toiture", priorite:"Normale", statut:"Planifié", technicien:"Julien Bernard", commercial:"Sarah Durand", email:"client1043@example.com", adresse:"12 rue des Tilleuls", visiteDate:"14 sept.", visiteHeure:"10:30" }),
    base({ id:"TP-1042", client:"Claire Fontaine", ville:"Bordeaux", motif:"Traces d’humidité sous rampant", priorite:"Normale", statut:"Rapport prêt", technicien:"Julien Bernard", commercial:"Sarah Durand", email:"client1042@example.com", adresse:"12 rue des Tilleuls", visiteDate:"10 sept.", visiteHeure:"09:00", commercialStage:"Devis envoyé", montant:12400, prochaineRelance:"11 sept.", diagnostic:claireDiagnostic() }),
    base({ id:"TP-1041", client:"Marc Lefèvre", ville:"Arcachon", motif:"Réfection de la couverture", priorite:"Normale", statut:"Rapport prêt", technicien:"Léa Petit", commercial:"Lucas Robert", email:"client1041@example.com", adresse:"12 rue des Tilleuls", visiteDate:"9 sept.", visiteHeure:"14:00", commercialStage:"Gagné", montant:18600, diagnostic:marcDiagnostic() }),
  ];
}

const CONTRACTS = [
  { client:"Marc Lefèvre", ville:"Arcachon", prestations:"Contrôle périodique, Nettoyage", frequence:"Tous les 12 mois", prochaineVisite:"12 oct.", statut:"Actif", montantAnnuel:290, technicien:"Léa Petit", commercial:"Lucas Robert", dossierId:"TP-1041" }
];

const PARRAINAGES = [
  { parrain:"Marc Lefèvre", date:"9 sept.", clientApporte:"Pierre Dubois", affaire:"À contacter", recompense:80, suivi:"En attente", commercial:"Lucas Robert", dossierId:"TP-1047" }
];

// ---------- Devis / Factures / Paiements (simulé, voir docs/erp/WORKFLOWS.md) ----------
// Montants stockés en centimes (entiers) pour éviter le float naïf (spec §91).
const SERVICE_CATALOG = [
  { code:"COUV-TUILE", label:"Remplacement d’éléments de couverture", prixUnitaireCt:4500, tvaPct:10, unite:"u" },
  { code:"COUV-FAIT", label:"Reprise de faîtage", prixUnitaireCt:38000, tvaPct:10, unite:"ml" },
  { code:"ZING-GOUT", label:"Nettoyage et remise en état des gouttières", prixUnitaireCt:18000, tvaPct:10, unite:"forfait" },
  { code:"ETAN-JOINT", label:"Reprise d’étanchéité (solin / noue)", prixUnitaireCt:32000, tvaPct:10, unite:"forfait" },
  { code:"COUV-DEMOUSS", label:"Traitement anti-mousse de la couverture", prixUnitaireCt:22000, tvaPct:10, unite:"forfait" },
  { code:"CHAR-REP", label:"Réparation localisée de charpente", prixUnitaireCt:65000, tvaPct:10, unite:"forfait" },
  { code:"COUV-REFECTION", label:"Réfection complète de la couverture", prixUnitaireCt:850000, tvaPct:10, unite:"forfait" },
  { code:"CONTROLE", label:"Visite de contrôle périodique", prixUnitaireCt:9000, tvaPct:20, unite:"forfait" }
];
function fmtEuros(ct){ return ((ct||0)/100).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"; }
function freshDevisLine(over){ return Object.assign({ designation:"", qte:1, prixUnitaireCt:0, tvaPct:10 }, over||{}); }
function lineTotalHTct(l){ return Math.round((l.qte||0) * (l.prixUnitaireCt||0)); }
function devisTotals(devis){
  let htCt=0, tvaCt=0;
  (devis.lignes||[]).forEach(l=>{
    const ht = lineTotalHTct(l);
    htCt += ht;
    tvaCt += Math.round(ht * (l.tvaPct||0) / 100);
  });
  return { htCt, tvaCt, ttcCt: htCt+tvaCt };
}
function devisStatutCls(s){
  if(s==="Accepté") return "green";
  if(s==="Refusé") return "red";
  if(s==="Envoyé") return "gold";
  return "gray";
}
function nextDevisId(d){ return d.id+"-D"+(d.devis.length+1); }
function nextFactureId(d){ return d.id+"-F"+(d.factures.length+1); }
function latestDevis(d){ return d.devis.length ? d.devis[d.devis.length-1] : null; }
function facturePaidCt(f){
  return (f.paiements||[]).filter(p=>p.mode!=="Virement" || p.virementStatut==="Confirmé").reduce((s,p)=>s+p.montantCt,0);
}
function factureStatutFromPayments(f){
  const paid = facturePaidCt(f);
  if(paid<=0) return f.statut==="Brouillon" ? "Brouillon" : "Envoyée";
  if(paid>=f.montantTtcCt) return "Payée";
  return "Partiellement payée";
}
function factureStatutCls(s){
  if(s==="Payée") return "green";
  if(s==="Partiellement payée") return "gold";
  if(s==="Envoyée") return "blue";
  return "gray";
}

const ROLES = {
  admin:{ label:"Administration", avatar:"AD" },
  tech:{ label:"Technicien · Julien", avatar:"JB" },
  sales:{ label:"Commerciale · Sarah", avatar:"SD" },
  client:{ label:"Cliente · Marie", avatar:"ML" }
};

// ---------- RBAC : matrice de permissions (simulée côté client, voir docs/erp/RBAC_MATRIX.md) ----------
// Chaque rôle est un set de permissions "entite.action". hasPermission() est la seule
// source de vérité ; les fonctions canXxx() existantes deviennent de simples alias
// pour ne rien casser dans le reste du code.
const PERMISSIONS = {
  admin: new Set([
    "client.read.all","client.create","client.update",
    "lead.assign","appointment.create","appointment.update",
    "diagnostic.read.all","diagnostic.execute",
    "opportunity.read.all","opportunity.update",
    "quote.create","quote.update","quote.send",
    "invoice.create","payment.register",
    "job.read.all","job.update",
    "referral.create","team.manage","analytics.company.read"
  ]),
  sales: new Set([
    "client.read.team","client.create",
    "diagnostic.read.team",
    "opportunity.read.team","opportunity.update",
    "quote.create","quote.update","quote.send",
    "payment.register","job.read.team","referral.create"
  ]),
  tech: new Set([
    "client.read.own","client.create",
    "diagnostic.read.own","diagnostic.execute",
    "payment.register","job.read.own"
  ]),
  client: new Set([
    "client.read.own","diagnostic.read.own"
  ])
};
function hasPermission(perm){
  const set = PERMISSIONS[state.role];
  return !!set && set.has(perm);
}

const NAV = {
  admin:[["overview","Vue d’ensemble"],["dossiers","Dossiers clients"],["agenda","Agenda d’équipe"],["entretiens","Entretiens"],["diagnostics","Diagnostics"],["commercial","Suivi commercial"],["parrainages","Parrainages"],["equipe","Équipe & accès"],["connexions","Connexions"],["client-preview","Aperçu espace client"]],
  tech:[["overview","Vue d’ensemble"],["dossiers","Dossiers clients"],["agenda","Agenda d’équipe"],["entretiens","Entretiens"],["diagnostics","Diagnostics"]],
  sales:[["overview","Vue d’ensemble"],["dossiers","Dossiers clients"],["agenda","Agenda d’équipe"],["entretiens","Entretiens"],["commercial","Suivi commercial"],["parrainages","Parrainages"]],
  client:[["client","Mon espace client"]]
};

const MONTH_NAMES = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const MONTH_SHORT = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const DOW_LONG = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
const DOW_SHORT = ["Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.","Dim."];
const DOW_MIN = ["L","M","M","J","V","S","D"];
const TODAY_REF = new Date(2026,8,12);

function addDays(date,n){ const d=new Date(date); d.setDate(d.getDate()+n); return d; }
function addMonths(date,n){ const d=new Date(date); const day=d.getDate(); d.setDate(1); d.setMonth(d.getMonth()+n); const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate(); d.setDate(Math.min(day,last)); return d; }
function addYears(date,n){ return addMonths(date,n*12); }
function startOfWeek(date){ const d=new Date(date); const dow=(d.getDay()+6)%7; d.setDate(d.getDate()-dow); return d; }
function startOfMonth(date){ return new Date(date.getFullYear(),date.getMonth(),1); }
function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function sameMonth(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth(); }
function isToday(d){ return sameDay(d, TODAY_REF); }
function parseShortFrDate(str){
  if(!str) return null;
  const parts = str.trim().split(/\s+/);
  if(parts.length<2) return null;
  const day = parseInt(parts[0],10);
  const monthIdx = MONTH_SHORT.indexOf(parts[1]);
  if(isNaN(day) || monthIdx<0) return null;
  return new Date(2026, monthIdx, day);
}
function fmtFullDate(d){ return `${DOW_LONG[(d.getDay()+6)%7]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`; }
function fmtDayMonth(d){ return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`; }
function fmtMonthYear(d){ return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`; }

let DOSSIERS = seedDossiers();

let state = {
  appStage:"splash",
  splashExiting:false,
  role:"admin",
  section:"overview",
  dossierId:null,
  dossierTab:"info",
  diagStep:1,
  agendaMember:"all",
  calendarView:"day",
  calendarDate:new Date(TODAY_REF),
  datePickerOpen:false,
  pickerViewDate:new Date(TODAY_REF),
  kanbanStage:"À contacter",
  modal:null,
  toast:null,
  sidebarOpen:false
};

// ---------- helpers ----------

function priorityBadgeClass(p){
  if(p==="Urgente" || p==="Infiltration signalée" || p==="En retard") return "red";
  return "blue";
}
function statutBadgeClass(s){
  if(s==="Rapport prêt") return "green";
  if(s==="En retard") return "red";
  return "blue";
}
function initials(name){
  return name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
}
function esc(s){
  return String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function byId(id){ return DOSSIERS.find(d=>d.id===id); }

function visibleDossiers(){
  if(state.role==="tech") return DOSSIERS.filter(d=>d.technicien==="Julien Bernard");
  if(state.role==="sales") return DOSSIERS.filter(d=>d.commercial==="Sarah Durand");
  if(state.role==="client") return DOSSIERS.filter(d=>d.client==="Marie Laurent");
  return DOSSIERS;
}
function visibleContracts(){
  if(state.role==="tech") return CONTRACTS.filter(c=>c.technicien==="Julien Bernard");
  if(state.role==="sales") return CONTRACTS.filter(c=>c.commercial==="Sarah Durand");
  return CONTRACTS;
}
function visibleParrainages(){
  if(state.role==="sales") return PARRAINAGES.filter(p=>p.commercial==="Sarah Durand");
  if(state.role==="tech") return [];
  return PARRAINAGES;
}

function canCreateDemande(){ return hasPermission("client.create"); }
function canPlanifierVisite(){ return hasPermission("appointment.create"); }
function canNouveauContrat(){ return state.role==="admin"; }
function canAjouterParrainage(){ return hasPermission("referral.create"); }
function canEditDossier(){ return hasPermission("client.update"); }
function canAffecter(){ return hasPermission("lead.assign"); }
function diagEditable(){ return hasPermission("diagnostic.execute"); }

function stat(label, value, sub){
  return `<div class="stat-card"><div class="stat-value">${esc(value)}</div><div class="stat-label">${esc(label)}</div><div class="stat-sub">${esc(sub)}</div></div>`;
}
function badge(text, cls){ return `<span class="badge ${cls}">${esc(text)}</span>`; }

const POINT_LAYER = {
  "Couverture et état des tuiles":1,
  "Éléments de finition et zinguerie":1,
  "Étanchéité":2,
  "Charpente":3,
  "Isolation et ventilation":4,
  "Humidité et infiltrations":5,
  "État général et sécurité":1,
  "Entretien, mousses et lichens":1
};
const DIAGRAM_LAYERS = [
  {n:1, label:"Couverture", color:"#a8681f"},
  {n:2, label:"Écran de sous-toiture", color:"#4a4f5a"},
  {n:3, label:"Charpente", color:"#8a5a2b"},
  {n:4, label:"Isolation", color:"#d8b45a"},
  {n:5, label:"Plafond", color:"#c7cbd3"}
];

function etatPill(etat){
  if(etat==="Urgent") return badge("Urgent","black");
  if(etat==="Défaut constaté") return badge("Défaut constaté","red");
  if(etat==="À surveiller") return badge("À surveiller","gold");
  if(etat==="Bon état") return badge("Bon état apparent","green");
  if(etat==="Pas vu") return badge("Pas vu","gray");
  if(etat==="Non présent") return badge("Non présent","gray");
  if(etat==="Non accessible") return badge("Non accessible","gray");
  return badge("Non contrôlé","gray");
}
function etatAccentCls(etat){
  if(etat==="Urgent") return "st-black";
  if(etat==="Défaut constaté") return "st-red";
  if(etat==="À surveiller") return "st-gold";
  if(etat==="Bon état") return "st-green";
  return "st-gray";
}

function iconSvg(name, size){
  size = size||18;
  const inner = {
    shield:`<path d="M12 2.5l7.5 3v5.5c0 5-3.2 8.6-7.5 10-4.3-1.4-7.5-5-7.5-10V5.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    warning:`<path d="M12 3.2l9.5 16.6H2.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><line x1="12" y1="9.3" x2="12" y2="14.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17.1" r="1.05" fill="currentColor"/>`,
    house:`<path d="M4 11.2L12 4l8 7.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.3 9.8V19h11.4V9.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><rect x="10.2" y="13" width="3.6" height="6" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
    check:`<path d="M4.5 12.5l4.7 4.7L19.5 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    ruler:`<rect x="3" y="9" width="18" height="6" rx="1" transform="rotate(-25 12 12)" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
    layers:`<path d="M12 3l9 5-9 5-9-5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 13l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`,
    clipboard:`<rect x="5" y="4.5" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8.5" y="3" width="7" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="10.5" x2="16" y2="10.5" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="17.5" x2="13" y2="17.5" stroke="currentColor" stroke-width="1.3"/>`,
    idea:`<path d="M9 18.5h6M9.7 21h4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 2.8a6 6 0 0 0-3.4 10.9c.6.45 1 1.15 1 1.95v.35h4.8v-.35c0-.8.4-1.5 1-1.95A6 6 0 0 0 12 2.8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">${inner[name]||""}</svg>`;
}

function logoMark(size){
  size = size||36;
  return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
    <img src="assets/logo-icon.png" alt="" style="width:100%;height:100%;object-fit:contain">
  </div>`;
}

function roofCutawaySvg(){
  return `<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">
    <polygon points="20,150 260,30 500,150" fill="none" stroke="#8f551f" stroke-width="2"/>
    <polygon points="20,150 260,30 260,150" fill="none" stroke="#8f551f" stroke-width="0"/>
    <polygon points="40,144 260,44 260,144" fill="#c47a3a" opacity=".9"/>
    <polygon points="260,44 480,144 260,144" fill="#a8681f" opacity=".9"/>
    <polygon points="52,148 260,58 260,148" fill="#4a4f5a" opacity=".85"/>
    <polygon points="260,58 468,148 260,148" fill="#4a4f5a" opacity=".65"/>
    <rect x="80" y="148" width="360" height="14" fill="#8a5a2b"/>
    <rect x="90" y="162" width="340" height="16" fill="#d8b45a"/>
    <rect x="90" y="178" width="340" height="10" fill="#c7cbd3"/>
    <circle cx="260" cy="44" r="5" fill="#7a4a1c"/>
  </svg>`;
}

function backcoverArtSvg(){
  return `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:50%;bottom:-30px;transform:translateX(-50%);width:900px;opacity:.07;pointer-events:none">
    <path d="M40 340 L400 80 L760 340" stroke="#d4af37" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M140 300 V400 H660 V300" stroke="#d4af37" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function actionLabelFor(pointName, decision){
  if(decision==="Réparer") return "Réparer — "+pointName;
  if(decision==="Remplacer") return "Remplacer — "+pointName;
  if(decision==="Surveiller") return "Surveiller — "+pointName;
  if(decision==="Contrôle complémentaire") return "Compléter le contrôle — "+pointName;
  return "Traiter — "+pointName;
}

function showToast(msg){
  state.toast = msg;
  render();
  setTimeout(()=>{ state.toast=null; render(); }, 2600);
}

// ---------- render root ----------

function render(){
  const app = document.getElementById("app");
  const oldContent = app.querySelector(".content");
  const savedScrollTop = oldContent ? oldContent.scrollTop : 0;
  const savedScrollY = window.scrollY;
  app.innerHTML = buildApp();
  repaginatePoints();
  numberPdfPages();
  applyPdfScale();
  const newContent = app.querySelector(".content");
  if(newContent) newContent.scrollTop = savedScrollTop;
  window.scrollTo(0, savedScrollY);
}

function scrollContentTop(){
  const c = document.querySelector(".content");
  if(c) c.scrollTop = 0;
  window.scrollTo(0, 0);
}

function numberPdfPages(root){
  root = root || document;
  const nums = root.querySelectorAll(".pdf-page-num");
  if(!nums.length) return;
  nums.forEach((el,i)=>{ el.textContent = `Page ${i+1} / ${nums.length}`; });
}

function loadScriptOnce(src){
  return new Promise((resolve,reject)=>{
    if(document.querySelector(`script[src="${src}"]`)){ resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = ()=>resolve();
    s.onerror = ()=>reject(new Error("Échec de chargement : "+src));
    document.head.appendChild(s);
  });
}

async function generateAndDownloadPdf(d){
  showToast("Génération du PDF…");
  try{
    await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
    await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  } catch(e){
    showToast("Connexion internet requise pour générer le PDF.");
    return;
  }

  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-99999px;top:0;width:794px;background:#fff;z-index:-1";
  host.innerHTML = renderReportDoc(d);
  document.body.appendChild(host);

  const imgs = Array.from(host.querySelectorAll("img"));
  await Promise.all(imgs.map(img=>img.complete ? Promise.resolve() : new Promise(res=>{ img.onload=res; img.onerror=res; })));

  repaginatePoints(host);
  numberPdfPages(host);

  const pages = Array.from(host.querySelectorAll(".pdf-page"));
  try{
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit:"mm", format:"a4", orientation:"portrait" });
    for(let i=0;i<pages.length;i++){
      const canvas = await window.html2canvas(pages[i], { scale:2, useCORS:true, backgroundColor:"#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      if(i>0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, "", "FAST");
    }
    pdf.save(`rapport-diagnostic-${d.id}.pdf`);
    showToast("PDF téléchargé.");
  } catch(e){
    showToast("La génération du PDF a échoué. Réessayez.");
  } finally {
    host.remove();
  }
}

function repaginatePoints(root){
  root = root || document;
  const flow = root.querySelector(".pdf-points-flow");
  if(!flow) return;
  const frame = flow.closest(".pdf-page-frame");
  if(!frame || !frame.parentNode) return;
  const points = Array.from(flow.querySelectorAll(".pdf-point"));
  if(points.length < 2) return;

  const MM = 96/25.4;
  const usable = 297*MM - (15+12)*MM;
  const padRect = flow.getBoundingClientRect();
  const introHeight = points[0].getBoundingClientRect().top - padRect.top;
  const HEAD_ONLY = 60;
  const gap = 14;

  const groups = [];
  let cur = [];
  let used = introHeight;
  points.forEach(pt=>{
    const h = pt.getBoundingClientRect().height + gap;
    if(cur.length && used+h > usable){
      groups.push(cur);
      cur = [];
      used = HEAD_ONLY;
    }
    cur.push(pt);
    used += h;
  });
  if(cur.length) groups.push(cur);
  if(groups.length<=1) return;

  const headNode = flow.querySelector(".pdf-head");
  const h1Node = flow.querySelector(".pdf-h1");
  const subNode = flow.querySelector(".pdf-h1-sub");

  const newFrames = groups.map((group,gi)=>{
    const newFrame = document.createElement("div");
    newFrame.className = "pdf-page-frame";
    const page = document.createElement("div");
    page.className = "pdf-page";
    const pad = document.createElement("div");
    pad.className = "pdf-page-pad";
    if(gi===0){
      pad.appendChild(headNode);
      pad.appendChild(h1Node);
      pad.appendChild(subNode);
    } else {
      pad.insertAdjacentHTML("beforeend", pdfHead());
    }
    group.forEach(card=>pad.appendChild(card));
    page.appendChild(pad);
    newFrame.appendChild(page);
    return newFrame;
  });

  newFrames.forEach(f=>frame.parentNode.insertBefore(f, frame));
  frame.remove();
}

function applyPdfScale(){
  const container = document.querySelector(".pdf-doc");
  if(!container) return;
  const natural = 794;
  const maxW = container.clientWidth;
  const scale = Math.min(1, maxW/natural);
  container.querySelectorAll(".pdf-page-frame").forEach(frame=>{
    const page = frame.querySelector(".pdf-page");
    if(!page) return;
    if(scale>=1){
      page.style.transform = "";
      frame.style.width = "";
      frame.style.height = "";
      return;
    }
    page.style.transform = `scale(${scale})`;
    page.style.transformOrigin = "top left";
    frame.style.width = Math.round(natural*scale)+"px";
    frame.style.height = Math.round(page.offsetHeight*scale)+"px";
  });
}

function buildSplash(){
  return `
  <div class="splash ${state.splashExiting?"exiting":""}">
    <div class="splash-body">
      <img class="splash-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <button class="splash-btn" data-action="open-app">Ouvrir mon appli</button>
    </div>
  </div>`;
}

function buildLogin(){
  const roleOptions = Object.keys(ROLES).map(k=>`<option value="${k}" ${state.role===k?"selected":""}>${esc(ROLES[k].label)}</option>`).join("");
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <h1>Connexion à votre espace</h1>
      <p>Choisissez un profil de démonstration pour continuer.</p>
      <div class="form-field"><label>Profil</label>
        <select id="loginRole">${roleOptions}</select>
      </div>
      <button class="btn-primary login-submit" data-action="do-login">Se connecter</button>
      <div class="login-help">Démo interactive · Aucune donnée réelle · Aucun e-mail envoyé</div>
    </div>
  </div>`;
}

function buildApp(){
  if(state.appStage==="splash") return buildSplash();
  if(state.appStage==="login") return buildLogin();
  if(state.role==="client"){
    return `
      ${buildSidebar()}
      <div class="main">
        ${buildTopbar()}
        <div class="disclaimer">Démo interactive · Données fictives, modifications conservées jusqu’au rechargement · Rôles simulés · Aucun e-mail envoyé</div>
        <div class="content">${renderClientPortal("Marie Laurent")}</div>
      </div>
      ${state.modal ? buildModal() : ""}
      ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
    `;
  }
  return `
    ${buildSidebar()}
    <div class="main">
      ${buildTopbar()}
      <div class="disclaimer">Démo interactive · Données fictives, modifications conservées jusqu’au rechargement · Rôles simulés · Aucun e-mail envoyé</div>
      <div class="content">${buildSection()}</div>
    </div>
    ${state.modal ? buildModal() : ""}
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  `;
}

function buildSidebar(){
  const nav = NAV[state.role];
  return `
  <div class="sidebar-backdrop ${state.sidebarOpen?"open":""}" data-action="close-sidebar"></div>
  <div class="sidebar ${state.sidebarOpen?"open":""}">
    <button class="sidebar-close" data-action="close-sidebar">✕</button>
    <div class="sidebar-logo">
      <div class="logo-icon">
        <img src="assets/logo-icon.png" alt="">
      </div>
      <div>
        <div class="wordmark">MAÎTRE TOITURIER</div>
        <div class="tagline">ESPACE MÉTIER</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${nav.map(([key,label])=>`<button class="nav-btn ${state.section===key?"active":""}" data-action="nav" data-section="${key}">${esc(label)}</button>`).join("")}
    </nav>
    <div class="sidebar-footer">
      <div>Maître Toiturier</div>
      <div>Démonstration métier</div>
      <button class="reset-btn" data-action="reset-demo">Réinitialiser la démo</button>
    </div>
  </div>`;
}

function buildTopbar(){
  const dateStr = "samedi 12 septembre 2026";
  const roleOptions = Object.keys(ROLES).map(k=>`<option value="${k}" ${state.role===k?"selected":""}>${esc(ROLES[k].label)}</option>`).join("");
  return `
  <div class="topbar">
    <div class="topbar-left">
      <button class="hamburger-btn" data-action="toggle-sidebar" aria-label="Menu"><span></span></button>
      <div>
        <div class="ws">Votre espace de travail</div>
        <div class="date">${esc(dateStr)}</div>
      </div>
    </div>
    <div class="topbar-right">
      <div class="demo-tag">Vue démo</div>
      <select class="role-select" id="roleSelect">${roleOptions}</select>
      <div class="avatar">${ROLES[state.role].avatar}</div>
    </div>
  </div>`;
}

function buildSection(){
  if(state.dossierId && state.section==="dossiers"){
    return renderDossierDetail(state.dossierId);
  }
  switch(state.section){
    case "overview": return renderOverview();
    case "dossiers": return renderDossiersList();
    case "agenda": return renderAgenda();
    case "entretiens": return renderEntretiens();
    case "diagnostics": return renderDiagnosticsList();
    case "commercial": return renderCommercialKanban();
    case "parrainages": return renderParrainages();
    case "equipe": return renderEquipe();
    case "connexions": return renderConnexions();
    case "client-preview": return renderClientPortal("Marie Laurent");
    default: return renderOverview();
  }
}

// ---------- Vue d'ensemble ----------

// "Ma journée" (spec section 70) : agrège urgent / aujourd'hui / à venir à partir
// des dossiers visibles par le rôle courant. Intégré en tête de l'accueil plutôt
// que dupliqué en écran séparé (l'accueil jouait déjà ce rôle) — voir docs/erp/PROGRESS.md.
function buildMaJourneeItem(d, tag){
  return `
    <div class="row-item">
      <div class="row-left">
        <div class="row-avatar">${initials(d.client)}</div>
        <div><div class="row-title">${esc(d.client)}</div><div class="row-sub">${esc(tag)} · ${esc(d.ville)}</div></div>
      </div>
      <button class="btn-ghost" data-action="open-dossier" data-id="${d.id}">Ouvrir</button>
    </div>`;
}
function buildMaJourneeCol(title, cls, items){
  return `
    <div class="mj-col mj-${cls}">
      <div class="mj-col-head"><span>${esc(title)}</span><span class="badge ${cls==="urgent"?"red":cls==="today"?"gold":"gray"}">${items.length}</span></div>
      ${items.length===0 ? `<div class="empty-note">Rien ici.</div>` : items.slice(0,4).map(it=>buildMaJourneeItem(it.d, it.tag)).join("")}
    </div>`;
}
function buildMaJournee(list){
  const urgent = [];
  list.filter(d=>d.statut==="Nouvelle" && (d.priorite==="Urgente"||d.priorite==="Infiltration signalée"))
    .forEach(d=>urgent.push({d, tag:"Demande "+d.priorite.toLowerCase()}));
  list.filter(d=>d.prochaineRelance).forEach(d=>urgent.push({d, tag:"Relance en retard"}));

  const today = list.filter(d=>d.visiteDate && parseInt(d.visiteDate,10)===12)
    .map(d=>({d, tag:(d.visiteHeure||"")+" · Visite"}));

  const upcoming = list.filter(d=>d.visiteDate && parseInt(d.visiteDate,10)>12)
    .sort((a,b)=>parseInt(a.visiteDate,10)-parseInt(b.visiteDate,10))
    .map(d=>({d, tag:d.visiteDate+" · Visite"}));

  if(urgent.length===0 && today.length===0 && upcoming.length===0) return "";

  return `
  <div class="card mj-card">
    <div class="card-header"><h3>Ma journée</h3></div>
    <div class="mj-grid">
      ${buildMaJourneeCol("Urgent", "urgent", urgent)}
      ${buildMaJourneeCol("Aujourd’hui", "today", today)}
      ${buildMaJourneeCol("À venir", "upcoming", upcoming)}
    </div>
  </div>`;
}

function renderOverview(){
  const list = visibleDossiers();
  const nouvelles = list.filter(d=>d.statut==="Nouvelle");
  const planifiees = list.filter(d=>d.statut==="Planifié");
  const rapports = list.filter(d=>d.statut==="Rapport prêt");
  const montant = list.filter(d=>d.commercialStage==="Devis envoyé").reduce((s,d)=>s+d.montant,0);
  const relances = list.filter(d=>d.prochaineRelance);
  const prochainesVisites = list.filter(d=>d.visiteDate && parseInt(d.visiteDate,10)>=12).sort((a,b)=>parseInt(a.visiteDate,10)-parseInt(b.visiteDate,10));
  const diagPretCount = list.filter(d=>d.diagnostic.rapportPret).length;
  const partages = list.filter(d=>d.diagnostic.rapportPartage).length;

  const titles = {
    admin:["Le contrôle, à chaque étape.","Votre journée : ce qui est urgent, ce qui est prévu aujourd’hui, ce qui arrive."],
    tech:["Votre journée sur le terrain.","Votre journée : ce qui est urgent, ce qui est prévu aujourd’hui, ce qui arrive."],
    sales:["Vos prochaines affaires.","Votre journée : ce qui est urgent, ce qui est prévu aujourd’hui, ce qui arrive."]
  };
  const [h1,sub] = titles[state.role] || titles.admin;
  const traiterTitle = state.role==="tech" ? "Mes dossiers à diagnostiquer" : "Demandes à traiter";
  const traiterList = state.role==="tech" ? list.filter(d=>d.statut!=="Rapport prêt") : nouvelles;

  return `
  <div class="page-header">
    <div><h1>${esc(h1)}</h1><p>${esc(sub)}</p></div>
    ${canCreateDemande() ? `<button class="btn-primary" data-action="modal-new">+ Nouvelle demande</button>` : ""}
  </div>
  ${buildMaJournee(list)}
  <div class="stat-grid">
    ${stat("Demandes à affecter", nouvelles.length, "À prendre en charge")}
    ${stat("Visites programmées", planifiees.length, "Interventions à venir")}
    ${stat("Rapports prêts", rapports.length, "Diagnostics terminés")}
    ${stat("Affaires en cours", montant.toLocaleString("fr-FR")+" €", "Montant estimé des devis")}
  </div>

  <div class="card">
    <div class="card-header"><h3>${esc(traiterTitle)}</h3><button class="link-btn" data-action="nav" data-section="dossiers">Tous les dossiers</button></div>
    ${traiterList.length===0 ? `<div class="empty-note">Aucun dossier à traiter.</div>` : traiterList.map(d=>`
      <div class="row-item">
        <div class="row-left">
          <div class="row-avatar">${initials(d.client)}</div>
          <div><div class="row-title">${esc(d.client)}</div><div class="row-sub">${esc(d.motif)} · ${esc(d.ville)}</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          ${badge(d.priorite, priorityBadgeClass(d.priorite))}
          <button class="btn-ghost" data-action="open-dossier" data-id="${d.id}">Ouvrir</button>
        </div>
      </div>`).join("")}
  </div>

  <div class="card">
    <div class="card-header"><h3>Relances à effectuer</h3><span class="badge gray">${relances.length} à traiter</span></div>
    ${relances.length===0 ? `<div class="empty-note">Aucune relance en attente.</div>` : relances.map(d=>`
      <div class="row-item">
        <div class="row-left">
          <div class="row-avatar">${initials(d.client)}</div>
          <div><div class="row-title">${esc(d.client)}</div><div class="row-sub">${esc(d.commercial)} · Échéance ${esc(d.prochaineRelance)}</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          ${badge("En retard","red")}
          <button class="btn-ghost" data-action="open-dossier" data-id="${d.id}" data-tab="commercial">Suivre</button>
        </div>
      </div>`).join("")}
  </div>

  <div class="card">
    <div class="card-header"><h3>Prochaines visites</h3><button class="link-btn" data-action="nav" data-section="agenda">Agenda</button></div>
    ${prochainesVisites.length===0 ? `<div class="empty-note">Aucune visite programmée.</div>` : prochainesVisites.map(d=>`
      <div class="row-item">
        <div class="row-left">
          <div class="date-tile">${esc(d.visiteDate.replace(" sept.",""))}<br>SEPT.</div>
          <div><div class="row-title">${esc(d.visiteHeure)} · ${esc(d.client)}</div><div class="row-sub">${esc(d.technicien||"À affecter")} · ${esc(d.ville)}</div></div>
        </div>
        <button class="btn-ghost" data-action="open-dossier" data-id="${d.id}">Voir</button>
      </div>`).join("")}
  </div>

  <div class="card">
    <div class="card-header"><h3>Du diagnostic au client</h3></div>
    <div style="font-size:20px;font-weight:700;margin-bottom:6px">Diagnostics terminés<br><span style="color:var(--gold)">${diagPretCount} / ${list.length}</span></div>
    <p style="color:var(--muted);font-size:13px">${partages} rapport(s) partagé(s) dans l’espace client de démonstration.</p>
    <button class="btn-secondary" data-action="nav" data-section="dossiers">Consulter les dossiers</button>
  </div>
  `;
}

// ---------- Dossiers clients (list) ----------

function renderDossiersList(){
  const list = visibleDossiers();
  return `
  <div class="page-header">
    <div><h1>Dossiers clients</h1><p>Un dossier unique pour les demandes, les visites et les échanges.</p></div>
    ${canCreateDemande() ? `<button class="btn-primary" data-action="modal-new">+ Nouvelle demande</button>` : ""}
  </div>
  <div class="filters-row">
    <input type="text" placeholder="Rechercher un client, une ville, un dossier…" disabled>
    <select disabled><option>Tous les statuts</option><option>Nouvelle</option><option>Planifié</option><option>En cours</option><option>Rapport prêt</option></select>
    <select disabled><option>Toute l’équipe</option><option>Julien Bernard</option><option>Léa Petit</option><option>Sarah Durand</option><option>Lucas Robert</option></select>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Client / dossier</th><th>Demande</th><th>Priorité</th><th>Statut</th><th>Équipe</th><th></th></tr></thead>
      <tbody>
      ${list.map(d=>`
        <tr>
          <td><div class="row-title">${esc(d.client)}</div><div class="row-sub">${esc(d.id)} · ${esc(d.ville)}</div></td>
          <td>${esc(d.motif)}</td>
          <td>${badge(d.priorite, priorityBadgeClass(d.priorite))}</td>
          <td>${badge(d.statut, statutBadgeClass(d.statut))}</td>
          <td><div class="row-sub">${esc(d.technicien||"Technicien à affecter")}</div><div class="row-sub">${esc(d.commercial)}</div></td>
          <td><button class="btn-ghost" data-action="open-dossier" data-id="${d.id}">Ouvrir</button></td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>

  <div class="mobile-list">
    ${list.map(d=>`
      <div class="list-card" data-action="open-dossier" data-id="${d.id}">
        <div class="lc-top">
          <div><div class="lc-name">${esc(d.client)}</div><div class="lc-sub">${esc(d.id)} · ${esc(d.ville)}</div></div>
          ${badge(d.priorite, priorityBadgeClass(d.priorite))}
        </div>
        <div class="lc-motif">${esc(d.motif)}</div>
        <div class="lc-foot">
          <div><div class="row-sub">${esc(d.technicien||"Technicien à affecter")}</div><div class="row-sub">${esc(d.commercial)}</div></div>
          ${badge(d.statut, statutBadgeClass(d.statut))}
        </div>
      </div>`).join("")}
  </div>`;
}

// ---------- Dossier detail ----------

function tabsForRole(){
  if(state.role==="tech") return [["info","Dossier & historique"],["diagnostic","Diagnostic terrain"],["rapport","Rapport PDF"]];
  const tabs = [["info","Dossier & historique"],["diagnostic","Diagnostic terrain"],["rapport","Rapport PDF"],["commercial","Suivi commercial"]];
  if(hasPermission("quote.create")) tabs.push(["devis","Devis & factures"]);
  return tabs;
}

function renderDossierDetail(id){
  const d = byId(id);
  if(!d) return renderDossiersList();
  const tabs = tabsForRole();
  if(!tabs.find(t=>t[0]===state.dossierTab)) state.dossierTab = "info";

  let body = "";
  if(state.dossierTab==="info") body = renderDossierInfo(d);
  else if(state.dossierTab==="diagnostic") body = renderDossierDiagnostic(d);
  else if(state.dossierTab==="rapport") body = renderDossierRapport(d);
  else if(state.dossierTab==="commercial") body = renderDossierCommercial(d);
  else if(state.dossierTab==="devis") body = renderDossierDevis(d);

  if(state.dossierTab==="diagnostic" && diagEditable()){
    return `
    <div class="diag-focus-bar">
      <button class="breadcrumb" data-action="dossier-tab" data-tab="info">← Quitter le diagnostic</button>
      <div class="diag-focus-title">${esc(d.client)} · ${esc(d.id)}</div>
    </div>
    ${body}
    `;
  }

  return `
  <button class="breadcrumb" data-action="nav" data-section="dossiers">← Dossiers / ${esc(d.id)}</button>
  <div class="page-header">
    <div>
      <h1>${esc(d.client)}</h1>
      <p>${esc(d.motif)} · ${esc(d.ville)}</p>
    </div>
    <div style="display:flex;gap:8px">
      ${badge(d.priorite, priorityBadgeClass(d.priorite))}
      ${badge(d.statut, statutBadgeClass(d.statut))}
    </div>
  </div>
  <div class="tabs">
    ${tabs.map(([k,l])=>`<button class="tab-btn ${state.dossierTab===k?"active":""}" data-action="dossier-tab" data-tab="${k}">${esc(l)}</button>`).join("")}
  </div>
  ${body}
  `;
}

function renderDossierInfo(d){
  return `
  <div class="card">
    <div class="card-header"><h3>Coordonnées et demande</h3>${canEditDossier()?`<button class="btn-secondary btn-sm" data-action="modal-edit" data-id="${d.id}">Modifier</button>`:""}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
      <div><div class="row-sub">Client</div><div>${esc(d.client)}</div></div>
      <div><div class="row-sub">Téléphone</div><div>${esc(d.telephone)}</div></div>
      <div><div class="row-sub">E-mail</div><div>${esc(d.email)}</div></div>
      <div><div class="row-sub">Adresse</div><div>${esc(d.adresse)}, ${esc(d.ville)}</div></div>
      <div><div class="row-sub">Type de bâtiment</div><div>${esc(d.typeBatiment)}</div></div>
      <div><div class="row-sub">Priorité</div><div>${esc(d.priorite)}</div></div>
      <div style="grid-column:1/-1"><div class="row-sub">Informations générales</div><div>${esc(d.infosGenerales)}</div></div>
      <div style="grid-column:1/-1"><div class="row-sub">Motif</div><div>${esc(d.motif)}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><h3>Notes internes</h3><span class="badge gray">Équipe uniquement</span></div>
    ${d.notes.map(n=>`<div class="row-item"><div><div class="row-sub">${esc(n.date)}</div><div>${esc(n.texte)}</div></div></div>`).join("")}
    <div class="form-field" style="margin-top:${d.notes.length?"14px":"0"}">
      <textarea id="noteInput" placeholder="Informations utiles pour la prochaine intervention…"></textarea>
    </div>
    <button class="btn-secondary btn-sm" data-action="add-note" data-id="${d.id}">Ajouter la note</button>
  </div>

  <div class="card">
    <div class="card-header"><h3>Affectation &amp; rendez-vous</h3>${canAffecter()?`<button class="btn-secondary btn-sm" data-action="modal-affect" data-id="${d.id}">Affecter / planifier</button>`:""}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:13px">
      <div><div class="row-sub">Technicien</div><div>${esc(d.technicien||"À affecter")}</div></div>
      <div><div class="row-sub">Commercial</div><div>${esc(d.commercial||"À affecter")}</div></div>
      <div><div class="row-sub">Visite</div><div>${d.visiteDate?esc(d.visiteDate+" · "+d.visiteHeure):"À programmer"}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><h3>Historique du dossier</h3></div>
    ${d.historique.map(h=>`<div class="row-item"><div><div class="row-sub">${esc(h.date)} · ${esc(h.auteur)}</div><div>${esc(h.texte)}</div></div></div>`).join("")}
  </div>

  <div class="card">
    <div class="card-header"><h3>Historique de la toiture</h3></div>
    ${d.diagnostic.rapportPret ? `
      <div class="row-item">
        <div><div class="row-title">Diagnostic du ${esc(d.visiteDate)}</div><div class="row-sub">Version 1 · ${esc(d.technicien)} · ${Object.values(d.diagnostic.points).reduce((s,p)=>s+p.photos.length,0)} photo(s)</div></div>
        <div style="display:flex;align-items:center;gap:10px">
          ${badge(d.diagnostic.rapportPartage?"Partagé (démo)":"Interne", d.diagnostic.rapportPartage?"green":"gray")}
          <button class="btn-ghost" data-action="dossier-tab" data-tab="rapport">Télécharger</button>
        </div>
      </div>` : `<div class="empty-note">0 rapport(s) conservé(s). Les rapports validés et leurs photos seront conservés ici au fil des visites.</div>`}
  </div>
  `;
}

function etatBtnCls(etatId){ return "etat-"+etatId.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zA-Z]/g,"").toLowerCase(); }

function renderDossierDiagnostic(d){
  if(!diagEditable()){
    return `<div class="card"><div class="empty-note">Le diagnostic est renseigné par le technicien affecté ou l’administration.</div></div>`;
  }
  const step = state.diagStep;
  const isLast = step === POINTS.length + 1;
  const controlled = POINTS.filter(p=>d.diagnostic.points[p].etat!=="Non contrôlé").length;

  const stepsNav = `
    <div class="diag-steps">
      ${POINTS.map((p,i)=>`<button class="diag-step-btn ${step===i+1?"active":d.diagnostic.points[p].etat!=="Non contrôlé"?"done":""}" data-action="diag-step" data-step="${i+1}">${i+1}</button>`).join("")}
      <button class="diag-step-btn ${isLast?"active":""}" data-action="diag-step" data-step="${POINTS.length+1}">Synthèse</button>
    </div>`;

  if(isLast){
    const s = d.diagnostic.synthese;
    return `
    <div class="diag-progress">POINT ${POINTS.length+1} SUR ${POINTS.length+1} · ${controlled} / ${POINTS.length} contrôlés</div>
    ${stepsNav}
    <div class="card">
      <div class="point-title">Synthèse</div>
      <div class="point-sub">Assemble les états et observations saisis. Aucune analyse IA des photos.</div>
      <div class="form-field"><label>Type de couverture</label>
        <select id="synTypeCouverture">
          ${["Tuiles terre cuite","Tuiles béton","Ardoises","Bac acier","Toiture terrasse","Autre"].map(o=>`<option ${s.typeCouverture===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </div>
      <div class="form-field"><label>Surface estimée (m²)</label><input type="number" id="synSurface" value="${esc(s.surface)}"></div>
      <button class="btn-secondary btn-sm" data-action="diag-generate" data-id="${d.id}">Préparer la synthèse des constats</button>
      <div class="form-help">Assemble les états et observations saisis. Aucune analyse IA des photos.</div>
      <div class="form-field" style="margin-top:14px">
        <label>Observations générales <span class="cascade-hint">plusieurs choix possibles</span></label>
        <select id="synObsSel" multiple size="${Math.min(6,SYNTH_OBS_OPTIONS.length)}">
          ${SYNTH_OBS_OPTIONS.map(t=>`<option ${s.observations && s.observations.includes(t)?"selected":""}>${esc(t)}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Préconisations de travaux <span class="cascade-hint">plusieurs choix possibles</span></label>
        <select id="synPrecoSel" multiple size="${Math.min(6,SYNTH_PRECO_OPTIONS.length)}">
          ${SYNTH_PRECO_OPTIONS.map(t=>`<option ${s.preconisations && s.preconisations.includes(t)?"selected":""}>${esc(t)}</option>`).join("")}
        </select>
      </div>
      <div class="form-field"><label>Conclusion et niveau d’urgence</label>
        <select id="synConclusion">
          ${["Bon état général","À surveiller","Travaux recommandés","Intervention urgente"].map(o=>`<option ${s.conclusion===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </div>
      <div class="form-help">Le technicien valide ses constats et recommandations avant de générer le rapport.</div>
      <div class="modal-actions"><button class="btn-primary" data-action="diag-finish" data-id="${d.id}">Valider et générer le rapport</button></div>
    </div>`;
  }

  const pointName = POINTS[step-1];
  const p = d.diagnostic.points[pointName];
  const showCascade = p.etat && p.etat!=="Non contrôlé" && !AUTO_ADVANCE_ETATS.includes(p.etat);
  const anomalyIds = POINT_ANOMALIES[pointName] || [];
  const problems = p.problems || [];
  const zones = p.zones || [];

  return `
  <div class="diag-progress">POINT ${step} SUR ${POINTS.length} · ${controlled} / ${POINTS.length} contrôlés</div>
  ${stepsNav}
  <div class="card">
    <div class="point-title">${esc(pointName)}</div>
    <div class="point-sub">Sélectionnez l’état constaté, complétez si nécessaire, puis appuyez sur Suivant.</div>

    <div class="etat-btn-grid">
      ${ETAT_OPTIONS.map(o=>`
        <button type="button" class="etat-btn ${etatBtnCls(o.id)} ${p.etat===o.id?"active":""}" data-action="pt-etat" data-id="${d.id}" data-step="${step}" data-val="${esc(o.id)}">
          <span class="etat-btn-icon">${o.icon}</span><span class="etat-btn-label">${o.label}</span>
        </button>`).join("")}
    </div>

    ${showCascade ? `
    <div class="diag-cascade">
      <div class="form-field">
        <label>1. Quel problème ? <span class="cascade-hint">plusieurs choix possibles</span></label>
        <select id="selProblems" multiple size="${Math.min(6, anomalyIds.length)}">
          ${anomalyIds.map(id=>{
            const a = ANOMALY_VOCAB[id];
            return `<option value="${id}" ${problems.includes(id)?"selected":""}>${a.icon} ${esc(a.label)}</option>`;
          }).join("")}
        </select>
      </div>

      <div class="form-field">
        <label>2. Combien / étendue ?</label>
        <select id="selExtent" multiple size="${EXTENT_OPTIONS.length}">
          ${EXTENT_OPTIONS.map(o=>`<option value="${o.id}" ${p.extent===o.id?"selected":""}>${o.icon} ${esc(o.label)}</option>`).join("")}
        </select>
      </div>

      <div class="form-field">
        <label>3. Où — versant ? <span class="cascade-hint">plusieurs choix possibles</span></label>
        <select id="selVersant" multiple size="${ZONE_VERSANT_OPTIONS.length}">
          ${ZONE_VERSANT_OPTIONS.map(o=>`<option value="${o.id}" ${zones.includes(o.id)?"selected":""}>${o.icon} ${esc(o.label)}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Où — position ? <span class="cascade-hint">plusieurs choix possibles</span></label>
        <select id="selPosition" multiple size="${ZONE_POSITION_OPTIONS.length}">
          ${ZONE_POSITION_OPTIONS.map(o=>`<option value="${o.id}" ${zones.includes(o.id)?"selected":""}>${o.icon} ${esc(o.label)}</option>`).join("")}
        </select>
      </div>

      <div class="form-field">
        <label>Décision proposée <span class="cascade-hint">modifiable</span></label>
        <select id="ptDecision">
          ${["Conserver","Surveiller","Réparer","Remplacer","Contrôle complémentaire"].map(o=>`<option ${p.decision===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </div>

      <div class="form-field">
        <label>5. Commentaire facultatif</label>
        <textarea id="ptComment" placeholder="À préciser au clavier si besoin (facultatif)…">${esc(p.comment||"")}</textarea>
      </div>
    </div>
    ` : ""}

    <div class="cascade-label" style="margin-top:${showCascade?"4":"16"}px">${showCascade?"6":"2"}. Photo</div>
    <div class="row-sub" style="margin-bottom:10px">${p.photos.length} / 24</div>
    ${p.photos.length ? `<div class="photo-grid">
      ${p.photos.map((ph,i)=>`
        <div class="photo-thumb">
          ${ph.dataUrl ? `<img src="${ph.dataUrl}" alt="">` : `<div class="photo-placeholder">🖼</div>`}
          <button class="photo-remove" data-action="remove-photo" data-id="${d.id}" data-step="${step}" data-idx="${i}">✕</button>
        </div>`).join("")}
    </div>` : ""}
    <input type="file" id="photoGalleryInput" accept="image/*" multiple style="display:none" data-id="${d.id}" data-step="${step}">
    <input type="file" id="photoCameraInput" accept="image/*" capture="environment" style="display:none" data-id="${d.id}" data-step="${step}">
    <div style="display:flex;gap:10px">
      <button class="btn-secondary btn-sm" style="flex:1" data-action="trigger-file" data-target="photoGalleryInput">Ajouter depuis la galerie</button>
      <button class="btn-secondary btn-sm" style="flex:1" data-action="trigger-file" data-target="photoCameraInput">Prendre une photo</button>
    </div>
    <div class="form-help" style="margin-top:8px">JPG, PNG, WebP · 10 Mo par photo · 24 par visite</div>

    <div class="modal-actions">
      <button class="btn-secondary" data-action="diag-save-point" data-id="${d.id}" data-step="${step}">Enregistrer le brouillon</button>
      <button class="btn-primary" data-action="diag-next" data-id="${d.id}" data-step="${step}">Suivant →</button>
    </div>
  </div>`;
}

function pdfHead(){
  return `<div class="pdf-head">${logoMark(24)}<div class="pdf-head-name">Maître Toiturier</div><div class="pdf-head-tag">Rapport de diagnostic</div><div class="pdf-page-num"></div></div>`;
}

function pdfPointCard(p, i, d){
  const pt = d.diagnostic.points[p];
  const photo = pt.photos.find(ph=>ph.dataUrl);
  const dyk = pickDidYouKnow(pt);
  return `
  <div class="pdf-point ${etatAccentCls(pt.etat)}">
    <div class="pdf-point-photo">
      ${photo?`<img src="${photo.dataUrl}" alt="">`:`<div class="pdf-point-photo-ph">${iconSvg("house",26)}<span>Photo à ajouter</span></div>`}
      <div class="pdf-point-photo-tag"><span class="pdf-point-num">${i+1}</span></div>
    </div>
    <div class="pdf-point-content">
      <div class="pdf-point-head">
        <div class="pdf-point-title">${esc(p)}</div>
        ${etatPill(pt.etat)}
      </div>
      <div class="pdf-point-block">
        <span class="pdf-point-label">Notre observation</span>
        <p>${pt.observation?esc(pt.observation):"Non renseignée."}</p>
      </div>
      ${dyk?`<div class="pdf-dyk"><div class="pdf-dyk-head">${iconSvg("idea",14)}<span>Le saviez-vous ?</span></div><p>${esc(dyk.text)}</p></div>`:""}
      <div class="pdf-point-block">
        <span class="pdf-point-label">Décision</span>
        <p><b>${esc(pt.decision)}</b>${pt.pourquoi?" — "+esc(pt.pourquoi):""}</p>
      </div>
      ${pt.travaux?`<div class="pdf-point-block"><span class="pdf-point-label">Travaux proposés</span><p>${esc(pt.travaux)}</p></div>`:""}
      ${pt.risque?`<div class="pdf-risk"><b>${iconSvg("warning",13)} Vigilance</b><span>${esc(pt.risque)}</span></div>`:""}
    </div>
  </div>`;
}

function buildClosingSummary(d){
  const s = d.diagnostic.synthese;
  const flagged = POINTS.filter(p=>["Défaut constaté","À surveiller","Urgent"].includes(d.diagnostic.points[p].etat));
  const urgent = POINTS.filter(p=>d.diagnostic.points[p].etat==="Urgent").length;
  const controlled = POINTS.filter(p=>d.diagnostic.points[p].etat!=="Non contrôlé").length;
  let opening;
  if(flagged.length===0){
    opening = `Cette visite confirme un état général satisfaisant de la toiture de ${d.client}, sur l’ensemble des ${controlled} zones inspectées.`;
  } else if(urgent>0){
    opening = `Cette visite a permis d’identifier ${flagged.length} point${flagged.length>1?"s":""} nécessitant une intervention sur la toiture de ${d.client}, dont ${urgent} à traiter en priorité.`;
  } else {
    opening = `Cette visite a permis d’identifier ${flagged.length} point${flagged.length>1?"s":""} de vigilance sur les ${controlled} zones inspectées de la toiture de ${d.client}.`;
  }
  const closing = s.preconisations || "Notre équipe reste à votre disposition pour toute question complémentaire sur ces constats.";
  return [opening, s.observations, closing].filter(Boolean).join(" ");
}

function renderReportDoc(d){
  const s = d.diagnostic.synthese;
  const controlledPoints = POINTS.filter(p=>d.diagnostic.points[p].etat!=="Non contrôlé");
  const flaggedPoints = POINTS.filter(p=>["Défaut constaté","À surveiller","Urgent"].includes(d.diagnostic.points[p].etat));
  const conclusionCls = s.conclusion==="Bon état général" ? "green" : s.conclusion==="À surveiller" ? "gold" : "red";

  const refLines = flaggedPoints.map(p=>{
    const pt = d.diagnostic.points[p];
    const layer = POINT_LAYER[p] || 1;
    return `<div><b>Repère ${layer}</b> · ${esc(p)}${pt.observation?" — "+esc(pt.observation):""}</div>`;
  }).join("") || `<div>Aucun point signalé pour le moment.</div>`;

  const actionRows = flaggedPoints.map((p,i)=>{
    const pt = d.diagnostic.points[p];
    return `<div class="pdf-action">
      <div class="pdf-action-num">${i+1}</div>
      <div>
        <div class="pdf-action-title">${esc(actionLabelFor(p, pt.decision))}</div>
        <div class="pdf-action-scope">Concerne : ${esc(p)}</div>
        <div class="pdf-action-detail">${esc(pt.travaux || pt.pourquoi || "À définir avec le technicien.")}</div>
      </div>
    </div>`;
  }).join("");
  const finalRowNum = flaggedPoints.length+1;

  const pointsFlowPage = `
    <div class="pdf-page-frame"><div class="pdf-page"><div class="pdf-page-pad pdf-points-flow">
      ${pdfHead()}
      <div class="pdf-overline">Rapport ${esc(d.id)} · ${esc(d.client)}</div>
      <div class="pdf-h1">Points de contrôle</div>
      <div class="pdf-h1-sub">Constat, photo et risques associés pour chaque zone inspectée.</div>
      ${POINTS.map((p,i)=>pdfPointCard(p, i, d)).join("")}
    </div></div></div>`;

  return `
  <div class="pdf-doc">

    <div class="pdf-page-frame"><div class="pdf-page pdf-cover">
      <div class="pdf-cover-photo"><img src="assets/cover-roof.jpg" alt=""></div>
      <div class="pdf-cover-brand">
        ${logoMark(38)}
        <div><div class="pdf-cover-brand-name">Maître Toiturier</div><div class="pdf-cover-brand-tag">Expertise · Conseil · Toitures durables</div></div>
      </div>
      <div class="pdf-cover-panel">
        <div class="pdf-cover-label">Dossier client</div>
        <h1 class="pdf-cover-title">Rapport de diagnostic de toiture</h1>
        <div class="pdf-cover-sub">État des lieux, points de vigilance et actions recommandées, présentés zone par zone avec photos et préconisations.</div>
        <div class="pdf-cover-info">
          <div class="pdf-cover-info-label">Dossier</div><div class="pdf-cover-info-label">Client</div>
          <div class="pdf-cover-info-val">${esc(d.id)}</div><div class="pdf-cover-info-val">${esc(d.client)}</div>
          <div class="pdf-cover-info-label">Date de visite</div><div class="pdf-cover-info-label">Adresse du bien</div>
          <div class="pdf-cover-info-val">${esc(d.visiteDate)}</div><div class="pdf-cover-info-val">${esc(d.adresse)}, ${esc(d.ville)}</div>
          <div class="pdf-cover-info-label">Technicien</div><div class="pdf-cover-info-label">Conclusion</div>
          <div class="pdf-cover-info-val">${esc(d.technicien)}</div><div class="pdf-cover-info-val">${esc(s.conclusion||"À finaliser")}</div>
        </div>
        <div class="pdf-cover-banner">
          <span class="pdf-cover-banner-icon">${iconSvg("shield",18)}</span>
          <div><b>Prévenir les désordres. Prioriser les bonnes actions.</b>Une lecture claire de votre toiture, selon les zones accessibles.</div>
        </div>
      </div>
    </div></div>

    <div class="pdf-page-frame"><div class="pdf-page"><div class="pdf-page-pad">
      ${pdfHead()}
      <div class="pdf-overline">Rapport ${esc(d.id)} · ${esc(d.client)}</div>
      <div class="pdf-h1">Synthèse du diagnostic</div>
      <div class="pdf-h1-sub">${controlledPoints.length} / ${POINTS.length} points contrôlés</div>
      <div class="pdf-stat-row">
        <div class="pdf-stat-card"><div class="pdf-stat-card-top">${iconSvg("layers",14)} Couverture</div><div class="pdf-stat-val">${esc(s.typeCouverture)}</div></div>
        <div class="pdf-stat-card"><div class="pdf-stat-card-top">${iconSvg("ruler",14)} Surface estimée</div><div class="pdf-stat-val">${s.surface?esc(s.surface)+" m²":"—"}</div></div>
        <div class="pdf-stat-card"><div class="pdf-stat-card-top">${iconSvg("clipboard",14)} Conclusion</div>${badge(s.conclusion||"À finaliser", conclusionCls)}</div>
      </div>
      ${s.observations?`<div class="pdf-lead">${esc(s.observations)}</div>`:""}

      <div class="pdf-diagram">
        <div class="pdf-diagram-title">Comprendre les zones contrôlées</div>
        <div class="pdf-diagram-art">${roofCutawaySvg()}</div>
        <div class="pdf-diagram-layers">
          ${DIAGRAM_LAYERS.map(l=>`<div class="pdf-diagram-layer"><div class="pdf-diagram-num">${l.n}</div><div class="pdf-diagram-swatch" style="background:${l.color}"></div>${esc(l.label)}</div>`).join("")}
        </div>
      </div>
      <div class="pdf-refs"><b>Références des observations</b>${refLines}</div>

      <div class="pdf-legend">
        <div class="pdf-legend-item"><span class="pdf-legend-dot" style="background:var(--green)"></span>Bon état général</div>
        <div class="pdf-legend-item"><span class="pdf-legend-dot" style="background:var(--gold)"></span>À surveiller</div>
        <div class="pdf-legend-item"><span class="pdf-legend-dot" style="background:var(--red)"></span>Travaux recommandés</div>
        <div class="pdf-legend-item"><span class="pdf-legend-dot" style="background:var(--red)"></span>Intervention urgente</div>
      </div>
    </div></div></div>

    ${pointsFlowPage}

    <div class="pdf-page-frame"><div class="pdf-page">
      <div class="pdf-page-pad">
        ${pdfHead()}
        <div class="pdf-overline">Rapport ${esc(d.id)} · ${esc(d.client)}</div>
        <div class="pdf-h1">Préconisations &amp; plan d’action</div>
        <div class="pdf-h1-sub">Une intervention proportionnée aux constats, à valider avec le technicien.</div>
        ${s.preconisations?`<div class="pdf-lead">${esc(s.preconisations)}</div>`:""}
        ${actionRows}
        <div class="pdf-action">
          <div class="pdf-action-num">${finalRowNum}</div>
          <div>
            <div class="pdf-action-title">Documenter et suivre</div>
            <div class="pdf-action-scope">Concerne : tous les contrôles</div>
            <div class="pdf-action-detail">Conserver les photos après intervention et signaler les zones restées inaccessibles.</div>
          </div>
        </div>
        <div class="pdf-checklist">
          <div class="pdf-checklist-item"><span class="pdf-checkbox"></span>Demander un devis détaillé</div>
          <div class="pdf-checklist-item"><span class="pdf-checkbox"></span>Prévoir un échange avec le technicien</div>
        </div>

        <div style="font-weight:700;font-size:12.5px;margin:18px 0 10px">Et maintenant ?</div>
        <div class="pdf-steps">
          <div class="pdf-step-card"><div class="pdf-step-num">1</div><div class="pdf-step-title">Devis détaillé</div><div class="pdf-step-text">Un chiffrage précis vous est transmis pour les travaux recommandés dans ce rapport.</div></div>
          <div class="pdf-step-card"><div class="pdf-step-num">2</div><div class="pdf-step-title">Planification</div><div class="pdf-step-text">Une date d’intervention est fixée avec vous selon la nature et l’urgence des travaux.</div></div>
          <div class="pdf-step-card"><div class="pdf-step-num">3</div><div class="pdf-step-title">Suivi après travaux</div><div class="pdf-step-text">Un point de contrôle peut être réalisé pour valider la bonne exécution.</div></div>
        </div>

        <div class="pdf-summary">
          <div class="pdf-overline">En résumé</div>
          <p class="pdf-summary-text">${esc(buildClosingSummary(d))}</p>
          <div class="pdf-summary-sign">— L’équipe Maître Toiturier</div>
        </div>
      </div>
    </div></div>

    <div class="pdf-page-frame"><div class="pdf-page pdf-backcover">
      ${backcoverArtSvg()}
      <div class="pdf-backcover-body">
        ${logoMark(52)}
        <div class="pdf-backcover-name" style="margin-top:16px">Maître Toiturier</div>
        <div class="pdf-backcover-tag">Expertise · Conseil · Toitures durables</div>
        <div class="pdf-backcover-divider"></div>
        <div class="pdf-backcover-thanks">Merci de votre confiance</div>
        <div class="pdf-backcover-sub">Ce rapport vous a été remis à l’issue de la visite diagnostic. Notre équipe reste à votre disposition pour répondre à vos questions et organiser les travaux recommandés.</div>
        <div class="pdf-backcover-contact">
          <b>Nous contacter</b>
          maitretoiturier.fr<br>
          Téléphone : à renseigner<br>
          E-mail : à renseigner
        </div>
      </div>
      <div class="pdf-backcover-legal">Document de démonstration. Contrôle visuel des zones accessibles, selon les observations renseignées par le technicien. Ce rapport n’est pas une certification.</div>
    </div></div>
  </div>`;
}

function renderDossierRapport(d){
  if(!d.diagnostic.rapportPret){
    return `<div class="card" style="text-align:center;padding:40px 20px">
      <h3 style="margin-bottom:6px">Le rapport n’est pas encore prêt</h3>
      <p style="color:var(--muted);margin-bottom:18px">Il sera généré à la validation du diagnostic.</p>
      ${diagEditable()?`<button class="btn-primary" data-action="dossier-tab" data-tab="diagnostic">Remplir le diagnostic</button>`:""}
    </div>`;
  }
  return `
  <div class="card-header" style="margin-bottom:14px">
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-secondary btn-sm" data-action="download-pdf" data-id="${d.id}">Télécharger le PDF</button>
      <button class="btn-primary btn-sm" data-action="modal-send" data-id="${d.id}">Envoyer au client</button>
      <button class="btn-secondary btn-sm" data-action="share-report" data-id="${d.id}">Partager au client (démo)</button>
    </div>
    ${badge(d.diagnostic.rapportPartage?"Partagé (démo)":"Non partagé", d.diagnostic.rapportPartage?"green":"gray")}
  </div>
  <p class="form-help" style="margin-bottom:16px">Le PDF téléchargé comprend une couverture de marque, la synthèse, le plan d’action, les constats argumentés, les photos et la proposition de suite.</p>
  ${renderReportDoc(d)}
  `;
}

function renderDossierCommercial(d){
  return `
  <div class="card">
    <div class="card-header"><h3>Suivi de l’opportunité</h3>${badge(d.commercialStage, d.commercialStage==="Gagné"?"green":d.commercialStage==="Perdu"?"red":"blue")}</div>
    <div class="form-field"><label>Étape commerciale</label>
      <select id="comStage" ${state.role==="tech"?"disabled":""}>
        ${["À contacter","Devis à préparer","Devis envoyé","Gagné","Perdu"].map(o=>`<option ${d.commercialStage===o?"selected":""}>${o}</option>`).join("")}
      </select>
    </div>
    <div class="form-field"><label>Montant estimé du devis (€)</label><input type="number" id="comMontant" value="${d.montant}" ${state.role==="tech"?"disabled":""}></div>
    <div class="form-field"><label>Prochaine relance</label><input type="text" id="comRelance" placeholder="ex. 20 sept." value="${esc(d.prochaineRelance||"")}" ${state.role==="tech"?"disabled":""}></div>
    <div class="form-field"><label>Commercial responsable</label><input type="text" value="${esc(d.commercial||"À affecter")}" disabled></div>
    <div class="form-field"><label>Compte rendu / prochaine action</label><textarea id="comCompteRendu" placeholder="Ex. rappeler le client après réception du devis…">${esc(d.compteRendu)}</textarea></div>
    ${state.role!=="tech" ? `<button class="btn-primary btn-sm" data-action="save-commercial" data-id="${d.id}">Enregistrer le suivi</button>` : ""}
  </div>
  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Diagnostic associé</h3>
    ${badge(d.statut, statutBadgeClass(d.statut))}
    <p style="font-size:13px;margin:10px 0 0">${esc(d.motif)}</p>
    ${d.diagnostic.rapportPret ? `<button class="link-btn" style="margin-top:8px" data-action="dossier-tab" data-tab="rapport">Voir le rapport</button>` : `<p class="form-help">Le rapport apparaîtra après la visite technique.</p>`}
  </div>
  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Historique</h3>
    ${d.historique.map(h=>`<div class="row-item"><div><div class="row-sub">${esc(h.date)} · ${esc(h.auteur)}</div><div>${esc(h.texte)}</div></div></div>`).join("")}
  </div>
  `;
}

// ---------- Devis & factures (simulé, voir docs/erp/WORKFLOWS.md) ----------

function renderFactureCard(d, f){
  f.statut = factureStatutFromPayments(f);
  const editable = f.statut==="Brouillon";
  const paidCt = facturePaidCt(f);
  const resteCt = Math.max(0, f.montantTtcCt - paidCt);
  return `
    <div class="card devis-sub-card">
      <div class="card-header"><h3 style="font-size:13.5px">${esc(f.numero)} · ${esc(f.type)}</h3>${badge(f.statut, factureStatutCls(f.statut))}</div>
      <div class="form-field"><label>Libellé</label><input type="text" id="factureLibelle-${f.id}" value="${esc(f.libelle||"")}" ${editable?"":"disabled"}></div>
      <div class="form-field"><label>Montant TTC (€)</label><input type="number" min="0" step="0.01" id="factureMontant-${f.id}" value="${(f.montantTtcCt/100).toFixed(2)}" ${editable?"":"disabled"}></div>
      <div class="form-field"><label>Échéance</label><input type="text" id="factureEcheance-${f.id}" placeholder="ex. 30 sept." value="${esc(f.echeance||"")}" ${editable?"":"disabled"}></div>
      ${editable ? `
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-secondary btn-sm" data-action="facture-save" data-id="${d.id}" data-fid="${f.id}">Enregistrer</button>
        <button class="btn-primary btn-sm" data-action="facture-send" data-id="${d.id}" data-fid="${f.id}">Envoyer au client</button>
      </div>` : `
      <div class="devis-payments">
        <div class="row-sub" style="margin-bottom:8px">Encaissé ${fmtEuros(paidCt)} sur ${fmtEuros(f.montantTtcCt)}${resteCt>0?` · reste ${fmtEuros(resteCt)}`:""}</div>
        ${f.paiements.map(p=>`
          <div class="row-item">
            <div class="row-sub">${esc(p.date)} · ${esc(p.mode)}${p.mode==="Virement"?" · "+esc(p.virementStatut):""}</div>
            <div style="display:flex;align-items:center;gap:10px">
              ${fmtEuros(p.montantCt)}
              ${p.mode==="Virement" && p.virementStatut==="Annoncé" && hasPermission("payment.register") ? `<button class="btn-ghost btn-sm" data-action="payment-confirm" data-id="${d.id}" data-fid="${f.id}" data-pid="${p.id}">Confirmer réception</button>` : ""}
            </div>
          </div>`).join("")}
        ${resteCt>0 && hasPermission("payment.register") ? `
        <div class="form-field" style="margin-top:10px">
          <label>Nouveau paiement</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <input type="number" min="0" step="0.01" id="paiementMontant-${f.id}" placeholder="Montant €" style="max-width:120px">
            <select id="paiementMode-${f.id}"><option>Espèces</option><option>Chèque</option><option>Virement</option></select>
            <input type="text" id="paiementDate-${f.id}" placeholder="ex. 15 sept." style="max-width:110px">
            <button class="btn-secondary btn-sm" data-action="payment-add" data-id="${d.id}" data-fid="${f.id}">Enregistrer le paiement</button>
          </div>
        </div>` : ""}
      </div>`}
    </div>`;
}

function renderDossierDevis(d){
  const dv = latestDevis(d);
  const canEditDv = !dv || dv.statut==="Brouillon";
  const catalogOptions = SERVICE_CATALOG.map(s=>`<option value="${s.code}">${esc(s.label)} — ${fmtEuros(s.prixUnitaireCt)}</option>`).join("");

  let devisBlock;
  if(!dv){
    devisBlock = `
    <div class="card" style="text-align:center;padding:32px 20px">
      <h3 style="margin-bottom:6px">Aucun devis pour ce dossier</h3>
      <p style="color:var(--muted);margin-bottom:16px">Créez un premier devis à partir des travaux identifiés lors du diagnostic.</p>
      ${hasPermission("quote.create") ? `<button class="btn-primary btn-sm" data-action="devis-new" data-id="${d.id}">+ Nouveau devis</button>` : ""}
    </div>`;
  } else {
    const totals = devisTotals(dv);
    devisBlock = `
      <div class="card">
        <div class="card-header">
          <h3>Devis ${esc(dv.numero)} <span style="color:var(--muted);font-weight:400">v${dv.version}</span></h3>
          ${badge(dv.statut, devisStatutCls(dv.statut))}
        </div>
        <div class="devis-table-wrap">
          <table>
            <thead><tr><th>Désignation</th><th>Qté</th><th>PU HT</th><th>TVA</th><th>Total HT</th><th></th></tr></thead>
            <tbody>
            ${dv.lignes.map((l,i)=>`
              <tr>
                <td>${canEditDv?`<input type="text" class="devis-line-input" data-idx="${i}" data-field="designation" value="${esc(l.designation)}" placeholder="Désignation">`:esc(l.designation)}</td>
                <td style="width:64px">${canEditDv?`<input type="number" min="0" step="1" class="devis-line-input" data-idx="${i}" data-field="qte" value="${l.qte}">`:l.qte}</td>
                <td style="width:100px">${canEditDv?`<input type="number" min="0" step="0.01" class="devis-line-input" data-idx="${i}" data-field="prixUnitaire" value="${(l.prixUnitaireCt/100).toFixed(2)}">`:fmtEuros(l.prixUnitaireCt)}</td>
                <td style="width:64px">${canEditDv?`<input type="number" min="0" step="1" class="devis-line-input" data-idx="${i}" data-field="tva" value="${l.tvaPct}">`:l.tvaPct+"%"}</td>
                <td style="white-space:nowrap">${fmtEuros(lineTotalHTct(l))}</td>
                <td>${canEditDv && dv.lignes.length>1 ?`<button class="btn-ghost btn-sm" data-action="devis-remove-line" data-id="${d.id}" data-idx="${i}">✕</button>`:""}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
        ${canEditDv?`
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0">
          <button class="btn-secondary btn-sm" data-action="devis-add-line" data-id="${d.id}">+ Ligne libre</button>
          <select id="devisCatalogSel" data-id="${d.id}" style="max-width:300px"><option value="">+ Ajouter depuis le catalogue…</option>${catalogOptions}</select>
        </div>`:""}
        <div class="devis-totals">
          <div>Total HT <b>${fmtEuros(totals.htCt)}</b></div>
          <div>TVA <b>${fmtEuros(totals.tvaCt)}</b></div>
          <div>Total TTC <b>${fmtEuros(totals.ttcCt)}</b></div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
          ${canEditDv?`<button class="btn-primary btn-sm" data-action="devis-save" data-id="${d.id}">Enregistrer</button>`:""}
          ${dv.statut==="Brouillon"?`<button class="btn-secondary btn-sm" data-action="devis-send" data-id="${d.id}">Marquer comme envoyé</button>`:""}
          ${dv.statut==="Envoyé"?`<button class="btn-secondary btn-sm" data-action="devis-accept" data-id="${d.id}">Marquer accepté</button><button class="btn-ghost btn-sm" data-action="devis-reject" data-id="${d.id}">Marquer refusé</button>`:""}
          ${dv.statut!=="Brouillon"?`<button class="btn-ghost btn-sm" data-action="devis-new-version" data-id="${d.id}">+ Nouvelle version</button>`:""}
        </div>
        ${dv.dateEnvoi?`<p class="form-help" style="margin-top:8px">Envoyé le ${esc(dv.dateEnvoi)}</p>`:""}
      </div>
      ${d.devis.length>1?`
      <div class="card">
        <h3 style="margin:0 0 10px;font-size:14.5px">Historique des versions</h3>
        ${d.devis.slice(0,-1).reverse().map(v=>`<div class="row-item"><div><div class="row-title">${esc(v.numero)} · v${v.version}</div><div class="row-sub">${fmtEuros(devisTotals(v).ttcCt)}</div></div>${badge(v.statut, devisStatutCls(v.statut))}</div>`).join("")}
      </div>`:""}`;
  }

  const facturesBlock = `
    <div class="card">
      <div class="card-header"><h3>Factures</h3>
        ${dv && dv.statut==="Accepté" ? `<div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-secondary btn-sm" data-action="facture-new" data-id="${d.id}" data-type="Acompte">+ Facture d’acompte</button>
          <button class="btn-secondary btn-sm" data-action="facture-new" data-id="${d.id}" data-type="Solde">+ Facture de solde</button>
        </div>` : ""}
      </div>
      ${!d.factures.length ? `<div class="empty-note">${dv && dv.statut==="Accepté" ? "Aucune facture pour l’instant." : "Le devis doit être accepté avant de pouvoir facturer."}</div>` : d.factures.map(f=>renderFactureCard(d,f)).join("")}
    </div>`;

  return devisBlock + facturesBlock;
}

// ---------- Agenda ----------

function agendaEventsForDate(date){
  const events = [];
  visibleDossiers().forEach(d=>{
    const visiteD = parseShortFrDate(d.visiteDate);
    if(visiteD && sameDay(visiteD, date)){
      events.push({time:d.visiteHeure, label:"Visite", client:d.client, membre:d.technicien, ville:d.ville, id:d.id});
    }
    const relanceD = parseShortFrDate(d.prochaineRelance);
    if(relanceD && sameDay(relanceD, date)){
      events.push({time:null, label:"Relance commerciale", client:d.client, membre:d.commercial, ville:d.ville, id:d.id});
    }
  });
  if(state.agendaMember!=="all"){
    return events.filter(e=>e.membre===state.agendaMember);
  }
  return events.sort((a,b)=>(a.time||"").localeCompare(b.time||""));
}
function agendaEventsForMonth(date){
  const start = startOfMonth(date);
  const end = new Date(date.getFullYear(), date.getMonth()+1, 0);
  const all = [];
  let cur = new Date(start);
  while(cur<=end){ all.push(...agendaEventsForDate(cur).map(e=>({...e,date:new Date(cur)}))); cur = addDays(cur,1); }
  return all;
}

function renderEventCard(e, cls){
  return `<div class="${cls}" data-action="open-dossier" data-id="${e.id}">
    ${e.time?`<div class="ev-time">${esc(e.time)} · ${esc(e.label)}</div>`:`<div class="ev-time">${esc(e.label)}</div>`}
    <div>${esc(e.client)}</div>
    <div class="row-sub">${esc(e.membre||"—")} · ${esc(e.ville)}</div>
  </div>`;
}

function renderCalToolbar(){
  const v = state.calendarView;
  const members = ["Toute l’équipe","Julien Bernard","Léa Petit","Sarah Durand","Lucas Robert"];
  let label = "";
  if(v==="day") label = fmtFullDate(state.calendarDate);
  else if(v==="week"){ const s=startOfWeek(state.calendarDate), en=addDays(s,6); label = `${fmtDayMonth(s)} — ${fmtDayMonth(en)} ${en.getFullYear()}`; }
  else if(v==="month") label = fmtMonthYear(state.calendarDate);
  else label = String(state.calendarDate.getFullYear());

  return `
  <div class="cal-toolbar">
    <div class="cal-view-switch">
      ${[["day","Jour"],["week","Semaine"],["month","Mois"],["year","Année"]].map(([k,l])=>`<button class="cal-view-btn ${v===k?"active":""}" data-action="cal-view" data-view="${k}">${l}</button>`).join("")}
    </div>
    <div class="cal-nav-group">
      <button class="cal-nav-btn" data-action="cal-prev" aria-label="Précédent">←</button>
      <div style="position:relative">
        <button class="cal-date-btn" data-action="toggle-datepicker">${esc(label)}</button>
        ${state.datePickerOpen ? renderDatePicker() : ""}
      </div>
      <button class="cal-nav-btn" data-action="cal-next" aria-label="Suivant">→</button>
    </div>
    <button class="btn-secondary btn-sm cal-today-btn" data-action="cal-today">Aujourd’hui</button>
    <select id="agendaMemberSelect">
      ${members.map(m=>`<option value="${m==="Toute l’équipe"?"all":m}" ${state.agendaMember===(m==="Toute l’équipe"?"all":m)?"selected":""}>${m}</option>`).join("")}
    </select>
  </div>
  ${state.datePickerOpen ? `<div class="sidebar-backdrop open" style="z-index:65" data-action="close-datepicker"></div>` : ""}
  `;
}

function renderDatePicker(){
  const pv = state.pickerViewDate;
  const start = startOfWeek(startOfMonth(pv));
  const cells = [];
  for(let i=0;i<42;i++) cells.push(addDays(start,i));
  return `
  <div class="cal-datepicker" onclick="event.stopPropagation()">
    <div class="cal-datepicker-head">
      <button class="cal-nav-btn" style="width:26px;height:26px" data-action="picker-prev-month">←</button>
      <span>${esc(fmtMonthYear(pv))}</span>
      <button class="cal-nav-btn" style="width:26px;height:26px" data-action="picker-next-month">→</button>
    </div>
    <div class="cal-datepicker-grid">
      ${DOW_MIN.map(d=>`<div class="cal-datepicker-dow">${d}</div>`).join("")}
      ${cells.map(c=>{
        const cls = ["cal-datepicker-day"];
        if(!sameMonth(c,pv)) cls.push("dim");
        if(isToday(c)) cls.push("today");
        if(sameDay(c,state.calendarDate)) cls.push("selected");
        return `<button class="${cls.join(" ")}" data-action="picker-select-day" data-date="${c.getFullYear()}-${c.getMonth()}-${c.getDate()}">${c.getDate()}</button>`;
      }).join("")}
    </div>
  </div>`;
}

function renderCalDayView(){
  const d = state.calendarDate;
  const evs = agendaEventsForDate(d);
  return `
  ${evs.length===0 ? `<div class="empty-note">Aucun événement ce jour-là.</div>` : evs.map(e=>renderEventCard(e,"list-card")).join("")}
  `;
}

function renderCalWeekView(){
  const start = startOfWeek(state.calendarDate);
  const days = Array.from({length:7},(_,i)=>addDays(start,i));
  return `
  <div class="cal-week-grid">
    ${days.map(day=>{
      const evs = agendaEventsForDate(day);
      const dow = (day.getDay()+6)%7;
      return `<div class="cal-week-col ${isToday(day)?"today":""}">
        <h5>${DOW_SHORT[dow]} <b>${day.getDate()}</b></h5>
        ${evs.length===0 ? `<div class="cal-empty">Aucun événement</div>` : evs.map(e=>renderEventCard(e,"cal-event")).join("")}
      </div>`;
    }).join("")}
  </div>`;
}

function renderCalMonthView(){
  const monthDate = state.calendarDate;
  const start = startOfWeek(startOfMonth(monthDate));
  const cells = Array.from({length:42},(_,i)=>addDays(start,i));
  return `
  <div class="cal-month-grid">
    ${DOW_SHORT.map(d=>`<div class="cal-month-dow">${d}</div>`).join("")}
    ${cells.map(c=>{
      const evs = agendaEventsForDate(c);
      const cls = ["cal-month-cell"];
      if(!sameMonth(c,monthDate)) cls.push("dim");
      if(isToday(c)) cls.push("today");
      return `<div class="${cls.join(" ")}" data-action="cal-goto-day" data-date="${c.getFullYear()}-${c.getMonth()}-${c.getDate()}">
        <div class="cmc-num">${c.getDate()}</div>
        ${evs.length ? `<div class="cal-month-dots">${evs.slice(0,4).map(()=>`<div class="cal-month-dot"></div>`).join("")}</div>` : ""}
      </div>`;
    }).join("")}
  </div>`;
}

function renderCalYearView(){
  const year = state.calendarDate.getFullYear();
  return `
  <div class="cal-year-grid">
    ${Array.from({length:12},(_,m)=>{
      const monthDate = new Date(year,m,1);
      const count = agendaEventsForMonth(monthDate).length;
      const isCurrent = sameMonth(monthDate, TODAY_REF);
      return `<div class="cal-year-card ${isCurrent?"current":""}" data-action="cal-goto-month" data-date="${year}-${m}-1">
        <h5>${MONTH_NAMES[m]}</h5>
        <div class="cyc-count">${count ? `<b>${count}</b> événement${count>1?"s":""}` : "Aucun événement"}</div>
      </div>`;
    }).join("")}
  </div>`;
}

function renderAgenda(){
  const v = state.calendarView;
  let body = "";
  if(v==="day") body = renderCalDayView();
  else if(v==="week") body = renderCalWeekView();
  else if(v==="month") body = renderCalMonthView();
  else body = renderCalYearView();

  return `
  <div class="page-header">
    <div><h1>Agenda d’équipe</h1><p>Visites terrain et échéances commerciales, reliées aux dossiers.</p></div>
    ${canPlanifierVisite() ? `<button class="btn-primary" data-action="modal-choose">+ Planifier une visite</button>` : ""}
  </div>
  ${renderCalToolbar()}
  ${body}
  `;
}

// ---------- Entretiens ----------

function renderEntretiens(){
  const contracts = visibleContracts();
  const actifs = contracts.filter(c=>c.statut==="Actif").length;
  const montantAnnuel = contracts.reduce((s,c)=>s+c.montantAnnuel,0);
  return `
  <div class="page-header">
    <div><h1>Contrats d’entretien</h1><p>Conservez le programme prévu et les prochaines visites de chaque toiture.</p></div>
    ${canNouveauContrat() ? `<button class="btn-primary" data-action="modal-info" data-msg="Nouveau contrat">+ Nouveau contrat</button>` : ""}
  </div>
  <div class="stat-grid">
    ${stat("Contrats suivis", contracts.length, "Proposés et en cours")}
    ${stat("Contrats actifs", actifs, "Programme d’entretien")}
    ${stat("Visites à reprogrammer", 0, "Échéances dépassées")}
    ${stat("Montant annuel suivi", montantAnnuel.toLocaleString("fr-FR")+" €", "Indication saisie par l’équipe")}
  </div>
  <div class="card table-wrap">
    ${contracts.length===0 ? `<div class="empty-note">Aucun contrat d’entretien pour les dossiers visibles.</div>` : `
    <table>
      <thead><tr><th>Toiture / client</th><th>Prestations</th><th>Fréquence</th><th>Prochaine visite</th><th>Statut</th><th></th></tr></thead>
      <tbody>
        ${contracts.map(c=>`<tr>
          <td><div class="row-title">${esc(c.client)}</div><div class="row-sub">${esc(c.ville)}</div></td>
          <td>${esc(c.prestations)}</td>
          <td>${esc(c.frequence)}</td>
          <td>${esc(c.prochaineVisite)}</td>
          <td>${badge(c.statut,"green")}</td>
          <td style="display:flex;gap:8px"><button class="btn-ghost" data-action="open-dossier" data-id="${c.dossierId}">Dossier</button><button class="btn-ghost" disabled>Gérer</button></td>
        </tr>`).join("")}
      </tbody>
    </table>`}
  </div>

  <div class="mobile-list">
    ${contracts.length===0 ? `<div class="empty-note">Aucun contrat d’entretien pour les dossiers visibles.</div>` : contracts.map(c=>`
      <div class="list-card">
        <div class="lc-top">
          <div><div class="lc-name">${esc(c.client)}</div><div class="lc-sub">${esc(c.ville)}</div></div>
          ${badge(c.statut,"green")}
        </div>
        <div class="lc-motif">${esc(c.prestations)}<br>${esc(c.frequence)} · Prochaine visite : ${esc(c.prochaineVisite)}</div>
        <div class="lc-foot">
          <button class="btn-secondary btn-sm" style="width:100%" data-action="open-dossier" data-id="${c.dossierId}">Voir le dossier</button>
        </div>
      </div>`).join("")}
  </div>
  <p class="form-help">Suivi de démonstration : ces fiches ne constituent pas des contrats signés. La visite d’entretien est une échéance à planifier avec un technicien.</p>
  `;
}

// ---------- Diagnostics list ----------

function renderDiagnosticsList(){
  const list = visibleDossiers();
  return `
  <div class="page-header">
    <div><h1>Diagnostics de toiture</h1><p>Vos contrôles terrain, photos et rapports PDF.</p></div>
    ${diagEditable() ? `<button class="btn-primary" data-action="modal-new-diag">+ Nouveau diagnostic</button>` : ""}
  </div>
  <div class="filters-row">
    <input type="text" placeholder="Rechercher un client, une ville, un dossier…" disabled>
    <select disabled><option>Tous les statuts</option></select>
    <select disabled><option>Toute l’équipe</option></select>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Dossier</th><th>Technicien</th><th>Visite</th><th>Avancement</th><th></th></tr></thead>
      <tbody>
      ${list.filter(d=>d.visiteDate).map(d=>`
        <tr>
          <td><div class="row-title">${esc(d.client)}</div><div class="row-sub">${esc(d.ville)} · ${esc(d.id)}</div></td>
          <td>${esc(d.technicien||"—")}</td>
          <td>${esc(d.visiteDate)} · ${esc(d.visiteHeure)}</td>
          <td>${badge(d.statut, statutBadgeClass(d.statut))}</td>
          <td><button class="btn-ghost" data-action="open-dossier" data-id="${d.id}" data-tab="${d.diagnostic.rapportPret?"rapport":"diagnostic"}">${d.diagnostic.rapportPret?"Voir le rapport":"Remplir le diagnostic"}</button></td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>

  <div class="mobile-list">
    ${list.filter(d=>d.visiteDate).map(d=>`
      <div class="list-card">
        <div class="lc-top">
          <div><div class="lc-name">${esc(d.client)}</div><div class="lc-sub">${esc(d.ville)} · ${esc(d.id)}</div></div>
          ${badge(d.statut, statutBadgeClass(d.statut))}
        </div>
        <div class="lc-motif">${esc(d.technicien||"—")} · ${esc(d.visiteDate)} ${esc(d.visiteHeure)}</div>
        <div class="lc-foot">
          <button class="btn-secondary btn-sm" style="width:100%" data-action="open-dossier" data-id="${d.id}" data-tab="${d.diagnostic.rapportPret?"rapport":"diagnostic"}">${d.diagnostic.rapportPret?"Voir le rapport":"Remplir le diagnostic"}</button>
        </div>
      </div>`).join("")}
  </div>`;
}

// ---------- Suivi commercial (kanban) ----------

function renderCommercialKanban(){
  const list = visibleDossiers();
  const stages = ["À contacter","Devis à préparer","Devis envoyé","Gagné","Perdu"];
  const actives = list.filter(d=>d.commercialStage!=="Perdu" && d.commercialStage!=="Gagné");
  const devisEnvoyes = list.filter(d=>d.commercialStage==="Devis envoyé").length;
  const montantGagne = list.filter(d=>d.commercialStage==="Gagné").reduce((s,d)=>s+d.montant,0);
  const relancesRetard = list.filter(d=>d.prochaineRelance).length;

  return `
  <div class="page-header"><div><h1>Suivi commercial</h1><p>Du premier contact à l’accord du client. Ouvrez une affaire pour la faire avancer.</p></div></div>
  <div class="stat-grid">
    ${stat("Affaires actives", actives.length, "Prospects et devis en cours")}
    ${stat("Devis envoyés", devisEnvoyes, "En attente d’une réponse")}
    ${stat("Montant gagné", montantGagne.toLocaleString("fr-FR")+" €", "Affaires marquées gagnées")}
    ${stat("Relances en retard", relancesRetard, "À reprendre en priorité")}
  </div>
  <div class="kanban">
    ${stages.map(stg=>{
      const items = list.filter(d=>d.commercialStage===stg);
      return `<div class="kanban-col">
        <h4>${esc(stg)} <span>${items.length}</span></h4>
        ${items.length===0 ? `<div class="cal-empty">Aucun dossier à cette étape.</div>` : items.map(d=>`
          <div class="kanban-card">
            <div class="kc-id">${esc(d.id)}</div>
            <div class="kc-name">${esc(d.client)}</div>
            <div class="kc-sub">${esc(d.ville)} · ${esc(d.commercial)}</div>
            ${d.priorite!=="Normale" ? badge(d.priorite, priorityBadgeClass(d.priorite)) : ""}
            ${d.montant ? `<div class="kc-amount">${d.montant.toLocaleString("fr-FR")} €</div>` : ""}
            ${d.prochaineRelance ? `<div style="margin:4px 0">${badge("En retard","red")}</div>` : ""}
            <button class="btn-ghost btn-sm" style="width:100%;margin-top:6px" data-action="open-dossier" data-id="${d.id}" data-tab="commercial">Ouvrir le suivi</button>
          </div>`).join("")}
      </div>`;
    }).join("")}
  </div>

  <div class="kanban-mobile">
    <div class="pill-row">
      ${stages.map(stg=>{
        const count = list.filter(d=>d.commercialStage===stg).length;
        return `<button class="pill-btn ${state.kanbanStage===stg?"active":""}" data-action="kanban-stage" data-stage="${esc(stg)}">${esc(stg)}<span class="pb-count">${count}</span></button>`;
      }).join("")}
    </div>
    ${(()=>{
      const items = list.filter(d=>d.commercialStage===state.kanbanStage);
      if(items.length===0) return `<div class="empty-note">Aucun dossier à cette étape.</div>`;
      return items.map(d=>`
        <div class="list-card">
          <div class="lc-top">
            <div><div class="lc-name">${esc(d.client)}</div><div class="lc-sub">${esc(d.id)} · ${esc(d.ville)} · ${esc(d.commercial)}</div></div>
            ${d.priorite!=="Normale" ? badge(d.priorite, priorityBadgeClass(d.priorite)) : ""}
          </div>
          ${d.montant ? `<div class="lc-motif" style="color:var(--gold);font-weight:700">${d.montant.toLocaleString("fr-FR")} €</div>` : ""}
          ${d.prochaineRelance ? `<div style="margin:8px 0">${badge("En retard","red")}</div>` : ""}
          <div class="lc-foot"><button class="btn-secondary btn-sm" style="width:100%" data-action="open-dossier" data-id="${d.id}" data-tab="commercial">Ouvrir le suivi</button></div>
        </div>`).join("");
    })()}
  </div>`;
}

// ---------- Parrainages ----------

function renderParrainages(){
  const list = visibleParrainages();
  const gagnees = 0;
  const prevues = list.reduce((s,p)=>s+p.recompense,0);
  return `
  <div class="page-header">
    <div><h1>Parrainages clients</h1><p>Suivez les recommandations et les récompenses, du contact à la remise.</p></div>
    ${canAjouterParrainage() ? `<button class="btn-primary" data-action="modal-info" data-msg="Ajouter un parrainage">+ Ajouter un parrainage</button>` : ""}
  </div>
  <div class="stat-grid">
    ${stat("Recommandations", list.length, "Clients apportés")}
    ${stat("Affaires gagnées", gagnees, "Issues du parrainage")}
    ${stat("Récompenses prévues", prevues.toLocaleString("fr-FR")+" €", "Suivi indicatif, aucun versement")}
    ${stat("Récompenses remises", 0, "Déclarées par l’administration")}
  </div>
  <div class="card table-wrap">
    ${list.length===0 ? `<div class="empty-note">Aucun parrainage enregistré.</div>` : `
    <table>
      <thead><tr><th>Parrain</th><th>Client apporté</th><th>Affaire</th><th>Récompense prévue</th><th>Suivi</th><th></th></tr></thead>
      <tbody>
        ${list.map((p,i)=>`<tr>
          <td><div class="row-title">${esc(p.parrain)}</div><div class="row-sub">${esc(p.date)}</div></td>
          <td>${esc(p.clientApporte)}</td>
          <td>${esc(p.affaire)}</td>
          <td>${p.recompense} €</td>
          <td>${badge(p.suivi,"blue")}</td>
          <td><button class="btn-ghost" data-action="mark-remise" data-idx="${i}">Marquer remise</button></td>
        </tr>`).join("")}
      </tbody>
    </table>`}
  </div>

  <div class="mobile-list">
    ${list.length===0 ? `<div class="empty-note">Aucun parrainage enregistré.</div>` : list.map((p,i)=>`
      <div class="list-card">
        <div class="lc-top">
          <div><div class="lc-name">${esc(p.parrain)}</div><div class="lc-sub">${esc(p.date)}</div></div>
          ${badge(p.suivi,"blue")}
        </div>
        <div class="lc-motif">A parrainé ${esc(p.clientApporte)} · ${esc(p.affaire)}<br>Récompense prévue : ${p.recompense} €</div>
        <div class="lc-foot">
          <button class="btn-secondary btn-sm" style="width:100%" data-action="mark-remise" data-idx="${i}">Marquer remise</button>
        </div>
      </div>`).join("")}
  </div>`;
}

// ---------- Équipe & accès ----------

function renderEquipe(){
  return `
  <div class="page-header"><div><h1>Une équipe, trois responsabilités.</h1><p>Les rôles sont simulés. Les comptes et les autorisations réelles restent à connecter.</p></div></div>
  <div class="stat-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
    <div class="stat-card">
      <div class="role-card-title">Administration</div>
      <div class="role-card-sub">Coordonne les demandes et toute l’activité.</div>
      <ul class="perm-list">
        <li>Créer et modifier les dossiers</li><li>Affecter les techniciens et commerciaux</li>
        <li>Planifier les rendez-vous</li><li>Partager les rapports aux clients</li>
        <li>Suivre les parrainages et récompenses</li>
      </ul>
    </div>
    <div class="stat-card">
      <div class="role-card-title">Techniciens</div>
      <div class="role-card-sub">Julien Bernard · Léa Petit</div>
      <ul class="perm-list">
        <li>Consulter leurs visites et dossiers</li><li>Remplir les diagnostics et ajouter des photos</li>
        <li>Générer les rapports PDF</li><li>Ajouter des notes internes</li>
      </ul>
    </div>
    <div class="stat-card">
      <div class="role-card-title">Commerciaux</div>
      <div class="role-card-sub">Sarah Durand · Lucas Robert</div>
      <ul class="perm-list">
        <li>Suivre les prospects affectés</li><li>Consulter les rapports techniques</li>
        <li>Mettre à jour les étapes et montants</li><li>Programmer les relances</li>
        <li>Suivre les recommandations clients</li>
      </ul>
    </div>
  </div>
  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Espace client</h3>
    <p style="font-size:13px;color:var(--muted);margin-bottom:14px">Chaque client doit retrouver uniquement son dossier, ses rendez-vous et ses documents partagés. Le sélecteur de rôle permet de tester le parcours et ne constitue pas une connexion sécurisée.</p>
    <button class="btn-secondary" data-action="nav" data-section="client-preview">Voir l’espace de Marie Laurent</button>
  </div>`;
}

// ---------- Connexions ----------

function renderConnexions(){
  const items = [
    {title:"Google Agenda", desc:"Synchroniser les rendez-vous des techniciens avec leur agenda.", detail:"Connexion de chaque compte, choix des agendas et gestion des modifications dans les deux sens."},
    {title:"E-mails clients", desc:"Envoyer les PDF et garder une trace des envois.", detail:"Adresse d’expédition de l’entreprise, validation avant envoi et suivi des erreurs."},
    {title:"IA sur les photos", desc:"Proposer des observations à valider sur chaque point de contrôle.", detail:"Service d’analyse d’images, règles de confidentialité, essais terrain et validation humaine obligatoire."}
  ];
  return `
  <div class="page-header"><div><h1>Services à connecter</h1><p>Les fonctions externes sont présentées ici pour cadrer la version utilisée par l’équipe.</p></div></div>
  ${items.map(it=>`
    <div class="card conn-card">
      <div style="flex:1">
        <h4>${esc(it.title)}</h4>
        <p>${esc(it.desc)}</p>
        <div class="conn-detail">${esc(it.detail)}</div>
      </div>
      ${badge("Non connecté","gray")}
    </div>`).join("")}
  `;
}

// ---------- Client portal ----------

function renderClientPortal(clientName){
  const d = DOSSIERS.find(x=>x.client===clientName);
  const steps = [
    {label:"Demande reçue", done:true},
    {label:"Visite programmée", done:!!d.visiteDate},
    {label:"Diagnostic terminé", done:d.diagnostic.rapportPret},
    {label:"Rapport partagé", done:d.diagnostic.rapportPartage}
  ];
  return `
  <h1>Bonjour ${esc(clientName.split(" ")[0])},</h1>
  <p style="color:var(--muted);margin-bottom:24px">Retrouvez votre demande et les documents partagés par votre équipe.</p>

  <div class="progress-tracker">
    ${steps.map((s,i)=>`<div class="progress-step ${s.done?"done":""}"><div class="ps-dot">${i+1}</div>${esc(s.label)}</div>`).join("")}
  </div>

  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Votre demande</h3>
    ${badge(d.statut==="Rapport prêt"?"Terminé":"En cours", d.statut==="Rapport prêt"?"green":"blue")}
    <p style="margin:10px 0 4px;font-weight:600">${esc(d.motif)}</p>
    <p style="color:var(--muted);font-size:13px;margin:0">${esc(d.adresse)}, ${esc(d.ville)}</p>
    <p style="color:var(--muted);font-size:12px;margin-top:6px">Référence ${esc(d.id)}</p>
  </div>

  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Vos documents</h3>
    ${d.diagnostic.rapportPartage ? `<button class="btn-secondary btn-sm">Télécharger le rapport</button>` : `<p style="color:var(--muted);font-size:13px">Votre rapport apparaîtra ici après son partage par l’équipe.</p>`}
    <p style="color:var(--muted);font-size:12px;margin-top:8px">Devis signables et dépôt de documents : à connecter dans la version réelle.</p>
  </div>

  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Recommander un proche</h3>
    <p style="font-size:13px;color:var(--muted);margin-bottom:12px">Transmettez-lui la référence <b style="color:var(--text)">PARRAIN-${d.id.replace("TP-","")}</b> à indiquer à l’équipe lors de sa demande.</p>
    <button class="btn-secondary btn-sm" data-action="copy-ref" data-ref="PARRAIN-${d.id.replace("TP-","")}">Copier ma référence</button>
    <p style="font-size:12px;color:var(--muted);margin-top:10px">0 recommandation(s) rattachée(s) à votre dossier. Conditions et récompenses à convenir avec l’entreprise.</p>
  </div>

  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Votre rendez-vous</h3>
    ${d.visiteDate ? `<p style="font-weight:600">${esc(d.visiteDate)} · ${esc(d.visiteHeure)}</p>` : `<p style="font-weight:600">En cours de planification</p><p style="color:var(--muted);font-size:13px">L’équipe vous contactera pour convenir d’un créneau.</p>`}
  </div>

  <div class="card">
    <h3 style="margin:0 0 10px;font-size:14.5px">Vos interlocuteurs</h3>
    <div class="row-item"><div class="row-sub">Technicien</div><div>${esc(d.technicien||"Affectation à venir")}</div></div>
    <div class="row-item"><div class="row-sub">Suivi commercial</div><div>${esc(d.commercial||"À affecter")}</div></div>
  </div>
  `;
}

// ---------- Modals ----------

function buildModal(){
  const m = state.modal;
  if(m.type==="new") return modalNewDemande();
  if(m.type==="edit") return modalEditDossier(byId(m.id));
  if(m.type==="affect") return modalAffecter(byId(m.id));
  if(m.type==="choose") return modalChooseDossier();
  if(m.type==="info") return modalInfo(m.msg);
  if(m.type==="send") return modalSendClient(byId(m.id));
  return "";
}

function modalWrap(title, bodyHtml){
  return `<div class="modal-overlay" data-action="modal-overlay">
    <div class="modal">
      <div class="modal-header"><h3>${esc(title)}</h3><button class="modal-close" data-action="modal-close">✕</button></div>
      ${bodyHtml}
    </div>
  </div>`;
}

function modalNewDemande(){
  return modalWrap("Nouvelle demande", `
    <div class="form-field"><label>Nom du client</label><input type="text" id="fName"></div>
    <div class="form-field"><label>Téléphone</label><input type="tel" id="fPhone" value="06 00 00 00 00"></div>
    <div class="form-field"><label>E-mail</label><input type="email" id="fEmail"></div>
    <div class="form-field"><label>Ville</label><input type="text" id="fVille"></div>
    <div class="form-field"><label>Type de bâtiment</label><select id="fType"><option>Maison individuelle</option><option>Immeuble collectif</option><option>Bâtiment professionnel</option><option>Dépendance</option><option>Autre</option></select></div>
    <div class="form-field"><label>Adresse</label><input type="text" id="fAdresse" value="12 rue des Tilleuls"></div>
    <div class="form-field"><label>Informations sur le bâtiment</label><textarea id="fInfos"></textarea></div>
    <div class="form-field"><label>Objet de la demande</label><textarea id="fMotif"></textarea></div>
    <div class="form-field"><label>Priorité</label><select id="fPriorite"><option>Normale</option><option>Urgente</option><option>Infiltration signalée</option></select></div>
    <div class="form-field"><label>Commercial</label><select id="fCommercial"><option>À affecter</option><option>Sarah Durand</option><option>Lucas Robert</option></select></div>
    <div class="modal-actions"><button class="btn-primary" data-action="submit-new">Créer la demande</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>
  `);
}

function modalEditDossier(d){
  return modalWrap("Modifier le dossier", `
    <div class="form-field"><label>Nom du client</label><input type="text" id="fName" value="${esc(d.client)}"></div>
    <div class="form-field"><label>Téléphone</label><input type="tel" id="fPhone" value="${esc(d.telephone)}"></div>
    <div class="form-field"><label>E-mail</label><input type="email" id="fEmail" value="${esc(d.email)}"></div>
    <div class="form-field"><label>Ville</label><input type="text" id="fVille" value="${esc(d.ville)}"></div>
    <div class="form-field"><label>Type de bâtiment</label><select id="fType">${["Maison individuelle","Immeuble collectif","Bâtiment professionnel","Dépendance","Autre"].map(o=>`<option ${d.typeBatiment===o?"selected":""}>${o}</option>`).join("")}</select></div>
    <div class="form-field"><label>Adresse</label><input type="text" id="fAdresse" value="${esc(d.adresse)}"></div>
    <div class="form-field"><label>Informations sur le bâtiment</label><textarea id="fInfos">${esc(d.infosGenerales)}</textarea></div>
    <div class="form-field"><label>Objet de la demande</label><textarea id="fMotif">${esc(d.motif)}</textarea></div>
    <div class="form-field"><label>Priorité</label><select id="fPriorite">${["Normale","Urgente","Infiltration signalée"].map(o=>`<option ${d.priorite===o?"selected":""}>${o}</option>`).join("")}</select></div>
    <div class="modal-actions"><button class="btn-primary" data-action="submit-edit" data-id="${d.id}">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>
  `);
}

function modalAffecter(d){
  return modalWrap("Affecter et planifier", `
    <p class="form-help" style="margin-bottom:14px">${esc(d.client)} · ${esc(d.ville)}</p>
    <div class="form-field"><label>Technicien</label><select id="fTech"><option>À affecter</option>${["Julien Bernard","Léa Petit"].map(o=>`<option ${d.technicien===o?"selected":""}>${o}</option>`).join("")}</select></div>
    <div class="form-field"><label>Commercial</label><select id="fCom"><option>À affecter</option>${["Sarah Durand","Lucas Robert"].map(o=>`<option ${d.commercial===o?"selected":""}>${o}</option>`).join("")}</select></div>
    <div class="form-field"><label>Date de visite</label><input type="date" id="fDate"></div>
    <div class="form-field"><label>Heure de visite</label><input type="time" id="fHeure" value="09:00"></div>
    <div class="form-help" style="margin-bottom:6px">Une visite nécessite un technicien et une heure. Les collisions au même horaire sont signalées ; l’équipe reste responsable de la confirmation finale.</div>
    <div class="modal-actions"><button class="btn-primary" data-action="submit-affect" data-id="${d.id}">Enregistrer l’affectation</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>
  `);
}

function modalChooseDossier(){
  return modalWrap("Choisir un dossier", `
    ${DOSSIERS.map(d=>`<button class="modal-list-btn" data-action="choose-dossier" data-id="${d.id}">${esc(d.client)} · ${esc(d.ville)}</button>`).join("")}
  `);
}

function modalSendClient(d){
  return modalWrap("Envoyer le rapport au client", `
    <p class="form-help" style="margin-bottom:14px">${esc(d.client)} — choisissez comment envoyer le rapport.</p>
    <button class="modal-list-btn" data-action="send-whatsapp" data-id="${d.id}">WhatsApp — ${esc(d.telephone||"numéro non renseigné")}</button>
    <button class="modal-list-btn" data-action="send-email" data-id="${d.id}">E-mail — ${esc(d.email||"adresse non renseignée")}</button>
    <p class="form-help" style="margin-top:14px">La conversation ou l’e-mail s’ouvre avec un message prêt. Aucun site ne peut joindre un fichier automatiquement : générez le PDF (bouton “Télécharger le PDF”) puis joignez-le manuellement.</p>
    <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Annuler</button></div>
  `);
}

function modalInfo(msg){
  return modalWrap(msg, `<p style="color:var(--muted);font-size:13px">Fonctionnalité de démonstration : cet écran illustre l’emplacement de l’action dans le parcours, sans persistance au-delà de la session.</p>
    <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Fermer</button></div>`);
}

// ---------- Event handling ----------

document.addEventListener("DOMContentLoaded", ()=>{
  render();
  window.addEventListener("resize", applyPdfScale);

  document.getElementById("app").addEventListener("click", (e)=>{
    const t = e.target.closest("[data-action]");
    if(!t) return;
    const action = t.dataset.action;
    savePointFieldsFromDOM();
    saveSynthFieldsFromDOM();

    if(action==="modal-overlay"){ if(e.target===t){ state.modal=null; render(); } return; }
    if(action==="modal-close"){ state.modal=null; render(); return; }
    if(action==="open-app"){
      state.splashExiting = true;
      render();
      setTimeout(()=>{ state.appStage="login"; state.splashExiting=false; render(); }, 650);
      return;
    }
    if(action==="do-login"){ state.appStage="app"; render(); return; }
    if(action==="toggle-sidebar"){ state.sidebarOpen=!state.sidebarOpen; render(); return; }
    if(action==="close-sidebar"){ state.sidebarOpen=false; render(); return; }
    if(action==="nav"){ state.section=t.dataset.section; state.dossierId=null; state.diagStep=1; state.sidebarOpen=false; render(); scrollContentTop(); return; }
    if(action==="open-dossier"){ state.section="dossiers"; state.dossierId=t.dataset.id; state.dossierTab=t.dataset.tab||"info"; state.diagStep=1; render(); scrollContentTop(); return; }
    if(action==="dossier-tab"){ state.dossierTab=t.dataset.tab; state.diagStep=1; render(); scrollContentTop(); return; }
    if(action==="modal-new"){ state.modal={type:"new"}; render(); return; }
    if(action==="modal-new-diag"){ state.modal={type:"new", toDiagnostic:true}; render(); return; }
    if(action==="modal-edit"){ state.modal={type:"edit", id:t.dataset.id}; render(); return; }
    if(action==="modal-affect"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="modal-choose"){ state.modal={type:"choose"}; render(); return; }
    if(action==="modal-info"){ state.modal={type:"info", msg:t.dataset.msg}; render(); return; }
    if(action==="choose-dossier"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="reset-demo"){
      DOSSIERS = seedDossiers();
      state = {appStage:"app",splashExiting:false,role:"admin",section:"overview",dossierId:null,dossierTab:"info",diagStep:1,agendaMember:"all",
        calendarView:"day",calendarDate:new Date(TODAY_REF),datePickerOpen:false,pickerViewDate:new Date(TODAY_REF),
        kanbanStage:"À contacter",modal:null,toast:null,sidebarOpen:false};
      render();
      return;
    }
    if(action==="copy-ref"){ showToast("Référence copiée : "+t.dataset.ref); return; }
    if(action==="mark-remise"){ showToast("Récompense marquée comme remise (démo)."); return; }
    if(action==="download-pdf"){
      const d = byId(t.dataset.id);
      generateAndDownloadPdf(d);
      return;
    }
    if(action==="modal-send"){ state.modal={type:"send", id:t.dataset.id}; render(); return; }
    if(action==="send-whatsapp"){
      const d = byId(t.dataset.id);
      const phone = (d.telephone||"").replace(/\D/g,"").replace(/^0/,"33");
      const msg = `Bonjour ${d.client}, voici votre rapport de diagnostic de toiture (réf. ${d.id}). N’hésitez pas si vous avez des questions.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
      state.modal = null;
      showToast("WhatsApp ouvert avec le message prêt. Pensez à joindre le PDF (bouton “Télécharger le PDF”) à la conversation.");
      render();
      return;
    }
    if(action==="send-email"){
      const d = byId(t.dataset.id);
      const subject = `Votre rapport de diagnostic — Maître Toiturier (${d.id})`;
      const body = `Bonjour ${d.client},\n\nVeuillez trouver ci-joint votre rapport de diagnostic de toiture.\n\nCordialement,\nMaître Toiturier`;
      window.location.href = `mailto:${encodeURIComponent(d.email||"")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      state.modal = null;
      showToast("E-mail ouvert avec le message prêt. Pensez à joindre le PDF (bouton “Télécharger le PDF”) avant de l’envoyer.");
      render();
      return;
    }
    if(action==="share-report"){
      const d = byId(t.dataset.id); d.diagnostic.rapportPartage = true;
      showToast("Rapport partagé dans l’espace client de démonstration.");
      return;
    }
    if(action==="add-note"){
      const d = byId(t.dataset.id);
      const val = document.getElementById("noteInput").value.trim();
      if(val){ d.notes.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), texte:val}); render(); }
      return;
    }
    if(action==="submit-new"){
      const name = document.getElementById("fName").value.trim() || "Nouveau client";
      const nid = "TP-"+(1049+DOSSIERS.filter(d=>d.id.startsWith("TP-1")).length);
      const newD = {
        id: nid, client:name, ville: document.getElementById("fVille").value.trim()||"—",
        motif: document.getElementById("fMotif").value.trim()||"Nouvelle demande",
        priorite: document.getElementById("fPriorite").value, statut:"Nouvelle",
        technicien:null, commercial: document.getElementById("fCommercial").value==="À affecter"?null:document.getElementById("fCommercial").value,
        telephone: document.getElementById("fPhone").value||"06 00 00 00 00",
        email: document.getElementById("fEmail").value||"client@example.com",
        adresse: document.getElementById("fAdresse").value||"12 rue des Tilleuls",
        typeBatiment: document.getElementById("fType").value,
        infosGenerales: document.getElementById("fInfos").value,
        notes:[], historique:[{date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Demande créée dans la démonstration."}],
        commercialStage:"À contacter", montant:0, prochaineRelance:null, compteRendu:"",
        visiteDate:null, visiteHeure:null, diagnostic:freshDiagnostic()
      };
      DOSSIERS.unshift(newD);
      const toDiagnostic = state.modal && state.modal.toDiagnostic;
      state.modal=null;
      if(toDiagnostic){
        state.section="dossiers"; state.dossierId=newD.id; state.dossierTab="diagnostic"; state.diagStep=1;
      }
      render();
      return;
    }
    if(action==="submit-edit"){
      const d = byId(t.dataset.id);
      d.client = document.getElementById("fName").value.trim()||d.client;
      d.telephone = document.getElementById("fPhone").value;
      d.email = document.getElementById("fEmail").value;
      d.ville = document.getElementById("fVille").value;
      d.typeBatiment = document.getElementById("fType").value;
      d.adresse = document.getElementById("fAdresse").value;
      d.infosGenerales = document.getElementById("fInfos").value;
      d.motif = document.getElementById("fMotif").value;
      d.priorite = document.getElementById("fPriorite").value;
      state.modal=null; render();
      return;
    }
    if(action==="submit-affect"){
      const d = byId(t.dataset.id);
      const tech = document.getElementById("fTech").value;
      const com = document.getElementById("fCom").value;
      const date = document.getElementById("fDate").value;
      const heure = document.getElementById("fHeure").value;
      d.technicien = tech==="À affecter"?null:tech;
      d.commercial = com==="À affecter"?null:com;
      if(date){
        const dt = new Date(date+"T00:00:00");
        d.visiteDate = dt.getDate()+" "+dt.toLocaleDateString("fr-FR",{month:"short"}).replace(".","")+".";
        d.visiteHeure = heure||"09:00";
        d.statut = "Planifié";
      }
      state.modal=null; render();
      return;
    }
    if(action==="trigger-file"){ document.getElementById(t.dataset.target).click(); return; }
    if(action==="remove-photo"){
      const d = byId(t.dataset.id);
      const pointName = POINTS[parseInt(t.dataset.step,10)-1];
      d.diagnostic.points[pointName].photos.splice(parseInt(t.dataset.idx,10),1);
      render();
      return;
    }
    if(action==="cal-view"){ state.calendarView = t.dataset.view; state.datePickerOpen=false; render(); return; }
    if(action==="cal-prev" || action==="cal-next"){
      const dir = action==="cal-prev" ? -1 : 1;
      const v = state.calendarView;
      if(v==="day") state.calendarDate = addDays(state.calendarDate, dir);
      else if(v==="week") state.calendarDate = addDays(state.calendarDate, dir*7);
      else if(v==="month") state.calendarDate = addMonths(state.calendarDate, dir);
      else state.calendarDate = addYears(state.calendarDate, dir);
      render();
      return;
    }
    if(action==="cal-today"){ state.calendarDate = new Date(TODAY_REF); render(); return; }
    if(action==="toggle-datepicker"){
      if(!state.datePickerOpen) state.pickerViewDate = new Date(state.calendarDate);
      state.datePickerOpen = !state.datePickerOpen;
      render();
      return;
    }
    if(action==="close-datepicker"){ state.datePickerOpen=false; render(); return; }
    if(action==="picker-prev-month"){ state.pickerViewDate = addMonths(state.pickerViewDate,-1); render(); return; }
    if(action==="picker-next-month"){ state.pickerViewDate = addMonths(state.pickerViewDate,1); render(); return; }
    if(action==="picker-select-day"){
      const [y,m,day] = t.dataset.date.split("-").map(Number);
      state.calendarDate = new Date(y,m,day);
      state.datePickerOpen = false;
      render();
      return;
    }
    if(action==="cal-goto-day"){
      const [y,m,day] = t.dataset.date.split("-").map(Number);
      state.calendarDate = new Date(y,m,day);
      state.calendarView = "day";
      render();
      return;
    }
    if(action==="cal-goto-month"){
      const [y,m,day] = t.dataset.date.split("-").map(Number);
      state.calendarDate = new Date(y,m,day);
      state.calendarView = "month";
      render();
      return;
    }
    if(action==="kanban-stage"){ state.kanbanStage = t.dataset.stage; render(); return; }
    if(action==="pt-etat"){
      const d = byId(t.dataset.id);
      const stepNum = parseInt(t.dataset.step,10);
      const pointName = POINTS[stepNum-1];
      const p = d.diagnostic.points[pointName];
      p.etat = t.dataset.val;
      if(AUTO_ADVANCE_ETATS.includes(p.etat)){
        p.problems = []; p.extent = ""; p.zones = []; p.comment = "";
      }
      reformulatePoint(pointName, p);
      render();
      return;
    }
    if(action==="diag-step"){ state.diagStep = parseInt(t.dataset.step,10); render(); scrollContentTop(); return; }
    if(action==="diag-save-point" || action==="diag-next"){
      if(action==="diag-next"){
        state.diagStep = Math.min(POINTS.length+1, parseInt(t.dataset.step,10)+1);
        render();
        scrollContentTop();
      } else {
        render();
      }
      return;
    }
    if(action==="diag-generate"){
      const d = byId(t.dataset.id);
      const controlledObs = POINTS.filter(p=>d.diagnostic.points[p].observation).map(p=>d.diagnostic.points[p].observation);
      d.diagnostic.synthese.observations = controlledObs.join(" ") || d.diagnostic.synthese.observations;
      render();
      return;
    }
    if(action==="diag-finish"){
      const d = byId(t.dataset.id);
      d.diagnostic.synthese.typeCouverture = document.getElementById("synTypeCouverture").value;
      d.diagnostic.synthese.surface = document.getElementById("synSurface").value;
      const obsChosen = Array.from(document.getElementById("synObsSel").selectedOptions).map(o=>o.textContent.trim());
      if(obsChosen.length) d.diagnostic.synthese.observations = obsChosen.join(" ");
      const precoChosen = Array.from(document.getElementById("synPrecoSel").selectedOptions).map(o=>o.textContent.trim());
      if(precoChosen.length) d.diagnostic.synthese.preconisations = precoChosen.join(" ");
      d.diagnostic.synthese.conclusion = document.getElementById("synConclusion").value;
      d.diagnostic.rapportPret = true;
      d.statut = "Rapport prêt";
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Diagnostic validé, rapport généré."});
      state.dossierTab = "rapport";
      render();
      return;
    }
    if(action==="save-commercial"){
      const d = byId(t.dataset.id);
      d.commercialStage = document.getElementById("comStage").value;
      d.montant = parseInt(document.getElementById("comMontant").value,10)||0;
      d.prochaineRelance = document.getElementById("comRelance").value || null;
      d.compteRendu = document.getElementById("comCompteRendu").value;
      showToast("Suivi commercial enregistré.");
      render();
      return;
    }
    if(action==="devis-new"){
      const d = byId(t.dataset.id);
      const numero = nextDevisId(d);
      d.devis.push({ id:numero, numero, version:d.devis.length+1, statut:"Brouillon", lignes:[freshDevisLine()], dateCreation:"12 sept.", dateEnvoi:null });
      render();
      return;
    }
    if(action==="devis-new-version"){
      const d = byId(t.dataset.id);
      const prev = latestDevis(d);
      const numero = nextDevisId(d);
      d.devis.push({ id:numero, numero, version:d.devis.length+1, statut:"Brouillon", lignes:prev.lignes.map(l=>Object.assign({},l)), dateCreation:"12 sept.", dateEnvoi:null });
      showToast("Nouvelle version du devis créée.");
      render();
      return;
    }
    if(action==="devis-add-line"){
      saveDevisLinesFromDOM();
      latestDevis(byId(t.dataset.id)).lignes.push(freshDevisLine());
      render();
      return;
    }
    if(action==="devis-remove-line"){
      saveDevisLinesFromDOM();
      const dv = latestDevis(byId(t.dataset.id));
      dv.lignes.splice(parseInt(t.dataset.idx,10),1);
      if(!dv.lignes.length) dv.lignes.push(freshDevisLine());
      render();
      return;
    }
    if(action==="devis-save"){
      saveDevisLinesFromDOM();
      showToast("Devis enregistré.");
      render();
      return;
    }
    if(action==="devis-send"){
      saveDevisLinesFromDOM();
      const d = byId(t.dataset.id);
      const dv = latestDevis(d);
      dv.statut = "Envoyé";
      dv.dateEnvoi = "12 sept.";
      d.montant = Math.round(devisTotals(dv).ttcCt/100);
      if(d.commercialStage==="À contacter" || d.commercialStage==="Devis à préparer") d.commercialStage = "Devis envoyé";
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Devis "+dv.numero+" envoyé au client."});
      showToast("Devis marqué comme envoyé.");
      render();
      return;
    }
    if(action==="devis-accept"){
      const d = byId(t.dataset.id);
      const dv = latestDevis(d);
      dv.statut = "Accepté";
      d.commercialStage = "Gagné";
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Devis "+dv.numero+" accepté par le client."});
      showToast("Devis accepté.");
      render();
      return;
    }
    if(action==="devis-reject"){
      const d = byId(t.dataset.id);
      const dv = latestDevis(d);
      dv.statut = "Refusé";
      d.commercialStage = "Perdu";
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Devis "+dv.numero+" refusé par le client."});
      showToast("Devis marqué comme refusé.");
      render();
      return;
    }
    if(action==="facture-new"){
      const d = byId(t.dataset.id);
      const type = t.dataset.type;
      const dv = latestDevis(d);
      if(d.factures.some(f=>f.devisId===dv.id && f.type===type)){ showToast("Une facture "+type.toLowerCase()+" existe déjà pour ce devis."); return; }
      const numero = nextFactureId(d);
      const totals = devisTotals(dv);
      const montantTtcCt = type==="Acompte" ? Math.round(totals.ttcCt*0.3) : totals.ttcCt;
      d.factures.push({ id:numero, numero, type, devisId:dv.id, libelle:type+" — "+dv.numero, montantTtcCt, statut:"Brouillon", echeance:null, paiements:[] });
      render();
      return;
    }
    if(action==="facture-save"){
      const d = byId(t.dataset.id);
      const f = d.factures.find(x=>x.id===t.dataset.fid);
      f.libelle = document.getElementById("factureLibelle-"+f.id).value;
      f.montantTtcCt = Math.round((parseFloat(document.getElementById("factureMontant-"+f.id).value)||0)*100);
      f.echeance = document.getElementById("factureEcheance-"+f.id).value || null;
      showToast("Facture enregistrée.");
      render();
      return;
    }
    if(action==="facture-send"){
      const d = byId(t.dataset.id);
      const f = d.factures.find(x=>x.id===t.dataset.fid);
      f.statut = "Envoyée";
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Facture "+f.numero+" envoyée au client."});
      showToast("Facture envoyée.");
      render();
      return;
    }
    if(action==="payment-add"){
      const d = byId(t.dataset.id);
      const f = d.factures.find(x=>x.id===t.dataset.fid);
      const montant = parseFloat(document.getElementById("paiementMontant-"+f.id).value);
      if(!montant || montant<=0){ showToast("Indiquez un montant valide."); return; }
      const mode = document.getElementById("paiementMode-"+f.id).value;
      const date = document.getElementById("paiementDate-"+f.id).value || "12 sept.";
      const pid = f.id+"-P"+(f.paiements.length+1);
      f.paiements.push({ id:pid, montantCt:Math.round(montant*100), mode, date, virementStatut: mode==="Virement" ? "Annoncé" : null });
      f.statut = factureStatutFromPayments(f);
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:ROLES[state.role].label, texte:"Paiement de "+fmtEuros(Math.round(montant*100))+" enregistré sur "+f.numero+"."});
      showToast(mode==="Virement" ? "Virement enregistré (annoncé, non encaissé)." : "Paiement enregistré.");
      render();
      return;
    }
    if(action==="payment-confirm"){
      const d = byId(t.dataset.id);
      const f = d.factures.find(x=>x.id===t.dataset.fid);
      const p = f.paiements.find(x=>x.id===t.dataset.pid);
      p.virementStatut = "Confirmé";
      f.statut = factureStatutFromPayments(f);
      showToast("Virement confirmé comme encaissé.");
      render();
      return;
    }
  });

  document.getElementById("app").addEventListener("change", (e)=>{
    savePointFieldsFromDOM();
    saveSynthFieldsFromDOM();
    saveDevisLinesFromDOM();
    if(e.target.id==="devisCatalogSel"){
      const code = e.target.value;
      if(code){
        const d = byId(e.target.dataset.id);
        const svc = SERVICE_CATALOG.find(s=>s.code===code);
        latestDevis(d).lignes.push(freshDevisLine({designation:svc.label, qte:1, prixUnitaireCt:svc.prixUnitaireCt, tvaPct:svc.tvaPct}));
      }
      render();
    }
    if(e.target.id==="loginRole"){
      state.role = e.target.value;
      state.section = NAV[state.role][0][0];
      render();
    }
    if(e.target.id==="roleSelect"){
      state.role = e.target.value;
      state.section = NAV[state.role][0][0];
      state.dossierId=null;
      render();
    }
    if(e.target.id==="agendaMemberSelect"){
      state.agendaMember = e.target.value;
      render();
    }
    if(e.target.id==="ptDecision"){
      const d = byId(state.dossierId);
      const pointName = POINTS[state.diagStep-1];
      const p = d.diagnostic.points[pointName];
      p.decision = e.target.value;
      p.decisionTouched = true;
      reformulatePoint(pointName, p);
      render();
    }
    if(e.target.id==="selProblems"){
      const d = byId(state.dossierId);
      const pointName = POINTS[state.diagStep-1];
      const p = d.diagnostic.points[pointName];
      p.problems = Array.from(e.target.selectedOptions).map(o=>o.value);
      reformulatePoint(pointName, p);
      render();
    }
    if(e.target.id==="selExtent"){
      const d = byId(state.dossierId);
      const pointName = POINTS[state.diagStep-1];
      const p = d.diagnostic.points[pointName];
      const selected = Array.from(e.target.selectedOptions).map(o=>o.value);
      const newly = selected.find(v=>v!==p.extent);
      p.extent = newly!==undefined ? newly : (selected[0]||"");
      reformulatePoint(pointName, p);
      render();
    }
    if(e.target.id==="selVersant" || e.target.id==="selPosition"){
      const d = byId(state.dossierId);
      const pointName = POINTS[state.diagStep-1];
      const p = d.diagnostic.points[pointName];
      const versantEl = document.getElementById("selVersant");
      const positionEl = document.getElementById("selPosition");
      const versant = versantEl ? Array.from(versantEl.selectedOptions).map(o=>o.value) : [];
      const position = positionEl ? Array.from(positionEl.selectedOptions).map(o=>o.value) : [];
      p.zones = [...versant, ...position];
      reformulatePoint(pointName, p);
      render();
    }
    if(e.target.id==="ptComment"){
      const d = byId(state.dossierId);
      const pointName = POINTS[state.diagStep-1];
      const p = d.diagnostic.points[pointName];
      p.comment = e.target.value;
      reformulatePoint(pointName, p);
      render();
    }
    if(e.target.id==="photoGalleryInput" || e.target.id==="photoCameraInput"){
      const files = Array.from(e.target.files || []);
      if(!files.length) return;
      const d = byId(e.target.dataset.id);
      const pointName = POINTS[parseInt(e.target.dataset.step,10)-1];
      const point = d.diagnostic.points[pointName];
      Promise.all(files.slice(0, Math.max(0, 24 - point.photos.length)).map(file=>new Promise(resolve=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve({name:file.name, dataUrl:reader.result});
        reader.onerror = ()=>resolve(null);
        reader.readAsDataURL(file);
      }))).then(results=>{
        results.filter(Boolean).forEach(photo=>point.photos.push(photo));
        render();
      });
    }
  });
});
