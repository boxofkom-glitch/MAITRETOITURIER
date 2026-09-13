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

const POINT_OBS = {
  "Couverture et état des tuiles":[
    "Plusieurs tuiles fissurées sont visibles sur le pan contrôlé.",
    "Des tuiles sont déplacées ou glissées par rapport à leur position d’origine.",
    "Une usure diffuse de la couverture est constatée (porosité, tuiles gélives).",
    "Aucune anomalie de couverture n’a été observée sur les zones accessibles.",
    "Une zone de la couverture n’a pas pu être contrôlée (accès limité)."
  ],
  "Éléments de finition et zinguerie":[
    "Le faîtage ou l’arêtier présente des éléments descellés ou désolidarisés du support.",
    "La gouttière est encombrée (feuilles, mousses) et/ou mal inclinée.",
    "Un solin ou une noue présente une dégradation visible du matériau d’étanchéité.",
    "Faîtages, arêtiers, rives, solins et gouttières sont en bon état apparent.",
    "Une partie de la zinguerie n’a pas pu être contrôlée (accès limité)."
  ],
  "Étanchéité":[
    "Des traces d’humidité ponctuelles sont visibles au droit d’un point singulier.",
    "La membrane ou le raccord d’étanchéité présente un défaut localisé (déchirure, décollement).",
    "Plusieurs zones d’étanchéité présentent des signes de vieillissement avancé.",
    "Aucune trace d’infiltration ni de défaut d’étanchéité visible sur les zones accessibles.",
    "Une zone d’étanchéité n’a pas pu être contrôlée (accès limité)."
  ],
  "Charpente":[
    "Une trace d’humidité ou de développement fongique est visible sur une pièce de charpente.",
    "Un élément de charpente (chevron, panne) présente une fissure ou un fléchissement localisé.",
    "Des traces d’attaque de xylophages sont visibles sur plusieurs éléments.",
    "Aucune trace d’humidité, de fissure ou d’attaque de xylophages sur les éléments accessibles.",
    "Une partie de la charpente n’a pas pu être contrôlée (accès limité)."
  ],
  "Isolation et ventilation":[
    "L’isolant en place est tassé ou d’épaisseur insuffisante au regard des standards actuels.",
    "La ventilation des combles apparaît insuffisante (entrées/sorties d’air obstruées ou absentes).",
    "L’isolant présente des zones dégradées par une humidité constatée.",
    "L’isolation et la ventilation des combles sont en bon état et conformes à l’usage constaté.",
    "Une partie des combles n’a pas pu être contrôlée (accès limité)."
  ],
  "Humidité et infiltrations":[
    "Des traces d’humidité sont visibles en sous-face de toiture ou en plafond.",
    "Une infiltration active est constatée avec une origine identifiée sur une zone précise.",
    "Des traces d’humidité anciennes sont visibles mais aucune infiltration active n’est constatée ce jour.",
    "Aucune trace d’humidité ni d’infiltration constatée sur les zones accessibles.",
    "Une zone n’a pas pu être contrôlée pour confirmer l’absence d’humidité (accès limité)."
  ],
  "État général et sécurité":[
    "Certaines zones n’ont pas pu être contrôlées dans des conditions de sécurité suffisantes.",
    "Un élément instable présentant un risque de chute a été identifié sur la toiture.",
    "Les équipements de sécurité (garde-corps, ligne de vie, crochets) sont absents ou non conformes.",
    "L’état général de la toiture ne présente pas de risque de sécurité identifié.",
    "Une zone n’a pas pu être contrôlée pour d’autres raisons d’accès."
  ],
  "Entretien, mousses et lichens":[
    "Des mousses et lichens sont présents de façon localisée, sans encrassement généralisé.",
    "L’ensemble de la couverture présente un encrassement généralisé (mousses, lichens, dépôts).",
    "La couverture commence à devenir poreuse et absorbe l’humidité.",
    "Aucun encrassement notable, la couverture ne présente pas de besoin d’entretien particulier.",
    "Une zone n’a pas pu être contrôlée pour confirmer l’état d’entretien (accès limité)."
  ]
};

