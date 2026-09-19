# PARTIE 8 — Étapes 3 à 9 (Lead/qualification → Commercial)

Format condensé A→Z (lettres regroupées, aucune supprimée). Chaque étape se termine par RED TEAM · SIMPLIFY · SIMULATE · VALIDATE. Étiquettes MVP/V1/V2/V3. **[EXISTE]** = déjà dans l'application.
Experts mobilisés par défaut : Product Manager, UX desktop/mobile, data architect, spécialiste métier concerné, RGPD/sécurité, QA.

---------------------------------------------------------------------------------------------------
## ÉTAPE 3 — LEAD + QUALIFICATION
**A/B/C** Objectif : transformer un lead brut en **dossier qualifié exploitable en < 2 min**. Acteurs : secrétaire (principal), commercial terrain, système. Experts : Sales Ops, UX formulaires, secrétaire expérimentée/débutante, couvreur (arbre), privacy.
**D** Entrées : lead (source, problème déclaré, urgence, CP), contact éventuel existant, historique du numéro.
**E/F/G** *Client* : est rappelé, répond à 3-5 questions, n'a rien à répéter. *Employé* : ouvre la carte du lead → **Appeler** → écran d'appel → questions de l'arbre (une à la fois, préremplies si connues) → décision (RDV / rappeler / hors périmètre). *Système* : rapproche le contact, pré-charge historique/SAV/impayé, calcule l'urgence opérationnelle et le score (5 règles visibles), enregistre les réponses **structurées**.
**H** Desktop : écran d'appel plein écran en 3 colonnes (identité · questions · créneaux/actions) ; `Tab` enchaîne, `Entrée` valide, `Ctrl+Entrée` « créer + RDV » ; auto-sauvegarde du brouillon.
**I** Mobile : une question par écran, réponses en gros boutons, dictée pour la note libre.
**J/K/L** Données créées : `contact`, `property` (adresse normalisée), `roof` (type/âge estimés), `lead.qualification{questions,réponses}`, `event(lead_qualified)`. Lues : arbres, règles d'attribution. Automatisations : `lead_qualified` → proposition de créneaux ; `lead_hors_zone` → réponse polie ; doublon → fusion proposée. IA : V2 — résumé d'appel/extraction en **brouillon validé**. MVP : PAS D'IA.
**M/N** Permissions : secrétaire/commercial (leads non attribués + les leurs). Notifications : rappel planifié à l'heure choisie (« Rappeler à 14 h »).
**O/P/Q** Edge : appelant anonyme → fiche minimale ; propriétaire ≠ appelant → 2ᵉ contact ; adresse incomplète → autocomplétion + tâche ; client existant → rattachement ; urgence sécurité → consigne + validation humaine. Erreurs : autocomplétion indisponible → saisie libre normalisée plus tard. Sécurité : accès tracé, minimisation.
**R/S** Événements : `lead_qualified`, `lead_lost{motif}`, `lead_out_of_zone`. KPI : temps de qualification (cible < 2 min), % fiches complètes, taux lead→qualifié.
**T/U/V** Friction : 6 recherches pour une fiche → 1 champ unique de recherche ; questions inutiles → arbre conditionnel ; ressaisie → contact rapproché. Risque : arbre trop long → limité à 5 questions.
**W** Acceptation : recherche par téléphone/nom/adresse < 1 s ; 5 questions max ; motif obligatoire en cas de perte ; jamais deux fiches pour un même numéro.
**X/Y/Z** MVP : écran d'appel + arbre 3 branches (infiltration, entretien, rénovation) + doublons. V1 : arbres paramétrables. V2 : résumé IA. **Décision** : un seul écran de qualification, arbres **configurables** (données), pas de code par cas.
**RED TEAM** La secrétaire saute l'arbre pour aller vite → champs *obligatoires minimaux* (problème, adresse, urgence) + reste facultatif. Trop de branches → 5 questions max/branche. **SIMPLIFY** −30 % : suppression du score IA ; note libre facultative. **SIMULATE** 08:15 Nadia ouvre le lead Dupont (infiltration, urgent) → 3 questions → adresse autocomplétée → propriétaire oui → RDV proposé 08:19. **VALIDATE** valider l'arbre avec 3 couvreurs.

