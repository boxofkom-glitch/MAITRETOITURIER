# Dette technique

## Rôles = utilisateurs uniques codés en dur
`tech` = toujours "Julien Bernard", `sales` = toujours "Sarah Durand". Le
spec (section 8) veut une équipe évolutive (3 techniciens, 3 commerciaux...).
**Impact :** limite la démonstration à un seul utilisateur par rôle.
**Cible :** un sélecteur d'utilisateur par rôle dans `buildLogin()`/topbar,
et remplacer les comparaisons en dur (`d.technicien==="Julien Bernard"`) par
un `state.currentUser`. Pas fait ce lot (risque de régression sur
`visibleDossiers()` largement utilisé) — à faire en lot dédié et testé.

## Un dossier = un seul RDV
`visiteDate`/`visiteHeure` sont des champs scalaires sur le dossier, pas un
tableau. Bloque un vrai agenda multi-visites (contrôle, chantier, SAV) par
client. **Cible :** `d.rdvs[]`, migration à faire avec précaution pour ne
pas casser `renderAgenda`/`agendaEventsForDate` qui lisent le champ actuel.

## Bug corrigé (2026-09-17) : écrasement silencieux d'un point de diagnostic
`savePointFieldsFromDOM()` reformulait et écrasait le point de diagnostic
courant (`state.diagStep`) dès qu'un `change` se déclenchait n'importe où
dans l'app (ex. un filtre agenda, un select de devis), même hors de l'écran
diagnostic — car `state.dossierId`/`state.diagStep` restent définis après
avoir quitté cet écran. Corrigé en ne flushant/reformulant que si les champs
DOM du formulaire diagnostic sont réellement présents. Repéré en testant la
nouvelle fonctionnalité "Le saviez-vous ?" sur un dossier de démo avec texte
rédigé à la main (`claireDiagnostic()`), écrasé silencieusement par du texte
généré. À garder en tête : toute fonction de flush-DOM future doit vérifier
la présence réelle des champs avant d'agir, pas seulement l'état de navigation.

## `app.js` déjà volumineux (~2900 lignes, un seul fichier)
Pas de build donc pas de découpage en modules ES sans risque (chargement
`<script>` simple). Acceptable pour une démo ; à revoir si le projet devient
un vrai produit avec bundler.