const POINT_CAUSES = {
  "Couverture et état des tuiles":[
    "Le désordre est localisé et ne concerne qu’un nombre limité de tuiles.",
    "Le vent a probablement déplacé les éléments non solidement fixés.",
    "L’ancienneté de la couverture explique l’usure généralisée constatée.",
    "Le contrôle visuel indique un bon état général de la couverture.",
    "L’accès restreint ne permet pas de confirmer l’état de la zone concernée."
  ],
  "Éléments de finition et zinguerie":[
    "Le faîtage présente des éléments descellés, sans désordre affectant l’ensemble de la ligne.",
    "La gouttière évacue mal les eaux pluviales du fait de l’encombrement ou du défaut de pente.",
    "Le solin ou la noue est dégradé au niveau du point singulier concerné.",
    "Aucun désordre ni encombrement notable n’a été constaté sur les éléments de finition.",
    "L’accès restreint ne permet pas de confirmer l’état de la zinguerie sur cette zone."
  ],
  "Étanchéité":[
    "L’origine exacte du passage d’eau n’est pas encore confirmée à ce stade.",
    "La membrane ou le raccord présente un défaut identifié sur une zone localisée.",
    "Le vieillissement avancé de l’étanchéité est incompatible avec une réparation ponctuelle durable.",
    "Le contrôle visuel n’a révélé aucun défaut d’étanchéité sur les zones accessibles.",
    "L’accès restreint ne permet pas de confirmer l’état de l’étanchéité sur cette zone."
  ],
  "Charpente":[
    "Aucun affaiblissement structurel n’est constaté à ce stade malgré la trace observée.",
    "Le désordre est localisé et n’affecte pas l’ensemble de la structure.",
    "Les traces d’attaque de xylophages indiquent une dégradation active du bois.",
    "Le contrôle visuel indique un bon état général de la charpente accessible.",
    "L’accès restreint ne permet pas de confirmer l’état de la charpente sur cette zone."
  ],
  "Isolation et ventilation":[
    "L’épaisseur d’isolant réduit la performance thermique de la toiture.",
    "Les entrées et sorties d’air ne permettent pas un renouvellement suffisant dans les combles.",
    "L’humidité constatée a dégradé localement la performance de l’isolant.",
    "Le contrôle visuel indique une isolation et une ventilation conformes à l’usage.",
    "L’accès restreint ne permet pas de confirmer l’état de l’isolation sur cette zone."
  ],
  "Humidité et infiltrations":[
    "La source exacte de l’humidité n’est pas encore confirmée à ce stade.",
    "L’origine de l’infiltration active a été identifiée sur un point singulier ou une zone de couverture.",
    "La cause initiale de la trace ancienne semble avoir été traitée, sans récidive constatée.",
    "Le contrôle visuel n’a révélé aucune trace d’humidité sur les zones accessibles.",
    "L’accès restreint ne permet pas de confirmer l’état de la zone concernée."
  ],
  "État général et sécurité":[
    "L’accès, la pente ou la hauteur ne permettaient pas un contrôle sécurisé de la zone.",
    "L’élément identifié (tuile, faîtage, antenne) n’est plus correctement fixé.",
    "Les équipements de sécurité en place ne sont plus aux standards actuels.",
    "Le contrôle visuel n’a révélé aucun risque de sécurité sur les zones accessibles.",
    "L’accès restreint ne permet pas de confirmer l’état de la zone concernée."
  ],
  "Entretien, mousses et lichens":[
    "L’encrassement reste localisé, sans désordre généralisé de la couverture.",
    "L’encrassement généralisé nécessite un entretien complet de la couverture.",
    "La porosité de la couverture augmente avec l’âge du matériau et l’absence de traitement hydrofuge.",
    "Le contrôle visuel indique une couverture propre et sans besoin d’entretien particulier.",
    "L’accès restreint ne permet pas de confirmer l’état d’entretien sur cette zone."
  ]
};

