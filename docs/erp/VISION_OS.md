# Maître Toiturier — vision « système d'exploitation d'une entreprise de couverture »

Ce document part de **ce qui existe réellement dans l'application aujourd'hui** (état du dépôt, septembre 2026),
puis développe la suite. Ambition maximale pour la vision, discipline maximale pour le MVP.
Limite honnête : l'application est 100 % navigateur (pas de serveur) ; tout ce qui suppose un envoi automatique,
un partage temps réel entre appareils ou une API tierce (Meta Ads, Google…) est marqué **[serveur]**.

---------------------------------------------------------------------------------------------------

## ÉTAPE 1 — AUDIT

### Ce qui existe déjà (construit et testé)
- Dossier client unique (Résumé / Activité / Diagnostic / Rapport PDF / Suivi commercial / Devis & factures / Chantier / Matériel / Documents), historique horodaté, tâches, notes.
- Diagnostic terrain guidé (8 points, états, anomalies, photos, cause d'absence de photo, synthèse) → brochure PDF de marque.
- Devis versionnés (bibliothèque de prestations, TVA, conditions de règlement), factures (acompte / solde / échéancier), paiements (virement annoncé vs confirmé), PDF devis/facture à la trame de marque, envoi WhatsApp/e-mail avec pièce jointe (téléphone).
- Processus commercial **piloté par les données** : Devis envoyé → *Gagné* (chantier + facture(s) créés automatiquement) → *Impayé* → *Payé*, y compris en plusieurs échéances.
- Chantier (statut, équipe de pose, checklist, photos avant/pendant/après, incidents) ; création automatique de la facture de solde à la fin du chantier ; préparation du matériel par type de chantier + agenda.
- Rôles (directeur, admin, technicien, commercial, client), matrice d'accès par onglet et par niveau, inscription salarié → demande d'accès → acceptation, invitations, mot de passe oublié, e-mails de marque.
- Données communes à l'équipe ; création par rôle avec affectation obligatoire de l'autre rôle ; recherche/filtres/pagination des dossiers.
- Mobile : navigation basse façon application native, zéro défilement horizontal.

### À conserver absolument (fondations validées)
Identité et DA (noir + or unique), trame PDF diagnostic / devis / facture, logique du diagnostic, bibliothèque de prestations,
principe « un dossier = une source de vérité », PC = centre de commandement / mobile = outil d'exécution.

### Incomplet
- **Persistance** : les données vivent en mémoire (perdues au rechargement) → IndexedDB + export/import (prévu, non livré).
- **Personnalisation sans développeur** (catalogue, questions/réponses du diagnostic, moyens de paiement) — spécifié, non livré.
- Mobile : les rôles ne voient pas encore un écran « Que dois-je faire maintenant ? » distinct (Ma journée existe côté accueil).
- Chantier : planning multi-jours, matériaux commandés, réception signée, dépenses/marge non faits.

### Mal connecté
- **Client ≠ Propriété ≠ Toiture** : aujourd'hui un dossier = une demande d'un client ; un même client revient sous forme de plusieurs dossiers sans lien fort.
- Le diagnostic produit un PDF et des champs libres ; les anomalies ne sont pas des objets suivis jusqu'à leur traitement.
- Le devis est saisi en lignes libres/catalogue ; le lien anomalie → ligne de devis n'est que « suggéré ».
- Entretien (contrats) et chantier ne se rattachent pas encore au même cycle de vie de toiture.

### Manque
Acquisition et attribution de source (Meta, terrain, QR, recommandation), lead/secrétariat en file de travail, avis et recommandation,
carnet de santé de la toiture, analytics de marge, SAV/garanties, notifications, recherche globale, mode hors connexion réel.

### Peut devenir beaucoup plus puissant
Anomalie comme objet métier ; toiture comme mémoire technique ; chantier comme moteur d'acquisition locale ; IA de brouillon avec validation humaine ;
attribution campagne → marge.

### Risques de complexité inutile
Multiplier les rôles avant d'avoir stabilisé 5 ; une IA « décideuse » ; un module marketing avant d'avoir la donnée de marge propre ;
la comptabilité complète (rester sur devis/facture/paiement + export comptable).

---------------------------------------------------------------------------------------------------

## ÉTAPE 2 — MODÈLE MÉTIER

### Entités (une seule source de vérité)
```
Source d'acquisition ──► Lead ──► Contact (client / prospect)
                                     └─► Propriété (adresse, type, occupant)
                                            └─► Toiture (matériaux, surface, âge) ──► Carnet de santé
Toiture ──► Rendez-vous ──► Diagnostic ──► Constats (donnée structurée) ──► Anomalies (objets suivis)
Anomalies ──► Opportunité ──► Devis (lignes liées aux anomalies) ──► Signature
Signature ──► Chantier (lignes reprises du devis) ──► Équipe de pose ──► Photos avant/pendant/après ──► Réception
Réception ──► Facture(s) ──► Paiements ──► Marge (produits vendus − coûts réels)
Chantier clos ──► SAV / garantie ──► Entretien (contrat, rappel) ──► Prochain diagnostic
Chantier clos ──► Avis / recommandation / contenu autorisé ──► Nouveaux leads (voisinage, QR de chantier)
```

### Orchestration des transitions (événement → effets automatiques)
| Transition | Déclencheur | Effets automatiques |
|---|---|---|
| Lead → RDV | secrétaire planifie | tâche + agenda technicien + SMS/e-mail de confirmation [serveur] |
| RDV → Diagnostic | technicien démarre | itinéraire, dossier ouvert, checklist matériel |
| Diagnostic validé → Opportunité | validation technicien | rapport PDF, transmission au commercial, anomalies « commercialisables » |
| Opportunité → Devis | commercial | lignes proposées depuis les anomalies |
| Devis → **Gagné** | bouton / signature | chantier créé, facture d'acompte, tâche d'encaissement, étape « Impayé » (**livré**) |
| Paiement enregistré | admin / commercial | étape mise à jour, tâche fermée, statut chantier « prêt à planifier » (partiel livré) |
| Chantier terminé | poseur | facture de solde créée (**livré**), demande d'avis, planification du contrôle |
| Solde payé | paiement | dossier soldé, entretien proposé, parrainage proposé |
| Entretien dû | date | rappel, nouveau diagnostic, nouvelle opportunité |

Règle : une transition ne crée jamais de ressaisie ; elle **calcule** l'étape à partir des données (déjà appliqué au suivi commercial).

### Anomalie — cycle de vie proposé (challenge de la version initiale)
`DÉTECTÉE → VALIDÉE (technicien) → COMMERCIALISABLE (règle : sévérité ≥ seuil) → DEVISÉE → ACCEPTÉE → PLANIFIÉE → TRAITÉE → CONTRÔLÉE → RÉSOLUE`
Ajouts : **REFUSÉE_CLIENT** (à re-proposer à l'entretien), **SURVEILLÉE** (pas de devis, contrôle à J+6 mois), **RÉCURRENTE** (même zone, 2ᵉ occurrence → signal SAV).
Chaque anomalie : zone, type, sévérité (échelle métier à valider avec vous), photos avant/après, diagnostic source, devis/chantier liés.

### Acquisition et attribution
`Source` (type : meta, terrain, QR, flyer, partenaire, recommandation, Google, appel, chantier-voisin) + `Campagne` + `Commercial/Secteur` + `Code QR unique`.
Chaîne de mesure : dépense → lead → RDV → diagnostic → devis → signature → encaissement → **marge**.
Sans serveur : saisie manuelle de la source et de la dépense ; avec serveur : import Meta Ads, formulaires, suivi d'appels **[serveur]**.
Marge : nécessite le coût réel du chantier (matériaux + main-d'œuvre) → module Chantier « dépenses » avant tout tableau de rentabilité.

### Rôles et écrans
- **Gérant** : PC, marge/CA par source, alertes. **Secrétaire/Admin** : file de leads, planification, relances, facturation.
- **Commercial** : « Mes RDV / Mes opportunités », résultat de RDV en 3 boutons. **Technicien** : « Mes diagnostics ». **Poseur** : « Mes chantiers ».
- Futurs (hors MVP) : chef d'équipe, conducteur de travaux, comptable (lecture + exports), sous-traitant (accès à un seul chantier).
- Mobile = « Qu'est-ce que je fais maintenant ? » (une carte d'action + bouton principal). PC = tableaux denses.

### Carnet de santé de la toiture
Potentiel : mémoire technique valorisable (revente de bien, assurance, syndic), justification d'un abonnement d'entretien, base d'un modèle prédictif d'usure.
Prérequis : entité Toiture stable, constats structurés (pas de texte libre seul), photos datées et géolocalisées par zone.

### Boucle chantier → acquisition
Chantier clos → avis (lien direct) → recommandation (code parrain) → photos avant/après **avec consentement** → panneau de chantier avec QR unique → flyer voisinage (30 adresses les plus proches) → nouveaux leads sourcés « chantier-voisin ». Oui : chaque chantier peut devenir un mini-moteur local, à condition de mesurer la source.

### IA — humain dans la boucle
Dictée → observation structurée (proposée, validée par le technicien) ; résumé d'appel ; brouillon de relance / de devis / de compte rendu ; synthèse hebdo pour le gérant.
Jamais de décision technique ou de prix envoyé sans validation. Nécessite un appel API **[serveur]** (clé jamais dans le navigateur).

---------------------------------------------------------------------------------------------------

## ÉTAPE 3 — TRAJECTOIRE (discipline MVP)

1. **Fait** : dossier, diagnostic, devis, facture, paiement, chantier, rôles, mobile, e-mails, processus commercial.
2. **Prochain lot (navigateur)** : persistance IndexedDB + sauvegarde/restauration ; onglet Personnalisation (catalogue, questions/réponses, moyens de paiement) ; import CSV ; « Effacer les données de démo ».
3. **Lot données** : entité Toiture + Propriété séparées du dossier ; constats structurés ; anomalies objets ; carnet de santé (lecture).
4. **Lot acquisition (manuel)** : champ Source/Campagne/QR sur le lead, tableau CA/marge par source.
5. **Lot exécution mobile** : écrans « Mes diagnostics / Mes chantiers / Mes RDV » ; hors connexion (PWA + file de synchro) **[serveur pour la synchro]**.
6. **Lot serveur** (prérequis de tout ce qui est temps réel) : base de données + authentification réelle, e-mails transactionnels, Meta/Google, IA, notifications.

Décision d'architecture : ne pas dépenser d'énergie à rendre le navigateur « multi-utilisateur » ; le passage au serveur est le vrai saut (voir TARGET_ARCHITECTURE.md).