---------------------------------------------------------------------------------------------------
## ÉTAPE 4 — PRISE DE RENDEZ-VOUS
**A/B/C** Objectif : un créneau fiable, confirmé, sans jongler avec 6 agendas. Acteurs : secrétaire, technicien/commercial, client, système. Experts : responsable planning, UX agenda, offline/sync, notifications.
**D** Entrées : type de visite (diagnostic, chiffrage, entretien, SAV), durée, adresse (coordonnées), urgence, compétences, disponibilités, trajets.
**E/F/G** *Client* : reçoit **1 confirmation** (date, créneau, prénom du technicien, photo, numéro, comment modifier) + rappel J-1 ; peut confirmer/reporter par lien. *Employé* : voit « Meilleur créneau + 2 alternatives » avec justification, clique, terminé. *Système* : calcule les créneaux (règles de score : trajet ajouté, regroupement de zone, écart à la demande, urgence), réserve, notifie technicien + commercial, joint le brief.
**H** Desktop : panneau de créneaux dans l'écran d'appel + agenda jour/semaine/équipe avec glisser-déposer et détection de conflit. `[EXISTE partiel : agenda]`
**I** Mobile : technicien voit ses RDV du jour, peut demander un décalage (secrétaire arbitre).
**J/K/L** Données : `appointment{type,durée,ressource,adresse,statut,confirmé_le}`, `event`. Automatisations : `appointment_booked` → confirmation ; `J-1` → rappel ; `H-2` → SMS « technicien en route » (option) ; `no_show` → tâche + motif ; annulation → libération + réattribution. IA : PAS D'IA NÉCESSAIRE.
**M/N** Permissions : secrétaire écrit ; technicien lit son agenda et propose un report ; commercial lit. Notifications : client (confirmation/rappel), technicien (nouvelle mission, changement), manager (conflit).
**O/P/Q** Edge : double réservation, technicien malade (réaffectation proposée), client absent, RDV urgent inséré, fuseau/horaires d'été, adresse erronée. Erreurs : SMS échoué → e-mail + tâche d'appel. Sécurité : liens de confirmation à jeton signé, expiration.
**R/S** `appointment_booked/confirmed/rescheduled/cancelled/completed/no_show`. KPI : taux de confirmation, taux de présence, km/jour, délai lead→RDV.
**T/U/V** Friction : agendas multiples, oublis de confirmation → confirmation automatique, présence ↑. Risque : sur-communication → 1 confirmation + 1 rappel max ; algorithme opaque → justification affichée.
**W** Acceptation : créneaux proposés < 2 s ; jamais de chevauchement sans dérogation ; confirmation envoyée < 1 min ; report client par lien met à jour l'agenda.
**X/Y/Z** MVP : agenda par ressource + créneaux libres + confirmation e-mail/SMS. V1 : score de trajet. V2 : carte + tournées. **Décision** : **règles explicables** avant optimisation.
**RED TEAM** Technicien contourne l'agenda (WhatsApp) → sa mission n'existe que dans l'app ; distances approximées → API itinéraire V1. **SIMPLIFY** : pas de solveur, pas de météo au MVP. **SIMULATE** 08:19 créneau 14:00 Julien (+6 min) ; 08:20 confirmation ; 13:00 rappel ; 13:40 « Julien arrive ». **VALIDATE** faisabilité des durées types (diagnostic 45–60 min ?).

