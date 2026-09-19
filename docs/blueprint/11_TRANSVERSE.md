# PARTIE 11 — Transverse : scénarios, charge humaine, tailles d'entreprise, registres, méthode (sections 76–190 restantes)

## 1. Compromis « experts » sur les grandes décisions (76)
| Décision | Marketing / commercial | CRO / UX | Terrain / secrétariat | Data / architecture | Compromis retenu |
|---|---|---|---|---|---|
| Champs du formulaire lead | plus d'infos = meilleurs RDV | chaque champ baisse la conversion | récupérable au téléphone | distinguer « maintenant » / « plus tard » | 5 champs + qualification par téléphone |
| Photos au lead | utiles | friction | pas toujours possible | stockage | proposées après par SMS, facultatives |
| Statuts saisis vs calculés | les commerciaux veulent la main | moins de saisie | – | cohérence | statuts **calculés**, saisie limitée aux motifs |
| Offline complet | – | fiabilité terrain | indispensable sur toiture | complexité de synchro | offline **lecture + file d'écriture**, fusion par type |
| IA visuelle | argument de vente | risque de perte de confiance | jamais un verdict | coûts/erreurs | classement et rappels seulement |
| Personnalisation | « tout configurable » | support impossible | – | dette | standard / configurable / personnalisable (143) |

## 2. Simulation de 20 scénarios (171) — parcours · données · automatisations · exceptions
| # | Scénario | Parcours clé | Données | Automatisation | Exception traitée |
|---|---|---|---|---|---|
| 1 | Lead Meta standard | lead→appel→RDV | lead, attribution | SLA, accusé | doublon |
| 2 | Lead organique | formulaire site→appel | lead, source site | idem | faux numéro |
| 3 | Appel entrant | écran d'appel→fiche | contact | résumé (V2) | inconnu/connu |
| 4 | Porte-à-porte | 3 taps terrain→lead | lead, secteur, QR | rappel | hors ligne |
| 5 | Ancien client | rapprochement→RDV | contact existant | alerte historique | impayé ancien |
| 6 | Urgence | « ça coule » | urgence opérationnelle | SLA 5 min | astreinte, consigne sécurité |
| 7 | Entretien | arbre entretien→visite | roof, contrat | rappel | déménagement |
| 8 | Diagnostic sans anomalie | rapport « tout va bien » | constats OK | pas de devis, entretien | – |
| 9 | Une anomalie | constat→devis simple | anomalie | relances | refus |
| 10 | Plusieurs travaux | anomalies multiples→devis structuré | lignes liées | options | priorisation |
| 11 | Devis refusé | motif→perdu | motif | anomalie « refusée_client » | réactivation |
| 12 | Devis accepté | signature→acompte→chantier | signature | chantier auto | acompte manquant |
| 13 | Modification demandée | nouvelle version | version | relance | prix figés |
| 14 | Chantier normal | mission→journal→clôture | log, photos | facture | – |
| 15 | Chantier avec imprévu | problème→avenant | change_order | notif bureau | client refuse |
| 16 | Mauvaise météo | alerte→report | météo | replanification proposée | client indisponible |
| 17 | SAV | ticket lié | ticket | garantie calculée | hors garantie |
| 18 | Paiement en retard | relances | impayé | séquence | litige |
| 19 | Plusieurs propriétés | contact→propriétés | property_contact | – | syndic |
| 20 | Multi-agences | zones/managers | agency | reporting agence | transfert de dossier |

