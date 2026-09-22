# Rendre le site opérationnel (mode serveur) — 1 étape, ~3 minutes

L'application vient de recevoir un vrai serveur (dans `api/`) : comptes réels, mots de passe
chiffrés, données enregistrées automatiquement à chaque modification (diagnostic, devis, facture,
paiement, chantier…) et **partagées entre tous vos salariés**. Tant que l'étape ci-dessous n'est
pas faite, le site reste en mode « démonstration » (données locales à chaque navigateur, comme
avant).

## Ce qu'il vous reste à faire (une seule fois, dans votre tableau de bord Vercel)

Je n'ai pas accès à votre compte Vercel — je ne peux pas le faire à votre place. Il n'y a aucun
code à écrire, juste 2 clics :

1. Allez sur **vercel.com** → votre projet **app-maitretoiturier** → onglet **Storage**.
2. Cliquez **Create Database** → choisissez **Upstash** → type **Redis** (gratuit pour ce volume
   d'usage) → nommez-la par exemple `maitre-toiturier-db` → **Create**.
3. Sur l'écran suivant, cliquez **Connect Project** et sélectionnez votre projet
   `app-maitretoiturier` (branche/environnement **Production**). Vercel ajoute automatiquement les
   variables d'environnement nécessaires (`KV_REST_API_URL`, `KV_REST_API_TOKEN` ou les
   équivalents `UPSTASH_...` — les deux noms sont pris en charge par le code).
4. Vercel redéploie automatiquement (ou cliquez **Redeploy** sur le dernier déploiement dans
   l'onglet **Deployments** si ce n'est pas automatique).

C'est tout. Rechargez `app-maitretoiturier.fr` (Ctrl+F5) : la page d'accueil vous proposera
**« Bienvenue : créons votre espace »** au lieu de l'ancien écran de démonstration.

## Ce qui se passe ensuite

- **Première ouverture** : vous créez le compte du directeur (nom, e-mail, mot de passe, nom de
  l'entreprise). C'est vous.
- **Chaque salarié** clique « Nouveau salarié ? Créer mon accès », remplit son formulaire ; sa
  demande apparaît dans Paramètres → Demandes d'accès, où vous l'acceptez et lui attribuez un
  rôle — exactement comme avant, mais réellement partagé cette fois.
- **Tout est automatique** : dès que quelqu'un modifie un diagnostic, un devis, une facture, un
  paiement, un chantier… l'enregistrement part tout seul moins d'une seconde après (pas de bouton
  « Enregistrer » à chercher). Se déconnecter, fermer l'onglet, recharger la page : rien n'est
  perdu, et vos collègues voient la mise à jour dans les ~20 secondes qui suivent (l'application
  vérifie le serveur toutes les 20 s, et immédiatement après chaque modification).
- **Deux personnes modifient le même dossier en même temps** : la version la plus récente gagne,
  et la personne dont la modification n'a pas pu s'appliquer reçoit un message clair au lieu d'une
  perte silencieuse.
- **Photos** : envoyées et stockées côté serveur (réduites automatiquement si trop lourdes),
  visibles par toute l'équipe.
- **Mot de passe oublié** : la demande arrit dans Paramètres → Équipe ; vous cliquez
  « Réinitialiser », un mot de passe temporaire est généré et l'e-mail de marque est préparé.

## Limites actuelles, en toute franceté

- **Un seul espace par déploiement** : ce serveur est prévu pour **une seule entreprise** (la
  vôtre). Ce n'est pas encore le SaaS multi-entreprises décrit dans `docs/blueprint/` — cette
  V1 sert uniquement Maître Toiturier / votre équipe.
- **Pas encore** : leads entrants, Meta Ads, SMS/e-mails envoyés automatiquement (les e-mails de
  marque se préparent et s'ouvrent dans votre messagerie, ils ne partent pas seuls), signature
  électronique, mode hors connexion avancé. Tout est détaillé dans le blueprint (`docs/blueprint/`)
  comme prochaines étapes.
- **Sauvegarde** : Upstash conserve vos données de façon durable, mais pensez tout de même à
  exporter une sauvegarde de temps en temps (Paramètres → Données → « Exporter une sauvegarde »)
  tant qu'il n'y a pas de sauvegarde automatique programmée côté serveur.
- **Débogage** : si `/api/health` renvoie `"configured":false` après avoir suivi les étapes
  ci-dessus, revérifiez que la base a bien été connectée à l'environnement **Production** (pas
  seulement Preview) et redéployez.
