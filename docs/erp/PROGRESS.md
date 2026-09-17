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
| Devis versionnés | – | – | – | – | [ ] |
| Factures / paiements | – | – | – | – | [ ] |
| Chantiers | – | – | – | – | [ ] |
| Poseur mobile | – | – | – | – | [ ] |
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
- RBAC formalisé en cours (`PERMISSIONS`/`hasPermission`).
- "Ma journée" en cours d'implémentation.
- Devis/Factures/Paiements planifiés ensuite (extension additive de
  `DOSSIERS[i]`, cf. TARGET_ARCHITECTURE.md).
- Modules Chantier/Poseur/Matériel/Achats/Marketing/SAV avancé : non
  démarrés, volontairement — voir DECISIONS.md D4 (anti-fake-feature).
