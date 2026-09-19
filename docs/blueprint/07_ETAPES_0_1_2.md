# PARTIE 7 — Méthode « équipe d'experts » : Étapes 0, 1 et 2 (sections 75 à 190 du complément)

Les sections 1–74 restent inchangées (parties 1 à 6). Ce document applique le complément : audit, fondations du modèle d'information, puis **Acquisition → Lead** au format A→Z, avec red team, simplification et simulation.
Étiquettes : **MVP / V1 / V2 / V3 / VISION**.

---------------------------------------------------------------------------------------------------
# ÉTAPE 0 — Audit et cartographie de l'existant (résumé ; détail dans `docs/erp/VISION_OS.md`)

**Golden Path** (colonne vertébrale, Mme Dupont) : Meta → lead → appel/qualification → RDV confirmé → diagnostic guidé → anomalies → rapport validé → dossier commercial → devis → relances → signature/acompte → chantier auto → préparation → planning → mission poseur → travaux/photos → contrôle → clôture → facture → paiement → satisfaction → avis → entretien programmé → cycle de vie de la toiture.
**Couverture actuelle du Golden Path (maquette navigateur)** : ✔ diagnostic → rapport → devis → gagné → chantier → facture → paiement → entretien (contrats) ; ✔ matériel/agenda ; ✘ Meta/lead/qualification/RDV confirmé ; ✘ relances automatiques ; ✘ signature ; ✘ avis ; ✘ toiture comme entité ; ✘ offline/photos serveur.

**Dettes de modèle constatées dans le code actuel (à ne pas reproduire dans le vrai modèle)**
| Constat | Conséquence | Correction cible |
|---|---|---|
| Techniciens/commerciaux référencés par **nom** (chaînes) | renommer un employé casse les liens | référence par `user_id` |
| Dossier = client + demande fusionnés | doublons de client, pas de toiture | Contact / Propriété / Toiture / Dossier |
| `d.montant` recopié du devis | double vérité du montant | calculé depuis le devis accepté |
| Étape commerciale saisie à la main | incohérence avec factures | **calculée** (déjà fait pour Gagné/Impayé/Payé) |
| Lignes de devis libres sans lien à l'anomalie | pas de traçabilité constat → prix | `estimate_item.anomaly_id` |
| Historique = texte libre | non exploitable en analytics | `event(type, payload)` typé |
| Persistance nulle (mémoire) | perte au rechargement | serveur + tenant |

---------------------------------------------------------------------------------------------------
# ÉTAPE 1 — Fondations du système et modèle d'information

## 1.1 Hiérarchie challengée (sections 83, 127)
Proposée : Organisation → Utilisateurs → Contact → Client → Propriété → Toiture → Interventions → Diagnostics → Observations → Anomalies → Opportunités → Devis → Chantiers → Factures → Paiements → SAV → Entretiens.
**Corrections** :
- **« Client » n'est pas une entité** : c'est un *état* du contact (a signé/payé au moins une fois). Évite deux fiches pour la même personne. `Contact.type` = personne/société/syndic, `Contact.statut` = prospect | client | ancien.
- **« Observation » = « DiagnosticItem »** (une seule entité). Pas de doublon.
- **« Intervention » est trop vague** → `Appointment` (planifié) et `Visit` (réalisé : diagnostic, chantier, SAV, entretien) ; le diagnostic *est* une visite.
- **Opportunité** ne devient pas une table lourde : c'est le `Dossier` commercial (lead converti) avec étapes calculées ; une opportunité = un dossier de travaux sur une toiture.
- **Propriété et Toiture** : gardés séparés (une propriété peut avoir plusieurs toitures/bâtiments — maison + garage). Un contact peut posséder ou gérer (syndic) plusieurs propriétés (`property_contact` avec rôle : propriétaire, locataire, gestionnaire).
Hiérarchie retenue :
```
Organisation → Agence(V3) → Utilisateur/Ressource
Contact ──< PropertyContact >── Propriété ──< Toiture ──< Visite(Diagnostic) ──< Constat ──> Anomalie
Lead ─(conversion)→ Contact + Dossier(=opportunité) ; Dossier ──> Devis(Lignes→Anomalie) ──> Chantier ──> Factures ──> Paiements
Toiture ──< Ticket SAV, Contrat/Visite d'entretien, Garantie, Document, Média
Événement (transversal) ← toute entité
```