## 3. Charge humaine par rôle (172) — objectifs de friction (86)
| Rôle | Volume/jour | Aujourd'hui (estimation) | Cible | Levier |
|---|---|---|---|---|
| Secrétaire | 50 leads/appels | ~6 clics + 2 écrans par appel, 2-3 min | ≤ 3 clics, 1 écran, < 90 s | écran d'appel, recherche unique, créneaux proposés |
| Commercial | 8 dossiers + 12 actions | 25 min/jour de préparation | < 8 min | dossier prêt, brouillons |
| Technicien | 4 diagnostics | 30 min de rapport/visite au bureau | 0 | rapport auto |
| Poseur | 1 chantier | 6 saisies, appels bureau | 5 boutons | fiche chantier + journal auto |
| Dirigeant | 1 ouverture | 20 min pour savoir « où on en est » | < 30 s | cockpit d'exceptions |
Chaque workflow est comptabilisé (clics, écrans, champs, décisions, textes, changements d'app, attentes, validations) puis divisé par 2 ; jamais au détriment de la sécurité, de la compréhension, du contrôle et de la qualité métier.
**Time to value (87)** : client « j'ai besoin d'aide » → réponse utile < 15 min ; secrétaire lead→RDV < 5 min ; technicien arrivée→diagnostic exploitable < 60 min ; commercial opportunité→devis prêt < 10 min ; poseur arrivée→« je sais quoi faire » < 1 min ; dirigeant ouverture→attention < 30 s.

## 4. Tailles d'entreprise (173)
| | 5 personnes | 20 personnes | 100 personnes |
|---|---|---|---|
| Rôles | dirigeant cumule ; 1 secrétaire ; 1 commercial ; 2 techniciens | secrétariat 2-3, 3-5 commerciaux, équipes | agences, managers, équipes, permissions par contexte |
| Interface | tout accessible, peu de navigation | rôles distincts, action center | rôles + périmètres (agence/équipe) |
| Configuration | défauts | catalogue, seuils | modèles, workflows agréés, reporting agence |
Le **cœur reste identique** ; seule change la profondeur de permission et de reporting.

## 5. Continuité d'activité (160) et coûts (161–162)
| Panne | Comportement dégradé |
|---|---|
| Cloud/base indisponible | PWA en lecture locale + file d'écriture ; page d'état ; RTO ≤ 4 h |
| Stockage médias | photos gardées localement, envoi différé |
| Fournisseur SMS | e-mail + tâche d'appel |
| Meta | file de rejeu + import CSV |
| IA | saisie manuelle intacte |
| Cartes | adresses en clair + appel |
Coût par entreprise : suivi mensuel DB/stockage/photos/e-mails/SMS/cartes/IA/supervision/support ; marge brute cible ≥ 75 % par plan ; alerte quand une entreprise dépasse son quota.

## 6. Permissions par contexte (135) — rôle × entreprise × agence × équipe × dossier × action
Le technicien voit le téléphone client **de sa mission**, pas l'export de la base ; le poseur ne voit pas les prix ; le commercial voit son portefeuille ; la compta voit factures/paiements ; le Super Admin n'accède aux données d'une entreprise que par procédure tracée. **Audit (136)** : prix, remise, suppression, facture, paiement, permissions, export, devis signé modifié, statut clé : QUI/QUOI/QUAND/AVANT/APRÈS.

## 7. Data moat, benchmarks, passeport de toiture (168–170)
- **Data moat** : modèles de workflow, temps moyens, frictions, catalogues, patterns **anonymisés uniquement si contrat/consentement**. Les données clients ne sont jamais librement exploitables.
- **Benchmarks (169)** : opt-in, cohorte minimale (≥ 10), agrégats non identifiables — **V3+**.
- **Digital Roof Passport (170)** : **VISION** ; nécessite validation juridique (propriété des données, transfert lors de la vente, consentement, responsabilité, exactitude) et de marché avant tout développement.

## 8. UX transversale (85, 88, 89, 130–134, 151–156)
- **Contextual UI** : le produit sait *qui, où, quoi, urgent, ensuite* ; le technicien de 08:55 ne voit ni facturation ni analytics.
- **Next best action** : chaque rôle a un accueil d'actions **avec la raison** (règles lisibles).
- **Fatigue de notifications** : URGENT (interrompt) · À FAIRE (Action Center) · INFORMATION (badge) · SILENCIEUX (journal) ; regroupement, heures calmes.
- **Erreurs** : dire *ce qui s'est passé · ce qui est sauvegardé · quoi faire*.
- **Conception pour l'interruption** : auto-save, brouillons, reprise exacte.
- **États vides utiles** : « Aucun devis à relancer aujourd'hui » ; « Un chantier sera créé automatiquement à l'acceptation d'un devis ».
- **Progressive disclosure**, **clavier d'abord** (recherche `/`, raccourcis, barre de commandes ⌘K : « Créer client », « Ajouter RDV », « Voir leads non traités »), **une main sur mobile**, **budget de performance** (ouverture < 2 s, navigation instantanée, photos en arrière-plan, squelettes, UI optimiste quand sûr).
- **Analyse au niveau du clic** (85) : chaque écran clé documente : premier regard, CTA, préremplissage, obligatoires/facultatifs/conditionnels, ce qu'on **ne demande pas**, après validation, erreur, retour arrière, sauvegarde auto, clavier, version iPhone — modèle appliqué aux fiches des étapes 3, 4, 5, 6, 9, 10.

## 9. Qualité et méthode (146–150, 174–186)
- **Feature flags** ; **observabilité business** (0 lead Meta soudain, échec e-mails, erreurs d'upload) ; **tests par persona** (secrétaire pressée, technicien avec gants, commercial en voiture, gérant sur PC, client de 65 ans, mobile, mauvaise connexion, nouvel employé) ; **test du lundi matin** (qui forme-t-on, qu'est-ce qui casse, comportement inattendu, retour arrière).
- **Anti-usine-à-gaz** : valeur utilisateur/business, fréquence, complexité tech/UX, maintenance, risque ; faible valeur + forte complexité ⇒ reporter/supprimer.
- **Priorisation explicable** (186) : IMPACT UTILISATEUR · IMPACT BUSINESS · FRÉQUENCE · CONFIANCE · EFFORT · RISQUE, chaque facteur écrit — ex. *Relances de devis* : impact business haut (CA récupéré), fréquence quotidienne, confiance haute (pratique connue), effort moyen, risque faible ⇒ **priorité n°1** ; *Agent vocal* : impact incertain, confiance faible, risque haut ⇒ reporté.
- **Definition of Ready (178)** : objectif, persona, workflow, permissions, données, cas critiques, critères d'acceptation. **Definition of Done (179)** : UX finalisée, mobile si nécessaire, permissions, analytics, états erreur/chargement/vide, tests, logs, doc, monitoring, accessibilité raisonnable, sécurité, critères validés.
- **Validation avant code (177)** : problème · workflow · wireframe · données · edge cases · métriques validés. **Recherche utilisateur (176)** : observer 5 secrétaires, accompagner 5 techniciens, observer 20 créations de devis, suivre 10 chantiers, interviewer 10 dirigeants.

## 10. Registre de décisions (174) — complément aux D1–D7
| # | Décision | Pourquoi | Alternatives | Validation |
|---|---|---|---|---|
| D8 | Pipeline 7 étapes visibles, statuts calculés | simplicité, cohérence | 12 étapes | pilote 2 entreprises |
| D9 | PWA avant natif | un code, déploiement rapide | natif dès le début | test hors ligne iOS/Android |
| D10 | Relances proposées, envoyées par l'humain | confiance, ton | envoi 100 % automatique | taux de réponse |
| D11 | Anomalie = objet à statut calculé (4 groupes visibles) | traçabilité constat→résolution | texte libre | usage sur 50 diagnostics |
| D12 | Satisfaction neutre pour tous avant tout avis | loyauté, plateformes | filtrage des avis négatifs (refusé) | conformité |
| D13 | IA en gateway unique + validation humaine | coûts/qualité | appels directs partout | taux de corrections |
| D14 | Un fournisseur par catégorie derrière une interface | dépendance maîtrisée | intégrations en dur | – |
| D15 | Standard/configurable/personnalisable | support tenable | sur-mesure par client | – |

## 11. Registre d'hypothèses (175) — complément à H1–H9
H10 le devis par lien est ouvert sans compte · H11 les poseurs utilisent « Signaler un problème » plutôt que WhatsApp · H12 la marge réelle est saisie de façon fiable (heures + achats) · H13 les clients répondent à une question de satisfaction en 2 taps · H14 les règles d'échéance d'entretien sont acceptées par les clients · H15 15 dossiers hors ligne suffisent en tournée · H16 le rapport web est préféré au PDF par les clients · H17 les dirigeants acceptent un cockpit d'exceptions comme page d'accueil. **Chacune** : prototype → entretiens → bêta → analytics avant investissement.

## 12. Objectif d'expérience final (187–189)
Client : « ils savent où en est mon dossier, je n'ai rien à répéter ». Secrétaire : « le logiciel me dit quoi faire ». Technicien : « j'ouvre l'app et je fais mon intervention ». Commercial : « le dossier arrive prêt ». Poseur : « je sais où aller et quoi faire ». Gérant : « je sais ce qui se passe sans appeler ». Maître Toiturier : **capturé une fois · structuré · transmis · réutilisé · mesuré**. **Question permanente** (189) appliquée à chaque étape : pourquoi cette action ? supprimer ? préremplir ? automatiser ? simple validation ? le client doit-il intervenir ? l'information existe-t-elle ? qui l'utilisera ? que si elle est fausse ? hors connexion ? intégration en panne ? mesure du succès ? volume × 10 ?
La technologie doit disparaître derrière le métier : on ne remplace jamais un processus simple par une procédure logicielle plus lourde.

## 13. Vision vs MVP (185)
MVP : CRM de base, leads+SLA, diagnostic structuré, rapport, devis+relances, Gagné→chantier→facture→paiement, journal chantier, cockpit d'exceptions. V1 : signature, SMS/e-mails automatisés, marge réelle, avenants, portail client, PWA offline robuste (**probablement critique tôt selon validation terrain**), QR/parrainage, SAV, entretien. V2 : Meta/téléphonie/attribution marge, IA en brouillons validés, carte/tournées. V3 : multi-agences, franchise, API/marketplace, benchmarks. VISION : agent IA autonome complet, Digital Roof Passport transférable.

## 14. Questions bloquantes consolidées (pour vous)
1. Pays/juridiction (France seule au départ ?) et statut juridique visé (signature électronique, facturation électronique). 2. Horaires, astreinte urgences, qui rappelle un lead. 3. Meta Lead Ads ou landing page déjà en place ? 4. Numéros dédiés par source dès la V1 ? 5. Échelle de sévérité et arbre de qualification/diagnostic à valider avec 3 couvreurs. 6. Catalogue réel de prestations, coûts d'achat et règles de marge. 7. Règles d'entretien (échéances par toiture/matériau). 8. Choix des fournisseurs (auth, e-mail/SMS, signature, paiement, cartes, IA). 9. Entreprises pilotes (3) et leurs tailles. 10. Budget serveur/IA et calendrier.
