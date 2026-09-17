# Modèle de données existant

Voir `app.js` — pas de schéma DB, tout est JS en mémoire.

- `DOSSIERS: Dossier[]` — entité centrale, voir CURRENT_ARCHITECTURE.md pour
  le détail des champs.
- `CONTRACTS: Contract[]` — `{ client, ville, prestations, frequence,
  prochaineVisite, statut, montantAnnuel, technicien, commercial, dossierId }`
- `PARRAINAGES: Parrainage[]` — `{ parrain, date, clientApporte, affaire,
  recompense, suivi, commercial, dossierId }`
- `ROLES` — 4 rôles en dur, 1 utilisateur simulé chacun.
- `state` — état UI courant (navigation, modal, formulaires en cours).

Aucun ID auto-incrémenté fiable (`TP-1048` etc. sont en dur dans les données
seed) — à garder à l'esprit si des créations dynamiques de dossiers doivent
générer de nouveaux IDs (voir `modalNewDemande`).
