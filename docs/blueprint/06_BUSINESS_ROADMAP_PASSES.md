# PARTIE 6 — Business, onboarding, moat, idées, MVP, roadmap, simulations, passes (sections 34 à 48 + passes)

## 34 — Pricing du SaaS
**Métrique de valeur** : le SaaS crée de la valeur via les **chantiers signés et suivis** et les **équipes qui l'utilisent**. Par utilisateur pénalise l'adoption terrain (on veut tous les poseurs dedans) ; par volume pénalise la croissance.
**Recommandation : hybride simple** = abonnement **par entreprise** (socle) + **sièges « bureau » payants** (dirigeant, secrétaire, commercial) + **sièges « terrain » gratuits ou très bas** (technicien, poseur : l'adoption terrain est le vrai moat) + **usage** pour ce qui coûte réellement (SMS, IA/transcription, stockage au-delà d'un quota).
Plans indicatifs (à valider par entretiens de prix, pas arbitraires) : *Essentiel* (CRM + diagnostic + devis/factures, 1 agence), *Pro* (+ chantiers, planning, relances, attribution manuelle, automatisations), *Croissance* (+ IA, intégrations Meta/téléphonie, multi-utilisateurs avancé, API), *Réseau* (multi-agences, franchises, sur devis).
Ancrage : le prix se compare à **un seul chantier supplémentaire signé par mois** grâce aux relances/vitesse. Essai 14 jours avec données de démonstration ; migration assistée en option payante ; engagement annuel avec remise.

## 35 — Onboarding entreprise (valeur en < 1 journée)
Objectif : **premier devis envoyé en < 30 minutes**, première semaine = premier lead traité.
Étapes : (1) création compte + entreprise (nom, logo, couleurs → génère PDF de marque) → (2) **import** des clients (CSV/Excel, mapping automatique, doublons, aperçu, rollback) → (3) inviter l'équipe (liens d'invitation, rôle proposé) `[EXISTE partiel]` → (4) **catalogue prêt à l'emploi** de prestations de couverture, à ajuster (prix, unités) → (5) horaires/zones/agenda → (6) connecter e-mail/téléphone/Meta (optionnel, guidé) → (7) **assistant « premier diagnostic »** sur un faux client, puis premier devis réel. Indicateurs : temps jusqu'au premier devis, % d'onboardings terminés, activation à J+7.
**Import/migration** : CSV/Excel, anciens CRM et logiciels de devis ; mapping proposé automatiquement ; détection de doublons ; validation ligne à ligne ; import transactionnel avec **annulation** (rollback) ; journal des rejets.

## 36 — Growth (vendre le SaaS)
Canaux : démonstrations vidéo courtes de la boucle *diagnostic → devis en 10 minutes*, cas chiffrés (relances → chantiers signés), partenariats (fournisseurs de matériaux, assureurs, groupements de couvreurs, experts-comptables BTP), contenu métier, salons, parrainage entre entreprises, **outil gratuit de génération de rapport** comme porte d'entrée. Boucle produit : chaque rapport/devis envoyé porte la marque de l'entreprise + mention discrète du logiciel (viralité vers clients finaux, syndics, artisans voisins).

## 37 — Moat (pourquoi rester dans 5 ans)
1. **Historique et mémoire technique** : carnets de santé de toitures (irremplaçables, coût de sortie élevé).
2. **Boucle marge/attribution** : données de rentabilité par source et chantier propres à l'entreprise.
3. **Workflow terrain** adopté par les poseurs (habitudes, offline).
4. **Catalogue et automatisations** personnalisés (investissement de configuration).
5. **Intégrations** profondes (téléphonie, Meta, compta).
6. **Expertise métier encodée** (arbres de diagnostic, checklists, modèles de rapport) qui s'améliore avec les retours.
7. **Effet réseau léger** : parrainages inter-entreprises, benchmarks **anonymisés et consentis**.
Non-moat : « nous avons de l'IA » ; elle est un multiplicateur, pas un avantage.

