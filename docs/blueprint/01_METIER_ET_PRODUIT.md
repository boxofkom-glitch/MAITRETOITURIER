# PARTIE 1 — Le métier et le produit (sections 01 à 08)

## 01 — Vision
Maître Toiturier est le **système d'exploitation d'une entreprise de couverture** : il capture chaque contact, chaque constat terrain, chaque euro, et les relie dans **une seule source de vérité par client et par toiture**. Le PDF, le devis, la facture, le planning sont des *sorties* de la donnée, jamais des saisies séparées.
Promesse en une phrase : *« Le couvreur couvre ; Maître Toiturier s'occupe du reste. »*
Trois ruptures visées :
1. **De la saisie à la validation** : le système prépare (rapport, devis, relance, compte rendu), l'humain valide.
2. **Du CRM au cycle de vie de la toiture** : une vente ponctuelle devient une relation de 10-20 ans (carnet de santé, entretien, SAV, voisinage).
3. **De la publicité au euro de marge** : chaque source d'acquisition est reliée au chiffre d'affaires et à la marge réels.

## 02 — Problème (ce qui se passe vraiment dans une entreprise de couverture)
- Les leads arrivent partout (téléphone, Meta, site, bouche-à-oreille) et **se perdent** : pas de suivi de vitesse de réponse, pas de source fiable.
- Le technicien prend des photos sur son téléphone, **rentre au bureau**, retape un rapport, la secrétaire refait un devis : 3 ressaisies, 2-5 jours de délai, et le client a déjà signé ailleurs.
- Les devis partent et **personne ne relance** : c'est la principale fuite de chiffre d'affaires (souvent 30-50 % des devis jamais relancés).
- Le chantier démarre sans matériel complet ; les problèmes terrain remontent par téléphone ; le dirigeant appelle pour savoir « où en est-on ».
- La facturation traîne, les acomptes sont oubliés, les impayés sont découverts tard.
- Après le chantier : plus rien. Pas d'avis demandé, pas d'entretien, pas de recommandation, le client n'est jamais recontacté.
- Le dirigeant ne sait pas **quel canal rapporte** ni **quel chantier est rentable** : il pilote au ressenti.
Le vrai problème n'est pas « manque de CRM » : c'est **la perte d'information à chaque passage de relais** (bureau → terrain → bureau → client).

## 03 — Marché et utilisateurs
- Cible initiale : TPE/PME de couverture de **2 à 25 personnes** (France) — artisans en croissance qui ont dépassé le carnet papier/Excel mais n'utilisent pas un ERP BTP lourd.
- Segments : (a) artisan-dirigeant + 1-3 salariés (le dirigeant cumule tous les rôles) ; (b) PME 5-25 avec secrétaire, 1-3 commerciaux, 2-4 équipes de pose ; (c) plus tard : multi-agences/réseaux.
- Alternatives actuelles : Excel/papier, logiciels de devis-factures BTP (Batappli, Obat, Tolteck…), CRM génériques (HubSpot, Pipedrive), outils de planning. Aucun ne relie **acquisition → diagnostic terrain → marge** avec un diagnostic guidé métier.
- Mesure de traction attendue : temps lead→devis, taux de relance, taux de signature, encaissement à J+X.
- À valider terrain (Phase 0) : 10 entretiens de couvreurs, 3 journées d'observation, collecte de 5 devis/rapports réels.

