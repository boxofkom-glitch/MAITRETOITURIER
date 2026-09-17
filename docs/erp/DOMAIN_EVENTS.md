# Domain events (simulés — pas de bus d'événements réel)

Pas de vrai message bus (pas de backend). Les "événements" du spec sont
représentés par des entrées poussées dans `d.historique[]` au moment de
chaque action utilisateur significative, et consommés visuellement par la
Timeline du dossier + les widgets "Ma journée"/Overview.

Événements déjà tracés dans `historique` : création demande, diagnostic
validé/rapport généré, RDV planifié (implicite via `visiteDate`).

Événements à tracer au fur et à mesure des modules ajoutés (devis créé/
envoyé/accepté, paiement enregistré, chantier démarré/terminé) : ajouter une
entrée `historique.push({date, auteur, texte})` à chaque action handler
correspondante, pattern déjà en place — pas de nouvelle architecture requise.
