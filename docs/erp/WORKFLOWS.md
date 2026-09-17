# Workflows métier (état simulé, cf. CURRENT_ARCHITECTURE.md)

## Lead → RDV → Diagnostic (existant, fonctionnel)
Nouvelle demande (modal) → dossier statut "Nouvelle" → affectation technicien
(`modalAffecter`) → RDV (`visiteDate`/`visiteHeure`) → diagnostic terrain
(protégé) → rapport PDF généré → statut "Rapport prêt".

## Diagnostic → Commercial (existant, kanban)
Un dossier avec diagnostic prêt apparaît dans le pipeline commercial
(`renderCommercialKanban`, étapes `commercialStage`). Le commercial fait
avancer manuellement les étapes ; `montant` et `prochaineRelance` suivent
l'affaire.

## Cible additive (ce lot) : Devis → Facture → Paiement
`commercialStage` passe à "Devis envoyé" → un `devis` versionné est attaché
au dossier (V1, V2...) → acceptation → génération facture(s) (acompte/
solde) → enregistrement paiement(s) → dossier passe en préparation chantier.
Voir DECISIONS.md D2 pour le choix de ne pas créer de nouvelles entités
racines.

## Non implémenté (documenté, pas construit ce lot)
Chantier → poseurs → matériel → achats fournisseurs → réception → clôture →
facture solde → SAV. Nécessiterait un vrai backend pour être fiable en
production (concurrence, stock réel, paiements réels) — cf.
TARGET_ARCHITECTURE.md.
