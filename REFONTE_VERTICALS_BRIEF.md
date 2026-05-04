# FoodTracks — Landings verticales SEO (mai 2026)

## Objectif

Créer 5 landing pages verticales bilingues (FR + EN) pour SEO long-tail :
- `/fr/boulangerie` — `/en/boulangerie` (slug FR partagé)
- `/fr/snack`
- `/fr/glacier`
- `/fr/cafe`
- `/fr/marche`

Chaque page = même structure, copy adaptée au métier, hero image dédiée, JSON-LD SEO, CTA → `/register`. SEO long-tail capturant des requêtes spécifiques par vertical.

## Brand DNA (rappel — ne pas changer)

```
ORANGE = #F97316  (CTA, accents)
DARK   = #0D0905  (hero background)
SUMUP  = #00B6FF  (badge SumUp)
GREEN  = #22C55E  (checkmarks)
Police titres : Plus Jakarta Sans (font-jakarta)
```

## Structure de chaque landing (sections)

```
1. HERO              — Tagline vertical + sub + CTA + image hero (vertical-specific)
2. PAIN POINTS       — 3 douleurs spécifiques au métier
3. FEATURES          — 4 piliers (prévision / stock / ventes / rentabilité) re-coloriés vertical
4. USE CASES         — 3 cas concrets chiffrés
5. FAQ               — 4 questions vertical-specific
6. FOOTER CTA        — bandeau "Essai 14j gratuit + 9,99€ premier mois"
```

## Slugs + métiers

| Slug | Vertical | Icon lucide | FR title | EN title |
|---|---|---|---|---|
| `boulangerie` | bakery | `Wheat` | Logiciel boulangerie & pâtisserie indépendante | Bakery & pastry shop management software |
| `snack` | snack | `Sandwich` | Logiciel snack, sandwicherie & fast-good | Snack bar & sandwich shop management software |
| `glacier` | icecream | `IceCream` | Logiciel glacier artisanal | Ice cream shop management software |
| `cafe` | cafe | `Coffee` | Logiciel café & coffee shop indépendant | Coffee shop & café management software |
| `marche` | market | `Tent` | Logiciel marchand de marché alimentaire | Market stallholder management software |

## Schéma TypeScript STRICT — `lib/verticals/data.ts`

Tous les agents doivent utiliser ce schéma exact. Pas d'invention de champs.

```ts
import type { LucideIcon } from 'lucide-react';

export interface UseCase {
  metric: string;        // "+€420/mois" or "−30%"
  title: string;         // 3-5 mots
  description: string;   // 1 phrase concrète
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface PainItem {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface VerticalContent {
  /** SEO H1 — court, riche en mots-clés. Ex: "Logiciel pour boulangerie indépendante" */
  title: string;
  metaTitle: string;          // tag <title> (max 60-70 chars)
  metaDescription: string;    // meta description (max 160 chars)
  heroBadge: string;          // "Pour les boulangers indépendants"
  heroTagline: string;        // 1 phrase forte. Verbal + concret.
  heroSub: string;            // sub-tagline 1-2 phrases.
  ctaPrimary: string;         // "Essai 14 jours gratuit"
  ctaSecondary: string;       // "Voir comment ça marche"
  painTitle: string;          // titre section "Vos douleurs au quotidien"
  pains: [PainItem, PainItem, PainItem]; // exactement 3
  featuresTitle: string;
  features: [FeatureItem, FeatureItem, FeatureItem, FeatureItem]; // exactement 4
  useCasesTitle: string;
  useCases: [UseCase, UseCase, UseCase]; // exactement 3
  faqTitle: string;
  faqs: [FaqItem, FaqItem, FaqItem, FaqItem]; // exactement 4
  footerCtaTitle: string;
  footerCtaSubtitle: string;
  footerCtaPrimary: string;   // "Démarrer mon essai gratuit"
  footerCtaSecondary: string; // "Voir tous les tarifs"
}

export interface VerticalConfig {
  slug: 'boulangerie' | 'snack' | 'glacier' | 'cafe' | 'marche';
  vertical: 'bakery' | 'snack' | 'icecream' | 'cafe' | 'market';
  iconName: 'Wheat' | 'Sandwich' | 'IceCream' | 'Coffee' | 'Tent';
  heroImage: string;          // "/verticals/boulangerie.jpg" — 1024x768
  keywords: {
    fr: string[];             // 8-12 keywords FR
    en: string[];             // 8-12 keywords EN
  };
  fr: VerticalContent;
  en: VerticalContent;
}

export const VERTICALS: VerticalConfig[];
export function getVerticalBySlug(slug: string): VerticalConfig | undefined;
```

