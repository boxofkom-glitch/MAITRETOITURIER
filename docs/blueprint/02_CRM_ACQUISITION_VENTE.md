# PARTIE 2 — CRM, acquisition, secrétariat, commercial, diagnostic, devis (sections 09 à 14)

## 09 — CRM métier
**Modèle** : `Contact` (personne) → `Propriété` (adresse, type de bâtiment, occupant/propriétaire) → `Toiture` (matériaux, surface, pans, hauteur, accessibilité, âge estimé) → `Dossier de travaux` (lead/opportunité/chantier). Un contact peut avoir plusieurs propriétés ; une toiture garde tout son historique (diagnostics, anomalies, chantiers, entretiens).
*Aujourd'hui* : dossier = client + demande, un seul niveau. **Évolution** : séparer Contact / Propriété / Toiture sans casser les dossiers existants (migration : chaque dossier crée son contact + sa propriété si absents ; dédoublonnage par téléphone/e-mail/adresse normalisée).

**Fiche client efficace (5 blocs, pas 40 champs)**
1. *En-tête* : nom, téléphone/WhatsApp/e-mail en un tap, badges (urgence, source, étape), prochaine action unique. `[EXISTE : Résumé + processus]`
2. *Le bien* : adresse, type de toiture, surface, ancienneté, accès — pré-rempli par le lead puis affiné au diagnostic.
3. *Le problème* : catégorie (fuite, tuiles, mousse, zinguerie, étanchéité, isolation, rénovation, urgence, entretien), description, urgence déclarée.
4. *Commercial* : score, probabilité, montant, objections (liste à choix), prochaine relance.
5. *Timeline* universelle (lead, appel, RDV, diagnostic, photos, devis, e-mail/SMS, signature, chantier, facture, paiement, SAV, entretien). `[EXISTE : Activité + historique]`
**Règle d'affichage** : un bloc n'apparaît que s'il a du contenu ou une action possible ; le reste se déplie.

**Score de lead** (transparent, jamais opaque) : urgence déclarée +30 · propriétaire occupant +15 · source à fort taux de signature (mesuré) +15 · délai de réponse < 5 min +10 · zone couverte +10 · téléphone valide +5 · budget cohérent +15. Affiché avec ses raisons, modifiable. Objectif : trier la file du matin, pas écarter des clients.

**Doublons** : clé composite (téléphone normalisé E.164, e-mail minuscule, adresse normalisée). À la création : proposition « ce client existe déjà » (bloquant si téléphone identique + nom proche). Fusion avec historique conservé. `[EXISTE partiel : blocage nom+téléphone]`

## 10 — Acquisition multicanal et attribution
**Entités** : `Source` (type + canal) · `Campagne` (budget, période, coûts) · `Lead.attribution` {source, campagne, adset/ad/créatif, UTM, QR, commercial, secteur, date, coût estimé}.
Types de source : `meta_ads`, `google_ads`, `google_business`, `seo_site`, `formulaire_site`, `appel_entrant`, `qr_terrain`, `flyer`, `porte_a_porte`, `panneau_chantier`, `vehicule`, `partenaire`, `apporteur_affaires`, `parrainage`, `ancien_client`, `chantier_voisin`, `evenement`.

**Meta Ads** **[SERVEUR]** : Lead Ads → webhook → lead créé en < 10 s avec `campaign_id/adset_id/ad_id/form_id` ; import quotidien des dépenses/impressions/clics via Marketing API ; jeton OAuth par entreprise stocké chiffré. Repli si l'API est indisponible : file de rejeu + import CSV manuel. Métriques calculées : dépense, impressions, clics, leads, CPL, leads qualifiés, RDV, taux de RDV, RDV honorés, diagnostics, devis, ventes, CA, panier moyen, marge, CAC, ROAS (CA/dépense) et **ROAS marge**, délai lead→vente.
**Limites d'attribution à assumer** : dernier contact vs premier contact (on stocke les deux, on affiche le premier par défaut et le dernier en comparaison) ; lead qui appelle sans passer par le formulaire → question systématique « comment nous avez-vous connus ? » (champ obligatoire, 1 tap) + numéro de suivi d'appel par source **[SERVEUR/téléphonie]** ; effet de marque (un client vu sur un panneau puis recherché sur Google) → source « non attribuée » explicite plutôt qu'inventée.