## 04 — Personas
| Persona | Contexte | Douleur principale | Ce qu'il attend |
|---|---|---|---|
| **Dirigeant** (Marc, 45 ans) | Sur les chantiers le matin, au bureau le soir | Aucune visibilité, pilote au feeling | « Ce qui nécessite mon attention aujourd'hui », marge par chantier/source |
| **Secrétaire** (Nadia) | Téléphone + agenda toute la journée | Prendre un RDV = 6 recherches, informations incomplètes | Écran « appel entrant », meilleurs créneaux, confirmations auto |
| **Commercial** (Sarah) | Voiture, RDV chez les clients | Dossiers incomplets, relances oubliées, opportunités qui refroidissent | « Mes 12 actions du jour », dossier complet sur mobile |
| **Technicien/diagnostiqueur** (Julien) | Sur les toits, gants, réseau moyen | Rapport à retaper, photos à classer | Diagnostic guidé, dictée, zéro saisie au retour |
| **Poseur/couvreur** (Yanis) | Chantier | Consignes floues, matériel oublié | « Mes chantiers », checklist matériel, gros boutons |
| **Client final** (Mme Laurent) | Propriétaire, inquiet, pas expert | Comprendre, avoir confiance, éviter l'arnaque | Rapport visuel, devis clair, suivi, un seul lien |
| **Comptabilité** | Externe ou interne | Factures/paiements dispersés | Export propre, échéances, impayés |
| Futurs : chef d'équipe, conducteur de travaux, sous-traitant, manager agence | | | Accès restreints (voir 31 — Permissions) |
Un même salarié peut cumuler des rôles ; l'application mobile **s'adapte au rôle actif** (Mes diagnostics / Mes chantiers / Mes RDV). **[EXISTE en partie : rôles, affectation, accès par onglet.]**

## 05 — Jobs-to-be-done
- *Dirigeant* : « Quand je démarre ma journée, je veux savoir ce qui brûle, pour ne rien laisser tomber. » / « Quand je dépense en pub, je veux savoir ce que ça rapporte en marge. »
- *Secrétaire* : « Quand un client appelle, je veux le retrouver et lui proposer un créneau en 30 secondes. »
- *Commercial* : « Quand j'ai vu un client, je veux que la suite (devis, relance) se prépare toute seule. »
- *Technicien* : « Quand je quitte le toit, je veux que le rapport soit déjà prêt à valider. »
- *Poseur* : « Quand j'arrive sur chantier, je veux tout savoir sans appeler le bureau. »
- *Client* : « Quand je reçois un devis, je veux comprendre pourquoi ces travaux et ce prix. »

## 06 — Proposition de valeur
Pour le couvreur : **plus de chantiers signés** (vitesse de réponse + relance + rapport clair), **moins d'administration** (zéro ressaisie), **plus de marge** (visibilité coûts/sources), **plus de récurrence** (entretien, avis, parrainage).
Différenciation défendable : diagnostic **guidé métier** produisant de la donnée structurée + boucle complète acquisition→marge→entretien + terrain-first.
Ce que nous ne promettons pas : diagnostic automatique par IA. L'IA prépare, le professionnel valide (voir partie 4).

## 07 — Operating model d'une entreprise de couverture (transitions)
Chaque transition : **infos requises · responsable · automatisations · erreurs typiques · pertes · IA**. `[EXISTE]` = déjà en place dans l'application.

