# Décisions d'architecture — build ERP

## D1 — Pas de vrai backend/DB dans ce lot
**Contexte :** le Master Spec demande RBAC vérifié côté serveur, transactions
DB, isolation multi-tenant, webhooks fournisseurs, etc.
**Décision :** l'app reste un site statique. On construit une **simulation
front-end complète et cohérente** du workflow ERP (mêmes patterns que le
diagnostic existant : objets d'état + `render()`), avec un modèle de données
propre qui *pourra* être branché sur un vrai backend plus tard sans tout
réécrire.
**Raison :** construire un vrai backend (auth, DB, API, paiements réels) est
un projet à part entière, hors de portée d'un site statique Vercel, et non
demandé explicitement en dehors du Master Spec générique. Prétendre livrer
du "RBAC serveur" sur du HTML statique serait mensonger (règle anti-fake-
feature du spec, section 103-104).
**Conséquence :** tout ce qui est marqué `[x] DONE` dans PROGRESS.md signifie
"simulé fidèlement côté client", jamais "vérifié serveur". Documenté
explicitement à chaque module concerné.

## D2 — Ne pas fragmenter `DOSSIERS` en tables normalisées tout de suite
**Contexte :** le spec demande de séparer Client / Contact / Site / Lead /
Opportunity / Quote / Invoice / Job.
**Décision :** on **étend** l'objet `DOSSIERS[i]` existant avec des
sous-structures typées (`devis:[]`, `factures:[]`, `paiements:[]`,
`chantier:{}`, `rdvs:[]`) plutôt que de casser le modèle actuel en plusieurs
tableaux liés par ID.
**Raison :** règle P0 "ne pas casser l'existant", règle #90 "source unique de
vérité" (un dossier == déjà un client+affaire, ne pas créer `Client` et
`Dossier` comme deux entités concurrentes pour la même donnée), et c'est la
solution la moins destructive/la plus réversible.
**Limite assumée :** un client avec plusieurs sites/bâtiments n'est pas
modélisé pour l'instant (ferait doublon avec la logique 1 dossier = 1 client
+ 1 adresse). À revisiter si l'utilisateur en a explicitement besoin.

## D3 — RBAC : permission matrix, toujours simulée client
On remplace les fonctions ad-hoc `canXxx()` par une vraie matrice
`PERMISSIONS[role] = Set<permission>` + `hasPermission(perm)`, conforme à la
section 10 du spec (`client.read`, `quote.create`, etc.), mais elle reste
**vérifiée côté client uniquement** — cf. D1. Les anciennes fonctions
`canXxx()` deviennent des alias fins pour ne rien casser.

## D4 — Priorisation des phases
Sur ce lot, on implémente (par ordre) : RBAC formalisé, "Ma journée",
Devis avec versioning simulé, Factures/Paiements simulés, connexion
diagnostic→opportunité déjà largement existante (kanban commercial). Les
modules Chantier/Poseur/Matériel/Fournisseurs/Achats/SAV/Marketing/Analytics
sont documentés dans PROGRESS.md comme `NOT_STARTED` avec leur plan, plutôt
que bâclés — règle anti-fake-feature.