## Tone & contenu par vertical

**Boulangerie** : focus sur invendus quotidiens (baguettes, viennoiseries jetées le soir), précision météo (chaleur = -30% pain, pluie = +20% sandwiches), production matinale, multi-services (déjeuner sandwich + viennoiseries). Mots-clés : "réduire invendus boulangerie", "logiciel pâtisserie", "prévision baguettes".

**Snack** : volume midi (rush 12h-14h), prep-quantités viandes/sauces/pains, gestion food cost, multi-formules (menu, à la carte, livraison Uber Eats). Mots-clés : "logiciel snack indépendant", "gestion stock sandwicherie", "snack restauration rapide".

**Glacier** : météo CRITIQUE (35°C = +200% ventes vs 15°C nuageux), production parfums sur 2-3 jours, pertes glaces invendues. Mots-clés : "logiciel glacier artisanal", "prévision météo glace", "gestion production parfums".

**Café/Coffee shop** : pâtisseries du matin (croissants, cookies), boissons spécialité (latte, matcha), affluence horaire, multi-prestations (à emporter / sur place). Mots-clés : "logiciel coffee shop", "gestion café indépendant", "spécialité boissons stock".

**Marchand de marché** : jours fixes (mardi marché X, samedi marché Y), météo + saisonnalité, transport quantités, produits frais (poisson/fromage/légumes/charcuterie). Mots-clés : "logiciel marchand marché", "gestion étal marché", "vendeur marché alimentaire".

## Routes Next.js

Créer pour chaque vertical :
```
app/[locale]/{slug}/page.tsx       # ex: app/[locale]/boulangerie/page.tsx
```

Le `page.tsx` doit :
- Être server component (`async function ({ params })`)
- Récupérer `slug` via le path (hardcodé par fichier — chaque page importe le même slug)
- Importer `getVerticalBySlug` + composant `VerticalLandingTemplate`
- Générer `generateMetadata` à partir de `VerticalContent.metaTitle` / `metaDescription` / keywords
- Inclure JSON-LD : `Service` (FoodTracks), `BreadcrumbList`, `FAQPage` (à partir des 4 faqs)
- Render le template avec la config

## Composant template

`app/[locale]/_components/VerticalLandingTemplate.tsx` (ou `components/landing/VerticalLandingTemplate.tsx`)

Server component (le mieux pour SEO). Sections :
1. `<LandingHeader />` (réutilisé)
2. Hero dark (avec heroImage à droite, copy à gauche, CTA primary → /register?utm_source={slug}&utm_medium=hero)
3. Pain points (3 cartes claires)
4. Features (4 piliers en grille)
5. Use cases (3 stats / cas)
6. FAQ (accordion ou simple `<details>`)
7. Footer CTA (orange, 2 boutons, primary → /register, secondary → /pricing)

Tracking : `data-track-component="vertical-{slug}-hero-cta"`, `vertical-{slug}-footer-cta`.

## Images hero

Images générées via Gemini Nano Banana (`gemini-2.5-flash-image`).
- Taille : 1024×768 ou 1024×1024
- Style : photo pro warm-tinted, intérieur boutique avec dashboard FoodTracks visible sur tablette/écran
- Path : `public/verticals/{slug}.jpg` (1 image par vertical, partagée FR/EN)

Prompt template : "Professional warm-toned photo of a {vertical} interior in France, with a tablet showing a clean orange-themed analytics dashboard on the counter. Soft natural light, modern but cozy, suitable for a SaaS landing page hero. No people faces visible, focus on the place and the tablet screen."

## SEO + sitemap

- Ajouter chaque slug × locale dans `app/sitemap.ts` (10 URLs au total)
- `lastModified: new Date()`
- `priority: 0.8`
- `changeFrequency: 'monthly'`

## Internal linking

- Ajouter dans la home (section `verticals.items.{X}`) : chaque carte clickable → /{locale}/{slug} (déjà partiellement fait, vérifier `<Link>`)
- Ajouter en footer global : 1 lien par landing vertical (composant `Footer` si existe)

## Hors scope

- Pas de `/fr/food-truck` — déjà couvert par `/food-truck-management-software` et `/ville/*`
- Pas de blog articles dédiés (à faire plus tard via le scaffold blog existant)
- Pas de feature spéc différente : même produit, même tarification

## Validation

- `npx tsc --noEmit -p .` doit passer (0 erreurs)
- JSON valide pour `messages/*.json`
- `npx next build` doit produire les 10 pages (5 slugs × 2 locales)
- Chaque page accessible : http 200 + h1 + meta correct
