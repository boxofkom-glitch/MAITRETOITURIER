# Progress — build ERP (Master Spec)

Légende : `[ ]` NOT_STARTED · `[~]` IN_PROGRESS · `[x]` DONE (simulé client,
voir DECISIONS.md D1) · `[!]` BLOCKED_EXTERNAL

| Module | Données | UI desktop | UI mobile | RBAC | Statut |
|---|---|---|---|---|---|
| Diagnostic terrain (existant) | x | x | x | x | [x] protégé, ne pas toucher |
| Brochure PDF premium | x | x | – | x | [x] |
| RBAC formalisé (matrice) | x | – | – | x | [~] |
| Ma journée (dashboard actionnable) | x | x | x | x | [~] |
| Client 360 (tabs unifiés) | x | x | x | x | [x] déjà existant (dossier detail) |
| Leads / secrétariat (file de travail) | partiel | – | – | – | [ ] |
| Agenda multi-RDV | – | – | – | – | [ ] (1 seul RDV/dossier actuellement) |
| Pipeline opportunités | x | x | – | x | [x] déjà existant (kanban commercial) |
| Devis versionnés | x | x | x | x | [x] |
| Factures / paiements | x | x | x | x | [x] |
| Chantiers | x | x | x | x | [~] création auto à l'acceptation, checklist/photos/incidents faits ; planning/matériel/achats/finances/timeline dédiés pas encore faits |
| Poseur mobile | – | – | – | – | [ ] (voir chantier ci-dessus, pas de persona dédiée) |
| Matériel / besoins chantier | – | – | – | – | [ ] |
| Fournisseurs / achats | – | – | – | – | [ ] |
| Dépenses / rentabilité | – | – | – | – | [ ] |
| Marketing / campagnes / import CSV | – | – | – | – | [ ] |
| SAV / garanties | partiel (contrats existants) | – | – | – | [ ] |
| Recherche globale / création rapide | – | – | – | – | [ ] |
| Notifications | – | – | – | – | [ ] |
| Analytics dirigeant | partiel (overview) | x | x | x | [~] |
| Automatisations (event engine) | – | – | – | – | [ ] |

