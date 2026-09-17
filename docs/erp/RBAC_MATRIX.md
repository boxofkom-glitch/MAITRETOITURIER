# Matrice RBAC (simulée côté client — voir DECISIONS.md D1/D3)

| Permission | admin | sales | tech | client |
|---|---|---|---|---|
| client.read (ALL/OWN) | ALL | TEAM | OWN | OWN |
| client.create | ✓ | ✓ | ✓ | – |
| client.update | ✓ | – | – | – |
| lead.assign | ✓ | – | – | – |
| appointment.create | ✓ | – | – | – |
| appointment.update | ✓ | – | – | – |
| diagnostic.execute | ✓ | – | ✓ | – |
| diagnostic.read | ✓ | ✓ | ✓ | OWN |
| opportunity.update | ✓ | ✓ | – | – |
| quote.create/update | ✓ | ✓ | – | – |
| quote.send | ✓ | ✓ | – | – |
| invoice.create | ✓ | – | – | – |
| payment.register | ✓ | ✓ | ✓ | – |
| job.read | ✓ | ✓ | ✓ | – |
| job.update | ✓ | – | – | – |
| referral.create | ✓ | ✓ | – | – |
| team.manage | ✓ | – | – | – |
| analytics.company.read | ✓ | – | – | – |

Implémenté dans `app.js` via `PERMISSIONS` (objet rôle → `Set`) et
`hasPermission(perm)`. Les anciennes fonctions `canCreateDemande()` etc.
restent comme alias pour ne rien casser dans le reste du code.

Roles étendus prévus par le spec (`MANAGER`, `SITE_MANAGER`, `PURCHASING`,
`ACCOUNTING`, `MARKETING`, `SUBCONTRACTOR`, `INSTALLER`) : la structure
`PERMISSIONS`/`ROLES` est un objet ouvert — ajouter un rôle = ajouter une
entrée, aucune refonte nécessaire. Non peuplés maintenant faute de besoin
produit immédiat (l'équipe démo actuelle est admin/sales/tech/client).
