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
