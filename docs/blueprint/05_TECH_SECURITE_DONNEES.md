# PARTIE 5 — Data model, architecture, API, intégrations, sécurité, conformité, analytics (sections 27 à 33)

## 27 — Data model
Conventions : toute table porte `organization_id` (tenant), `id` UUID, `created_at/updated_at`, `created_by`, `deleted_at` (suppression logique) ; montants en centimes ; horodatages UTC ; adresses normalisées + coordonnées.
**Noyau** : `organization` · `agency`(V3) · `user` · `membership`(user↔org, rôle, agence) · `role` · `permission` · `contact` · `property` · `roof` · `media` · `document` · `event` (timeline append-only) · `note` · `task`.
**Acquisition** : `acquisition_source` · `campaign` · `campaign_cost` · `lead` · `qr_code` · `referral` · `attribution` (lead→source/campagne/ad/UTM/QR/commercial/secteur).
**Commercial** : `appointment` · `diagnostic` · `diagnostic_item` (zone, élément, observation, sévérité, origine humain/IA-validé) · `anomaly` (statut du cycle, zone, source diagnostic, liens devis/chantier) · `opportunity` · `estimate` · `estimate_item` (lien anomalie, prestation, coût, marge) · `estimate_version` · `signature` · `follow_up` (relance).
**Catalogue** : `service` · `service_component` (matériau/main-d'œuvre) · `material` · `supplier` · `bundle`/`option`.
**Exécution** : `job` · `job_task` (issues des lignes) · `job_assignment` · `crew` · `vehicle`/`equipment` · `time_entry` · `job_log_entry` · `job_material` · `purchase` · `quality_check` (+items) · `change_order` (avenant) · `support_ticket` · `maintenance_plan` · `service_visit` · `review_request`.
**Finance** : `invoice` · `invoice_line` · `payment` · `payment_schedule` · `credit_note` · `cost` (matériaux/heures/sous-traitance/autres) · `job_margin` (vue).
**Pilotage** : `automation_rule` · `automation_run` · `notification` · `notification_pref` · `audit_log` · `integration` (+ `integration_secret` chiffré) · `webhook_delivery` · `export_job` · `import_job` (+ rollback) · `consent` · `ai_call_log`.
**Corrections par rapport à la liste du brief** : ajout de `property`/`roof` (séparation client/bien), `anomaly` (objet métier), `event` (timeline), `change_order`, `quality_check`, `cost`, `consent`, `import_job`, `ai_call_log`, `attribution` ; `Material` devient catalogue + consommation par chantier ; `Crew` distinct de `User` (équipe de pose = groupe de ressources).
**Relations clés** : `contact 1—n property 1—n roof 1—n diagnostic 1—n diagnostic_item` ; `diagnostic_item 0..1—1 anomaly` ; `anomaly n—n estimate_item` ; `estimate 1—0..1 job` ; `job 1—n invoice` ; `job 1—n cost` ; `lead 1—1 attribution` ; `lead → contact` (conversion) ; `roof 1—n service_visit`.
**Cycle de vie anomalie** : `détectée → validée → commercialisable → devisée → acceptée → planifiée → traitée → contrôlée → résolue`, + `refusée_client`, `surveillée`, `récurrente` (voir VISION_OS).
**Timeline** : table `event(entity_type, entity_id, type, payload jsonb, actor, at)` écrite par le domaine, lue par analytics, automatisations, notifications, portail (filtré).

## 28 — Architecture technique
**Principe** : *monolithe modulaire* + Postgres + files, pas de microservices au départ. Passage à l'échelle 10 → 10 000 entreprises par montée en charge horizontale du monolithe et de Postgres (index/partitionnement par tenant), pas par éclatement prématuré.
| Couche | Choix recommandé | Pourquoi / évolution |
|---|---|---|
| Frontend web | application web (SPA) en TypeScript ; design system partagé | l'existant vanilla JS sert de maquette validée ; reconstruction par modules |
| Mobile | **PWA installable** (Web Push, IndexedDB, caméra, GPS) ; natif seulement si limites avérées (offline lourd, background) | un seul code, déploiement instantané |
| Backend/API | monolithe modulaire (Node/TypeScript ou équivalent), API REST + événements | simplicité ; contrat OpenAPI |
| Base | **PostgreSQL** managé, **Row-Level Security** par `organization_id` | isolation stricte ; JSONB pour attributs souples |
| Stockage | objets S3-compatible, URLs signées courtes, dossier par tenant, antivirus/taille/type | photos volumineuses, coût maîtrisé |
| Auth | fournisseur managé (e-mail+mot de passe, lien magique, MFA TOTP), sessions courtes + refresh | ne pas fabriquer sa propre auth |
| RBAC | rôles + permissions par module/niveau (Aucun/Lecture/Édition) + portée (tout/équipe/soi) `[EXISTE côté maquette]` | personnalisable par entreprise |
| Queues/jobs | file (Postgres/Redis) pour webhooks, envois, IA, exports, relances planifiées | fiabilité, rejeu |
| Temps réel | WebSocket/SSE pour notifications et agenda partagé | limité aux écrans utiles |
| Recherche | Postgres full-text + trigram ; moteur dédié seulement > 1 M lignes | universelle, tolérante aux fautes |
| Notifications | Web Push + e-mail + SMS (hiérarchie urgent/action/info) | préférences par utilisateur |
| E-mail / SMS | fournisseur transactionnel (domaine authentifié SPF/DKIM/DMARC), SMS avec sender id | modèles de marque `[EXISTE : 10 modèles]` |
| Paiement | prestataire (lien de paiement, webhooks) | jamais de carte stockée chez nous |
| Analytics | tables d'événements + vues matérialisées ; entrepôt séparé seulement à l'échelle | KPI section 33 |
| IA | couche `ai-gateway` (choix modèle, plafonds, journal, redaction PII, timeouts, repli) | remplaçable, coûts sous contrôle |
| Observabilité | logs structurés, métriques, traces, alertes, journal d'audit métier | corrélation `request_id` |
| Sauvegardes | snapshots quotidiens + PITR, test de restauration trimestriel, export client | RPO ≤ 15 min, RTO ≤ 4 h |
| CI/CD | tests auto, migrations versionnées, déploiements par environnements (dev/staging/prod), feature flags | rollback simple |
**Décisions importantes** : (1) RLS dès le jour 1 (impossible à ajouter proprement plus tard) ; (2) événements append-only ; (3) PWA avant natif ; (4) un seul fournisseur par catégorie derrière une interface (dépendance maîtrisée) ; (5) pas de Kubernetes tant qu'un PaaS suffit.

## 29 — API
REST versionnée `/v1`, JSON, pagination par curseur, filtres standard, idempotence (`Idempotency-Key`) sur créations sensibles, erreurs normalisées `{code, message, details, request_id}`, limites de débit par tenant/clé.
Ressources : leads, contacts, properties, roofs, appointments, diagnostics, estimates, jobs, invoices, payments, tasks, media (upload signé), webhooks, exports.
**Webhooks sortants** (V2+) : événements `lead.created`, `estimate.signed`, `job.completed`, `payment.received`… signés HMAC, rejeu, journal de livraison. **Entrants** : Meta Lead Ads, formulaires site, téléphonie, paiement — vérification de signature, file, déduplication par identifiant externe.
API publique/marketplace : **plus tard** (V3+), seulement quand l'API interne est stable.

## 30 — Intégrations (valeur / entrées / sorties / auth / erreurs / coût / dépendance)
| Intégration | Valeur | Entrées → Sorties | Auth | Erreurs/synchro | Coût | Dépendance |
|---|---|---|---|---|---|---|
| Meta Ads | attribution → marge | leads, dépenses → statuts (conversion API) | OAuth entreprise | file de rejeu, import CSV en secours | gratuit (API) | forte (politiques Meta) |
| Google (Business, Ads, Agenda) | avis, appels, RDV | avis/appels → événements | OAuth | quotas, resync | gratuit/variable | moyenne |
| Téléphonie cloud | appel entrant, enregistrement, numéros par source | événements d'appel → fiches | clé + webhook | reprise, doublons | à la minute | moyenne |
| E-mail transactionnel | envois de marque, suivi d'ouverture | modèles → statuts | clé API + DNS | bounces, plaintes | volume | faible (interchangeable) |
| SMS | speed-to-lead, confirmations | messages → statuts | clé | échecs → repli e-mail | par SMS | faible |
| Signature électronique | valeur légale du devis | devis → preuve | clé | expiration | par signature | moyenne |
| Paiement | encaissement rapide | lien → paiement | clé + webhook | paiement refusé → relance | commission | moyenne |
| Compta | exports/écritures | factures → écritures | OAuth/CSV | rapprochement | selon | moyenne |
| Cartographie/itinéraire | trajets, créneaux, carte du parc | adresses → temps/coordonnées | clé | quotas, cache | par appel | moyenne |
| Météo | alertes planning | prévisions → alertes | clé | indispo → silence explicite | faible | faible |
| Stockage objets | photos/docs | fichiers | clé | reprise d'upload | volume | faible |
| WhatsApp Business | canal client préféré | messages ↔ | API officielle | modèles pré-approuvés | par conversation | forte |
**Règle** : intégrations *entrantes* d'abord (leads, appels), *sortantes* ensuite ; toute intégration a un écran d'état (connectée / en erreur / dernière synchro) et un mode manuel de secours.

## 31 — Sécurité (threat model)
| Menace | Scénario | Parades |
|---|---|---|
| Fuite entre entreprises | requête sans filtre tenant | **RLS** Postgres, tests automatiques d'isolation, ID non séquentiels |
| Accès employé excessif | technicien lit les marges | RBAC serveur (pas seulement UI), champs sensibles masqués côté serveur, journal d'accès |
| Ancien employé | compte actif après départ | désactivation immédiate, révocation des sessions/jetons, transfert de portefeuille |
| Mots de passe/sessions | credential stuffing | hachage moderne (argon2), MFA (obligatoire dirigeant/admin), verrouillage progressif, sessions courtes |
| Uploads | fichier malveillant, énormes photos | validation type/taille, ré-encodage image, antivirus, stockage isolé, URLs signées |
| Liens publics | devis/rapport devinés | jetons longs aléatoires, expiration, révocation, pas d'indexation |
| Signatures | contestation | preuve horodatée, hash du PDF signé, journal |
| Paiements | fraude/rejeu | webhooks signés, jamais de données carte, vérification montant |
| API/webhooks | abus, forge | clés à portée, HMAC, limites de débit, rejeu borné |
| **IA** | prompt injection via texte client/photo, fuite de données | isolation du contexte par tenant, outils en lecture limitée, pas d'action sans validation, redaction PII, journal des appels |
| Injections | SQL/XSS | requêtes paramétrées, échappement systématique (déjà appliqué en maquette), CSP |
| Exports/suppression | exfiltration | export réservé au directeur, journal, lien à durée courte |
| Audit | traces effacées | `audit_log` append-only, hors de portée des utilisateurs métiers |
Sauvegardes chiffrées ; secrets dans un coffre ; principe du moindre privilège ; revue de dépendances ; tests de pénétration avant ouverture publique.

## 32 — Conformité (à faire valider juridiquement — pas un avis)
Cible France/UE : **RGPD** (base légale, information, registre des traitements, DPO si requis, durées de conservation, droits d'accès/rectification/effacement/portabilité/opposition, contrats sous-traitants, transferts hors UE, notification de violation 72 h) ; **ePrivacy/prospection** (consentement ou intérêt légitime selon le canal, opt-out simple, **Bloctel** pour le démarchage téléphonique, règles sur les SMS/e-mails commerciaux) ; **enregistrement d'appels** (information préalable, durée) ; **avis en ligne** (obligations de loyauté ; pas de filtrage des avis négatifs) ; **photos de personnes/biens** (consentement pour usage marketing) ; **facturation** (mentions obligatoires, conservation 10 ans, évolution vers la facturation électronique) ; **signature électronique** (niveau eIDAS adapté) ; **prospection porte-à-porte / géolocalisation** (finalité et proportionnalité).
**Mécanismes techniques prévus** : table `consent` (finalité, canal, date, preuve, retrait), préférences de communication par contact, durées de rétention configurables et purge planifiée, export complet (JSON/CSV/PDF), suppression/anonymisation avec conservation des pièces comptables, journaux d'accès, registre des sous-traitants, hébergement UE.

## 33 — Analytics
**Événements** (`event.type`) : `lead_created`, `lead_contacted`, `lead_qualified`, `lead_lost`, `appointment_booked`, `appointment_confirmed`, `appointment_completed`, `appointment_no_show`, `diagnostic_started`, `diagnostic_completed`, `report_sent`, `estimate_created`, `estimate_sent`, `estimate_viewed`, `estimate_followed_up`, `estimate_signed`, `estimate_lost`, `job_created`, `job_started`, `job_blocked`, `job_completed`, `quality_check_passed`, `invoice_sent`, `payment_received`, `invoice_overdue`, `ticket_opened`, `ticket_resolved`, `review_requested`, `review_received`, `maintenance_booked`, `referral_created`, `referral_converted`. Chacun : `organization_id`, entité, acteur, source, horodatage, montant éventuel.
**KPI** : temps de première réponse ; % leads contactés < 5 min ; taux lead→RDV, RDV honorés, RDV→diagnostic, diagnostic→devis, devis→signature ; délai diagnostic→devis ; devis relancés (%) ; panier moyen ; **délai lead→paiement** ; CA signé/produit/facturé/encaissé ; marge par chantier/type/source/équipe ; CAC, CPL, ROAS (CA et marge) ; retours SAV/90 j ; part de CA récurrent ; taux de renouvellement ; NPS/avis ; parrainages convertis ; part du CA d'anciens clients.
**Unit economics** (réponses à « combien me coûte un lead / un client ? ») : coût par lead = dépenses de la source ÷ leads ; coût par client = dépenses ÷ ventes ; valeur client sur N années = Σ marge chantiers + entretiens + parrainages ; ancienneté du dernier passage.
Qualité : jamais de KPI sans définition écrite (numérateur, dénominateur, période, exclusions) affichée au survol.

---
**Suite (Partie 6)** : pricing, onboarding, growth, moat, cas limites, idées cachées, à ne pas construire, MVP/roadmap/dépendances, simulations, second et troisième passes.