| # | Transition | Infos requises | Responsable | Automatisations cibles | Erreurs / pertes typiques | Aide IA (validée) |
|---|---|---|---|---|---|---|
| 1 | Marketing → Lead | source, campagne, coordonnées, besoin | système | création lead auto, attribution source | lead sans source, doublon | dédoublonnage |
| 2 | Lead → Qualification | urgence, adresse, type de problème, propriétaire ? | secrétaire | SMS immédiat, tâche d'appel, file « à traiter » | délai de réponse trop long (perte n°1) | résumé d'appel, extraction adresse/problème |
| 3 | Qualification → RDV | créneau, zone, compétence | secrétaire | meilleurs créneaux, confirmation, rappel J-1 | RDV non confirmé, no-show | — |
| 4 | RDV → Diagnostic | dossier complet, historique, notes | technicien | ouverture auto du dossier + itinéraire `[EXISTE partiel]` | technicien sans contexte | brief du dossier |
| 5 | Diagnostic → Recommandation | constats structurés, photos | technicien | rapport PDF auto, transmission au commercial `[EXISTE]` | retard de rapport, photos perdues | observation depuis dictée |
| 6 | Recommandation → Devis | prestations liées aux anomalies | commercial | brouillon de devis depuis constats `[EXISTE partiel : suggestions]` | ressaisie, oubli de lignes | brouillon de structure |
| 7 | Devis → Relance | date d'envoi, consultation, montant | commercial | séquence de relance, « 12 actions du jour » | **pas de relance** (perte majeure) | brouillon de relance |
| 8 | Relance → Signature | validation client | commercial | signature électronique, expiration | devis expiré, négociation non tracée | — |
| 9 | Signature → Acompte | conditions de règlement | admin | facture d'acompte auto `[EXISTE]`, relance paiement | acompte oublié | — |
| 10 | Acompte → Planification | compétences, durée, matériel, météo | conducteur/dirigeant | proposition de planning, réservation matériel | chevauchements, trajets inutiles | optimisation de tournée |
| 11 | Planification → Approvisionnement | liste de matériel du devis | conducteur | liste matériel auto (bibliothèque) `[EXISTE partiel]`, commande | matériel manquant sur chantier | — |
| 12 | Approvisionnement → Chantier | consignes, accès, contacts | chef d'équipe | fiche chantier mobile, SMS client « on arrive » | consignes floues | — |
| 13 | Chantier → Suivi terrain | photos, temps, problèmes | poseurs | journal de chantier auto, alertes blocage | remontée par téléphone, travaux sup. non facturés | compte rendu de journée |
| 14 | Suivi → Contrôle qualité | checklist, photos obligatoires | chef d'équipe | tâches correctives | retours SAV, litiges | — |
| 15 | Contrôle → Facturation | travaux réalisés, avenants | admin | facture de solde auto `[EXISTE]` | facture tardive | — |
| 16 | Facturation → Encaissement | échéancier, mode | admin/compta | relances, statut impayé/payé `[EXISTE]` | impayés découverts tard | — |
| 17 | Encaissement → SAV | garantie, dossier | secrétaire | ticket SAV lié au chantier | historique introuvable | classification |
| 18 | SAV → Entretien | date, type de toiture | commercial | contrat/rappel automatique | client oublié | — |
| 19 | Entretien → Avis / Parrainage | satisfaction confirmée | système | demande d'avis, code parrain `[EXISTE partiel : parrainage]` | avis jamais demandé | — |
| 20 | Avis → Nouvelles opportunités | voisinage, ancien client | commercial/marketing | campagne « voisins du chantier », réactivation | clients dormants | segmentation |

## 08 — Architecture du produit (modules et dépendances métier)
Six domaines qui partagent **un seul noyau de données** :
```
NOYAU : Organisation · Utilisateurs/Rôles · Contact · Propriété · Toiture · Média · Événement (timeline) · Document
ACQUISITION : Source · Campagne · Lead · QR/Code de parrainage · Dépense
COMMERCIAL : Rendez-vous · Diagnostic · Constat · Anomalie · Opportunité · Devis · Signature · Relance
EXÉCUTION : Chantier · Affectation · Journal · Matériel · Contrôle qualité · SAV · Contrat d'entretien
FINANCE : Facture · Paiement · Coût · Marge
PILOTAGE : Cockpit · Analytics · Automatisations · Notifications · IA (couche transverse, jamais décisionnaire)
```
Principes d'architecture produit :
1. **Une toiture = un carnet de santé** ; le client possède des propriétés ; un dossier de travaux se rattache à une toiture (aujourd'hui : dossier = client+demande → à faire évoluer, `docs/erp/VISION_OS.md`).
2. **Événement d'abord** : tout changement écrit un événement (timeline universelle) ; automatisations, analytics et notifications *écoutent* ces événements. `[EXISTE partiel : historique par dossier]`
3. **Calcul plutôt que saisie** : les étapes (ex. Gagné/Impayé/Payé) se **déduisent** des données. `[EXISTE pour le suivi commercial]`
4. **PC = commande, mobile = exécution** : deux expériences, un modèle. `[EXISTE : barre basse mobile, PC dense]`
5. **IA en périphérie** : brouillons validés par l'humain, traçabilité (qui a validé quoi).
6. **Multi-tenant dès le premier modèle** (`organization_id` partout), multi-agences prévu mais non construit.

État de l'application actuelle face à cette architecture : noyau partiel (dossier, historique, documents), commercial/finance/exécution avancés côté navigateur, acquisition/pilotage/IA absents, aucune persistance serveur. Passage au serveur = prérequis de la Partie 5.

---
**Suite (Partie 2)** : CRM métier, acquisition/attribution (Meta, terrain, QR), secrétariat, pipeline et speed-to-lead, diagnostic structuré, devis.
