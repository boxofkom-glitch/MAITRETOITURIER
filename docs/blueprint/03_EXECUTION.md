# PARTIE 3 — Exécution : planning, chantier, terrain, SAV, entretien, finance, attribution (sections 15 à 21)

## 15 — Planification et agenda intelligent
**Modèle** : `Ressource` (personne, équipe, véhicule, équipement) avec compétences, horaires, zone de base ; `Créneau/Affectation` (type : RDV, diagnostic, chantier, SAV, entretien ; durée ; lieu ; contraintes) ; `Indisponibilité` (congés, maladie).
**Meilleurs créneaux** (algorithme simple, pas d'optimisation exotique au départ) : pour une demande {type, durée, adresse, urgence} on liste les ressources compétentes et libres, puis on score chaque créneau : `− temps de trajet ajouté (avant+après)` `− écart à la date souhaitée` `+ regroupement dans la même zone le même jour` `+ priorité urgence`. Top 3 proposés avec le *pourquoi* (« +8 min de trajet, même secteur que le RDV de 10 h »). Temps de trajet : estimation par distance à vol d'oiseau × coefficient, puis API d'itinéraire **[SERVEUR/API carto]**.
**Vues** : jour / semaine / équipe / chantier / carte. `[EXISTE : jour, semaine, mois, filtre membre, événements visite/relance/matériel.]`
**Chantiers multi-jours** : durée = somme des postes du devis ÷ productivité de l'équipe ; dépendances (matériel livré, acompte reçu, échafaudage posé) ; **météo** : voir 37 (alerte, jamais annulation automatique).
**Cas limites** : technicien malade → liste des RDV impactés + réaffectation proposée + message client ; RDV chevauchant → blocage avec dérogation ; urgence → insertion et décalage proposé des moins prioritaires.

## 16 — Chantier
`[EXISTE]` : création auto au « Gagné », statut, équipe de pose, dates, consignes, checklist avant/pendant/fin, photos avant/pendant/après, incidents, facture de solde auto en fin, liste de matériel + agenda.
**Workflow cible** : Signé → acompte (statut « en attente d'acompte » ⇒ ne planifie pas sans décision explicite) → **Préparation** (matériaux issus des lignes du devis via bibliothèque, commande, équipement, accès, échafaudage) → **Planifié** → **En cours** → *Bloqué / Modifié* → **À contrôler** → **Réceptionné** → **Facturé** → **Clôturé**.
**Transformation automatique** : contact, adresse, travaux (lignes du devis → tâches de chantier), photos et constats du diagnostic (« avant »), contraintes (accès, présence), documents. Aucune ressaisie.
**Avenants** : travaux supplémentaires découverts → mini-devis créé depuis le chantier (photo + description), accord client par lien/signature, ajout au chantier et à la facture ; sans avenant, alerte « travaux non facturés » à la clôture.
**Rentabilité** : coûts réels = matériaux (achats rattachés), heures (pointage), sous-traitance, autres → **marge réelle vs marge du devis** à la clôture. `[À FAIRE]` (prérequis de 20/21).

## 17 — Application terrain (technicien, poseur, commercial)
**Principe** : « Qu'est-ce que je dois faire maintenant ? » — un écran d'accueil = **la prochaine chose** + la liste du jour.
- **Technicien** : Mes diagnostics → prochaine intervention → itinéraire (lien Maps) → appeler → **démarrer** → diagnostic guidé → photos → terminer.
- **Poseur** : Mes chantiers → fiche (client, téléphone, adresse, travaux, photos avant, consignes, matériel à cocher, documents, présence sur place) → **Arrivé / Démarrer** → photos → **Signaler un problème** (photo + 1 phrase vocale, prévient le bureau) → **Terminer** (photos après, checklist, réserves, signature client si pertinente).
- **Commercial** : Mes RDV → dossier complet (brief, diagnostic, photos, historique, objections) → itinéraire → appeler → **résultat en 3 boutons** (devis à faire / à rappeler / perdu + motif) → prochaine action.
**Ergonomie gants/extérieur** : cibles ≥ 56 px, contraste élevé, un CTA principal par écran, dictée partout où on saisit du texte, saisie par choix plutôt que par clavier, saisie possible d'une main. `[EXISTE : barre basse mobile, boutons 44 px.]`
**Hors connexion (mode dégradé)** : PWA + stockage local (IndexedDB) de la journée (missions, dossiers, listes) ; captures (photos, notes, cases) en **file de synchro** horodatée ; à la reconnexion, envoi par lots ; conflits : *dernier écrit gagne* pour les champs simples, **fusion** pour les journaux/photos (append-only) ; jamais de perte silencieuse (indicateur « 12 éléments en attente »). Photos : compression locale (≈1600 px) avant envoi. Signature client hors ligne : stockée localement puis horodatée à la synchro avec l'heure appareil. **[SERVEUR pour la synchro]** ; la partie locale est faisable côté navigateur dès maintenant.

## 18 — Journal de chantier, photothèque, contrôle qualité (regroupés)
**Journal** : timeline append-only générée par les actions (arrivée, démarrage, photos, problème, décision client, fin, contrôle) avec heure et auteur ; le dirigeant lit « où en est-on » sans appeler. `[EXISTE partiel : historique du dossier.]`
**Photothèque** : Client → Chantier → Zone → Avant/Pendant/Après ; choix de la zone avant la prise ; doublons détectés (empreinte de hachage) ; **mise en avant** de la meilleure paire avant/après (choix humain, tri assisté) ; autorisation marketing **explicite par photo/chantier** (case consentement client) avant tout usage public.
**Contrôle qualité** : checklist par type de chantier (paramétrable, cf. Personnalisation), photos obligatoires sur points critiques (faîtage, solins, étanchéité), signature du chef d'équipe, anomalies → tâches correctives avec responsable et échéance ; clôture bloquée tant que les points obligatoires manquent (dérogation tracée). Mesure : taux de retour SAV à 90 jours par type de chantier/équipe.

## 19 — SAV
**Flux** : appel/formulaire → **recherche universelle** (adresse/téléphone) → le système présente chantier, équipe, travaux, devis, photos avant/après, dates, garanties, historique → **ticket** {type : fuite, malfaçon, garantie, entretien, autre ; priorité (urgence eau) ; chantier lié ; sous garantie ? (calcul automatique)} → attribution → planification → intervention (photos, cause) → résolution → clôture + satisfaction.
**Analyse** : causes récurrentes par prestation, équipe, matériau, période (tableau « Top 5 causes de SAV ») ; alerte si une même zone d'une toiture revient (récurrence) ; coût du SAV imputé au chantier d'origine (marge réelle).
**Règle** : une insatisfaction ne part **jamais** en demande d'avis publique ; elle déclenche un ticket de résolution.

## 20 — Entretien et récurrence (cycle de vie de la toiture)
**Carnet de santé** : timeline par toiture — diagnostic 2026 → réparation → photos → entretien 2027 → nouvelle anomalie → travaux → entretien 2028. Lisible par le client (portail) et exportable (PDF « carnet de santé » utile pour vente immobilière/assurance).
**Contrats** `[EXISTE partiel : contrats d'entretien]` : formule (ponctuel, annuel, bisannuel), périmètre (inspection, nettoyage, démoussage, gouttières), prix, renouvellement ; génération automatique des visites, rappel J-30, création de l'opportunité si anomalie détectée pendant la visite (anomalies « surveillées » revues à J+6 mois).
**Campagnes saisonnières** : « avant l'hiver », « après tempête » (météo, voir 37), ciblées par ancienneté de toiture/dernier passage ; jamais de masse non ciblée. Objectif business : part de CA récurrent, taux de renouvellement.

## 21 — Finance et rentabilité
`[EXISTE]` : devis, acompte/solde/échéances, paiements (virement annoncé/confirmé), statuts Impayé/Payé calculés, tâches d'encaissement.
**À construire** : avoirs ; relances impayés (J+1, J+7, J+15 ; ton adapté) ; **coûts** (achats matériaux, heures, sous-traitance, autres) rattachés au chantier ; **marge** = CA HT − coûts ; vues : CA signé / produit / facturé / encaissé / impayé ; export comptable (CSV/FEC) **[intégration comptable]** ; paiement en ligne (lien de paiement) **[SERVEUR + prestataire]**.
**Indicateurs qui changent les décisions** : marge par type de chantier, par équipe, par source ; délai signature→encaissement ; part d'acompte ; encours client.
**Attribution marketing (regroupée ici avec 36)** : chaîne `dépense → lead → RDV → diagnostic → devis → signature → encaissement → marge` ; table `attribution` (lead_id, source_id, campagne_id, montant signé, marge réelle, date) alimentée par les événements ; rapport par source : coût, leads, CPL, taux de RDV, taux de signature, CA, marge, CAC, ROAS, délai lead→vente. **Règle de prudence** : tant que la marge réelle n'est pas saisie, on affiche « marge estimée » (issue du devis) avec un libellé clair.

## 37 (anticipé) — Météo
Usages retenus : (1) **alerte de planning** (vent/pluie prévus sur un chantier) proposant un report, décision humaine ; (2) **préparation** (bâches, matériel) ; (3) **campagne post-événement** (tempête → message aux clients de la zone avec toitures anciennes) ; (4) priorisation des urgences après épisode. Limites : prévisions fiables à 48-72 h ; jamais d'annulation automatique ; historique météo conservé sur le chantier (utile en litige). Fournisseur : API météo **[SERVEUR]**, coût faible.

---
**Suite (Partie 4)** : IA, automatisations, notifications, dashboards/cockpit, UX/UI, écrans.
