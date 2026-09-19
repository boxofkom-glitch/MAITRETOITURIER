# PARTIE 4 — IA, automatisations, dashboards, UX/UI, écrans (sections 22 à 26)

## 22 — IA métier (cadre commun)
**Règles** : (1) l'IA **prépare**, l'humain **valide** ; (2) chaque sortie IA est marquée, avec niveau de confiance et sources ; (3) jamais de décision technique, de prix ou d'envoi client sans validation ; (4) repli toujours disponible (saisie manuelle) ; (5) coût plafonné par entreprise et journalisé ; (6) données du client jamais utilisées pour entraîner un modèle tiers sans accord contractuel ; (7) clé API côté serveur uniquement **[SERVEUR]**.
| Assistant | Pour qui / quand | Entrée | Traitement | Sortie + interface | Validation | Erreur / repli | Métrique |
|---|---|---|---|---|---|---|---|
| Secrétariat | secrétaire, après un appel | enregistrement/transcription | résumé, extraction adresse/problème/urgence/disponibilités | brouillon de fiche pré-remplie, champs surlignés | secrétaire | transcription vide → formulaire manuel | temps par appel, % champs corrects |
| Diagnostic | technicien, fin de zone/visite | dictée, photos, constats | observations structurées par zone, infos manquantes | propositions « suggéré » à accepter/modifier | technicien | IA indisponible → saisie | minutes gagnées, % acceptées |
| Rapport | technicien, avant envoi | constats validés | rédaction du texte client (ton, pédagogie) | brouillon dans la trame de marque | technicien | modèle par défaut du catalogue | délai diagnostic→envoi |
| Devis | commercial | constats + catalogue | structure de lignes, quantités, options | brouillon de devis | commercial (prix/contenu) | devis vide | délai diagnostic→devis |
| Relance | commercial | historique du devis | brouillon SMS/e-mail, meilleur moment | 1 action proposée | commercial | modèle standard | taux de réponse |
| Chantier | chef d'équipe/bureau | journal, photos | compte rendu de journée, blocages déclarés | résumé à valider | chef d'équipe | journal brut | temps de reporting |
| Dirigeant | dirigeant | données internes | réponses à des questions (« pourquoi le taux de signature a baissé ? ») avec **chiffres et liens vérifiables** | réponse + requête/tableau source | lecture | « je ne sais pas » explicite | usage hebdo |
**Assistant dirigeant — conception** : pas de texte libre vers une base ; le modèle choisit parmi des **requêtes analytiques prédéfinies** (fonctions de lecture avec le périmètre de l'utilisateur), reçoit les résultats et les commente ; toute affirmation cite le tableau/filtre ; si la donnée manque, il le dit. Cela évite hallucinations et fuites entre entreprises.
**Ce qu'on ne fait pas** : verdict visuel de défaut, chiffrage automatique envoyé, relance envoyée sans clic, réponse automatique à un client mécontent, agent vocal autonome en V1.
**Coût/valeur** : usage payant par volume (transcription, brouillons) dans le plan ; plafonds ; tableau de bord interne du coût IA par entreprise.

## 23 — Automatisations
**Moteur** : `Déclencheur (événement) → Conditions → Actions`, avec **exécution journalisée** (qui/quoi/quand/résultat), **désactivable**, **simulable** (« que se passerait-il sur ce dossier ? »), **idempotente** (clé = règle + objet + version), **limitée** (plafond d'envois par client/jour).
**Catalogue de règles fournies** (modifiables par l'entreprise, pas de code) :
- `lead_created` → attribuer (secteur/charge) → SMS d'accusé → tâche d'appel (T+1 min).
- `lead_untouched_5min` → alerte manager ; `+30min` → 2ᵉ tentative.
- `appointment_booked` → confirmation ; `J-1` → rappel ; `no_show` → tâche de recontact.
- `diagnostic_completed` → rapport en brouillon + notification technicien → validation → envoi.
- `estimate_sent` → suivi de consultation → relances J+2/5/10/21.
- `estimate_signed` → chantier + facture d'acompte + tâche approvisionnement `[EXISTE partiel]`.
- `payment_received` → maj étape, tâche fermée, statut chantier `[EXISTE partiel]`.
- `job_completed` → facture de solde `[EXISTE]` → contrôle qualité → satisfaction (J+2).
- `satisfaction_ok` → demande d'avis + code parrain ; `satisfaction_ko` → ticket SAV.
- `maintenance_due` → opportunité + rappel J-30.
- `invoice_overdue` → séquence de relance de paiement.
**Automatisations dangereuses (garde-fous)** : envoi massif → confirmation + plafond ; suppression/fusion automatique → jamais ; changement de prix → jamais ; boucles (A déclenche B qui déclenche A) → profondeur max 3 ; règles contradictoires → priorité explicite et alerte à l'enregistrement.
**Interface** : éditeur en phrases (« Quand … et si … alors … ») avec modèles ; pas de canevas visuel complexe.

## 24 — Dashboards et cockpit
**Cockpit dirigeant « Ce qui nécessite ton attention aujourd'hui »** : liste d'exceptions calculées, chacune avec un bouton d'action : `3 leads non contactés (> 15 min)` · `2 devis > 3 000 € sans relance` · `1 chantier bloqué` · `1 paiement en retard` · `2 SAV ouverts` · `4 clients à recontacter (entretien dû)` · `campagne X : CPL +40 % sur 3 jours`. Seuils paramétrables ; « tout est sous contrôle » quand vide. `[EXISTE partiel : Ma journée (urgent/aujourd'hui/à venir), KPI, à encaisser.]`
**Niveaux** : *Aujourd'hui* (leads, RDV, diagnostics, devis, signatures, chantiers, encaissements, problèmes) · *Commercial* (source, conversion, CA, panier, délai, par commercial) · *Marketing* (coût, CPL, CAC, CA attribué, marge, ROAS) · *Production* (chantiers, retards, productivité, SAV) · *Finance* (signé, produit, facturé, encaissé, impayé, marge).
**Règle** : 6 chiffres maximum par écran, chacun cliquable jusqu'aux dossiers ; comparaison période précédente ; pas de graphiques décoratifs.
**Commercial** : « Mes 12 actions », mon portefeuille, ma performance (vs mon passé). **Technicien/poseur** : uniquement « Aujourd'hui ».

## 25 — UX/UI
**Design system** (DA existante protégée : noir neutre + or unique, Playfair/Montserrat) : tokens (couleur, espacement 4/8, rayon, ombres), composants (bouton primaire/secondaire/fantôme/danger, champ, sélecteur en chips, tableau dense avec tri/filtre, carte KPI, carte dossier, timeline, calendrier, kanban, galerie photo, modale/bottom-sheet, toast, état vide/chargement/erreur), icônes SVG cohérentes `[EXISTE partiel]`.
**Navigation PC** : barre latérale (rôle-dépendante) + **recherche universelle (⌘K)** + bouton « + Créer » (client, RDV, diagnostic, devis, facture, entretien) + cloche de notifications hiérarchisées.
**Navigation mobile** : barre basse 4 + « Plus » `[EXISTE]`, écran d'accueil = prochaine action, bottom-sheets à la place des modales pleine page, gestes (glisser pour appeler/naviguer), aucun défilement horizontal `[EXISTE]`.
**Formulaires** : pré-remplissage par contexte ; champs par choix ; validation en ligne ; brouillon auto ; « un CTA principal par écran ».
**Principe d'expérience** : chaque écran répond à *« que dois-je faire ? »* avant *« que puis-je voir ? »*.

## 26 — Écrans (fiches pour le designer)
Format : Objectif · Utilisateurs · Données · Composants · CTA principal / secondaires · États vide/chargement/erreur · Permissions · Mobile · Automatisations.
| # | Écran | Objectif | Utilisateurs | CTA principal | Mobile | Automatisations |
|---|---|---|---|---|---|---|
| 1 | Connexion / inscription salarié / mot de passe oublié `[EXISTE]` | accès sécurisé | tous | Se connecter | plein écran | e-mails de marque |
| 2 | Cockpit dirigeant | exceptions du jour | dirigeant | traiter l'exception | cartes empilées | seuils |
| 3 | Ma journée / Mes 12 actions | prochaine action | tous | action n°1 | liste priorisée | scoring |
| 4 | File de leads | speed-to-lead | secrétaire, commercial | Appeler | cartes swipe | T+1/5/30 |
| 5 | Appel entrant | identifier/qualifier/RDV | secrétaire | Créer/RDV | — (PC) | résumé IA |
| 6 | Fiche client 360 `[EXISTE]` | source unique | tous selon droits | prochaine action | onglets | timeline |
| 7 | Fiche toiture / carnet de santé | mémoire technique | tous | Nouveau diagnostic | frise | rappels |
| 8 | Agenda (jour/semaine/équipe/carte) `[EXISTE partiel]` | planifier | secrétaire, dirigeant | Nouveau RDV | vue jour | meilleurs créneaux |
| 9 | Diagnostic guidé `[EXISTE]` | capturer le constat | technicien | Terminer | plein écran, offline | validation IA |
| 10 | Rapport (aperçu/envoi) `[EXISTE]` | valider et envoyer | technicien | Envoyer | partage natif | suivi d'ouverture |
| 11 | Pipeline / suivi commercial `[EXISTE]` | avancer les affaires | commercial | Gagné | filtres par étape | relances |
| 12 | Devis (création/édition/PDF) `[EXISTE]` | vendre | commercial | Envoyer | wizard | brouillon IA |
| 13 | Facturation & paiements `[EXISTE]` | encaisser | admin | Paiement | modale | relances |
| 14 | Chantiers (liste + fiche) `[EXISTE partiel]` | exécuter | conducteur, poseur | Démarrer | fiche du jour | journal |
| 15 | Planning équipes/ressources | affecter | dirigeant, conducteur | Affecter | — | météo |
| 16 | Journal + photothèque chantier | prouver/suivre | tous | Ajouter photo | capture rapide | consentement |
| 17 | Contrôle qualité / réception | clôturer | chef d'équipe | Réceptionner | checklist | tâches |
| 18 | SAV (tickets) | résoudre | secrétaire, technicien | Créer ticket | fiche | garantie |
| 19 | Entretien (contrats, campagnes) `[EXISTE partiel]` | récurrence | commercial | Proposer contrat | liste | rappels |
| 20 | Acquisition (sources, campagnes, QR, coûts) | mesurer | dirigeant, marketing | Nouvelle campagne | résumé | webhooks |
| 21 | Rentabilité (source/chantier/type) | décider | dirigeant | filtrer | chiffres clés | — |
| 22 | Portail client | transparence | client | Signer/payer | mobile-first | notifications |
| 23 | Paramètres (équipe, accès, entreprise) `[EXISTE]` | configurer | directeur | Enregistrer | — | — |
| 24 | Personnalisation (catalogue, questions, paiements, modèles) `[À FAIRE]` | évoluer sans dev | directeur | Ajouter | — | — |
| 25 | Import / export / sauvegarde `[À FAIRE]` | migrer | directeur | Importer | — | — |
| 26 | Notifications | hiérarchie | tous | Traiter | centre | règles |
| 27 | Automatisations | régler | admin | Activer | — | — |
| 28 | Recherche universelle | retrouver | tous | Ouvrir | plein écran | — |
États communs : **vide** = explication + action (« Aucun devis : Créer le premier ») ; **chargement** = squelettes ; **erreur** = message humain + réessayer + garder la saisie ; **permission refusée** = explication + demander l'accès.

---
**Suite (Partie 5)** : data model, architecture technique, API, intégrations, sécurité, conformité, analytics.
