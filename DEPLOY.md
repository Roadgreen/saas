# 🚀 Guide de déploiement StockChef

## Vercel + Supabase (Production)

### Étape 1 : Créer la base de données Supabase

1. **Créer un compte** sur [supabase.com](https://supabase.com)

2. **Créer un nouveau projet**
   - Choisis un nom (ex: `stockchef-prod`)
   - Définis un mot de passe fort pour la base de données → **note-le !**
   - Choisis la région la plus proche (ex: `eu-west-3` pour Paris)

3. **Récupérer les URLs de connexion**
   - Va dans **Settings → Database**
   - Copie les deux URLs :
     - **Connection string (Transaction)** → port `6543` → pour `DATABASE_URL`
     - **Connection string (Session)** → port `5432` → pour `DIRECT_URL`
   
   Elles ressemblent à ça :
   ```
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
   DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
   ```

---

### Étape 2 : Préparer le code

1. **Créer un repo GitHub** (si pas déjà fait)
   ```bash
   cd /chemin/vers/saas
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ton-username/stockchef.git
   git push -u origin main
   ```

2. **Vérifier le `.gitignore`** - assure-toi que `.env` est ignoré !

---

### Étape 3 : Déployer sur Vercel

1. **Connecte-toi** sur [vercel.com](https://vercel.com) avec GitHub

2. **Importer le projet**
   - Clique sur "Add New Project"
   - Sélectionne ton repo `stockchef`

3. **Configurer les variables d'environnement**
   
   Dans la section "Environment Variables", ajoute :

   | Variable | Valeur |
   |----------|--------|
   | `DATABASE_URL` | `postgresql://postgres.[ref]:[password]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres` |
   | `DIRECT_URL` | `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres` |
   | `AUTH_SECRET` | Génère avec : `openssl rand -base64 32` |
   | `OPENAI_API_KEY` | Ta clé OpenAI |

4. **Déployer** - Clique sur "Deploy"

---

### Étape 4 : Initialiser la base de données

Après le premier déploiement, tu dois créer les tables dans Supabase.

**Option A : Depuis ton terminal local**
```bash
# Configure ton .env local avec les URLs Supabase
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Pousse le schéma vers Supabase
npx prisma db push
```

**Option B : Via Vercel CLI** (si tu l'as installé)
```bash
vercel env pull .env.local
npx prisma db push
```

---

### Étape 5 : Vérifier le déploiement

1. Visite ton URL Vercel (ex: `https://stockchef-xxx.vercel.app`)
2. Teste l'inscription et la connexion
3. Vérifie que les données se créent dans Supabase (onglet "Table Editor")

---

## 🔧 Commandes utiles

```bash
# Développement local
npm run dev

# Voir la base de données
npm run db:studio

# Appliquer les migrations en production
npm run db:migrate

# Synchroniser le schéma (dev uniquement)
npm run db:push
```

---

## 📝 Notes importantes

### Sécurité
- Ne commite **jamais** le fichier `.env`
- Change le `AUTH_SECRET` en production
- Utilise des mots de passe forts pour Supabase

### Performance Supabase
- `DATABASE_URL` (port 6543) : utilise le **connection pooler** → pour l'app
- `DIRECT_URL` (port 5432) : connexion directe → pour les migrations Prisma

### Domaine personnalisé
1. Dans Vercel → Settings → Domains
2. Ajoute ton domaine (ex: `app.stockchef.fr`)
3. Configure les DNS chez ton registrar

### Coûts estimés
- **Vercel Hobby** : Gratuit (limité à usage personnel)
- **Vercel Pro** : 20$/mois (usage commercial)
- **Supabase Free** : Gratuit jusqu'à 500MB + 2 projets
- **Supabase Pro** : 25$/mois (backups, plus de ressources)

---

## 🆘 Dépannage

**Erreur Prisma "Can't reach database server"**
→ Vérifie que `DIRECT_URL` est bien configuré dans Vercel

**Erreur "NEXTAUTH_URL" en production**
→ Vercel le configure automatiquement, pas besoin de l'ajouter

**Les images ne s'affichent pas**
→ Ajoute les domaines autorisés dans `next.config.ts` :
```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};
```
