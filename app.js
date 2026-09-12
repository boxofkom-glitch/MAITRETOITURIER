/* ToitPilot / Maître Toiturier — CRM demo clone. Static, in-memory, no backend. */

const POINTS = [
  "Couverture et état des tuiles",
  "Faîtages, arêtiers et rives",
  "Zinguerie, solins, noues et gouttières",
  "Étanchéité",
  "Charpente",
  "Isolation",
  "Ventilation",
  "Humidité et infiltrations",
  "État général et sécurité",
  "Encrassement, mousses et lichens",
  "Besoin de nettoyage ou d’hydrofuge"
];

const CONSERVER_JUSTIF = "Le contrôle visuel renseigné indique un bon état. Aucun remplacement n’est justifié par les constats de cette visite, sous réserve des limites d’accès.";
const CONSERVER_OBJECTIF = "préserver les éléments en état de service et éviter des travaux sans justification constatée.";

function freshPoint(){
  return { etat:"Non contrôlé", observation:"", decision:"Contrôle complémentaire", pourquoi:"", travaux:"", photos:0 };
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
    observation:"Exemple fictif : trois éléments de couverture fissurés sont signalés sur une zone localisée.",
    decision:"Réparer",
    pourquoi:"Le désordre décrit est localisé. Une reprise ciblée est proposée ; aucun constat documenté ne justifie une rénovation complète de la couverture.",
    travaux:"Remplacer les éléments fissurés identifiés et contrôler les raccords de la zone concernée.",
    photos:2
  };
  d.points["Étanchéité"] = {
    etat:"Défaut constaté",
    observation:"Exemple fictif : raccord d’étanchéité à vérifier au droit d’une pénétration.",
    decision:"Contrôle complémentaire",
    pourquoi:"L’origine exacte du passage d’eau doit être confirmée avant de définir la réparation.",
    travaux:"Contrôler le raccord accessible et compléter les observations avant chiffrage.",
    photos:1
  };
  POINTS.forEach(p=>{
    if(p==="Couverture et état des tuiles"||p==="Étanchéité") return;
    d.points[p] = { etat:"Bon état", observation:"", decision:"Conserver", pourquoi:CONSERVER_JUSTIF, travaux:"", photos:0 };
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
    d.points[p] = { etat:"Bon état", observation:"", decision:"Conserver", pourquoi:CONSERVER_JUSTIF, travaux:"", photos:0 };
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
    diagnostic:freshDiagnostic()
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

const ROLES = {
  admin:{ label:"Administration", avatar:"AD" },
  tech:{ label:"Technicien · Julien", avatar:"JB" },
  sales:{ label:"Commerciale · Sarah", avatar:"SD" },
  client:{ label:"Cliente · Marie", avatar:"ML" }
};

const NAV = {
  admin:[["overview","Vue d’ensemble"],["dossiers","Dossiers clients"],["agenda","Agenda d’équipe"],["entretiens","Entretiens"],["diagnostics","Diagnostics"],["commercial","Suivi commercial"],["parrainages","Parrainages"],["equipe","Équipe & accès"],["connexions","Connexions"],["client-preview","Aperçu espace client"]],
  tech:[["overview","Vue d’ensemble"],["dossiers","Dossiers clients"],["agenda","Agenda d’équipe"],["entretiens","Entretiens"],["diagnostics","Diagnostics"]],
  sales:[["overview","Vue d’ensemble"],["dossiers","Dossiers clients"],["agenda","Agenda d’équipe"],["entretiens","Entretiens"],["commercial","Suivi commercial"],["parrainages","Parrainages"]],
  client:[["client","Mon espace client"]]
};

const WEEK_DAYS = [
  {label:"Lun.", num:7}, {label:"Mar.", num:8}, {label:"Mer.", num:9}, {label:"Jeu.", num:10},
  {label:"Ven.", num:11}, {label:"Sam.", num:12}, {label:"Dim.", num:13}
];

let DOSSIERS = seedDossiers();

let state = {
  role:"admin",
  section:"overview",
  dossierId:null,
  dossierTab:"info",
  diagStep:1,
  agendaMember:"all",
  modal:null,
  toast:null
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

function canCreateDemande(){ return state.role==="admin" || state.role==="tech"; }
function canPlanifierVisite(){ return state.role==="admin"; }
function canNouveauContrat(){ return state.role==="admin"; }
function canAjouterParrainage(){ return state.role==="admin" || state.role==="sales"; }
function canEditDossier(){ return state.role==="admin"; }
function canAffecter(){ return state.role==="admin"; }
function diagEditable(){ return state.role==="admin" || state.role==="tech"; }

function stat(label, value, sub){
  return `<div class="stat-card"><div class="stat-value">${esc(value)}</div><div class="stat-label">${esc(label)}</div><div class="stat-sub">${esc(sub)}</div></div>`;
}
function badge(text, cls){ return `<span class="badge ${cls}">${esc(text)}</span>`; }

function showToast(msg){
  state.toast = msg;
  render();
  setTimeout(()=>{ state.toast=null; render(); }, 2600);
}

// ---------- render root ----------

function render(){
  const app = document.getElementById("app");
  app.innerHTML = buildApp();
}

function buildApp(){
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
  <div class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 64 64" fill="none"><path d="M10 34 L32 14 L54 34" stroke="#e8bf69" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 31 V50 H47 V31" stroke="#e8bf69" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
      <div class="ws">Votre espace de travail</div>
      <div class="date">${esc(dateStr)}</div>
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
    admin:["Le contrôle, à chaque étape.","Les demandes, les visites et les prochaines actions de l’équipe."],
    tech:["Votre journée sur le terrain.","Les demandes, les visites et les prochaines actions de l’équipe."],
    sales:["Vos prochaines affaires.","Les demandes, les visites et les prochaines actions de l’équipe."]
  };
  const [h1,sub] = titles[state.role] || titles.admin;
  const traiterTitle = state.role==="tech" ? "Mes dossiers à diagnostiquer" : "Demandes à traiter";
  const traiterList = state.role==="tech" ? list.filter(d=>d.statut!=="Rapport prêt") : nouvelles;

  return `
  <div class="page-header">
    <div><h1>${esc(h1)}</h1><p>${esc(sub)}</p></div>
    ${canCreateDemande() ? `<button class="btn-primary" data-action="modal-new">+ Nouvelle demande</button>` : ""}
  </div>
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
  </div>`;
}

// ---------- Dossier detail ----------

function tabsForRole(){
  if(state.role==="tech") return [["info","Dossier & historique"],["diagnostic","Diagnostic terrain"],["rapport","Rapport PDF"]];
  return [["info","Dossier & historique"],["diagnostic","Diagnostic terrain"],["rapport","Rapport PDF"],["commercial","Suivi commercial"]];
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
        <div><div class="row-title">Diagnostic du ${esc(d.visiteDate)}</div><div class="row-sub">Version 1 · ${esc(d.technicien)} · ${Object.values(d.diagnostic.points).reduce((s,p)=>s+p.photos,0)} photo(s)</div></div>
        <div style="display:flex;align-items:center;gap:10px">
          ${badge(d.diagnostic.rapportPartage?"Partagé (démo)":"Interne", d.diagnostic.rapportPartage?"green":"gray")}
          <button class="btn-ghost" data-action="dossier-tab" data-tab="rapport">Télécharger</button>
        </div>
      </div>` : `<div class="empty-note">0 rapport(s) conservé(s). Les rapports validés et leurs photos seront conservés ici au fil des visites.</div>`}
  </div>
  `;
}

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
      <div class="form-field" style="margin-top:14px"><label>Observations générales</label><textarea id="synObs" placeholder="Résumé et limites de l’inspection…">${esc(s.observations)}</textarea></div>
      <div class="form-field"><label>Préconisations de travaux</label><textarea id="synPreco" placeholder="Travaux recommandés par le technicien…">${esc(s.preconisations)}</textarea></div>
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
  return `
  <div class="diag-progress">POINT ${step} SUR ${POINTS.length} · ${controlled} / ${POINTS.length} contrôlés</div>
  ${stepsNav}
  <div class="diag-layout">
    <div class="card">
      <div class="point-title">${esc(pointName)}</div>
      <div class="point-sub">Renseignez uniquement ce qui a pu être observé. Précisez les zones non accessibles.</div>
      <div class="form-field"><label>État — ${esc(pointName)}</label>
        <select id="ptEtat">
          ${["Non contrôlé","Bon état","À surveiller","Défaut constaté","Non accessible"].map(o=>`<option ${p.etat===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </div>
      <div class="form-field"><label>Observation — ${esc(pointName)}</label><textarea id="ptObs" placeholder="Localisation, anomalie visible, étendue et réserves…">${esc(p.observation)}</textarea></div>
      <div style="font-weight:600;font-size:13px;margin:16px 0 10px">Le choix à expliquer au client</div>
      <div class="form-field"><label>Décision proposée — ${esc(pointName)}</label>
        <select id="ptDecision">
          ${["Conserver","Surveiller","Réparer","Remplacer","Contrôle complémentaire"].map(o=>`<option ${p.decision===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </div>
      <div class="form-field"><label>Pourquoi ce choix ? — ${esc(pointName)}</label><textarea id="ptPourquoi" placeholder="Ce point n’a pas pu être contrôlé complètement. Aucune conclusion de bon état ou de remplacement ne peut être établie.">${esc(p.pourquoi)}</textarea></div>
      <div class="form-field"><label>Travaux proposés — ${esc(pointName)}</label><textarea id="ptTravaux" placeholder="Réparation ciblée, remplacement et périmètre, ou entretien conseillé…">${esc(p.travaux)}</textarea></div>
      <div class="form-help">La justification doit correspondre aux constats. Un défaut localisé ne justifie pas automatiquement une rénovation complète.</div>
      <div class="form-help" style="margin-top:6px">${p.photos} photo(s) rattachée(s) à ce point de contrôle.</div>
      <div class="modal-actions">
        <button class="btn-secondary" data-action="diag-save-point" data-id="${d.id}" data-step="${step}">Enregistrer le brouillon</button>
        <button class="btn-primary" data-action="diag-next" data-id="${d.id}" data-step="${step}">Suivant →</button>
      </div>
    </div>
    <div class="diag-side">
      <div class="card">
        <h3 style="margin:0 0 10px;font-size:14.5px">Photos de ce contrôle</h3>
        <div class="row-sub" style="margin-bottom:10px">0 / 24</div>
        <div class="form-field"><label>Rattacher les prochaines photos à</label><select disabled>${POINTS.map(n=>`<option>${n}</option>`).join("")}</select></div>
        <button class="btn-secondary btn-sm" disabled style="width:100%;margin-bottom:8px">Ajouter depuis la galerie</button>
        <div class="form-help" style="margin-bottom:10px">JPG, PNG, WebP · 10 Mo par photo · 24 par visite</div>
        <button class="btn-secondary btn-sm" disabled style="width:100%">Prendre une photo</button>
      </div>
      <div class="card">
        <h3 style="margin:0 0 10px;font-size:14.5px">Assistance photo par IA</h3>
        <span class="badge gray">Non connectée</span>
        <p style="font-size:12.5px;color:var(--muted);margin-top:10px">Dans la version connectée, l’IA pourra proposer des anomalies et des observations à partir des photos. Chaque suggestion devra être modifiée ou validée par le technicien.</p>
        <p style="font-size:12.5px;color:var(--muted)">Cette démo ne transmet aucune photo à un service d’IA.</p>
      </div>
    </div>
  </div>`;
}

function renderReportDoc(d){
  const s = d.diagnostic.synthese;
  return `
  <div class="report-doc">
    <div style="color:var(--gold);font-weight:700;font-size:13px;margin-bottom:14px">⌂ Maître Toiturier</div>
    <div class="rd-sub">Maître Toiturier · Démonstration</div>
    <h2>RAPPORT DE DIAGNOSTIC</h2>
    <div class="rd-sub">${esc(d.id)} · ${esc(d.visiteDate)}</div>
    <div style="font-weight:700;margin-top:10px">${esc(d.client)}</div>
    <div class="rd-sub">${esc(d.adresse)}, ${esc(d.ville)}</div>
    <div class="rd-sub">Visite : ${esc(d.visiteDate)} · Technicien : ${esc(d.technicien)}</div>
    <div class="rd-sub">Couverture : ${esc(s.typeCouverture)} · Surface estimée : ${esc(s.surface)} m²</div>

    <div class="rd-section"><h4>Conclusion</h4><div>${esc(s.conclusion)}</div></div>

    <div class="rd-section"><h4>Points de contrôle</h4>
      ${POINTS.map(p=>{
        const pt = d.diagnostic.points[p];
        return `<div class="rd-point"><span>${esc(p)}</span><span>${esc(pt.etat)}</span></div>${pt.observation?`<div class="rd-quote">« ${esc(pt.observation)} »</div>`:""}`;
      }).join("")}
    </div>

    <div class="rd-section"><h4>Observations</h4><div class="rd-quote">« ${esc(s.observations)} »</div></div>
    <div class="rd-section"><h4>Préconisations</h4><div class="rd-quote">« ${esc(s.preconisations)} »</div></div>

    <div class="rd-section"><h4>Les choix expliqués</h4>
      ${POINTS.map(p=>{
        const pt = d.diagnostic.points[p];
        return `<div class="rd-choice">
          <div class="rc-head">${esc(p)} — ${esc(pt.decision)}</div>
          <div class="rd-quote">« ${esc(pt.pourquoi)} »</div>
          ${pt.travaux?`<div style="font-size:12.5px">Travaux proposés : ${esc(pt.travaux)}</div>`:""}
          <div style="font-size:12.5px;color:var(--muted)">Objectif : ${pt.decision==="Conserver"?CONSERVER_OBJECTIF:"traiter les constats identifiés dans l’intérêt du client."}</div>
        </div>`;
      }).join("")}
    </div>

    <div class="rd-section"><h4>Photos de l’inspection</h4>
      <div class="rd-quote">« Visuel illustratif · Illustration issue du site de Maître Toiturier. Ce visuel ne représente pas les constats fictifs du dossier. »</div>
    </div>

    <div class="rd-footer">Document de démonstration. Contrôle visuel des zones accessibles, selon les observations renseignées par le technicien. Ce rapport n’est pas une certification.</div>
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
    <div style="display:flex;gap:10px">
      <button class="btn-secondary btn-sm" data-action="download-pdf" data-id="${d.id}">Télécharger le PDF</button>
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

// ---------- Agenda ----------

function agendaEventsForDay(dayNum){
  const events = [];
  visibleDossiers().forEach(d=>{
    if(d.visiteDate && d.visiteDate.startsWith(String(dayNum)+" ")){
      events.push({time:d.visiteHeure, label:"Visite", client:d.client, membre:d.technicien, ville:d.ville, id:d.id});
    }
    if(d.prochaineRelance && d.prochaineRelance.startsWith(String(dayNum)+" ")){
      events.push({time:null, label:"Relance commerciale", client:d.client, membre:d.commercial, ville:d.ville, id:d.id});
    }
  });
  if(state.agendaMember!=="all"){
    return events.filter(e=>e.membre===state.agendaMember);
  }
  return events;
}

function renderAgenda(){
  const members = ["Toute l’équipe","Julien Bernard","Léa Petit","Sarah Durand","Lucas Robert"];
  return `
  <div class="page-header">
    <div><h1>Agenda d’équipe</h1><p>Visites terrain et échéances commerciales, reliées aux dossiers.</p></div>
    ${canPlanifierVisite() ? `<button class="btn-primary" data-action="modal-choose">+ Planifier une visite</button>` : ""}
  </div>
  <div class="agenda-topbar">
    <button class="btn-ghost" disabled>← Semaine</button>
    <span class="week-label">7 sept. — 13 sept.</span>
    <button class="btn-ghost" disabled>Semaine →</button>
    <button class="btn-secondary btn-sm" disabled>Aujourd’hui</button>
    <select id="agendaMemberSelect" style="margin-left:auto">
      ${members.map(m=>`<option value="${m==="Toute l’équipe"?"all":m}" ${state.agendaMember===(m==="Toute l’équipe"?"all":m)?"selected":""}>${m}</option>`).join("")}
    </select>
  </div>
  <div class="agenda-grid">
    ${WEEK_DAYS.map(day=>{
      const evs = agendaEventsForDay(day.num);
      return `<div class="agenda-day">
        <h5>${day.label} <b>${day.num}</b></h5>
        ${evs.length===0 ? `<div class="agenda-empty">Aucun événement</div>` : evs.map(e=>`
          <div class="agenda-event" data-action="open-dossier" data-id="${e.id}">
            ${e.time?`<div class="ev-time">${esc(e.time)} · ${esc(e.label)}</div>`:`<div class="ev-time">${esc(e.label)}</div>`}
            <div>${esc(e.client)}</div>
            <div class="row-sub">${esc(e.membre)} · ${esc(e.ville)}</div>
          </div>`).join("")}
      </div>`;
    }).join("")}
  </div>`;
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
  <p class="form-help">Suivi de démonstration : ces fiches ne constituent pas des contrats signés. La visite d’entretien est une échéance à planifier avec un technicien.</p>
  `;
}

// ---------- Diagnostics list ----------

function renderDiagnosticsList(){
  const list = visibleDossiers();
  return `
  <div class="page-header"><div><h1>Diagnostics de toiture</h1><p>Vos contrôles terrain, photos et rapports PDF.</p></div></div>
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
  </div>`;
}

// ---------- Suivi commercial (kanban) ----------

function renderCommercialKanban(){
  const list = visibleDossiers();
  const stages = ["À contacter","Devis à préparer","Devis envoyé","Gagné","Perdu"];
  const actives = list.filter(d=>d.commercialStage!=="Perdu");
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
        ${items.length===0 ? `<div class="agenda-empty">Aucun dossier à cette étape.</div>` : items.map(d=>`
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
  return "";
}

function modalWrap(title, bodyHtml){
  return `<div class="modal-overlay" data-action="modal-overlay">
    <div class="modal" onclick="event.stopPropagation()">
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

function modalInfo(msg){
  return modalWrap(msg, `<p style="color:var(--muted);font-size:13px">Fonctionnalité de démonstration : cet écran illustre l’emplacement de l’action dans le parcours, sans persistance au-delà de la session.</p>
    <div class="modal-actions"><button class="btn-secondary" data-action="modal-close">Fermer</button></div>`);
}

// ---------- Event handling ----------

document.addEventListener("DOMContentLoaded", ()=>{
  render();

  document.getElementById("app").addEventListener("click", (e)=>{
    const t = e.target.closest("[data-action]");
    if(!t) return;
    const action = t.dataset.action;

    if(action==="modal-overlay"){ state.modal=null; render(); return; }
    if(action==="modal-close"){ state.modal=null; render(); return; }
    if(action==="nav"){ state.section=t.dataset.section; state.dossierId=null; state.diagStep=1; render(); return; }
    if(action==="open-dossier"){ state.section="dossiers"; state.dossierId=t.dataset.id; state.dossierTab=t.dataset.tab||"info"; state.diagStep=1; render(); return; }
    if(action==="dossier-tab"){ state.dossierTab=t.dataset.tab; state.diagStep=1; render(); return; }
    if(action==="modal-new"){ state.modal={type:"new"}; render(); return; }
    if(action==="modal-edit"){ state.modal={type:"edit", id:t.dataset.id}; render(); return; }
    if(action==="modal-affect"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="modal-choose"){ state.modal={type:"choose"}; render(); return; }
    if(action==="modal-info"){ state.modal={type:"info", msg:t.dataset.msg}; render(); return; }
    if(action==="choose-dossier"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="reset-demo"){ DOSSIERS = seedDossiers(); state={role:"admin",section:"overview",dossierId:null,dossierTab:"info",diagStep:1,agendaMember:"all",modal:null,toast:null}; render(); return; }
    if(action==="copy-ref"){ showToast("Référence copiée : "+t.dataset.ref); return; }
    if(action==="mark-remise"){ showToast("Récompense marquée comme remise (démo)."); return; }
    if(action==="download-pdf"){ showToast("Le PDF serait téléchargé dans la version connectée."); return; }
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
      state.modal=null; render();
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
    if(action==="diag-step"){ state.diagStep = parseInt(t.dataset.step,10); render(); return; }
    if(action==="diag-save-point" || action==="diag-next"){
      const d = byId(t.dataset.id);
      const pointName = POINTS[parseInt(t.dataset.step,10)-1];
      const p = d.diagnostic.points[pointName];
      p.etat = document.getElementById("ptEtat").value;
      p.observation = document.getElementById("ptObs").value;
      p.decision = document.getElementById("ptDecision").value;
      p.pourquoi = document.getElementById("ptPourquoi").value;
      p.travaux = document.getElementById("ptTravaux").value;
      if(action==="diag-next") state.diagStep = Math.min(POINTS.length+1, parseInt(t.dataset.step,10)+1);
      render();
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
      d.diagnostic.synthese.observations = document.getElementById("synObs").value;
      d.diagnostic.synthese.preconisations = document.getElementById("synPreco").value;
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
  });

  document.getElementById("app").addEventListener("change", (e)=>{
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
  });
});