---------------------------------------------------------------------------------------------------
## ÉTAPE 5 — APPLICATION TECHNICIEN
**A/B/C** Objectif : « J'ouvre l'app et je fais mon intervention. » Acteurs : technicien, secrétaire (en amont), système. Experts : UX terrain/mobile, offline-first, accessibilité, technicien débutant/expérimenté.
**D** Entrées : mission du jour + brief (client, adresse, problème, réponses de qualification, historique de la toiture, photos envoyées par le client, itinéraire).
**E/F/G** *Client* : voit le technicien arriver à l'heure annoncée. *Technicien* : accueil = **prochaine mission** → **Itinéraire · Appeler · Démarrer** ; en fin, **Terminer**. *Système* : télécharge la journée + 2 jours (≤ 15 dossiers), horodate le démarrage, garde tout hors ligne, synchronise en arrière-plan.
**H** Desktop : vue « missions » en lecture (bureau). **I** Mobile : 1 écran par mission, gros boutons (≥ 56 px), une main, reprise automatique après interruption (brouillon permanent). `[EXISTE partiel : Ma journée, matériel]`
**J/K/L** Données : `visit{start,end,ressource}`, `event(visit_started)`. Automatisations : démarrage → statut RDV « en cours » (+ SMS client optionnel) ; fin → déclenche la finalisation du diagnostic. IA : PAS D'IA NÉCESSAIRE.
**M/N** Permissions : missions assignées uniquement ; téléphone du client visible pour la mission. Notifications : changement de mission = URGENT/À FAIRE ; le reste silencieux.
**O/P/Q** Edge : réseau absent (mode local), batterie faible, appel entrant en pleine saisie (reprise), adresse introuvable (appel), client absent (bouton « client absent » + motif). Erreurs : message clair « Sauvegardé sur cet iPhone — synchro en attente ». Sécurité : appareil perdu → verrouillage/effacement à distance (V1), PIN, session courte, pas de surveillance GPS continue (position ponctuelle à l'arrivée si consentie).
**R/S** `visit_started/completed/client_absent`. KPI : temps d'ouverture → démarrage, % missions démarrées à l'heure, % sync réussies.
**T/U/V** Friction : papier + rapports au bureau → 0 retour au bureau. Risque : adoption (peur d'être surveillé) → transparence sur ce qui est enregistré.
**W** Acceptation : la journée s'ouvre hors ligne ; démarrage en 2 taps ; reprise exacte après fermeture.
**X/Y/Z** MVP : PWA missions + brief + démarrer/terminer, offline lecture + file d'écriture. V1 : notes vocales. **Décision** : PWA, IndexedDB, file de synchro append-only.
**RED TEAM** Gants/soleil → contraste + gros boutons ; iOS limite le stockage/PWA → surveiller, plan natif si limites avérées. **SIMPLIFY** : pas de chat, pas de tableau de bord. **SIMULATE** 08:55 Julien : « Mme Dupont · 09:00 · infiltration » → Itinéraire → 09:02 Démarrer. **VALIDATE** test hors ligne 3 h sur 2 téléphones.

---------------------------------------------------------------------------------------------------
## ÉTAPE 6 — DIAGNOSTIC (adaptatif)
**A/B/C** Objectif : produire des **constats structurés comparables**, rapidement, avec preuves. Acteurs : technicien, système. Experts : technicien diagnostic/entretien, recherche de fuite, zingueur, étancheur, UX terrain, data architect, spécialiste STT (V2). `[EXISTE — protégé]`
**D** Entrées : brief, type de toiture (estimé), mission, réponses de qualification.
**E/F/G** *Client* : peut être présent, reçoit ensuite un rapport clair. *Technicien* : carte des zones → par zone : état (1 tap), anomalies (chips), photo (obligatoire si défaut), mesure, note vocale → complétude → terminer. *Système* : adapte la liste des zones/questions (type de toiture + mission), lie chaque photo à la zone **avant la prise**, vérifie la complétude.
**H** Desktop : relecture/édition au bureau. **I** Mobile : plein écran, hors ligne, auto-sauvegarde. `[EXISTE : 8 points, états, anomalies, photos, cause d'absence]`
**J/K/L** Données : `diagnostic`, `diagnostic_item{zone, élément, observation(type), sévérité, photos, mesure, origine}`, `media`. Automatisations : complétude < 100 % → bloque « Terminer » ; fin → étape Anomalies. IA V2 : dictée → observations candidates + informations manquantes (**validation obligatoire**, confiance affichée).
**M/N** Permissions : technicien écrit sur ses visites ; commercial lit ; client voit le rapport final. Notifications : aucune pendant la visite.
**O/P/Q** Edge : toiture inaccessible (motif), météo (report), fausse alerte (« aucun défaut »), plusieurs bâtiments, photos non prises (cause obligatoire `[EXISTE]`). Erreurs : upload échoué → file locale. Sécurité : photos privées, URLs signées.
**R/S** `diagnostic_started/completed`, `diagnostic_incomplete_blocked`. KPI : durée de diagnostic, % complets, photos/anomalie, taux d'informations manquantes.
**T/U/V** Friction : rapport retapé → supprimé. Risque : trop de champs → arbre adaptatif ; IA qui affirme un défaut → **interdit**.
**W** Acceptation : impossible de terminer sans les éléments obligatoires ; chaque défaut a ≥ 1 photo ou une cause ; constat structuré exportable.
**X/Y/Z** MVP : existant + persistance serveur + zones liées. V1 : arbres par type de toiture/mission, mesures. V2 : voix/IA. **Décision** : structure **standard** (comparabilité) + questions **adaptatives**.
**RED TEAM** Technicien coche vite « bon état » → contrôle de cohérence (aucune photo pour 8 zones) ; nouveaux techniciens → aides contextuelles. **SIMPLIFY** : retrait des champs « observation » libres redondants avec les chips. **SIMULATE** 09:04 Julien démarre ; 09:12 photo faîtage (zone choisie avant) ; 09:30 « fissure ~3 m » dicté → carte proposée → **Valider** ; 09:48 « 2 éléments à compléter » → corrige → Terminer. **VALIDATE** échelle de sévérité avec 3 couvreurs.

---------------------------------------------------------------------------------------------------
## ÉTAPE 7 — ANOMALIES (moteur)
**A/B/C** Objectif : faire de chaque défaut validé un **objet suivi jusqu'à sa résolution**. Acteurs : technicien (valide), commercial, chef d'équipe, système. Experts : data architect, technicien, dirigeant, RevOps.
**D** Entrées : constats validés.
**E/F/G** *Client* : voit dans son rapport « ce qui a été constaté, pourquoi, ce que nous recommandons ». *Employés* : technicien valide ; commercial voit « à devis » ; chef d'équipe voit « à traiter » ; entretien voit « à surveiller ». *Système* : crée l'anomalie, calcule le statut par événements.
**H/I** Liste d'anomalies par toiture (PC) ; carte de zones avec pastilles (mobile).
**J/K/L** Données : `anomaly{roof, diagnostic, zone, catégorie, observation, photos, sévérité, statut, devis_item, job_task, résolution, photos_après}`. Cycle (challengé) : `détectée → validée → commercialisable → devisée → acceptée → planifiée → traitée → contrôlée → résolue` + `refusée_client`, `surveillée`, `récurrente`. Automatisations : validation → commercialisable ; devis signé → acceptée ; chantier clos → contrôlée/résolue ; refusée → réapparaît à l'entretien ; 2ᵉ occurrence même zone → « récurrente » + alerte SAV. IA : PAS D'IA NÉCESSAIRE.
**M/N** Lecture large (hors poseur : tâches uniquement) ; notification au commercial à la validation.
**O/P/Q** Edge : anomalie fusionnée entre diagnostics, changement de sévérité, anomalie acceptée mais chantier annulé (retour « commercialisable »), suppression → jamais (archivage). Sécurité : audit des changements de sévérité.
**R/S** `anomaly_created/validated/quoted/accepted/resolved/recurred`. KPI : % anomalies devisées, % résolues, délai détection→traitement, récurrences.
**T/U/V** Friction : constat → devis manuel. Risque : sur-modélisation → 9 statuts affichés sous 4 groupes (À décider · En cours · Traité · Surveillé).
**W** Acceptation : chaque ligne de devis peut référencer une anomalie ; chaque anomalie a un statut calculé ; une anomalie refusée reste visible à l'entretien.
**X/Y/Z** MVP : anomalie = constat validé + statut simple (détectée/devisée/traitée). V1 : cycle complet. **Décision** : **statut calculé**, 4 groupes visibles.
**RED TEAM** Personne ne fait avancer le statut → il avance seul via événements. **SIMPLIFY** : fusionner « à analyser » dans « validée ». **SIMULATE** 09:49 fissure faîtage validée → commercialisable → 10:30 devisée → J+3 acceptée. **VALIDATE** liste de catégories avec couvreurs.

---------------------------------------------------------------------------------------------------
## ÉTAPE 8 — RAPPORT
**A/B/C** Objectif : un rapport **visuel, clair, de marque**, validé par le technicien. Acteurs : technicien, client. Experts : product designer, marketing, technicien, RGPD. `[EXISTE — trame protégée]`
**D** Constats, photos, recommandations, identité.
**E/F/G** *Client* : reçoit un lien (et le PDF), comprend en 3 minutes ; peut poser une question. *Technicien* : relit, ajuste, **Valider**. *Système* : compose la brochure (couverture, synthèse, plan d'action, une page par point), pré-remplit textes (états « tout va bien » par défaut `[EXISTE]`), génère PDF, envoie avec message commercial `[EXISTE]`.
**H/I** Aperçu paginé PC ; partage natif sur mobile.
**J/K/L** Données : `report{version, statut, pdf, lien, ouvert_le}`. Automatisations : validation → dossier commercial + envoi programmé ; ouverture → événement. IA V2 : reformulation du ton (brouillon).
**M/N/O** Permissions : technicien valide, commercial envoie. Edge : rapport modifié après envoi → version 2 ; client sans e-mail → WhatsApp ; PDF lourd → version compressée.
**P/Q** Erreurs : génération échouée → réessai + brouillon conservé. Sécurité : lien à jeton, expiration, révocation.
**R/S** `report_validated/sent/viewed`. KPI : délai fin de visite → envoi (cible < 2 h), taux d'ouverture.
**T/U/V** Friction : rapport tapé au bureau → supprimé. Risque : PDF lourd/lent → netteté vs poids (rendu ×2 `[EXISTE]`).
**W** Acceptation : rapport généré < 60 s ; validation obligatoire avant envoi ; version conservée.
**X/Y/Z** MVP : PDF + envoi `[EXISTE]`. V1 : lien de consultation + suivi. **Décision** : PDF = sortie ; **page web** = expérience.
**RED TEAM** Client ne comprend pas → glossaire intégré, langage simple. **SIMPLIFY** pas de personnalisation de trame. **SIMULATE** 10:05 validé, 10:06 envoyé (SMS + e-mail), 10:20 ouvert → événement. **VALIDATE** test de compréhension avec 5 clients particuliers (dont 65+).

---------------------------------------------------------------------------------------------------
## ÉTAPE 9 — COMMERCIAL
**A/B/C** Objectif : « quand le dossier arrive chez moi, tout est prêt » ; rien ne refroidit. Acteurs : commercial, dirigeant. Experts : responsable commercial, Sales Ops, RevOps, excellent/débutant commercial, UX.
**D** Dossier structuré : client, problème initial, diagnostic, anomalies, photos, recommandations validées, historique, valeur potentielle (estimation catalogue).
**E/F/G** *Client* : est contacté rapidement, ne répète rien. *Commercial* : « Mes actions du jour » (≤ 12, chacune avec sa raison) → dossier → **Préparer le devis**. *Système* : calcule la priorité **explicable** (valeur × urgence × fraîcheur), suit les objections (liste), rappelle.
**H/I** PC : pipeline 7 étapes + cockpit commercial `[EXISTE]` ; mobile : Mes RDV + résultat en 3 boutons.
**J/K/L** Données : `opportunity=dossier`, `objections[]`, `next_action`. Automatisations : diagnostic validé → dossier commercial + tâche « devis sous 24 h » ; devis non préparé à J+1 → alerte. IA V2 : résumé de dossier + brouillon de relance.
**M/N** Permissions : portefeuille + leads non attribués ; masque la marge selon droits. Notifications : dossier transmis (À FAIRE), client répond (URGENT).
**O/P/Q** Edge : commercial absent (réaffectation), client demande un 2ᵉ avis, dossier sans prochaine action (alerte). Sécurité : pas d'export du portefeuille sans droit.
**R/S** KPI : délai diagnostic→devis, % dossiers avec prochaine action, taux de signature, panier moyen ; **indicateurs qualité avant vente** (pas de classement public).
**T/U/V** Friction : dossier incomplet, relances oubliées. Risque : comportements toxiques → comparaison à soi-même, indicateurs de qualité.
**W** Acceptation : aucun dossier sans prochaine action ; les 12 actions expliquent leur priorité.
**X/Y/Z** MVP : actions du jour + pipeline + objections `[EXISTE partiel]`. V2 : résumé IA. **Décision** : priorité **explicable par règles**, pas de score opaque.
**RED TEAM** Le commercial ignore la liste → elle est **son** écran d'accueil et la seule source d'alertes ; manager voit les trous. **SIMPLIFY** retrait de la probabilité saisie à la main (calculée). **SIMULATE** 10:07 Sarah : action n°1 « Dupont — devis à préparer (fuite, 8 400 €, urgent) ». **VALIDATE** 3 commerciaux testent une semaine.