## Session du 2026-09-17
- Audit complet + docs/erp/ créés.
- RBAC formalisé (`PERMISSIONS`/`hasPermission`), remplace les `canXxx()` ad-hoc.
- "Ma journée" (urgent/aujourd'hui/à venir) intégré en tête de l'accueil, par rôle.
- Devis versionnés (catalogue de prestations, lignes, TVA, cycle brouillon→
  envoyé→accepté/refusé, nouvelle version) + Factures (acompte/solde,
  génération idempotente à l'acceptation) + Paiements (espèces/chèque/
  virement, virement "annoncé" vs "confirmé" avant d'être compté comme
  encaissé) — implémentés et testés de bout en bout (desktop + mobile) sur
  l'onglet "Devis & factures" du dossier, visible pour admin/sales.
  Diagnostic terrain re-vérifié non impacté après ce lot.
- Modules Chantier/Poseur/Matériel/Achats/Marketing/SAV avancé : non
  démarrés, volontairement — voir DECISIONS.md D4 (anti-fake-feature).

## Session du 2026-09-17 (suite) — refonte brochure + module Chantier
- Brochure PDF : identité graphique géométrique (chevron toiture, bandeaux
  diagonaux) sur toutes les pages, graphique de répartition des états,
  paragraphe de clôture câblé. Bug corrigé : écrasement silencieux d'un
  point de diagnostic (voir TECH_DEBT.md).
- Module Chantier : `d.chantier` créé automatiquement (idempotent) à
  l'acceptation d'un devis. Onglet "Chantier" (visible si `job.read.*`) :
  statut/équipe/dates/consignes, checklist avant/pendant/fin, photos
  avant/pendant/après (upload réel), incidents (signaler un problème).
  RBAC : édition réservée à `job.update` (admin). Testé bout en bout
  (création via acceptation devis → édition → checklist → incident) en
  desktop et mobile ; diagnostic re-vérifié non impacté.
- Bug RBAC trouvé et corrigé en testant : le nouveau code chantier
  utilisait `hasPermission("job.read")` (permission non définie dans la
  matrice, qui utilise des scopes `job.read.all/team/own`) — l'onglet
  Chantier n'apparaissait donc jamais. Ajout d'un helper `canReadJob()`.
- Reste pour Chantier : planning multi-RDV, matériel/besoins, achats liés,
  finances/rentabilité du chantier, timeline dédiée, persona Poseur mobile
  (accès restreint à "Aujourd'hui / mon chantier").

## Session du 2026-09-19 — CRM dossier client, devis/factures, CRUD
- Devis : conditions de règlement (acompte oui/non et %, paiement en N fois, mode dont carte bancaire) reprises dans le PDF, les messages et les factures (échéancier avec statut par échéance).
- Assistants en étapes pour créer un devis (client, prestations + suggestions du diagnostic, paiement, récapitulatif) et une facture (devis, règlement, récapitulatif), création simple ou avec envoi.
- Dossier client façon CRM : Résumé (actions rapides, KPI, prochaine action, documents), Activité (tâches, notes modifiables/supprimables, historique), Documents (tous les PDF du dossier avec envoi et date d'envoi mémorisée).
- CRUD : tâches, notes, contrats d'entretien, parrainages, devis/factures brouillons, paiements, visites, diagnostic (réinitialisation), incidents chantier, dossier — toujours avec confirmation.
- Bug corrigé : les dossiers créés via « Nouvelle demande » n'avaient pas les champs devis/factures/chantier (plantage de l'onglet Devis) ; numérotation des dossiers robuste après suppression.

## Session du 2026-09-19 (suite) — processus, équipe, personnalisation
- Processus commercial calculé : bouton « Gagné » (chantier + facture(s) selon conditions de règlement), Impayé/Payé selon paiements, échéances.
- Données communes à l'équipe ; création par rôle avec affectation obligatoire de l'autre rôle ; recherche/filtres/pagination des dossiers ; garde-fou doublons.
- Matériel par chantier (bibliothèque, checklist, agenda). E-mails de marque (10 modèles), invitations, mot de passe oublié/réinitialisation.
- Mobile : barre de navigation basse, zéro défilement horizontal ; palette neutre + or unique.
- Personnalisation (catalogue, moyens de paiement, points de contrôle et réponses du diagnostic), persistance IndexedDB, sauvegarde/restauration JSON, import CSV, base vierge.
- Blueprint produit complet dans docs/blueprint/ (7 parties, index 00_INDEX.md).
- RBAC : voir Paramètres › Accès par rôle (matrice par niveau) — RBAC_MATRIX.md est obsolète.

## Session du 2026-09-23 — serveur opérationnel (comptes réels, données partagées)
- Ajout d'un vrai backend (`api/` : auth.js, data.js, settings.js, media.js, _lib.js) sur Vercel
  Functions + Redis (Upstash/Vercel KV) : comptes avec mots de passe chiffrés (scrypt), sessions
  signées, dossiers stockés par ID avec numéro de révision (contrôle de concurrence optimiste),
  photos stockées à part et compressées à l'envoi, réglages (équipe, accès, entreprise,
  personnalisation, bibliothèque matériel) synchronisés.
- Client (`app.js`) : mode serveur détecté via `/api/health` ; si configuré, toute la démo
  (dossiers fictifs, sélecteur de profil, bouton « réinitialiser ») disparaît automatiquement au
  profit d'un vrai écran de connexion / première configuration. Chaque modification (diagnostic,
  devis, facture, paiement, chantier, matériel...) est poussée au serveur ~900 ms après la
  dernière frappe, sans bouton "Enregistrer" ; lecture au démarrage + sondage toutes les 20 s +
  après chaque envoi. Conflits résolus par dossier (celui qui arrive après une modification
  concurrente reçoit la version serveur + un message, jamais un écrasement silencieux).
  Suppression réservée à directeur/admin.
- `dev-server.js` : serveur de développement local avec un faux Redis en mémoire, pour tester tout
  le flux serveur sans dépendance externe (`node dev-server.js`).
- Correction : les e-mails de marque ne fabriquaient plus de faux domaine
  (`@maitretoiturier.fr`) par défaut — n'affichent désormais que les coordonnées réellement
  saisies dans Paramètres → Entreprise.
- Testé de bout en bout en local (serveur de dev) : création du compte directeur, inscription
  d'un technicien, acceptation avec rôle, permissions (technicien refusé sur les réglages),
  modification d'un diagnostic/devis sans clic "Enregistrer", déconnexion puis reconnexion,
  **rechargement complet de page** : toutes les données sont conservées. Conflit simulé entre deux
  connexions : résolu proprement.
- **Reste à faire pour que ce soit actif en production** : connecter une base Upstash Redis au
  projet Vercel (2 clics dans leur tableau de bord — étapes dans
  `docs/DEPLOIEMENT_SERVEUR.md`, hors de portée de cette session car cela demande un accès au
  compte Vercel de l'utilisateur).