const POINT_SOLUTIONS = {
  "Couverture et état des tuiles":[
    "Remplacer les tuiles fissurées identifiées et contrôler les liteaux sous la zone.",
    "Repositionner et fixer les tuiles déplacées, vérifier les crochets de fixation.",
    "Prévoir une réfection complète de la couverture sur la zone concernée.",
    "Aucun travaux nécessaire à ce jour, entretien courant à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté (nacelle, ligne de vie)."
  ],
  "Éléments de finition et zinguerie":[
    "Resceller les éléments de faîtage/arêtier concernés et contrôler la ventilation sous faîtage.",
    "Nettoyer la gouttière et les descentes, reprendre la pente et les crochets de fixation.",
    "Remplacer le solin/la noue sur la zone concernée et reprendre l’étanchéité au raccordement.",
    "Aucun travaux nécessaire à ce jour, entretien courant (nettoyage des gouttières) à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ],
  "Étanchéité":[
    "Contrôler l’étanchéité au droit de la zone identifiée avant de chiffrer une réparation définitive.",
    "Reprendre ou remplacer la membrane/le raccord sur la zone concernée.",
    "Prévoir la reprise complète de l’étanchéité sur les zones concernées.",
    "Aucun travaux nécessaire à ce jour, contrôle périodique à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ],
  "Charpente":[
    "Prévoir un contrôle complémentaire (sondage) avant de définir un traitement ou un remplacement.",
    "Renforcer ou remplacer l’élément concerné par un professionnel qualifié.",
    "Traiter la charpente et remplacer les éléments trop dégradés, par une entreprise spécialisée.",
    "Aucun travaux nécessaire à ce jour, entretien courant à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ],
  "Isolation et ventilation":[
    "Prévoir un complément ou un remplacement de l’isolation des combles.",
    "Rétablir une ventilation continue des combles (chatières, grilles en égout de toiture).",
    "Remplacer l’isolant dégradé après traitement de la source d’humidité identifiée.",
    "Aucun travaux nécessaire à ce jour, entretien courant à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ],
  "Humidité et infiltrations":[
    "Compléter les observations par un contrôle ciblé avant de définir la réparation adaptée.",
    "Traiter en urgence le point d’entrée d’eau identifié et contrôler l’absence de dégâts associés.",
    "Surveiller l’évolution de la zone lors des prochaines pluies ; aucune intervention urgente à ce stade.",
    "Aucun travaux nécessaire à ce jour, contrôle périodique à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ],
  "État général et sécurité":[
    "Prévoir un contrôle complémentaire avec un équipement adapté (nacelle, ligne de vie).",
    "Sécuriser ou déposer en urgence l’élément instable identifié.",
    "Prévoir la mise en conformité des équipements de sécurité avant toute intervention future.",
    "Aucun travaux nécessaire à ce jour.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ],
  "Entretien, mousses et lichens":[
    "Un nettoyage ciblé peut être envisagé à titre préventif ; aucune intervention urgente à ce stade.",
    "Nettoyer complètement la couverture (démoussage) et appliquer un traitement hydrofuge.",
    "Appliquer un traitement hydrofuge pour limiter l’absorption d’eau et prolonger la durée de vie de la couverture.",
    "Aucun travaux nécessaire à ce jour, entretien courant à poursuivre.",
    "Prévoir un contrôle complémentaire avec accès adapté pour la zone non contrôlée."
  ]
};

const POINT_RISKS = {
  "Couverture et état des tuiles":[
    "Une tuile fissurée non traitée laisse progressivement passer l’eau vers la charpente et les combles.",
    "Une tuile mal positionnée peut se détacher lors d’un prochain épisode de vent fort, avec un risque de chute.",
    "Une couverture usée perd son étanchéité de façon diffuse, rendant les réparations ponctuelles inefficaces dans la durée.",
    "Aucun risque identifié à ce jour, sous réserve du maintien d’un entretien courant.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "Éléments de finition et zinguerie":[
    "Un faîtage désolidarisé laisse l’eau s’infiltrer en pied de charpente lors de pluies battantes.",
    "Une gouttière obstruée provoque des débordements pouvant s’infiltrer sous la couverture ou en façade.",
    "Une dégradation au niveau d’un point singulier entraîne des infiltrations rapides et ciblées.",
    "Aucun risque identifié à ce jour, sous réserve d’un entretien courant des gouttières.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "Étanchéité":[
    "Sans identification précise de l’origine, l’humidité peut endommager silencieusement les matériaux environnants.",
    "Un défaut d’étanchéité localisé s’aggrave avec les intempéries et finit par générer une infiltration continue.",
    "Une étanchéité en fin de vie expose à des infiltrations multiples et imprévisibles.",
    "Aucun risque identifié à ce jour, sous réserve d’un contrôle périodique des points singuliers.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "Charpente":[
    "Une humidité persistante favorise le développement de champignons lignivores qui fragilisent le bois.",
    "Un élément fragilisé reporte les charges sur les éléments voisins et le désordre peut s’étendre.",
    "Une attaque de xylophages non traitée continue de se propager aux pièces de bois saines avoisinantes.",
    "Aucun risque identifié à ce jour ; une bonne ventilation des combles permettra de préserver cet état.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "Isolation et ventilation":[
    "Une isolation insuffisante entraîne des déperditions de chaleur et peut favoriser la condensation en sous-face.",
    "Un comble mal ventilé accumule l’humidité ambiante et favorise la dégradation de la charpente.",
    "Un isolant humide perd sa performance thermique et peut devenir un foyer de moisissures.",
    "Aucun risque identifié à ce jour.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "Humidité et infiltrations":[
    "Sans identification de la source, l’humidité peut endommager silencieusement l’isolant, la charpente ou les plafonds.",
    "Une infiltration active non traitée s’aggrave à chaque épisode pluvieux et peut causer des dégâts des eaux visibles.",
    "Une trace ancienne peut réapparaître si la cause initiale n’a pas été totalement traitée.",
    "Aucun risque identifié à ce jour.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "État général et sécurité":[
    "Les zones non contrôlées peuvent dissimuler des désordres non détectés lors de cette visite.",
    "Un élément instable en hauteur représente un risque immédiat de chute pouvant blesser des personnes ou endommager des biens.",
    "L’absence d’équipement de sécurité conforme rend plus risquée toute intervention future en toiture.",
    "Aucun risque identifié à ce jour.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ],
  "Entretien, mousses et lichens":[
    "Les mousses retiennent l’humidité au contact des tuiles et accélèrent le vieillissement du matériau.",
    "Un encrassement généralisé maintient une humidité permanente qui augmente le risque d’infiltration diffuse.",
    "Une couverture poreuse non traitée absorbe davantage d’eau à chaque pluie et accélère son vieillissement.",
    "Aucun risque identifié à ce jour.",
    "Une zone non contrôlée peut dissimuler un désordre non détecté lors de cette visite."
  ]
};

const CHOICE_FIELDS = {
  obs:{target:"observation", options:POINT_OBS, label:"Observation"},
  cause:{target:"pourquoi", options:POINT_CAUSES, label:"Pourquoi ce choix ?"},
  sol:{target:"travaux", options:POINT_SOLUTIONS, label:"Travaux proposés"},
  risk:{target:"risque", options:POINT_RISKS, label:"Risques associés"}
};
const CHOICE_SELECT_IDS = {selObs:"obs", selCause:"cause", selSol:"sol", selRisk:"risk"};

function freshPoint(){
  return { etat:"Non contrôlé", observation:"", decision:"Contrôle complémentaire", pourquoi:"", travaux:"", risque:"", photos:[] };
}
function savePointFieldsFromDOM(){
  const etatEl = document.getElementById("ptEtat");
  if(!etatEl || !state.dossierId) return;
  const d = byId(state.dossierId);
  if(!d) return;
  const pointName = POINTS[state.diagStep-1];
  if(!pointName) return;
  const p = d.diagnostic.points[pointName];
  p.etat = etatEl.value;
  p.decision = document.getElementById("ptDecision").value;
  Object.keys(CHOICE_FIELDS).forEach(fieldKey=>{
    const customEl = document.getElementById("custom-"+fieldKey);
    if(customEl) p[CHOICE_FIELDS[fieldKey].target] = customEl.value;
  });
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
    risque:"Une tuile fissurée non traitée laisse progressivement passer l’eau vers la charpente et les combles, avec un risque d’infiltration qui s’aggrave à chaque épisode de pluie ou de gel.",
    photos:[{name:"photo-1.jpg"},{name:"photo-2.jpg"}]
  };
  d.points["Étanchéité"] = {
    etat:"Défaut constaté",
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
  if(etat==="Défaut constaté") return badge("Défaut constaté","red");
  if(etat==="À surveiller") return badge("À surveiller","gold");
  if(etat==="Bon état") return badge("Bon état apparent","green");
  if(etat==="Non accessible") return badge("Non accessible","gray");
  return badge("Non contrôlé","gray");
}
function etatAccentCls(etat){
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
    clipboard:`<rect x="5" y="4.5" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8.5" y="3" width="7" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="10.5" x2="16" y2="10.5" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="17.5" x2="13" y2="17.5" stroke="currentColor" stroke-width="1.3"/>`
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">${inner[name]||""}</svg>`;
}

function logoMark(size){
  size = size||36;
  return `<div style="width:${size}px;height:${size}px;border-radius:${Math.round(size*.28)}px;background:linear-gradient(155deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;flex-shrink:0">
    <svg viewBox="0 0 64 64" fill="none" width="${Math.round(size*.6)}" height="${Math.round(size*.6)}"><path d="M10 34 L32 14 L54 34" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 31 V50 H47 V31" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
    <path d="M40 340 L400 80 L760 340" stroke="#e8bf69" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M140 300 V400 H660 V300" stroke="#e8bf69" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
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
  app.innerHTML = buildApp();
  repaginatePoints();
  numberPdfPages();
  applyPdfScale();
}

function numberPdfPages(){
  const nums = document.querySelectorAll(".pdf-page-num");
  if(!nums.length) return;
  nums.forEach((el,i)=>{ el.textContent = `Page ${i+1} / ${nums.length}`; });
}

function repaginatePoints(){
  const flow = document.querySelector(".pdf-points-flow");
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
  <div class="sidebar-backdrop ${state.sidebarOpen?"open":""}" data-action="close-sidebar"></div>
  <div class="sidebar ${state.sidebarOpen?"open":""}">
    <button class="sidebar-close" data-action="close-sidebar">✕</button>
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

const CHOICE_SELECT_ID = {obs:"selObs", cause:"selCause", sol:"selSol", risk:"selRisk"};

function renderChoiceGroup(fieldKey, pointName, p, d, step){
  const cfg = CHOICE_FIELDS[fieldKey];
  const options = cfg.options[pointName] || [];
  const current = p[cfg.target];
  const matchIdx = options.indexOf(current);
  const isCustom = !!(p.customFlags && p.customFlags[fieldKey]) || (current !== "" && matchIdx === -1);
  const groupClass = fieldKey==="risk" ? "risk-group" : "form-field";
  return `
  <div class="${groupClass}">
    <label>${fieldKey==="risk"?"⚠ ":""}${cfg.label} — ${esc(pointName)}</label>
    <select id="${CHOICE_SELECT_ID[fieldKey]}">
      <option value="">— Sélectionner —</option>
      ${options.map((opt,i)=>`<option value="${i}" ${matchIdx===i?"selected":""}>${esc(opt)}</option>`).join("")}
      <option value="custom" ${isCustom?"selected":""}>Autre (préciser)…</option>
    </select>
    ${isCustom?`<textarea id="custom-${fieldKey}" placeholder="Précisez…" style="margin-top:8px">${esc(current)}</textarea>`:""}
  </div>`;
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
  <div class="card">
    <div class="point-title">${esc(pointName)}</div>
    <div class="point-sub">Choisissez dans les menus déroulants, aucune saisie n’est obligatoire.</div>
    <div class="form-field"><label>État — ${esc(pointName)}</label>
      <select id="ptEtat">
        ${["Non contrôlé","Bon état","À surveiller","Défaut constaté","Non accessible"].map(o=>`<option ${p.etat===o?"selected":""}>${o}</option>`).join("")}
      </select>
    </div>
    ${renderChoiceGroup("obs", pointName, p, d, step)}
    <div style="font-weight:600;font-size:13px;margin:16px 0 10px">Le choix à expliquer au client</div>
    <div class="form-field"><label>Décision proposée — ${esc(pointName)}</label>
      <select id="ptDecision">
        ${["Conserver","Surveiller","Réparer","Remplacer","Contrôle complémentaire"].map(o=>`<option ${p.decision===o?"selected":""}>${o}</option>`).join("")}
      </select>
    </div>
    ${renderChoiceGroup("cause", pointName, p, d, step)}
    ${renderChoiceGroup("sol", pointName, p, d, step)}
    <div class="form-help">La justification doit correspondre aux constats. Un défaut localisé ne justifie pas automatiquement une rénovation complète.</div>

    ${renderChoiceGroup("risk", pointName, p, d, step)}

    <div style="font-weight:600;font-size:13px;margin:18px 0 10px">Photos de ce point</div>
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
  return `
  <div class="pdf-point ${etatAccentCls(pt.etat)}">
    <div class="pdf-point-head">
      <div class="pdf-point-head-left">
        <div class="pdf-point-num">${i+1}</div>
        <div class="pdf-point-title">${esc(p)}</div>
      </div>
      ${etatPill(pt.etat)}
    </div>
    <div class="pdf-point-body">
      <div class="pdf-point-photo">${photo?`<img src="${photo.dataUrl}" alt="">`:`<div class="pdf-point-photo-ph">${iconSvg("house",24)}<span>Photo à ajouter</span></div>`}</div>
      <div class="pdf-point-text">
        <h5>Observation</h5><p>${pt.observation?esc(pt.observation):"Non renseignée."}</p>
        <h5>Décision</h5><p>${esc(pt.decision)}${pt.pourquoi?" — "+esc(pt.pourquoi):""}</p>
        <h5>Travaux proposés</h5><p>${pt.travaux?esc(pt.travaux):"Aucun à ce stade."}</p>
      </div>
    </div>
    ${pt.risque?`<div class="pdf-risk"><b>${iconSvg("warning",14)} Risques</b><span>${esc(pt.risque)}</span></div>`:""}
  </div>`;
}

function renderReportDoc(d){
  const s = d.diagnostic.synthese;
  const controlledPoints = POINTS.filter(p=>d.diagnostic.points[p].etat!=="Non contrôlé");
  const flaggedPoints = POINTS.filter(p=>["Défaut constaté","À surveiller"].includes(d.diagnostic.points[p].etat));
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

    if(action==="modal-overlay"){ if(e.target===t){ state.modal=null; render(); } return; }
    if(action==="modal-close"){ state.modal=null; render(); return; }
    if(action==="toggle-sidebar"){ state.sidebarOpen=!state.sidebarOpen; render(); return; }
    if(action==="close-sidebar"){ state.sidebarOpen=false; render(); return; }
    if(action==="nav"){ state.section=t.dataset.section; state.dossierId=null; state.diagStep=1; state.sidebarOpen=false; render(); return; }
    if(action==="open-dossier"){ state.section="dossiers"; state.dossierId=t.dataset.id; state.dossierTab=t.dataset.tab||"info"; state.diagStep=1; render(); return; }
    if(action==="dossier-tab"){ state.dossierTab=t.dataset.tab; state.diagStep=1; render(); return; }
    if(action==="modal-new"){ state.modal={type:"new"}; render(); return; }
    if(action==="modal-new-diag"){ state.modal={type:"new", toDiagnostic:true}; render(); return; }
    if(action==="modal-edit"){ state.modal={type:"edit", id:t.dataset.id}; render(); return; }
    if(action==="modal-affect"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="modal-choose"){ state.modal={type:"choose"}; render(); return; }
    if(action==="modal-info"){ state.modal={type:"info", msg:t.dataset.msg}; render(); return; }
    if(action==="choose-dossier"){ state.modal={type:"affect", id:t.dataset.id}; render(); return; }
    if(action==="reset-demo"){
      DOSSIERS = seedDossiers();
      state = {role:"admin",section:"overview",dossierId:null,dossierTab:"info",diagStep:1,agendaMember:"all",
        calendarView:"day",calendarDate:new Date(TODAY_REF),datePickerOpen:false,pickerViewDate:new Date(TODAY_REF),
        kanbanStage:"À contacter",modal:null,toast:null,sidebarOpen:false};
      render();
      return;
    }
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
    if(action==="diag-step"){ state.diagStep = parseInt(t.dataset.step,10); render(); return; }
    if(action==="diag-save-point" || action==="diag-next"){
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
    savePointFieldsFromDOM();
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
    if(CHOICE_SELECT_IDS[e.target.id]){
      const fieldKey = CHOICE_SELECT_IDS[e.target.id];
      const cfg = CHOICE_FIELDS[fieldKey];
      const d = byId(state.dossierId);
      const pointName = POINTS[state.diagStep-1];
      const p = d.diagnostic.points[pointName];
      const val = e.target.value;
      p.customFlags = p.customFlags || {};
      if(val==="custom"){
        p.customFlags[fieldKey] = true;
        if(!(p[cfg.target] && cfg.options[pointName].indexOf(p[cfg.target])===-1)) p[cfg.target] = "";
      } else {
        p.customFlags[fieldKey] = false;
        p[cfg.target] = val==="" ? "" : cfg.options[pointName][parseInt(val,10)];
      }
      render();
      if(val==="custom") document.getElementById("custom-"+fieldKey)?.focus();
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
