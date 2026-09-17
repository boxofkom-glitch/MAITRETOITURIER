# Architecture actuelle (audit du 2026-09-17)

## Nature réelle de l'application
Site **statique** un seul écran (`index.html` + `app.js`, ~2900 lignes), déployé
sur Vercel comme fichiers statiques (pas de build, pas de framework, pas de
serveur). Aucun backend, aucune base de données, aucune authentification
réelle. Tout l'état vit en mémoire JS (`state`, `DOSSIERS`, `CONTRACTS`,
`PARRAINAGES`) et **se réinitialise au rechargement de la page**.

C'est un outil de démonstration commerciale (montrer le produit à des
prospects/associés), pas un SaaS en production multi-clients.

## Stack
- HTML/CSS/JS vanilla, aucune dépendance de build.
- PDF : `html2canvas` + `jsPDF` chargés à la volée (CDN) au moment de générer
  le rapport/brochure.
- Déploiement : GitHub (`boxofkom-glitch/MAITRETOITURIER`) → Vercel
  (auto-deploy sur push `main`) → `app-maitretoiturier.fr`.

## Modèle de rendu
- `render()` réécrit entièrement `#app.innerHTML` à partir de `buildApp()`,
  lui-même dérivé de l'objet global `state`.
- Un seul écouteur délégué `click`/`change` sur `#app`, dispatché par
  `data-action`.
- Pas de router réel : `state.section` pilote l'affichage.

## Entité centrale : `DOSSIERS`
Chaque élément de `DOSSIERS` fusionne déjà plusieurs concepts du spec ERP :
client, lead, rendez-vous (1 seul, pas un agenda multi-RDV), diagnostic,
étape commerciale, montant, relance. C'est un objet **dénormalisé** :
- identité client (`client`, `email`, `telephone`, `adresse`, `ville`)
- qualification/lead (`motif`, `priorite`, `statut`, `commercial`)
- planification (`visiteDate`, `visiteHeure`, `technicien`)
- diagnostic complet (`diagnostic.points[...]`, `diagnostic.synthese`)
- commercial (`commercialStage`, `montant`, `prochaineRelance`)
- historique (`historique[]`, `notes[]`)

Entités annexes séparées : `CONTRACTS` (contrats d'entretien, référencent
`dossierId`), `PARRAINAGES` (parrainages, référencent `dossierId`).

## Rôles (simulation, pas de vraie auth)
`ROLES = { admin, tech, sales, client }` — un seul utilisateur simulé par
rôle (ex. `tech` = toujours "Julien Bernard" en dur). Le filtrage par rôle
se fait côté client via `visibleDossiers()`/`visibleContracts()`/
`visibleParrainages()` et des fonctions `canXxx()` booléennes — **aucune
vérification serveur, car il n'y a pas de serveur.**

## Diagnostic (module protégé — voir DECISIONS.md)
Le module diagnostic (8 points de contrôle, cascade problème/étendue/
localisation, génération automatique de texte pro via `reformulatePoint`,
génération PDF brochure premium) est fonctionnel, récemment retravaillé et
validé par l'utilisateur. **Ne pas le réécrire.**

## Ce qui n'existe PAS aujourd'hui
- Base de données, persistance serveur, API.
- Authentification réelle (mot de passe, session, token).
- RBAC vérifié côté serveur (impossible sans serveur).
- Multi-tenancy (une seule entreprise, données en dur).
- Paiements réels, intégrations fournisseurs, emails/SMS réels.
- Agenda multi-RDV par dossier (un dossier = un seul RDV pour l'instant).
- Séparation Client / Contact / Site (un dossier = un client = une adresse).
