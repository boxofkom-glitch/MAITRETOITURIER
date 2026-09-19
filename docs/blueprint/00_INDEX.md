# MASTER BLUEPRINT — Maître Toiturier, système d'exploitation d'une entreprise de couverture

Fichiers dans `docs/blueprint/`. Chaque partie est autonome ; l'index dit où trouver chaque section du master prompt.

| Partie | Fichier | Sections du blueprint | État |
|---|---|---|---|
| 1 | `01_METIER_ET_PRODUIT.md` | 01 Vision · 02 Problème · 03 Marché · 04 Personas · 05 JTBD · 06 Proposition de valeur · 07 Operating model (transitions) · 08 Architecture du produit | **écrit** |
| 2 | `02_CRM_ACQUISITION_VENTE.md` | 09 CRM · 10 Acquisition/attribution · 11 Secrétariat · 12 Commercial (pipeline, speed-to-lead, relances) · 13 Diagnostic · 14 Devis | **écrit** |
| 3 | `03_EXECUTION.md` | 15 Planning · 16 Chantier · 17 App terrain/offline · 18 SAV · 19 Entretien · 20 Finance · 21 Attribution marketing | **écrit** |
| 4 | `04_IA_AUTOMATISATION_UX.md` | 22 IA · 23 Automatisations · 24 Dashboards/cockpit · 25 UX/UI · 26 Écrans (fiches) | **écrit** |
| 5 | `05_TECH_SECURITE_DONNEES.md` | 27 Data model · 28 Architecture · 29 API · 30 Intégrations · 31 Sécurité · 32 Conformité · 33 Analytics | **écrit** |
| 6 | `06_BUSINESS_ROADMAP_PASSES.md` | 34 Pricing · 35 Onboarding · 36 Growth · 37 Moat · 38 Cas limites · 39 Opportunités cachées · 40 À ne pas construire · 41–45 MVP/V1–V3/vision · 46 Roadmap · 47 Dépendances · 48 Checklist · Simulations · **Second pass** · **Troisième pass (80/20)** | **écrit** |
| 7 | `07_ETAPES_0_1_2.md` | Complément 75–190 : équipe d'experts, Golden Path, never-ask-twice, Étape 0 (audit), Étape 1 (modèle d'information, sync, données), Étape 2 (Acquisition → Lead, format A→Z, red team, simulation) | **écrit — à valider** |

| 8 | `08_ETAPES_3_9.md` | Étapes 3–9 : lead+qualification, RDV, app technicien, diagnostic, anomalies, rapport, commercial | **écrit** |
| 9 | `09_ETAPES_10_20.md` | Étapes 10–20 : devis, relances, signature/acompte, création chantier, préparation, planning, app poseur, exécution, contrôle, facturation, paiement | **écrit** |
| 10 | `10_ETAPES_21_30.md` | Étapes 21–30 : SAV, entretien, avis/parrainage, réactivation, cockpit, analytics, IA, automatisations, back-office, pricing/onboarding/growth | **écrit** |
| 11 | `11_TRANSVERSE.md` | 20 scénarios, charge humaine, tailles d'entreprise, continuité, permissions, moat, UX transversale, méthode (DoR/DoD, priorisation), registres décisions/hypothèses, questions bloquantes | **écrit** |

Règles de lecture :
- **[EXISTE]** = déjà construit dans l'application actuelle (dépôt `toitpilot-crm`) ; **[À FAIRE]** = à construire ; **[SERVEUR]** = impossible sans backend.
- Éléments protégés (identité, diagnostic, trames PDF, bibliothèque de prestations) : jamais remplacés, seulement entourés.
- Voir aussi `docs/erp/VISION_OS.md` (audit de l'existant) — ce blueprint en est la suite.