## 38 — Cas limites (comportement défini)
| Cas | Comportement |
|---|---|
| Lead dupliqué | rapprochement (tél/e-mail/adresse) → proposition de fusion, lead conservé dans la timeline |
| Mauvais téléphone | validation format ; SMS échoué → tâche « vérifier le numéro » |
| Client annule | RDV libéré, motif, proposition de recontact ; annulation tardive comptée |
| Commercial absent / technicien malade | réaffectation proposée avec message client |
| Pluie/vent | alerte, report proposé, décision humaine |
| Chantier retardé / matériel manquant | statut *Bloqué* + cause ; prévenir client ; replanifier |
| Périmètre modifié / travaux supplémentaires | avenant obligatoire avant exécution ; alerte « non facturé » |
| Photo non synchronisée / pas de connexion | file locale visible, envoi différé, jamais de perte silencieuse |
| Paiement refusé / acompte manquant | relance ; chantier reste « en attente d'acompte » |
| Devis expiré | relance ou renouvellement 1 clic (prix figés → réactualisation explicite) |
| Employé supprimé | désactivation (pas suppression), historique conservé, portefeuille à réaffecter |
| Deux modifications simultanées | verrou optimiste, message clair, fusion des champs disjoints |
| API Meta indisponible | rejeu automatique, import CSV manuel, alerte d'état |
| SMS échoué / e-mail rebondit | repli sur l'autre canal, marquage du contact |
| IA indisponible / mauvaise suggestion | saisie manuelle intacte ; suggestions refusables ; retour d'usage |
| Client demande la suppression de ses données | procédure de droit à l'effacement, conservation légale des factures |
| Import massif erroné | rollback complet |
| 100 clients d'un coup | pagination, recherche, import CSV, persistance `[partiel : pagination/recherche livrées]` |

