# Architecture cible (réaliste, front-end simulé)

Toujours un site statique. On vise une **app de démonstration ERP complète**
où chaque module métier du Master Spec existe, avec des données cohérentes
et reliées, sans backend réel.

## Modèle de données cible (étend `DOSSIERS`, ne le remplace pas)
```
Dossier (= Client 360 + affaire)
  identité: client, email, telephone, adresse, ville, typeBatiment
  lead: motif, priorite, statut, source, commercial
  rdvs: [{ date, heure, type, technicien, statut }]   // au lieu d'1 seul RDV
  diagnostic: { ...existant, inchangé }
  opportunite: { commercialStage, montant, prochaineRelance }
  devis: [{ version, statut, lignes[], ht, tva, ttc, dateEnvoi, dateValidite }]
  factures: [{ type, numero, lignes[], ttc, statut, echeance }]
  paiements: [{ montant, mode, date, factureId }]
  chantier: { statut, equipe[], checklist[], materiel[], photos[], timeline[] }
  documents: [{ type, nom, date }]
  sav: [{ description, statut, date }]
  historique: [...existant]
```

## RBAC cible
`PERMISSIONS` matrix (rôle → set de permissions `entite.action`), fonction
unique `hasPermission(perm, scope)`. Scopes `OWN`/`TEAM`/`ALL` simulés via
les filtres `visibleXxx()` existants.

## Navigation cible
Sidebar enrichie par rôle : Accueil (Ma journée) / Dossiers / Agenda /
Diagnostics / Commercial (pipeline+devis) / Facturation / Chantiers /
Achats & matériel / Marketing / SAV / Équipe / Paramètres — chaque entrée
n'apparaît que si le rôle a au moins une permission `*.read` dessus.

## Ce qui resterait à faire pour une vraie mise en production SaaS
(hors périmètre de ce lot — documenté pour l'utilisateur, pas construit) :
backend (Node/Postgres ou équivalent), authentification réelle (sessions/
JWT), RBAC vérifié serveur, multi-tenancy avec isolation stricte, paiements
réels (Stripe/GoCardless), emails/SMS réels (Sendgrid/Twilio), stockage
fichiers (S3), génération PDF serveur, tests d'intégration, CI/CD.
