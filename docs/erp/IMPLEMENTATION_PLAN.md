# Plan d'implémentation

Ordre suivi (adapté du Master Spec section 124, priorisé selon la valeur
démontrable pour une démo commerciale front-end — voir DECISIONS.md D4) :

1. **Phase 0 — Audit** ✅ (ce lot)
2. **Phase 1 — RBAC formalisé** (`PERMISSIONS`/`hasPermission`) — en cours
3. **Phase 4 — Ma journée** (dashboard actionnable par rôle) — en cours
4. **Phase 8 — Devis versionnés** (extension `d.devis[]`)
5. **Phase 9 — Factures / paiements** (extension `d.factures[]`/`d.paiements[]`)
6. Phases suivantes (Chantiers, Poseurs, Matériel, Achats, Marketing, SAV
   avancé, Analytics, Automatisations) : non démarrées ce lot, décrites dans
   PROGRESS.md avec leur dépendance de données. Elles seront traitées lot par
   lot dans les prochaines sessions, dans cet ordre, sans réécrire le
   diagnostic ni casser les données existantes.

Chaque lot suit la boucle du spec : implémenter → `node --check app.js` →
vérification visuelle desktop+mobile via le navigateur intégré → commit →
push → mise à jour de PROGRESS.md.