## 1.2 Modèle « CAPTURE → STRUCTURE → DÉCISION → ACTION » (section 82)
| Capture | Structure | Décision | Action |
|---|---|---|---|
| formulaire Meta | lead {contact, besoin, source} | qualifier / rappeler | tâche d'appel |
| appel | fiche + résumé (brouillon IA) | RDV ? | créneau + confirmation |
| photo + choix de zone | média lié à zone/constat | valider constat | anomalie |
| voix | observation proposée | valider/modifier | constat |
| diagnostic terminé | rapport + anomalies | technicien valide | dossier commercial |
| signature | preuve | — | chantier + acompte |
| paiement | statut calculé | — | tâche fermée, séquence satisfaction |
**Règle d'or** : *aucune action ne part d'une capture brute* ; elle passe par une structure typée puis une décision (humaine ou règle explicite).

## 1.3 Never ask twice / Zéro double saisie — registre des champs (sections 79–81)
Chaque champ a **une source**, des **consommateurs** et une **règle de mise à jour**.
| Information | Source unique | Consommée par | Règle de mise à jour |
|---|---|---|---|
| Nom, téléphone, e-mail | `Contact` (1ʳᵉ saisie : lead/appel) | agenda, technicien, commercial, chantier, facture, portail, analytics | modification = 1 endroit, historisée ; alerte de doublon |
| Préférences de contact/horaires | `Contact` | secrétariat, agenda, relances | demandées 1 fois, réaffirmées seulement si > 12 mois |
| Adresse d'intervention | `Propriété` (normalisée + coordonnées) | agenda, itinéraire, carte, chantier, facture, attribution géographique | jamais retapée ; correction propagée avec confirmation |
| Problème déclaré | `Lead` puis `Dossier` | qualification, brief technicien, commercial | complété (pas remplacé) ; l'original est conservé |
| Type/matériau/surface/âge de toiture | `Toiture` (estimé au lead, **corrigé** au diagnostic) | diagnostic, devis (quantités), chantier, entretien | la valeur mesurée écrase l'estimée, l'estimée reste dans l'historique |
| Photos | `Média` lié (toiture, visite, zone, constat) | rapport, devis (photos pertinentes), chantier, SAV, portail | jamais renommées ; contexte auto |
| Anomalies | `Anomalie` (issue du constat validé) | rapport, devis, chantier, entretien, analytics | statut calculé par événements |
| Prestations & prix | `Catalogue` → figés dans `Devis` | facture, chantier, marge | le devis gèle ses prix ; facture = devis |
| Documents | `Document` versionné | portail, envoi, SAV | version, jamais d'écrasement |
| Consignes chantier | `Chantier` (préremplies du devis/diagnostic) | poseur | 1 saisie bureau, lecture mobile |
**Quand on redemande, on l'explique** (« Confirmez l'accès : le dernier passage date de 2 ans »). **Redemandes autorisées** : consentement renouvelé, information périmée, correction d'erreur, changement de situation.
**Action humaine et raison (81)** : chaque champ obligatoire doit répondre à *« le système peut-il le connaître/calculer/déduire/préremplir/proposer/automatiser/brouillonner ? »* — sinon il reste, avec sa justification écrite dans le registre.

## 1.4 Contexte, permissions et audit (sections 88, 135, 136)
Décision d'accès = **rôle × organisation × agence × équipe × dossier assigné × action**. Ex. : le technicien voit le téléphone du client **de ses missions**, jamais l'export de la base ; le poseur ne voit ni prix ni marge ; le commercial voit son portefeuille + « leads non attribués » ; comptabilité voit factures/paiements sans notes de diagnostic. Appliqué **côté serveur** (RLS + couche de services), l'UI masque en plus.
Audit obligatoire (QUI/QUOI/QUAND/AVANT/APRÈS) : prix, remise, suppression, facture, paiement, permissions, export, devis signé modifié, changement de statut clé.

