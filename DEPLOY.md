# 🚀 Guide de déploiement FoodTracks

## Stack production
- **Vercel** — hébergement Next.js
- **Supabase** — base de données PostgreSQL (utilisateurs, produits, recettes…)
- **MongoDB Atlas** — analytics (événements, clics, pages vues…)
- **Stripe** — paiements et abonnements
- **OpenAI** — fonctionnalités IA (Pro/Enterprise)
- **SumUp** — intégration caisse (optionnel)

---

## Étape 1 : Base de données PostgreSQL (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com)
2. Crée un nouveau projet (`foodtracks-prod`, région `eu-west-3` pour Paris)
3. Va dans **Settings → Database** et copie :
   - **Connection string (Transaction)** port `6543` → `DATABASE_URL`
   - **Connection string (Session)** port `5432` → `DIRECT_URL`

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

4. Après avoir configuré les variables dans Vercel, pousse le schéma Prisma :
```bash
npx prisma db push
```

---

## Étape 2 : Base de données MongoDB Analytics (MongoDB Atlas)

1. Crée un compte sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Crée un cluster gratuit (M0) — région `eu-west-1` (Ireland) recommandée
3. Crée un utilisateur de base de données avec un mot de passe fort
4. Dans **Network Access**, ajoute `0.0.0.0/0` (Vercel utilise des IPs dynamiques)
5. Récupère l'URI de connexion : **Connect → Drivers**

```
MONGODB_ANALYTICS_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/foodtracks-analytics?retryWrites=true&w=majority
```

Les index sont créés automatiquement au premier événement.

---

## Étape 3 : Stripe

1. Active ton compte sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crée deux produits avec des prix **récurrents** (mensuel) :
   - **Pro** → note le `price_xxx` → `STRIPE_PRO_PRICE_ID`
   - **Enterprise** → note le `price_xxx` → `STRIPE_ENTERPRISE_PRICE_ID`
3. Récupère ta clé secrète : **Developers → API keys** → `STRIPE_SECRET_KEY`
4. Configure le webhook : **Developers → Webhooks → Add endpoint**
   - URL : `https://ton-domaine.vercel.app/api/stripe/webhook`
   - Événements à écouter :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copie le **Webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Étape 4 : Déployer sur Vercel

1. Connecte-toi sur [vercel.com](https://vercel.com) avec GitHub
2. Importe le repo `foodtracks`
3. Dans **Environment Variables**, ajoute **toutes** ces variables :

### Variables obligatoires

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL Supabase — port 6543 (pooler) |
| `DIRECT_URL` | PostgreSQL Supabase — port 5432 (migrations) |
| `AUTH_SECRET` | Clé NextAuth — génère avec : `openssl rand -base64 32` |
| `OPENAI_API_KEY` | Clé API OpenAI (fonctionnalités IA) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe (`whsec_...`) |
| `STRIPE_PRO_PRICE_ID` | ID du prix Pro Stripe (`price_...`) |
| `STRIPE_ENTERPRISE_PRICE_ID` | ID du prix Enterprise Stripe (`price_...`) |
| `MONGODB_ANALYTICS_URI` | URI MongoDB Atlas pour les analytics |

### Variables optionnelles

| Variable | Description |
|----------|-------------|
| `SUMUP_CLIENT_ID` | Client ID SumUp (`sup_ci_...`) |
| `SUMUP_CLIENT_SECRET` | Client Secret SumUp (`sup_cs_...`) |

> **Note :** `NEXTAUTH_URL` et `VERCEL_URL` sont automatiquement configurés par Vercel — ne pas les ajouter.

4. Clique sur **Deploy**

---

## Étape 5 : Initialiser la base de données

Après le premier déploiement, pousse le schéma Prisma vers Supabase :

**Option A — depuis ton terminal local** (recommandé)
```bash
# Mets d'abord les URLs Supabase dans ton .env local
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

npx prisma db push
```

**Option B — via Vercel CLI**
```bash
npm i -g vercel
vercel env pull .env.local
npx prisma db push
```

---

## Étape 6 : Configurer Stripe Webhook en production

Après avoir ton URL Vercel définitif :
1. Dans Stripe Dashboard → Webhooks, mets à jour l'URL du webhook
2. Le webhook gère : abonnements, trials 14j, annulations

---

## Étape 7 : SumUp (optionnel)

1. Va sur [me.sumup.com](https://me.sumup.com) → Account → Settings → For Developers → OAuth2 Apps
2. Crée une app, définis le Redirect URI : `https://ton-domaine.com/api/sumup/callback`
3. Scopes requis : `transactions.history user.profile_readonly`
4. Copie `Client ID` et `Client Secret` dans les variables Vercel

---

## Commandes utiles

```bash
# Développement local
npm run dev

# Build de production (vérifie les erreurs)
npm run build

# Pousser le schéma Prisma (dev/prod)
npm run db:push

# Appliquer les migrations en production
npm run db:migrate

# Interface Prisma Studio
npm run db:studio
```

---

## Notes importantes

### Sécurité
- Ne commite **jamais** le fichier `.env` (`.gitignore` l'exclut déjà)
- Utilise `sk_live_...` (pas `sk_test_...`) en production Stripe
- `AUTH_SECRET` doit être différent en prod et en dev

### MongoDB Atlas — accès réseau
- Vercel utilise des IPs dynamiques → autorise `0.0.0.0/0` dans Network Access
- Ou utilise Vercel's IP ranges si ton plan Atlas le permet

### Performance Supabase
- `DATABASE_URL` port 6543 : connection pooler → pour l'app
- `DIRECT_URL` port 5432 : connexion directe → pour `prisma db push`

### Domaine personnalisé
1. Vercel → Settings → Domains → ajoute `app.foodtracks.io`
2. Configure les DNS chez ton registrar (CNAME vers `cname.vercel-dns.com`)
3. Mets à jour l'URL du webhook Stripe avec le vrai domaine

---

## Dépannage

**Erreur Prisma "Can't reach database server"**
→ Vérifie `DIRECT_URL` dans Vercel

**Erreur "Invalid signature" sur le webhook Stripe**
→ Vérifie `STRIPE_WEBHOOK_SECRET` — il doit correspondre au webhook créé en prod

**MongoDB connection timeout**
→ Vérifie que `0.0.0.0/0` est autorisé dans MongoDB Atlas Network Access

**Les analytics ne s'enregistrent pas**
→ Vérifie `MONGODB_ANALYTICS_URI` dans Vercel, le nom de la base (`foodtracks-analytics`) et les credentials

**Erreur "Price ID introuvable dans Stripe"**
→ Vérifie `STRIPE_PRO_PRICE_ID` — le prix doit être de type "Recurring" (pas one-time)
