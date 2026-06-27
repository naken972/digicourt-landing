# Déploiement — Email Auto-Response Worker

Worker Cloudflare qui envoie automatiquement un email de bienvenue à chaque
inscription via le formulaire Formspree.

## Prérequis

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installé et connecté (`wrangler login`)
- Un compte [Resend](https://resend.com) avec une clé API

---

## 1. Déployer le Worker

```bash
cd workers
wrangler deploy
```

Wrangler retourne l'URL du Worker, par exemple :
```
https://digicourt-email-worker.<ton-sous-domaine>.workers.dev
```

---

## 2. Ajouter la clé API Resend (secret)

```bash
wrangler secret put RESEND_API_KEY
```

Coller la clé quand demandé. Elle ne sera jamais visible après ça.

---

## 3. (Optionnel) Vérifier le domaine expéditeur sur Resend

Par défaut le Worker utilise `onboarding@resend.dev` (domaine de test Resend).
Pour envoyer depuis `hello@digicourt.fr` :

1. Aller sur [resend.com/domains](https://resend.com/domains)
2. Ajouter `digicourt.fr` et suivre les étapes DNS
3. Une fois vérifié, remplacer dans `email-autoresponse.js` :
   ```js
   const FROM_ADDRESS = 'DigiCourt <hello@digicourt.fr>';
   ```
4. Re-déployer : `wrangler deploy`

---

## 4. Connecter le webhook dans Formspree

1. Aller sur [formspree.io](https://formspree.io) → sélectionner le formulaire `mpqnkawk`
2. Onglet **Settings** → **Integrations** → **Webhooks**
3. Cliquer **Add Webhook**
4. Coller l'URL du Worker :
   ```
   https://digicourt-email-worker.<ton-sous-domaine>.workers.dev
   ```
5. Sauvegarder

À partir de là, chaque soumission du formulaire déclenche un POST Formspree → Worker → Resend → email dans la boîte du visiteur.

---

## Test rapide

```bash
curl -X POST https://digicourt-email-worker.<ton-sous-domaine>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"submission":{"email":"test@example.com"}}'
```

Réponse attendue : `{"ok":true,"to":"test@example.com"}`