**Acquisition physique** (mécanismes concrets)
- **QR uniques** : un code par (commercial × secteur × support × date). Scan → page d'atterrissage courte (nom, téléphone, problème, créneau) → lead pré-attribué ; `qr_id` conservé jusqu'à la vente. Fonctionne sans serveur temps réel via page statique + formulaire, mais l'attribution centralisée exige **[SERVEUR]**.
- **Porte-à-porte** : mode terrain mobile « Nouveau contact » en 3 taps (adresse GPS auto, intérêt, rappel), tournées par rue, statuts (absent / pas intéressé / à rappeler / RDV), carte de couverture pour ne pas repasser deux fois.
- **Panneau de chantier** : QR unique par chantier + code parrain implicite ; leads « chantier-voisin » attribués au chantier source.
- **Flyers** : lot = campagne + zone + coût d'impression ; QR/numéro dédié ; coût par scan et par vente.
- **Recommandation/partenaire/apporteur** : code personnel, commission éventuelle calculée à la signature, versement suivi.
- **Organique** : Google Business (appels, itinéraires, avis), formulaire de site (webhook), pages locales, réseaux sociaux (UTM), WhatsApp/SMS entrants (numéro dédié).
**Idée plus intelligente** — *« Cartographie de rendement »* : chaque adresse contactée est un point ; le système calcule le taux de signature par rue/quartier et suggère où retourner (ou stopper), au lieu de disperser les commerciaux. Sans données personnelles de tiers non consentantes : on ne stocke que les adresses où un contact a été réellement pris ou un support déposé.

## 11 — Secrétariat
**Écran « Appel entrant »** (PC, plein écran) : champ unique *téléphone/nom/adresse* → résultats instantanés (client, propriété, dossier, SAV en cours). Trois cas :
1. *Client connu* : fiche compacte + dernier dossier + alerte (impayé, SAV ouvert, RDV demain) + boutons « Nouveau RDV / Note / SAV ».
2. *Inconnu* : formulaire minimal (téléphone déjà rempli) : nom, adresse (autocomplétion), problème (chips), urgence (3 boutons), source (1 tap). Création → lead qualifié en moins d'une minute.
3. *Rendez-vous* : panneau « Meilleurs créneaux » (voir 15) ; un clic confirme, envoie la confirmation SMS/e-mail **[SERVEUR]**, ajoute à l'agenda du technicien et prévient le commercial.
Fonctions secondaires : déplacer/annuler un RDV (motif obligatoire, statistique de no-show), file « Leads à rappeler » triée par ancienneté × score, notes rapides, transmission (« brief technicien » généré à partir de la fiche).
**IA téléphonique** : *utile* = transcription et résumé après l'appel, extraction {adresse, problème, urgence, disponibilités} → **brouillon de fiche que la secrétaire valide** ; *à éviter au début* = agent vocal qui prend des RDV seul (risque d'erreur, image de marque). Prérequis : téléphonie cloud avec webhooks et consentement à l'enregistrement **[SERVEUR + conformité]**. Mesure : temps de traitement d'un appel, taux de fiches complètes.

## 12 — Commercial : pipeline, speed-to-lead, relances
**Pipeline challengé** — trop d'étapes tue l'usage. Proposition : **7 étapes visibles**, le reste sont des *statuts calculés* :
`Nouveau → Contacté/Qualifié → RDV fixé → Diagnostic fait → Devis envoyé → Gagné → (Impayé/Payé calculés)` + `Perdu` (motif obligatoire : prix, concurrent, report, pas de réponse, hors zone, autre).
« Contacté » et « Qualifié » fusionnent (la qualification est un formulaire, pas une étape). « Relance » et « Négociation » ne sont pas des étapes mais des **états du devis** (relance n°, remise demandée). « RDV confirmé » = attribut du RDV. `[EXISTE : Gagné/Impayé/Payé calculés ; à ajouter : Nouveau/RDV fixé/Diagnostic fait auto-déduits des RDV et diagnostics.]`
**Speed-to-lead** (lead entrant) :
| Délai | Action automatique | Responsable |
|---|---|---|
| T+0 | attribution (règles secteur/charge), notification push + SMS d'accusé au prospect **[SERVEUR]** | système |
| T+1 min | tâche « appeler » en tête de file, sonnerie/alerte | secrétaire |
| T+5 min | si non pris : relance de la tâche + alerte au manager | système |
| T+30 min | 2ᵉ tentative + SMS « nous n'arrivons pas à vous joindre, créneaux : … » | secrétaire |
| T+24 h | e-mail + dernière tentative ; sinon passage « à rappeler J+2 » | système |
| T+72 h | clôture douce (« sans réponse ») avec possibilité de réactivation | système |
Détection des trous : tableau **« Ça fuit »** : leads non traités · sans prochaine action · devis non relancés · RDV non confirmés · opportunités qui refroidissent (aucune interaction depuis N jours, seuil par montant). `[EXISTE partiel : relance en retard, tâches.]`
**Moteur de relance de devis** : entrée = {jours depuis envoi, consultation, montant, source, historique} ; sortie = **une** action proposée (SMS, appel, e-mail) avec brouillon ; séquence par défaut J+2 (consultation ?), J+5 (appel), J+10 (nouvelle valeur : variante/option), J+21 (dernière relance/expiration). Le commercial valide ou saute. Arrêt automatique dès réponse/signature/perte.
**« Mes 12 actions du jour »** : score = valeur × probabilité × urgence de relance × fraîcheur ; regroupe RDV, appels, relances, encaissements ; jamais plus de 12 ; mesure : % d'actions traitées avant midi. Métriques commerciales sans effet toxique : pas de classement public, comparaison à soi-même et aux objectifs d'équipe, indicateurs de **qualité** (dossiers avec prochaine action, délai de réponse) à côté du CA.