## 1.5 Synchronisation et conflits par type de donnée (sections 132–133)
| Type | Règle | Exemple |
|---|---|---|
| Journal/photos/événements | **append-only**, fusion sans conflit | photo prise hors ligne + note bureau |
| Champs simples (téléphone, note courte) | *dernier écrit gagne* **avec version** ; l'écrasé est proposé en « voir la version précédente » | téléphone modifié des deux côtés → alerte de 1 clic |
| Champs métier sensibles (prix, statut facture, montant) | **jamais fusionnés automatiquement** ; verrou optimiste, arbitrage humain | devis modifié bureau + terrain |
| Statuts | **calculés** depuis les événements (pas de conflit) | Gagné/Impayé/Payé |
| Listes (checklist) | fusion par élément (chaque case a son horodatage) | poseur coche, bureau ajoute un point |
Téléchargement avant intervention : missions du jour + 2 jours (dossier, brief, historique de la toiture, checklist, catalogue), **max ~15 dossiers**, photos originales locales jusqu'à confirmation serveur puis miniatures conservées. Message d'état permanent : « Sauvegardé sur cet appareil — 8 photos en attente de synchronisation ».

## 1.6 Cycle de vie des données (sections 158–159)
- **À conserver** : factures/paiements (10 ans), devis signés, garanties, journal chantier (durée de garantie), consentements.
- **Archivable** : leads perdus > 24 mois (anonymisés), médias de diagnostics sans travaux > 5 ans (originaux → froid).
- **Supprimable** sur demande : contact non client, notes, médias non liés à un chantier ; pour un client : **anonymisation** du contact (nom/téléphone/e-mail) en conservant les pièces comptables et la toiture (rattachée à une référence anonyme).
- **Jamais de cascade naïve** : la suppression passe par un plan (liste des dépendances, ce qui sera conservé/anonymisé/supprimé) validé et journalisé.

