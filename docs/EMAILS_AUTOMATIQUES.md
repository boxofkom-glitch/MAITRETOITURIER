# Envoi automatique des e-mails (salariés et clients) — 2 étapes, ~5 minutes

Aujourd'hui, quand vous invitez un salarié ou un client, l'application **prépare** l'e-mail
(aux couleurs de la marque) et vous l'envoyez vous-même depuis votre propre messagerie. C'est
fiable mais manuel. Ce document active l'envoi **automatique et direct** depuis le serveur : un
clic sur « Envoyer par e-mail » et c'est parti, sans repasser par votre boîte mail.

Concerné : invitation d'un salarié, acceptation d'accès, mot de passe réinitialisé, invitation
d'un client à son espace. (Les devis/factures avec pièce jointe PDF restent pour l'instant en
envoi manuel — dites-le-moi si vous voulez que je les automatise aussi.)

## Ce que je ne peux pas faire à votre place

Je ne peux ni créer de compte sur un service tiers en votre nom, ni saisir une clé secrète dans
Vercel (ce sont des actions qui vous appartiennent). Le reste — tout le code — est déjà en place
et testé.

## Étape 1 — Créer un compte Resend (gratuit) et vérifier votre domaine

[Resend](https://resend.com) est le service qui enverra réellement les e-mails. Gratuit jusqu'à
3 000 e-mails/mois, largement suffisant.

1. Allez sur **resend.com**, créez un compte gratuit (avec votre e-mail).
2. Dans le tableau de bord, allez dans **Domains** → **Add Domain**, entrez `app-maitretoiturier.fr`.
3. Resend affiche 2 ou 3 enregistrements DNS à ajouter (des lignes **TXT** et **CNAME**, pour
   prouver que le domaine est bien le vôtre et éviter que vos e-mails finissent en spam). Ajoutez-les
   chez l'endroit où le nom de domaine a été acheté (OVH, Google Domains, etc. — dites-moi lequel si
   vous voulez que je vous guide précisément). La vérification prend de quelques minutes à quelques
   heures.
4. Une fois le domaine marqué **Verified** chez Resend, allez dans **API Keys** → **Create API Key**,
   donnez-lui un nom (ex. « app-maitretoiturier ») et copiez la clé (elle commence par `re_`).

## Étape 2 — Ajouter la clé dans Vercel

1. Allez sur **vercel.com** → projet **maitretoiturier** → **Settings** → **Environment Variables**.
2. Ajoutez :
   - `RESEND_API_KEY` = la clé copiée à l'étape précédente (Production **et** Preview).
   - `MAIL_FROM` = `Maître Toiturier <contact@app-maitretoiturier.fr>` (remplacez l'adresse par
     celle que vous voulez voir apparaître comme expéditeur — elle doit appartenir au domaine
     vérifié à l'étape 1).
3. Redéployez (Deployments → dernier déploiement → **⋯** → **Redeploy**).

## Vérifier que ça fonctionne

Ouvrez `https://app-maitretoiturier.fr/api/health` : vous devez voir `"mail":true`. Ensuite, dans
Paramètres → Équipe, invitez un salarié (ou vous-même avec une autre adresse) : le bouton
**« Envoyer par e-mail »** doit apparaître dans la fenêtre d'envoi. Un clic, et l'e-mail part
réellement.

## Si ça ne marche toujours pas

- `"mail":false` après avoir tout fait → la variable n'est pas bien enregistrée sur l'environnement
  **Production**, ou le redéploiement n'a pas eu lieu.
- Le bouton n'apparaît pas → le domaine n'est peut-être pas encore **Verified** chez Resend (la
  clé fonctionne quand même pour tester, mais Resend refusera d'envoyer tant que le domaine
  n'est pas vérifié, sauf en utilisant leur domaine de test `onboarding@resend.dev` comme
  expéditeur — dans ce cas, gardez `MAIL_FROM="Maître Toiturier <onboarding@resend.dev>"`
  temporairement, mais sachez que Resend limite alors l'envoi à votre propre adresse de compte).
- Un message d'erreur s'affiche au clic → il vient directement de Resend (clé invalide, domaine
  non vérifié, etc.) ; il est assez clair pour identifier le problème.
