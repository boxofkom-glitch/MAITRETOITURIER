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

## `app.js` déjà volumineux (~2900 lignes, un seul fichier)
Pas de build donc pas de découpage en modules ES sans risque (chargement
`<script>` simple). Acceptable pour une démo ; à revoir si le projet devient
un vrai produit avec bundler.