## 13 — Diagnostic toiture (avantage concurrentiel)
`[EXISTE]` : 8 points guidés, états, anomalies à choix, photos avec cause d'absence, synthèse, brochure PDF de marque. **Protégé.**
**Évolution — la donnée d'abord** : chaque réponse devient un **constat structuré** `{zone, élément, observation(type), sévérité*, photos[], mesure?, technicien, date, source(saisie/voix/IA validée)}` ; le PDF est une sortie. (*sévérité = échelle métier à valider avec vous : bon / à surveiller / défaut / urgent — déjà présente.)
**Catégories** : couverture, faîtage, rives, noues, solins, cheminées, gouttières/zinguerie, étanchéité, ventilation, isolation visible, charpente visible, infiltrations, mousse/lichens, évacuations, fenêtres de toit. Le **type de toiture** et la **mission** (fuite, entretien, avant travaux, expertise) sélectionnent les points pertinents (arbre de questions), sans imposer 100 champs.
**Écran mobile** : « Commencer le diagnostic » → brief (client, adresse, problème, notes secrétariat, historique) → carte des zones (schéma de toit) → par zone : état en 1 tap, anomalies en chips, photo (obligatoire si défaut), note vocale, mesure → jauge de complétude → « Terminer » → synthèse pré-remplie → validation → rapport.
**Média** : photo/vidéo/annotation (flèche, cercle), horodatées et géolocalisées, liées à la zone dès la prise (le technicien choisit la zone *avant* de photographier : pas de classement a posteriori). Hors connexion : stockage local + file de synchro `[SERVEUR pour la synchro]`.
**IA — cadrage strict**
- *Où* : après la saisie, jamais pendant la décision. *Pour qui* : technicien.
- Entrée : dictée transcrite ; photos d'une zone. Traitement : (1) dictée → observations candidates rattachées à des zones ; (2) détection d'informations manquantes (« aucune photo du faîtage », « surface non renseignée ») ; (3) suggestion de zone pour une photo. Sortie : **propositions marquées « suggéré par l'IA »** avec **niveau de confiance** ; rien n'est enregistré dans le constat tant que le technicien n'a pas validé.
- **Interdit** : affirmer un défaut ou une sévérité depuis une photo ; l'IA visuelle sert au classement et aux rappels, pas au verdict.
- Traçabilité : chaque champ garde `origine` (humain / IA-validé) et l'auteur de la validation. Repli si IA indisponible : saisie manuelle inchangée. Coût : transcription au tarif par minute — plafonné par entreprise. Métrique : minutes gagnées par diagnostic, % de propositions acceptées.
**Rapport** `[EXISTE]` : identité, bien, date, technicien, contexte, photos, observations, zones, anomalies, recommandations, priorité *validée*, travaux proposés ; validation avant envoi ; version « client » très visuelle. À ajouter : lien de consultation sécurisé (suivi d'ouverture) **[SERVEUR]**.

## 14 — Devis ultra rapide
`[EXISTE]` : bibliothèque de prestations, lignes libres/catalogue, TVA, conditions de règlement, versions, PDF de marque, envoi, statut, Gagné → facture/chantier, suggestions depuis le diagnostic.
**Diagnostic → devis en 3 gestes** : (1) le système propose une structure (anomalie → prestation liée, quantité issue de la mesure/surface, prix catalogue) ; (2) le commercial ajuste (quantités, options, remise dans la limite de son droit) ; (3) envoi. Validation humaine obligatoire ; chaque ligne garde le lien vers l'anomalie source (donc « Gagné » ⇒ anomalie « acceptée » ⇒ chantier ⇒ « traitée »).
**Catalogue** : prestation → composants (matériaux, main-d'œuvre, unité, coût d'achat, marge cible) ; **le coût sert à calculer la marge dès le devis** (marge estimée visible pour le dirigeant, masquée au technicien). Variantes et **Good/Better/Best** uniquement quand le diagnostic offre plusieurs traitements réalistes (ex. réparation ponctuelle / reprise partielle / réfection) — sinon on n'en met pas.
**Options et remises** : option cochable par le client (isolation, gouttière) ; remise avec plafond par rôle et motif ; approbation dirigeant au-delà du seuil.
**Signature** : électronique (mention « bon pour accord », horodatage, IP, e-mail/SMS de vérification) **[SERVEUR]** ; en attendant : bouton « Gagné » manuel `[EXISTE]`. **Expiration** paramétrable ; devis expiré → relance ou renouvellement 1 clic. **Acompte** : conditions au devis, facture d'acompte auto `[EXISTE]`.
**Risque à traiter** : deux personnes modifient un même devis → verrou optimiste (version) ; prix catalogue modifié après envoi → le devis garde ses prix figés.
**Métriques** : délai diagnostic→devis (cible < 24 h), taux de signature, panier moyen, part d'options prises, écart marge estimée/réelle.

---
**Suite (Partie 3)** : planification, chantier, application terrain/offline, SAV, entretien, finance, attribution marketing.