## 39 — Opportunités cachées (32 idées retenues)
Format condensé : *Problème → Idée → Valeur → Complexité → Risque → Quand.*
1. **Vitesse de réponse mesurée** — leads perdus par lenteur → compteur T+ et alerte → +conversion → faible → OK → **MVP**.
2. **Motif de perte obligatoire (liste)** — on ignore pourquoi on perd → 1 tap → pilotage prix/concurrence → faible → aucun → **MVP**.
3. **Marge estimée dès le devis** — vendre à perte sans le voir → coût catalogue → marge visible → moyenne → catalogue à renseigner → **V1**.
4. **Carte de rendement terrain** (taux de signature par rue) — dispersion de la prospection → carte → économie de temps → moyenne → vie privée (n'utiliser que les contacts réels) → **V2**.
5. **QR de chantier + code parrain** — panneau muet → QR unique → leads voisinage → faible → aucun → **V1**.
6. **« Avant l'orage » (météo + toitures anciennes)** — opportunité après tempête → campagne ciblée → CA réactif → moyenne → spam → **V2**.
7. **Carnet de santé exportable** (vente immobilière, assurance) — valeur pour le client → PDF officiel → fidélisation → moyenne → responsabilité du contenu → **V2**.
8. **Score de fraîcheur des opportunités** — devis qui refroidissent → alerte selon montant → CA récupéré → faible → aucun → **V1**.
9. **Photos avant/après avec consentement** — contenu marketing gaspillé → case consentement + sélection → avis/pub → faible → droit à l'image → **V1**.
10. **Bibliothèque de checklists matériel par type de chantier** `[EXISTE]` → oublis → **fait** → étendre au devis.
11. **Brief technicien auto** — technicien sans contexte → résumé dossier → moins d'allers-retours → faible → **V1**.
12. **Détection de récurrence SAV** — mêmes causes → alerte qualité → baisse retours → moyenne → **V2**.
13. **Devis « options » cochables par le client** — panier moyen → portail → +panier → moyenne → **V1**.
14. **Rappel de disponibilité client** (préférences horaires) — RDV manqués → préférences dans la fiche → présence ↑ → faible → **MVP**.
15. **Numéro de suivi d'appel par source** — attribution des appels → numéros dédiés → vérité d'attribution → moyenne + coût → **V2**.
16. **Assistant de relance de paiement** — impayés → séquence + ton → trésorerie → faible → **V1**.
17. **Pointage simple (arrivée/fin)** — coût main-d'œuvre inconnu → 2 boutons → marge réelle → faible → **V1**.
18. **Avenant en 1 minute depuis le chantier** — travaux non facturés → photo + phrase → CA récupéré → moyenne → **V1**.
19. **Réception numérique avec signature** — litiges → PV signé → moins de contentieux → moyenne → **V1**.
20. **Suivi de consultation du devis** — relance à l'aveugle → lien tracé → bon timing → moyenne **[SERVEUR]** → **V1**.
21. **Numérisation des devis existants (import PDF)** — migration lourde → extraction assistée + validation → adoption → moyenne → **V2**.
22. **Suggestion de prochaines actions par contexte (« next best action »)** → **MVP** simple (règles), IA plus tard.
23. **Répertoire de sous-traitants avec évaluations internes** — qualité variable → fiche + note interne → choix → faible → **V2**.
24. **Gestion des garanties** (décennale, dommages, dates) — recherche fastidieuse → calcul automatique de la garantie par chantier → SAV rapide → faible → **V1**.
25. **Documents administratifs chantier** (déclarations, attestations) — oublis → modèles par type → conformité → moyenne → **V2**.
26. **Prévision de charge** (carnet de commandes vs capacité) — sous/sur-charge → courbe → décisions d'embauche/pub → moyenne → **V2**.
27. **Pilotage des campagnes selon la capacité** (stop pub quand planning plein) — leads inutiles → règle → efficacité budget → moyenne → **V3**.
28. **Segmentation d'anciens clients** (toiture > 15 ans, dernière visite) — réactivation → liste ciblée → CA récurrent → faible → **V1**.
29. **Comparateur interne d'équipes** (marge, retours) — bonnes pratiques → indicateurs qualité → progression → moyenne, risque toxique → **V3**.
30. **Mode « client difficile »** (note interne + précautions) — conflits → alerte discrète → moins de litiges → faible → droit d'accès aux notes → **V2**.
31. **Achats groupés/fournisseurs** (prix, délais, commande depuis la liste de matériel) — approvisionnement → commande en 1 clic → temps gagné → moyenne → **V2**.
32. **Portail syndic / gestionnaire** (multi-biens) — clients récurrents pro → vue parc de bâtiments → contrats → moyenne → **V3**.
Écartées comme trop faibles : gamification des techniciens, réseau social interne, chatbot public générique, estimation automatique de prix sur photo, drone autonome.

## 40 — Ce qu'il ne faut pas construire (maintenant)
- Comptabilité complète / paie (rester sur devis-facture-paiement + exports).
- Agent vocal autonome ; verdict de défaut par IA sur photo ; chiffrage automatique envoyé sans clic.
- Constructeur d'automatisations visuel complexe (une éditeur en phrases suffit).
- Marketplace/API publique avant stabilisation.
- Application native iOS/Android avant limites PWA démontrées.
- Multi-agences/franchise dans le MVP (architecture prévue, pas l'UI).
- Réseau social, gamification, classements commerciaux publics.
- Planification par optimisation mathématique (solveur) : règles de score suffisent.
- Tableaux de bord à 50 graphiques ; personnalisation illimitée de l'UI.
- Effacement/fusion automatique de données ; changement de prix automatique.

## 41–45 — MVP, V1, V2, V3, vision 5 ans
**MUST (MVP — 80 % de la valeur)** : auth + organisation + rôles/permissions ; contacts/propriétés/toitures ; **leads avec source obligatoire + file avec vitesse de réponse** ; secrétariat (recherche, création rapide, RDV) ; agenda simple (ressources, conflits) ; **diagnostic guidé mobile → rapport PDF** ; devis depuis diagnostic + catalogue + PDF + envoi ; **suivi devis + relances + « actions du jour »** ; Gagné → chantier + facture(s) ; paiements + statuts calculés ; chantier basique (statut, équipe, checklist, photos, journal) ; cockpit dirigeant simple ; import CSV ; persistance et sauvegarde.
**SHOULD (V1)** : signature électronique ; SMS/e-mail automatisés (speed-to-lead, confirmations, avis) ; marge réelle (coûts + pointage) ; avenants ; réception signée ; portail client ; QR de chantier + parrainage ; météo (alertes) ; contrôle qualité ; SAV ; entretien/contrats + rappels ; PWA hors connexion.
**LATER (V2)** : Meta Ads + attribution CA/marge ; téléphonie + résumé d'appel ; IA diagnostic/devis/relance (brouillons) ; carte du parc et rendement terrain ; import de devis PDF ; prévision de charge ; documents administratifs.
**V3** : multi-agences, franchise/réseau, API publique/marketplace, portail syndic, pilotage pub selon capacité, benchmarks anonymisés.
**NEVER / probablement pas** : voir 40.
**Vision 5 ans** : infrastructure centrale de l'entreprise de couverture — chaque toiture suivie a un carnet de santé ; l'entreprise sait *quelle source, quel chantier, quel client, quelle équipe* génère la marge ; l'administration résiduelle est de la validation ; un réseau d'entreprises partage des pratiques (anonymisées).

## 46 — Roadmap (ordre challengé)
| Phase | Contenu | Remarque |
|---|---|---|
| 0 — Validation métier (2-3 sem.) | 10 entretiens, observation terrain, collecte de vrais devis/rapports, échelle de sévérité, catalogue réel | ne pas coder sans elle |
| 1 — Fondations | auth, organisation, RBAC, RLS, stockage, audit, CI/CD, design system | **serveur = déblocage de tout** |
| 2 — CRM + leads | contacts/propriétés/toitures, leads + sources, secrétariat, import | speed-to-lead dès ici |
| 3 — Agenda + diagnostic | ressources, meilleurs créneaux simples, diagnostic mobile (PWA), rapport PDF | reprise de l'existant protégé |
| 4 — Devis + commercial | catalogue, devis depuis diagnostic, relances, actions du jour, signature | **remonter les relances avant les chantiers** |
| 5 — Chantiers + terrain | chantier auto, journal, photos, offline, contrôle qualité | |
| 6 — Facturation + rentabilité | factures, paiements, coûts, marge réelle | prérequis de l'attribution |
| 7 — Automatisations | moteur déclencheur/actions, modèles, notifications hiérarchisées | avant l'IA |
| 8 — IA | brouillons validés (diagnostic, rapport, devis, relance, résumé d'appel), assistant dirigeant | après données structurées |
| 9 — Acquisition/attribution | Meta, téléphonie, QR, marge par source | dépend des phases 6-7 |
| 10 — Entretien/rétention | carnet de santé, contrats, campagnes, avis, parrainage | |
| 11 — Scale | multi-agences, API, marketplace, performance | |
**Challenge** : les relances de devis (phase 4) et le speed-to-lead (phase 2) apportent le ROI le plus immédiat → à livrer avant chantiers/IA ; l'IA ne vient qu'après la donnée structurée ; l'attribution ne devient fiable qu'après la marge réelle.

## 47 — Dependency map
```
AUTH → ORGANISATION → UTILISATEURS → RBAC/RLS → STOCKAGE/AUDIT
   → CONTACT/PROPRIÉTÉ/TOITURE → LEAD/SOURCE → RENDEZ-VOUS/AGENDA
   → DIAGNOSTIC (+MÉDIA) → ANOMALIE → CATALOGUE → DEVIS (+RELANCES) → SIGNATURE
   → CHANTIER → JOURNAL/PHOTOS/QUALITÉ → FACTURE → PAIEMENT → COÛTS/MARGE
   → ATTRIBUTION (Meta/QR/téléphonie) → AUTOMATISATIONS/NOTIFICATIONS → IA
   → SAV → ENTRETIEN → AVIS/PARRAINAGE → RÉACTIVATION
Transverses dès le début : timeline `event`, audit log, permissions, import/export.
```
Ordre réel pour éviter les refontes : **tenant + RLS + événements + stockage média** avant tout module ; le modèle *Contact/Propriété/Toiture* avant le diagnostic ; le *catalogue avec coûts* avant le devis (marge) ; les *événements* avant analytics/automatisations.

## 48 — Checklist avant développement
☐ Échelle de sévérité et arbre de diagnostic validés avec 3 couvreurs · ☐ 5 devis/rapports/factures réels analysés · ☐ catalogue de prestations réel + coûts · ☐ choix pays/juridique (RGPD, prospection, facture électronique) · ☐ choix de l'hébergeur UE + fournisseurs (auth, e-mail/SMS, paiement, signature) · ☐ modèle de données figé pour le noyau · ☐ règles de permission par rôle validées · ☐ maquettes des 10 écrans clés testées sur téléphone · ☐ définition écrite des 15 KPI · ☐ politique de sauvegarde/restauration testée · ☐ plan d'import des données existantes · ☐ décision PWA vs natif après test offline réel · ☐ budget IA plafonné · ☐ 3 entreprises pilotes engagées.

---
## SIMULATION — Une journée réelle (entreprise de 12 personnes)
- **06:30 dirigeant (mobile)** : cockpit → « 2 leads Meta de la nuit non traités, 1 devis de 8 400 € sans relance depuis 6 jours, chantier Dupont bloqué (tuiles non livrées) ». Il assigne le devis à Sarah, appelle le fournisseur depuis la fiche.
- **07:00 équipes** : Yanis (poseur) ouvre *Mes chantiers* : Bordeaux 8 h, itinéraire, consignes, checklist matériel (3 cases restent à cocher), photos avant.
- **08:00 secrétaire** : file de leads triée par score ; appelle les 2 leads Meta (T+8 min pour le premier, alerte affichée).
- **08:12 nouveau lead Meta** : webhook → lead + attribution (campagne, ad) → SMS d'accusé → tâche d'appel → notif.
- **08:20 appel entrant** : écran d'appel → client connu (SAV en cours, alerte) → note + ticket lié → créneau proposé (3 meilleurs, trajets compris).
- **09:00 diagnostic (Julien)** : « Commencer » → brief → zones → photos + dictée → « Terminer » → synthèse pré-remplie.
- **10:30 devis** : diagnostic validé → brouillon de devis auto → Sarah ajuste, marge estimée 31 %, envoie avec le rapport.
- **11:00 chantier** : Yanis « Démarrer » → journal ; photos avant.
- **13:00 problème terrain** : solin dégradé non prévu → « Signaler » (photo + voix) → bureau prévenu → avenant créé depuis le chantier → client accepte par lien à 13:40.
- **15:00 prospect terrain** : commercial en tournée crée un contact en 3 taps (QR scanné, secteur X) → lead pré-attribué.
- **17:00 fin de chantier** : photos après, checklist, réserves → « Terminer » → facture de solde créée → contrôle programmé.
- **18:00 reporting** : le dirigeant lit le journal du jour, l'encaissement du jour, 4 relances envoyées, aucune exception rouge.

## SIMULATION — Un client de A à Z
| Étape | Client | Secrétaire | Commercial | Technicien | Système | Automatisation | Données créées |
|---|---|---|---|---|---|---|---|
| Publicité | voit l'annonce « fuite ? » | – | – | – | impression | – | impression/clic |
| Lead | remplit le formulaire | – | – | – | lead + attribution | SMS d'accusé, tâche | lead, source, campagne |
| Appel | répond | qualifie (urgence eau) | – | – | fiche + score | file priorisée | contact, propriété, problème |
| RDV | choisit un créneau | confirme | – | – | meilleurs créneaux | confirmation/rappel | appointment |
| Diagnostic | présent | – | – | guidé, photos | constats structurés | rapport en brouillon | diagnostic, anomalies, média |
| Devis | reçoit un rapport visuel | – | valide le brouillon | – | marge estimée | relances programmées | estimate, items |
| Signature | signe en ligne | – | – | – | preuve | chantier + acompte | signature, job, invoice |
| Chantier | prévenu par SMS | – | – | poseurs | journal | alertes | logs, photos, coûts |
| Facture/paiement | paie | – | – | – | statuts calculés | séquence satisfaction | invoice, payment |
| Avis | laisse un avis | – | – | – | demande à J+2 (si satisfait) | code parrain | review_request |
| Entretien (N+1) | reçoit le rappel | – | – | contrôle | carnet de santé mis à jour | opportunité si anomalie | service_visit |
| Recommandation | son voisin scanne le QR/code | – | – | – | attribution parrainage | récompense | referral, lead |

## 10× — Où le flux change d'échelle
| Avant | Après |
|---|---|
| photos → retour bureau → rapport → devis → envoi (2-5 jours) | **voix + photos par zone → constats → rapport + brouillon de devis → validation → envoi (même jour)** |
| leads dans un cahier, rappel si on y pense | **file scorée, T+ mesuré, relance automatique** |
| devis oubliés | **séquence de relance + 12 actions/jour** |
| chantier piloté au téléphone | **journal auto + alertes + avenant en 1 minute** |
| facturation en fin de mois | **facture au clic de fin de chantier, paiement suivi** |
| pub au ressenti | **euro de marge par source** |
| client oublié | **carnet de santé + rappels + parrainage** |

## ZERO ADMIN — jusqu'où aller
Automatiser sans risque : captation, structuration, rappels, relances *proposées*, planification *proposée*, calculs, classement, reporting. Garder humain : verdict technique, prix, envoi de tout ce qui engage, relation client difficile, décision d'annuler/reporter. Limite = **irréversible ou engageant** ⇒ validation.

## MOBILE FIRST TERRAIN — test « gants, dehors, réseau faible »
Critères : action principale ≤ 2 taps, cible ≥ 56 px, voix pour tout texte, fonctionne hors ligne, photos compressées avant envoi, aucune saisie de tableau. Les écrans qui échouent (édition de devis complexe, planning) restent **PC**.

---
# SECOND PASS — Ce que la première version a manqué
| Angle | Manque / incohérence | Correction |
|---|---|---|
| Dirigeant | pas de vue « trésorerie prévisionnelle » | ajout au cockpit V1 : encaissements attendus à 30 j (échéances) |
| Secrétaire | remplacements en congés/absences | règle d'affectation avec remplaçant, file partagée |
| Commercial | droit de remise non défini | plafonds par rôle + approbation |
| Technicien | zone sans réseau → photo sans zone | choix de zone avant prise (hors-ligne) |
| Client | signature/paiement sur mobile non détaillés | portail mobile-first, lien unique sans compte |
| Product designer | trop d'écrans PC-first | 10 écrans clés testés sur téléphone avant dev |
| Architecte | conflit de synchro offline sous-spécifié | append-only pour journaux/médias, fusion par champ, révision |
| Fondateur | dépendance forte à Meta/téléphonie | entrées manuelles/CSV en secours, interfaces par fournisseur |
Incohérences corrigées : la Partie 2 fusionnait « Contacté/Qualifié » alors que 12 parlait de 7 étapes → **7 étapes** retenues partout ; « portail client » cité en V1 mais « signature » en V1 aussi → signature avant portail ; coûts nécessaires à l'attribution → phase 6 **avant** 9.
Risques techniques additionnels : volumétrie photos (quota + compression), coûts IA (plafonds), délivrabilité e-mail/SMS (DNS, opt-out), fuseaux horaires, droit à l'oubli vs conservation comptable.

# THIRD PASS — 80 % de la valeur avec 20 % de la complexité
**Noyau minimal** (6 briques) : (1) **Lead + source + vitesse de réponse** ; (2) **Diagnostic guidé → rapport** ; (3) **Devis depuis diagnostic + relances** ; (4) **Gagné → chantier + facture + paiement calculés** ; (5) **Journal de chantier + photos** ; (6) **Cockpit d'exceptions**.
Tout le reste (IA, Meta, téléphonie, carte, météo, marketplace) est **branché plus tard sur des événements déjà émis**.
Règles anti-usine-à-gaz : un seul modèle de données ; pas plus de 7 étapes de pipeline ; 12 actions/jour max ; 6 KPI par écran ; automatisations en phrases ; PWA avant natif ; un fournisseur par catégorie ; chaque fonctionnalité doit citer la variable business qu'elle améliore.

## Où en est l'application actuelle face à ce plan
Déjà en place (maquette navigateur) : dossier 360, diagnostic + rapport PDF, devis/factures/paiements, **Gagné → facture → impayé/payé**, chantier, matériel + agenda, rôles/accès, invitations/e-mails de marque, mobile natif-like, données communes, recherche/pagination.
Prochain lot côté application : persistance locale + sauvegarde/restauration, import CSV, onglet Personnalisation, puis (avec un serveur) les fondations de la Phase 1.
