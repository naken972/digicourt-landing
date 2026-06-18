# Guide : Connecter digicourt.fr à Cloudflare Workers

## Vue d'ensemble

```
Gandi (registrar)  →  Cloudflare (DNS + CDN)  →  Cloudflare Workers (site)
```

Tu gardes le domaine chez Gandi mais tu délègues tout le DNS à Cloudflare.
Le site continuera de tourner sur le même Worker qu'aujourd'hui.

---

## ÉTAPE 1 — Ajouter digicourt.fr sur Cloudflare

1. Va sur **dash.cloudflare.com** et connecte-toi à ton compte
2. Clique sur **"Add a site"** (bouton en haut à droite)
3. Tape `digicourt.fr` et clique **Continue**
4. Choisis le plan **Free** → clique **Continue**
5. Cloudflare va scanner les DNS existants — clique **Continue** pour passer
6. À la fin, Cloudflare te donne **2 nameservers**, par exemple :
   ```
   aria.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```
   ⚠️ **Note ces deux adresses**, tu en as besoin à l'étape 2.

---

## ÉTAPE 2 — Changer les nameservers sur Gandi

1. Va sur **gandi.net** → connecte-toi → clique sur ton domaine `digicourt.fr`
2. Dans le menu gauche, clique **"Nameservers"**
3. Clique **"Change"** (ou "Modifier")
4. Sélectionne **"External nameservers"**
5. Supprime les nameservers Gandi existants et entre les 2 de Cloudflare :
   ```
   aria.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```
   (remplace par les tiens exacts copiés depuis Cloudflare)
6. Sauvegarde

⏱️ La propagation prend **5 à 30 minutes** en général, parfois jusqu'à 24h.
Cloudflare t'envoie un email quand le domaine est actif.

---

## ÉTAPE 3 — Créer une route Custom Domain sur le Worker

Une fois le domaine actif dans Cloudflare :

1. Va dans **Cloudflare Dashboard → Workers & Pages**
2. Clique sur ton Worker **`digicourt-landing`**
3. Clique sur l'onglet **"Settings"** puis **"Triggers"** (ou "Custom Domains")
4. Clique **"Add Custom Domain"**
5. Entre `digicourt.fr` → clique **Add Custom Domain**
6. Fais la même chose pour `www.digicourt.fr`

Cloudflare va automatiquement :
- Créer les enregistrements DNS nécessaires
- Générer un certificat SSL (HTTPS) gratuit
- Router le trafic vers ton Worker

---

## ÉTAPE 4 — Vérifier que tout fonctionne

Attends 5-10 minutes puis :

1. Ouvre **https://digicourt.fr** dans ton navigateur → le site doit s'afficher
2. Ouvre **https://www.digicourt.fr** → doit aussi fonctionner
3. Vérifie le cadenas HTTPS vert dans la barre d'adresse

Si le site ne s'affiche pas après 30 minutes, vérifie dans Cloudflare Dashboard → DNS que des enregistrements existent bien pour `digicourt.fr` et `www`.

---

## ÉTAPE 5 — Mettre à jour wrangler.toml (optionnel mais propre)

Dans le fichier `wrangler.toml` de ton projet, tu peux ajouter le domaine :

```toml
name = "digicourt-landing"
compatibility_date = "2024-01-01"

routes = [
  { pattern = "digicourt.fr/*", custom_domain = true },
  { pattern = "www.digicourt.fr/*", custom_domain = true }
]
```

Puis commit + push pour que les prochains déploiements ciblent aussi ton domaine.

---

## Résumé des délais

| Action | Délai |
|--------|-------|
| Changement nameservers Gandi | 5 min – 24h |
| Activation domaine Cloudflare | Email de confirmation |
| Certificat SSL automatique | 5 – 15 min après activation |
| Site live sur digicourt.fr | Immédiat après SSL |

---

## En cas de problème

- **"This site can't be reached"** → propagation DNS pas encore terminée, attends
- **Erreur SSL / pas de HTTPS** → dans Cloudflare → SSL/TLS → mets sur "Full"
- **Worker ne répond pas** → vérifie que le Custom Domain est bien ajouté au Worker
- **www ne fonctionne pas** → ajoute un CNAME `www` → `digicourt.fr` dans DNS Cloudflare

---

*Guide créé pour DigiCourt — digicourt.fr sur Cloudflare Workers*
