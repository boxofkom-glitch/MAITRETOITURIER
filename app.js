/* ToitPilot / Maître Toiturier — CRM demo clone. Static, in-memory, no backend. */

const POINTS = [
  "Couverture et état des tuiles",
  "Éléments de finition",
  "Zinguerie",
  "Fenêtres de toit (Velux)",
  "Cheminées et souches",
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
  "Éléments de finition": ["casse","deplace","manquant","mousse","joint","autre"],
  "Zinguerie": ["corrode","perce","deplace","malfixe","mousse","ruissellement","joint","autre"],
  "Fenêtres de toit (Velux)": ["joint","fissure","eau","malfixe","corrode","autre"],
  "Cheminées et souches": ["fissure","joint","corrode","eau","deplace","autre"],
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
  if(!dv || dv.statut==="Refusé") return;
  const rows = document.querySelectorAll(".devis-line-input");
  if(!rows.length) return;
  rows.forEach(inp=>{
    const idx = parseInt(inp.dataset.idx,10);
    const line = dv.lignes[idx];
    if(!line) return;
    if(inp.dataset.field==="designation") line.designation = inp.value;
    else if(inp.dataset.field==="qte") line.qte = parseFloat(inp.value)||0;
    else if(inp.dataset.field==="unite") line.unite = inp.value;
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
    factures:[],
    chantier:null,
    taches:[]
  }, over);

  const list = [
    base({ id:"TP-1048", client:"Marie Laurent", ville:"Bordeaux", motif:"Infiltration dans les combles", priorite:"Urgente", statut:"Nouvelle", technicien:null, commercial:"Sarah Durand", email:"client1048@example.com", adresse:"12 rue des Tilleuls" }),
    base({ id:"TP-1047", client:"Pierre Dubois", ville:"Mérignac", motif:"Contrôle de couverture", priorite:"Normale", statut:"Nouvelle", technicien:null, commercial:"Lucas Robert", email:"client1047@example.com", adresse:"12 rue des Tilleuls" }),
    base({ id:"TP-1046", client:"Sophie Martin", ville:"Pessac", motif:"Gouttières à vérifier", priorite:"Infiltration signalée", statut:"Nouvelle", technicien:null, commercial:"Sarah Durand", email:"client1046@example.com", adresse:"12 rue des Tilleuls" }),
    base({ id:"TP-1045", client:"Thomas Moreau", ville:"Le Bouscat", motif:"Tuiles déplacées après le vent", priorite:"Urgente", statut:"Planifié", technicien:"Julien Bernard", commercial:"Sarah Durand", email:"client1045@example.com", adresse:"12 rue des Tilleuls", visiteDate:"13 sept.", visiteHeure:"09:00" }),
    base({ id:"TP-1044", client:"Camille Rousseau", ville:"Bordeaux", motif:"Bilan avant travaux", priorite:"Normale", statut:"Planifié", technicien:"Léa Petit", commercial:"Lucas Robert", email:"client1044@example.com", adresse:"12 rue des Tilleuls", visiteDate:"13 sept.", visiteHeure:"14:00" }),
    base({ id:"TP-1043", client:"Antoine Garnier", ville:"Talence", motif:"Contrôle annuel de toiture", priorite:"Normale", statut:"Planifié", technicien:"Julien Bernard", commercial:"Sarah Durand", email:"client1043@example.com", adresse:"12 rue des Tilleuls", visiteDate:"14 sept.", visiteHeure:"10:30" }),
    base({ id:"TP-1042", client:"Claire Fontaine", ville:"Bordeaux", motif:"Traces d’humidité sous rampant", priorite:"Normale", statut:"Rapport prêt", technicien:"Julien Bernard", commercial:"Sarah Durand", email:"client1042@example.com", adresse:"12 rue des Tilleuls", visiteDate:"10 sept.", visiteHeure:"09:00", commercialStage:"Devis envoyé", montant:12400, prochaineRelance:"11 sept.", diagnostic:claireDiagnostic() }),
    base({ id:"TP-1041", client:"Marc Lefèvre", ville:"Arcachon", motif:"Réfection de la couverture", priorite:"Normale", statut:"Rapport prêt", technicien:"Léa Petit", commercial:"Lucas Robert", email:"client1041@example.com", adresse:"12 rue des Tilleuls", visiteDate:"9 sept.", visiteHeure:"14:00", commercialStage:"Gagné", montant:18600, diagnostic:marcDiagnostic() }),
  ];
  addSampleDocs(list);
  list.forEach(dd=>syncProcess(dd, true));
  return list;
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
  { code:"COUV-TUILE", label:"Remplacement d’éléments de couverture", prixUnitaireCt:4500, prixAchatCt:1800, tvaPct:10, unite:"u" },
  { code:"COUV-FAIT", label:"Reprise de faîtage", prixUnitaireCt:38000, prixAchatCt:16000, tvaPct:10, unite:"ml" },
  { code:"ZING-GOUT", label:"Nettoyage et remise en état des gouttières", prixUnitaireCt:18000, prixAchatCt:7500, tvaPct:10, unite:"forfait" },
  { code:"ETAN-JOINT", label:"Reprise d’étanchéité (solin / noue)", prixUnitaireCt:32000, prixAchatCt:14000, tvaPct:10, unite:"forfait" },
  { code:"COUV-DEMOUSS", label:"Traitement anti-mousse de la couverture", prixUnitaireCt:22000, prixAchatCt:7000, tvaPct:10, unite:"forfait" },
  { code:"CHAR-REP", label:"Réparation localisée de charpente", prixUnitaireCt:65000, prixAchatCt:32000, tvaPct:10, unite:"forfait" },
  { code:"COUV-REFECTION", label:"Réfection complète de la couverture", prixUnitaireCt:850000, prixAchatCt:420000, tvaPct:10, unite:"forfait" },
  { code:"CONTROLE", label:"Visite de contrôle périodique", prixUnitaireCt:9000, prixAchatCt:2500, tvaPct:20, unite:"forfait" },
  { code:"VELUX-POSE", label:"Pose de fenêtre de toit (modèle standard)", prixUnitaireCt:120000, prixAchatCt:65000, tvaPct:10, unite:"u" },
  { code:"VELUX-GM", label:"Pose de fenêtre de toit (grand modèle)", prixUnitaireCt:165000, prixAchatCt:95000, tvaPct:10, unite:"u" },
  { code:"ISOL-COMBLES", label:"Isolation des combles perdus (soufflage)", prixUnitaireCt:4500, prixAchatCt:2200, tvaPct:5.5, unite:"m²" },
  { code:"HYDROFUGE", label:"Traitement hydrofuge de la toiture", prixUnitaireCt:25000, prixAchatCt:9000, tvaPct:10, unite:"forfait" },
  { code:"FUITE-REP", label:"Recherche et réparation de fuite ponctuelle", prixUnitaireCt:28000, prixAchatCt:9000, tvaPct:10, unite:"forfait" },
  { code:"ECRAN-SST", label:"Pose d’écran de sous-toiture", prixUnitaireCt:4200, prixAchatCt:1900, tvaPct:10, unite:"m²" },
  { code:"FAIT-VENT", label:"Pose de faîtière ventilée", prixUnitaireCt:42000, prixAchatCt:19000, tvaPct:10, unite:"ml" },
  { code:"TRAPPE", label:"Création d’une trappe d’accès combles", prixUnitaireCt:32000, prixAchatCt:14000, tvaPct:10, unite:"u" },
  { code:"ANTI-VOLA", label:"Pose de grille anti-volatiles", prixUnitaireCt:9000, prixAchatCt:3200, tvaPct:10, unite:"ml" },
  { code:"ZING-REP", label:"Réparation ponctuelle de zinguerie", prixUnitaireCt:19000, prixAchatCt:7500, tvaPct:10, unite:"forfait" },
  { code:"DEPLACEMENT", label:"Forfait déplacement / diagnostic d’urgence", prixUnitaireCt:9000, prixAchatCt:2000, tvaPct:20, unite:"forfait" },
  { code:"MO-HEURE", label:"Main d’œuvre (heure supplémentaire)", prixUnitaireCt:6500, prixAchatCt:2800, tvaPct:10, unite:"h" },
  { code:"RAMONAGE", label:"Entretien et ramonage de cheminée", prixUnitaireCt:8500, prixAchatCt:3000, tvaPct:10, unite:"u" }
];

// Fournitures et matériaux : prix d’achat fournisseur, prix de revente au client, marge calculée automatiquement.
const MATERIEL_CATALOG = [
  { code:"MAT-TUILE-BETON", label:"Tuile béton (l’unité)", prixAchatCt:90, prixVenteCt:140, tvaPct:10, unite:"u" },
  { code:"MAT-TUILE-TC", label:"Tuile terre cuite (l’unité)", prixAchatCt:130, prixVenteCt:195, tvaPct:10, unite:"u" },
  { code:"MAT-ARDOISE-FIBRO", label:"Ardoise fibrociment (l’unité)", prixAchatCt:180, prixVenteCt:260, tvaPct:10, unite:"u" },
  { code:"MAT-ARDOISE-NAT", label:"Ardoise naturelle (l’unité)", prixAchatCt:320, prixVenteCt:460, tvaPct:10, unite:"u" },
  { code:"MAT-GOUT-PVC", label:"Gouttière PVC", prixAchatCt:850, prixVenteCt:1300, tvaPct:10, unite:"ml" },
  { code:"MAT-GOUT-ZINC", label:"Gouttière zinc", prixAchatCt:2400, prixVenteCt:3600, tvaPct:10, unite:"ml" },
  { code:"MAT-DESC-PVC", label:"Descente EP PVC", prixAchatCt:650, prixVenteCt:1000, tvaPct:10, unite:"ml" },
  { code:"MAT-DESC-ZINC", label:"Descente EP zinc", prixAchatCt:1900, prixVenteCt:2900, tvaPct:10, unite:"ml" },
  { code:"MAT-CHENEAU-ZINC", label:"Chéneau zinc", prixAchatCt:3800, prixVenteCt:5600, tvaPct:10, unite:"ml" },
  { code:"MAT-CLOSOIR", label:"Closoir de faîtage", prixAchatCt:1200, prixVenteCt:1900, tvaPct:10, unite:"ml" },
  { code:"MAT-FAITIERE", label:"Faîtière ventilée (l’unité)", prixAchatCt:1800, prixVenteCt:2800, tvaPct:10, unite:"u" },
  { code:"MAT-ECRAN-HPV", label:"Écran de sous-toiture HPV", prixAchatCt:280, prixVenteCt:450, tvaPct:10, unite:"m²" },
  { code:"MAT-EPDM", label:"Membrane EPDM", prixAchatCt:1400, prixVenteCt:2100, tvaPct:10, unite:"m²" },
  { code:"MAT-BITUME", label:"Membrane bitumineuse", prixAchatCt:950, prixVenteCt:1500, tvaPct:10, unite:"m²" },
  { code:"MAT-LAINE-VERRE", label:"Laine de verre (isolation combles)", prixAchatCt:450, prixVenteCt:750, tvaPct:5.5, unite:"m²" },
  { code:"MAT-LAINE-ROCHE", label:"Laine de roche", prixAchatCt:520, prixVenteCt:850, tvaPct:5.5, unite:"m²" },
  { code:"MAT-PARE-VAPEUR", label:"Pare-vapeur", prixAchatCt:180, prixVenteCt:290, tvaPct:10, unite:"m²" },
  { code:"MAT-VELUX-STD", label:"Fenêtre de toit standard (78×98)", prixAchatCt:32000, prixVenteCt:45000, tvaPct:10, unite:"u" },
  { code:"MAT-VELUX-GM", label:"Fenêtre de toit grand modèle (114×118)", prixAchatCt:48000, prixVenteCt:68000, tvaPct:10, unite:"u" },
  { code:"MAT-CROCHET", label:"Crochets de tuile (lot de 100)", prixAchatCt:2200, prixVenteCt:3400, tvaPct:10, unite:"lot" },
  { code:"MAT-VIS-CHARP", label:"Visserie charpente (la boîte)", prixAchatCt:1800, prixVenteCt:2800, tvaPct:10, unite:"boîte" },
  { code:"MAT-CHEVRON", label:"Chevron traité", prixAchatCt:650, prixVenteCt:1050, tvaPct:10, unite:"ml" },
  { code:"MAT-LITEAU", label:"Liteau traité", prixAchatCt:220, prixVenteCt:380, tvaPct:10, unite:"ml" },
  { code:"MAT-PANNE", label:"Panne de charpente", prixAchatCt:1400, prixVenteCt:2200, tvaPct:10, unite:"ml" },
  { code:"MAT-ANTIMOUSSE", label:"Produit anti-mousse (bidon 5 L)", prixAchatCt:2800, prixVenteCt:4500, tvaPct:10, unite:"bidon" },
  { code:"MAT-HYDROFUGE", label:"Hydrofuge toiture (bidon 5 L)", prixAchatCt:3200, prixVenteCt:5200, tvaPct:10, unite:"bidon" },
  { code:"MAT-GRILLE-VOLA", label:"Grille anti-volatiles", prixAchatCt:650, prixVenteCt:1050, tvaPct:10, unite:"ml" },
  { code:"MAT-CRAPAUDINE", label:"Crapaudine PVC (l’unité)", prixAchatCt:450, prixVenteCt:750, tvaPct:10, unite:"u" },
  { code:"MAT-MORTIER", label:"Mortier de faîtage (sac 25 kg)", prixAchatCt:1200, prixVenteCt:1900, tvaPct:10, unite:"sac" },
  { code:"MAT-MASTIC", label:"Mastic silicone d’étanchéité (cartouche)", prixAchatCt:550, prixVenteCt:950, tvaPct:10, unite:"cartouche" }
];
// Un même code peut exister dans les deux catalogues : on cherche d’abord les prestations, puis le matériel.
function catalogFind(code){ return SERVICE_CATALOG.find(x=>x.code===code) || MATERIEL_CATALOG.find(x=>x.code===code); }
function catalogVenteCt(item){ return item.prixVenteCt!=null ? item.prixVenteCt : item.prixUnitaireCt; }
function catalogLineFrom(item){ return freshDevisLine({designation:item.label, qte:1, prixUnitaireCt:catalogVenteCt(item), tvaPct:item.tvaPct, code:item.code, coutUnitaireCt:item.prixAchatCt||0, unite:item.unite||"forfait"}); }
function catalogOptionsHtml(exclude){
  const ex = exclude || [];
  const opt = (c)=>`<option value="${c.code}">${esc(c.label)} — ${fmtEuros(catalogVenteCt(c))}</option>`;
  return `<optgroup label="Prestations">${SERVICE_CATALOG.filter(c=>!ex.includes(c.code)).map(opt).join("")}</optgroup>`
       + `<optgroup label="Matériel">${MATERIEL_CATALOG.filter(c=>!ex.includes(c.code)).map(opt).join("")}</optgroup>`;
}
function fmtEuros(ct){ return ((ct||0)/100).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"; }
function freshDevisLine(over){ return Object.assign({ designation:"", qte:1, unite:"forfait", prixUnitaireCt:0, tvaPct:10, coutUnitaireCt:0 }, over||{}); }
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
function devisCoutCt(dv){ return (dv&&dv.lignes||[]).reduce((s,l)=>s+Math.round((l.qte||0)*(l.coutUnitaireCt||0)),0); }
function devisLignesSansCout(dv){ return (dv&&dv.lignes||[]).filter(l=>!l.coutUnitaireCt && l.prixUnitaireCt).length; }
function devisMargeCt(dv){ return devisTotals(dv).htCt - devisCoutCt(dv); }
function devisMargePct(dv){ const ht = devisTotals(dv).htCt; return ht>0 ? Math.round(devisMargeCt(dv)/ht*1000)/10 : null; }
function canSeeMarge(){ return hasPermission("analytics.company.read"); }
function margeBadgeCls(pct){ if(pct==null) return "gray"; if(pct>=40) return "green"; if(pct>=15) return "gold"; return "red"; }
function devisMargeHtml(dv){
  if(!canSeeMarge()) return "";
  const pct = devisMargePct(dv), sans = devisLignesSansCout(dv);
  return `<div class="marge-box">
    <div class="marge-row"><span>Coût estimé (achat)</span><b>${fmtEuros(devisCoutCt(dv))}</b></div>
    <div class="marge-row"><span>Marge prévisionnelle</span><b>${fmtEuros(devisMargeCt(dv))}</b> ${pct!=null?badge(pct+" %", margeBadgeCls(pct)):""}</div>
    ${sans?`<p class="form-help" style="margin:6px 0 0">Estimation : ${sans} ligne(s) sans coût d’achat renseigné.</p>`:""}
  </div>`;
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

// ---------- Chantier (simulé, voir docs/erp/WORKFLOWS.md) ----------
const POSEURS = ["Marc Petit","Nadia Cools","Yanis Costa","Farid Haddad"];
const CHANTIER_STATUTS = ["À préparer","En attente acompte","Matériel à préparer","Prêt à planifier","Planifié","En cours","Bloqué","Terminé","À réceptionner","Clôturé","Annulé"];
const CHANTIER_STATUT_CLS = {"Terminé":"green","Clôturé":"green","En cours":"gold","Bloqué":"red","Annulé":"gray"};
function chantierStatutCls(s){ return CHANTIER_STATUT_CLS[s] || "blue"; }
const CHECKLIST_TEMPLATE = {
  avant: ["Matériel chargé","EPI vérifiés","Accès confirmé avec le client","Protection des zones sensibles","Documents chantier imprimés/disponibles"],
  pendant: ["Dépose des éléments existants","Pose / réparation réalisée","Reprise de zinguerie si prévue","Nettoyage au fur et à mesure"],
  fin: ["Nettoyage du chantier","Évacuation des déchets","Contrôle qualité de la pose","Photos après travaux prises","Réserves éventuelles notées","Validation avec le client"]
};
function freshChecklist(){
  const c = {};
  Object.keys(CHECKLIST_TEMPLATE).forEach(k=>{ c[k] = CHECKLIST_TEMPLATE[k].map(label=>({label, done:false})); });
  return c;
}
function freshChantier(){
  return {
    statut:"À préparer",
    equipe:[],
    dateDebut:null,
    dateFin:null,
    consignes:"",
    acces:"",
    equipement:"",
    checklist:freshChecklist(),
    photos:{avant:[],pendant:[],apres:[]},
    incidents:[]
  };
}
function incidentCatLabel(c){
  return {materiel:"Matériel manquant",technique:"Problème technique",acces:"Accès impossible",meteo:"Météo",dommage:"Dommage constaté",autre:"Autre"}[c] || c;
}

// ---------- Rôles, salariés et accès par onglet (modifiables depuis Paramètres) ----------
// NB : application 100 % navigateur, sans serveur : les comptes, demandes d'accès et droits sont
// mémorisés dans ce navigateur (localStorage). Voir docs/erp/TARGET_ARCHITECTURE.md pour la version serveur.

const ROLES = {
  directeur:{ label:"Directeur", avatar:"DI" },
  admin:{ label:"Administrateur", avatar:"AD" },
  tech:{ label:"Technicien", avatar:"TE" },
  sales:{ label:"Commercial", avatar:"CO" },
  client:{ label:"Client", avatar:"CL" }
};
const ACCESS_LEVELS = ["Aucun","Lecture","Édition"];

// Un "module" = un onglet (ou une moitié d'onglet) dont l'accès se règle par rôle.
const MODULES = [
  {id:"overview", section:"overview", label:"Vue d’ensemble", readOnly:true},
  {id:"dossiers", section:"dossiers", label:"Dossiers clients"},
  {id:"agenda", section:"agenda", label:"Agenda d’équipe"},
  {id:"entretiens", section:"entretiens", label:"Entretiens"},
  {id:"diagnostics", section:"diagnostics", label:"Diagnostics"},
  {id:"commercial", section:"commercial", label:"Suivi commercial"},
  {id:"devis", section:"devis", label:"Devis"},
  {id:"factures", section:"factures", label:"Factures"},
  {id:"prestations", section:"prestations", label:"Prestations"},
  {id:"materiel", section:"materiel", label:"Matériel"},
  {id:"parrainages", section:"parrainages", label:"Parrainages"},
  {id:"connexions", section:"connexions", label:"Connexions"},
  {id:"client-preview", section:"client-preview", label:"Aperçu espace client", readOnly:true}
];
const CONFIG_ROLES = ["admin","tech","sales"];
const SECTION_ORDER = ["overview","dossiers","agenda","entretiens","diagnostics","commercial","devis","factures","prestations","materiel","parrainages","connexions","client-preview"];

const DEFAULT_ACCESS = {
  admin:{overview:1, dossiers:2, agenda:2, entretiens:2, diagnostics:2, commercial:2, devis:2, factures:2, prestations:2, materiel:2, parrainages:2, connexions:2, "client-preview":1},
  tech:{overview:1, dossiers:2, agenda:2, entretiens:0, diagnostics:2, commercial:0, devis:2, factures:2, prestations:1, materiel:1, parrainages:2, connexions:0, "client-preview":0},
  sales:{overview:1, dossiers:2, agenda:2, entretiens:2, diagnostics:1, commercial:2, devis:2, factures:2, prestations:1, materiel:1, parrainages:2, connexions:0, "client-preview":0}
};

const SETTINGS_KEY = "mt_settings_v1";
function seedEmployees(){
  const mk = (id, nom, role, poste)=>({id, nom, role, poste, email: nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z]+/g,".")+"@maitretoiturier.fr", telephone:"", statut:"actif", ajoute:"1 sept.", pwdHash:null});
  const list = [mk("E1","Direction","directeur","Directeur"), mk("E2","Administration","admin","Administration"), mk("E3","Julien Bernard","tech","Technicien"), mk("E4","Léa Petit","tech","Technicienne"), mk("E5","Sarah Durand","sales","Commerciale"), mk("E6","Lucas Robert","sales","Commercial")];
  list[0].email = "direction@maitretoiturier.fr";
  return list;
}
const DEFAULT_MATERIEL_LIB = [
  {id:"charpente", label:"Charpente à changer", items:["Échafaudage ou nacelle","Bois de charpente (chevrons, pannes, liteaux)","Tronçonneuse + lames de rechange","Scie circulaire","Visserie, pointes et boulons","Équerres et sabots de fixation","Niveau, mètre et cordeau","Bâches de protection","Casque, harnais et gants","Éclairage de chantier + rallonges"]},
  {id:"couverture", label:"Réfection de couverture", items:["Échafaudage ou nacelle","Tuiles / ardoises de remplacement","Liteaux et contre-liteaux","Écran sous-toiture","Faîtières et closoirs","Clous et crochets","Marteau, ardoisier, coupe-tuiles","Monte-matériaux","Bâches de protection","Harnais et EPI"]},
  {id:"fuite", label:"Réparation de fuite / solin", items:["Échelle homologuée","Bande d’étanchéité et solin","Mastic / résine d’étanchéité","Chalumeau ou pistolet à air chaud","Tuiles de remplacement","Lampe frontale","Bâche de protection provisoire","Harnais et EPI"]},
  {id:"zinguerie", label:"Zinguerie et gouttières", items:["Échelle ou nacelle","Gouttières et descentes","Crochets et colliers","Silicone / colle d’étanchéité","Scie à métaux, cisaille","Rivets et visseuse","Niveau","Harnais et EPI"]},
  {id:"demoussage", label:"Nettoyage et démoussage", items:["Nettoyeur haute pression","Produit anti-mousse / hydrofuge","Pulvérisateur","Brosses et racloirs","Bâches et protections","Tuyau et raccords","Harnais et EPI"]},
  {id:"velux", label:"Pose de fenêtre de toit", items:["Fenêtre de toit + kit d’habillage","Raccord d’étanchéité (solin)","Chevrons et liteaux","Scie sabre","Visseuse et vis","Isolant et pare-vapeur","Échelle ou nacelle","Harnais et EPI"]},
  {id:"controle", label:"Visite de contrôle / diagnostic", items:["Échelle homologuée","Harnais et casque","Smartphone ou tablette (rapport + photos)","Drone (si besoin)","Lampe frontale","Mètre laser","Jumelles"]}
];
function defaultSettings(){
  return {
    access: JSON.parse(JSON.stringify(DEFAULT_ACCESS)),
    company: {nom:"Maître Toiturier", telephone:"", email:"", site:"www.maitretoiturier.fr", adresse:"", siret:"", iban:"", devisValidite:30, acomptePct:30},
    employees: seedEmployees(),
    requests: [],
    invitations: [],
    resets: [],
    materielLib: JSON.parse(JSON.stringify(DEFAULT_MATERIEL_LIB))
  };
}
let SETTINGS = defaultSettings();
function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);
    SETTINGS = Object.assign(defaultSettings(), saved);
    SETTINGS.company = Object.assign(defaultSettings().company, saved.company||{});
    CONFIG_ROLES.forEach(r=>{
      SETTINGS.access[r] = Object.assign({}, DEFAULT_ACCESS[r], (saved.access||{})[r]||{});
    });
  }catch(e){}
}
function saveSettings(){ if(typeof SRV!=="undefined" && SRV.on){ srvSettingsSoon(); return; } try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }catch(e){} }
loadSettings();

function accessLevel(role, mod){
  if(role==="directeur") return 2;
  if(role==="client") return 0;
  const a = SETTINGS.access[role];
  const v = a ? (a[mod]||0) : 0;
  const m = MODULES.find(x=>x.id===mod);
  return m && m.readOnly ? Math.min(v,1) : v;
}
function lvl(mod){ return accessLevel(state.role, mod); }
function canView(mod){ return lvl(mod)>=1; }
function canEditMod(mod){ return lvl(mod)>=2; }
function isManager(){ return state.role==="directeur" || state.role==="admin"; }

function sectionInNav(section){
  if(state.role==="client") return section==="client";
  if(section==="parametres") return isManager();
  return MODULES.some(m=>m.section===section && lvl(m.id)>=1);
}
// Une section reste atteignable si elle sert de porte d'entrée à un module autorisé (ex. fiche dossier depuis les devis).
function sectionReachable(section){
  if(sectionInNav(section)) return true;
  if(section==="dossiers") return ["diagnostics","commercial","devis","factures","parrainages"].some(canView);
  return false;
}
function sectionLabel(section){
  const m = MODULES.find(x=>x.section===section);
  return m ? m.label : section;
}
function navItems(){
  if(state.role==="client") return [["client","Mon espace client"]];
  const items = SECTION_ORDER.filter(sectionInNav).map(s=>[s, sectionLabel(s)]);
  if(isManager()) items.push(["parametres","Paramètres"]);
  return items;
}
function firstSection(){ const n = navItems(); return n.length ? n[0][0] : "overview"; }

function hasPermission(perm){
  const r = state.role;
  if(r==="client") return perm==="client.read.own" || perm==="diagnostic.read.own";
  const mgr = isManager();
  const scope = mgr ? "all" : (r==="sales" ? "team" : "own");
  switch(perm){
    case "client.read.all": case "client.read.team": case "client.read.own":
      return perm==="client.read."+scope && lvl("dossiers")>=1;
    case "client.create": return lvl("dossiers")>=2;
    case "client.update": case "lead.assign": case "appointment.create": case "appointment.update":
      return mgr && lvl("dossiers")>=2;
    case "diagnostic.read.all": case "diagnostic.read.team": case "diagnostic.read.own":
      return perm==="diagnostic.read."+scope && lvl("diagnostics")>=1;
    case "diagnostic.execute": return lvl("diagnostics")>=2;
    case "opportunity.read.all": case "opportunity.read.team": case "opportunity.read.own":
      return perm==="opportunity.read."+scope && lvl("commercial")>=1;
    case "opportunity.update": return lvl("commercial")>=2;
    case "quote.create": case "quote.update": case "quote.send": case "quote.accept": return lvl("devis")>=2;
    case "invoice.create": case "payment.register": return lvl("factures")>=2;
    case "job.read.all": case "job.read.team": case "job.read.own":
      return perm==="job.read."+scope && lvl("dossiers")>=1;
    case "job.update": return mgr && lvl("dossiers")>=2;
    case "referral.create": return lvl("parrainages")>=2;
    case "contract.manage": return lvl("entretiens")>=2;
    case "team.manage": case "settings.manage": return r==="directeur";
    case "analytics.company.read": return mgr;
  }
  return false;
}
function canReadJob(){ return hasPermission("job.read.all") || hasPermission("job.read.team") || hasPermission("job.read.own"); }

// ---------- Utilisateur courant ----------
function currentUser(){ return SETTINGS.employees.find(e=>e.id===state.userId) || null; }
function currentName(){
  const u = currentUser();
  if(u) return u.nom;
  if(state.role==="client") return "Marie Laurent";
  return ROLES[state.role] ? ROLES[state.role].label : "Équipe";
}
function authorLabel(){ return currentName(); }
function activeStaff(role){ return SETTINGS.employees.filter(e=>e.statut==="actif" && (!role || e.role===role)).map(e=>e.nom); }
function teamNames(){ return activeStaff(); }
function pendingRequests(){ return SETTINGS.requests.filter(r=>r.statut==="en attente"); }

async function hashPwd(pwd){
  const bytes = new TextEncoder().encode("maitre-toiturier:"+pwd);
  const h = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,"0")).join("");
}

function enterAs(userId){
  if(userId==="CLIENT"){ state.userId = "CLIENT"; state.role = "client"; }
  else { const e = SETTINGS.employees.find(x=>x.id===userId); state.userId = e.id; state.role = e.role; }
  state.dossierId = null;
  state.section = firstSection();
  state.appStage = "app";
  state.loginMsg = "";
}

async function doLogin(){
  if(SRV.on){
    const em = (document.getElementById("loginEmail").value||"").trim().toLowerCase(), pw = document.getElementById("loginPwd").value||"";
    state.loginEmail = em;
    try{ await srvAuthCall({action:"login", email:em, password:pw}); }catch(e){ state.loginMsg = e.message; render(); }
    return;
  }
  const email = (document.getElementById("loginEmail").value||"").trim().toLowerCase();
  const pwd = document.getElementById("loginPwd").value||"";
  state.loginEmail = email;
  const emp = SETTINGS.employees.find(e=>e.email.toLowerCase()===email);
  const req = SETTINGS.requests.find(r=>r.email.toLowerCase()===email);
  const bad = "E-mail ou mot de passe incorrect.";
  if(emp){
    if(!emp.pwdHash) state.loginMsg = "Ce compte n’a pas de mot de passe : utilisez « Entrer en mode démo » ci-dessous.";
    else if(await hashPwd(pwd) !== emp.pwdHash) state.loginMsg = bad;
    else if(emp.statut==="suspendu") state.loginMsg = "Votre accès est suspendu. Contactez la direction.";
    else { enterAs(emp.id); if(emp.mustChange) state.modal = {type:"chgpwd"}; render(); return; }
  } else if(req){
    if(await hashPwd(pwd) !== req.pwdHash) state.loginMsg = bad;
    else if(req.statut==="en attente") state.loginMsg = "Votre demande d’accès est en attente de validation par la direction.";
    else state.loginMsg = "Votre demande d’accès a été refusée. Contactez la direction.";
  } else state.loginMsg = bad;
  render();
}

async function doSignup(){
  const val = id=>(document.getElementById(id).value||"").trim();
  const nom = val("suNom"), email = val("suEmail").toLowerCase(), tel = val("suTel"), poste = val("suPoste");
  const pwd = document.getElementById("suPwd").value, pwd2 = document.getElementById("suPwd2").value;
  state.signup = {nom, email, tel, poste};
  if(!nom || !email){ state.signupMsg = "Indiquez votre nom et votre e-mail."; render(); return; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ state.signupMsg = "Cette adresse e-mail n’est pas valide."; render(); return; }
  if(pwd.length<8){ state.signupMsg = "Le mot de passe doit contenir au moins 8 caractères."; render(); return; }
  if(pwd!==pwd2){ state.signupMsg = "Les deux mots de passe ne correspondent pas."; render(); return; }
  if(SRV.on){
    try{ await srvApi("auth", "POST", {action:"signup", nom, email, tel, poste, password:pwd}); state.signupMsg = ""; state.appStage = "signup-done"; }
    catch(e){ state.signupMsg = e.message; }
    render(); return;
  }
  if(SETTINGS.employees.some(e=>e.email.toLowerCase()===email) || SETTINGS.requests.some(r=>r.email.toLowerCase()===email && r.statut!=="refusé")){
    state.signupMsg = "Un accès existe déjà pour cette adresse e-mail."; render(); return;
  }
  SETTINGS.requests = SETTINGS.requests.filter(r=>r.email.toLowerCase()!==email);
  SETTINGS.requests.push({id:"R"+Date.now(), nom, email, telephone:tel, poste, pwdHash:await hashPwd(pwd), date:"12 sept., "+new Date().toTimeString().slice(0,5), statut:"en attente"});
  saveSettings();
  state.signupMsg = "";
  state.appStage = "signup-done";
  render();
}

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
  role:"directeur",
  userId:"E1",
  paramTab:"equipe",
  loginMsg:"",
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

// Les données sont COMMUNES à toute l'équipe : chacun voit tous les dossiers ; « Mes dossiers » filtre ceux qui vous sont attribués.
function visibleDossiers(){
  if(state.role==="client") return DOSSIERS.filter(d=>d.client==="Marie Laurent");
  return DOSSIERS;
}
function isMine(d){
  const n = currentName();
  return d.technicien===n || d.commercial===n || (d.creePar && d.creePar.id===state.userId);
}
function otherChantiers(d){
  return visibleDossiers().filter(x=>x.id!==d.id && x.client.trim().toLowerCase()===d.client.trim().toLowerCase());
}
function myDossiers(){
  if(state.role==="tech" || state.role==="sales") return visibleDossiers().filter(isMine);
  return visibleDossiers();
}
function visibleContracts(){ return CONTRACTS; }
function visibleParrainages(){ return PARRAINAGES; }

function canCreateDemande(){ return hasPermission("client.create"); }
function canPlanifierVisite(){ return hasPermission("appointment.create"); }
function canNouveauContrat(){ return hasPermission("contract.manage"); }
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
  "Éléments de finition":1,
  "Zinguerie":1,
  "Fenêtres de toit (Velux)":1,
  "Cheminées et souches":1,
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
    doc:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2.8h8.2L19 7.6V21H6z"/><path d="M14 2.8v5h5"/><path d="M9 12h7M9 15h7M9 18h4.5"/></g>`,
    wrench:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></g>`,
    helmet:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></g>`,
    pin:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></g>`,
    globe:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 2.5a14 14 0 0 0 0 19 14 14 0 0 0 0-19"/><path d="M2.5 12h19"/></g>`,
    camera:`<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.2"/></g>`,
    idea:`<path d="M9 18.5h6M9.7 21h4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 2.8a6 6 0 0 0-3.4 10.9c.6.45 1 1.15 1 1.95v.35h4.8v-.35c0-.8.4-1.5 1-1.95A6 6 0 0 0 12 2.8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`,
    calendar:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></g>`,
    user:`<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></g>`,
    team:`<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-6.2 6.2-6.2S15.2 16.6 15.2 20"/><circle cx="17" cy="9" r="2.6"/><path d="M14.8 13.8c2.9.2 5.2 2.7 5.2 5.8"/></g>`
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">${inner[name]||""}</svg>`;
}

function actionLabelFor(pointName, decision){
  if(decision==="Réparer") return "Réparer — "+pointName;
  if(decision==="Remplacer") return "Remplacer — "+pointName;
  if(decision==="Surveiller") return "Surveiller — "+pointName;
  if(decision==="Contrôle complémentaire") return "Compléter le contrôle — "+pointName;
  return "Traiter — "+pointName;
}

function catalogFilter(input){
  const q = input.value.trim().toLowerCase();
  input.closest(".card").querySelectorAll(".cat-item, .pc-row-m[data-search]").forEach(el=>{
    el.style.display = !q || el.dataset.search.includes(q) ? "" : "none";
  });
}
// Filtre les puces prestations/matériel de l'assistant devis, et masque les groupes vides.
function wzCatFilter(input){
  const q = input.value.trim().toLowerCase();
  document.querySelectorAll(".wz-catlist").forEach(list=>{
    let any = false;
    list.querySelectorAll(".wz-chip[data-search]").forEach(chip=>{
      const show = !q || chip.dataset.search.includes(q);
      chip.style.display = show ? "" : "none";
      if(show) any = true;
    });
    list.style.display = (q && !any) ? "none" : "";
  });
}

function showToast(msg){
  state.toast = msg;
  render();
  setTimeout(()=>{ state.toast=null; render(); }, 2600);
}

// ---------- render root ----------

function render(){
  DOSSIERS.forEach(dd=>syncProcess(dd));
  const app = document.getElementById("app");
  const oldContent = app.querySelector(".content");
  const savedScrollTop = oldContent ? oldContent.scrollTop : 0;
  const savedScrollY = window.scrollY;
  app.innerHTML = buildApp();
  fitPointPages();
  if(document.fonts && document.fonts.status!=="loaded") document.fonts.ready.then(()=>fitPointPages());
  numberPdfPages();
  applyPdfScale();
  scheduleSave();
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
    const timer = setTimeout(()=>reject(new Error("Délai dépassé (connexion trop lente ou bloquée) : "+src)), 15000);
    s.onload = ()=>{ clearTimeout(timer); resolve(); };
    s.onerror = ()=>{ clearTimeout(timer); reject(new Error("Échec de chargement : "+src)); };
    document.head.appendChild(s);
  });
}

async function buildPdfFromHtml(docHtmlString, onProgress){
  await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
  await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");

  // Le rapport est rendu dans une iframe isolée : html2canvas clone tout le document à chaque page,
  // ce qui est très lent avec toute l'application autour.
  const styles = Array.from(document.querySelectorAll("style, link[rel=stylesheet]")).map(el=>el.outerHTML).join("");
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;left:-99999px;top:0;width:794px;height:1123px;border:0";
  iframe.srcdoc = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${location.href}">${styles}</head><body style="margin:0;background:#fff">${docHtmlString}</body></html>`;
  const withTimeout = (p, ms, label)=>Promise.race([p, new Promise((_,rej)=>setTimeout(()=>rej(new Error("Délai dépassé : "+label)), ms))]);
  const loaded = new Promise(res=>{ iframe.onload = res; });
  document.body.appendChild(iframe);
  try{
    await withTimeout(loaded, 15000, "chargement du document");
    const doc = iframe.contentDocument;
    if(doc.fonts && doc.fonts.ready) await withTimeout(doc.fonts.ready, 8000, "polices").catch(()=>{});
    const imgs = Array.from(doc.querySelectorAll("img"));
    await Promise.all(imgs.map(img=>img.complete ? Promise.resolve() : new Promise(res=>{ img.onload=res; img.onerror=res; setTimeout(res, 10000); })));

    fitPointPages(doc);
    numberPdfPages(doc);
    // html2canvas rend mal les box-shadow (voile gris sur la page) : on les retire pour l'export.
    doc.querySelectorAll(".pdf-page,.pp-card,.pp-pill").forEach(el=>{ el.style.boxShadow = "none"; });

    const pages = Array.from(doc.querySelectorAll(".pdf-page"));
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit:"mm", format:"a4", orientation:"portrait" });
    for(let i=0;i<pages.length;i++){
      if(onProgress) onProgress(i+1, pages.length);
      const canvas = await window.html2canvas(pages[i], { scale:2, useCORS:true, backgroundColor:"#ffffff", imageTimeout:15000 });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      if(i>0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, "", "FAST");
    }
    return pdf.output("blob");
  } finally {
    iframe.remove();
  }
}

function buildReportPdf(d, onProgress){ return buildPdfFromHtml(renderReportDoc(d), onProgress); }

function downloadBlob(blob, filename){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}

function reportFilename(d){ return `rapport-diagnostic-${d.id}.pdf`; }

async function generateAndDownloadPdf(d){
  showToast("Génération du PDF…");
  try{
    const blob = await buildReportPdf(d);
    downloadBlob(blob, reportFilename(d));
    showToast("PDF téléchargé.");
  } catch(e){
    showToast("La génération du PDF a échoué (connexion internet requise). Réessayez.");
  }
}

// Message d'accompagnement chaleureux et commercial, adapté au contenu réel du diagnostic.
function reportMessage(d, channel){
  const flagged = POINTS.filter(p=>["Défaut constaté","À surveiller","Urgent"].includes(d.diagnostic.points[p].etat));
  const urgent = POINTS.filter(p=>d.diagnostic.points[p].etat==="Urgent").length;
  const sign = d.commercial || "L’équipe Maître Toiturier";
  const wa = channel==="whatsapp";
  const summary = flagged.length===0
    ? `Bonne nouvelle : l’ensemble des zones contrôlées est en bon état${wa?" 👍":"."}`
    : `Nous avons relevé ${flagged.length} point${flagged.length>1?"s":""} qui mérite${flagged.length>1?"nt":""} votre attention${urgent?`, dont ${urgent} à traiter en priorité`:""}, avec pour chacun nos conseils.`;
  const cta = flagged.length===0
    ? "Pour préserver votre toiture dans la durée, je peux aussi vous proposer un contrôle périodique."
    : `Si vous le souhaitez, je vous prépare avec plaisir un devis détaillé pour les travaux recommandés${wa?" : il suffit de me répondre ici. 📩":"."}`;
  if(wa){
    return `Bonjour ${d.client} 👋\n\nMerci encore pour votre confiance ! 🏠\nSuite à notre passage, je vous transmets votre rapport de diagnostic de toiture personnalisé (dossier ${d.id}), en pièce jointe.\n\n${summary}\n\nVous y trouverez, zone par zone, nos constats en photos et nos recommandations, expliqués simplement.\n\n${cta}\n\nJe reste à votre entière disposition pour en discuter. 😊\n\n${sign}\nMaître Toiturier — www.maitretoiturier.fr`;
  }
  return `Bonjour ${d.client},\n\nMerci encore pour la confiance que vous nous accordez.\n\nSuite à notre passage, je vous adresse avec plaisir, en pièce jointe, votre rapport de diagnostic de toiture personnalisé (dossier ${d.id}).\n\n${summary}\n\nVous y trouverez, zone par zone, nos constats en photos et nos recommandations, expliqués simplement.\n\n${cta}\n\nJe reste à votre entière disposition pour en discuter ou répondre à toutes vos questions.\n\nBien cordialement,\n\n${sign}\nMaître Toiturier\nwww.maitretoiturier.fr`;
}

// ---------- Devis & factures en PDF (même trame que la couverture du rapport) ----------

function findDevis(d, id){ return d.devis.find(x=>x.id===id); }
function findFacture(d, id){ return d.factures.find(x=>x.id===id); }

// Répartition HT / TVA d'une facture, au prorata du devis auquel elle se rattache.
function factureTotals(d, f){
  const dv = findDevis(d, f.devisId);
  const dt = dv ? devisTotals(dv) : null;
  const ratio = dt && dt.ttcCt ? dt.tvaCt / dt.ttcCt : 0;
  const tvaCt = Math.round(f.montantTtcCt * ratio);
  return { htCt: f.montantTtcCt - tvaCt, tvaCt, ttcCt: f.montantTtcCt };
}

// ---------- Conditions de règlement : échéancier personnalisable (1 à 3 étapes, % et libellé libres) ----------
const PAY_MODES = ["Virement","Chèque","Carte bancaire","Espèces"];
// Unités courantes du bâtiment, pour les prestations/matériel et les lignes de devis.
const UNIT_OPTIONS = ["u","forfait","ml","m²","m³","kg","L","h","jour","lot","sac","rouleau"];
function unitOptionsHtml(current){
  const opts = UNIT_OPTIONS.includes(current) || !current ? UNIT_OPTIONS : [current, ...UNIT_OPTIONS];
  return opts.map(u=>`<option value="${esc(u)}" ${current===u?"selected":""}>${esc(u)}</option>`).join("");
}
function unitSelectHtml(id, current){ return `<select id="${id}">${unitOptionsHtml(current)}</select>`; }
const PAY_FOIS = [1,2,3];

// Répartitions par défaut, ajustables ensuite ligne par ligne (libellé + %) dans l'assistant devis.
function defaultEcheancier(fois){
  const ac = SETTINGS.company.acomptePct || 30;
  if(fois===2) return [{label:"Acompte à la signature", pct:ac},{label:"Solde à la fin des travaux", pct:100-ac}];
  if(fois===3) return [{label:"Acompte à la signature", pct:40},{label:"Paiement mi-chantier", pct:30},{label:"Solde à la fin des travaux", pct:30}];
  return [{label:"Paiement intégral", pct:100}];
}
function paiementDefaults(){ return {echeancier: defaultEcheancier(2), mode:"Virement"}; }
// Migre en douceur les anciens devis (format acompte/acomptePct/fois) vers l'échéancier, sans rien casser.
function devisPaiement(dv){
  const raw = (dv && dv.paiement) || {};
  if(Array.isArray(raw.echeancier) && raw.echeancier.length) return {echeancier: raw.echeancier, mode: raw.mode || "Virement"};
  if(raw.acompte!=null){
    const pct = raw.acomptePct || 30, fois = Math.max(1, raw.fois || 1), rest = 100 - (raw.acompte ? pct : 0);
    const steps = raw.acompte ? [{label:"Acompte à la signature", pct}] : [];
    const base = Math.floor(rest / fois);
    for(let i=0;i<fois;i++){
      const p2 = i===fois-1 ? rest - base*(fois-1) : base;
      steps.push({label: fois>1 ? (raw.acompte?"Solde ":"Règlement ")+(i+1)+"/"+fois : (raw.acompte?"Solde":"Paiement intégral"), pct:p2});
    }
    return {echeancier: steps, mode: raw.mode || "Virement"};
  }
  return Object.assign({}, paiementDefaults());
}
// Montant TTC de l'étape idx : les étapes intermédiaires prennent le % arrondi, la dernière absorbe l'écart d'arrondi.
function echeanceTtcCt(dv, idx){
  const p = devisPaiement(dv), ttc = devisTotals(dv).ttcCt, steps = p.echeancier;
  if(!steps[idx]) return 0;
  if(idx < steps.length-1) return Math.round(ttc * steps[idx].pct / 100);
  const before = steps.slice(0, idx).reduce((s,e,i)=>s+echeanceTtcCt(dv,i), 0);
  return Math.max(0, ttc - before);
}
function acompteTtcCt(dv){ return echeanceTtcCt(dv, 0); }

function paiementSummary(dv){
  const p = devisPaiement(dv);
  const parts = p.echeancier.map((e,i)=>`${e.label} (${e.pct} %, ${fmtEuros(echeanceTtcCt(dv,i))})`);
  return `Règlement : ${parts.join(", puis ")}, par ${p.mode==="Carte bancaire" ? "carte bancaire" : p.mode.toLowerCase()}.`;
}

function buildEcheances(ttcCt, fois, start){
  const n = Math.max(1, fois);
  const base = Math.floor(ttcCt / n);
  const arr = [];
  for(let i=0;i<n;i++){
    arr.push({date:fmtDayMonth(addDays(start, 30*i)), montantCt: i===n-1 ? ttcCt - base*(n-1) : base});
  }
  return arr;
}

function factureLabel(d, f){ return f.type || "Facture"; }

// Statut de chaque échéance d'une facture, d'après les règlements encaissés.
function echeancesStatus(f){
  const paid = facturePaidCt(f);
  let cum = 0;
  return (f.echeances||[]).map(e=>{
    cum += e.montantCt;
    return Object.assign({}, e, {reglee: paid >= cum - 1});
  });
}

// Étapes déjà facturées pour ce devis (par index d'échéancier).
function billedSteps(d, dv){ return (d.factures||[]).filter(f=>f.devisId===dv.id).map(f=>f.stepIdx); }
// Prochaine étape de l'échéancier pas encore facturée (ou null si tout est facturé).
function nextEcheancierStep(d, dv){
  const p = devisPaiement(dv), billed = billedSteps(d, dv);
  for(let i=0;i<p.echeancier.length;i++) if(!billed.includes(i)) return i;
  return null;
}
// Crée la facture correspondant à une étape de l'échéancier (idx) : une facture par paiement prévu.
function createFacture(d, dv, stepIdx, o){
  o = o || {};
  const p = devisPaiement(dv), step = p.echeancier[stepIdx];
  const montant = o.montantCt!=null ? o.montantCt : echeanceTtcCt(dv, stepIdx);
  const numero = nextFactureId(d);
  const isFirst = stepIdx===0, isLast = stepIdx===p.echeancier.length-1;
  const f = {
    id:numero, numero, type: step.label, stepIdx, stepPct: step.pct, isFirst, isLast, devisId:dv.id,
    libelle: step.label,
    montantTtcCt: montant, statut:"Brouillon", date:"12 sept.",
    echeance: o.echeance || fmtDayMonth(addDays(TODAY_REF, 15)), echeances:[{date:o.echeance || fmtDayMonth(addDays(TODAY_REF, 15)), montantCt:montant}],
    mode: o.mode || p.mode, paiements:[]
  };
  d.factures.push(f);
  d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Facture « "+step.label+" » créée ("+fmtEuros(montant)+")."});
  return f;
}

// ---------- Processus commercial : devis → gagné → facture(s) → impayé → payé ----------
// L'étape commerciale d'un dossier avec devis accepté est PILOTÉE par les données (factures, paiements) :
// elle se met à jour toute seule à chaque paiement enregistré, supprimé ou confirmé.
const PROCESS_STAGES = ["À contacter","Devis à préparer","Devis envoyé","Gagné","Impayé","Payé","Perdu"];
const MANUAL_STAGES = ["À contacter","Devis à préparer","Devis envoyé","Perdu"];

function acceptedDevis(d){
  const a = (d.devis||[]).filter(v=>v.statut==="Accepté");
  return a.length ? a[a.length-1] : null;
}
function billingOf(d){
  const dv = acceptedDevis(d);
  if(!dv) return null;
  const ttc = devisTotals(dv).ttcCt;
  const fs = (d.factures||[]).filter(f=>f.devisId===dv.id);
  const invoiced = fs.reduce((s,f)=>s+f.montantTtcCt,0);
  const paid = fs.reduce((s,f)=>s+facturePaidCt(f),0);
  const due = fs.reduce((s,f)=>s+Math.max(0, f.montantTtcCt-facturePaidCt(f)),0);
  const annonce = fs.reduce((s,f)=>s+(f.paiements||[]).filter(p=>p.mode==="Virement" && p.virementStatut!=="Confirmé").reduce((a,p)=>a+p.montantCt,0),0);
  const remaining = Math.max(0, ttc-invoiced);
  return {dv, ttc, fs, invoiced, paid, due, remaining, annonce, count:fs.length};
}
function processStageOf(b){
  if(!b.count) return "Gagné";
  if(b.due>1) return "Impayé";
  if(b.remaining>1) return "Gagné";
  return "Payé";
}
// Recalcule l'étape commerciale et referme les tâches de relance devenues inutiles.
function syncProcess(d, quiet){
  const b = billingOf(d);
  if(!b) return;
  (b.fs||[]).forEach(f=>{
    if(facturePaidCt(f)>=f.montantTtcCt-1) (d.taches||[]).forEach(t=>{ if(t.autoFacture===f.id && !t.done) t.done = true; });
  });
  const stage = processStageOf(b);
  if(d.commercialStage!==stage){
    if(!quiet && d.historique) d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:"Suivi automatique", texte:"Étape commerciale : "+d.commercialStage+" → "+stage+"."});
    d.commercialStage = stage;
  }
}
function processSummary(d){
  const b = billingOf(d);
  if(!b) return null;
  if(!b.count) return "Facture à créer";
  if(b.due>1) return "Reste à encaisser "+fmtEuros(b.due);
  if(b.remaining>1) return "Solde de "+fmtEuros(b.remaining)+" à facturer";
  return "Soldé";
}

// Crée la première facture prévue par l'échéancier du devis (une seule fois). Les suivantes se
// créent au fil du chantier via "Créer la facture suivante" (processButtons).
function ensureInvoices(d, dv){
  if((d.factures||[]).some(f=>f.devisId===dv.id)) return null;
  const f = createFacture(d, dv, 0);
  addFactureTask(d, f);
  return f;
}
function addFactureTask(d, f){
  d.taches = d.taches || [];
  d.taches.push({id:nextTaskId(d), titre:"Encaisser « "+f.type+" » "+f.numero+" ("+fmtEuros(f.montantTtcCt)+")", echeance:f.echeance||"", assigne:d.commercial||"", done:false, autoFacture:f.id});
}

function winPreview(d){
  const dv = (d.devis||[]).filter(v=>v.statut!=="Refusé").slice(-1)[0];
  if(!dv) return null;
  const p = devisPaiement(dv), ttc = devisTotals(dv).ttcCt;
  const first = p.echeancier[0], ac = echeanceTtcCt(dv, 0);
  const suite = p.echeancier.length>1 ? " Les "+(p.echeancier.length-1)+" facture(s) suivante(s) ("+p.echeancier.slice(1).map(e=>e.label).join(", ")+") se créeront au fur et à mesure du chantier." : "";
  return {dv, ttc, p, ac, text: "Le devis "+dv.numero+" ("+fmtEuros(ttc)+") sera accepté. Automatiquement : le chantier est préparé, la facture « "+first.label+" » de "+fmtEuros(ac)+" est créée, et le client passe en « Impayé » jusqu’au paiement."+suite};
}
function askWin(d){
  const w = winPreview(d);
  if(!w) return;
  askConfirm("Marquer le devis comme gagné ?", w.text, ()=>winDevis(d), "Gagné ✓", "btn-primary");
}
function winDevis(d){
  const dv = (d.devis||[]).filter(v=>v.statut!=="Refusé").slice(-1)[0];
  if(!dv) return;
  if(dv.statut==="Brouillon"){ dv.statut = "Envoyé"; dv.dateEnvoi = dv.dateEnvoi || "12 sept."; }
  dv.statut = "Accepté";
  dv.dateAcceptation = "12 sept.";
  d.montant = Math.round(devisTotals(dv).ttcCt/100);
  stampHist(d, "Devis "+dv.numero+" gagné (accepté par le client).");
  if(!d.chantier){ d.chantier = freshChantier(); stampHist(d, "Chantier préparé automatiquement."); }
  let f = null;
  if(hasPermission("invoice.create")) f = ensureInvoices(d, dv);
  d.commercialStage = "Gagné";
  syncProcess(d);
  showToast(f ? "Gagné ! "+factureLabel(d,f)+" créée ("+fmtEuros(f.montantTtcCt)+") — client à encaisser." : "Devis gagné. Chantier préparé.");
  if(f) state.lastFacture = {id:d.id, fid:f.id};
}
// Corrige une erreur de manip : repasse le devis en « Envoyé » et retire les factures créées
// automatiquement, à condition qu'aucun paiement n'ait encore été enregistré dessus.
function revertDevis(d){
  const b = billingOf(d);
  if(!b || b.paid>0) return;
  const dv = b.dv;
  (b.fs||[]).forEach(f=>{
    d.taches = (d.taches||[]).filter(t=>t.autoFacture!==f.id);
  });
  d.factures = (d.factures||[]).filter(f=>f.devisId!==dv.id);
  dv.statut = "Envoyé";
  delete dv.dateAcceptation;
  d.commercialStage = "Devis envoyé";
  stampHist(d, "Retour en arrière : devis "+dv.numero+" repassé en « Envoyé », facture(s) associée(s) retirée(s).");
  showToast("Revenu au devis "+dv.numero+".");
}
function recordPayment(d, f, montantCt, mode, date, virementRecu){
  const pid = f.id+"-P"+((f.paiements||[]).length+1);
  f.paiements = f.paiements || [];
  f.paiements.push({id:pid, montantCt, mode, date:date||"12 sept.", virementStatut: mode==="Virement" ? (virementRecu ? "Confirmé" : "Annoncé") : null});
  f.statut = factureStatutFromPayments(f);
  stampHist(d, "Paiement de "+fmtEuros(montantCt)+" ("+mode+") enregistré sur "+f.numero+".");
  syncProcess(d);
  return f.paiements[f.paiements.length-1];
}
function nextEcheanceCt(f){
  const reste = Math.max(0, f.montantTtcCt - facturePaidCt(f));
  const list = echeancesStatus(f);
  const idx = list.findIndex(x=>!x.reglee);
  if(idx<0) return reste;
  const cum = list.slice(0, idx+1).reduce((s,x)=>s+x.montantCt, 0);
  return Math.max(0, Math.min(reste, cum - facturePaidCt(f)));
}

// Bandeau de processus : 4 étapes + prochaine action claire.
function processButtons(d){
  const dv = latestDevis(d), b = billingOf(d);
  const A = (label, attrs, cls)=>`<button class="${cls||"btn-secondary"} btn-sm" ${attrs}>${label}</button>`;
  const out = [];
  if(!dv){
    if(hasPermission("quote.create")) out.push(A("+ Créer le devis", `data-action="wizard-devis" data-id="${d.id}"`, "btn-primary"));
    return out;
  }
  if(!b){
    if(dv.statut==="Refusé") return hasPermission("quote.create") ? [A("+ Nouvelle version du devis", `data-action="wizard-devis" data-id="${d.id}"`, "btn-secondary")] : [];
    if(dv.statut==="Brouillon" && hasPermission("quote.send")) out.push(A("Envoyer le devis", `data-action="modal-send-doc" data-id="${d.id}" data-kind="devis" data-doc="${dv.id}"`, "btn-secondary"));
    if(hasPermission("quote.accept")){
      out.push(A("✓ Gagné", `data-action="win-devis" data-id="${d.id}"`, "btn-primary"));
      if(dv.statut==="Envoyé") out.push(A("Perdu", `data-action="devis-reject" data-id="${d.id}"`, "btn-ghost"));
    }
    return out;
  }
  if(b.count===0){
    if(hasPermission("invoice.create")) out.push(A("Créer la facture", `data-action="win-invoice" data-id="${d.id}"`, "btn-primary"));
    return out;
  }
  const open = b.fs.find(f=>f.montantTtcCt-facturePaidCt(f)>1);
  if(open){
    if(open.statut==="Brouillon" && hasPermission("invoice.create")) out.push(A("Envoyer la facture", `data-action="modal-send-doc" data-id="${d.id}" data-kind="facture" data-doc="${open.id}"`, "btn-secondary"));
    if(hasPermission("payment.register")) out.push(A("Enregistrer un paiement", `data-action="pay-open" data-id="${d.id}" data-fid="${open.id}"`, "btn-primary"));
  } else if(b.remaining>1 && hasPermission("invoice.create")){
    const nextIdx = nextEcheancierStep(d, dv);
    const label = nextIdx!=null ? devisPaiement(dv).echeancier[nextIdx].label : "suivante";
    out.push(A("Créer la facture « "+label+" »", `data-action="create-solde" data-id="${d.id}"`, "btn-primary"));
  }
  // Erreur de manip : si aucun paiement n'a encore été enregistré, on peut revenir en arrière
  // (redevient « Envoyé » et les factures créées automatiquement sont retirées).
  if(b.paid===0 && hasPermission("quote.accept")) out.push(A("↩ Revenir au devis", `data-action="revert-devis" data-id="${d.id}"`, "btn-ghost"));
  return out;
}
function renderProcessCard(d){
  const dv = latestDevis(d), b = billingOf(d);
  const lost = dv && dv.statut==="Refusé" && !b;
  const s1 = !!dv && dv.statut!=="Brouillon";
  const s2 = !!b;
  const s3 = !!b && b.count>0 && b.remaining<=1;
  const s4 = !!b && b.count>0 && b.remaining<=1 && b.due<=1;
  const steps = [
    {l:"Devis envoyé", done:s1, sub: dv ? (dv.statut==="Brouillon" ? "Brouillon" : fmtEuros(devisTotals(dv).ttcCt)) : "À créer"},
    {l:"Gagné", done:s2, sub: b ? "Accepté" : (lost ? "Refusé" : "En attente")},
    {l:"Facturé", done:s3, part: !!b && b.count>0 && !s3, sub: b ? (b.count ? fmtEuros(b.invoiced)+" / "+fmtEuros(b.ttc) : "À créer") : "—"},
    {l:"Payé", done:s4, part: !!b && b.paid>0 && !s4, sub: b ? fmtEuros(b.paid)+" / "+fmtEuros(b.ttc) : "—"}
  ];
  let curSet = false;
  const html = steps.map((s,i)=>{
    let cls = s.done ? "done" : (s.part ? "part" : "");
    if(!s.done && !curSet && !lost){ cls += " current"; curSet = true; }
    return `<div class="proc-step ${cls}"><div class="proc-dot">${s.done?"✓":i+1}</div><div class="proc-l">${esc(s.l)}</div><div class="proc-s">${esc(s.sub)}</div></div>`;
  }).join("");
  const btns = processButtons(d);
  const note = lost ? "Le client a refusé le devis." : (b ? (processSummary(d)||"") + (b.annonce>0 ? " · virement annoncé de "+fmtEuros(b.annonce)+" à confirmer" : "") : (dv ? (dv.statut==="Brouillon" ? "Envoyez le devis, puis marquez-le « Gagné » dès l’accord du client." : "Dès que le client accepte : « Gagné » crée la facture et le suivi de paiement.") : "Créez un devis pour lancer le processus."));
  return `
  <div class="card proc-card">
    <div class="card-header"><h3>Processus de l’affaire</h3>${d.commercialStage?badge(d.commercialStage, d.commercialStage==="Payé"||d.commercialStage==="Gagné"?"green":d.commercialStage==="Impayé"?"gold":d.commercialStage==="Perdu"?"red":"blue"):""}</div>
    <div class="proc-steps">${html}</div>
    <div class="proc-foot"><div class="proc-note">${esc(note)}</div><div class="proc-btns">${btns.join("")}</div></div>
  </div>`;
}

function modalPay(m){
  const d = byId(m.id), f = findFacture(d, m.fid);
  if(!f) return modalWrap("Paiement", "<p>Facture introuvable.</p>");
  const reste = Math.max(0, f.montantTtcCt - facturePaidCt(f));
  const sug = nextEcheanceCt(f) || reste;
  const ech = echeancesStatus(f);
  return modalWrap("Enregistrer un paiement", `
    <p class="form-help" style="margin:0 0 12px">${esc(d.client)} · ${esc(factureLabel(d,f))} ${esc(f.numero)} — reste dû <b>${fmtEuros(reste)}</b> sur ${fmtEuros(f.montantTtcCt)}.</p>
    ${ech.length>1 ? `<div style="margin-bottom:12px">${ech.map((e,i)=>`<div class="row-item"><div class="row-sub">Échéance ${i+1}/${ech.length} · ${esc(e.date||"")}</div><div>${fmtEuros(e.montantCt)} ${e.reglee?badge("Réglée","green"):badge("À venir","gray")}</div></div>`).join("")}</div>` : ""}
    <div class="form-field"><label>Montant reçu (€)</label><input type="number" min="0" step="0.01" id="payMontant" value="${(sug/100).toFixed(2)}"></div>
    <div class="form-field"><label>Mode de paiement</label><select id="payMode">${PAY_MODES.map(x=>`<option ${(f.mode||"")===x?"selected":""}>${esc(x)}</option>`).join("")}</select></div>
    <div class="form-field"><label>Date de réception</label><input type="text" id="payDate" value="12 sept."></div>
    <label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-bottom:14px"><input type="checkbox" id="payRecu" checked> Paiement bien reçu (pour un virement : reçu sur le compte)</label>
    <div class="modal-actions"><button class="btn-primary" data-action="pay-save" data-id="${d.id}" data-fid="${f.id}">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
}

function docPill(kind, doc){
  if(kind==="devis"){
    const m = {
      "Brouillon":{cls:"gray", sub:"Non envoyé", mark:"!"},
      "Envoyé":{cls:"warn", sub:"En attente de réponse", mark:"!"},
      "Accepté":{cls:"ok", sub:"Bon pour accord reçu", mark:"check"},
      "Refusé":{cls:"bad", sub:"Refusé par le client", mark:"!"}
    };
    const x = m[doc.statut] || m["Brouillon"];
    return {cls:x.cls, label:doc.statut, sub:x.sub, mark:x.mark};
  }
  const st = factureStatutFromPayments(doc);
  const reste = Math.max(0, doc.montantTtcCt - facturePaidCt(doc));
  if(st==="Payée") return {cls:"ok", label:"Payée", sub:"Facture acquittée", mark:"check"};
  if(st==="Partiellement payée") return {cls:"warn", label:"Partiellement payée", sub:"Reste dû "+fmtEuros(reste), mark:"!"};
  if(st==="Envoyée") return {cls:"warn", label:"À régler", sub:"Reste dû "+fmtEuros(reste), mark:"!"};
  return {cls:"gray", label:"Brouillon", sub:"Non envoyée", mark:"!"};
}

function docTable(rows){
  return `<table class="doc2-table"><thead><tr><th>Désignation</th><th class="r">Qté</th><th class="r">PU HT</th><th class="r">TVA</th><th class="r">Total HT</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function docTotalsHtml(lines){
  const normal = lines.filter(l=>!l[2]), big = lines.filter(l=>l[2]);
  return `<div class="doc2-totals">
    ${normal.map(([label, val])=>`<div class="doc2-tot"><span>${esc(label)}</span><b>${esc(val)}</b></div>`).join("")}
    ${big.map(([label, val])=>`<div class="doc2-tot-big"><span>${esc(label)}</span><b>${esc(val)}</b></div>`).join("")}
  </div>`;
}

function docRowsFromDevis(dv){
  return dv.lignes.map(l=>`<tr><td>${esc(l.designation||"—")}</td><td class="r">${l.qte}</td><td class="r">${fmtEuros(l.prixUnitaireCt)}</td><td class="r">${l.tvaPct} %</td><td class="r">${fmtEuros(lineTotalHTct(l))}</td></tr>`);
}

function docSubRow(text){
  return `<tr class="doc2-subrow"><td colspan="5">${esc(text)}</td></tr>`;
}

// Découpe les lignes en pages : la 1re page a moins de place (bandeau + coordonnées), les suivantes
// sont pleines. Contrairement au rapport, une page de continuation reste un simple tableau, sans bandeau.
function docPaginate(n){
  if(n<=10) return [{from:0, to:n, first:true, last:true}];
  const pages = [];
  let take = Math.min(10, n);
  pages.push({from:0, to:take, first:true, last:false});
  let start = take;
  while(n-start > 0){
    take = Math.min(22, n-start);
    const last = start+take>=n;
    pages.push({from:start, to:start+take, first:false, last});
    start += take;
  }
  return pages;
}

// En-tête de couverture (page 1 uniquement) : photo d'équipe assombrie, logo, type + numéro de document.
function docCoverBand(d, o){
  return `<div class="doc2-band">
    <div class="doc2-band-photo-wrap"><img class="doc2-band-photo" src="assets/cover-devis.jpg" alt=""></div>
    <div class="doc2-band-gold"></div>
    <div class="doc2-band-sash"></div>
    <div class="doc2-band-ribbon"></div>
    <div class="doc2-band-row">
      <div>
        <img class="doc2-band-logo" src="assets/logo-lockup.png" alt="Maître Toiturier">
        <div class="doc2-band-services">Couverture<br>Zinguerie<br>Rénovation<br>Entretien</div>
      </div>
      <div class="doc2-band-tagline">Votre toit,<br>notre expertise<br>durable.</div>
    </div>
    <div class="doc2-band-doc">${o.eyebrow?`<div class="doc2-band-eyebrow">${esc(o.eyebrow)}</div>`:""}<div class="doc2-band-type">${esc(o.topTitle)}</div><div class="doc2-band-num">${esc(o.topNum)}</div>
      <div class="doc2-band-meta2">${esc(o.dateLabel||"")}${o.validLabel?"<br>Valable "+esc(o.validLabel):""}</div>
    </div>
  </div>`;
}
// En-tête sobre des pages de continuation : pas de photo, juste le repère du document.
function docSlimHead(d, o, idx, total){
  return `<div class="doc2-slimhead"><span>${esc(SETTINGS.company.nom||"Maître Toiturier")}</span><span>${esc(o.topTitle)} ${esc(o.topNum)} — ${esc(d.client)}</span><span>Page ${idx+1} / ${total}</span></div>`;
}
function docFooter(idx, total){
  const b = SETTINGS.company;
  return `<div class="doc2-foot"><span>${esc([b.nom,b.site,b.telephone].filter(Boolean).join(" · "))}</span><span class="pdf-page-num"></span></div>`;
}
const DOC_TRUST_ITEMS = [["shield","Garantie décennale 10 ans"],["check","Matériaux de qualité certifiés"],["team","Équipe qualifiée et expérimentée"],["house","Chantier propre et sécurisé"]];
function docTrustFoot(d){
  const b = SETTINGS.company;
  return `<div class="doc2-trustfoot">
    <div class="doc2-trust-row">${DOC_TRUST_ITEMS.map(([ic,l])=>`<div class="doc2-trust-item">${iconSvg(ic,20)}<span>${esc(l)}</span></div>`).join("")}</div>
    <div class="doc2-trust-bottom">
      <div class="doc2-trust-loc">${b.adresse?`<span>${iconSvg("pin",13)}${esc(b.adresse)}</span>`:""}${b.site?`<span>${iconSvg("globe",13)}${esc(b.site)}</span>`:""}</div>
      <div class="doc2-trust-quote">“ Un toit bien entretenu aujourd’hui, c’est un patrimoine préservé demain. ”</div>
    </div>
    <span class="pdf-page-num" style="position:absolute;right:12mm;bottom:2mm;color:#7c7563;font-size:8px"></span>
  </div>`;
}

function docMetaCol(icon, label, body){
  return `<div class="doc2-meta-col"><div class="doc2-meta-label">${iconSvg(icon,13)}<span>${esc(label)}</span></div><div class="doc2-meta-body">${body}</div></div>`;
}
function docPage(d, o, pg, idx, total){
  const meta = pg.first ? `<div class="doc2-watermark">${iconSvg("house",190)}</div>
    <div class="doc2-meta">
      ${docMetaCol("user","Émis par", `<b>${esc(SETTINGS.company.nom||"Maître Toiturier")}</b>${[SETTINGS.company.adresse, [SETTINGS.company.siret?"SIRET "+SETTINGS.company.siret:"",SETTINGS.company.telephone].filter(Boolean).join(" · "), SETTINGS.company.email].filter(Boolean).map(l=>"<br>"+esc(l)).join("")}`)}
      ${docMetaCol("pin","Adressé à", `<b>${esc(d.client)}</b><br>${esc(d.adresse)}, ${esc(d.ville)}${d.telephone?"<br>"+esc(d.telephone):""}`)}
      ${docMetaCol("calendar", o.validLabel?"Date · validité":"Date", `${o.dateLabel||""}${o.validLabel?"<br>"+o.validLabel:""}`)}
    </div>
    ${o.objet?`<div class="doc2-objet">${iconSvg("doc",15)}<span><b>Objet</b> — ${esc(o.objet)}</span></div>`:""}` : "";
  const conditions = pg.last && o.bannerText ? `<div class="doc2-conditions"><div class="doc2-cond-label">${iconSvg("doc",14)}${esc(o.bannerLabel||"Conditions")}</div><p>${o.bannerText}</p></div>` : "";
  const bottom = pg.last ? `<div class="doc2-bottom">${conditions}<div class="doc2-totals">${o.totals}</div></div>` : "";
  return `<div class="pdf-page doc2-page">
    ${pg.first ? docCoverBand(d, o) : docSlimHead(d, o, idx, total)}
    <div class="doc2-body">
      ${meta}
      ${docTable(o.rows.slice(pg.from, pg.to).join(""))}
      ${bottom}
    </div>
    ${pg.last ? docTrustFoot(d) : docFooter(idx, total)}
  </div>`;
}

function docPages(d, o){
  const pgs = docPaginate(o.rows.length);
  return `<div class="pdf-doc">${pgs.map((pg,i)=>docPage(d, o, pg, i, pgs.length)).join("")}</div>`;
}

function renderDevisDoc(d, dv){
  const t = devisTotals(dv);
  const p = devisPaiement(dv);
  const valid = dv.validite || 30;
  const totals = [["Total HT", fmtEuros(t.htCt)], ["TVA", fmtEuros(t.tvaCt)], ["Total TTC", fmtEuros(t.ttcCt), true]];
  p.echeancier.forEach((e,i)=>totals.push([e.label+" ("+e.pct+" %)", fmtEuros(echeanceTtcCt(dv,i))]));
  return docPages(d, {
    topTitle: "Devis",
    eyebrow: "Proposition commerciale",
    topNum: "N° "+dv.numero+(dv.version>1?" · v"+dv.version:""),
    dateLabel: esc(dv.dateEnvoi||dv.dateCreation||"12 sept."),
    validLabel: valid+" jours",
    objet: dv.objet||d.motif,
    rows: docRowsFromDevis(dv),
    bannerLabel: "Conditions de règlement",
    bannerText: `${esc(paiementSummary(dv))} Devis valable ${valid} jours. Pour accepter, il suffit de nous renvoyer ce document signé, précédé de la mention « Bon pour accord ».`,
    totals: docTotalsHtml(totals)
  });
}

function renderFactureDoc(d, f){
  const t = factureTotals(d, f);
  const dv = findDevis(d, f.devisId);
  const paid = facturePaidCt(f);
  const reste = Math.max(0, f.montantTtcCt - paid);
  const modeTxt = (f.mode||"Virement")==="Carte bancaire" ? "carte bancaire" : (f.mode||"Virement").toLowerCase();
  const pays = (f.paiements||[]).map(p=>`${esc(p.date)} · ${esc(p.mode)}${p.mode==="Virement"?" ("+esc(p.virementStatut)+")":""} : ${fmtEuros(p.montantCt)}`).join("<br>");
  const echTxt = "Règlement par "+modeTxt+", d'ici le "+esc(f.echeance||"délai convenu");

  // Le détail des travaux est celui du devis : mêmes libellés, mêmes quantités.
  let rows;
  if(dv){
    rows = [docSubRow(f.isFirst ? "Travaux prévus (détail du devis accepté)" : "Travaux réalisés")].concat(docRowsFromDevis(dv));
  } else {
    rows = [`<tr><td>${esc(f.libelle||f.type)}</td><td class="r">1</td><td class="r">${fmtEuros(t.htCt)}</td><td class="r">—</td><td class="r">${fmtEuros(t.htCt)}</td></tr>`];
  }

  const totals = [];
  if(dv){
    const dt = devisTotals(dv);
    if(f.isFirst){
      if(paid===0) totals.push(["Total des travaux TTC", fmtEuros(dt.ttcCt)]);
      totals.push([f.type+" ("+(f.stepPct||0)+" %) HT", fmtEuros(t.htCt)], ["TVA", fmtEuros(t.tvaCt)], [f.type+" TTC", fmtEuros(t.ttcCt), true]);
    } else {
      const dejaFacture = d.factures.filter(x=>x.devisId===dv.id && x.id!==f.id && (x.stepIdx==null || x.stepIdx<f.stepIdx)).reduce((s,x)=>s+x.montantTtcCt,0);
      totals.push(["Total des travaux TTC", fmtEuros(dt.ttcCt)]);
      if(dejaFacture>0) totals.push(["Déjà facturé", "− "+fmtEuros(dejaFacture)]);
      if(paid===0) totals.push(["dont TVA", fmtEuros(t.tvaCt)]);
      totals.push([f.type+" TTC", fmtEuros(t.ttcCt), true]);
    }
  } else {
    totals.push(["Total HT", fmtEuros(t.htCt)], ["TVA", fmtEuros(t.tvaCt)], ["Total TTC", fmtEuros(t.ttcCt), true]);
  }
  if(paid>0){ totals.push(["Déjà réglé", fmtEuros(paid)]); totals.push(["Reste à payer", fmtEuros(reste)]); }

  return docPages(d, {
    topTitle: "Facture",
    eyebrow: "Document comptable",
    topNum: "N° "+f.numero,
    dateLabel: esc(f.date||"12 sept."),
    objet: (dv&&dv.objet)||d.motif,
    rows,
    bannerLabel: paid>0 ? "Règlements et échéance" : "Règlement",
    bannerText: (paid>0 ? pays+"<br>" : "") + echTxt + (SETTINGS.company.siret||SETTINGS.company.iban ? " "+(SETTINGS.company.siret?"SIRET "+esc(SETTINGS.company.siret)+". ":"")+(SETTINGS.company.iban?"IBAN "+esc(SETTINGS.company.iban)+".":"") : ""),
    totals: docTotalsHtml(totals)
  });
}

function docHtml(d, kind, docId){
  if(kind==="devis") return renderDevisDoc(d, findDevis(d, docId));
  if(kind==="facture") return renderFactureDoc(d, findFacture(d, docId));
  return renderReportDoc(d);
}

function docFilename(d, kind, docId){
  if(kind==="devis") return `devis-${findDevis(d, docId).numero}.pdf`;
  if(kind==="facture") return `facture-${findFacture(d, docId).numero}.pdf`;
  return reportFilename(d);
}

function docModalTitle(kind){
  return kind==="devis" ? "Envoyer le devis au client" : kind==="facture" ? "Envoyer la facture au client" : "Envoyer le rapport au client";
}

function docHistoryLabel(kind, docId){
  return kind==="devis" ? "Devis "+docId : kind==="facture" ? "Facture "+docId : "Rapport de diagnostic";
}

// Messages d'accompagnement chaleureux et commerciaux pour devis et factures.
function devisMessage(d, dv, channel){
  const wa = channel==="whatsapp";
  const sign = d.commercial || "L’équipe Maître Toiturier";
  const ttc = fmtEuros(devisTotals(dv).ttcCt);
  const valid = dv.validite || 30;
  const pay = paiementSummary(dv);
  if(wa){
    return `Bonjour ${d.client} 👋\n\nMerci de nous faire confiance pour votre toiture ! 🏠\nSuite à notre visite, voici votre devis n° ${dv.numero} (${ttc} TTC), en pièce jointe.\n\nIl détaille, poste par poste, les travaux recommandés à l’issue du diagnostic.\n\n💳 ${pay}\n\nIl est valable ${valid} jours. Pour l’accepter, il vous suffit de me répondre « OK » ici ou de m’appeler : je m’occupe ensuite de tout (planification, matériel, chantier). ✅\n\nSi vous souhaitez ajuster quoi que ce soit, on le fait ensemble avec plaisir. 😊\n\n${sign}\nMaître Toiturier — www.maitretoiturier.fr`;
  }
  return `Bonjour ${d.client},\n\nMerci de la confiance que vous nous accordez pour votre toiture.\n\nSuite à notre visite, je vous adresse avec plaisir, en pièce jointe, votre devis n° ${dv.numero} d’un montant de ${ttc} TTC. Il détaille, poste par poste, les travaux recommandés à l’issue du diagnostic.\n\n${pay}\n\nCe devis est valable ${valid} jours. Pour l’accepter, il suffit de me répondre par retour de message ou de m’appeler : je m’occupe ensuite de la planification, du matériel et du chantier.\n\nSi vous souhaitez ajuster quoi que ce soit, nous le ferons ensemble avec plaisir.\n\nBien cordialement,\n\n${sign}\nMaître Toiturier\nwww.maitretoiturier.fr`;
}

function factureMessage(d, f, channel){
  const wa = channel==="whatsapp";
  const sign = d.commercial || "L’équipe Maître Toiturier";
  const ttc = fmtEuros(f.montantTtcCt);
  const paid = factureStatutFromPayments(f)==="Payée";
  const kind = "« "+f.type+" »";
  const mode = (f.mode||"Virement")==="Carte bancaire" ? "carte bancaire" : (f.mode||"Virement").toLowerCase();
  let middle;
  if(paid) middle = "Elle est déjà réglée : un grand merci pour votre règlement et votre confiance !";
  else middle = `Vous pouvez la régler par ${mode}, d’ici le ${f.echeance||"délai convenu"}.` + (f.isFirst ? " Dès réception, nous planifions votre chantier." : "");
  if(wa){
    return `Bonjour ${d.client} 👋\n\nVoici votre facture ${kind?kind+" ":""}n° ${f.numero} (${ttc} TTC), en pièce jointe. 🧾\n\n${middle}${paid?" 🙏":""}\n\nN’hésitez pas à me contacter pour la moindre question. 😊\n\n${sign}\nMaître Toiturier — www.maitretoiturier.fr`;
  }
  return `Bonjour ${d.client},\n\nVeuillez trouver ci-joint votre facture ${kind?kind+" ":""}n° ${f.numero} d’un montant de ${ttc} TTC.\n\n${middle}\n\nN’hésitez pas à me contacter pour toute question.\n\nBien cordialement,\n\n${sign}\nMaître Toiturier\nwww.maitretoiturier.fr`;
}

function docMessage(d, kind, docId, channel){
  if(kind==="devis") return devisMessage(d, findDevis(d, docId), channel);
  if(kind==="facture") return factureMessage(d, findFacture(d, docId), channel);
  return reportMessage(d, channel);
}

function docSubject(d, kind, docId){
  if(kind==="devis") return `Votre devis Maître Toiturier — N° ${findDevis(d, docId).numero}`;
  if(kind==="facture") return `Votre facture Maître Toiturier — N° ${findFacture(d, docId).numero}`;
  return "Votre rapport de diagnostic de toiture — Maître Toiturier";
}

async function downloadDocPdf(d, kind, docId){
  showToast("Génération du PDF…");
  try{
    const blob = await buildPdfFromHtml(docHtml(d, kind, docId));
    downloadBlob(blob, docFilename(d, kind, docId));
    showToast("PDF téléchargé.");
  } catch(e){
    showToast("La génération du PDF a échoué (connexion internet requise). Réessayez.");
  }
}

// ---------- Onglet global "Devis & factures" ----------

function allDocs(){
  const devis = [], factures = [];
  visibleDossiers().forEach(d=>{
    const last = (d.devis||[])[(d.devis||[]).length-1];
    if(last) devis.push({d, dv:last});
    (d.factures||[]).forEach(f=>factures.push({d, f}));
  });
  return {devis, factures};
}

function renderDocRow(kind, d, doc, hideOpen){
  const isDevis = kind==="devis";
  const num = isDevis ? doc.numero : doc.numero;
  const ttc = isDevis ? devisTotals(doc).ttcCt : doc.montantTtcCt;
  const pill = docPill(kind, doc);
  const cls = pill.cls==="ok"?"green":pill.cls==="warn"?"gold":pill.cls==="bad"?"red":"gray";
  const canSend = isDevis ? hasPermission("quote.send") : hasPermission("invoice.create");
  const sub = isDevis ? `${esc(d.motif)}${doc.version>1?" · v"+doc.version:""}` : `${esc(doc.type)} · ${esc(d.motif)}`;
  return `
  <div class="row-item" data-search="${esc((d.client+" "+num+" "+d.ville+" "+pill.label).toLowerCase())}" data-statut="${esc(pill.label)}">
    <div class="row-left">
      <div class="row-avatar">${initials(d.client)}</div>
      <div><div class="row-title">${hideOpen ? esc(num) : esc(d.client)+" · "+esc(num)}</div><div class="row-sub">${sub}${docSentInfo(doc)}</div></div>
    </div>
    <div class="doc-row-right">
      <div class="doc-row-amount">${fmtEuros(ttc)}</div>
      ${badge(pill.label, cls)}
      <div class="doc-row-actions">
        ${isDevis && (doc.statut==="Envoyé"||doc.statut==="Brouillon") && !acceptedDevis(d) && hasPermission("quote.accept") ? `<button class="btn-primary btn-sm" data-action="win-devis" data-id="${d.id}">✓ Gagné</button>` : ""}
        ${!isDevis && doc.montantTtcCt-facturePaidCt(doc)>1 && hasPermission("payment.register") ? `<button class="btn-primary btn-sm" data-action="pay-open" data-id="${d.id}" data-fid="${doc.id}">Paiement</button>` : ""}
        <button class="btn-ghost btn-sm" data-action="doc-pdf" data-id="${d.id}" data-kind="${kind}" data-doc="${doc.id}">PDF</button>
        ${canSend ? `<button class="btn-secondary btn-sm" data-action="modal-send-doc" data-id="${d.id}" data-kind="${kind}" data-doc="${doc.id}">Envoyer</button>` : ""}
        ${hideOpen || !canView("dossiers") ? "" : `<button class="btn-ghost btn-sm" data-action="open-dossier" data-id="${d.id}" data-tab="devis">Ouvrir</button>`}
      </div>
    </div>
  </div>`;
}

function renderDocuments(only){
  const {devis, factures} = allDocs();
  const attente = devis.filter(x=>x.dv.statut==="Envoyé").reduce((s,x)=>s+devisTotals(x.dv).ttcCt,0);
  const signe = devis.filter(x=>x.dv.statut==="Accepté").reduce((s,x)=>s+devisTotals(x.dv).ttcCt,0);
  const encaisse = factures.reduce((s,x)=>s+facturePaidCt(x.f),0);
  const aRegler = factures.filter(x=>x.f.statut!=="Brouillon").reduce((s,x)=>s+Math.max(0,x.f.montantTtcCt-facturePaidCt(x.f)),0);
  const title = only==="devis" ? "Devis" : only==="factures" ? "Factures" : "Devis & factures";
  const sub = only==="devis" ? "Tous les devis, en PDF, prêts à être envoyés." : only==="factures" ? "Toutes les factures et leurs règlements." : "Tous les documents commerciaux, en PDF, prêts à être envoyés.";
  return `
  <div class="page-header">
    <div><h1>${title}</h1><p>${sub}</p></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${only!=="factures" && hasPermission("quote.create") ? `<button class="btn-primary" data-action="wizard-devis">+ Créer un devis</button>` : ""}
      ${only!=="devis" && hasPermission("invoice.create") ? `<button class="btn-secondary" data-action="wizard-facture">+ Créer une facture</button>` : ""}
    </div>
  </div>
  <div class="stat-grid">
    ${only!=="factures" ? stat("Devis en attente", fmtEuros(attente), devis.filter(x=>x.dv.statut==="Envoyé").length+" devis envoyé(s)") : ""}
    ${only!=="factures" ? stat("Devis acceptés", fmtEuros(signe), "Montant TTC signé") : ""}
    ${only!=="devis" ? stat("Encaissé", fmtEuros(encaisse), "Paiements confirmés") : ""}
    ${only!=="devis" ? stat("Reste à encaisser", fmtEuros(aRegler), "Factures envoyées") : ""}
  </div>
  ${only!=="factures" && canView("devis") ? `<div class="card">
    <div class="card-header"><h3>Devis</h3><span class="badge gray">${devis.length}</span></div>
    ${devis.length ? devis.map(x=>renderDocRow("devis", x.d, x.dv)).join("") : `<div class="empty-note">Aucun devis pour l’instant. Créez-en un depuis un dossier.</div>`}
  </div>` : ""}
  ${only!=="devis" && canView("factures") ? `<div class="card">
    <div class="card-header"><h3>Factures</h3><span class="badge gray">${factures.length}</span></div>
    ${factures.length ? factures.map(x=>renderDocRow("facture", x.d, x.f)).join("") : `<div class="empty-note">Aucune facture pour l’instant.</div>`}
  </div>` : ""}`;
}

// ---------- Exemples de devis / factures pour la démonstration ----------

function addSampleDocs(list){
  const get = id=>list.find(d=>d.id===id);
  const L = (designation, qte, prix, tva)=>freshDevisLine({designation, qte, prixUnitaireCt:Math.round(prix*100), tvaPct:tva});

  // Claire Fontaine : devis V1 remplacé par une V2 (anti-mousse retiré à sa demande), en attente de réponse.
  let d = get("TP-1042");
  if(d){
    const base = [L("Remplacement d’éléments de couverture fissurés",3,45,10), L("Reprise d’étanchéité (solin / noue)",1,320,10), L("Nettoyage et remise en état des gouttières",1,180,10)];
    d.devis = [
      {id:"TP-1042-D1", numero:"TP-1042-D1", version:1, statut:"Envoyé", dateCreation:"10 sept.", dateEnvoi:"10 sept.", lignes:[...base, L("Traitement anti-mousse de la couverture",1,220,10), L("Visite de contrôle après intervention",1,90,20)]},
      {id:"TP-1042-D2", numero:"TP-1042-D2", version:2, statut:"Envoyé", dateCreation:"11 sept.", dateEnvoi:"11 sept.", lignes:[...base, L("Visite de contrôle après intervention",1,90,20)]}
    ];
    d.montant = Math.round(devisTotals(d.devis[1]).ttcCt/100);
    d.historique.push({date:"10 sept., 17:05", auteur:"Commerciale · Sarah", texte:"Devis TP-1042-D1 envoyé au client."});
    d.historique.push({date:"11 sept., 09:40", auteur:"Commerciale · Sarah", texte:"Nouvelle version TP-1042-D2 envoyée (anti-mousse retiré à la demande du client)."});
  }

  // Marc Lefèvre : réfection terminée, devis accepté, acompte et solde payés.
  d = get("TP-1041");
  if(d){
    const dv = {id:"TP-1041-D1", numero:"TP-1041-D1", version:1, statut:"Accepté", dateCreation:"18 juil.", dateEnvoi:"18 juil.", lignes:[L("Réfection complète de la couverture",1,14200,10), L("Dépose et évacuation de l’ancienne couverture",1,1900,10), L("Zinguerie neuve (gouttières et descentes)",1,800,10)], paiement:{echeancier:[{label:"Acompte à la signature",pct:30},{label:"Solde à la fin des travaux",pct:70}], mode:"Virement"}};
    const ttc = devisTotals(dv).ttcCt;
    const acompte = Math.round(ttc*0.3);
    d.devis = [dv];
    d.montant = Math.round(ttc/100);
    d.factures = [
      {id:"TP-1041-F1", numero:"TP-1041-F1", type:"Acompte à la signature", stepIdx:0, stepPct:30, isFirst:true, isLast:false, devisId:dv.id, libelle:"Acompte à la signature", montantTtcCt:acompte, statut:"Payée", date:"24 juil.", echeance:"3 août", paiements:[{id:"TP-1041-F1-P1", montantCt:acompte, mode:"Virement", date:"26 juil.", virementStatut:"Confirmé"}]},
      {id:"TP-1041-F2", numero:"TP-1041-F2", type:"Solde à la fin des travaux", stepIdx:1, stepPct:70, isFirst:false, isLast:true, devisId:dv.id, libelle:"Solde à la fin des travaux", montantTtcCt:ttc-acompte, statut:"Payée", date:"29 août", echeance:"12 sept.", paiements:[{id:"TP-1041-F2-P1", montantCt:ttc-acompte, mode:"Chèque", date:"2 sept.", virementStatut:null}]}
    ];
    const ch = freshChantier();
    ch.statut = "Clôturé"; ch.equipe = ["Marc Petit","Nadia Cools"]; ch.dateDebut = "4 août"; ch.dateFin = "28 août";
    Object.keys(ch.checklist).forEach(k=>ch.checklist[k].forEach(i=>{ i.done = true; }));
    d.chantier = ch;
  }

  // Antoine Garnier : contrôle annuel, devis accepté, facture envoyée en attente de règlement.
  d = get("TP-1043");
  if(d){
    const dv = {id:"TP-1043-D1", numero:"TP-1043-D1", version:1, statut:"Accepté", dateCreation:"5 sept.", dateEnvoi:"5 sept.", lignes:[L("Visite de contrôle périodique",1,90,20)]};
    d.devis = [dv];
    d.montant = Math.round(devisTotals(dv).ttcCt/100);
    d.commercialStage = "Gagné";
    d.factures = [{id:"TP-1043-F1", numero:"TP-1043-F1", type:"Solde", devisId:dv.id, libelle:"Solde des travaux", montantTtcCt:devisTotals(dv).ttcCt, statut:"Envoyée", date:"10 sept.", echeance:"26 sept.", paiements:[]}];
    const ch = freshChantier(); ch.statut = "Planifié"; ch.dateDebut = "14 sept."; ch.equipe = ["Yanis Costa"];
    d.chantier = ch;
  }

  const tp = get("TP-1045");
  if(tp){ const lb = DEFAULT_MATERIEL_LIB.find(x=>x.id==="couverture"); tp.materiel = [{id:"M1", libId:"couverture", label:lb.label, date:"2026-09-14", note:"Accès par l’arrière, prévoir 2 personnes.", items:lb.items.map((x,i)=>({label:x, done:i<3})), par:"Julien Bernard"}]; }
  // Tâches et notes d'exemple
  const T = (id, tasks, notes)=>{ const dd = get(id); if(!dd) return; dd.taches = tasks; (notes||[]).forEach(n=>dd.notes.push(n)); };
  T("TP-1042", [{id:"T1", titre:"Relancer le client pour la réponse au devis", echeance:"14 sept.", assigne:"Sarah Durand", done:false}, {id:"T2", titre:"Préparer la facture d’acompte dès l’acceptation", echeance:"16 sept.", assigne:"Sarah Durand", done:false}], [{date:"11 sept.", texte:"Cliente disponible en fin de journée ; préfère être contactée par WhatsApp."}]);
  T("TP-1041", [{id:"T1", titre:"Planifier la visite d’entretien annuelle", echeance:"12 oct.", assigne:"Lucas Robert", done:false}, {id:"T2", titre:"Envoyer l’attestation de fin de travaux", echeance:"4 sept.", assigne:"Administration", done:true}], []);
  T("TP-1045", [{id:"T1", titre:"Appeler le client pour confirmer l’accès avant la visite", echeance:"12 sept.", assigne:"Julien Bernard", done:false}], []);
  // Conditions de règlement et échéanciers des exemples
  const P = (id, over)=>{ const dd = get(id); if(dd) (dd.devis||[]).forEach(v=>{ v.objet = v.objet || dd.motif; v.validite = v.validite || 30; v.paiement = Object.assign(paiementDefaults(), over); }); };
  P("TP-1042", {acompte:true, acomptePct:30, fois:2, mode:"Chèque"});
  P("TP-1041", {acompte:true, acomptePct:30, fois:2, mode:"Virement"});
  P("TP-1043", {acompte:false, acomptePct:30, fois:1, mode:"Carte bancaire"});
  list.forEach(dd=>(dd.factures||[]).forEach(f=>{
    const dv = findDevis(dd, f.devisId);
    f.mode = f.mode || (dv ? devisPaiement(dv).mode : "Virement");
    if(!f.echeances){ f.fois = 1; f.echeances = [{date:f.echeance||"12 sept.", montantCt:f.montantTtcCt}]; }
  }));
  const mm = get("TP-1041");
  if(mm){
    const f2 = mm.factures.find(x=>x.id==="TP-1041-F2");
    const half = Math.floor(f2.montantTtcCt/2), rest = f2.montantTtcCt-half;
    f2.mode = "Chèque"; f2.fois = 2;
    f2.echeances = [{date:"29 août", montantCt:half}, {date:"12 sept.", montantCt:rest}];
    f2.paiements = [{id:"TP-1041-F2-P1", montantCt:half, mode:"Chèque", date:"29 août", virementStatut:null}, {id:"TP-1041-F2-P2", montantCt:rest, mode:"Chèque", date:"11 sept.", virementStatut:null}];
  }
}

// ---------- Suppressions (toujours confirmées) ----------
function stampHist(d, texte){
  d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte});
}

function askDelete(ds){
  const d = ds.id ? byId(ds.id) : null;
  const what = ds.what;
  if(what==="devis"){
    askConfirm("Supprimer ce devis ?", "Le brouillon "+ds.doc+" sera définitivement supprimé.", ()=>{
      d.devis = d.devis.filter(x=>x.id!==ds.doc);
      stampHist(d, "Brouillon de devis "+ds.doc+" supprimé.");
      showToast("Devis supprimé.");
    });
  } else if(what==="facture"){
    askConfirm("Supprimer cette facture ?", "Le brouillon "+ds.doc+" sera définitivement supprimé.", ()=>{
      d.factures = d.factures.filter(x=>x.id!==ds.doc);
      syncProcess(d);
      stampHist(d, "Brouillon de facture "+ds.doc+" supprimé.");
      showToast("Facture supprimée.");
    });
  } else if(what==="materiel"){
    askConfirm("Supprimer cette liste ?", "La liste de matériel sera retirée du dossier et de l’agenda.", ()=>{
      d.materiel = (d.materiel||[]).filter(x=>x.id!==ds.doc);
      showToast("Liste supprimée.");
    });
  } else if(what==="paiement"){
    askConfirm("Supprimer ce paiement ?", "Le paiement sera retiré de la facture, dont le reste dû sera recalculé.", ()=>{
      const f = findFacture(d, ds.doc);
      f.paiements = f.paiements.filter(x=>x.id!==ds.pid);
      f.statut = factureStatutFromPayments(f);
      if(f.statut==="Brouillon") f.statut = "Envoyée";
      syncProcess(d);
      stampHist(d, "Paiement supprimé sur "+f.numero+".");
      showToast("Paiement supprimé.");
    });
  } else if(what==="note"){
    askConfirm("Supprimer cette note ?", "Cette note interne sera définitivement supprimée.", ()=>{
      d.notes.splice(parseInt(ds.nid,10),1);
      showToast("Note supprimée.");
    });
  } else if(what==="task"){
    askConfirm("Supprimer cette tâche ?", "La tâche sera définitivement supprimée.", ()=>{
      d.taches = (d.taches||[]).filter(x=>x.id!==ds.tid);
      showToast("Tâche supprimée.");
    });
  } else if(what==="visite"){
    askConfirm("Retirer la visite ?", "Le rendez-vous sera retiré de l’agenda ; le dossier repassera à programmer.", ()=>{
      d.visiteDate = null; d.visiteHeure = null;
      if(d.statut==="Planifié") d.statut = "Nouvelle";
      stampHist(d, "Visite retirée de l’agenda.");
      showToast("Visite retirée.");
    }, "Retirer");
  } else if(what==="diagnostic"){
    askConfirm("Réinitialiser le diagnostic ?", "Tous les contrôles, photos et la synthèse de ce dossier seront effacés. Le rapport PDF ne sera plus disponible.", ()=>{
      d.diagnostic = freshDiagnostic();
      if(d.statut==="Rapport prêt") d.statut = d.visiteDate ? "Planifié" : "Nouvelle";
      state.diagStep = 1;
      stampHist(d, "Diagnostic réinitialisé.");
      showToast("Diagnostic réinitialisé.");
    }, "Réinitialiser");
  } else if(what==="dossier"){
    askConfirm("Supprimer ce dossier client ?", "Le dossier de "+d.client+" (diagnostic, devis, factures, chantier) sera définitivement supprimé. Cette action est irréversible.", ()=>{
      DOSSIERS = DOSSIERS.filter(x=>x.id!==d.id);
      state.dossierId = null; state.section = "dossiers";
      showToast("Dossier supprimé.");
    });
  } else if(what==="employee"){
    askConfirm("Supprimer ce salarié ?", "Son accès sera retiré. Ses dossiers restent à son nom jusqu’à réaffectation.", ()=>{
      SETTINGS.employees = SETTINGS.employees.filter(x=>x.id!==ds.eid);
      saveSettings();
      showToast("Salarié supprimé.");
    });
  } else if(what==="incident"){
    askConfirm("Supprimer cet incident ?", "L’incident sera retiré du chantier.", ()=>{
      d.chantier.incidents.splice(parseInt(ds.idx,10),1);
      showToast("Incident supprimé.");
    });
  } else if(what==="contract"){
    askConfirm("Supprimer ce contrat d’entretien ?", "La fiche du contrat sera définitivement supprimée.", ()=>{
      CONTRACTS.splice(parseInt(ds.idx,10),1);
      showToast("Contrat supprimé.");
    });
  } else if(what==="parrainage"){
    askConfirm("Supprimer ce parrainage ?", "La recommandation sera définitivement supprimée.", ()=>{
      PARRAINAGES.splice(parseInt(ds.idx,10),1);
      showToast("Parrainage supprimé.");
    });
  }
}

// ---------- Confirmation de suppression ----------
let CONFIRM_RUN = null;
function askConfirm(title, text, run, yesLabel, yesCls){
  CONFIRM_RUN = run;
  state.modal = {type:"confirm", title, text, yesLabel:yesLabel||"Supprimer", yesCls:yesCls||"btn-danger"};
  render();
}
function modalConfirm(m){
  return modalWrap(m.title, `<p style="margin:0 0 18px;line-height:1.5">${esc(m.text)}</p>
    <div class="modal-actions"><button class="${m.yesCls||"btn-danger"}" data-action="confirm-yes">${esc(m.yesLabel)}</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
}

// ---------- Assistant de création : devis et facture ----------
const WZ_STEPS = {
  devis: ["Client", "Prestations", "Paiement", "Récapitulatif"],
  facture: ["Devis", "Règlement", "Récapitulatif"]
};

// Prestations du catalogue suggérées d'après les constats du diagnostic (jamais imposées).
const ANOMALY_TO_SERVICE = {
  casse:"COUV-TUILE", fissure:"COUV-TUILE", deplace:"COUV-TUILE", souleve:"COUV-TUILE", manquant:"COUV-TUILE", malfixe:"COUV-TUILE", use:"COUV-TUILE",
  joint:"ETAN-JOINT", recouvrement:"ETAN-JOINT", perce:"ETAN-JOINT", eau:"ETAN-JOINT",
  mousse:"COUV-DEMOUSS", ruissellement:"ZING-GOUT", corrode:"ZING-GOUT",
  bois_humide:"CHAR-REP", moisissure:"CHAR-REP", insectes:"CHAR-REP", affaisse:"CHAR-REP"
};
function diagSuggestions(d){
  const out = [];
  POINTS.forEach(p=>{
    const pt = d.diagnostic.points[p];
    if(!["Défaut constaté","À surveiller","Urgent"].includes(pt.etat)) return;
    (pt.problems||[]).forEach(pid=>{
      const code = ANOMALY_TO_SERVICE[pid];
      if(code && !out.find(o=>o.code===code)) out.push({code, reason:p});
    });
  });
  return out;
}

function wzNew(kind, dossierId){
  state.wizard = {kind, step:1, dossierId:dossierId||null, data:{}};
  if(kind==="devis") wzInitDevis(); else wzInitFacture();
  state.modal = {type:"wizard"};
  render();
}

function wzInitDevis(){
  const w = state.wizard, d = w.dossierId ? byId(w.dossierId) : null;
  w.data = {objet: d ? d.motif : "", validite:SETTINGS.company.devisValidite||30, lignes:[freshDevisLine()], fois:2, echeancier: defaultEcheancier(2), mode:"Virement"};
  if(d && d.devis.length){
    const prev = latestDevis(d), pp = devisPaiement(prev);
    Object.assign(w.data, {objet: prev.objet||d.motif, validite: prev.validite||30, lignes: prev.lignes.map(l=>Object.assign({},l)), fois: pp.echeancier.length, echeancier: pp.echeancier.map(e=>Object.assign({},e)), mode: pp.mode});
  }
}

function wzInitFacture(){
  const w = state.wizard;
  w.data = {devisId:null, type:null, montant:"", echeance:"", mode:"Virement", fois:1};
  wzPickDevisForDossier();
}

function wzAcceptedDevis(d){
  const acc = d.devis.filter(x=>x.statut==="Accepté");
  return acc.length ? acc[acc.length-1] : null;
}

// Les étapes de l'échéancier pas encore facturées, dans l'ordre : une facture = une étape du devis.
function wzFactureTypes(d, dv){
  const p = devisPaiement(dv), billed = billedSteps(d, dv);
  return p.echeancier.map((e,i)=>({v:String(i), label: e.label+" ("+e.pct+" %)", idx:i})).filter(t=>!billed.includes(t.idx));
}

function wzPickDevisForDossier(){
  const w = state.wizard, x = w.data;
  const d = w.dossierId ? byId(w.dossierId) : null;
  const dv = d ? wzAcceptedDevis(d) : null;
  x.devisId = dv ? dv.id : null;
  const types = dv ? wzFactureTypes(d, dv) : [];
  x.type = types.length ? types[0].v : null;
  wzFactureDefaults();
}

function wzFactureDefaults(){
  const w = state.wizard, x = w.data;
  const d = w.dossierId ? byId(w.dossierId) : null;
  const dv = d && x.devisId ? findDevis(d, x.devisId) : null;
  if(!dv || x.type==null){ x.montant = ""; return; }
  const p = devisPaiement(dv), idx = parseInt(x.type,10);
  const montant = echeanceTtcCt(dv, idx);
  x.montant = (montant/100).toFixed(2);
  x.mode = p.mode;
  x.echeance = fmtDayMonth(addDays(TODAY_REF, 15));
}

// Relit les champs de l'assistant dans son état (appelé avant toute navigation ou re-rendu).
function wzFlush(){
  const w = state.wizard;
  if(!w || !state.modal || state.modal.type!=="wizard") return;
  document.querySelectorAll("[data-wz]").forEach(el=>{
    const k = el.dataset.wz;
    if(k==="dossier") return;
    let v = el.value;
    if(k==="validite"||k==="fois") v = parseInt(v,10);
    w.data[k] = v;
  });
  const lignes = w.data.lignes;
  if(lignes){
    document.querySelectorAll(".wz-line").forEach(inp=>{
      const l = lignes[parseInt(inp.dataset.idx,10)];
      if(!l) return;
      const f = inp.dataset.field;
      if(f==="designation") l.designation = inp.value;
      else if(f==="qte") l.qte = parseFloat(inp.value)||0;
      else if(f==="unite") l.unite = inp.value;
      else if(f==="prixUnitaire") l.prixUnitaireCt = Math.round((parseFloat(inp.value)||0)*100);
      else if(f==="tva") l.tvaPct = parseFloat(inp.value)||0;
    });
  }
  if(w.data.echeancier){
    document.querySelectorAll(".wz-ech-row").forEach(row=>{
      const e = w.data.echeancier[parseInt(row.dataset.idx,10)];
      if(!e) return;
      const lbl = row.querySelector('[data-field="label"]'), pct = row.querySelector('[data-field="pct"]');
      if(lbl) e.label = lbl.value;
      if(pct) e.pct = parseInt(pct.value,10)||0;
    });
  }
}

function wzDevisFromData(){
  const x = state.wizard.data;
  const lignes = x.lignes.filter(l=>l.designation.trim() && l.qte>0);
  return {lignes, paiement:{echeancier: x.echeancier || defaultEcheancier(x.fois||2), mode:x.mode}};
}

function wzTotalsHtml(dvLike){
  const t = devisTotals(dvLike);
  return `<div class="wz-tot"><span>Total HT</span><b>${fmtEuros(t.htCt)}</b></div><div class="wz-tot"><span>TVA</span><b>${fmtEuros(t.tvaCt)}</b></div><div class="wz-tot big"><span>Total TTC</span><b>${fmtEuros(t.ttcCt)}</b></div>`;
}

function wzScheduleHtml(dvLike){
  const p = devisPaiement(dvLike);
  const rows = p.echeancier.map((e,i)=>`<div class="wz-sched"><span>${esc(e.label)} · ${e.pct} %</span><b>${fmtEuros(echeanceTtcCt(dvLike,i))}</b></div>`);
  return rows.join("") + `<div class="wz-sched mode"><span>Mode de règlement</span><b>${esc(p.mode)}</b></div>`;
}

// Mise à jour "à chaud" des totaux, sans re-rendu (pour ne pas perdre le focus pendant la saisie).
function wzUpdateLive(){
  const w = state.wizard;
  if(!w || w.kind!=="devis") return;
  const tot = document.getElementById("wzTotals");
  if(tot) tot.innerHTML = wzTotalsHtml(wzDevisFromData());
  const rows = document.querySelectorAll(".wz-line-row");
  rows.forEach((row,i)=>{
    const l = w.data.lignes[i]; const el = row.querySelector(".wz-line-total");
    if(l && el) el.textContent = fmtEuros(lineTotalHTct(l));
  });
  const sch = document.getElementById("wzSchedule");
  if(sch) sch.innerHTML = wzScheduleHtml(wzDevisFromData());
  if(w.data.echeancier){
    const dvLike = wzDevisFromData();
    w.data.echeancier.forEach((e,i)=>{ const el = document.getElementById("wzEchAmt-"+i); if(el) el.textContent = fmtEuros(echeanceTtcCt(dvLike,i)); });
    const sum = w.data.echeancier.reduce((s,e)=>s+(e.pct||0),0);
    const tEl = document.getElementById("wzEchTotal");
    if(tEl){ tEl.textContent = "Total : "+sum+" % "+(sum!==100?"— doit faire 100 % au total":"✓"); tEl.style.color = sum!==100 ? "var(--red)" : ""; }
  }
}

function renderWizard(){
  const w = state.wizard;
  const steps = WZ_STEPS[w.kind];
  const d = w.dossierId ? byId(w.dossierId) : null;
  const last = w.step === steps.length;
  const stepper = `<div class="wz-steps">${steps.map((s,i)=>`<div class="wz-step ${i+1===w.step?"on":(i+1<w.step?"done":"")}"><span>${i+1<w.step?"✓":i+1}</span><em>${esc(s)}</em></div>`).join("")}</div>`;
  let body = "";
  let nav = "";
  if(w.kind==="devis") body = wzDevisStep(w, d); else body = wzFactureStep(w, d);

  const prev = w.step>1 ? `<button class="btn-secondary" data-action="wz-prev">← Retour</button>` : `<button class="btn-secondary" data-action="modal-close">Annuler</button>`;
  if(!last){
    nav = `${prev}<button class="btn-primary" data-action="wz-next">Continuer →</button>`;
  } else if(w.kind==="devis"){
    nav = `${prev}<button class="btn-secondary" data-action="wz-create" data-send="0">Créer le devis</button><button class="btn-primary" data-action="wz-create" data-send="1">Créer et envoyer</button>`;
  } else {
    nav = `${prev}<button class="btn-secondary" data-action="wz-create" data-send="0">Créer la facture</button><button class="btn-primary" data-action="wz-create" data-send="1">Créer et envoyer</button>`;
  }
  const title = w.kind==="devis" ? "Nouveau devis" : "Nouvelle facture";
  return `<div class="modal-overlay" data-action="modal-overlay"><div class="modal modal-wide">
    <div class="modal-header"><h3>${title}</h3><button class="modal-close" data-action="modal-close">✕</button></div>
    ${stepper}
    <div class="wz-body">${body}</div>
    <div class="modal-actions wz-nav">${nav}</div>
  </div></div>`;
}

function wzClientCard(d){
  if(!d) return `<div class="empty-note">Choisissez un dossier client pour continuer.</div>`;
  return `<div class="wz-client"><div class="row-avatar">${initials(d.client)}</div><div><div class="row-title">${esc(d.client)}</div><div class="row-sub">${esc(d.adresse)}, ${esc(d.ville)}</div><div class="row-sub">${esc(d.email||"")}${d.telephone?" · "+esc(d.telephone):""}</div></div></div>`;
}

// Sous-écran "catalogue" de l'étape Prestations : une seule liste (au lieu de deux pavés de
// puces empilés, chacun avec son propre ascenseur), un seul scroll, on reste dessus pour ajouter
// plusieurs lignes d'affilée puis "← Retour" pour revenir au récapitulatif des lignes ajoutées.
function wzCatalogPicker(w, d, x){
  const sugg = d ? diagSuggestions(d).filter(sg=>!x.lignes.some(l=>l.code===sg.code)) : [];
  const items = [
    ...SERVICE_CATALOG.filter(c=>!x.lignes.some(l=>l.code===c.code)).map(c=>({kind:"Prestation", code:c.code, label:c.label, prix:c.prixUnitaireCt})),
    ...MATERIEL_CATALOG.filter(c=>!x.lignes.some(l=>l.code===c.code)).map(c=>({kind:"Matériel", code:c.code, label:c.label, prix:catalogVenteCt(c)}))
  ];
  const n = x.lignes.filter(l=>l.designation.trim()).length;
  return `
    <button class="btn-secondary btn-sm" data-action="wz-close-catalog" style="margin-bottom:14px">← Retour aux lignes${n?" ("+n+")":""}</button>
    ${sugg.length ? `<div class="wz-sugg"><div class="wz-sugg-t">Suggéré d’après le diagnostic</div>${sugg.map(s=>{ const svc = SERVICE_CATALOG.find(c=>c.code===s.code); return `<button class="wz-chip" data-action="wz-add-sugg" data-code="${s.code}">+ ${esc(svc.label)} <small>${esc(s.reason)}</small></button>`; }).join("")}</div>` : ""}
    <div class="card">
      ${catalogSearchRow("wzCatSearch")}
      ${items.map(it=>`<div class="row-item cat-item" data-search="${esc(it.label.toLowerCase())}" data-action="wz-add-sugg" data-code="${esc(it.code)}">
        <div style="min-width:0"><div class="row-title">${esc(it.label)}</div><div class="row-sub">${it.kind}</div></div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0"><div class="doc-row-amount">${fmtEuros(it.prix)}</div><span class="cat-chevron">+</span></div>
      </div>`).join("")}
    </div>`;
}
function wzDevisStep(w, d){
  const x = w.data;
  if(w.step===1){
    const opts = visibleDossiers().map(dd=>`<option value="${dd.id}" ${dd.id===w.dossierId?"selected":""}>${esc(dd.client)} · ${esc(dd.ville)}</option>`).join("");
    return `<p class="wz-intro">Commençons par le client et l’objet des travaux.</p>
      <div class="form-field"><label>Dossier client</label><select data-wz="dossier" data-wz-rerender="1"><option value="">Choisir un client…</option>${opts}</select></div>
      ${wzClientCard(d)}
      <div class="form-field"><label>Objet des travaux</label><input type="text" data-wz="objet" value="${esc(x.objet)}" placeholder="Ex. Réparation de la couverture et de l’étanchéité"></div>
      <div class="form-field"><label>Validité du devis</label><select data-wz="validite">${[15,30,60,90].map(n=>`<option value="${n}" ${x.validite===n?"selected":""}>${n} jours</option>`).join("")}</select></div>`;
  }
  if(w.step===2){
    if(w.showCatalog) return wzCatalogPicker(w, d, x);
    const sugg = d ? diagSuggestions(d).filter(sg=>!x.lignes.some(l=>l.code===sg.code)) : [];
return `<p class="wz-intro">Ajoutez les prestations et le matériel : chaque ligne apparaîtra à l’identique sur le devis et sur les factures.</p>
      ${sugg.length ? `<div class="wz-sugg"><div class="wz-sugg-t">Suggéré d’après le diagnostic</div>${sugg.map(s=>{ const svc = SERVICE_CATALOG.find(c=>c.code===s.code); return `<button class="wz-chip" data-action="wz-add-sugg" data-code="${s.code}">+ ${esc(svc.label)} <small>${esc(s.reason)}</small></button>`; }).join("")}</div>` : ""}
      <button class="btn-primary" style="width:100%;margin-bottom:16px;white-space:normal" data-action="wz-open-catalog">+ Ajouter une prestation ou un matériau</button>
      <div class="wz-lines">
        <div class="wz-line-head"><span>Désignation</span><span>Qté / unité</span><span>PU HT €</span><span>TVA</span><span>Total HT</span><span></span></div>
        ${x.lignes.map((l,i)=>`<div class="wz-line-row">
          <input class="wz-line" data-idx="${i}" data-field="designation" value="${esc(l.designation)}" placeholder="Désignation">
          <div class="wz-qte-unit">
            <input class="wz-line" data-idx="${i}" data-field="qte" type="number" min="0" step="1" value="${l.qte}">
            <select class="wz-line" data-idx="${i}" data-field="unite">${unitOptionsHtml(l.unite)}</select>
          </div>
          <input class="wz-line" data-idx="${i}" data-field="prixUnitaire" type="number" min="0" step="0.01" value="${(l.prixUnitaireCt/100).toFixed(2)}">
          <select class="wz-line" data-idx="${i}" data-field="tva">${[0,5.5,10,20].map(t=>`<option value="${t}" ${l.tvaPct===t?"selected":""}>${t} %</option>`).join("")}</select>
          <span class="wz-line-total">${fmtEuros(lineTotalHTct(l))}</span>
          <button class="btn-ghost btn-sm" data-action="wz-remove-line" data-idx="${i}" ${x.lignes.length<2?"disabled":""}>✕</button>
        </div>`).join("")}
      </div>
      <div class="wz-addbar"><button class="btn-secondary btn-sm" data-action="wz-add-line">+ Ligne libre</button></div>
      <div class="wz-totals" id="wzTotals">${wzTotalsHtml(wzDevisFromData())}</div>`;
  }
  if(w.step===3){
    if(!x.echeancier) x.echeancier = defaultEcheancier(x.fois||2);
    const dvLike = wzDevisFromData();
    const sumPct = x.echeancier.reduce((s,e)=>s+(e.pct||0),0);
    return `<p class="wz-intro">Comment le client règle-t-il ? Choisissez en combien de fois, personnalisez le libellé et le pourcentage de chaque paiement : une facture sera créée pour chacun, au fil du chantier.</p>
      <div class="wz-grid">
        <div class="form-field"><label>Nombre de paiements</label><select data-wz="fois" data-wz-rerender="1">${PAY_FOIS.map(n=>`<option value="${n}" ${x.fois===n?"selected":""}>${n===1?"1 fois (paiement unique)":n+" fois"}</option>`).join("")}</select></div>
        <div class="form-field"><label>Mode de règlement</label><select data-wz="mode" data-wz-rerender="1">${PAY_MODES.map(m=>`<option ${x.mode===m?"selected":""}>${m}</option>`).join("")}</select></div>
      </div>
      <div class="wz-ech-head"><span>Libellé (visible sur la facture)</span><span>%</span><span>Montant</span></div>
      ${x.echeancier.map((e,i)=>`
      <div class="wz-ech-row" data-idx="${i}">
        <input type="text" class="wz-ech" data-idx="${i}" data-field="label" value="${esc(e.label)}" placeholder="ex. Acompte à la signature">
        <span class="wz-pct-wrap"><input type="number" class="wz-ech" data-idx="${i}" data-field="pct" min="0" max="100" step="1" value="${e.pct}"><i>%</i></span>
        <span class="wz-ech-amt" id="wzEchAmt-${i}">${fmtEuros(echeanceTtcCt(dvLike,i))}</span>
      </div>`).join("")}
      <p class="form-help" id="wzEchTotal" style="margin:8px 0 0${sumPct!==100?";color:var(--red)":""}">Total : ${sumPct} % ${sumPct!==100?"— doit faire 100 % au total":"✓"}</p>
      <div class="wz-preview" style="margin-top:14px"><div class="wz-sugg-t">Échéancier prévu</div><div id="wzSchedule">${wzScheduleHtml(dvLike)}</div></div>`;
  }
  const dvLike = wzDevisFromData();
  return `<p class="wz-intro">Vérifiez avant de créer : rien n’est envoyé tant que vous ne le décidez pas.</p>
    <div class="wz-recap">
      <div class="wz-recap-row"><span>Client</span><b>${esc(d?d.client:"—")}</b></div>
      <div class="wz-recap-row"><span>Objet</span><b>${esc(x.objet)}</b></div>
      <div class="wz-recap-row"><span>Prestations</span><b>${dvLike.lignes.length} ligne${dvLike.lignes.length>1?"s":""}</b></div>
      <div class="wz-recap-row"><span>Validité</span><b>${x.validite} jours</b></div>
    </div>
    <div class="wz-totals">${wzTotalsHtml(dvLike)}</div>
    ${devisMargeHtml(dvLike)}
    <div class="wz-preview"><div class="wz-sugg-t">Conditions de règlement</div>${wzScheduleHtml(dvLike)}</div>`;
}

function wzFactureStep(w, d){
  const x = w.data;
  const dv = d && x.devisId ? findDevis(d, x.devisId) : null;
  if(w.step===1){
    const dossiers = visibleDossiers().filter(dd=>dd.devis.some(v=>v.statut==="Accepté"));
    const opts = dossiers.map(dd=>`<option value="${dd.id}" ${dd.id===w.dossierId?"selected":""}>${esc(dd.client)} · ${esc(dd.ville)}</option>`).join("");
    const types = dv ? wzFactureTypes(d, dv) : [];
    let info = "";
    if(!dossiers.length) info = `<div class="empty-note">Aucun devis accepté à facturer pour l’instant.</div>`;
    else if(d && !dv) info = `<div class="empty-note">Ce dossier n’a pas de devis accepté.</div>`;
    else if(dv && !types.length) info = `<div class="empty-note">Toutes les factures de ce devis sont déjà créées.</div>`;
    return `<p class="wz-intro">Choisissez le devis accepté à facturer.</p>
      <div class="form-field"><label>Dossier client</label><select data-wz="dossier" data-wz-rerender="1"><option value="">Choisir un client…</option>${opts}</select></div>
      ${wzClientCard(d)}
      ${dv ? `<div class="wz-recap"><div class="wz-recap-row"><span>Devis accepté</span><b>${esc(dv.numero)} · ${fmtEuros(devisTotals(dv).ttcCt)} TTC</b></div><div class="wz-recap-row"><span>Conditions</span><b>${esc(paiementSummary(dv).replace("Règlement : ",""))}</b></div></div>` : ""}
      ${types.length ? `<div class="form-field"><label>Type de facture</label><select data-wz="type" data-wz-rerender="1">${types.map(t=>`<option value="${t.v}" ${x.type===t.v?"selected":""}>${esc(t.label)}</option>`).join("")}</select></div>` : info}`;
  }
  if(w.step===2){
    const montantCt = Math.round((parseFloat(x.montant)||0)*100);
    return `<p class="wz-intro">Montant, échéance et mode de règlement.</p>
      <div class="wz-grid">
        <div class="form-field"><label>Montant TTC (€)</label><input type="number" min="0" step="0.01" data-wz="montant" value="${esc(x.montant)}"></div>
        <div class="form-field"><label>Échéance</label><input type="text" data-wz="echeance" value="${esc(x.echeance)}" placeholder="ex. 27 sept."></div>
        <div class="form-field"><label>Mode de règlement</label><select data-wz="mode" data-wz-rerender="1">${PAY_MODES.map(m=>`<option ${x.mode===m?"selected":""}>${m}</option>`).join("")}</select></div>
      </div>
      <div class="wz-preview"><div class="wz-sugg-t">Récapitulatif</div><div class="wz-sched"><span>${esc(x.echeance||"—")}</span><b>${fmtEuros(montantCt)}</b></div><div class="wz-sched mode"><span>Mode de règlement</span><b>${esc(x.mode)}</b></div></div>`;
  }
  const montantCt = Math.round((parseFloat(x.montant)||0)*100);
  const typeLabel = dv && x.type!=null ? devisPaiement(dv).echeancier[parseInt(x.type,10)].label : "Facture";
  return `<p class="wz-intro">Vérifiez avant de créer.</p>
    <div class="wz-recap">
      <div class="wz-recap-row"><span>Client</span><b>${esc(d?d.client:"—")}</b></div>
      <div class="wz-recap-row"><span>Paiement</span><b>${esc(typeLabel)}</b></div>
      <div class="wz-recap-row"><span>Détail</span><b>Reprend les ${dv?dv.lignes.length:0} lignes du devis</b></div>
      <div class="wz-recap-row"><span>Règlement</span><b>${esc(x.mode)} · échéance ${esc(x.echeance||"—")}</b></div>
    </div>
    <div class="wz-totals"><div class="wz-tot big"><span>Montant TTC</span><b>${fmtEuros(montantCt)}</b></div></div>`;
}

function wzNext(){
  wzFlush();
  const w = state.wizard, x = w.data;
  const d = w.dossierId ? byId(w.dossierId) : null;
  if(w.kind==="devis"){
    if(w.step===1){
      if(!d){ showToast("Choisissez un dossier client."); return; }
      if(!x.objet.trim()){ showToast("Indiquez l’objet des travaux."); return; }
    }
    if(w.step===2){
      if(!wzDevisFromData().lignes.some(l=>l.prixUnitaireCt>0)){ showToast("Ajoutez au moins une prestation avec un prix."); return; }
    }
    if(w.step===3){
      const sum = (x.echeancier||[]).reduce((s,e)=>s+(e.pct||0),0);
      if(sum!==100){ showToast("Le total des paiements doit faire 100 % (actuellement "+sum+" %)."); return; }
      if((x.echeancier||[]).some(e=>!e.label.trim())){ showToast("Donnez un libellé à chaque paiement."); return; }
    }
  } else {
    if(w.step===1){
      if(!d || !x.devisId || !x.type){ showToast("Choisissez un dossier avec un devis à facturer."); return; }
    }
    if(w.step===2){
      if(!(parseFloat(x.montant)>0)){ showToast("Indiquez un montant."); return; }
    }
  }
  w.step++;
  render();
}

function wzCreate(send){
  wzFlush();
  const w = state.wizard, x = w.data, d = byId(w.dossierId);
  if(w.kind==="devis"){
    const numero = nextDevisId(d);
    const dvLike = wzDevisFromData();
    const dv = {id:numero, numero, version:d.devis.length+1, statut:"Brouillon", lignes:dvLike.lignes, dateCreation:"12 sept.", dateEnvoi:null, objet:x.objet.trim(), validite:x.validite, paiement:dvLike.paiement};
    d.devis.push(dv);
    d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Devis "+numero+" créé ("+fmtEuros(devisTotals(dv).ttcCt)+" TTC)."});
    state.wizard = null;
    if(send) state.modal = {type:"send", id:d.id, kind:"devis", docId:dv.id, phase:"choose"};
    else { state.modal = null; state.section="dossiers"; state.dossierId=d.id; state.dossierTab="devis"; }
    render();
    if(!send) showToast("Devis créé en brouillon.");
    return;
  }
  const dv = findDevis(d, x.devisId);
  const f = createFacture(d, dv, parseInt(x.type,10), {montantCt: Math.round((parseFloat(x.montant)||0)*100), echeance:x.echeance, mode:x.mode});
  state.wizard = null;
  if(send) state.modal = {type:"send", id:d.id, kind:"facture", docId:f.id, phase:"choose"};
  else { state.modal = null; state.section="dossiers"; state.dossierId=d.id; state.dossierTab="devis"; }
  render();
  if(!send) showToast("Facture créée en brouillon.");
}

// Ouvre Gmail (webmail) avec destinataire, objet et message déjà remplis — plutôt que mailto: (qui
// dépend du client mail par défaut de l'appareil, pas toujours Gmail alors que c'est ce qu'utilise l'équipe).
function gmailComposeUrl(to, subject, body){
  return "https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(to||"")+"&su="+encodeURIComponent(subject||"")+"&body="+encodeURIComponent(body||"");
}

async function prepareSend(d, channel){
  const cur = state.modal || {};
  const kind = cur.kind || "report", docId = cur.docId || null;
  state.modal = {type:"send", id:d.id, kind, docId, phase:"prep", channel};
  render();
  try{
    const blob = await buildPdfFromHtml(docHtml(d, kind, docId), (i,n)=>{
      const el = document.getElementById("sendProgress");
      if(el) el.textContent = n>1 ? `Page ${i} / ${n}…` : "Mise en page…";
    });
    if(!state.modal || state.modal.phase!=="prep") return;
    const file = new File([blob], docFilename(d, kind, docId), {type:"application/pdf"});
    state.modal = {type:"send", id:d.id, kind, docId, phase:"ready", channel, file, text:docMessage(d, kind, docId, channel), subject:docSubject(d, kind, docId)};
  } catch(e){
    if(!state.modal || state.modal.phase!=="prep") return;
    state.modal = {type:"send", id:d.id, kind, docId, phase:"error", channel};
  }
  render();
}

function finishSend(d, channel, how){
  const m = state.modal || {};
  d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:docHistoryLabel(m.kind||"report", m.docId)+" envoyé au client ("+(channel==="whatsapp"?"WhatsApp":"e-mail")+", "+how+")."});
  const sentTarget = m.kind==="devis" ? findDevis(d, m.docId) : (m.kind==="facture" ? findFacture(d, m.docId) : d.diagnostic);
  if(sentTarget){ sentTarget.sent = sentTarget.sent || []; sentTarget.sent.push({date:"12 sept.", canal: channel==="whatsapp" ? "WhatsApp" : "e-mail"}); }
  if(m.kind==="devis" && m.docId){
    const dv = findDevis(d, m.docId);
    if(dv && dv.statut==="Brouillon"){ dv.statut = "Envoyé"; dv.dateEnvoi = "12 sept."; }
  }
  if(m.kind==="facture" && m.docId){
    const f = findFacture(d, m.docId);
    if(f && f.statut==="Brouillon") f.statut = "Envoyée";
  }
  state.modal = null;
  showToast(how==="PDF joint" ? "Envoyé avec le PDF joint." : "PDF téléchargé : joignez-le à la conversation (glisser-déposer) avant d’envoyer.");
}

// Envoi : sur téléphone, la feuille de partage joint directement le PDF et le message (WhatsApp, Mail…).
// Ailleurs (ordinateur), le PDF est téléchargé et la conversation s'ouvre avec le message prêt.
function sendNow(d){
  const m = state.modal;
  const file = m.file, channel = m.channel;
  const fallback = ()=>{
    downloadBlob(file, file.name);
    if(channel==="whatsapp"){
      const phone = (d.telephone||"").replace(/\D/g,"").replace(/^0/,"33");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(m.text)}`, "_blank");
    } else {
      window.open(gmailComposeUrl(d.email, m.subject, m.text), "_blank");
    }
    finishSend(d, channel, "PDF téléchargé");
  };
  if(navigator.canShare && navigator.canShare({files:[file]})){
    navigator.share({files:[file], title:m.subject, text:m.text})
      .then(()=>finishSend(d, channel, "PDF joint"))
      .catch(err=>{ if(err && err.name!=="AbortError") fallback(); });
  } else {
    fallback();
  }
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

// ---------- Connexion, inscription salarié ----------
function buildLogin(){
  if(SRV.on) return buildLoginServer();
  const opts = SETTINGS.employees.filter(e=>e.statut==="actif").map(e=>`<option value="${e.id}" ${state.userId===e.id?"selected":""}>${esc(e.nom)} · ${esc(ROLES[e.role].label)}</option>`).join("") + `<option value="CLIENT">Marie Laurent · Client</option>`;
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <h1>Connexion à votre espace</h1>
      <p>Salarié : connectez-vous avec votre e-mail.</p>
      <div class="form-field"><label>E-mail</label><input type="email" id="loginEmail" value="${esc(state.loginEmail||"")}" autocomplete="username" placeholder="prenom.nom@entreprise.fr"></div>
      <div class="form-field"><label>Mot de passe</label><input type="password" id="loginPwd" autocomplete="current-password"></div>
      ${state.loginMsg ? `<div class="login-msg">${esc(state.loginMsg)}</div>` : ""}
      <button class="btn-primary login-submit" data-action="login-submit">Se connecter</button>
      <button class="link-btn login-link" data-action="goto-forgot">Mot de passe oublié ?</button>
      <button class="link-btn login-link" data-action="goto-signup">Nouveau salarié ? Créer mon accès</button>
      <div class="login-sep"><span>Accès démonstration</span></div>
      <div class="form-field"><label>Profil de démonstration</label><select id="loginRole">${opts}</select></div>
      <button class="btn-secondary login-submit" data-action="do-login">Entrer en mode démo</button>
      <div class="login-help">Démo interactive · Aucune donnée réelle · Aucun e-mail envoyé</div>
    </div>
  </div>`;
}

function buildForgot(){
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <h1>Mot de passe oublié</h1>
      <p>Indiquez votre e-mail : la direction est prévenue et vous envoie un mot de passe temporaire.</p>
      <div class="form-field"><label>E-mail</label><input type="email" id="fgEmail" value="${esc(state.loginEmail||"")}" autocomplete="username"></div>
      ${state.loginMsg ? `<div class="login-msg ok">${esc(state.loginMsg)}</div>` : ""}
      <button class="btn-primary login-submit" data-action="forgot-submit">Envoyer la demande</button>
      <button class="link-btn login-link" data-action="goto-login">← Retour à la connexion</button>
    </div>
  </div>`;
}
function modalChgPwd(){
  return modalWrap("Choisissez votre mot de passe", `
    <p class="form-help" style="margin-bottom:12px">Votre mot de passe a été réinitialisé : choisissez-en un nouveau pour continuer.</p>
    <div class="form-field"><label>Nouveau mot de passe</label><input type="password" id="npPwd" autocomplete="new-password"></div>
    <div class="form-field"><label>Confirmer</label><input type="password" id="npPwd2" autocomplete="new-password"></div>
    <div class="modal-actions"><button class="btn-primary" data-action="chgpwd-save">Enregistrer</button></div>`);
}
function buildLoginServer(){
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <h1>Connexion à votre espace</h1>
      <p>Connectez-vous avec votre e-mail professionnel.</p>
      <div class="form-field"><label>E-mail</label><input type="email" id="loginEmail" value="${esc(state.loginEmail||"")}" autocomplete="username" placeholder="prenom.nom@entreprise.fr"></div>
      <div class="form-field"><label>Mot de passe</label><input type="password" id="loginPwd" autocomplete="current-password"></div>
      ${state.loginMsg ? `<div class="login-msg">${esc(state.loginMsg)}</div>` : ""}
      <button class="btn-primary login-submit" data-action="login-submit">Se connecter</button>
      <button class="link-btn login-link" data-action="goto-forgot">Mot de passe oublié ?</button>
      <button class="link-btn login-link" data-action="goto-signup">Nouveau salarié ? Créer mon accès</button>
    </div>
  </div>`;
}
function buildSignup(){
  const s = state.signup || {};
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <h1>Créer mon accès salarié</h1>
      <p>Remplissez ce formulaire : la direction recevra votre demande, l’acceptera et vous attribuera un rôle.</p>
      <div class="form-field"><label>Nom et prénom</label><input type="text" id="suNom" value="${esc(s.nom||"")}" autocomplete="name"></div>
      <div class="form-field"><label>E-mail</label><input type="email" id="suEmail" value="${esc(s.email||"")}" autocomplete="username"></div>
      <div class="form-field"><label>Téléphone</label><input type="tel" id="suTel" value="${esc(s.tel||"")}" autocomplete="tel"></div>
      <div class="form-field"><label>Poste souhaité</label><select id="suPoste">${["Technicien","Commercial","Administratif","Autre"].map(p=>`<option ${s.poste===p?"selected":""}>${p}</option>`).join("")}</select></div>
      <div class="form-field"><label>Mot de passe</label><input type="password" id="suPwd" autocomplete="new-password"></div>
      <div class="form-field"><label>Confirmer le mot de passe</label><input type="password" id="suPwd2" autocomplete="new-password"></div>
      ${state.signupMsg ? `<div class="login-msg">${esc(state.signupMsg)}</div>` : ""}
      <button class="btn-primary login-submit" data-action="signup-submit">Envoyer ma demande</button>
      <button class="link-btn login-link" data-action="goto-login">← Retour à la connexion</button>
    </div>
  </div>`;
}

function buildSignupDone(){
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <div class="signup-ok">✓</div>
      <h1>Demande envoyée</h1>
      <p>Votre demande d’accès a bien été transmise à la direction. Vous pourrez vous connecter avec votre e-mail dès qu’elle aura été acceptée.</p>
      <button class="btn-primary login-submit" data-action="goto-login">Retour à la connexion</button>
    </div>
  </div>`;
}

// ---------- Paramètres (directeur) ----------
function renderParametres(){
  const pend = pendingRequests().length;
  const tabs = [["equipe","Équipe"],["demandes","Demandes d’accès"+(pend?" ("+pend+")":"")],["acces","Accès par rôle"],["entreprise","Entreprise"]].concat(typeof PARAM_EXTRA_TABS!=="undefined" ? PARAM_EXTRA_TABS : []);
  if(!tabs.find(t=>t[0]===state.paramTab)) state.paramTab = "equipe";
  let body = "";
  if(state.paramTab==="equipe") body = paramEquipe();
  else if(state.paramTab==="demandes") body = paramDemandes();
  else if(state.paramTab==="acces") body = paramAcces();
  else if(state.paramTab==="entreprise") body = paramEntreprise();
  else if(typeof renderParamExtra==="function") body = renderParamExtra(state.paramTab);
  return `
  <div class="page-header"><div><h1>Paramètres</h1><p>Réservé à la direction et aux administrateurs : équipe, accès, entreprise et personnalisation de l’application.</p></div></div>
  <div class="tabs">${tabs.map(([k,l])=>`<button class="tab-btn ${state.paramTab===k?"active":""}" data-action="param-tab" data-tab="${k}">${esc(l)}</button>`).join("")}</div>
  ${body}`;
}

// ---------- E-mails de marque : modèles, aperçu, invitations, réinitialisation ----------
// NB : l'application est 100 % navigateur, sans serveur d'envoi. Les messages sont générés à l'identique de ce que recevra le
// destinataire (HTML de marque) puis ouverts dans la messagerie de l'utilisateur, copiés ou téléchargés. L'envoi automatique
// (confirmation d'e-mail, mot de passe oublié…) suppose un service d'e-mail : voir docs/erp/EMAILS.md.
function siteBase(){ return location.origin + location.pathname.replace(/[^/]*$/, ""); }
function mailBrand(){
  const c = SETTINGS.company || {};
  return {nom:c.nom||"Maître Toiturier", tel:c.telephone||"", email:c.email||"", site:c.site||""};
}
function mailSign(){
  const b = mailBrand();
  return "L’équipe "+b.nom;
}

const EMAIL_TEMPLATES = {
  invitation_salarie: {
    label:"Invitation d’un salarié", group:"Équipe", desc:"Envoyée par la direction pour inviter un salarié à créer son accès.",
    sample:{nom:"Julien", role:"Technicien", inviteur:"la direction", lien:"https://app-maitretoiturier.fr/?inscription=1"},
    build:v=>({subject:"Vous êtes invité(e) à rejoindre "+mailBrand().nom, preheader:"Créez votre accès en 2 minutes.", title:"Bienvenue dans l’équipe",
      paras:["Bonjour"+(v.nom?" "+v.nom:"")+",", mailBrand().nom+" vous invite à rejoindre son espace de travail"+(v.role?" en tant que "+v.role.toLowerCase():"")+".", "Créez votre accès en quelques instants : renseignez vos coordonnées et choisissez votre mot de passe. La direction validera ensuite votre demande et activera votre profil."],
      cta:{label:"Créer mon accès", url:v.lien}, note:"Ce lien est personnel. Si vous n’attendiez pas cette invitation, vous pouvez ignorer ce message."})
  },
  invitation_client: {
    label:"Invitation client — espace personnel", group:"Clients", desc:"Invite un client à consulter son dossier, ses documents et son rapport.",
    sample:{client:"Marie Laurent", conseiller:"Sarah Durand", lien:"https://app-maitretoiturier.fr/"},
    build:v=>({subject:"Votre espace client "+mailBrand().nom, preheader:"Retrouvez votre rapport, vos devis et vos factures.", title:"Votre espace client est prêt",
      paras:["Bonjour "+(v.client||"")+",", "Nous avons ouvert votre espace client : vous y retrouvez en un seul endroit le rapport de diagnostic de votre toiture, vos devis, vos factures et l’avancement de votre chantier.", (v.conseiller?v.conseiller+", votre conseiller, reste":"Notre équipe reste")+" à votre disposition pour toute question."],
      cta:{label:"Accéder à mon espace", url:v.lien}, note:"Vos informations sont confidentielles et ne sont visibles que par vous et notre équipe."})
  },
  confirmation_email: {
    label:"Confirmation d’adresse e-mail", group:"Compte", desc:"À envoyer à la création d’un compte pour confirmer l’adresse.",
    sample:{nom:"Julien", lien:"https://app-maitretoiturier.fr/confirmer?token=…"},
    build:v=>({subject:"Confirmez votre adresse e-mail", preheader:"Un dernier clic pour activer votre compte.", title:"Confirmez votre adresse e-mail",
      paras:["Bonjour"+(v.nom?" "+v.nom:"")+",", "Merci d’avoir créé votre compte "+mailBrand().nom+". Pour finaliser votre inscription, confirmez votre adresse e-mail en cliquant sur le bouton ci-dessous."],
      cta:{label:"Confirmer mon adresse", url:v.lien}, note:"Ce lien est valable 24 heures. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement ce message."})
  },
  reinit_mdp: {
    label:"Réinitialisation du mot de passe", group:"Compte", desc:"Envoyée quand la direction réinitialise l’accès d’un salarié.",
    sample:{nom:"Julien", mdp:"K7m-92xQ", lien:"https://app-maitretoiturier.fr/"},
    build:v=>({subject:"Réinitialisation de votre mot de passe", preheader:"Votre mot de passe temporaire est prêt.", title:"Mot de passe réinitialisé",
      paras:["Bonjour"+(v.nom?" "+v.nom:"")+",", "Suite à votre demande, votre mot de passe a été réinitialisé. Utilisez le mot de passe temporaire ci-dessous pour vous connecter ; il vous sera demandé d’en choisir un nouveau immédiatement.", {rows:[["Mot de passe temporaire", v.mdp||"—"]]}],
      cta:{label:"Me connecter", url:v.lien}, note:"Si vous n’avez pas demandé cette réinitialisation, prévenez la direction sans attendre."})
  },
  acces_accepte: {
    label:"Accès accepté", group:"Équipe", desc:"Confirme au salarié que son accès est activé et son rôle attribué.",
    sample:{nom:"Julien", role:"Technicien", lien:"https://app-maitretoiturier.fr/"},
    build:v=>({subject:"Votre accès est activé", preheader:"Vous pouvez vous connecter dès maintenant.", title:"Votre accès est activé",
      paras:["Bonjour"+(v.nom?" "+v.nom:"")+",", "La direction a validé votre demande. Votre profil est configuré en tant que "+(v.role||"salarié").toLowerCase()+" : vous accédez aux onglets qui correspondent à votre rôle.", "Connectez-vous avec votre adresse e-mail et le mot de passe choisi lors de votre inscription."],
      cta:{label:"Me connecter", url:v.lien}, note:"Un souci de connexion ? Répondez simplement à cet e-mail."})
  },
  acces_refuse: {
    label:"Demande d’accès refusée", group:"Équipe", desc:"Informe poliment qu’une demande d’accès n’a pas été retenue.",
    sample:{nom:"Julien"},
    build:v=>({subject:"Votre demande d’accès", preheader:"Réponse à votre demande.", title:"À propos de votre demande",
      paras:["Bonjour"+(v.nom?" "+v.nom:"")+",", "Nous avons bien reçu votre demande d’accès à l’espace de travail. Elle n’a malheureusement pas pu être acceptée pour le moment.", "Pour toute précision, vous pouvez contacter directement la direction."],
      cta:null, note:""})
  },
  devis: {
    label:"Envoi d’un devis", group:"Commercial", desc:"Message d’accompagnement d’un devis (PDF en pièce jointe).",
    sample:{client:"Claire Fontaine", numero:"TP-1042-D2", montant:"806,50 €", conditions:"30 % à la commande, solde en 2 fois par chèque", conseiller:"Sarah Durand", lien:""},
    build:v=>({subject:"Votre devis "+(v.numero||"")+" — "+mailBrand().nom, preheader:"Votre devis est en pièce jointe.", title:"Votre devis",
      paras:["Bonjour "+(v.client||"")+",", "Suite à notre échange, veuillez trouver ci-joint votre devis. Il détaille l’ensemble des prestations proposées pour votre toiture.", {rows:[["Devis", v.numero||"—"],["Montant TTC", v.montant||"—"],["Conditions", v.conditions||"—"]]}, "Pour l’accepter, il vous suffit de nous répondre « bon pour accord » : nous planifierons ensuite le chantier avec vous."],
      cta:null, note:(v.conseiller?"Votre conseiller : "+v.conseiller+".":"")})
  },
  facture: {
    label:"Envoi d’une facture", group:"Commercial", desc:"Message d’accompagnement d’une facture (PDF en pièce jointe).",
    sample:{client:"Claire Fontaine", numero:"TP-1042-F1", montant:"241,95 €", echeance:"27 sept.", mode:"Virement", iban:"", lien:""},
    build:v=>({subject:"Votre facture "+(v.numero||"")+" — "+mailBrand().nom, preheader:"Votre facture est en pièce jointe.", title:"Votre facture",
      paras:["Bonjour "+(v.client||"")+",", "Veuillez trouver ci-joint votre facture.", {rows:[["Facture", v.numero||"—"],["Montant TTC", v.montant||"—"],["À régler avant le", v.echeance||"—"],["Mode de paiement", v.mode||"—"]].concat(v.iban?[["IBAN", v.iban]]:[])}, "Merci de votre confiance."],
      cta:null, note:""})
  },
  rappel_paiement: {
    label:"Rappel de paiement", group:"Commercial", desc:"Relance courtoise d’une facture impayée.",
    sample:{client:"Antoine Garnier", numero:"TP-1043-F1", montant:"108,00 €", echeance:"26 sept."},
    build:v=>({subject:"Rappel — facture "+(v.numero||""), preheader:"Un petit rappel concernant votre facture.", title:"Un petit rappel",
      paras:["Bonjour "+(v.client||"")+",", "Sauf erreur de notre part, la facture ci-dessous n’a pas encore été réglée.", {rows:[["Facture", v.numero||"—"],["Reste à régler", v.montant||"—"],["Échéance", v.echeance||"—"]]}, "Si votre règlement est déjà parti, merci de ne pas tenir compte de ce message. Dans le cas contraire, nous restons à votre disposition pour toute question."],
      cta:null, note:""})
  },
  paiement_recu: {
    label:"Paiement reçu", group:"Commercial", desc:"Accusé de réception d’un règlement.",
    sample:{client:"Claire Fontaine", numero:"TP-1042-F1", montant:"241,95 €", reste:"564,55 €"},
    build:v=>({subject:"Paiement reçu — merci !", preheader:"Nous avons bien reçu votre règlement.", title:"Paiement bien reçu",
      paras:["Bonjour "+(v.client||"")+",", "Nous avons bien reçu votre règlement, merci !", {rows:[["Facture", v.numero||"—"],["Montant reçu", v.montant||"—"],["Reste à régler", v.reste||"0,00 €"]]}, "À très bientôt sur votre chantier."],
      cta:null, note:""})
  }
};
function esc0(x){ return esc(x); }

function mailLogoUrl(){ return siteBase()+"assets/logo-full.png"; }
function buildEmail(id, vars){
  const t = EMAIL_TEMPLATES[id], b = mailBrand();
  const m = t.build(vars || t.sample);
  const rowsHtml = rows=>`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;border:1px solid #e8e2d2;border-radius:10px;border-collapse:separate;background:#fbf8f0">${rows.map(([k,v],i)=>`<tr><td style="padding:10px 14px;font-size:13px;color:#7a7263;${i?"border-top:1px solid #eee7d6;":""}">${esc(k)}</td><td style="padding:10px 14px;font-size:14px;font-weight:600;color:#1a1814;text-align:right;${i?"border-top:1px solid #eee7d6;":""}">${esc(v)}</td></tr>`).join("")}</table>`;
  const body = m.paras.map(p=> typeof p==="string" ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#2b2822">${p}</p>` : rowsHtml(p.rows)).join("");
  const cta = m.cta && m.cta.url ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px"><tr><td style="background:#d4af37;border-radius:10px"><a href="${esc(m.cta.url)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#111;text-decoration:none;font-family:Arial,Helvetica,sans-serif">${esc(m.cta.label)}</a></td></tr></table><p style="margin:8px 0 0;font-size:12px;color:#8a8272;word-break:break-all">Si le bouton ne s’affiche pas, copiez ce lien : ${esc(m.cta.url)}</p>` : "";
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(m.subject)}</title></head>
<body style="margin:0;padding:0;background:#efeadf;font-family:Arial,Helvetica,sans-serif">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(m.preheader||"")}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efeadf;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;background:#ffffff;box-shadow:0 8px 30px rgba(0,0,0,.12)">
  <tr><td style="background:#0b0b0b;padding:26px 32px;text-align:center;border-bottom:3px solid #d4af37"><img src="${esc(mailLogoUrl())}" alt="${esc(b.nom)}" height="54" style="height:54px;max-width:100%;display:inline-block"></td></tr>
  <tr><td style="padding:34px 34px 10px">
    <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#111">${esc(m.title)}</h1>
    ${body}${cta}
    ${m.note?`<p style="margin:18px 0 0;font-size:12.5px;line-height:1.55;color:#8a8272">${esc(m.note)}</p>`:""}
    <p style="margin:26px 0 4px;font-size:15px;color:#2b2822">Cordialement,</p>
    <p style="margin:0 0 26px;font-size:15px;font-weight:700;color:#111">${esc(mailSign())}</p>
  </td></tr>
  <tr><td style="background:#0b0b0b;padding:20px 32px;text-align:center;font-size:12px;line-height:1.7;color:#b7ae9c">
    <span style="color:#d4af37;font-weight:700">${esc(b.nom)}</span><br>${[b.tel,b.email,b.site].filter(Boolean).map(esc).join(" · ")}
  </td></tr>
</table>
<p style="margin:14px 0 0;font-size:11px;color:#9a9282">Cet e-mail vous a été envoyé par ${esc(b.nom)}.</p>
</td></tr></table></body></html>`;
  const text = [m.title, ""].concat(m.paras.map(p=> typeof p==="string" ? p : p.rows.map(([k,v])=>k+" : "+v).join("\n"))).concat(m.cta&&m.cta.url?["", m.cta.label+" : "+m.cta.url]:[]).concat(m.note?["", m.note]:[]).concat(["", "Cordialement,", mailSign(), [b.nom,b.tel,b.email].filter(Boolean).join(" · ")]).join("\n");
  return {subject:m.subject, html, text};
}

// Modal d'envoi : aperçu fidèle + messagerie / copie / téléchargement / WhatsApp
// Pour les e-mails de compte/accès (invitation, mot de passe…), l'envoi part automatiquement
// dès l'ouverture si l'envoi auto est configuré : pas de double clic "préparer" puis "envoyer".
function openMailSend(tpl, vars, to, phone){
  state.modal = {type:"mailsend", tpl, vars, to:to||"", phone:phone||""};
  render();
  if(SRV.on && SRV.mail && to) sendMailAuto();
}
function sendMailAuto(){
  const m = state.modal;
  if(!m || m.type!=="mailsend" || !m.to || m.sending || m.sent) return;
  const e = buildEmail(m.tpl, m.vars);
  m.sending = true; render();
  srvApi("mail","POST",{to:m.to, subject:e.subject, html:e.html, text:e.text})
    .then(()=>{ m.sending=false; m.sent=true; render(); showToast("E-mail envoyé."); })
    .catch(err=>{ m.sending=false; render(); showToast(err.message||"Envoi impossible."); });
}
function modalMailSend(m){
  const e = buildEmail(m.tpl, m.vars);
  const label = EMAIL_TEMPLATES[m.tpl].label;
  const mailto = gmailComposeUrl(m.to, e.subject, e.text);
  const wa = m.phone ? "https://wa.me/"+m.phone.replace(/\D/g,"").replace(/^0/,"33")+"?text="+encodeURIComponent(e.subject+"\n\n"+e.text) : "";
  const canAuto = SRV.on && SRV.mail && !!m.to;
  const footnote = canAuto
    ? "L’e-mail part directement depuis notre serveur, à l’adresse indiquée ci-dessus."
    : (SRV.on ? "Envoi automatique non configuré pour cette adresse (voir docs/EMAILS_AUTOMATIQUES.md) : le message s’ouvre prêt à partir dans votre messagerie." : "Aucun envoi automatique depuis cette démo : le message s’ouvre prêt à partir dans votre messagerie (version texte) ; le HTML de marque ci-dessus est copiable pour un service d’e-mail.");
  return modalWrap(label, `
    <p class="form-help" style="margin:0 0 10px">${m.to?"Destinataire : <b>"+esc(m.to)+"</b> · ":""}Objet : <b>${esc(e.subject)}</b></p>
    <iframe class="mail-frame" sandbox="" srcdoc="${esc(e.html)}"></iframe>
    ${m.sent ? `<div class="mail-sent-ok">✓ E-mail envoyé à ${esc(m.to)}</div>` : ""}
    <div class="modal-actions" style="flex-wrap:wrap">
      ${canAuto && !m.sent ? `<button class="btn-primary btn-sm" data-action="mail-send-auto" ${m.sending?"disabled":""}>${m.sending?"Envoi en cours…":"Envoyer par e-mail"}</button>` : ""}
      <a class="${canAuto?"btn-secondary":"btn-primary"} btn-sm" href="${mailto}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Ouvrir dans Gmail</a>
      ${wa?`<a class="btn-secondary btn-sm" href="${wa}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">WhatsApp</a>`:""}
      <button class="btn-secondary btn-sm" data-action="mail-copy-html">Copier le HTML</button>
      <button class="btn-secondary btn-sm" data-action="mail-download">Télécharger</button>
      <button class="btn-ghost btn-sm" data-action="modal-close">Fermer</button>
    </div>
    <p class="form-help" style="margin-top:10px">${footnote}</p>`);
}

// Onglet Paramètres › E-mails
const PARAM_EXTRA_TABS = [["perso","Personnalisation"],["donnees","Données"],["emails","E-mails"]];
function renderParamExtra(tab){
  if(tab==="perso") return renderParamPerso();
  if(tab==="donnees") return renderParamDonnees();
  if(tab!=="emails") return "";
  const groups = {};
  Object.keys(EMAIL_TEMPLATES).forEach(k=>{ const g = EMAIL_TEMPLATES[k].group; (groups[g] = groups[g]||[]).push(k); });
  return Object.keys(groups).map(g=>`
  <div class="card">
    <div class="card-header"><h3>${esc(g)}</h3></div>
    ${groups[g].map(k=>`
      <div class="row-item"><div><div class="row-title">${esc(EMAIL_TEMPLATES[k].label)}</div><div class="row-sub">${esc(EMAIL_TEMPLATES[k].desc)}</div></div>
      <button class="btn-secondary btn-sm" data-action="mail-preview" data-tpl="${k}">Aperçu</button></div>`).join("")}
  </div>`).join("") + `<p class="form-help">Tous les e-mails reprennent l’identité de la marque et les coordonnées saisies dans « Entreprise ».</p>`;
}

// ---------- Persistance locale (IndexedDB) : les dossiers survivent au rechargement ----------
// NB : sans serveur, les données restent DANS CE NAVIGATEUR (pas partagées entre appareils). Sauvegarde/restauration en JSON dans l'onglet Données.
const DATA_VERSION = 1;
let PERSIST_READY = false, SAVE_TIMER = null;
function idbOpen(){
  return new Promise((res, rej)=>{
    const r = indexedDB.open("mt_data", 1);
    r.onupgradeneeded = ()=>r.result.createObjectStore("kv");
    r.onsuccess = ()=>res(r.result);
    r.onerror = ()=>rej(r.error);
  });
}
async function idbSet(k, v){
  const db = await idbOpen();
  return new Promise((res, rej)=>{ const tx = db.transaction("kv","readwrite"); tx.objectStore("kv").put(v, k); tx.oncomplete = res; tx.onerror = ()=>rej(tx.error); });
}
async function idbGet(k){
  const db = await idbOpen();
  return new Promise((res, rej)=>{ const tx = db.transaction("kv","readonly"); const q = tx.objectStore("kv").get(k); q.onsuccess = ()=>res(q.result); q.onerror = ()=>rej(q.error); });
}
function scheduleSave(){
  if(typeof SRV!=="undefined" && SRV.on){ srvSchedule(); return; }
  if(!PERSIST_READY) return;
  clearTimeout(SAVE_TIMER);
  SAVE_TIMER = setTimeout(()=>{ idbSet("data", {v:DATA_VERSION, dossiers:DOSSIERS, contracts:CONTRACTS, parrainages:PARRAINAGES}).catch(()=>{}); }, 700);
}
function applyData(x){
  DOSSIERS = x.dossiers;
  CONTRACTS.length = 0; (x.contracts||[]).forEach(c=>CONTRACTS.push(c));
  PARRAINAGES.length = 0; (x.parrainages||[]).forEach(p=>PARRAINAGES.push(p));
  ensurePoints();
}
async function loadPersisted(){
  try{
    const x = await idbGet("data");
    if(x && x.v===DATA_VERSION && Array.isArray(x.dossiers)) applyData(x);
  }catch(e){}
  PERSIST_READY = true;
}

// ---------- Personnalisation sans développeur (catalogue, paiements, diagnostic) ----------
const CUSTOM_KEY = "mt_custom_v1";
function customObj(){ return {catalogue:SERVICE_CATALOG, materiel:MATERIEL_CATALOG, payModes:PAY_MODES, points:POINTS, pointAnoms:POINT_ANOMALIES, vocab:ANOMALY_VOCAB}; }
function saveCustom(){
  try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(customObj())); }catch(e){}
  if(typeof SRV!=="undefined" && SRV.on) srvSettingsSoon();
}
function applyCustom(c){
  if(!c) return;
  // Fusionne les données sauvegardées (personnalisations de l'utilisateur) avec les valeurs par
  // défaut actuelles du code, au lieu d'écraser : ainsi les nouveaux points/prestations ajoutés
  // dans une mise à jour de l'appli apparaissent, sans perdre les personnalisations déjà faites.
  const fillByKey = (arr, src, keyOf)=>{
    if(!Array.isArray(src) || !src.length) return;
    const defaults = arr.slice();
    const savedKeys = new Set(src.map(keyOf));
    const merged = src.slice();
    defaults.forEach(x=>{ if(!savedKeys.has(keyOf(x))) merged.push(x); });
    arr.length = 0; merged.forEach(x=>arr.push(x));
  };
  fillByKey(SERVICE_CATALOG, c.catalogue, x=>x.code);
  fillByKey(MATERIEL_CATALOG, c.materiel, x=>x.code);
  fillByKey(POINTS, c.points, x=>x);
  if(Array.isArray(c.payModes) && c.payModes.length){ PAY_MODES.length = 0; c.payModes.forEach(x=>PAY_MODES.push(x)); }
  if(c.pointAnoms) Object.assign(POINT_ANOMALIES, c.pointAnoms);
  if(c.vocab) Object.assign(ANOMALY_VOCAB, c.vocab);
}
function loadCustom(){
  try{ applyCustom(JSON.parse(localStorage.getItem(CUSTOM_KEY) || "null")); }catch(e){}
}
function ensurePoints(){
  DOSSIERS.forEach(d=>{
    if(!d.diagnostic || !d.diagnostic.points) return;
    POINTS.forEach(p=>{ if(!d.diagnostic.points[p]) d.diagnostic.points[p] = freshPoint(); });
  });
}
function persoChange(el){
  const [kind, key, field] = el.dataset.pc.split("|");
  const v = el.value;
  let rerender = false;
  if(kind==="cat"){
    const s = SERVICE_CATALOG[parseInt(key,10)]; if(!s) return;
    if(field==="label") s.label = v.trim() || s.label;
    else if(field==="vente"){ s.prixUnitaireCt = Math.round((parseFloat(v)||0)*100); rerender = true; }
    else if(field==="achat"){ s.prixAchatCt = Math.round((parseFloat(v)||0)*100); rerender = true; }
    else if(field==="tva") s.tvaPct = parseFloat(v)||0;
    else if(field==="unite") s.unite = v.trim() || "forfait";
  } else if(kind==="mat"){
    const m = MATERIEL_CATALOG[parseInt(key,10)]; if(!m) return;
    if(field==="label") m.label = v.trim() || m.label;
    else if(field==="vente"){ m.prixVenteCt = Math.round((parseFloat(v)||0)*100); rerender = true; }
    else if(field==="achat"){ m.prixAchatCt = Math.round((parseFloat(v)||0)*100); rerender = true; }
    else if(field==="tva") m.tvaPct = parseFloat(v)||0;
    else if(field==="unite") m.unite = v.trim() || "u";
  } else if(kind==="anom"){
    const a = ANOMALY_VOCAB[key]; if(!a) return;
    if(field==="label") a.label = v.trim() || a.label; else if(field==="icon") a.icon = v.trim() || a.icon; else if(field==="risk") a.risk = v.trim() || a.risk;
  }
  saveCustom();
  if(rerender) render(); else showToast("Enregistré.");
}
function margeRow(achatCt, venteCt, label){
  const pct = venteCt>0 ? Math.round((venteCt-achatCt)/venteCt*1000)/10 : null;
  return `<div class="pc-marge ${margeBadgeCls(pct)}"${label?` data-label="${esc(label)}"`:""}>${pct!=null ? pct+" %" : "—"}</div>`;
}

function renderParamPerso(){
  const tvas = [0,5.5,10,20];
  return `
  <div class="card">
    <div class="card-header"><h3>Moyens de paiement</h3></div>
    <div class="chip-list">${PAY_MODES.map((m,i)=>`<span class="pc-chip">${esc(m)} <button data-action="perso-del-pay" data-idx="${i}" aria-label="Retirer">✕</button></span>`).join("")}</div>
    <div class="pc-row pc-new" style="margin-top:10px"><input type="text" id="pcNewPay" placeholder="Nouveau moyen (ex. Prélèvement, Chèque énergie…)"><button class="btn-primary btn-sm" data-action="perso-add-pay">+ Ajouter</button></div>
  </div>
  <div class="card">
    <div class="card-header"><h3>Diagnostic : points de contrôle et réponses</h3></div>
    <p class="form-help" style="margin:0 0 12px">Ajoutez un point de contrôle (une « question »), ou de nouvelles réponses possibles pour chaque point. Elles apparaissent aussitôt dans le diagnostic et le rapport. La trame du rapport PDF reste inchangée.</p>
    ${POINTS.map((p,pi)=>{
      const ids = POINT_ANOMALIES[p] || [];
      return `<details class="pc-point"><summary>${esc(p)} <span class="row-sub">${ids.length} réponse(s)</span></summary>
        ${ids.map(id=>{ const a = ANOMALY_VOCAB[id]; if(!a) return ""; return `
        <div class="pc-row pc-anom">
          <input type="text" value="${esc(a.icon)}" data-pc="anom|${id}|icon" style="max-width:56px" aria-label="Icône">
          <input type="text" value="${esc(a.label)}" data-pc="anom|${id}|label" aria-label="Réponse">
          <input type="text" value="${esc(a.risk)}" data-pc="anom|${id}|risk" aria-label="Risque expliqué au client">
          <button class="btn-ghost btn-sm" data-action="perso-del-anom" data-pi="${pi}" data-aid="${id}">✕</button>
        </div>`; }).join("")}
        <div class="pc-row pc-new">
          <input type="text" id="pcaIcon-${pi}" placeholder="🔧" style="max-width:56px">
          <input type="text" id="pcaLabel-${pi}" placeholder="Nouvelle réponse (ex. Zinc oxydé)">
          <input type="text" id="pcaRisk-${pi}" placeholder="Ce que cela risque (phrase pour le client)">
          <button class="btn-secondary btn-sm" data-action="perso-add-anom" data-pi="${pi}">+ Ajouter</button>
        </div>
        <button class="btn-ghost btn-sm" data-action="perso-del-point" data-pi="${pi}">Retirer ce point de contrôle</button>
      </details>`; }).join("")}
    <div class="pc-row pc-new" style="margin-top:12px"><input type="text" id="pcNewPoint" placeholder="Nouveau point de contrôle (ex. Fenêtres de toit)"><button class="btn-primary btn-sm" data-action="perso-add-point">+ Ajouter le point</button></div>
  </div>`;
}

// ---------- Données : sauvegarde, restauration, import CSV, base vierge ----------
function renderParamDonnees(){
  return `
  <div class="card">
    <div class="card-header"><h3>Base de données (${DOSSIERS.length} dossier${DOSSIERS.length>1?"s":""})</h3></div>
    <p class="form-help" style="margin:0 0 12px">Les dossiers sont enregistrés automatiquement <b>dans ce navigateur</b> (ils survivent au rechargement). Ils ne sont pas partagés entre appareils : pensez à exporter une sauvegarde.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-primary btn-sm" data-action="data-export">Exporter une sauvegarde (JSON)</button>
      <button class="btn-secondary btn-sm" data-action="trigger-file" data-target="importJson">Restaurer une sauvegarde</button>
    </div>
    <input type="file" id="importJson" accept="application/json,.json" style="display:none">
  </div>
  <div class="card">
    <div class="card-header"><h3>Importer des clients (CSV / Excel enregistré en CSV)</h3></div>
    <p class="form-help" style="margin:0 0 12px">1ʳᵉ ligne = titres de colonnes. Reconnus : <b>nom, téléphone, e-mail, ville, adresse, motif, type</b> (séparateur « ; » ou « , »). Les doublons (même nom + téléphone) sont ignorés ; un récapitulatif vous est présenté avant l’import.</p>
    <button class="btn-secondary btn-sm" data-action="trigger-file" data-target="importCsv">Choisir un fichier CSV</button>
    <input type="file" id="importCsv" accept=".csv,text/csv,text/plain" style="display:none">
  </div>
  <div class="card">
    <div class="card-header"><h3>Repartir d’une base vierge</h3></div>
    <p class="form-help" style="margin:0 0 12px">Supprime tous les dossiers, contrats et parrainages de démonstration pour commencer avec vos vrais clients. Réglages, équipe et personnalisation sont conservés. Pensez à exporter une sauvegarde avant.</p>
    <button class="btn-danger" data-action="data-clear">Effacer les données de démonstration</button>
    ${SRV.on ? `<button class="btn-secondary" style="margin-left:8px" data-action="demo-load">Charger des dossiers de démonstration</button>` : ""}
  </div>`;
}
function norm(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z]/g,""); }
function parseCsv(text){
  text = text.replace(/^﻿/, "");
  const first = text.split(/\r?\n/)[0] || "";
  const delim = [";","\t",","].sort((a,b)=>first.split(b).length-first.split(a).length)[0];
  const rows = []; let row = [], cur = "", q = false;
  for(let i=0;i<text.length;i++){
    const c = text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){ cur += '"'; i++; } else q = false; } else cur += c; }
    else if(c==='"') q = true;
    else if(c===delim){ row.push(cur); cur = ""; }
    else if(c==="\n"){ row.push(cur); rows.push(row); row = []; cur = ""; }
    else if(c!=="\r") cur += c;
  }
  if(cur!=="" || row.length){ row.push(cur); rows.push(row); }
  return rows.filter(r=>r.some(x=>x.trim()!==""));
}
function csvToClients(text){
  const rows = parseCsv(text);
  if(rows.length<2) return {list:[], dup:0, err:"Le fichier ne contient pas de lignes de données."};
  const map = {nom:["nom","client","nomclient","nomprenom","name"], tel:["telephone","tel","mobile","portable","phone"], email:["email","mail","courriel"], ville:["ville","commune"], adresse:["adresse","rue"], motif:["motif","demande","objet","besoin"], type:["type","typebatiment","batiment"]};
  const heads = rows[0].map(norm);
  const idx = {}; Object.keys(map).forEach(k=>{ idx[k] = heads.findIndex(h=>map[k].includes(h)); });
  if(idx.nom<0) return {list:[], dup:0, err:"Colonne « nom » introuvable dans la première ligne."};
  const seen = new Set(DOSSIERS.map(d=>(d.client+"|"+(d.telephone||"").replace(/\D/g,"")).toLowerCase()));
  const list = []; let dup = 0;
  rows.slice(1).forEach(r=>{
    const g = k=>idx[k]>=0 ? (r[idx[k]]||"").trim() : "";
    const nom = g("nom"); if(!nom) return;
    const key = (nom+"|"+g("tel").replace(/\D/g,"")).toLowerCase();
    if(seen.has(key)){ dup++; return; }
    seen.add(key);
    list.push({nom, tel:g("tel"), email:g("email"), ville:g("ville"), adresse:g("adresse"), motif:g("motif"), type:g("type")});
  });
  return {list, dup, err:""};
}
function blankDossier(f){
  const nid = "TP-"+(Math.max(1048, ...DOSSIERS.map(x=>parseInt(x.id.slice(3),10)||0))+1);
  return {
    id:nid, client:f.nom||"Nouveau client", ville:f.ville||"—", motif:f.motif||"Nouvelle demande", priorite:"Normale", statut:"Nouvelle",
    technicien:null, commercial:null, creePar:{id:state.userId, nom:currentName(), role:state.role},
    telephone:f.tel||"", email:f.email||"", adresse:f.adresse||"", typeBatiment:f.type||"Maison individuelle", infosGenerales:"",
    notes:[], historique:[{date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Client importé (fichier CSV)."}],
    commercialStage:"À contacter", montant:0, prochaineRelance:null, compteRendu:"", visiteDate:null, visiteHeure:null,
    diagnostic:freshDiagnostic(), devis:[], factures:[], chantier:null, taches:[]
  };
}
function importCsvFile(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    const r = csvToClients(String(reader.result||""));
    if(r.err){ showToast(r.err); return; }
    if(!r.list.length){ showToast("Aucun nouveau client à importer ("+r.dup+" doublon(s))."); return; }
    askConfirm("Importer "+r.list.length+" client(s) ?", r.list.length+" nouveau(x) client(s) seront créés"+(r.dup?" ; "+r.dup+" doublon(s) ignoré(s)":"")+". Exemple : "+r.list.slice(0,3).map(x=>x.nom).join(", ")+(r.list.length>3?"…":"")+".", ()=>{
      r.list.forEach(f=>DOSSIERS.unshift(blankDossier(f)));
      showToast(r.list.length+" client(s) importé(s).");
    }, "Importer", "btn-primary");
  };
  reader.readAsText(file, "utf-8");
}
function exportBackup(){
  const blob = new Blob([JSON.stringify({app:"maitre-toiturier", v:DATA_VERSION, date:new Date().toISOString(), dossiers:DOSSIERS, contracts:CONTRACTS, parrainages:PARRAINAGES, custom:JSON.parse(localStorage.getItem(CUSTOM_KEY)||"null")})], {type:"application/json"});
  downloadBlob(blob, "sauvegarde-maitre-toiturier-"+new Date().toISOString().slice(0,10)+".json");
}
function importBackupFile(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const x = JSON.parse(String(reader.result||""));
      if(x.app!=="maitre-toiturier" || !Array.isArray(x.dossiers)) throw new Error("format");
      askConfirm("Restaurer cette sauvegarde ?", "Les "+DOSSIERS.length+" dossiers actuels seront remplacés par les "+x.dossiers.length+" de la sauvegarde.", ()=>{
        applyData(x);
        if(x.custom){ try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(x.custom)); }catch(e){} loadCustom(); ensurePoints(); }
        showToast("Sauvegarde restaurée.");
      }, "Restaurer", "btn-primary");
    }catch(e){ showToast("Ce fichier n’est pas une sauvegarde Maître Toiturier valide."); }
  };
  reader.readAsText(file, "utf-8");
}

// ---------- Mode serveur : comptes réels, données partagées par toute l'équipe ----------
// Actif seulement si /api/health répond « configured ». Sinon l'application reste en mode démonstration local.
const SRV = {on:false, token:null, user:null, snap:{}, revs:{}, since:0, lists:{contracts:0, parrainages:0}, listSnap:{}, dirty:false, pushing:false, timer:null, settingsTimer:null, needsSetup:false, mail:false, poll:null, fetching:false, lastRender:0};
const SRV_TOKEN_KEY = "mt_token";
function srvSer(x){ return JSON.stringify(x, (k,v)=> k==="dataUrl" ? undefined : v); }

async function srvApi(path, method, body){
  const r = await fetch("/api/"+path, {method:method||"GET", headers:Object.assign({"Content-Type":"application/json"}, SRV.token ? {Authorization:"Bearer "+SRV.token} : {}), body: body ? JSON.stringify(body) : undefined});
  let j = {}; try{ j = await r.json(); }catch(e){}
  if(r.status===401 && SRV.token && !/^auth/.test(path)) srvLogout("Session expirée : reconnectez-vous.");
  if(!r.ok) throw Object.assign(new Error(j.error || "Connexion au serveur impossible."), {status:r.status});
  return j;
}

// ---- photos : envoyées à part (réduites), les dossiers ne contiennent que des références ----
function srvWalk(o, fn, depth){
  depth = depth||0;
  if(!o || typeof o!=="object" || depth>8) return;
  if(Array.isArray(o)){ o.forEach(x=>srvWalk(x, fn, depth+1)); return; }
  if(typeof o.dataUrl==="string" || o.mediaId) fn(o);
  Object.keys(o).forEach(k=>{ if(k!=="dataUrl") srvWalk(o[k], fn, depth+1); });
}
function srvShrink(dataUrl){
  if(dataUrl.length<800000) return Promise.resolve(dataUrl);
  return new Promise(res=>{
    const im = new Image();
    im.onload = ()=>{
      let max = 1600, q = .82, out = dataUrl;
      for(let i=0;i<6;i++){
        const w = Math.min(max, im.naturalWidth), h = Math.round(im.naturalHeight*w/im.naturalWidth);
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(im, 0, 0, w, h);
        out = c.toDataURL("image/jpeg", q);
        if(out.length<800000) break;
        max = Math.round(max*.8); q = Math.max(.6, q-.05);
      }
      res(out);
    };
    im.onerror = ()=>res(dataUrl);
    im.src = dataUrl;
  });
}
async function srvUploadPhotos(d){
  const todo = [];
  srvWalk(d, o=>{ if(typeof o.dataUrl==="string" && !o.mediaId) todo.push(o); });
  for(const o of todo){
    const small = await srvShrink(o.dataUrl);
    const r = await srvApi("media", "POST", {dataUrl:small});
    o.mediaId = r.id;
  }
}
async function srvFetchMedia(){
  if(SRV.fetching) return;
  SRV.fetching = true;
  try{
    const todo = [];
    DOSSIERS.forEach(d=>srvWalk(d, o=>{ if(o.mediaId && !o.dataUrl) todo.push(o); }));
    for(let i=0;i<todo.length;i+=3){
      await Promise.all(todo.slice(i, i+3).map(async o=>{ try{ const r = await srvApi("media?id="+o.mediaId); o.dataUrl = r.dataUrl; }catch(e){} }));
    }
    if(todo.length && srvCanRender()) render();
  }finally{ SRV.fetching = false; }
}
function srvCanRender(){
  const a = document.activeElement;
  return !state.modal && !state.wizard && !(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
}

// ---- application des données reçues ----
function srvPutDossier(it, force){
  const i = DOSSIERS.findIndex(d=>d.id===it.id);
  const local = i>=0 ? DOSSIERS[i] : null;
  if(!force){
    if(local && srvSer(local)!==SRV.snap[it.id]) return false;      // modifications locales en attente
    if(local && (SRV.revs[it.id]||0) >= it.rev) return false;
  }
  const media = {};
  if(local) srvWalk(local, o=>{ if(o.mediaId && o.dataUrl) media[o.mediaId] = o.dataUrl; });
  const nd = JSON.parse(JSON.stringify(it.data));
  srvWalk(nd, o=>{ if(o.mediaId && media[o.mediaId]) o.dataUrl = media[o.mediaId]; });
  if(i>=0) DOSSIERS[i] = nd; else DOSSIERS.push(nd);
  SRV.snap[it.id] = srvSer(it.data === undefined ? nd : it.data); SRV.revs[it.id] = it.rev;
  return true;
}
function srvApplyData(res, full){
  let changed = 0;
  if(full){ DOSSIERS = []; SRV.snap = {}; SRV.revs = {}; }
  res.dossiers.forEach(it=>{ if(srvPutDossier(it)) changed++; });
  (res.deleted||[]).forEach(id=>{
    const i = DOSSIERS.findIndex(d=>d.id===id);
    if(i>=0 && srvSer(DOSSIERS[i])===SRV.snap[id]){ DOSSIERS.splice(i,1); changed++; }
    delete SRV.snap[id]; delete SRV.revs[id];
  });
  ["contracts","parrainages"].forEach(n=>{
    const arr = n==="contracts" ? CONTRACTS : PARRAINAGES, src = res[n];
    if(!src) return;
    if(full || (src.rev > SRV.lists[n] && srvSer(arr)===SRV.listSnap[n])){
      arr.length = 0; (src.data||[]).forEach(x=>arr.push(x));
      SRV.lists[n] = src.rev; SRV.listSnap[n] = srvSer(arr); changed++;
    }
  });
  if(full) DOSSIERS.forEach(d=>{ SRV.snap[d.id] = SRV.snap[d.id] || srvSer(d); });
  SRV.since = res.now;
  return changed;
}
function srvApplySettings(s){
  if(!s) return false;
  const before = JSON.stringify([SETTINGS.employees, SETTINGS.requests, SETTINGS.access, SETTINGS.company, SETTINGS.materielLib, SETTINGS.invitations, SETTINGS.resets]);
  const base = defaultSettings();
  SETTINGS = Object.assign(base, {
    employees: s.employees||[], requests: s.requests||[], invitations: s.invitations||[], resets: s.resets||[],
    access: Object.assign({}, base.access, s.access||{}), company: Object.assign(base.company, s.company||{}), materielLib: s.materielLib || base.materielLib
  });
  CONFIG_ROLES.forEach(r=>{ SETTINGS.access[r] = Object.assign({}, DEFAULT_ACCESS[r], SETTINGS.access[r]||{}); });
  if(s.custom){ applyCustom(s.custom); }
  ensurePoints();
  return before !== JSON.stringify([SETTINGS.employees, SETTINGS.requests, SETTINGS.access, SETTINGS.company, SETTINGS.materielLib, SETTINGS.invitations, SETTINGS.resets]);
}
async function srvLoad(full){
  const res = await srvApi("data" + (full ? "" : "?since="+Math.max(1, SRV.since-3000)));
  const n = srvApplyData(res, full);
  const s = SRV.settingsTimer ? false : srvApplySettings(res.settings);
  ensurePoints();
  srvFetchMedia();
  return n>0 || s;
}

// ---- envoi des modifications (par dossier, avec contrôle de révision) ----
function srvSchedule(){
  if(!SRV.on || !SRV.user) return;
  clearTimeout(SRV.timer);
  SRV.timer = setTimeout(srvPush, 900);
}
async function srvPush(){
  if(!SRV.on || !SRV.user) return;
  if(SRV.pushing){ SRV.dirty = true; return; }
  SRV.pushing = true;
  try{
    const changed = [];
    DOSSIERS.forEach(d=>{ if(SRV.snap[d.id]!==srvSer(d)) changed.push(d); });
    const deletes = Object.keys(SRV.snap).filter(id=>!DOSSIERS.some(d=>d.id===id));
    const lists = {};
    ["contracts","parrainages"].forEach(n=>{
      const arr = n==="contracts" ? CONTRACTS : PARRAINAGES, s = srvSer(arr);
      if(SRV.listSnap[n]!==s) lists[n] = {baseRev:SRV.lists[n], data:JSON.parse(s), s};
    });
    if(!changed.length && !deletes.length && !Object.keys(lists).length) return;
    for(const d of changed) await srvUploadPhotos(d);
    const ser = {};
    const items = changed.map(d=>{ const s = srvSer(d); ser[d.id] = s; return {id:d.id, baseRev:SRV.revs[d.id]||0, data:JSON.parse(s)}; });
    const payload = {dossiers:items, deletes};
    Object.keys(lists).forEach(n=>{ payload[n] = {baseRev:lists[n].baseRev, data:lists[n].data}; });
    const res = await srvApi("data", "POST", payload);
    let conflicts = 0, denied = false;
    res.results.forEach(r=>{
      if(r.conflict){
        conflicts++;
        if(r.data) srvPutDossier({id:r.id, rev:r.rev, data:r.data}, true);
        else { const i = DOSSIERS.findIndex(d=>d.id===r.id); if(i>=0) DOSSIERS.splice(i,1); delete SRV.snap[r.id]; }
      } else if(r.denied) denied = true;
      else if(r.deleted){ delete SRV.snap[r.id]; delete SRV.revs[r.id]; }
      else { SRV.revs[r.id] = r.rev; SRV.snap[r.id] = ser[r.id]; }
    });
    Object.keys(res.lists||{}).forEach(n=>{
      const r = res.lists[n], arr = n==="contracts" ? CONTRACTS : PARRAINAGES;
      if(r.conflict){ arr.length = 0; (r.data||[]).forEach(x=>arr.push(x)); conflicts++; SRV.lists[n] = r.rev; SRV.listSnap[n] = srvSer(arr); }
      else { SRV.lists[n] = r.rev; SRV.listSnap[n] = lists[n].s; }
    });
    if(denied){ await srvLoad(true); showToast("Suppression réservée à la direction et à l’administration."); render(); }
    else if(conflicts){ showToast("Un collègue a modifié "+(conflicts>1?"des éléments":"un élément")+" en même temps : version à jour rechargée."); render(); }
  }catch(e){
    if(e.status!==401) SRV.dirty = true;
    if(e.status && e.status!==401) showToast("Enregistrement impossible : "+e.message);
  }finally{
    SRV.pushing = false;
    if(SRV.dirty){ SRV.dirty = false; SRV.timer = setTimeout(srvPush, 4000); }
  }
}
function srvSettingsSoon(){
  if(!SRV.on || !SRV.user) return;
  clearTimeout(SRV.settingsTimer);
  SRV.settingsTimer = setTimeout(async ()=>{
    SRV.settingsTimer = null;
    try{
      if(SRV.user.role==="directeur" || SRV.user.role==="admin"){
        await srvApi("settings", "POST", {action:"put", settings:{employees:SETTINGS.employees, access:SETTINGS.access, company:SETTINGS.company, materielLib:SETTINGS.materielLib, invitations:SETTINGS.invitations, resets:SETTINGS.resets, custom:customObj()}});
      } else {
        await srvApi("settings", "POST", {action:"materiel", lib:SETTINGS.materielLib});
      }
    }catch(e){ showToast(e.message); }
  }, 500);
}

// ---- session ----
async function srvPull(){
  if(!SRV.on || !SRV.user || SRV.pushing || document.hidden) return;
  try{
    if(await srvLoad(false) && srvCanRender()) render();
  }catch(e){}
}
function srvStartPolling(){
  clearInterval(SRV.poll);
  SRV.poll = setInterval(srvPull, 20000);
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) srvPull(); });
}
async function srvEnter(user){
  SRV.user = user;
  await srvLoad(true);
  state.userId = user.id; state.role = user.role;
  state.dossierId = null; state.section = firstSection(); state.appStage = "app"; state.loginMsg = "";
  if(user.mustChange) state.modal = {type:"chgpwd"};
  render();
  srvStartPolling();
}
function srvLogout(msg){
  clearInterval(SRV.poll); clearTimeout(SRV.timer);
  SRV.token = null; SRV.user = null; SRV.snap = {}; SRV.revs = {};
  try{ localStorage.removeItem(SRV_TOKEN_KEY); }catch(e){}
  DOSSIERS = []; CONTRACTS.length = 0; PARRAINAGES.length = 0;
  state.appStage = "login"; state.loginMsg = msg||""; state.modal = null; state.dossierId = null;
  render();
}
async function srvBoot(){
  try{
    const h = await fetch("/api/health").then(r=>r.json());
    if(!h || !h.configured) return;
    SRV.on = true; SRV.needsSetup = !!h.needsSetup; SRV.mail = !!h.mail;
    DOSSIERS = []; CONTRACTS.length = 0; PARRAINAGES.length = 0;
    SETTINGS.employees = []; SETTINGS.requests = [];
    try{ SRV.token = localStorage.getItem(SRV_TOKEN_KEY); }catch(e){}
    if(SRV.token){
      try{
        const m = await srvApi("auth", "POST", {action:"me"});
        await srvEnter(m.user); return;
      }catch(e){ SRV.token = null; try{ localStorage.removeItem(SRV_TOKEN_KEY); }catch(x){} }
    }
    if(state.appStage==="login") state.appStage = SRV.needsSetup ? "setup" : "login";
    render();
  }catch(e){}
}
async function srvAuthCall(body){
  const r = await srvApi("auth", "POST", body);
  SRV.token = r.token;
  try{ localStorage.setItem(SRV_TOKEN_KEY, r.token); }catch(e){}
  await srvEnter(r.user);
}
function buildSetup(){
  const s = state.setup || {};
  return `
  <div class="login-screen">
    <div class="login-card">
      <img class="login-logo" src="assets/logo-full.png" alt="Maître Toiturier">
      <h1>Bienvenue : créons votre espace</h1>
      <p>Première ouverture : créez le compte du directeur. Vous inviterez ensuite votre équipe.</p>
      <div class="form-field"><label>Nom de l’entreprise</label><input type="text" id="stCompany" value="${esc(s.company||"")}" placeholder="Ex. Martin Couverture"></div>
      <div class="form-field"><label>Votre nom et prénom</label><input type="text" id="stNom" value="${esc(s.nom||"")}" autocomplete="name"></div>
      <div class="form-field"><label>Votre e-mail</label><input type="email" id="stEmail" value="${esc(s.email||"")}" autocomplete="username"></div>
      <div class="form-field"><label>Mot de passe (8 caractères minimum)</label><input type="password" id="stPwd" autocomplete="new-password"></div>
      <div class="form-field"><label>Confirmer le mot de passe</label><input type="password" id="stPwd2" autocomplete="new-password"></div>
      ${state.loginMsg ? `<div class="login-msg">${esc(state.loginMsg)}</div>` : ""}
      <button class="btn-primary login-submit" data-action="setup-submit">Créer mon espace</button>
    </div>
  </div>`;
}
function buildLoading(){ return `<div class="splash"><div class="splash-body"><img class="splash-logo" src="assets/logo-full.png" alt="Maître Toiturier"><p style="color:var(--muted)">Chargement…</p></div></div>`; }
async function srvSetupSubmit(){
  const v = id=>(document.getElementById(id).value||"").trim();
  const nom = v("stNom"), email = v("stEmail").toLowerCase(), company = v("stCompany");
  const pwd = document.getElementById("stPwd").value, pwd2 = document.getElementById("stPwd2").value;
  state.setup = {nom, email, company};
  if(!nom || !/^\S+@\S+\.\S+$/.test(email)){ state.loginMsg = "Indiquez votre nom et une adresse e-mail valide."; render(); return; }
  if(pwd.length<8){ state.loginMsg = "Le mot de passe doit contenir au moins 8 caractères."; render(); return; }
  if(pwd!==pwd2){ state.loginMsg = "Les deux mots de passe ne correspondent pas."; render(); return; }
  try{ await srvAuthCall({action:"setup", nom, email, password:pwd, company}); }
  catch(e){ state.loginMsg = e.message; render(); }
}

function catalogSearchRow(id){ return `<input type="search" id="${id}" class="cat-search" placeholder="Rechercher…" oninput="catalogFilter(this)">`; }
// Ligne compacte de liste (prestation ou matériau) : en lecture seule pour tout le monde, cliquable
// pour ouvrir la fiche de détail (modale) si l'utilisateur a le droit de modifier les tarifs.
function catalogListRow(kind, item, i, canEdit){
  const vente = kind==="cat" ? item.prixUnitaireCt : (item.prixVenteCt||0);
  const achat = item.prixAchatCt||0;
  const pct = vente>0 ? Math.round((vente-achat)/vente*1000)/10 : null;
  return `<div class="row-item cat-item" data-search="${esc(item.label.toLowerCase())}"${canEdit?` data-action="cat-edit-open" data-kind="${kind}" data-idx="${i}"`:""}>
    <div style="min-width:0"><div class="row-title">${esc(item.label)}</div><div class="row-sub">${esc(item.unite||(kind==="cat"?"forfait":"u"))} · TVA ${item.tvaPct} %</div></div>
    <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
      ${canEdit && pct!=null ? badge(pct+" %", margeBadgeCls(pct)) : ""}
      <div class="doc-row-amount">${fmtEuros(vente)}</div>
      ${canEdit ? `<span class="cat-chevron">›</span>` : ""}
    </div>
  </div>`;
}
function renderPrestationsSection(){
  const canEdit = canEditMod("prestations");
  return `
  <div class="page-header">
    <div><h1>Prestations</h1><p>${canEdit?"Touchez une prestation pour voir et modifier son prix d’achat, son prix de vente et sa marge.":"Tarifs proposés dans vos devis. Pour modifier les prix, demandez à la direction."}</p></div>
    ${canEdit?`<button class="btn-primary" data-action="cat-edit-open" data-kind="cat" data-idx="-1">+ Ajouter</button>`:""}
  </div>
  <div class="card">
    ${catalogSearchRow("prestaSearch")}
    ${SERVICE_CATALOG.map((s,i)=>catalogListRow("cat", s, i, canEdit)).join("")}
  </div>`;
}
function renderMaterielSection(){
  const canEdit = canEditMod("materiel");
  return `
  <div class="page-header">
    <div><h1>Matériel &amp; fournitures</h1><p>${canEdit?"Touchez un matériau pour voir et modifier son prix d’achat fournisseur, son prix de revente et sa marge.":"Tarifs proposés dans vos devis. Pour modifier les prix, demandez à la direction."}</p></div>
    ${canEdit?`<button class="btn-primary" data-action="cat-edit-open" data-kind="mat" data-idx="-1">+ Ajouter</button>`:""}
  </div>
  <div class="card">
    ${catalogSearchRow("matSearch")}
    ${MATERIEL_CATALOG.map((m,i)=>catalogListRow("mat", m, i, canEdit)).join("")}
  </div>`;
}
// Fiche de détail (sous-menu) d'une prestation/d'un matériau : ouverte au clic depuis la liste,
// pour garder la liste épurée et éviter de tout afficher à l'écran en même temps sur mobile.
function modalCatEdit(m){
  const kind = m.kind, isNew = m.idx==null || m.idx<0;
  const list = kind==="cat" ? SERVICE_CATALOG : MATERIEL_CATALOG;
  const item = isNew ? {label:"", prixAchatCt:0, prixUnitaireCt:0, prixVenteCt:0, tvaPct:10, unite:kind==="cat"?"forfait":"u"} : list[m.idx];
  const vente = kind==="cat" ? item.prixUnitaireCt : (item.prixVenteCt||0);
  const achat = item.prixAchatCt||0;
  const pct = vente>0 ? Math.round((vente-achat)/vente*1000)/10 : null;
  const tvas = [0,5.5,10,20];
  return modalWrap(isNew ? (kind==="cat"?"Nouvelle prestation":"Nouveau matériau") : item.label, `
    <div class="form-field"><label>Désignation</label><input type="text" id="ceLabel" value="${esc(item.label)}"></div>
    <div class="wz-grid">
      <div class="form-field"><label>Prix d’achat HT (coût, interne)</label><input type="number" min="0" step="0.01" id="ceAchat" value="${(achat/100).toFixed(2)}" oninput="ceLive()"></div>
      <div class="form-field"><label>Prix de vente HT</label><input type="number" min="0" step="0.01" id="ceVente" value="${(vente/100).toFixed(2)}" oninput="ceLive()"></div>
    </div>
    <div class="marge-box"><div class="marge-row"><span>Marge</span><b id="ceMargeVal">${pct!=null?pct+" %":"—"}</b></div></div>
    <div class="wz-grid">
      <div class="form-field"><label>TVA</label><select id="ceTva">${tvas.map(t=>`<option value="${t}" ${item.tvaPct===t?"selected":""}>${t} %</option>`).join("")}</select></div>
      <div class="form-field"><label>Unité</label>${unitSelectHtml("ceUnite", item.unite||"")}</div>
    </div>
    <div class="modal-actions" style="flex-wrap:wrap">
      <button class="btn-primary" data-action="catedit-save" data-kind="${kind}" data-idx="${isNew?-1:m.idx}">Enregistrer</button>
      ${!isNew?`<button class="btn-ghost" data-action="catedit-del" data-kind="${kind}" data-idx="${m.idx}">Supprimer</button>`:""}
      <button class="btn-secondary" data-action="modal-close">Annuler</button>
    </div>`);
}
function ceLive(){
  const a = parseFloat(document.getElementById("ceAchat").value)||0;
  const v = parseFloat(document.getElementById("ceVente").value)||0;
  const pct = v>0 ? Math.round((v-a)/v*1000)/10 : null;
  const el = document.getElementById("ceMargeVal");
  if(el) el.textContent = pct!=null ? pct+" %" : "—";
}
// Modifier les conditions de paiement d'un devis déjà créé (brouillon), sans devoir le recréer —
// utile pour les devis migrés depuis l'ancien format acompte/solde qui n'avaient pas d'échéancier.
// Montant d'une étape à partir d'un échéancier "brouillon" (pas forcément celui déjà enregistré
// sur le devis) : mêmes règles d'arrondi que echeanceTtcCt (la dernière étape absorbe l'écart).
function draftEcheanceTtcCt(ttcCt, echeancier, idx){
  if(!echeancier[idx]) return 0;
  if(idx < echeancier.length-1) return Math.round(ttcCt * echeancier[idx].pct / 100);
  const before = echeancier.slice(0, idx).reduce((s,e,i)=>s+draftEcheanceTtcCt(ttcCt, echeancier, i), 0);
  return Math.max(0, ttcCt - before);
}
function modalEchEdit(m){
  const d = byId(m.id), dv = latestDevis(d);
  const ttc = devisTotals(dv).ttcCt;
  const echeancier = m.echeancier || devisPaiement(dv).echeancier.map(e=>Object.assign({},e));
  const mode = m.mode || devisPaiement(dv).mode;
  const sumPct = echeancier.reduce((s,e)=>s+(e.pct||0),0);
  return modalWrap("Conditions de paiement", `
    <div class="wz-grid">
      <div class="form-field"><label>Nombre de paiements</label><select id="echFois" data-action-change="ech-fois-change">${PAY_FOIS.map(n=>`<option value="${n}" ${echeancier.length===n?"selected":""}>${n===1?"1 fois (paiement unique)":n+" fois"}</option>`).join("")}</select></div>
      <div class="form-field"><label>Mode de règlement</label><select id="echMode">${PAY_MODES.map(mm=>`<option ${mode===mm?"selected":""}>${mm}</option>`).join("")}</select></div>
    </div>
    <div class="wz-ech-head"><span>Libellé (visible sur la facture)</span><span>%</span><span>Montant</span></div>
    ${echeancier.map((e,i)=>`
    <div class="wz-ech-row" data-idx="${i}">
      <input type="text" class="ech-field" data-idx="${i}" data-field="label" value="${esc(e.label)}" placeholder="ex. Paiement mi-chantier">
      <span class="wz-pct-wrap"><input type="number" class="ech-field" data-idx="${i}" data-field="pct" min="0" max="100" step="1" value="${e.pct}"><i>%</i></span>
      <span class="wz-ech-amt" id="echAmt-${i}">${fmtEuros(draftEcheanceTtcCt(ttc, echeancier, i))}</span>
    </div>`).join("")}
    <p class="form-help" id="echTotalMsg" style="margin:8px 0 0${sumPct!==100?";color:var(--red)":""}">Total : ${sumPct} % ${sumPct!==100?"— doit faire 100 % au total":"✓"}</p>
    <div class="modal-actions" style="margin-top:16px">
      <button class="btn-primary" data-action="ech-save" data-id="${d.id}">Enregistrer</button>
      <button class="btn-secondary" data-action="modal-close">Annuler</button>
    </div>`);
}
function echLive(){
  const dv = latestDevis(byId(state.modal.id));
  document.querySelectorAll(".wz-ech-row").forEach(row=>{
    const i = parseInt(row.dataset.idx,10);
    const label = row.querySelector('[data-field="label"]').value;
    const pct = parseInt(row.querySelector('[data-field="pct"]').value,10)||0;
    const amt = document.getElementById("echAmt-"+i);
    if(amt) amt.textContent = fmtEuros(Math.round(devisTotals(dv).ttcCt*pct/100));
  });
  let sum = 0;
  document.querySelectorAll('.ech-field[data-field="pct"]').forEach(el=>sum += parseInt(el.value,10)||0);
  const msg = document.getElementById("echTotalMsg");
  if(msg){ msg.textContent = "Total : "+sum+" % "+(sum!==100?"— doit faire 100 % au total":"✓"); msg.style.color = sum!==100 ? "var(--red)" : ""; }
}
function empStatutBadge(e){ return badge(e.statut==="actif"?"Actif":"Suspendu", e.statut==="actif"?"green":"gray"); }

function modalProfile(m){
  const e = SETTINGS.employees.find(x=>x.id===m.eid) || currentUser();
  return modalWrap("Mon profil", `
    <div class="form-field"><label>Nom et prénom</label><input type="text" id="mpNom" value="${esc(e.nom)}"></div>
    <div class="form-field"><label>Téléphone</label><input type="tel" id="mpTel" value="${esc(e.telephone||"")}"></div>
    <p class="form-help" style="margin:0 0 14px">L’e-mail (${esc(e.email)}) et le rôle ne se changent pas ici.</p>
    <div class="modal-actions"><button class="btn-primary" data-action="profile-save" data-eid="${e.id}">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
}
function paramEquipe(){
  const link = location.origin + location.pathname + "?inscription=1";
  return `
  <div class="card">
    <div class="card-header"><h3>Salariés (${SETTINGS.employees.length})</h3></div>
    ${SETTINGS.employees.map(e=>{
      const isMe = e.id===state.userId;
      const fixed = e.role==="directeur";
      return `
      <div class="row-item emp-row">
        <div class="row-left"><div class="row-avatar">${initials(e.nom)}</div>
          <div style="min-width:0"><div class="row-title">${esc(e.nom)}${isMe?" · vous":""}</div><div class="row-sub">${esc(e.poste||"")} · ${esc(e.email)}${e.telephone?" · "+esc(e.telephone):""}</div></div></div>
        <div class="doc-row-right">
          ${empStatutBadge(e)}
          ${fixed ? badge("Directeur","gold") : `<select class="emp-role" data-emp-role="${e.id}">${["admin","tech","sales"].map(r=>`<option value="${r}" ${e.role===r?"selected":""}>${esc(ROLES[r].label)}</option>`).join("")}</select>`}
          <div class="doc-row-actions">
            ${isMe?`<button class="btn-secondary btn-sm" data-action="profile-open" data-eid="${e.id}">Modifier mon profil</button>`:""}
            ${fixed ? "" : `<button class="btn-ghost btn-sm" data-action="emp-reset" data-eid="${e.id}">Mot de passe</button><button class="btn-ghost btn-sm" data-action="emp-toggle" data-eid="${e.id}">${e.statut==="actif"?"Suspendre":"Réactiver"}</button>
            <button class="btn-ghost btn-sm" data-action="ask-delete" data-what="employee" data-eid="${e.id}">✕</button>`}
          </div>
        </div>
      </div>`; }).join("")}
  </div>
  <div class="card">
    <div class="card-header"><h3>Inviter un salarié</h3></div>
    <p class="form-help" style="margin:0 0 12px">Saisissez son e-mail et le rôle prévu : l’invitation aux couleurs de la marque part directement par e-mail. Il crée lui-même son accès (mot de passe compris) ; sa demande arrive dans « Demandes d’accès » avec le rôle déjà proposé.</p>
    <div class="inv-row">
      <input type="text" id="invNom" placeholder="Prénom (facultatif)">
      <input type="email" id="invEmail" placeholder="E-mail du salarié">
      <select id="invRole">${["tech","sales","admin"].map(r=>`<option value="${r}">${esc(ROLES[r].label)}</option>`).join("")}</select>
      <button class="btn-primary btn-sm" data-action="invite-create">Envoyer l’accès</button>
    </div>
    <div class="copy-row" style="margin-top:12px"><input type="text" readonly value="${esc(link)}" id="signupLink"><button class="btn-secondary btn-sm" data-action="copy-signup">Copier le lien général</button></div>
    ${(SETTINGS.invitations||[]).length ? `<div style="margin-top:14px">${SETTINGS.invitations.slice().reverse().map(iv=>`
      <div class="row-item"><div><div class="row-title">${esc(iv.nom||iv.email)}</div><div class="row-sub">${esc(iv.email)} · ${esc(ROLES[iv.role].label)} · ${esc(iv.date)}</div></div>
      <div style="display:flex;gap:8px;align-items:center">${badge(iv.statut==="acceptée"?"Accès créé":"Invitation envoyée", iv.statut==="acceptée"?"green":"blue")}<button class="btn-ghost btn-sm" data-action="invite-resend" data-iid="${iv.id}">Renvoyer</button></div></div>`).join("")}</div>` : ""}
  </div>
  ${(SETTINGS.resets||[]).filter(r=>r.statut==="à traiter").length ? `<div class="card"><div class="card-header"><h3>Mots de passe oubliés</h3></div>${SETTINGS.resets.filter(r=>r.statut==="à traiter").map(r=>{ const emp = SETTINGS.employees.find(e=>e.email.toLowerCase()===r.email.toLowerCase()); return `<div class="row-item"><div><div class="row-title">${esc(r.email)}</div><div class="row-sub">Demandé le ${esc(r.date)}</div></div>${emp?`<button class="btn-primary btn-sm" data-action="emp-reset" data-eid="${emp.id}">Réinitialiser et envoyer</button>`:badge("Compte introuvable","gray")}</div>`; }).join("")}</div>` : ""}`;
}

function paramDemandes(){
  const pend = pendingRequests();
  const done = SETTINGS.requests.filter(r=>r.statut!=="en attente").slice().reverse();
  const guess = (poste, r)=>{ const iv = r && (SETTINGS.invitations||[]).find(i=>i.email.toLowerCase()===r.email.toLowerCase()); return iv ? iv.role : (/comm/i.test(poste) ? "sales" : (/tech/i.test(poste) ? "tech" : "admin")); };
  return `
  <div class="card">
    <div class="card-header"><h3>Demandes en attente (${pend.length})</h3></div>
    ${pend.length ? pend.map(r=>`
      <div class="row-item emp-row">
        <div class="row-left"><div class="row-avatar">${initials(r.nom)}</div>
          <div style="min-width:0"><div class="row-title">${esc(r.nom)}</div><div class="row-sub">${esc(r.email)}${r.telephone?" · "+esc(r.telephone):""} · poste souhaité : ${esc(r.poste)} · ${esc(r.date)}</div></div></div>
        <div class="doc-row-right">
          <select id="reqRole-${r.id}">${["admin","tech","sales"].map(x=>`<option value="${x}" ${guess(r.poste, r)===x?"selected":""}>${esc(ROLES[x].label)}</option>`).join("")}</select>
          <div class="doc-row-actions"><button class="btn-primary btn-sm" data-action="req-accept" data-rid="${r.id}">Accepter</button><button class="btn-ghost btn-sm" data-action="req-refuse" data-rid="${r.id}">Refuser</button></div>
        </div>
      </div>`).join("") : `<div class="empty-note">Aucune demande en attente. Partagez le lien d’inscription depuis l’onglet « Équipe ».</div>`}
  </div>
  ${done.length ? `<div class="card"><div class="card-header"><h3>Historique</h3></div>${done.map(r=>`<div class="row-item"><div><div class="row-title">${esc(r.nom)}</div><div class="row-sub">${esc(r.email)} · ${esc(r.date)}</div></div>${badge(r.statut, r.statut==="accepté"?"green":"red")}</div>`).join("")}</div>` : ""}`;
}

function paramAcces(){
  const roles = CONFIG_ROLES;
  return `
  <div class="card">
    <div class="card-header"><h3>Accès aux onglets, par rôle</h3><button class="btn-ghost btn-sm" data-action="acces-reset">Rétablir les valeurs par défaut</button></div>
    <p class="form-help" style="margin:0 0 14px"><b>Aucun</b> : l’onglet est masqué · <b>Lecture</b> : consultation seule · <b>Édition</b> : créer, modifier et supprimer. Les changements s’appliquent immédiatement. Le directeur a toujours accès à tout, y compris à Paramètres ; le client n’accède qu’à son espace.</p>
    <div class="acc-wrap"><div class="acc-grid">
      <div class="acc-h">Onglet</div><div class="acc-h">Directeur</div>${roles.map(r=>`<div class="acc-h">${esc(ROLES[r].label)}</div>`).join("")}
      ${MODULES.map(m=>`
        <div class="acc-mod">${esc(m.label)}</div>
        <div class="acc-lock">Édition</div>
        ${roles.map(r=>`<div><select class="acc-sel lv${accessLevel(r,m.id)}" data-acc-role="${r}" data-acc-mod="${m.id}">${ACCESS_LEVELS.map((l,i)=>(m.readOnly&&i===2)?"":`<option value="${i}" ${accessLevel(r,m.id)===i?"selected":""}>${l}</option>`).join("")}</select></div>`).join("")}
      `).join("")}
      <div class="acc-mod">Paramètres</div><div class="acc-lock">Édition</div>${roles.map(()=>`<div class="acc-lock off">Réservé</div>`).join("")}
    </div></div>
  </div>`;
}

function paramEntreprise(){
  const c = SETTINGS.company;
  const f = (id,label,val,type)=>`<div class="form-field"><label>${label}</label><input type="${type||"text"}" id="co_${id}" value="${esc(val)}"></div>`;
  return `
  <div class="card">
    <div class="card-header"><h3>Informations de l’entreprise</h3></div>
    <p class="form-help" style="margin:0 0 14px">Ces informations alimentent les PDF (contact en dernière page, mentions des factures) et les valeurs par défaut des devis.</p>
    <div class="wz-grid">
      ${f("nom","Nom commercial",c.nom)}${f("site","Site internet",c.site)}
      ${f("telephone","Téléphone",c.telephone,"tel")}${f("email","E-mail de contact",c.email,"email")}
      ${f("adresse","Adresse",c.adresse)}${f("siret","SIRET",c.siret)}
      ${f("iban","IBAN (pour les virements)",c.iban)}
      <div class="form-field"><label>Validité par défaut d’un devis</label><select id="co_devisValidite">${[15,30,60,90].map(n=>`<option value="${n}" ${c.devisValidite===n?"selected":""}>${n} jours</option>`).join("")}</select></div>
      <div class="form-field"><label>Acompte par défaut</label><select id="co_acomptePct">${[20,30,40,50].map(n=>`<option value="${n}" ${c.acomptePct===n?"selected":""}>${n} %</option>`).join("")}</select></div>
    </div>
    <button class="btn-primary btn-sm" data-action="company-save">Enregistrer</button>
  </div>`;
}

function inviteMail(iv){
  const lien = siteBase()+"?inscription=1&email="+encodeURIComponent(iv.email)+(iv.nom?"&nom="+encodeURIComponent(iv.nom):"");
  openMailSend("invitation_salarie", {nom:iv.nom, role:ROLES[iv.role].label, lien}, iv.email, "");
}
async function acceptRequest(rid){
  if(SRV.on){
    const r = SETTINGS.requests.find(x=>x.id===rid), role = document.getElementById("reqRole-"+rid).value;
    try{
      await srvApi("settings", "POST", {action:"accept", rid, role});
      await srvLoad(true);
      showToast(r.nom+" a maintenant accès en tant que "+ROLES[role].label.toLowerCase()+".");
      openMailSend("acces_accepte", {nom:r.nom.split(" ")[0], role:ROLES[role].label, lien:siteBase()}, r.email, r.telephone);
    }catch(e){ showToast(e.message); }
    return;
  }
  const r = SETTINGS.requests.find(x=>x.id===rid);
  const role = document.getElementById("reqRole-"+rid).value;
  const id = "E"+(SETTINGS.employees.reduce((m,e)=>Math.max(m, parseInt(e.id.slice(1),10)||0),0)+1);
  SETTINGS.employees.push({id, nom:r.nom, email:r.email, telephone:r.telephone, poste:r.poste, role, statut:"actif", ajoute:"12 sept.", pwdHash:r.pwdHash});
  r.statut = "accepté";
  (SETTINGS.invitations||[]).forEach(iv=>{ if(iv.email.toLowerCase()===r.email.toLowerCase()) iv.statut = "acceptée"; });
  saveSettings();
  showToast(r.nom+" a maintenant accès en tant que "+ROLES[role].label.toLowerCase()+".");
  openMailSend("acces_accepte", {nom:r.nom.split(" ")[0], role:ROLES[role].label, lien:siteBase()}, r.email, r.telephone);
}

function buildApp(){
  if(state.appStage==="splash") return buildSplash();
  if(state.appStage==="login") return buildLogin();
  if(state.appStage==="loading") return buildLoading();
  if(state.appStage==="setup") return buildSetup();
  if(state.appStage==="signup") return buildSignup();
  if(state.appStage==="forgot") return buildForgot();
  if(state.appStage==="signup-done") return buildSignupDone();
  if(state.role!=="client" && !sectionReachable(state.section)){ state.section = firstSection(); state.dossierId = null; }
  if(state.role==="client"){
    return `
      ${buildSidebar()}
      <div class="main">
        ${buildTopbar()}
        <div class="disclaimer">${SRV.on ? "Espace de travail · données enregistrées sur le serveur, partagées avec votre équipe" : "Démo interactive · Données fictives, modifications conservées jusqu’au rechargement · Rôles simulés · Aucun e-mail envoyé"}</div>
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
      <div class="disclaimer">${SRV.on ? "Espace de travail · données enregistrées sur le serveur, partagées avec votre équipe" : "Démo interactive · Données fictives, modifications conservées jusqu’au rechargement · Rôles simulés · Aucun e-mail envoyé"}</div>
      <div class="content">${buildSection()}</div>
    </div>
    ${buildBottomNav()}
    ${state.modal ? buildModal() : ""}
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  `;
}

const NAV_ICONS = {
  overview:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  dossiers:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  agenda:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  entretiens:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  diagnostics:'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 13l2 2 4-4"/>',
  commercial:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  devis:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  factures:'<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v5h5M9 12h6M9 16h4"/><path d="M8 8h1"/>',
  prestations:'<path d="M14.7 6.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-2.4-2.4a1 1 0 1 1 1.4-1.4L8 11.6l5.3-5.3a1 1 0 0 1 1.4 0z"/><path d="M21 12a9 9 0 1 1-9-9c1.9 0 3.6.6 5 1.7"/><path d="M21 4v5h-5"/>',
  materiel:'<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  parrainages:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  connexions:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  "client-preview":'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  client:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  parametres:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>'
};
function navIcon(key){ return `<svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NAV_ICONS[key]||NAV_ICONS.overview}</svg>`; }
const SHORT_LABELS = {overview:"Accueil", dossiers:"Clients", agenda:"Agenda", entretiens:"Entretiens", diagnostics:"Diagnostics", commercial:"Suivi", devis:"Devis", factures:"Factures", prestations:"Tarifs", materiel:"Matériel", parrainages:"Parrainage", connexions:"Liens", "client-preview":"Aperçu", client:"Mon espace", parametres:"Réglages"};
function buildBottomNav(){
  const nav = navItems();
  const main = nav.slice(0, nav.length>5 ? 4 : nav.length);
  const rest = nav.length>5;
  return `<nav class="bottom-nav" aria-label="Navigation principale">
    ${main.map(([key,label])=>`<button class="bn-item ${state.section===key?"active":""}" data-action="nav" data-section="${key}">${navIcon(key)}<span>${esc(SHORT_LABELS[key]||label)}</span>${key==="parametres" && pendingRequests().length ? `<i class="bn-dot"></i>`:""}</button>`).join("")}
    ${rest ? `<button class="bn-item ${nav.slice(4).some(n=>n[0]===state.section)?"active":""}" data-action="toggle-sidebar">${navIcon("more")}<span>Plus</span></button>` : ""}
  </nav>`;
}

function buildSidebar(){
  const nav = navItems();
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
      ${nav.map(([key,label])=>`<button class="nav-btn ${state.section===key?"active":""}" data-action="nav" data-section="${key}">${navIcon(key)}${esc(label)}${key==="parametres" && pendingRequests().length ? `<span class="nav-badge">${pendingRequests().length}</span>` : ""}</button>`).join("")}
    </nav>
    <div class="sidebar-footer">
      <div>Maître Toiturier</div>
      <div>Démonstration métier</div>
      ${SRV.on ? "" : `<button class="reset-btn" data-action="reset-demo">Réinitialiser la démo</button>`}
    </div>
  </div>`;
}

function buildTopbar(){
  const dateStr = "samedi 12 septembre 2026";
  const roleOptions = SETTINGS.employees.filter(e=>e.statut==="actif").map(e=>`<option value="${e.id}" ${state.userId===e.id?"selected":""}>${esc(e.nom)} · ${esc(ROLES[e.role].label)}</option>`).join("") + `<option value="CLIENT" ${state.userId==="CLIENT"?"selected":""}>Marie Laurent · Client</option>`;
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
      ${SRV.on ? `<button class="btn-ghost btn-sm" data-action="logout">Déconnexion</button>` : `<div class="demo-tag">Vue démo</div>
      <select class="role-select" id="profileSelect">${roleOptions}</select>`}
      <div class="avatar">${esc(initials(currentName()))}</div>
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
    case "devis": return renderDocuments("devis");
    case "factures": return renderDocuments("factures");
    case "prestations": return renderPrestationsSection();
    case "materiel": return renderMaterielSection();
    case "parrainages": return renderParrainages();
    case "parametres": return isManager() ? renderParametres() : renderOverview();
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
  list.forEach(d=>(d.taches||[]).filter(t=>!t.done).forEach(t=>{
    const dt = parseShortFrDate(t.echeance);
    if(!dt) return;
    if(dt<=TODAY_REF) urgent.push({d, tag:"Tâche : "+t.titre});
    else upcoming.push({d, tag:t.echeance+" · "+t.titre});
  }));

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
  const list = myDossiers();
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

const DL_PAGE = 25;
function dossierListState(){
  state.dl = state.dl || {q:"", stat:"", team:"", scope:"", page:1};
  return state.dl;
}
function filteredDossiers(){
  const f = dossierListState();
  const q = (f.q||"").trim().toLowerCase();
  const scope = f.scope || "all";
  return visibleDossiers().filter(d=>{
    if(scope==="mine" && !isMine(d)) return false;
    if(f.stat && d.statut!==f.stat) return false;
    if(f.team && d.technicien!==f.team && d.commercial!==f.team) return false;
    if(q && !(d.client+" "+d.ville+" "+d.id+" "+d.motif+" "+(d.telephone||"")+" "+(d.email||"")).toLowerCase().includes(q)) return false;
    return true;
  });
}
function renderPager(total, page){
  const pages = Math.max(1, Math.ceil(total/DL_PAGE));
  if(pages<=1) return "";
  return `<div class="pager"><button class="btn-secondary btn-sm" data-action="dl-page" data-dir="-1" ${page<=1?"disabled":""}>← Précédent</button><span>Page ${page} / ${pages} · ${total} dossiers</span><button class="btn-secondary btn-sm" data-action="dl-page" data-dir="1" ${page>=pages?"disabled":""}>Suivant →</button></div>`;
}
function renderDossiersList(){
  const f = dossierListState();
  const all = filteredDossiers();
  const pages = Math.max(1, Math.ceil(all.length/DL_PAGE));
  if(f.page>pages) f.page = pages;
  const list = all.slice((f.page-1)*DL_PAGE, f.page*DL_PAGE);
  const scope = f.scope || "all";
  const staff = teamNames();
  return `
  <div class="page-header">
    <div><h1>Dossiers clients</h1><p>Un dossier unique pour les demandes, les visites et les échanges. ${visibleDossiers().length} dossier(s) dans la base commune.</p></div>
    ${canCreateDemande() ? `<button class="btn-primary" data-action="modal-new">+ Créer un client</button>` : ""}
  </div>
  <div class="filters-row">
    <input type="search" data-dl="q" placeholder="Rechercher un client, une ville, un n° de dossier… (Entrée)" value="${esc(f.q)}">
    <select data-dl="scope"><option value="all" ${scope==="all"?"selected":""}>Tous les dossiers</option><option value="mine" ${scope==="mine"?"selected":""}>Mes dossiers</option></select>
    <select data-dl="stat"><option value="">Tous les statuts</option>${["Nouvelle","Planifié","En cours","Rapport prêt"].map(o=>`<option ${f.stat===o?"selected":""}>${o}</option>`).join("")}</select>
    <select data-dl="team"><option value="">Toute l’équipe</option>${staff.map(o=>`<option ${f.team===o?"selected":""}>${esc(o)}</option>`).join("")}</select>
  </div>
  ${all.length===0 ? `<div class="empty-note">Aucun dossier ne correspond à cette recherche.</div>` : ""}
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
          <td><div class="row-sub">${esc(d.technicien||"Technicien à affecter")}</div><div class="row-sub">${esc(d.commercial||"Commercial à affecter")}</div></td>
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
          <div><div class="row-sub">${esc(d.technicien||"Technicien à affecter")}</div><div class="row-sub">${esc(d.commercial||"Commercial à affecter")}</div></div>
          ${badge(d.statut, statutBadgeClass(d.statut))}
        </div>
      </div>`).join("")}
  </div>
  ${renderPager(all.length, f.page)}`;
}

// ---------- Dossier detail ----------

function tabsForRole(d){
  const tabs = [["info","Résumé"],["activite","Activité"]];
  if(canView("diagnostics")) tabs.push(["diagnostic","Diagnostic terrain"],["rapport","Rapport PDF"]);
  if(canView("commercial")) tabs.push(["commercial","Suivi commercial"]);
  if(canView("devis") || canView("factures")) tabs.push(["devis","Devis & factures"]);
  if(d && d.chantier && canReadJob()) tabs.push(["chantier","Chantier"]);
  if(state.role!=="client" && (canView("agenda")||canView("diagnostics"))) tabs.push(["materiel","Matériel"]);
  return tabs;
}

function renderDossierDetail(id){
  const d = byId(id);
  if(!d) return renderDossiersList();
  const tabs = tabsForRole(d);
  if(!tabs.find(t=>t[0]===state.dossierTab)) state.dossierTab = "info";

  let body = "";
  if(state.dossierTab==="info") body = renderDossierInfo(d);
  else if(state.dossierTab==="diagnostic") body = renderDossierDiagnostic(d);
  else if(state.dossierTab==="rapport") body = renderDossierRapport(d);
  else if(state.dossierTab==="commercial") body = renderDossierCommercial(d);
  else if(state.dossierTab==="devis") body = renderDossierDevis(d);
  else if(state.dossierTab==="chantier") body = renderDossierChantier(d);
  else if(state.dossierTab==="materiel") body = renderDossierMateriel(d);
  else if(state.dossierTab==="activite") body = renderDossierActivite(d);

  if(state.dossierTab==="diagnostic" && diagEditable()){
    return `
    <div class="diag-focus-bar">
      <button class="breadcrumb" data-action="dossier-tab" data-tab="info">← Quitter le diagnostic</button>
      <div class="diag-focus-title">${esc(d.client)} · ${esc(d.id)}</div>
      <button class="btn-ghost btn-sm" data-action="ask-delete" data-what="diagnostic" data-id="${d.id}">Réinitialiser</button>
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

// ---------- Dossier client façon CRM : Résumé, Activité, Documents ----------

function canEditActivity(){ return state.role!=="client"; }
function nextTaskId(d){ return "T"+(((d.taches||[]).reduce((m,t)=>Math.max(m, parseInt(t.id.slice(1),10)||0),0))+1); }

// Mêmes chiffres que la carte "Processus de l'affaire" juste au-dessus (billingOf) : avant, ce
// bloc excluait les factures encore en brouillon et affichait 0 € alors que la carte du dessus
// montrait déjà un montant facturé — deux sources différentes pour la même information.
function dossierKpis(d){
  const acc = wzAcceptedDevis(d);
  const dv = acc || latestDevis(d);
  const valeur = dv ? devisTotals(dv).ttcCt : 0;
  const b = billingOf(d);
  const facture = b ? b.invoiced : 0;
  const encaisse = b ? b.paid : 0;
  const reste = b ? b.due : 0;
  return {valeur, facture, encaisse, reste, devisStatut: dv ? dv.statut : null};
}

function nextActionFor(d){
  const open = (d.taches||[]).filter(t=>!t.done);
  if(open.length){
    const t = open[0];
    return {label:t.titre, sub:"Échéance "+(t.echeance||"non définie")+(t.assigne?" · "+t.assigne:""), tid:t.id};
  }
  if(d.prochaineRelance) return {label:"Relance commerciale", sub:"Prévue le "+d.prochaineRelance+(d.commercial?" · "+d.commercial:"")};
  return null;
}

function docSentInfo(doc){
  if(!doc || !doc.sent || !doc.sent.length) return "";
  const last = doc.sent[doc.sent.length-1];
  return " · envoyé le "+esc(last.date)+" ("+esc(last.canal)+")";
}

function renderDossierInfo(d){
  const k = dossierKpis(d);
  const phone = (d.telephone||"").replace(/\D/g,"");
  const wa = phone.replace(/^0/,"33");
  const na = nextActionFor(d);
  const canQuote = hasPermission("quote.create");
  const sendReport = d.diagnostic.rapportPret && hasPermission("quote.send");
  const docs = [];
  if(d.diagnostic.rapportPret) docs.push({kind:"report"});
  (d.devis||[]).slice(-1).forEach(dv=>docs.push({kind:"devis", doc:dv}));
  (d.factures||[]).forEach(f=>docs.push({kind:"facture", doc:f}));
  return `
  <div class="card crm-head">
    <div class="crm-head-top">
      <div class="row-avatar big">${initials(d.client)}</div>
      <div style="flex:1;min-width:0">
        <div class="crm-name">${esc(d.client)}</div>
        <div class="row-sub">${esc(d.adresse)}, ${esc(d.ville)} · ${esc(d.typeBatiment)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${badge(d.priorite, priorityBadgeClass(d.priorite))}${badge(d.statut, statutBadgeClass(d.statut))}${d.commercialStage?badge(d.commercialStage,"gray"):""}</div>
      </div>
    </div>
    <div class="crm-actions">
      ${phone?`<a class="btn-secondary btn-sm" href="tel:${phone}">Appeler</a><a class="btn-secondary btn-sm" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>`:""}
      ${d.email?`<a class="btn-secondary btn-sm" href="${gmailComposeUrl(d.email)}" target="_blank" rel="noopener">E-mail</a>`:""}
      ${canEditActivity()?`<button class="btn-secondary btn-sm" data-action="form-open" data-form="task" data-id="${d.id}">+ Tâche</button><button class="btn-secondary btn-sm" data-action="dossier-tab" data-tab="activite">+ Note</button>`:""}
      ${canQuote?`<button class="btn-primary btn-sm" data-action="wizard-devis" data-id="${d.id}">+ Devis</button>`:""}
      ${d.email?`<button class="btn-secondary btn-sm" data-action="client-invite" data-id="${d.id}">Inviter (espace client)</button>`:""}
      ${sendReport?`<button class="btn-primary btn-sm" data-action="modal-send" data-id="${d.id}">Envoyer le rapport</button>`:""}
      ${canCreateDemande()?`<button class="btn-secondary btn-sm" data-action="modal-new-chantier" data-id="${d.id}">+ Nouveau chantier pour ce client</button>`:""}
    </div>
  </div>

  ${otherChantiers(d).length ? `<div class="card">
    <div class="card-header"><h3>Autres chantiers de ${esc(d.client)}</h3></div>
    ${otherChantiers(d).map(x=>`<div class="row-item"><div><div class="row-title">${esc(x.id)} · ${esc(x.motif)}</div><div class="row-sub">${esc(x.adresse)}, ${esc(x.ville)}</div></div>${badge(x.statut, statutBadgeClass(x.statut))}<button class="link-btn" data-action="open-dossier" data-id="${x.id}">Ouvrir</button></div>`).join("")}
  </div>` : ""}

  ${renderProcessCard(d)}

  <div class="stat-grid crm-kpis">
    ${stat("Valeur de l’affaire", fmtEuros(k.valeur), k.devisStatut?("Devis "+k.devisStatut.toLowerCase()):"Pas encore de devis")}
    ${stat("Facturé", fmtEuros(k.facture), "Factures envoyées")}
    ${stat("Encaissé", fmtEuros(k.encaisse), "Paiements confirmés")}
    ${stat("Reste à encaisser", fmtEuros(k.reste), k.reste>0?"À suivre":"Soldé")}
  </div>

  <div class="card">
    <div class="card-header"><h3>Prochaine action</h3>${canEditActivity()?`<button class="link-btn" data-action="dossier-tab" data-tab="activite">Toute l’activité</button>`:""}</div>
    ${na ? `<div class="row-item"><div><div class="row-title">${esc(na.label)}</div><div class="row-sub">${esc(na.sub)}</div></div>${na.tid && canEditActivity()?`<button class="btn-ghost btn-sm" data-action="task-toggle" data-id="${d.id}" data-tid="${na.tid}">Fait ✓</button>`:""}</div>` : `<div class="empty-note">Aucune action planifiée.${canEditActivity()?` <button class="link-btn" data-action="form-open" data-form="task" data-id="${d.id}">Planifier une tâche</button>`:""}</div>`}
  </div>

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
    <div class="card-header"><h3>Affectation &amp; rendez-vous</h3><div style="display:flex;gap:8px;flex-wrap:wrap">${canAffecter()?`<button class="btn-secondary btn-sm" data-action="modal-affect" data-id="${d.id}">Affecter / planifier</button>`:""}${canAffecter() && d.visiteDate?`<button class="btn-ghost btn-sm" data-action="ask-delete" data-what="visite" data-id="${d.id}">Retirer la visite</button>`:""}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:13px">
      <div><div class="row-sub">Technicien</div><div>${esc(d.technicien||"À affecter")}</div></div>
      <div><div class="row-sub">Commercial</div><div>${esc(d.commercial||"À affecter")}</div></div>
      <div><div class="row-sub">Visite</div><div>${d.visiteDate?esc(d.visiteDate+" · "+d.visiteHeure):"À programmer"}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><h3>Documents</h3>${canView("devis")||canView("factures")?`<button class="link-btn" data-action="dossier-tab" data-tab="devis">Tous les documents</button>`:""}</div>
    ${docs.length ? docs.map(x=>x.kind==="report" ? renderReportRow(d) : renderDocRow(x.kind, d, x.doc, true)).join("") : `<div class="empty-note">Aucun document pour l’instant : le rapport apparaît après le diagnostic, les devis et factures après leur création.</div>`}
  </div>

  <div class="card">
    <div class="card-header"><h3>Historique de la toiture</h3></div>
    ${d.diagnostic.rapportPret ? `
      <div class="row-item">
        <div><div class="row-title">Diagnostic du ${esc(d.visiteDate)}</div><div class="row-sub">Version 1 · ${esc(d.technicien)} · ${Object.values(d.diagnostic.points).reduce((s,p)=>s+p.photos.length,0)} photo(s)</div></div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${badge(d.diagnostic.rapportPartage?"Partagé (démo)":"Interne", d.diagnostic.rapportPartage?"green":"gray")}
          <button class="btn-ghost btn-sm" data-action="dossier-tab" data-tab="rapport">Aperçu</button>
          ${diagEditable()?`<button class="btn-ghost btn-sm" data-action="ask-delete" data-what="diagnostic" data-id="${d.id}">Supprimer</button>`:""}
        </div>
      </div>` : `<div class="empty-note">0 rapport(s) conservé(s). Les rapports validés et leurs photos seront conservés ici au fil des visites.</div>`}
  </div>

  ${canEditDossier()?`<div class="card crm-danger"><div class="card-header"><h3>Zone sensible</h3></div><p class="form-help" style="margin:0 0 12px">Supprimer le dossier efface définitivement le diagnostic, les devis, les factures et le chantier associés.</p><button class="btn-danger" data-action="ask-delete" data-what="dossier" data-id="${d.id}">Supprimer ce dossier</button></div>`:""}
  `;
}

function renderReportRow(d){
  const canSend = hasPermission("quote.send");
  return `
  <div class="row-item">
    <div class="row-left">
      <div class="row-avatar">PDF</div>
      <div><div class="row-title">Rapport de diagnostic</div><div class="row-sub">Visite du ${esc(d.visiteDate||"—")} · ${esc(d.technicien||"")}${docSentInfo(d.diagnostic)}</div></div>
    </div>
    <div class="doc-row-right">
      ${badge(d.diagnostic.rapportPartage?"Partagé":"Interne", d.diagnostic.rapportPartage?"green":"gray")}
      <div class="doc-row-actions">
        <button class="btn-ghost btn-sm" data-action="dossier-tab" data-tab="rapport">Aperçu</button>
        <button class="btn-ghost btn-sm" data-action="download-pdf" data-id="${d.id}">PDF</button>
        ${canSend?`<button class="btn-secondary btn-sm" data-action="modal-send" data-id="${d.id}">Envoyer</button>`:""}
      </div>
    </div>
  </div>`;
}

function renderDossierActivite(d){
  const taches = d.taches || [];
  const editable = canEditActivity();
  return `
  <div class="card">
    <div class="card-header"><h3>Tâches</h3>${editable?`<button class="btn-secondary btn-sm" data-action="form-open" data-form="task" data-id="${d.id}">+ Ajouter une tâche</button>`:""}</div>
    ${taches.length ? taches.map(t=>`
      <div class="row-item task-row ${t.done?"done":""}">
        <label class="task-main">
          <input type="checkbox" data-action="task-toggle" data-id="${d.id}" data-tid="${t.id}" ${t.done?"checked":""} ${editable?"":"disabled"}>
          <span><span class="row-title">${esc(t.titre)}</span><span class="row-sub" style="display:block">${t.echeance?"Échéance "+esc(t.echeance):"Sans échéance"}${t.assigne?" · "+esc(t.assigne):""}</span></span>
        </label>
        ${editable?`<div class="doc-row-actions"><button class="btn-ghost btn-sm" data-action="form-open" data-form="task" data-id="${d.id}" data-tid="${t.id}">Modifier</button><button class="btn-ghost btn-sm" data-action="ask-delete" data-what="task" data-id="${d.id}" data-tid="${t.id}">✕</button></div>`:""}
      </div>`).join("") : `<div class="empty-note">Aucune tâche. Planifiez la prochaine action pour ne rien oublier (rappel, devis à relancer, document à envoyer…).</div>`}
  </div>

  <div class="card">
    <div class="card-header"><h3>Notes internes</h3><span class="badge gray">Équipe uniquement</span></div>
    ${d.notes.length ? d.notes.map((n,i)=>`<div class="row-item"><div style="min-width:0"><div class="row-sub">${esc(n.date)}</div><div>${esc(n.texte)}</div></div>${editable?`<div class="doc-row-actions"><button class="btn-ghost btn-sm" data-action="form-open" data-form="note" data-id="${d.id}" data-nid="${i}">Modifier</button><button class="btn-ghost btn-sm" data-action="ask-delete" data-what="note" data-id="${d.id}" data-nid="${i}">✕</button></div>`:""}</div>`).join("") : `<div class="empty-note">Aucune note.</div>`}
    ${editable?`<div class="form-field" style="margin-top:14px"><textarea id="noteInput" placeholder="Informations utiles pour la prochaine intervention…"></textarea></div>
    <button class="btn-secondary btn-sm" data-action="add-note" data-id="${d.id}">Ajouter la note</button>`:""}
  </div>

  <div class="card">
    <div class="card-header"><h3>Historique du dossier</h3></div>
    ${d.historique.slice().reverse().map(h=>`<div class="row-item"><div><div class="row-sub">${esc(h.date)} · ${esc(h.auteur)}</div><div>${esc(h.texte)}</div></div></div>`).join("")}
  </div>`;
}

// ---------- Formulaires génériques (tâche, note, contrat, parrainage) ----------

function modalForm(m){
  const d = m.id ? byId(m.id) : null;
  if(m.form==="task"){
    const t = m.tid ? d.taches.find(x=>x.id===m.tid) : {titre:"", echeance:"", assigne:d.commercial||teamNames()[0]};
    return modalWrap(m.tid?"Modifier la tâche":"Nouvelle tâche", `
      <div class="form-field"><label>Tâche</label><input type="text" id="ffTitre" value="${esc(t.titre)}" placeholder="Ex. Relancer le client pour le devis"></div>
      <div class="form-field"><label>Échéance</label><input type="text" id="ffEcheance" value="${esc(t.echeance||"")}" placeholder="ex. 15 sept."></div>
      <div class="form-field"><label>Responsable</label><select id="ffAssigne">${teamNames().map(n=>`<option ${t.assigne===n?"selected":""}>${esc(n)}</option>`).join("")}</select></div>
      <div class="modal-actions"><button class="btn-primary" data-action="form-save">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
  }
  if(m.form==="note"){
    return modalWrap("Modifier la note", `
      <div class="form-field"><label>Note</label><textarea id="ffTexte" style="min-height:120px">${esc(d.notes[m.nid].texte)}</textarea></div>
      <div class="modal-actions"><button class="btn-primary" data-action="form-save">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
  }
  if(m.form==="contract"){
    const c = m.idx!=null ? CONTRACTS[m.idx] : {dossierId:"", prestations:"Contrôle périodique", frequence:"Tous les 12 mois", prochaineVisite:"", statut:"Actif", montantAnnuel:0};
    return modalWrap(m.idx!=null?"Modifier le contrat":"Nouveau contrat d’entretien", `
      <div class="form-field"><label>Client / toiture</label><select id="ffDossier"><option value="">Choisir un dossier…</option>${DOSSIERS.map(x=>`<option value="${x.id}" ${c.dossierId===x.id?"selected":""}>${esc(x.client)} · ${esc(x.ville)}</option>`).join("")}</select></div>
      <div class="form-field"><label>Prestations</label><input type="text" id="ffPrest" value="${esc(c.prestations)}"></div>
      <div class="form-field"><label>Fréquence</label><select id="ffFreq">${["Tous les 6 mois","Tous les 12 mois","Tous les 24 mois"].map(f=>`<option ${c.frequence===f?"selected":""}>${f}</option>`).join("")}</select></div>
      <div class="form-field"><label>Prochaine visite</label><input type="text" id="ffVisite" value="${esc(c.prochaineVisite)}" placeholder="ex. 12 oct."></div>
      <div class="form-field"><label>Statut</label><select id="ffStatut">${["Actif","Proposé","Suspendu"].map(f=>`<option ${c.statut===f?"selected":""}>${f}</option>`).join("")}</select></div>
      <div class="form-field"><label>Montant annuel (€)</label><input type="number" min="0" id="ffMontant" value="${c.montantAnnuel}"></div>
      <div class="modal-actions"><button class="btn-primary" data-action="form-save">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
  }
  if(m.form==="parrainage"){
    const p = m.idx!=null ? PARRAINAGES[m.idx] : {parrain:"", clientApporte:"", date:"12 sept.", affaire:"À contacter", recompense:80, suivi:"En attente"};
    return modalWrap(m.idx!=null?"Modifier le parrainage":"Nouveau parrainage", `
      <div class="form-field"><label>Parrain (client existant)</label><input type="text" id="ffParrain" value="${esc(p.parrain)}"></div>
      <div class="form-field"><label>Client apporté</label><input type="text" id="ffApporte" value="${esc(p.clientApporte)}"></div>
      <div class="form-field"><label>Date</label><input type="text" id="ffDate" value="${esc(p.date)}"></div>
      <div class="form-field"><label>Affaire</label><select id="ffAffaire">${PROCESS_STAGES.map(f=>`<option ${p.affaire===f?"selected":""}>${f}</option>`).join("")}</select></div>
      <div class="form-field"><label>Récompense prévue (€)</label><input type="number" min="0" id="ffRecomp" value="${p.recompense}"></div>
      <div class="form-field"><label>Suivi</label><select id="ffSuivi">${["En attente","Contacté","Gagné","Récompense remise"].map(f=>`<option ${p.suivi===f?"selected":""}>${f}</option>`).join("")}</select></div>
      <div class="modal-actions"><button class="btn-primary" data-action="form-save">Enregistrer</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
  }
  return "";
}

function saveForm(){
  const m = state.modal;
  const val = id=>document.getElementById(id).value;
  const d = m.id ? byId(m.id) : null;
  if(m.form==="task"){
    const titre = val("ffTitre").trim();
    if(!titre){ showToast("Donnez un titre à la tâche."); return; }
    d.taches = d.taches || [];
    if(m.tid){ const t = d.taches.find(x=>x.id===m.tid); t.titre = titre; t.echeance = val("ffEcheance"); t.assigne = val("ffAssigne"); }
    else d.taches.push({id:nextTaskId(d), titre, echeance:val("ffEcheance"), assigne:val("ffAssigne"), done:false});
    state.modal = null; render(); showToast("Tâche enregistrée."); return;
  }
  if(m.form==="note"){
    const texte = val("ffTexte").trim();
    if(!texte){ showToast("La note ne peut pas être vide."); return; }
    d.notes[m.nid].texte = texte;
    state.modal = null; render(); showToast("Note modifiée."); return;
  }
  if(m.form==="contract"){
    const dossierId = val("ffDossier");
    const dd = dossierId ? byId(dossierId) : null;
    if(!dd){ showToast("Choisissez un dossier."); return; }
    const c = {client:dd.client, ville:dd.ville, prestations:val("ffPrest"), frequence:val("ffFreq"), prochaineVisite:val("ffVisite"), statut:val("ffStatut"), montantAnnuel:parseInt(val("ffMontant"),10)||0, technicien:dd.technicien, commercial:dd.commercial, dossierId};
    if(m.idx!=null) CONTRACTS[m.idx] = c; else CONTRACTS.push(c);
    state.modal = null; render(); showToast("Contrat enregistré."); return;
  }
  if(m.form==="parrainage"){
    const parrain = val("ffParrain").trim(), apporte = val("ffApporte").trim();
    if(!parrain || !apporte){ showToast("Indiquez le parrain et le client apporté."); return; }
    const p = {parrain, clientApporte:apporte, date:val("ffDate"), affaire:val("ffAffaire"), recompense:parseInt(val("ffRecomp"),10)||0, suivi:val("ffSuivi"), commercial: m.idx!=null ? PARRAINAGES[m.idx].commercial : (state.role==="sales" ? currentName() : (activeStaff("sales")[0]||"")), dossierId: m.idx!=null ? PARRAINAGES[m.idx].dossierId : null};
    if(m.idx!=null) PARRAINAGES[m.idx] = p; else PARRAINAGES.push(p);
    state.modal = null; render(); showToast("Parrainage enregistré."); return;
  }
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

let ppUid = 0;
function ppStatus(etat){
  const map = {
    "Bon état":{label:"Bon état", sub:"Aucune anomalie constatée", cls:"ok", mark:"check"},
    "À surveiller":{label:"À surveiller", sub:"Point à suivre dans le temps", cls:"warn", mark:"!"},
    "Défaut constaté":{label:"Défaut constaté", sub:"Anomalie relevée lors du contrôle", cls:"bad", mark:"!"},
    "Urgent":{label:"Urgent", sub:"À traiter en priorité", cls:"urgent", mark:"!"},
    "Pas vu":{label:"Pas vu", sub:"Zone non contrôlée", cls:"gray", mark:"!"},
    "Non présent":{label:"Non présent", sub:"Élément absent de cette toiture", cls:"gray", mark:"check"},
    "Non contrôlé":{label:"Non contrôlé", sub:"Contrôle à réaliser", cls:"gray", mark:"!"}
  };
  return map[etat] || map["Non contrôlé"];
}

// Fond de page "point de contrôle" : tout le graphisme (photo découpée en diagonale, panneau noir,
// rubans dorés, pied de page) est dessiné dans UN svg inline — html2canvas ne gère pas clip-path CSS.
function ppBackdropSvg(photoUrl, align){
  const u = "pp"+(++ppUid);
  return `<svg class="pp-bg" viewBox="0 0 1055 1491" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="${u}c"><polygon points="480,0 1055,0 1055,610 480,490 205,350"/></clipPath>
      <linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5e2a0"/><stop offset=".4" stop-color="#d4af37"/><stop offset=".72" stop-color="#9a6a2c"/><stop offset="1" stop-color="#e8cb72"/></linearGradient>
      <linearGradient id="${u}d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a0a"/><stop offset="1" stop-color="#231b14"/></linearGradient>
      <linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
      <linearGradient id="${u}p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9a679"/><stop offset="1" stop-color="#7d6a42"/></linearGradient>
    </defs>
    <g clip-path="url(#${u}c)">
      ${photoUrl ? `<image href="${photoUrl}" x="205" y="0" width="850" height="610" preserveAspectRatio="${align||"xMidYMid"} slice"/>` : `<rect x="205" y="0" width="850" height="610" fill="url(#${u}p)"/>`}
      <rect x="205" y="0" width="850" height="230" fill="url(#${u}s)"/>
    </g>
    <path d="M0,1165 L600,1335 L1055,1285 L1055,1491 L0,1491 Z" fill="url(#${u}d)"/>
    <path d="M0,0 L480,0 L205,350 L330,414 L0,700 Z" fill="url(#${u}d)"/>
    <path d="M452,0 L502,0 L222,362 L198,340 Z" fill="url(#${u}g)"/>
    <path d="M200,330 L484,486 L478,506 L214,376 Z" fill="url(#${u}g)"/>
    <path d="M0,1168 L0,1224 L170,1391 L122,1391 Z" fill="url(#${u}g)"/>
    <path d="M90,1258 C260,1330 430,1374 592,1382 L642,1338 C480,1340 300,1300 90,1258 Z" fill="url(#${u}g)"/>
    <path d="M925,1092 L1055,1030 L1055,1092 Z" fill="url(#${u}g)" opacity=".85"/>
  </svg>`;
}

// Réduit la taille du texte des blocs .pp-fit qui débordent de leur cadre (longues remarques).
function fitPointPages(root){
  root = root || document;
  root.querySelectorAll(".pp-fit").forEach(el=>{
    let fs = parseFloat(el.ownerDocument.defaultView.getComputedStyle(el).fontSize);
    let guard = 0;
    while(el.scrollHeight > el.clientHeight + 1 && fs > 7.5 && guard < 24){
      fs -= 0.4;
      el.style.fontSize = fs + "px";
      guard++;
    }
  });
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

// Photos des pages du rapport, converties en data-URL (les <image> d'un SVG rendu par html2canvas
// ne peuvent pas lire un fichier externe).
const PP_PHOTO_FILES = {cover:"assets/cover-team.jpg", synthese:"assets/photo-synthese.jpg", plan:"assets/photo-plan.jpg", dos:"assets/photo-dos.jpg"};
const PP_PHOTOS = {};
(function preloadPagePhotos(){
  Object.keys(PP_PHOTO_FILES).forEach(key=>{
    const im = new Image();
    im.onload = ()=>{
      try{
        const w = Math.min(1800, im.naturalWidth), h = Math.round(im.naturalHeight * w / im.naturalWidth);
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(im, 0, 0, w, h);
        PP_PHOTOS[key] = c.toDataURL("image/jpeg", .92);
        if(typeof render === "function" && state && state.appStage==="app") render();
      }catch(e){}
    };
    im.src = PP_PHOTO_FILES[key];
  });
})();
function ppPhoto(key){ return PP_PHOTOS[key] || PP_PHOTO_FILES[key]; }

function ppConclusion(c){
  const sub = "Conclusion du diagnostic";
  if(c==="Bon état général") return {cls:"ok", label:"Bon état général", sub, mark:"check"};
  if(c==="À surveiller") return {cls:"warn", label:"À surveiller", sub, mark:"!"};
  if(c==="Travaux recommandés") return {cls:"bad", label:"Travaux recommandés", sub, mark:"!"};
  if(c==="Intervention urgente") return {cls:"urgent", label:"Intervention urgente", sub, mark:"!"};
  return {cls:"gray", label:c||"À finaliser", sub, mark:"!"};
}

function ppCard(icon, label, html){
  const ic = icon.charAt(0)==="<" ? icon : iconSvg(icon,30);
  return `<div class="pp-card"><div class="pp-card-ic">${ic}</div><div class="pp-card-body"><div class="pp-card-label">${label}</div><div class="pp-card-txt pp-fit">${html}</div></div></div>`;
}

function ppBanner(icon, label, html, rightHtml, cls){
  return `<div class="pp-vig ${cls||""}">
    ${html ? `<div class="pp-vig-main"><div class="pp-vig-ic">${iconSvg(icon,40)}</div><div class="pp-vig-body"><div class="pp-vig-label">${label}</div><div class="pp-vig-txt pp-fit">${html}</div></div></div>` : ""}
    ${rightHtml}
  </div>`;
}
const PP_QUOTE = `<div class="pp-vig-quote"><div class="pp-vig-qm">”</div><div class="pp-vig-qt">Un toit bien entretenu aujourd’hui, c’est un patrimoine préservé demain.</div><div class="pp-vig-ql"></div></div>`;

// Coquille commune à toutes les pages du rapport (même mise en page que le modèle fourni).
function ppShell(d, o){
  const cards = (o.cards||[]).filter(Boolean);
  const cols = o.cols || (cards.length===2 ? 1 : 2);
  const rows = o.rows || (cols===1 ? cards.length : Math.max(2, Math.ceil(cards.length/2)));
  const pill = o.pill;
  return `
  <div class="pdf-page-frame"><div class="pdf-page pdf-pointpage">
    ${ppBackdropSvg(o.photo||"", o.photoAlign)}
    ${o.photo ? "" : `<div class="pp-photo-ph"><div class="pp-photo-x">❌</div><div class="pp-photo-t">Photo non disponible</div><div class="pp-photo-c">${esc(o.photoCause||"")}</div></div>`}
    ${o.thumbs && o.thumbs.length ? `<div class="pp-thumbs">${o.thumbs.map(t=>`<img src="${t}" alt="">`).join("")}</div>` : ""}
    <img class="pp-logo" src="assets/logo-lockup.png" alt="Maître Toiturier">
    <div class="pp-services">Couverture<br>Zinguerie<br>Rénovation<br>Entretien</div>
    <div class="pp-tagline">Votre toit,<br>notre expertise<br>durable.</div>
    <div class="pp-topright"><div class="pp-topright-t">${o.topTitle||"Rapport de diagnostic"}</div><div class="pp-topright-n">${o.topNum||("N° "+esc(d.id))}</div><div class="pp-topright-line"></div></div>
    ${o.num ? `<div class="pp-num">${o.num}</div>` : (o.icon ? `<div class="pp-num pp-num-ic">${iconSvg(o.icon,124)}</div>` : "")}
    <div class="pp-titleblock">
      <div class="pp-zone">${o.zone}</div>
      <div class="pp-title" style="font-size:${o.titleFs||40}px">${o.title}</div>
      <div class="pp-title-line"></div>
    </div>
    ${pill ? `<div class="pp-pill pp-pill-${pill.cls}">
      <div class="pp-pill-ic">${pill.mark==="check" ? iconSvg("check",20) : "<span>!</span>"}</div>
      <div class="pp-pill-tx"><div class="pp-pill-main">${esc(pill.label)}</div><div class="pp-pill-sub">${esc(pill.sub)}</div></div>
    </div>` : ""}
    <div class="pp-body">
      ${o.body ? o.body : `<div class="pp-cards ${o.cardsCls||""} ${cols===2?"c2":"c1"}" style="grid-template-rows:repeat(${rows},minmax(0,1fr))">${cards.join("")}</div>
      ${o.banner}`}
    </div>
    <div class="pp-foot">
      <div class="pp-foot-item">${iconSvg("pin",20)}<span>${esc(d.ville)}</span></div>
      <div class="pp-foot-item">${iconSvg("globe",20)}<span>${esc(SETTINGS.company.site||"")}</span></div>
      ${o.pagenum===false ? `<div class="pp-pagenum"></div>` : `<div class="pdf-page-num pp-pagenum"></div>`}
    </div>
  </div></div>`;
}

// Astuces neutres "tout va bien" par zone (affichées quand le contrôle est en bon état).
const POINT_GOOD_TIP = {
  "Couverture et état des tuiles":"Un contrôle visuel régulier de la couverture permet de repérer tôt les petits désordres et de préserver son étanchéité dans le temps.",
  "Éléments de finition":"Rives, arêtiers, faîtage et solins assurent la continuité de la couverture aux points singuliers : leur bon état évite les infiltrations en périphérie de toiture.",
  "Zinguerie":"Gouttières, chéneaux et noues assurent la collecte et l’évacuation des eaux pluviales : leur bon état évite débordements et infiltrations en pied de toiture.",
  "Fenêtres de toit (Velux)":"Les fenêtres de toit sont un point sensible de l’étanchéité : un bon état de leur pourtour et de leurs solins évite les infiltrations au niveau de l’ouverture.",
  "Cheminées et souches":"Les solins et mitrons de cheminée sont des points singuliers exposés : leur contrôle régulier permet de prévenir les infiltrations autour de la souche.",
  "Étanchéité":"Une étanchéité en bon état empêche l’eau de pénétrer sous la couverture, notamment autour des raccords et des pénétrations.",
  "Charpente":"La charpente porte toute la toiture : un contrôle périodique permet de s’assurer qu’elle reste saine et à l’abri de l’humidité.",
  "Isolation et ventilation":"Une bonne ventilation des combles limite l’humidité et contribue à la durabilité de la charpente comme de l’isolation.",
  "Humidité et infiltrations":"L’absence de traces d’humidité est le meilleur indicateur d’une toiture qui remplit bien son rôle de protection.",
  "État général et sécurité":"Des accès et équipements de sécurité en bon état facilitent les interventions futures en toute sécurité.",
  "Entretien, mousses et lichens":"Un entretien régulier limite le développement de mousses et lichens et contribue à la longévité des matériaux."
};

// Contenu prédéfini quand un bloc n'a rien à afficher, selon l'état renseigné dans le diagnostic.
function ppDefaults(p, pt){
  const e = pt.etat;
  if(e==="Bon état") return {
    tip: POINT_GOOD_TIP[p] || "Un contrôle régulier permet de préserver l’état de cette zone.",
    travaux: "Aucun travaux nécessaire à ce stade. Un entretien courant suffit à préserver cette zone.",
    vig: "Aucun point de vigilance particulier n’a été relevé sur cette zone lors du contrôle."
  };
  if(e==="Pas vu") return {
    tip: "Une zone non contrôlée ne permet pas de conclure sur son état : un accès adapté permet de la vérifier.",
    travaux: "Contrôle complémentaire à prévoir avec un accès adapté.",
    vig: "Zone non contrôlée : aucune conclusion ne peut être donnée sur son état."
  };
  if(e==="Non présent") return {
    tip: "Certains éléments ne sont pas présents sur toutes les toitures : ce point ne nécessite alors aucune action.",
    travaux: "Sans objet : cet élément n’est pas présent sur cette toiture.",
    vig: "Sans objet : aucun point de vigilance sur un élément absent."
  };
  if(e==="Non contrôlé") return {
    tip: "Ce point n’a pas encore été contrôlé.",
    travaux: "À définir après contrôle de cette zone.",
    vig: "Contrôle à réaliser."
  };
  return {
    tip: "Un suivi régulier de ce point permet d’observer son évolution et d’intervenir au bon moment.",
    travaux: "À définir avec le technicien après contrôle complémentaire.",
    vig: "Aucun risque spécifique n’a été renseigné pour ce point."
  };
}

function ppPhotoCause(pt){
  if(pt.etat==="Pas vu") return "Cause : Pas vu (zone non visible ou accès non sécurisé)";
  if(pt.etat==="Non présent") return "Cause : élément non présent sur cette toiture";
  if(pt.etat==="Non contrôlé") return "Cause : point non contrôlé";
  return "Cause : aucune photo jointe à ce contrôle";
}

function pdfPointPage(p, i, d){
  const pt = d.diagnostic.points[p];
  const photos = (pt.photos||[]).filter(ph=>ph.dataUrl);
  const st = ppStatus(pt.etat);
  const def = ppDefaults(p, pt);
  const dyk = pickDidYouKnow(pt);
  const obs = pt.observation || (pt.etat==="Bon état" ? "Aucune anomalie n’a été observée sur cet élément lors du contrôle visuel des zones accessibles." : "Non renseignée.");
  const hasVig = !!pt.risque && pt.etat!=="Bon état" && pt.etat!=="Non présent";
  return ppShell(d, {
    photo: photos[0] ? photos[0].dataUrl : "",
    photoCause: ppPhotoCause(pt),
    thumbs: photos.slice(1,3).map(t=>t.dataUrl),
    num: String(i+1).padStart(2,"0"),
    zone: "Zone de contrôle",
    title: esc(p),
    titleFs: p.length<=12 ? 46 : (p.length<=24 ? 40 : 34),
    pill: st,
    cards: [
      ppCard("doc","Notre observation",esc(obs)),
      ppCard("idea","Le saviez-vous ?",esc(dyk ? dyk.text : def.tip)),
      ppCard("wrench","Décision",`<b>${esc(pt.decision)}</b>${pt.pourquoi?" — "+esc(pt.pourquoi):""}`),
      ppCard("helmet","Travaux proposés",esc(pt.travaux || def.travaux))
    ],
    banner: ppBanner("warning","Vigilance", esc(hasVig ? pt.risque : def.vig), PP_QUOTE)
  });
}

function ppBarsHtml(d){
  const counts = {};
  POINTS.forEach(p=>{ const e=d.diagnostic.points[p].etat||"Non contrôlé"; counts[e]=(counts[e]||0)+1; });
  const order = [["Bon état","#2e7d5b"],["À surveiller","#d4af37"],["Défaut constaté","#b3413a"],["Urgent","#23262c"],["Pas vu","#8a8a8a"],["Non présent","#a8a190"],["Non contrôlé","#c9c2ae"]].filter(([k])=>counts[k]);
  const max = Math.max(1,...order.map(([k])=>counts[k]));
  const bw=34, gap=14, base=52, top=44;
  const w = order.length*(bw+gap)+gap;
  const rects = order.map(([k,c],i)=>{
    const h = Math.max(4, Math.round(counts[k]/max*top)), x = gap+i*(bw+gap);
    return `<rect x="${x}" y="${base-h}" width="${bw}" height="${h}" rx="3" fill="${c}"/><text x="${x+bw/2}" y="${base+11}" text-anchor="middle" font-size="9" font-weight="700" fill="#4a4433">${counts[k]}</text>`;
  }).join("");
  const legend = order.map(([k,c])=>`<span class="pp-leg"><i style="background:${c}"></i>${esc(k)}</span>`).join("");
  return `<svg viewBox="0 0 ${w} 66" xmlns="http://www.w3.org/2000/svg" style="display:block;height:52px;width:auto;max-width:100%">${rects}</svg><div class="pp-legs">${legend}</div>`;
}

function ppCoverPage(d){
  const s = d.diagnostic.synthese;
  return ppShell(d, {
    photo: ppPhoto("cover"),
    photoAlign: "xMinYMid",
    zone: "Étude personnalisée",
    icon: "house",
    title: "Rapport de diagnostic de toiture",
    titleFs: 33,
    pill: ppConclusion(s.conclusion),
    cardsCls: "big",
    cards: [
      ppCard("house","Client",esc(d.client)),
      ppCard("pin","Adresse du bien",`${esc(d.adresse)}<br>${esc(d.ville)}`),
      ppCard("clipboard","Dossier et visite",`${esc(d.id)}<br>Visite du ${esc(d.visiteDate||"—")}`),
      ppCard("helmet","Technicien",esc(d.technicien||"À affecter"))
    ],
    banner: ppBanner("shield","Notre engagement","Prévenir les désordres. Prioriser les bonnes actions. Une lecture claire de votre toiture, selon les zones accessibles.", PP_QUOTE),
    pagenum: false
  });
}

function ppSynthesePage(d){
  const s = d.diagnostic.synthese;
  const controlled = POINTS.filter(p=>d.diagnostic.points[p].etat!=="Non contrôlé");
  const flagged = POINTS.filter(p=>["Défaut constaté","À surveiller","Urgent"].includes(d.diagnostic.points[p].etat));
  const flaggedHtml = flagged.length
    ? flagged.map(p=>`<b>${esc(p)}</b> — ${esc(d.diagnostic.points[p].etat)}`).join("<br>")
    : "Aucun point signalé pour le moment.";
  return ppShell(d, {
    photo: ppPhoto("synthese"),
    photoAlign: "xMidYMax",
    icon: "clipboard",
    zone: "Points contrôlés",
    title: "Synthèse du diagnostic",
    titleFs: 36,
    pill: ppConclusion(s.conclusion),
    cards: [
      ppCard("doc","Notre observation", s.observations ? esc(s.observations) : "Aucune observation générale renseignée."),
      ppCard("layers","Couverture", `<b>${esc(s.typeCouverture||"—")}</b><br>Surface estimée : ${s.surface?esc(s.surface)+" m²":"—"}<br>${controlled.length} / ${POINTS.length} points contrôlés`),
      ppCard("clipboard","Répartition des contrôles", ppBarsHtml(d)),
      ppCard("warning","Points signalés", flaggedHtml)
    ],
    banner: ppBanner("wrench","Préconisations", esc(s.preconisations || "À définir avec le technicien."), PP_QUOTE)
  });
}

function ppPlanPage(d){
  const flagged = POINTS.filter(p=>["Défaut constaté","À surveiller","Urgent"].includes(d.diagnostic.points[p].etat));
  const urgent = flagged.some(p=>d.diagnostic.points[p].etat==="Urgent");
  const actions = flagged.map((p,i)=>{
    const pt = d.diagnostic.points[p];
    return ppCard(`<div class="pp-badge">${i+1}</div>`, esc(actionLabelFor(p, pt.decision)), esc(pt.travaux || pt.pourquoi || "À définir avec le technicien."));
  });
  actions.push(ppCard(`<div class="pp-badge">${flagged.length+1}</div>`, "Documenter et suivre", "Conserver les photos après intervention et signaler les zones restées inaccessibles."));
  const steps = `<div class="pp-steps"><div class="pp-vig-label">Et maintenant ?</div>
    <div class="pp-step"><b>1</b>Devis détaillé</div><div class="pp-step"><b>2</b>Planification</div><div class="pp-step"><b>3</b>Suivi après travaux</div></div>`;
  return ppShell(d, {
    photo: ppPhoto("plan"),
    icon: "wrench",
    zone: "Préconisations",
    title: "Plan d’action",
    titleFs: 40,
    pill: flagged.length
      ? {cls: urgent?"urgent":"bad", label: flagged.length+" point"+(flagged.length>1?"s":"")+" à traiter", sub:"Selon les constats de la visite", mark:"!"}
      : {cls:"ok", label:"Rien à traiter", sub:"Selon les constats de la visite", mark:"check"},
    cards: actions,
    banner: ppBanner("clipboard","En résumé", esc(buildClosingSummary(d)), steps)
  });
}

function ppBackPage(d){
  return ppShell(d, {
    photo: ppPhoto("dos"),
    icon: "check",
    zone: "Merci de votre confiance",
    title: "À votre disposition",
    titleFs: 40,
    cards: [
      ppCard("globe","Nous contacter",esc(SETTINGS.company.site||"")+"<br>Téléphone : "+esc(SETTINGS.company.telephone||"à renseigner")+"<br>E-mail : "+esc(SETTINGS.company.email||"à renseigner")),
      ppCard("check","Et maintenant ?","Ce rapport vous a été remis à l’issue de la visite diagnostic. Notre équipe reste à votre disposition pour répondre à vos questions et organiser les travaux recommandés.")
    ],
    banner: ppBanner("shield","Information","Document de démonstration. Contrôle visuel des zones accessibles, selon les observations renseignées par le technicien. Ce rapport n’est pas une certification.", PP_QUOTE),
    pagenum: false
  });
}

function renderReportDoc(d){
  return `<div class="pdf-doc">
    ${ppCoverPage(d)}
    ${ppSynthesePage(d)}
    ${POINTS.map((p,i)=>pdfPointPage(p,i,d)).join("")}
    ${ppPlanPage(d)}
    ${ppBackPage(d)}
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
  ${renderProcessCard(d)}
  <div class="card">
    <div class="card-header"><h3>Suivi de l’opportunité</h3>${badge(d.commercialStage, d.commercialStage==="Gagné"?"green":d.commercialStage==="Perdu"?"red":"blue")}</div>
    <div class="form-field"><label>Étape commerciale${acceptedDevis(d)?" (pilotée automatiquement par les factures et paiements)":""}</label>
      <select id="comStage" ${!hasPermission("opportunity.update")||acceptedDevis(d)?"disabled":""}>
        ${(acceptedDevis(d)?PROCESS_STAGES:MANUAL_STAGES).map(o=>`<option ${d.commercialStage===o?"selected":""}>${o}</option>`).join("")}
      </select>
    </div>
    <div class="form-field"><label>Montant estimé du devis (€)</label><input type="number" id="comMontant" value="${d.montant}" ${!hasPermission("opportunity.update")?"disabled":""}></div>
    <div class="form-field"><label>Prochaine relance</label><input type="text" id="comRelance" placeholder="ex. 20 sept." value="${esc(d.prochaineRelance||"")}" ${!hasPermission("opportunity.update")?"disabled":""}></div>
    <div class="form-field"><label>Commercial responsable</label><input type="text" value="${esc(d.commercial||"À affecter")}" disabled></div>
    <div class="form-field"><label>Compte rendu / prochaine action</label><textarea id="comCompteRendu" placeholder="Ex. rappeler le client après réception du devis…">${esc(d.compteRendu)}</textarea></div>
    ${hasPermission("opportunity.update") ? `<button class="btn-primary btn-sm" data-action="save-commercial" data-id="${d.id}">Enregistrer le suivi</button>` : ""}
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
  const paidCt = facturePaidCt(f);
  // Modifiable (libellé, montant, échéance) tant qu'aucun paiement n'a encore été enregistré :
  // une facture juste envoyée peut avoir besoin d'une correction. Dès qu'un paiement existe, on
  // bascule sur le suivi des règlements plutôt que de permettre de changer le montant sous le nez.
  const editable = paidCt===0 && hasPermission("invoice.create");
  const resteCt = Math.max(0, f.montantTtcCt - paidCt);
  return `
    <div class="card devis-sub-card">
      <div class="card-header"><h3 style="font-size:13.5px">${esc(f.numero)} · ${esc(f.type)}</h3><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${badge(f.statut, factureStatutCls(f.statut))}<button class="btn-ghost btn-sm" data-action="doc-pdf" data-id="${d.id}" data-kind="facture" data-doc="${f.id}">PDF</button>${hasPermission("invoice.create")?`<button class="btn-secondary btn-sm" data-action="modal-send-doc" data-id="${d.id}" data-kind="facture" data-doc="${f.id}">Envoyer</button>`:""}</div></div>
      <p class="form-help" style="margin:0 0 10px">${(f.echeances||[]).length>1 ? "Règlement en "+f.echeances.length+" fois par "+esc(f.mode||"virement").toLowerCase()+" : "+echeancesStatus(f).map(e=>fmtEuros(e.montantCt)+" le "+esc(e.date)+(e.reglee?" ✓":"")).join(" · ") : "Règlement en une fois par "+esc((f.mode||"Virement").toLowerCase())}</p>
      <div class="form-field"><label>Libellé</label><input type="text" id="factureLibelle-${f.id}" value="${esc(f.libelle||"")}" ${editable?"":"disabled"}></div>
      <div class="form-field"><label>Montant TTC (€)</label><input type="number" min="0" step="0.01" id="factureMontant-${f.id}" value="${(f.montantTtcCt/100).toFixed(2)}" ${editable?"":"disabled"}></div>
      <div class="form-field"><label>Échéance</label><input type="text" id="factureEcheance-${f.id}" placeholder="ex. 30 sept." value="${esc(f.echeance||"")}" ${editable?"":"disabled"}></div>
      ${editable ? `
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-secondary btn-sm" data-action="facture-save" data-id="${d.id}" data-fid="${f.id}">Enregistrer</button>
        <button class="btn-primary btn-sm" data-action="facture-send" data-id="${d.id}" data-fid="${f.id}">Marquer comme envoyée</button>
        <button class="btn-ghost btn-sm" data-action="ask-delete" data-what="facture" data-id="${d.id}" data-doc="${f.id}">Supprimer</button>
      </div>` : `
      <div class="devis-payments">
        <div class="row-sub" style="margin-bottom:8px">Encaissé ${fmtEuros(paidCt)} sur ${fmtEuros(f.montantTtcCt)}${resteCt>0?` · reste ${fmtEuros(resteCt)}`:""}</div>
        ${f.paiements.map(p=>`
          <div class="row-item">
            <div class="row-sub">${esc(p.date)} · ${esc(p.mode)}${p.mode==="Virement"?" · "+esc(p.virementStatut):""}</div>
            <div style="display:flex;align-items:center;gap:10px">
              ${fmtEuros(p.montantCt)}
              ${hasPermission("payment.register") ? `<button class="btn-ghost btn-sm" data-action="ask-delete" data-what="paiement" data-id="${d.id}" data-doc="${f.id}" data-pid="${p.id}">✕</button>` : ""}
              ${p.mode==="Virement" && p.virementStatut==="Annoncé" && hasPermission("payment.register") ? `<button class="btn-ghost btn-sm" data-action="payment-confirm" data-id="${d.id}" data-fid="${f.id}" data-pid="${p.id}">Confirmer réception</button>` : ""}
            </div>
          </div>`).join("")}
        ${resteCt>0 && hasPermission("payment.register") ? `
        <div class="form-field" style="margin-top:10px">
          <label>Nouveau paiement</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <input type="number" min="0" step="0.01" id="paiementMontant-${f.id}" placeholder="Montant €" style="max-width:120px">
            <select id="paiementMode-${f.id}">${PAY_MODES.map(m=>`<option ${(f.mode||"")===m?"selected":""}>${m}</option>`).join("")}</select>
            <input type="text" id="paiementDate-${f.id}" placeholder="ex. 15 sept." style="max-width:110px">
            <button class="btn-secondary btn-sm" data-action="payment-add" data-id="${d.id}" data-fid="${f.id}">Enregistrer le paiement</button>
          </div>
        </div>` : ""}
      </div>`}
    </div>`;
}

function renderDossierDevis(d){
  const dv = latestDevis(d);
  // Modifiable tant que le devis n'est pas refusé : un devis envoyé ou déjà accepté peut avoir
  // besoin d'une correction (erreur de prix, ligne oubliée) sans repartir sur une nouvelle version.
  const canEditDv = (!dv || dv.statut!=="Refusé") && hasPermission("quote.update");
  let devisBlock;
  if(!dv){
    devisBlock = `
    <div class="card" style="text-align:center;padding:32px 20px">
      <h3 style="margin-bottom:6px">Aucun devis pour ce dossier</h3>
      <p style="color:var(--muted);margin-bottom:16px">Créez un premier devis à partir des travaux identifiés lors du diagnostic.</p>
      ${hasPermission("quote.create") ? `<button class="btn-primary btn-sm" data-action="wizard-devis" data-id="${d.id}">+ Nouveau devis</button>` : ""}
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
            <thead><tr><th>Désignation</th><th>Qté</th><th>Unité</th><th>PU HT</th><th>TVA</th><th>Total HT</th><th></th></tr></thead>
            <tbody>
            ${dv.lignes.map((l,i)=>`
              <tr>
                <td data-label="Désignation">${canEditDv?`<input type="text" class="devis-line-input" data-idx="${i}" data-field="designation" value="${esc(l.designation)}" placeholder="Désignation">`:esc(l.designation)}</td>
                <td data-label="Quantité" style="width:64px">${canEditDv?`<input type="number" min="0" step="1" class="devis-line-input" data-idx="${i}" data-field="qte" value="${l.qte}">`:l.qte}</td>
                <td data-label="Unité" style="width:80px">${canEditDv?`<select class="devis-line-input" data-idx="${i}" data-field="unite">${unitOptionsHtml(l.unite)}</select>`:esc(l.unite||"")}</td>
                <td data-label="Prix unitaire HT" style="width:100px">${canEditDv?`<input type="number" min="0" step="0.01" class="devis-line-input" data-idx="${i}" data-field="prixUnitaire" value="${(l.prixUnitaireCt/100).toFixed(2)}">`:fmtEuros(l.prixUnitaireCt)}</td>
                <td data-label="TVA %" style="width:64px">${canEditDv?`<input type="number" min="0" step="1" class="devis-line-input" data-idx="${i}" data-field="tva" value="${l.tvaPct}">`:l.tvaPct+"%"}</td>
                <td data-label="Total HT" style="white-space:nowrap">${fmtEuros(lineTotalHTct(l))}</td>
                <td>${canEditDv && dv.lignes.length>1 ?`<button class="btn-ghost btn-sm" data-action="devis-remove-line" data-id="${d.id}" data-idx="${i}">✕</button>`:""}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
        ${canEditDv?`
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0">
          <button class="btn-secondary btn-sm" data-action="devis-add-line" data-id="${d.id}">+ Ligne libre</button>
          <select id="devisCatalogSel" class="devis-line-input" data-id="${d.id}" style="max-width:300px"><option value="">+ Ajouter depuis le catalogue…</option>${catalogOptionsHtml(dv.lignes.map(l=>l.code))}</select>
        </div>`:""}
        <div class="devis-totals">
          <div>Total HT <b>${fmtEuros(totals.htCt)}</b></div>
          <div>TVA <b>${fmtEuros(totals.tvaCt)}</b></div>
          <div>Total TTC <b>${fmtEuros(totals.ttcCt)}</b></div>
        </div>
        ${devisMargeHtml(dv)}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
          ${canEditDv?`<button class="btn-primary btn-sm" data-action="devis-save" data-id="${d.id}">Enregistrer</button>`:""}
          ${dv.statut==="Brouillon" && hasPermission("quote.update")?`<button class="btn-secondary btn-sm" data-action="devis-send" data-id="${d.id}">Marquer comme envoyé</button>`:""}
          ${(dv.statut==="Envoyé"||dv.statut==="Brouillon") && hasPermission("quote.accept")?`<button class="btn-primary btn-sm" data-action="win-devis" data-id="${d.id}">✓ Gagné</button>`:""}${dv.statut==="Envoyé" && hasPermission("quote.update")?`<button class="btn-ghost btn-sm" data-action="devis-reject" data-id="${d.id}">Marquer refusé</button>`:""}
          ${dv.statut!=="Brouillon"?`<button class="btn-ghost btn-sm" data-action="wizard-devis" data-id="${d.id}">+ Nouvelle version</button>`:""}
          <button class="btn-ghost btn-sm" data-action="doc-pdf" data-id="${d.id}" data-kind="devis" data-doc="${dv.id}">Télécharger le PDF</button>
          ${hasPermission("quote.send")?`<button class="btn-secondary btn-sm" data-action="modal-send-doc" data-id="${d.id}" data-kind="devis" data-doc="${dv.id}">Envoyer au client</button>`:""}
          ${dv.statut==="Brouillon" && hasPermission("quote.create")?`<button class="btn-ghost btn-sm" data-action="ask-delete" data-what="devis" data-id="${d.id}" data-doc="${dv.id}">Supprimer</button>`:""}
        </div>
        <p class="form-help" style="margin-top:10px">${esc(paiementSummary(dv))} ${canEditDv?`<button class="link-btn" data-action="ech-edit-open" data-id="${d.id}">Modifier</button>`:""}</p>
        ${dv.dateEnvoi?`<p class="form-help" style="margin-top:8px">Envoyé le ${esc(dv.dateEnvoi)}</p>`:""}
      </div>
      ${d.devis.length>1?`
      <div class="card">
        <h3 style="margin:0 0 10px;font-size:14.5px">Historique des versions</h3>
        ${d.devis.slice(0,-1).reverse().map(v=>`<div class="row-item"><div><div class="row-title">${esc(v.numero)} · v${v.version}</div><div class="row-sub">${fmtEuros(devisTotals(v).ttcCt)}</div></div><div style="display:flex;align-items:center;gap:8px">${badge(v.statut, devisStatutCls(v.statut))}<button class="btn-ghost btn-sm" data-action="doc-pdf" data-id="${d.id}" data-kind="devis" data-doc="${v.id}">PDF</button></div></div>`).join("")}
      </div>`:""}`;
  }

  const facturesBlock = `
    <div class="card">
      <div class="card-header"><h3>Factures</h3>
        ${dv && dv.statut==="Accepté" && hasPermission("invoice.create") ? `<button class="btn-secondary btn-sm" data-action="wizard-facture" data-id="${d.id}">+ Nouvelle facture</button>` : ""}
      </div>
      ${!d.factures.length ? `<div class="empty-note">${dv && dv.statut==="Accepté" ? "Aucune facture pour l’instant." : "Le devis doit être accepté avant de pouvoir facturer."}</div>` : d.factures.map(f=>renderFactureCard(d,f)).join("")}
    </div>`;

  return (canView("devis")||canView("factures") ? renderProcessCard(d) : "") + (canView("devis") ? devisBlock : "") + (canView("factures") ? facturesBlock : "");
}

// ---------- Préparation du matériel (techniciens) : bibliothèque de listes + agenda ----------
function isoToDate(iso){ return iso ? new Date(iso+"T00:00:00") : null; }
function fmtIsoFr(iso){ const dt = isoToDate(iso); return dt ? fmtDayMonth(dt) : "sans date"; }
function matProgress(p){
  const n = p.items.length, done = p.items.filter(i=>i.done).length;
  return {n, done, complete: n>0 && done===n};
}
function canEditMateriel(){ return canEditMod("agenda") || canEditMod("diagnostics"); }

function renderDossierMateriel(d){
  d.materiel = d.materiel || [];
  const edit = canEditMateriel();
  const preps = d.materiel.slice().sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999"));
  return `
  <div class="card">
    <div class="card-header"><h3>Matériel à prévoir</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${edit?`<button class="btn-primary btn-sm" data-action="mat-new" data-id="${d.id}">+ Préparer un chantier</button>`:""}
        ${edit?`<button class="btn-secondary btn-sm" data-action="matlib-open">Ma bibliothèque</button>`:""}
      </div>
    </div>
    <p class="form-help" style="margin:0">Choisissez un type de chantier dans la bibliothèque (ex. « Charpente à changer ») et une date : la liste de matériel apparaît ici et dans l’agenda ce jour-là, pour ne rien oublier.</p>
  </div>
  ${preps.length===0 ? `<div class="empty-note">Aucune préparation pour ce dossier.</div>` : preps.map(p=>{
    const pr = matProgress(p);
    return `
  <div class="card">
    <div class="card-header">
      <div><h3 style="margin:0">${esc(p.label)}</h3><div class="row-sub">${esc(d.adresse)}, ${esc(d.ville)} · ${p.date?"le "+esc(fmtIsoFr(p.date)):"sans date"}${p.par?" · "+esc(p.par):""}</div></div>
      ${badge(pr.complete?"Tout est prêt":pr.done+" / "+pr.n, pr.complete?"green":"gold")}
    </div>
    <div class="mat-bar"><span style="width:${pr.n?Math.round(pr.done/pr.n*100):0}%"></span></div>
    ${p.note?`<p class="form-help">${esc(p.note)}</p>`:""}
    ${p.items.map((it,i)=>`
      <div class="row-item">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1">
          <input type="checkbox" data-action="mat-toggle" data-id="${d.id}" data-mid="${p.id}" data-idx="${i}" ${it.done?"checked":""} ${edit?"":"disabled"}>
          <span style="${it.done?"text-decoration:line-through;color:var(--muted)":""}">${esc(it.label)}</span>
        </label>
        ${edit?`<button class="btn-ghost btn-sm" data-action="mat-del-item" data-id="${d.id}" data-mid="${p.id}" data-idx="${i}">✕</button>`:""}
      </div>`).join("")}
    ${edit?`
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
      <input type="text" id="matNew-${p.id}" placeholder="Ajouter un outil ou une fourniture…" style="flex:1;min-width:180px">
      <button class="btn-secondary btn-sm" data-action="mat-add-item" data-id="${d.id}" data-mid="${p.id}">Ajouter</button>
      <button class="btn-ghost btn-sm" data-action="ask-delete" data-what="materiel" data-id="${d.id}" data-doc="${p.id}">Supprimer la liste</button>
    </div>`:""}
  </div>`;
  }).join("")}`;
}

function modalMatNew(m){
  const d = byId(m.id);
  const lib = SETTINGS.materielLib || [];
  return modalWrap("Préparer un chantier", `
    <p class="form-help" style="margin-bottom:12px">${esc(d.client)} · ${esc(d.adresse)}, ${esc(d.ville)}</p>
    <div class="form-field"><label>Type de chantier (bibliothèque)</label>
      <select id="mpLib">${lib.map(l=>`<option value="${l.id}">${esc(l.label)} — ${l.items.length} éléments</option>`).join("")}<option value="">Liste vide (à remplir moi-même)</option></select></div>
    <div class="form-field"><label>Date du chantier</label><input type="date" id="mpDate"></div>
    <div class="form-field"><label>Remarque (facultatif)</label><input type="text" id="mpNote" placeholder="ex. accès difficile, prévoir 2 personnes"></div>
    <div class="modal-actions"><button class="btn-primary" data-action="mat-create" data-id="${d.id}">Créer la liste</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`);
}

function modalMatLib(){
  const lib = state.matDraft || [];
  return modalWrap("Ma bibliothèque de chantiers", `
    <p class="form-help" style="margin-bottom:12px">Chaque type de chantier a sa liste de matériel (un élément par ligne). Modifiez, ajoutez ou supprimez : c’est partagé par toute l’équipe.</p>
    ${lib.map((l,i)=>`
      <div class="card" style="padding:12px">
        <div style="display:flex;gap:8px"><input type="text" id="ml-label-${i}" value="${esc(l.label)}" style="flex:1"><button class="btn-ghost btn-sm" data-action="matlib-del" data-idx="${i}">Supprimer</button></div>
        <textarea id="ml-items-${i}" rows="5" style="margin-top:8px">${esc(l.items.join("\n"))}</textarea>
      </div>`).join("")}
    <div class="modal-actions"><button class="btn-secondary" data-action="matlib-add">+ Nouveau type de chantier</button><button class="btn-primary" data-action="matlib-save">Enregistrer</button></div>`);
}
function matLibFlush(){
  const lib = state.matDraft || [];
  lib.forEach((l,i)=>{
    const a = document.getElementById("ml-label-"+i), b = document.getElementById("ml-items-"+i);
    if(!a || !b) return;
    l.label = a.value.trim() || l.label;
    l.items = b.value.split("\n").map(x=>x.trim()).filter(Boolean);
  });
}

function renderDossierChantier(d){
  const c = d.chantier;
  if(!c) return `<div class="card" style="text-align:center;padding:32px 20px"><h3 style="margin-bottom:6px">Pas encore de chantier</h3><p style="color:var(--muted)">Le chantier est préparé automatiquement à l'acceptation du devis.</p></div>`;
  const canEdit = hasPermission("job.update");
  const equipeOptions = POSEURS.map(p=>`<option value="${esc(p)}" ${c.equipe.includes(p)?"selected":""}>${esc(p)}</option>`).join("");

  const resume = `
  <div class="card">
    <div class="card-header"><h3>Chantier</h3>${badge(c.statut, chantierStatutCls(c.statut))}</div>
    <div class="form-field"><label>Statut</label>
      <select id="chStatut" ${canEdit?"":"disabled"}>${CHANTIER_STATUTS.map(s=>`<option ${c.statut===s?"selected":""}>${esc(s)}</option>`).join("")}</select>
    </div>
    <div class="form-field"><label>Équipe (poseurs)</label>
      <select id="chEquipe" multiple size="${POSEURS.length}" ${canEdit?"":"disabled"}>${equipeOptions}</select>
    </div>
    <div class="form-field"><label>Date de début</label><input type="text" id="chDebut" placeholder="ex. 20 sept." value="${esc(c.dateDebut||"")}" ${canEdit?"":"disabled"}></div>
    <div class="form-field"><label>Date de fin</label><input type="text" id="chFin" placeholder="ex. 22 sept." value="${esc(c.dateFin||"")}" ${canEdit?"":"disabled"}></div>
    <div class="form-field"><label>Consignes d'accès</label><textarea id="chAcces" placeholder="Clés, code, contact sur place…" ${canEdit?"":"disabled"}>${esc(c.acces)}</textarea></div>
    <div class="form-field"><label>Matériel spécifique (échafaudage, nacelle, stationnement…)</label><textarea id="chEquipement" ${canEdit?"":"disabled"}>${esc(c.equipement)}</textarea></div>
    <div class="form-field"><label>Consignes générales</label><textarea id="chConsignes" ${canEdit?"":"disabled"}>${esc(c.consignes)}</textarea></div>
    ${canEdit?`<button class="btn-primary btn-sm" data-action="chantier-save" data-id="${d.id}">Enregistrer</button>`:""}
  </div>`;

  const checklistBlock = (key, title) => `
    <div class="card">
      <h3 style="margin:0 0 10px;font-size:14.5px">${esc(title)}</h3>
      ${c.checklist[key].map((item,i)=>`
        <div class="row-item">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;width:100%">
            <input type="checkbox" data-action="chantier-toggle-check" data-id="${d.id}" data-key="${key}" data-idx="${i}" ${item.done?"checked":""} ${canEdit?"":"disabled"}>
            <span style="${item.done?"text-decoration:line-through;color:var(--muted)":""}">${esc(item.label)}</span>
          </label>
        </div>`).join("")}
    </div>`;

  const photoCat = (cat, title) => {
    const photos = c.photos[cat];
    return `
    <div class="card">
      <h3 style="margin:0 0 10px;font-size:14.5px">${esc(title)} (${photos.length})</h3>
      ${photos.length?`<div class="photo-grid">${photos.map((ph,i)=>`<div class="photo-thumb"><img src="${ph.dataUrl}" alt=""><button class="photo-remove" data-action="chantier-remove-photo" data-id="${d.id}" data-cat="${cat}" data-idx="${i}">✕</button></div>`).join("")}</div>`:`<div class="empty-note">Aucune photo.</div>`}
      <input type="file" id="chPhoto-${cat}" accept="image/*" multiple style="display:none" data-id="${d.id}" data-cat="${cat}">
      <button class="btn-secondary btn-sm" data-action="trigger-file" data-target="chPhoto-${cat}">Ajouter des photos</button>
    </div>`;
  };

  const incidentsBlock = `
    <div class="card">
      <div class="card-header"><h3>Incidents signalés</h3></div>
      ${c.incidents.length?c.incidents.map((inc,ix)=>`<div class="row-item"><div><div class="row-title">${esc(incidentCatLabel(inc.categorie))}</div><div class="row-sub">${esc(inc.date)} · ${esc(inc.auteur)}</div><div>${esc(inc.description)}</div></div>${canEdit?`<button class="btn-ghost btn-sm" data-action="ask-delete" data-what="incident" data-id="${d.id}" data-idx="${ix}">✕</button>`:""}</div>`).join(""):`<div class="empty-note">Aucun incident signalé.</div>`}
      <div class="form-field" style="margin-top:12px">
        <label>Signaler un problème</label>
        <select id="incCategorie">
          <option value="materiel">Matériel manquant</option>
          <option value="technique">Problème technique</option>
          <option value="acces">Accès impossible</option>
          <option value="meteo">Météo</option>
          <option value="dommage">Dommage constaté</option>
          <option value="autre">Autre</option>
        </select>
        <textarea id="incDescription" placeholder="Décrire le problème…" style="margin-top:8px"></textarea>
        <button class="btn-secondary btn-sm" style="margin-top:8px" data-action="chantier-report-incident" data-id="${d.id}">Signaler</button>
      </div>
    </div>`;

  return resume
    + checklistBlock("avant","Checklist — avant chantier")
    + checklistBlock("pendant","Checklist — pendant chantier")
    + checklistBlock("fin","Checklist — fin de chantier")
    + photoCat("avant","Photos avant")
    + photoCat("pendant","Photos pendant")
    + photoCat("apres","Photos après")
    + incidentsBlock;
}

// ---------- Agenda ----------

function agendaEventsForDate(date){
  const events = [];
  visibleDossiers().forEach(d=>{
    const visiteD = parseShortFrDate(d.visiteDate);
    if(visiteD && sameDay(visiteD, date)){
      events.push({time:d.visiteHeure, label:"Visite", client:d.client, membre:d.technicien, ville:d.ville, id:d.id});
    }
    (d.materiel||[]).forEach(p=>{
      const pd = isoToDate(p.date);
      if(pd && sameDay(pd, date)){ const pr = matProgress(p); events.push({time:null, label:"Matériel · "+p.label+" ("+pr.done+"/"+pr.n+")", client:d.client, membre:d.technicien, ville:d.ville, id:d.id, tab:"materiel"}); }
    });
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
  return `<div class="${cls}" data-action="open-dossier" data-id="${e.id}" ${e.tab?`data-tab="${e.tab}"`:""}>
    ${e.time?`<div class="ev-time">${esc(e.time)} · ${esc(e.label)}</div>`:`<div class="ev-time">${esc(e.label)}</div>`}
    <div>${esc(e.client)}</div>
    <div class="row-sub">${esc(e.membre||"—")} · ${esc(e.ville)}</div>
  </div>`;
}

function renderCalToolbar(){
  const v = state.calendarView;
  const members = ["Toute l’équipe", ...activeStaff("tech"), ...activeStaff("sales")];
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
    <select id="agendaMemberSelect" class="role-select">
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
    ${canNouveauContrat() ? `<button class="btn-primary" data-action="form-open" data-form="contract">+ Créer un entretien</button>` : ""}
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
          <td style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-ghost btn-sm" data-action="open-dossier" data-id="${c.dossierId}">Dossier</button>${canNouveauContrat()?`<button class="btn-ghost btn-sm" data-action="form-open" data-form="contract" data-idx="${CONTRACTS.indexOf(c)}">Modifier</button><button class="btn-ghost btn-sm" data-action="ask-delete" data-what="contract" data-idx="${CONTRACTS.indexOf(c)}">✕</button>`:""}</td>
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
          <button class="btn-secondary btn-sm" style="flex:1" data-action="open-dossier" data-id="${c.dossierId}">Voir le dossier</button>${canNouveauContrat()?`<button class="btn-ghost btn-sm" data-action="form-open" data-form="contract" data-idx="${CONTRACTS.indexOf(c)}">Modifier</button><button class="btn-ghost btn-sm" data-action="ask-delete" data-what="contract" data-idx="${CONTRACTS.indexOf(c)}">✕</button>`:""}
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
    ${diagEditable() ? `<button class="btn-primary" data-action="modal-new-diag">+ Créer un diagnostic</button>` : ""}
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

function kanbanQuick(d){
  const dv = latestDevis(d), b = billingOf(d);
  if(!b && dv && (dv.statut==="Envoyé"||dv.statut==="Brouillon") && hasPermission("quote.accept")) return `<button class="btn-primary btn-sm" style="width:100%;margin-top:6px" data-action="win-devis" data-id="${d.id}">✓ Gagné</button>`;
  if(b && b.count>0 && b.due>1 && hasPermission("payment.register")){
    const open = b.fs.find(f=>f.montantTtcCt-facturePaidCt(f)>1);
    return `<button class="btn-primary btn-sm" style="width:100%;margin-top:6px" data-action="pay-open" data-id="${d.id}" data-fid="${open.id}">Enregistrer un paiement</button>`;
  }
  return "";
}

function renderCommercialKanban(){
  const list = visibleDossiers();
  const stages = PROCESS_STAGES;
  const actives = list.filter(d=>!["Perdu","Gagné","Impayé","Payé"].includes(d.commercialStage));
  const devisEnvoyes = list.filter(d=>d.commercialStage==="Devis envoyé").length;
  const montantGagne = list.filter(d=>["Gagné","Impayé","Payé"].includes(d.commercialStage)).reduce((s,d)=>s+d.montant,0);
  const aEncaisser = list.reduce((s,d)=>{ const b = billingOf(d); return s + (b ? b.due : 0); }, 0);
  const relancesRetard = list.filter(d=>d.prochaineRelance).length;

  return `
  <div class="page-header"><div><h1>Suivi commercial</h1><p>Du premier contact à l’accord du client. Ouvrez une affaire pour la faire avancer.</p></div></div>
  <div class="stat-grid">
    ${stat("Affaires actives", actives.length, "Prospects et devis en cours")}
    ${stat("Devis envoyés", devisEnvoyes, "En attente d’une réponse")}
    ${stat("Montant gagné", montantGagne.toLocaleString("fr-FR")+" €", "Affaires marquées gagnées")}
    ${stat("À encaisser", fmtEuros(aEncaisser), list.filter(d=>d.commercialStage==="Impayé").length+" client(s) impayé(s)")}
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
            ${processSummary(d) ? `<div class="kc-sub" style="color:var(--gold)">${esc(processSummary(d))}</div>` : ""}
            ${kanbanQuick(d)}
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
          ${d.montant ? `<div class="lc-motif" style="color:var(--gold);font-weight:700">${d.montant.toLocaleString("fr-FR")} €${processSummary(d)?" · "+esc(processSummary(d)):""}</div>` : ""}
          ${d.prochaineRelance ? `<div style="margin:8px 0">${badge("En retard","red")}</div>` : ""}
          <div class="lc-foot">${kanbanQuick(d)}<button class="btn-secondary btn-sm" style="width:100%;margin-top:6px" data-action="open-dossier" data-id="${d.id}" data-tab="commercial">Ouvrir le suivi</button></div>
        </div>`).join("");
    })()}
  </div>`;
}

// ---------- Parrainages ----------

function renderParrainages(){
  const list = visibleParrainages();
  const gagnees = list.filter(p=>p.affaire==="Gagné").length;
  const prevues = list.reduce((s,p)=>s+p.recompense,0);
  return `
  <div class="page-header">
    <div><h1>Parrainages clients</h1><p>Suivez les recommandations et les récompenses, du contact à la remise.</p></div>
    ${canAjouterParrainage() ? `<button class="btn-primary" data-action="form-open" data-form="parrainage">+ Ajouter un parrainage</button>` : ""}
  </div>
  <div class="stat-grid">
    ${stat("Recommandations", list.length, "Clients apportés")}
    ${stat("Affaires gagnées", gagnees, "Issues du parrainage")}
    ${stat("Récompenses prévues", prevues.toLocaleString("fr-FR")+" €", "Suivi indicatif, aucun versement")}
    ${stat("Récompenses remises", list.filter(p=>p.suivi==="Récompense remise").length, "Déclarées par l’administration")}
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
          <td style="display:flex;gap:8px;flex-wrap:wrap">${p.suivi!=="Récompense remise"?`<button class="btn-ghost btn-sm" data-action="mark-remise" data-idx="${PARRAINAGES.indexOf(p)}">Marquer remise</button>`:""}${canAjouterParrainage()?`<button class="btn-ghost btn-sm" data-action="form-open" data-form="parrainage" data-idx="${PARRAINAGES.indexOf(p)}">Modifier</button><button class="btn-ghost btn-sm" data-action="ask-delete" data-what="parrainage" data-idx="${PARRAINAGES.indexOf(p)}">✕</button>`:""}</td>
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
          ${p.suivi!=="Récompense remise"?`<button class="btn-secondary btn-sm" style="flex:1" data-action="mark-remise" data-idx="${PARRAINAGES.indexOf(p)}">Marquer remise</button>`:""}${canAjouterParrainage()?`<button class="btn-ghost btn-sm" data-action="form-open" data-form="parrainage" data-idx="${PARRAINAGES.indexOf(p)}">Modifier</button><button class="btn-ghost btn-sm" data-action="ask-delete" data-what="parrainage" data-idx="${PARRAINAGES.indexOf(p)}">✕</button>`:""}
        </div>
      </div>`).join("")}
  </div>`;
}

// ---------- Équipe & accès ----------

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
  if(m.type==="wizard") return renderWizard();
  if(m.type==="form") return modalForm(m);
  if(m.type==="confirm") return modalConfirm(m);
  if(m.type==="pay") return modalPay(m);
  if(m.type==="mailsend") return modalMailSend(m);
  if(m.type==="chgpwd") return modalChgPwd();
  if(m.type==="profile") return modalProfile(m);
  if(m.type==="matnew") return modalMatNew(m);
  if(m.type==="matlib") return modalMatLib();
  if(m.type==="catedit") return modalCatEdit(m);
  if(m.type==="echedit") return modalEchEdit(m);
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

function knownClients(){
  const seen = {}, out = [];
  DOSSIERS.forEach(d=>{
    const key = (d.client+"|"+(d.telephone||"")).toLowerCase();
    if(seen[key] || d.client==="Marie Laurent") return;
    seen[key] = 1; out.push(d);
  });
  return out;
}
function modalNewDemande(){
  const m = state.modal || {};
  const pf = m.prefillId ? byId(m.prefillId) : null;
  const role = state.role;
  const needTech = role==="sales", needCom = role==="tech";
  const techOpts = activeStaff("tech").map(n=>`<option>${esc(n)}</option>`).join("");
  const comOpts = activeStaff("sales").map(n=>`<option>${esc(n)}</option>`).join("");
  const assign = needTech
    ? `<div class="form-field"><label>Technicien à affecter <span class="req">obligatoire</span></label><select id="fTech"><option value="">— Choisir un technicien —</option>${techOpts}</select><div class="form-help">Vous êtes automatiquement le commercial de ce client.</div></div>`
    : needCom
    ? `<div class="form-field"><label>Commercial à affecter <span class="req">obligatoire</span></label><select id="fCommercial"><option value="">— Choisir un commercial —</option>${comOpts}</select><div class="form-help">Vous êtes automatiquement le technicien de ce client.</div></div>`
    : `<div class="form-field"><label>Technicien</label><select id="fTech"><option value="">À affecter</option>${techOpts}</select></div>
       <div class="form-field"><label>Commercial</label><select id="fCommercial"><option value="">À affecter</option>${comOpts}</select></div>`;
  return modalWrap(pf ? "Nouveau chantier pour "+pf.client : (m.toDiagnostic ? "Créer un diagnostic" : "Créer un client"), `
    ${pf ? `<p class="form-help" style="margin:0 0 12px">Ce dossier est indépendant : il aura son propre diagnostic, devis, factures et suivi de chantier, séparé de ${esc(pf.client)} (${esc(pf.id)}).</p>` : ""}
    <div class="form-field"><label>Client déjà enregistré ? Recherchez-le</label>
      <input type="search" id="fExisting" list="knownClients" placeholder="Tapez un nom ou une ville…" autocomplete="off" value="${pf?esc(pf.client+" · "+pf.ville):""}">
      <datalist id="knownClients">${knownClients().map(d=>`<option value="${esc(d.client)} · ${esc(d.ville)}"></option>`).join("")}</datalist>
      <div class="form-help" id="fExistingNote">Choisissez un client existant pour lui ouvrir un nouveau chantier (dossier séparé, avec son propre suivi devis/factures/chantier), ou saisissez un nouveau client ci-dessous.</div>
    </div>
    <div class="form-field"><label>Nom du client</label><input type="text" id="fName" value="${pf?esc(pf.client):""}"></div>
    <div class="form-field"><label>Téléphone</label><input type="tel" id="fPhone" value="${pf?esc(pf.telephone||""):"06 00 00 00 00"}"></div>
    <div class="form-field"><label>E-mail</label><input type="email" id="fEmail" value="${pf?esc(pf.email||""):""}"></div>
    <div class="form-field"><label>Ville</label><input type="text" id="fVille" value="${pf?esc(pf.ville||""):""}"></div>
    <div class="form-field"><label>Type de bâtiment</label><select id="fType">${["Maison individuelle","Immeuble collectif","Bâtiment professionnel","Dépendance","Autre"].map(o=>`<option ${pf&&pf.typeBatiment===o?"selected":""}>${o}</option>`).join("")}</select></div>
    <div class="form-field"><label>Adresse</label><input type="text" id="fAdresse" value="${pf?esc(pf.adresse||""):"12 rue des Tilleuls"}"></div>
    <div class="form-field"><label>Informations sur le bâtiment</label><textarea id="fInfos">${pf?esc(pf.infosGenerales||""):""}</textarea></div>
    <div class="form-field"><label>Objet de la demande</label><textarea id="fMotif" placeholder="${pf?"Ex. réfection de la toiture du garage…":""}"></textarea></div>
    <div class="form-field"><label>Priorité</label><select id="fPriorite"><option>Normale</option><option>Urgente</option><option>Infiltration signalée</option></select></div>
    ${assign}
    <div class="modal-actions"><button class="btn-primary" data-action="submit-new">${pf?"Créer ce chantier":(m.toDiagnostic?"Créer et démarrer le diagnostic":"Créer le client")}</button><button class="btn-secondary" data-action="modal-close">Annuler</button></div>
  `);
}
function prefillExistingClient(val){
  const d = knownClients().find(x=>(x.client+" · "+x.ville)===val);
  const set = (id, v)=>{ const e = document.getElementById(id); if(e && v!=null) e.value = v; };
  const note = document.getElementById("fExistingNote");
  if(!d){ if(note) note.textContent = "Aucun client correspondant : saisissez un nouveau client ci-dessous."; return; }
  set("fName", d.client); set("fPhone", d.telephone); set("fEmail", d.email); set("fVille", d.ville);
  set("fAdresse", d.adresse); set("fType", d.typeBatiment); set("fInfos", d.infosGenerales);
  if(note) note.textContent = "Fiche préremplie depuis le dossier "+d.id+". Indiquez l’objet de cette nouvelle demande.";
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
    <div class="form-field"><label>Technicien</label><select id="fTech"><option>À affecter</option>${activeStaff("tech").map(o=>`<option ${d.technicien===o?"selected":""}>${o}</option>`).join("")}</select></div>
    <div class="form-field"><label>Commercial</label><select id="fCom"><option>À affecter</option>${activeStaff("sales").map(o=>`<option ${d.commercial===o?"selected":""}>${o}</option>`).join("")}</select></div>
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
  const m = state.modal || {};
  const phase = m.phase || "choose";
  const canShare = !!(m.file && navigator.canShare && navigator.canShare({files:[m.file]}));
  let body;
  if(phase==="prep"){
    body = `<p class="form-help">Préparation du rapport PDF à joindre…</p><p id="sendProgress" style="font-weight:600;margin:10px 0">Page 1…</p><p class="form-help">Cela peut prendre une vingtaine de secondes.</p>`;
  } else if(phase==="ready"){
    body = `
      <p style="margin:0 0 10px">Le PDF est prêt et sera joint automatiquement au message.</p>
      <div class="card" style="white-space:pre-wrap;font-size:12.5px;max-height:220px;overflow:auto;padding:12px">${esc(m.text)}</div>
      <p class="form-help" style="margin-top:10px">${canShare ? "Le choix de l’application (WhatsApp, Mail…) se fait à l’étape suivante ; le PDF et le message sont déjà inclus." : "Sur ordinateur, le PDF est téléchargé et la conversation s’ouvre avec le message prêt : il ne reste qu’à glisser le PDF dedans."}</p>
      <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Annuler</button><button class="btn-primary" data-action="send-now" data-id="${d.id}">${m.channel==="whatsapp" ? "Envoyer sur WhatsApp" : "Envoyer par e-mail"}</button></div>`;
  } else if(phase==="error"){
    body = `<p class="form-help">Le PDF n’a pas pu être généré (connexion internet requise). Réessayez.</p>
      <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Fermer</button></div>`;
  } else {
    body = `
      <p class="form-help" style="margin-bottom:14px">${esc(d.client)} — choisissez comment envoyer le document. Le PDF est joint automatiquement, avec un message personnalisé.</p>
      <button class="modal-list-btn" data-action="send-whatsapp" data-id="${d.id}">WhatsApp — ${esc(d.telephone||"numéro non renseigné")}</button>
      <button class="modal-list-btn" data-action="send-email" data-id="${d.id}">E-mail — ${esc(d.email||"adresse non renseignée")}</button>
      <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Annuler</button></div>`;
  }
  return modalWrap(docModalTitle(m.kind||"report"), body);
}

function modalInfo(msg){
  return modalWrap(msg, `<p style="color:var(--muted);font-size:13px">Fonctionnalité de démonstration : cet écran illustre l’emplacement de l’action dans le parcours, sans persistance au-delà de la session.</p>
    <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Fermer</button></div>`);
}

// ---------- Event handling ----------

if(/[?&]inscription=1/.test(location.search)){
  state.appStage = "signup";
  try{ const q = new URLSearchParams(location.search); state.signup = {nom:q.get("nom")||"", email:q.get("email")||"", tel:"", poste:""}; }catch(e){}
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadCustom();
  ensurePoints();
  render();
  srvBoot().then(()=>{ if(!SRV.on) loadPersisted().then(()=>render()); });
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
      setTimeout(()=>{ state.appStage = (SRV.on && SRV.needsSetup) ? "setup" : "login"; state.splashExiting=false; render(); }, 650);
      return;
    }
    if(action==="setup-submit"){ srvSetupSubmit(); return; }
    if(action==="logout"){ srvLogout(""); return; }
    if(action==="demo-load"){
      askConfirm("Charger les dossiers de démonstration ?", "Des dossiers fictifs seront ajoutés pour tester l’application. Vous pourrez les effacer ensuite (onglet Données).", ()=>{
        seedDossiers().forEach(d=>{ if(!DOSSIERS.some(x=>x.id===d.id)) DOSSIERS.push(d); });
      }, "Charger", "btn-primary");
      return;
    }
    if(action==="do-login"){ enterAs(document.getElementById("loginRole").value); render(); return; }
    if(action==="login-submit"){ doLogin(); return; }
    if(action==="goto-forgot"){ state.appStage="forgot"; state.loginMsg=""; render(); return; }
    if(action==="forgot-submit" && SRV.on){
      const em = (document.getElementById("fgEmail").value||"").trim().toLowerCase();
      if(!/^\S+@\S+\.\S+$/.test(em)){ state.loginMsg = "Indiquez une adresse e-mail valide."; render(); return; }
      state.loginEmail = em;
      srvApi("auth", "POST", {action:"forgot", email:em}).catch(()=>{}).then(()=>{ state.loginMsg = "Demande enregistrée. Si cette adresse correspond à un compte, la direction vous enverra un mot de passe temporaire."; render(); });
      return;
    }
    if(action==="forgot-submit"){
      const em = (document.getElementById("fgEmail").value||"").trim().toLowerCase();
      if(!/^\S+@\S+\.\S+$/.test(em)){ state.loginMsg = "Indiquez une adresse e-mail valide."; render(); return; }
      SETTINGS.resets = (SETTINGS.resets||[]).filter(r=>r.email.toLowerCase()!==em);
      SETTINGS.resets.push({id:"P"+Date.now(), email:em, date:"12 sept., "+new Date().toTimeString().slice(0,5), statut:"à traiter"});
      saveSettings(); state.loginEmail = em;
      state.loginMsg = "Demande enregistrée. Si cette adresse correspond à un compte, la direction vous enverra un mot de passe temporaire.";
      render(); return;
    }
    if(action==="invite-create"){
      const em = (document.getElementById("invEmail").value||"").trim().toLowerCase();
      if(!/^\S+@\S+\.\S+$/.test(em)){ showToast("Indiquez l’e-mail du salarié."); return; }
      const nom = document.getElementById("invNom").value.trim(), role = document.getElementById("invRole").value;
      SETTINGS.invitations = (SETTINGS.invitations||[]).filter(i=>i.email.toLowerCase()!==em);
      const iv = {id:"I"+Date.now(), email:em, nom, role, date:"12 sept.", statut:"envoyée"};
      SETTINGS.invitations.push(iv); saveSettings();
      inviteMail(iv); return;
    }
    if(action==="invite-resend"){ const iv = SETTINGS.invitations.find(i=>i.id===t.dataset.iid); if(iv) inviteMail(iv); return; }
    if(action==="emp-reset"){
      const e = SETTINGS.employees.find(x=>x.id===t.dataset.eid);
      askConfirm("Réinitialiser le mot de passe ?", "Un mot de passe temporaire sera généré pour "+e.nom+" ; il devra en choisir un nouveau à sa prochaine connexion.", async ()=>{
        if(SRV.on){
          try{ const r = await srvApi("settings", "POST", {action:"resetpw", eid:e.id}); await srvLoad(true); openMailSend("reinit_mdp", {nom:e.nom.split(" ")[0], mdp:r.password, lien:siteBase()}, e.email, e.telephone); }
          catch(x){ showToast(x.message); }
          return;
        }
        const tmp = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"[b%54]).join("");
        e.pwdHash = await hashPwd(tmp); e.mustChange = true;
        (SETTINGS.resets||[]).forEach(r=>{ if(r.email.toLowerCase()===e.email.toLowerCase()) r.statut = "traité"; });
        saveSettings();
        openMailSend("reinit_mdp", {nom:e.nom.split(" ")[0], mdp:tmp, lien:siteBase()}, e.email, e.telephone);
      }, "Réinitialiser", "btn-primary");
      return;
    }
    if(action==="chgpwd-save"){
      const a = document.getElementById("npPwd").value, b = document.getElementById("npPwd2").value;
      if(a.length<8){ showToast("Au moins 8 caractères."); return; }
      if(a!==b){ showToast("Les deux mots de passe ne correspondent pas."); return; }
      if(SRV.on){ srvApi("auth", "POST", {action:"changepwd", password:a}).then(()=>{ state.modal = null; render(); showToast("Mot de passe enregistré."); }).catch(e=>showToast(e.message)); return; }
      const u = currentUser(); hashPwd(a).then(h=>{ u.pwdHash = h; u.mustChange = false; saveSettings(); state.modal = null; render(); showToast("Mot de passe enregistré."); });
      return;
    }
    if(action==="mail-preview"){ const tp = t.dataset.tpl; openMailSend(tp, EMAIL_TEMPLATES[tp].sample, "", ""); return; }
    if(action==="mail-send-auto"){ sendMailAuto(); return; }
    if(action==="mail-copy-html"){
      const e = buildEmail(state.modal.tpl, state.modal.vars);
      (navigator.clipboard ? navigator.clipboard.writeText(e.html) : Promise.reject()).then(()=>showToast("HTML copié.")).catch(()=>showToast("Copie impossible : utilisez « Télécharger »."));
      return;
    }
    if(action==="mail-download"){
      const e = buildEmail(state.modal.tpl, state.modal.vars);
      downloadBlob(new Blob([e.html], {type:"text/html"}), state.modal.tpl+".html"); return;
    }
    if(action==="client-invite"){
      const d = byId(t.dataset.id);
      openMailSend("invitation_client", {client:d.client, conseiller:d.commercial||"", lien:siteBase()}, d.email, d.telephone); return;
    }
    if(action==="goto-signup"){ state.appStage="signup"; state.signupMsg=""; render(); return; }
    if(action==="goto-login"){ state.appStage="login"; state.loginMsg=""; render(); return; }
    if(action==="signup-submit"){ doSignup(); return; }
    if(action==="param-tab"){ state.paramTab=t.dataset.tab; render(); return; }
    if(action==="req-accept"){ acceptRequest(t.dataset.rid); return; }
    if(action==="req-refuse"){
      const rid = t.dataset.rid;
      askConfirm("Refuser cette demande ?", "La personne ne pourra pas se connecter. Elle pourra refaire une demande.", ()=>{
        const r = SETTINGS.requests.find(x=>x.id===rid); r.statut = "refusé";
        if(SRV.on) srvApi("settings", "POST", {action:"refuse", rid}).catch(e=>showToast(e.message)); else saveSettings();
        showToast("Demande refusée.");
      }, "Refuser");
      return;
    }
    if(action==="emp-toggle"){
      const e = SETTINGS.employees.find(x=>x.id===t.dataset.eid);
      e.statut = e.statut==="actif" ? "suspendu" : "actif";
      saveSettings(); render(); return;
    }
    if(action==="profile-open"){ state.modal = {type:"profile", eid:t.dataset.eid}; render(); return; }
    if(action==="profile-save"){
      const nom = (document.getElementById("mpNom").value||"").trim();
      const tel = (document.getElementById("mpTel").value||"").trim();
      if(!nom){ showToast("Indiquez votre nom."); return; }
      const finish = ()=>{
        const e = SETTINGS.employees.find(x=>x.id===t.dataset.eid);
        if(e){ e.nom = nom; e.telephone = tel; }
        if(SRV.user && SRV.user.id===t.dataset.eid){ SRV.user.nom = nom; SRV.user.telephone = tel; }
        state.modal = null; render(); showToast("Profil mis à jour.");
      };
      if(SRV.on){ srvApi("settings","POST",{action:"self", nom, telephone:tel}).then(finish).catch(e=>showToast(e.message)); }
      else { finish(); saveSettings(); }
      return;
    }
    if(action==="copy-signup"){
      const inp = document.getElementById("signupLink");
      const done = ()=>showToast("Lien copié.");
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(done).catch(()=>{ inp.select(); showToast("Sélectionnez puis copiez le lien."); });
      else { inp.select(); showToast("Sélectionnez puis copiez le lien."); }
      return;
    }
    if(action==="acces-reset"){
      askConfirm("Rétablir les accès par défaut ?", "Les accès des rôles administrateur, technicien et commercial reviendront aux valeurs d’origine.", ()=>{
        SETTINGS.access = JSON.parse(JSON.stringify(DEFAULT_ACCESS)); saveSettings(); showToast("Accès rétablis.");
      }, "Rétablir");
      return;
    }
    if(action==="company-save"){
      const c = SETTINGS.company;
      ["nom","site","telephone","email","adresse","siret","iban"].forEach(k=>{ c[k] = document.getElementById("co_"+k).value.trim(); });
      c.devisValidite = parseInt(document.getElementById("co_devisValidite").value,10);
      c.acomptePct = parseInt(document.getElementById("co_acomptePct").value,10);
      saveSettings(); showToast("Informations enregistrées."); return;
    }
    if(action==="toggle-sidebar"){ state.sidebarOpen=!state.sidebarOpen; render(); return; }
    if(action==="close-sidebar"){ state.sidebarOpen=false; render(); return; }
    if(action==="nav"){ state.section=t.dataset.section; state.dossierId=null; state.diagStep=1; state.sidebarOpen=false; render(); scrollContentTop(); return; }
    if(action==="open-dossier"){ state.section="dossiers"; state.dossierId=t.dataset.id; state.dossierTab=t.dataset.tab||"info"; state.diagStep=1; render(); scrollContentTop(); return; }
    if(action==="dossier-tab"){ state.dossierTab=t.dataset.tab; state.diagStep=1; render(); scrollContentTop(); return; }
    if(action==="modal-new"){ state.modal={type:"new"}; render(); return; }
    if(action==="modal-new-chantier"){ state.modal={type:"new", prefillId:t.dataset.id}; render(); return; }
    if(action==="modal-new-diag"){ state.modal={type:"new", toDiagnostic:true}; render(); return; }
    if(action==="modal-edit"){ state.modal={type:"edit", id:t.dataset.id}; render(); return; }
    if(action==="modal-affect"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="modal-choose"){ state.modal={type:"choose"}; render(); return; }
    if(action==="modal-info"){ state.modal={type:"info", msg:t.dataset.msg}; render(); return; }
    if(action==="choose-dossier"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="reset-demo"){
      DOSSIERS = seedDossiers();
      state = {appStage:"app",splashExiting:false,role:"directeur",userId:"E1",paramTab:"equipe",loginMsg:"",section:"overview",dossierId:null,dossierTab:"info",diagStep:1,agendaMember:"all",
        calendarView:"day",calendarDate:new Date(TODAY_REF),datePickerOpen:false,pickerViewDate:new Date(TODAY_REF),
        kanbanStage:"À contacter",modal:null,toast:null,sidebarOpen:false};
      render();
      return;
    }
    if(action==="copy-ref"){ showToast("Référence copiée : "+t.dataset.ref); return; }
    if(action==="mark-remise"){
      const pr = PARRAINAGES[parseInt(t.dataset.idx,10)];
      if(pr){ pr.suivi = "Récompense remise"; render(); showToast("Récompense marquée comme remise."); }
      return;
    }
    if(action==="download-pdf"){
      const d = byId(t.dataset.id);
      generateAndDownloadPdf(d);
      return;
    }
    if(action==="modal-send"){ state.modal={type:"send", id:t.dataset.id, kind:"report", phase:"choose"}; render(); return; }
    if(action==="modal-send-doc"){ state.modal={type:"send", id:t.dataset.id, kind:t.dataset.kind, docId:t.dataset.doc, phase:"choose"}; render(); return; }
    if(action==="doc-pdf"){ downloadDocPdf(byId(t.dataset.id), t.dataset.kind, t.dataset.doc); return; }
    if(action==="send-whatsapp"){ prepareSend(byId(t.dataset.id), "whatsapp"); return; }
    if(action==="send-email"){ prepareSend(byId(t.dataset.id), "email"); return; }
    if(action==="send-now"){ sendNow(byId(t.dataset.id)); return; }
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
      const val = id=>{ const e = document.getElementById(id); return e ? e.value : ""; };
      let tech = val("fTech") || null, com = val("fCommercial") || null;
      if(state.role==="tech"){ tech = currentName(); if(!com){ showToast("Affectez un commercial à ce client."); return; } }
      if(state.role==="sales"){ com = currentName(); if(!tech){ showToast("Affectez un technicien à ce client."); return; } }
      const existingPick = document.getElementById("fExisting");
      if(!(existingPick && existingPick.value)){
        const ph = (document.getElementById("fPhone").value||"").replace(/\D/g,""), em = (document.getElementById("fEmail").value||"").trim().toLowerCase();
        const dup = DOSSIERS.find(x=>x.client.toLowerCase()===name.toLowerCase() && ((x.telephone||"").replace(/\D/g,"")===ph || (em && (x.email||"").toLowerCase()===em)));
        if(dup){ showToast("Ce client existe déjà (dossier "+dup.id+"). Ouvrez-le pour ajouter un devis, une facture ou un diagnostic."); return; }
      }
      const nid = "TP-"+(Math.max(1048, ...DOSSIERS.map(x=>parseInt(x.id.slice(3),10)||0))+1);
      const newD = {
        id: nid, client:name, ville: document.getElementById("fVille").value.trim()||"—",
        motif: document.getElementById("fMotif").value.trim()||"Nouvelle demande",
        priorite: document.getElementById("fPriorite").value, statut:"Nouvelle",
        technicien:tech, commercial:com, creePar:{id:state.userId, nom:currentName(), role:state.role},
        telephone: document.getElementById("fPhone").value||"06 00 00 00 00",
        email: document.getElementById("fEmail").value||"client@example.com",
        adresse: document.getElementById("fAdresse").value||"12 rue des Tilleuls",
        typeBatiment: document.getElementById("fType").value,
        infosGenerales: document.getElementById("fInfos").value,
        notes:[], historique:[{date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Dossier créé par "+authorLabel()+(tech||com ? " · affecté à "+[tech,com].filter(Boolean).join(" et ") : "")+"."}],
        commercialStage:"À contacter", montant:0, prochaineRelance:null, compteRendu:"",
        visiteDate:null, visiteHeure:null, diagnostic:freshDiagnostic(),
        devis:[], factures:[], chantier:null, taches:[]
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
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Diagnostic validé, rapport généré."});
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
      d.devis.push({ id:numero, numero, version:d.devis.length+1, statut:"Brouillon", lignes:prev.lignes.map(l=>Object.assign({},l)), dateCreation:"12 sept.", dateEnvoi:null, objet:prev.objet, validite:prev.validite, paiement:prev.paiement?Object.assign({},prev.paiement):undefined });
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
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Devis "+dv.numero+" envoyé au client."});
      showToast("Devis marqué comme envoyé.");
      render();
      return;
    }
    if(action==="devis-accept" || action==="win-devis"){ askWin(byId(t.dataset.id)); return; }
    if(action==="win-invoice"){
      const d = byId(t.dataset.id); const dv = acceptedDevis(d);
      if(dv){ const f = ensureInvoices(d, dv); syncProcess(d); showToast(f ? factureLabel(d,f)+" créée." : "La facture existe déjà."); }
      render(); return;
    }
    if(action==="revert-devis"){
      const d = byId(t.dataset.id);
      askConfirm("Revenir au devis ?", "Le devis repasse en « Envoyé » et la ou les facture(s) créée(s) automatiquement (aucun paiement enregistré dessus) sont retirées. Le chantier préparé n'est pas supprimé.", ()=>{ revertDevis(d); render(); }, "Revenir au devis", "btn-primary");
      return;
    }
    if(action==="create-solde"){
      const d = byId(t.dataset.id); const dv = acceptedDevis(d);
      const idx = dv ? nextEcheancierStep(d, dv) : null;
      if(dv && idx!=null){ const f = createFacture(d, dv, idx); addFactureTask(d, f); syncProcess(d); showToast("Facture « "+f.type+" » créée ("+fmtEuros(f.montantTtcCt)+")."); }
      render(); return;
    }
    if(action==="pay-open"){ state.modal = {type:"pay", id:t.dataset.id, fid:t.dataset.fid}; render(); return; }
    if(action==="pay-save"){
      const d = byId(t.dataset.id); const f = findFacture(d, t.dataset.fid);
      const montant = parseFloat(document.getElementById("payMontant").value);
      if(!montant || montant<=0){ showToast("Indiquez un montant valide."); return; }
      const mode = document.getElementById("payMode").value;
      recordPayment(d, f, Math.round(montant*100), mode, document.getElementById("payDate").value, document.getElementById("payRecu").checked);
      state.modal = null;
      const st = d.commercialStage;
      showToast(st==="Payé" ? "Paiement enregistré : dossier soldé ✓" : (f.statut==="Payée" ? "Facture soldée." : "Paiement enregistré — reste dû "+fmtEuros(Math.max(0,f.montantTtcCt-facturePaidCt(f)))+"."));
      render(); return;
    }
    if(action==="devis-reject"){
      const d = byId(t.dataset.id);
      const dv = latestDevis(d);
      dv.statut = "Refusé";
      d.commercialStage = "Perdu";
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Devis "+dv.numero+" refusé par le client."});
      showToast("Devis marqué comme refusé.");
      render();
      return;
    }
    if(action==="ask-delete"){ askDelete(t.dataset); return; }
    if(action==="data-export"){ exportBackup(); return; }
    if(action==="data-clear"){
      askConfirm("Effacer toutes les données de démonstration ?", "Tous les dossiers, contrats et parrainages seront supprimés de ce navigateur. Exportez une sauvegarde avant si besoin.", ()=>{
        DOSSIERS = []; CONTRACTS.length = 0; PARRAINAGES.length = 0; state.dossierId = null; showToast("Base vierge : vous pouvez créer ou importer vos clients.");
      }, "Tout effacer");
      return;
    }
    if(action==="cat-edit-open"){
      const idx = parseInt(t.dataset.idx,10);
      state.modal = {type:"catedit", kind:t.dataset.kind, idx: idx<0 ? null : idx};
      render(); return;
    }
    if(action==="ech-edit-open"){
      state.modal = {type:"echedit", id:t.dataset.id};
      render(); return;
    }
    if(action==="ech-save"){
      const d = byId(t.dataset.id), dv = latestDevis(d);
      const rows = Array.from(document.querySelectorAll(".wz-ech-row")).map(row=>({
        label: row.querySelector('[data-field="label"]').value.trim() || "Paiement",
        pct: parseInt(row.querySelector('[data-field="pct"]').value,10)||0
      }));
      const sum = rows.reduce((s,r)=>s+r.pct,0);
      if(sum!==100){ showToast("Le total des paiements doit faire 100 % (actuellement "+sum+" %)."); return; }
      dv.paiement = {echeancier: rows, mode: document.getElementById("echMode").value};
      stampHist(d, "Conditions de paiement du devis "+dv.numero+" modifiées.");
      state.modal = null; render();
      showToast("Conditions de paiement enregistrées.");
      return;
    }
    if(action==="catedit-save"){
      const kind = t.dataset.kind, idx = parseInt(t.dataset.idx,10);
      const label = document.getElementById("ceLabel").value.trim();
      if(!label){ showToast("Indiquez une désignation."); return; }
      const achatCt = Math.round((parseFloat(document.getElementById("ceAchat").value)||0)*100);
      const venteCt = Math.round((parseFloat(document.getElementById("ceVente").value)||0)*100);
      const tvaPct = parseFloat(document.getElementById("ceTva").value)||0;
      const unite = document.getElementById("ceUnite").value.trim() || (kind==="cat"?"forfait":"u");
      const list = kind==="cat" ? SERVICE_CATALOG : MATERIEL_CATALOG;
      if(idx<0){
        const code = (kind==="cat"?"CUS-":"CUSM-")+Date.now().toString(36).toUpperCase();
        if(kind==="cat") list.push({code, label, prixAchatCt:achatCt, prixUnitaireCt:venteCt, tvaPct, unite});
        else list.push({code, label, prixAchatCt:achatCt, prixVenteCt:venteCt, tvaPct, unite});
      } else {
        const item = list[idx];
        item.label = label; item.prixAchatCt = achatCt; item.tvaPct = tvaPct; item.unite = unite;
        if(kind==="cat") item.prixUnitaireCt = venteCt; else item.prixVenteCt = venteCt;
      }
      saveCustom(); state.modal = null; render(); showToast("Enregistré."); return;
    }
    if(action==="catedit-del"){
      const kind = t.dataset.kind, idx = parseInt(t.dataset.idx,10);
      const list = kind==="cat" ? SERVICE_CATALOG : MATERIEL_CATALOG;
      const it = list[idx];
      askConfirm(kind==="cat"?"Retirer du catalogue ?":"Retirer ce matériel ?", "« "+it.label+" » ne sera plus proposé dans les devis. Les devis déjà créés ne changent pas.", ()=>{
        list.splice(idx,1); saveCustom(); state.modal = null; render(); showToast("Supprimé.");
      }, "Supprimer", "btn-danger");
      return;
    }
    if(action==="perso-add-pay"){
      const v = document.getElementById("pcNewPay").value.trim();
      if(!v){ showToast("Indiquez le nom du moyen de paiement."); return; }
      if(PAY_MODES.includes(v)){ showToast("Ce moyen existe déjà."); return; }
      PAY_MODES.push(v); saveCustom(); render(); return;
    }
    if(action==="perso-del-pay"){
      const i = parseInt(t.dataset.idx,10);
      if(PAY_MODES.length<2){ showToast("Gardez au moins un moyen de paiement."); return; }
      askConfirm("Retirer ce moyen de paiement ?", "« "+PAY_MODES[i]+" » ne sera plus proposé pour les prochains devis et paiements.", ()=>{ PAY_MODES.splice(i,1); saveCustom(); });
      return;
    }
    if(action==="perso-add-anom"){
      const pi = parseInt(t.dataset.pi,10), p = POINTS[pi];
      const label = document.getElementById("pcaLabel-"+pi).value.trim();
      if(!label){ showToast("Donnez un nom à la réponse."); return; }
      const id = "c_"+Date.now().toString(36);
      ANOMALY_VOCAB[id] = {icon:document.getElementById("pcaIcon-"+pi).value.trim()||"🔧", label, risk:document.getElementById("pcaRisk-"+pi).value.trim()||"un défaut à faire évaluer par un professionnel"};
      const ids = (POINT_ANOMALIES[p] = POINT_ANOMALIES[p] || []);
      const at = ids.indexOf("autre"); if(at>=0) ids.splice(at,0,id); else ids.push(id);
      saveCustom(); showToast("Réponse ajoutée au point « "+p+" »."); render(); return;
    }
    if(action==="perso-del-anom"){
      const p = POINTS[parseInt(t.dataset.pi,10)], aid = t.dataset.aid;
      POINT_ANOMALIES[p] = (POINT_ANOMALIES[p]||[]).filter(x=>x!==aid); saveCustom(); render(); return;
    }
    if(action==="perso-add-point"){
      const v = document.getElementById("pcNewPoint").value.trim();
      if(!v){ showToast("Nommez le nouveau point de contrôle."); return; }
      if(POINTS.includes(v)){ showToast("Ce point existe déjà."); return; }
      POINTS.push(v); POINT_ANOMALIES[v] = ["autre"]; ensurePoints(); saveCustom(); showToast("Point ajouté : il apparaît dans tous les diagnostics."); render(); return;
    }
    if(action==="perso-del-point"){
      const i = parseInt(t.dataset.pi,10), p = POINTS[i];
      if(POINTS.length<2){ showToast("Gardez au moins un point de contrôle."); return; }
      askConfirm("Retirer ce point de contrôle ?", "« "+p+" » disparaît des nouveaux diagnostics ; les diagnostics déjà saisis conservent leurs données.", ()=>{ POINTS.splice(i,1); saveCustom(); });
      return;
    }
    if(action==="mat-new"){ state.modal = {type:"matnew", id:t.dataset.id}; render(); return; }
    if(action==="mat-create"){
      const d = byId(t.dataset.id); d.materiel = d.materiel || [];
      const libId = document.getElementById("mpLib").value;
      const l = (SETTINGS.materielLib||[]).find(x=>x.id===libId);
      const date = document.getElementById("mpDate").value || null;
      const id = "M"+(Math.max(0, ...d.materiel.map(x=>parseInt(String(x.id).slice(1),10)||0))+1);
      d.materiel.push({id, libId:libId||null, label:l?l.label:"Liste personnalisée", date, note:document.getElementById("mpNote").value.trim(), items:(l?l.items:[]).map(x=>({label:x, done:false})), par:authorLabel()});
      stampHist(d, "Liste de matériel « "+(l?l.label:"personnalisée")+" » préparée pour le "+fmtIsoFr(date)+".");
      state.modal = null; state.dossierTab = "materiel"; render(); showToast(date ? "Liste créée — elle apparaît dans l’agenda le "+fmtIsoFr(date)+"." : "Liste créée."); return;
    }
    if(action==="mat-toggle"){ const p = byId(t.dataset.id).materiel.find(x=>x.id===t.dataset.mid); const it = p.items[parseInt(t.dataset.idx,10)]; it.done = !it.done; render(); return; }
    if(action==="mat-del-item"){ const p = byId(t.dataset.id).materiel.find(x=>x.id===t.dataset.mid); p.items.splice(parseInt(t.dataset.idx,10),1); render(); return; }
    if(action==="mat-add-item"){
      const p = byId(t.dataset.id).materiel.find(x=>x.id===t.dataset.mid);
      const inp = document.getElementById("matNew-"+p.id); const v = inp ? inp.value.trim() : "";
      if(!v){ showToast("Tapez le nom de l’outil ou de la fourniture."); return; }
      p.items.push({label:v, done:false}); render(); return;
    }
    if(action==="matlib-open"){ state.matDraft = JSON.parse(JSON.stringify(SETTINGS.materielLib||[])); state.modal = {type:"matlib"}; render(); return; }
    if(action==="matlib-add"){ matLibFlush(); state.matDraft.push({id:"L"+Date.now(), label:"Nouveau type de chantier", items:[]}); render(); return; }
    if(action==="matlib-del"){ matLibFlush(); state.matDraft.splice(parseInt(t.dataset.idx,10),1); render(); return; }
    if(action==="matlib-save"){ matLibFlush(); SETTINGS.materielLib = state.matDraft; state.matDraft = null; saveSettings(); state.modal = null; render(); showToast("Bibliothèque enregistrée."); return; }
    if(action==="dl-page"){ const f = dossierListState(); f.page = Math.max(1, f.page+parseInt(t.dataset.dir,10)); render(); return; }
    if(action==="task-toggle"){
      const d = byId(t.dataset.id);
      const tk = d.taches.find(x=>x.id===t.dataset.tid);
      tk.done = !tk.done;
      if(tk.done) stampHist(d, "Tâche terminée : "+tk.titre);
      render(); return;
    }
    if(action==="form-open"){
      state.modal = {type:"form", form:t.dataset.form, id:t.dataset.id||null, tid:t.dataset.tid||null, nid:t.dataset.nid!=null?parseInt(t.dataset.nid,10):null, idx:t.dataset.idx!=null?parseInt(t.dataset.idx,10):null};
      render(); return;
    }
    if(action==="form-save"){ saveForm(); return; }
    if(action==="wizard-devis"){ wzNew("devis", t.dataset.id||null); return; }
    if(action==="wizard-facture"){ wzNew("facture", t.dataset.id||null); return; }
    if(action==="wz-next"){ wzNext(); return; }
    if(action==="wz-prev"){ wzFlush(); state.wizard.step = Math.max(1, state.wizard.step-1); render(); return; }
    if(action==="wz-create"){ wzCreate(t.dataset.send==="1"); return; }
    if(action==="wz-add-line"){ wzFlush(); state.wizard.data.lignes.push(freshDevisLine()); render(); return; }
    if(action==="wz-open-catalog"){ wzFlush(); state.wizard.showCatalog = true; render(); return; }
    if(action==="wz-close-catalog"){ wzFlush(); state.wizard.showCatalog = false; render(); return; }
    if(action==="wz-remove-line"){ wzFlush(); const ls = state.wizard.data.lignes; ls.splice(parseInt(t.dataset.idx,10),1); if(!ls.length) ls.push(freshDevisLine()); render(); return; }
    if(action==="wz-add-sugg"){
      wzFlush();
      const svc = catalogFind(t.dataset.code);
      if(!svc){ render(); return; }
      const ls = state.wizard.data.lignes;
      const line = catalogLineFrom(svc);
      if(ls.length===1 && !ls[0].designation && !ls[0].prixUnitaireCt) ls[0] = line; else ls.push(line);
      render(); return;
    }
    if(action==="confirm-yes"){ const fn = CONFIRM_RUN; CONFIRM_RUN = null; state.modal = null; if(fn) fn(); render(); return; }
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
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Facture "+f.numero+" envoyée au client."});
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
      recordPayment(d, f, Math.round(montant*100), mode, date, false);
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
      syncProcess(d);
      showToast("Virement confirmé comme encaissé.");
      render();
      return;
    }
    if(action==="chantier-save"){
      const d = byId(t.dataset.id);
      const c = d.chantier;
      c.statut = document.getElementById("chStatut").value;
      c.equipe = Array.from(document.getElementById("chEquipe").selectedOptions).map(o=>o.value);
      c.dateDebut = document.getElementById("chDebut").value || null;
      c.dateFin = document.getElementById("chFin").value || null;
      c.acces = document.getElementById("chAcces").value;
      c.equipement = document.getElementById("chEquipement").value;
      c.consignes = document.getElementById("chConsignes").value;
      let msg = "Chantier mis à jour.";
      const bb = billingOf(d);
      const nextIdx = bb ? nextEcheancierStep(d, bb.dv) : null;
      if(["Terminé","À réceptionner","Clôturé"].includes(c.statut) && bb && bb.count>0 && bb.remaining>1 && nextIdx!=null && hasPermission("invoice.create")){
        const fs = createFacture(d, bb.dv, nextIdx); addFactureTask(d, fs); syncProcess(d);
        msg = "Chantier terminé : facture « "+fs.type+" » de "+fmtEuros(fs.montantTtcCt)+" créée automatiquement.";
      }
      showToast(msg);
      render();
      return;
    }
    if(action==="chantier-toggle-check"){
      const d = byId(t.dataset.id);
      const item = d.chantier.checklist[t.dataset.key][parseInt(t.dataset.idx,10)];
      item.done = !item.done;
      render();
      return;
    }
    if(action==="chantier-remove-photo"){
      const d = byId(t.dataset.id);
      d.chantier.photos[t.dataset.cat].splice(parseInt(t.dataset.idx,10),1);
      render();
      return;
    }
    if(action==="chantier-report-incident"){
      const d = byId(t.dataset.id);
      const desc = document.getElementById("incDescription").value.trim();
      if(!desc){ showToast("Décrivez le problème avant de l'envoyer."); return; }
      const cat = document.getElementById("incCategorie").value;
      d.chantier.incidents.unshift({categorie:cat, description:desc, date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel()});
      d.historique.push({date:"12 sept., "+new Date().toTimeString().slice(0,5), auteur:authorLabel(), texte:"Incident chantier signalé : "+incidentCatLabel(cat)+"."});
      showToast("Incident signalé.");
      render();
      return;
    }
  });

  document.getElementById("app").addEventListener("change", (e)=>{
    savePointFieldsFromDOM();
    saveSynthFieldsFromDOM();
    saveDevisLinesFromDOM();
    if(e.target.dataset && e.target.dataset.pc){ persoChange(e.target); return; }
    if(e.target.id==="importCsv"){ const f = e.target.files[0]; e.target.value = ""; if(f) importCsvFile(f); return; }
    if(e.target.id==="importJson"){ const f = e.target.files[0]; e.target.value = ""; if(f) importBackupFile(f); return; }
    if(e.target.id==="fExisting"){ prefillExistingClient(e.target.value); return; }
    if(e.target.id==="echFois"){
      state.modal.echeancier = defaultEcheancier(parseInt(e.target.value,10));
      render(); return;
    }
    if(e.target.classList && e.target.classList.contains("ech-field")){ echLive(); return; }
    if(e.target.dataset && e.target.dataset.dl){
      const f = dossierListState(); f.page = 1;
      f[e.target.dataset.dl] = e.target.value;
      render(); return;
    }
    if(e.target.dataset && e.target.dataset.wz){
      wzFlush();
      const k = e.target.dataset.wz;
      if(k==="dossier"){
        state.wizard.dossierId = e.target.value || null;
        if(state.wizard.kind==="devis") wzInitDevis(); else wzInitFacture();
        render();
      } else if(e.target.dataset.wzRerender){
        if(state.wizard.kind==="facture" && k==="type") wzFactureDefaults();
        if(state.wizard.kind==="devis" && k==="fois") state.wizard.data.echeancier = defaultEcheancier(state.wizard.data.fois);
        render();
      } else wzUpdateLive();
      return;
    }
    if(e.target.classList && e.target.classList.contains("wz-line")){ wzFlush(); wzUpdateLive(); return; }
    if(e.target.classList && e.target.classList.contains("wz-ech")){ wzFlush(); wzUpdateLive(); return; }
    if(e.target.id==="wzCatalog"){
      wzFlush();
      const svc = catalogFind(e.target.value);
      if(svc){
        const ls = state.wizard.data.lignes;
        const line = catalogLineFrom(svc);
        if(ls.length===1 && !ls[0].designation && !ls[0].prixUnitaireCt) ls[0] = line; else ls.push(line);
      }
      render(); return;
    }
    if(e.target.id==="devisCatalogSel"){
      const code = e.target.value;
      if(code){
        const d = byId(e.target.dataset.id);
        const svc = catalogFind(code);
        if(svc) latestDevis(d).lignes.push(catalogLineFrom(svc));
      }
      render();
    }
    if(e.target.id==="profileSelect"){ enterAs(e.target.value); render(); scrollContentTop(); return; }
    if(e.target.dataset && e.target.dataset.empRole){
      const emp = SETTINGS.employees.find(x=>x.id===e.target.dataset.empRole);
      emp.role = e.target.value; saveSettings(); render();
      showToast(emp.nom+" est maintenant "+ROLES[emp.role].label.toLowerCase()+".");
      return;
    }
    if(e.target.dataset && e.target.dataset.accRole){
      SETTINGS.access[e.target.dataset.accRole][e.target.dataset.accMod] = parseInt(e.target.value,10);
      saveSettings(); render(); return;
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
    if(e.target.id && e.target.id.startsWith("chPhoto-")){
      const files = Array.from(e.target.files || []);
      if(!files.length) return;
      const d = byId(e.target.dataset.id);
      const cat = e.target.dataset.cat;
      const bucket = d.chantier.photos[cat];
      Promise.all(files.slice(0, Math.max(0, 40 - bucket.length)).map(file=>new Promise(resolve=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve({name:file.name, dataUrl:reader.result});
        reader.onerror = ()=>resolve(null);
        reader.readAsDataURL(file);
      }))).then(results=>{
        results.filter(Boolean).forEach(photo=>bucket.push(photo));
        render();
      });
      return;
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