## 1.7 Configuration vs personnalisation (143)
STANDARDISÉ (workflow cœur, statuts, événements, modèle de données) · CONFIGURABLE (catalogue, prix, checklists, arbres de qualification, modèles de message, seuils de relance, branding, rôles/permissions) · PERSONNALISABLE (V2+ : champs additionnels limités, règles d'automatisation prédéfinies paramétrables). Pas de workflows sur mesure par entreprise (support impossible).

## 1.8 Tenant, événements, observabilité
`organization_id` + RLS partout ; `event` append-only ; `request_id` de bout en bout ; alertes **business** (147) : 0 lead Meta en 24 h alors que la moyenne > 5 ; taux d'échec SMS > seuil ; erreurs d'upload photos ; automatisations désactivées par erreurs.
Feature flags (146) par organisation ; IA observable (139) : `ai_call_log {input_hash, sortie, validée?, corrigée?, coût, latence}` ; fallback IA (140) et automatisations (141) explicites.

## 1.9 Décisions de l'Étape 1 (decision log — extrait)
| # | Décision | Pourquoi | Alternatives | Hypothèse / validation |
|---|---|---|---|---|
| D1 | Client = état de Contact | une seule fiche par personne | table Client séparée | OK si import/dédoublonnage fiable — test sur 500 contacts réels |
| D2 | Propriété ≠ Toiture | maison + dépendances | fusion | valider avec 5 couvreurs (fréquence multi-toitures) |
| D3 | Opportunité = Dossier (sans table dédiée) | évite une entité inutile | Opportunité séparée | étapes calculées suffisent ? test en pilote |
| D4 | Statuts calculés par événements | pas d'incohérence | statuts saisis | déjà validé dans la maquette |
| D5 | Références par ID, jamais par nom | intégrité | noms | – |
| D6 | RLS Postgres dès J1 | isolation | filtre applicatif | test d'isolation automatisé |
| D7 | Sync : règles par type, pas LWW partout | intégrité métier | LWW | simuler 20 conflits réels |
Registre d'hypothèses (extrait) : H1 les techniciens accepteront la dictée (test : 5 techniciens × 3 diagnostics) · H2 la secrétaire peut qualifier en < 2 min · H3 15 dossiers hors ligne suffisent · H4 les clients cliqueront un lien de devis sans compte · H5 le catalogue peut être renseigné en 1 h à l'onboarding.

---------------------------------------------------------------------------------------------------
# ÉTAPE 2 — ACQUISITION → LEAD (format A→Z)

## A. Objectif
Transformer chaque signal d'intérêt en **lead unique, attribué, traité vite**, sans surcharger le prospect, et conserver l'origine jusqu'à la marge.
## B. Acteurs
Prospect, secrétaire, commercial terrain, dirigeant, système.
## C. Experts mobilisés et **compromis**
Meta Ads / génération de leads · CRO / landing · attribution · secrétariat/Sales Ops · UX formulaires · data architect · privacy/RGPD · dirigeant · client âgé/méfiant.
**Confrontation « champs du formulaire »**
- Marketing/commercial : *veulent* adresse, type de bien, photos, urgence, budget → meilleurs RDV.
- CRO : chaque champ **réduit la conversion** (surtout mobile Meta) ; le formulaire natif Meta pré-remplit prénom/téléphone/e-mail.
- Secrétaire : peut récupérer le reste **pendant l'appel** en 90 s.
- Data : distinguer *nécessaire maintenant* de *peut attendre*.
- Privacy : minimisation + consentement clair.
- Client méfiant/âgé : préfère être **rappelé** qu'écrire un long texte.
- Automatisation : peut déduire ville/zone du code postal, jamais l'urgence.
➡ **Compromis** : formulaire = **prénom, téléphone (pré-rempli), code postal, type de problème (4 choix), urgence (oui/non « ça coule »)**. Tout le reste est **demandé au téléphone** ou **déduit**. Photos : **proposées après** par SMS (lien) *si* le prospect le souhaite (pas dans le formulaire).
| Décision | Bénéfice | Coût/friction | Complexité | Risque | Maintenance | Impact business | Impact utilisateur | Impact technique |
|---|---|---|---|---|---|---|---|---|
| Formulaire à 5 champs | ↑ conversion, ↓ CPL | qualification par téléphone | faible | leads moins riches | faible | +leads | effort minimal | webhook simple |
| Photos via SMS post-lead | RDV mieux préparés | 1 étape de plus, facultative | moyenne | abandon | moyenne | + qualité | opt-in | lien signé + upload |
| Question « source » obligatoire au téléphone | vérité d'attribution | 1 tap | faible | – | faible | +mesure | négligeable | champ |
## D. Entrées
Formulaire Meta/landing, appel entrant, WhatsApp/SMS entrants, QR scanné, porte-à-porte, parrainage, ancien client, Google Business, site.
## E. Parcours client
Voit l'annonce → laisse prénom/téléphone/CP/problème/urgence → **reçoit un accusé immédiat** (« Bonjour Mme Dupont, nous vous rappelons sous 15 min (aujourd'hui 8 h-19 h). Urgence : appelez le … ») → est rappelé → répond 3-4 questions → choisit un créneau → confirmation. Clics ≈ 5 ; informations répétées : 0 ; attente sans nouvelles : jamais > SLA (sinon message d'excuse + rappel). **Inquiétude** : « est-ce sérieux/arnaque ? » → accusé avec nom de l'entreprise, photo/lien d'avis ; **ne pas sur-communiquer** : max 1 SMS + 1 e-mail avant contact.
## F. Parcours employé
Secrétaire : file « À rappeler » → carte du lead (score expliqué, source, urgence) → **Appeler** (tel:) → écran d'appel pré-rempli → qualifier → RDV. Commercial terrain : « Nouveau contact » en 3 taps. Dirigeant : voit les leads non traités.
## G. Parcours système (Speed-to-lead engine, section 91)
T+0 création · +2-5 s : normalisation téléphone (E.164), **déduplication**, attribution (règles), accusé au prospect, notification · SLA de réponse **selon contexte** (voir table) · **arrêt immédiat** dès qu'il répond ou qu'un humain prend la main.
| Contexte | Premier contact visé | Tentatives | Escalade |
|---|---|---|---|
| Urgence « ça coule » (heures ouvrées) | ≤ 5 min | 3 en 30 min | manager à T+10 |
| Urgence hors heures | accusé + numéro d'urgence ; rappel à l'ouverture | – | notif dirigeant si > 2 h après ouverture |
| Standard (heures ouvrées) | ≤ 15 min | 3 sur 24 h (T+15 min, +3 h, +J+1) | manager à T+1 h |
| Standard hors heures/week-end | rappel à l'ouverture suivante, accusé immédiat | 3 | manager si pas traité à J+1 midi |
| Entretien / info | ≤ 4 h ouvrées | 2 | – |
Les délais sont **paramétrables** ; valeurs initiales à valider avec l'entreprise pilote (capacité réelle des secrétaires).
Séquence sans réponse : appel (T+15 min) → SMS « nous n'arrivons pas à vous joindre » (T+30) → appel (T+3 h) → e-mail (J+1) → dernier appel + SMS (J+2) → **clôture douce** (J+5) réactivable. **Aucune relance après réponse**, pas d'appels hors 8 h-20 h, plafond de tentatives.
## H. UX desktop
File de leads : colonnes *Prénom · Problème · Urgence · Source · Âge du lead (compteur T+, rouge > SLA) · Score (raisons au survol) · Prochaine action*. Raccourcis : `↓/↑` naviguer, `Entrée` ouvrir, `A` appeler, `R` rappeler +1 h, `N` note, `Q` qualifier. Recherche/commande `/` . Sauvegarde automatique du brouillon de qualification.
## I. UX mobile
Carte plein écran « Prochain lead » : nom, problème, urgence, **[Appeler]** (gros bouton), [Rappeler plus tard], [Pas joignable]. Swipe droite = appeler, gauche = reporter. Une main.
## J. Données
Créées : `lead`, `contact` (ou rapproché), `attribution`, `event(lead_created)`, `consent`. Lues : règles d'attribution, heures ouvrées. Modifiées : statut du lead, `first_response_at`.
**Attribution enregistrée** : `first_touch` (source d'origine, jamais écrasée), `last_touch` (source de conversion), `campaign_id/adset_id/ad_id/creative`, UTM, `landing`, `qr_id`, `commercial_id/secteur`, `referrer_id` — un dirigeant comprend « d'où vient-il / qu'est-ce qui l'a décidé ».
## K. Automatisations
`lead_created` → normaliser → dédoublonner → attribuer → accusé → notifier → créer tâche/SLA → programmer relances. `lead_replied` → stopper. `lead_untouched > SLA` → escalader. `lead_duplicate_detected` → proposer la fusion.
## L. IA
**PAS D'IA NÉCESSAIRE au MVP** pour la création du lead. V2 : résumé d'appel → brouillon de fiche (validé par la secrétaire) ; classification du texte libre du formulaire en catégories (proposée, jamais imposée).
## M. Permissions
Secrétaire/commercial : voir et traiter leads non attribués + les leurs ; technicien : aucun accès aux leads ; dirigeant : tout + règles d'attribution ; comptabilité : aucun.
## N. Notifications
URGENT : lead « ça coule » (push + SMS au responsable d'astreinte). À FAIRE : nouveau lead standard (badge Action Center, pas de son). INFORMATION : lead dupliqué fusionné (journal). Regroupement : max 1 notification toutes les 10 min pour les leads standard.
## O. Edge cases
Doublon (même téléphone, autre nom) → fusion proposée ; faux numéro → tâche « vérifier » ; formulaire spam → rate limit + score ; lead hors zone → réponse polie + orientation ; prospect existant client → rattachement au contact + alerte « client, ancien chantier 2025 » ; deux formulaires en 1 h → un seul dossier ; lead reçu sans consentement → traitement limité (rappel oui, marketing non).
## P. Error states
Webhook Meta en échec → file de rejeu + alerte « 0 lead depuis 12 h, moyenne 5 » ; SMS échoué → e-mail + statut ; téléphone invalide → champ « corriger » sans bloquer le lead ; API indisponible → import CSV des leads (mode manuel).
## Q. Sécurité
Signature webhook, limitation de débit, anti-spam, minimisation (pas de données inutiles), consentement horodaté, jeton OAuth chiffré, journal des accès aux leads.
## R. Analytics
`lead_created`, `lead_deduplicated`, `lead_assigned`, `lead_contacted`, `lead_replied`, `lead_qualified`, `lead_lost`, `sla_breached`.
## S. KPI
Délai de 1ʳᵉ réponse (médiane, p90), % contactés < SLA, taux de contact, taux lead→qualifié, lead→RDV, CPL, % leads dupliqués, part « non attribué ».
## T. Friction actuelle
Leads dans WhatsApp/cahier, pas de SLA, source inconnue, rappel oublié.
## U. Simplification 10×
Un formulaire à 5 champs, pré-rempli ; tout le reste déduit ou demandé au téléphone ; la file se trie seule ; **un bouton : Appeler**.
## V. Risques
Produit : leads moins qualifiés → mitigé par l'urgence + question de qualification. Humain : la secrétaire contourne (rappelle depuis son téléphone) → intégration téléphonie/journal d'appel V2. Business : coût Meta. Technique : disponibilité de l'API Meta, délivrabilité SMS.
## W. Acceptance criteria
- Un lead Meta apparaît < 10 s avec source/campagne/annonce ; - doublon détecté sur téléphone identique ; - accusé envoyé < 1 min ; - un lead non pris à T+SLA passe rouge et déclenche l'escalade ; - une réponse du prospect arrête les relances ; - aucune relance hors horaires ; - le lead conserve `first_touch` même si le `last_touch` diffère ; - export CSV possible en cas de panne d'intégration.
## X. MVP
Lead manuel/CSV/formulaire simple + source obligatoire + file avec compteur T+ + doublons + accusé e-mail/SMS + tâche/SLA + escalade manager.
## Y. Version avancée
Meta Lead Ads + dépenses, téléphonie (numéros par source, résumé d'appel), QR/porte-à-porte, WhatsApp, qualification adaptative (arbres), attribution complète, marge par source.
## Z. Décision recommandée
Un **noyau Lead** unique (table `lead` + `attribution` + `event`) alimenté par des **adaptateurs d'entrée** interchangeables (Meta, formulaire, appel, QR, manuel), un **moteur SLA/relance** paramétrable, une **file de travail** par rôle (Action Center), et **aucune donnée demandée deux fois**.

## Qualification adaptative et urgences (sections 92–93)
**Arbre (extrait à valider avec un couvreur)** — questions posées **par la secrétaire**, une à la fois, sautées si déjà connues :
- *Problème ?* → **Infiltration/fuite** → (1) « Ça coule maintenant ? » (2) « Depuis quand ? » (3) « Où (plafond, mur, combles) ? » (4) « Étage/type de bien ? » (5) « Photos possibles par SMS ? ».
- → **Tuiles/ardoises abîmées** → (1) après un épisode météo ? (2) zone visible ? (3) accessibilité ; → **Mousse/entretien** → surface approximative, dernier entretien ; → **Gouttière/zinguerie** → où, fuite ? ; → **Rénovation/réfection** → surface, âge, projet, délai ; → **Autre**.
Communs : propriétaire/locataire, disponibilités, occupant présent.
**Urgence** : le système **pose des questions structurées** et propose un niveau **opérationnel** (À traiter aujourd'hui / cette semaine / planifié) ; **il ne qualifie jamais un risque pour les personnes ou la structure** (effondrement, électricité + eau) : ces mots-clés déclenchent une **consigne de sécurité standard** (« mettez-vous en sécurité, coupez…, appelez les secours si danger ») et une **validation humaine immédiate**. Décision finale de priorité : humain.

## Prise de RDV et routage (94–96) — décisions pour l'Étape 4
Proposer *meilleur créneau* + 2 alternatives avec justification (« même secteur que 10 h, +8 min »), tenant compte de type/durée/zone/compétence/trajet ; MVP = règles de score explicables (pas de solveur) ; brief automatique au technicien + confirmation client.

## Acquisition physique trackable (122–123, 125–126)
Modèle simple compris par un dirigeant : **Source d'origine** (first touch) et **Source de conversion** (last touch), montrées côte à côte ; le rapport « par source » utilise l'origine par défaut. Chaîne complète `dépense → lead → vente → CA → coûts → marge` (pas seulement ROAS). QR par (commercial × zone × support × campagne) ; chantier actif → suggestion d'action locale (panneau, flyer, demande de recommandation, contenu autorisé) et mesure « chantier source → leads → ventes ».

---------------------------------------------------------------------------------------------------
# RED TEAM de l'Étape 2
| Attaque | Faiblesse | Correction |
|---|---|---|
| La secrétaire n'appelle pas dans les 5 min | SLA irréaliste en petite équipe | SLA **paramétrable** + astreinte + rappel automatique au dirigeant ; heures ouvrées |
| Le formulaire à 5 champs donne des leads « froids » | qualification 100 % humaine | question « ça coule ? » + arbre + score expliqué |
| L'attribution Meta est faussée (appel direct) | perte de l'origine | question « comment nous avez-vous connus ? » obligatoire ; numéros par source (V2) |
| Trop de SMS/relances → harcèlement | image, désinscriptions | plafond, horaires, arrêt à la réponse, opt-out |
| Doublons partout | fiches multiples | clé téléphone/e-mail/adresse + fusion assistée |
| API Meta tombe une nuit | leads perdus | alerte business + rejeu + import CSV |
| Contournement (WhatsApp perso) | données hors système | numéro WhatsApp entreprise intégré (V2), saisie 3 taps |
| RGPD : prospection sans base légale | risque légal | consentement/intérêt légitime documenté, opt-out, minimisation (à valider juridiquement) |
# SIMPLIFICATION (−30 %)
Supprimés du MVP : score « intelligent » (on garde 5 règles visibles), photos dans le formulaire, séquence à 6 étapes (on garde 3 tentatives + clôture douce), attribution multi-touch complète (first/last suffisent), IA de classification. Fusion : « accusé » + « notification » dans un même événement `lead_created`.
# SIMULATION (Mme Dupont, mardi)
- **08:12:00** Mme Dupont valide le formulaire Meta (prénom, 06…, 33000, « infiltration », « ça coule : oui »).
- **08:12:03** lead créé (source Meta / campagne « Fuite Bordeaux » / annonce B) ; **08:12:04** doublon vérifié (aucun) ; **08:12:05** attribution → file secrétariat ; **08:12:07** SMS d'accusé « … rappel sous 5 min ».
- **08:12:08** notification push + carte rouge « URGENT » chez Nadia ; compteur T+ démarre.
- **08:15** Nadia clique **Appeler** ; **08:16** écran d'appel : 5 questions de l'arbre « infiltration » (elle en saute 2 : le code postal donne la zone) ; consigne de sécurité rappelée ; **08:19** RDV proposé : *aujourd'hui 14 h Julien (+6 min de trajet)* ; Mme Dupont accepte ; **08:20** confirmation SMS/e-mail + brief technicien envoyés ; le lead passe *RDV fixé*, première réponse = **3 min 53 s** ; les relances sont annulées.
- **08:21** le dirigeant voit dans le cockpit : « 1 lead urgent traité en 4 min ».
# DÉCISIONS VALIDÉES (à valider par vous)
D1–D7 (voir 1.9) ; formulaire à 5 champs ; SLA paramétrables ; first/last touch ; pas d'IA au lead en MVP ; consigne de sécurité et validation humaine pour toute urgence.
# HYPOTHÈSES À TESTER
H1–H5 + H6 « 5 champs suffisent pour un CPL acceptable » (test A/B) · H7 « la secrétaire rappelle en < 15 min en moyenne » (mesure pilote) · H8 « les prospects acceptent d'envoyer des photos par SMS » · H9 « les SLA proposés sont tenables » .
# QUESTIONS BLOQUANTES POUR VOUS
1. Pays/juridiction cibles (France seule au départ ?) ; 2. horaires d'ouverture et existence d'une astreinte urgences ; 3. qui rappelle un lead (secrétaire ou commercial) chez vos premiers clients ; 4. utilisez-vous déjà Meta Lead Ads ou une landing page ; 5. faut-il des numéros de téléphone dédiés par source dès la V1 ; 6. validez-vous l'arbre de qualification infiltration/entretien/rénovation avec un couvreur.
# DONNÉES À CONSERVER POUR LA SUITE
`lead` (statut, SLA, first_response_at), `attribution` (first/last touch), `contact`, préférences/consentements, réponses de qualification (structurées), urgence, source, canal de contact, historique de tentatives.
# DÉPENDANCES AVEC L'ÉTAPE SUIVANTE (Étape 3 — Lead + qualification → Étape 4 RDV)
Contact/Propriété/Toiture créés à la qualification ; règles d'attribution ; heures ouvrées et disponibilités des ressources ; canaux SMS/e-mail ; consentements ; arbre de qualification (données réutilisées dans le brief technicien et le diagnostic pré-rempli).

---
*Prochaine étape après votre validation : Étape 3 — Lead + qualification (écran d'appel, arbres, doublons), puis Étape 4 — Prise de rendez-vous.*
