# FoodTracks — Refonte positionnement large (mai 2026)

## Décision business

Le positionnement "food truck only" plafonne le TAM à ~10 000 unités FR. On élargit vers **tous les petits commerces alimentaires indépendants à forte rotation/saisonnalité**. Brand "FoodTracks" gardée — "Food" est suffisamment large.

## Nouveau positionnement

### Promesse universelle (FR)
> **L'IA qui dit à votre commerce combien préparer demain.**
> Prévisions IA + stock + ventes + rentabilité, pour boulangers, food trucks, snacks, glaciers, cafés et marchés. 5h/semaine économisées, invendus divisés par 2.

### Promesse universelle (EN)
> **The AI that tells your shop how much to prep tomorrow.**
> AI forecasts + stock + sales + margins, for bakeries, food trucks, snacks, ice cream shops, cafés and market stalls. Save 5h/week, halve your waste.

### Verticales cibles (à mettre en avant explicitement)

| FR | EN | Use case 1-line |
|---|---|---|
| Boulangeries / pâtisseries | Bakeries / pastry shops | "Combien de baguettes je sors demain ?" |
| Food trucks | Food trucks | "Combien je prépare avant le rush du midi ?" |
| Snacks / sandwicheries | Snack bars / sandwich shops | "Stock viandes/pains ajusté à la fréquentation" |
| Glaciers | Ice cream shops | "Production parfums adaptée à la météo" |
| Cafés / coffee shops | Cafés / coffee shops | "Pâtisseries et boissons ajustées à l'affluence" |
| Marchands de marché | Market stallholders | "Quantité chargée selon météo et marché" |

## Tone of voice

- **Direct, concret, patron de petit commerce**. Pas tech. Pas startup. Pas anglicismes inutiles.
- Tutoiement FR garde le côté "on parle direct" (cohérent avec la home actuelle "ton spot, ton jour").
- Données chiffrées partout (5h, 87%, -30% gaspillage, etc.).
- Mots-clés : "préparer demain", "invendus", "marge", "stock", "ventes", "rentabilité", "météo".

## Brand DNA visuel (NE PAS CHANGER)

```
ORANGE = #F97316  (CTA, accents, gradient)
DARK   = #0D0905  (hero background)
SUMUP  = #00B6FF  (badge SumUp)
GREEN  = #22C55E  (checkmarks reassurance)
Police titres : Plus Jakarta Sans (font-jakarta)
Style : dark hero + orange accents + dot-grid background
```

## Structure homepage (nouvelle)

```
1. HERO              — Tagline universelle + CTA primary "/register" + screenshot dashboard
2. POUR QUI ?        — NOUVELLE section : grille 6 verticales avec icône + use case
3. COMMENT ÇA MARCHE — 3 steps (connecter ventes / IA apprend / prévisions chaque matin)
4. FEATURES          — 4 piliers : Prévisions IA / Stock / Ventes & POS / Rentabilité
5. PROOF             — Stats (87% accuracy, 5h/sem, etc.) + (testimonial différé si aucun)
6. PRICING TEASE     — 1 bloc avec CTA → /pricing
7. FAQ               — accordion (existant, copy à élargir)
8. FOOTER CTA        — bandeau "Essai 14j gratuit"
```

## Schéma i18n FINAL — clé `Landing` dans messages/{fr,en}.json

**Tous les agents DOIVENT utiliser exactement ces clés.** Pas d'invention de clés en dehors de ce schéma. Si une clé manque, l'ajouter dans ce schéma et utiliser la même partout.

```jsonc
"Landing": {
  "badge": "string",                     // "Pour les commerces alimentaires indépendants"
  "hero": {
    "title": "string",                   // 2 phrases séparées par un point. Ex: "L'IA qui dit à votre commerce. Combien préparer demain."
    "subtitle": "string",                // sous-titre
    "ctaPrimary": "string",              // "Essai gratuit 14 jours"
    "ctaSecondary": "string",            // "Voir comment ça marche"
    "noCreditCard": "string",
    "moneyBack": "string",
    "cancelAnytime": "string",
    "accuracyStat": "string",            // "87%"
    "accuracyLabel": "string"            // "précision des prévisions"
  },
  "verticals": {
    "title": "string",                   // "Conçu pour votre commerce"
    "subtitle": "string",                // "Une seule plateforme, six métiers."
    "items": {
      "bakery":     { "name": "string", "use": "string" },
      "foodtruck":  { "name": "string", "use": "string" },
      "snack":      { "name": "string", "use": "string" },
      "icecream":   { "name": "string", "use": "string" },
      "cafe":       { "name": "string", "use": "string" },
      "market":     { "name": "string", "use": "string" }
    }
  },
  "howItWorks": {
    "title": "string",
    "subtitle": "string",
    "step1": { "title": "string", "description": "string" },
    "step2": { "title": "string", "description": "string" },
    "step3": { "title": "string", "description": "string" }
  },
  "features": {
    "title": "string",
    "subtitle": "string",
    "predictions": { "title": "string", "description": "string" },
    "stock":       { "title": "string", "description": "string" },
    "sales":       { "title": "string", "description": "string" },
    "margins":     { "title": "string", "description": "string" }
  },
  "proof": {
    "title": "string",
    "stat1": { "value": "string", "label": "string" },     // "87%" / "précision IA"
    "stat2": { "value": "string", "label": "string" },     // "5h" / "économisées par semaine"
    "stat3": { "value": "string", "label": "string" },     // "-30%" / "d'invendus en moyenne"
    "stat4": { "value": "string", "label": "string" }      // "+12pts" / "de marge nette"
  },
  "pricingTease": {
    "title": "string",
    "subtitle": "string",
    "cta": "string"                      // "Voir les tarifs"
  },
  "faq": {
    "title": "string",
    "subtitle": "string",
    "q1": { "question": "string", "answer": "string" },
    "q2": { "question": "string", "answer": "string" },
    "q3": { "question": "string", "answer": "string" },
    "q4": { "question": "string", "answer": "string" },
    "q5": { "question": "string", "answer": "string" },
    "q6": { "question": "string", "answer": "string" },
    "q7": { "question": "string", "answer": "string" }
  },
  "footerCta": {
    "title": "string",
    "subtitle": "string",
    "primary": "string",                 // → /register
    "secondary": "string"                // → /pricing
  }
}
```

**FAQ topics obligatoires :**
1. Compatibilité avec mon métier (boulangerie/snack/glacier...) ?
2. Faut-il un POS spécifique ? (SumUp natif, Square via CSV, manuel possible)
3. Combien de temps avant que l'IA soit précise ? (4-6 semaines)
4. Mes données sont sécurisées ?
5. Je peux annuler quand ?
6. Est-ce que ça marche pour multi-établissements ?
7. Combien coûte la version Pro ?

## Périmètre de la refonte

**À refondre :**
- `messages/fr.json` + `messages/en.json` — section `Landing` (réécriture complète sur le schéma ci-dessus)
- `app/[locale]/page.tsx` — homepage server component (metadata + hero + structure jsonLd)
- `app/[locale]/HomeClient.tsx` — toutes les sections client (Pour qui, Comment ça marche, Features, Proof, Pricing tease, FAQ, Footer CTA)
- `app/[locale]/comment-ca-marche/page.tsx` — adapter copy (élargir food truck → commerces)
- `app/[locale]/faq/page.tsx` — adapter copy
- `app/sitemap.ts` (si existe) — lastModified

**À NE PAS toucher (out of scope cette session) :**
- `/pricing`, `/auth/*`, `/dashboard/*`
- Articles de blog (`app/[locale]/blog/[slug]`)
- `/outils/calculateur-rentabilite` (déjà ajusté)
- `/demo` (à supprimer ou laisser, ne pas modifier)
- `app/[locale]/fonctionnalites/*` (sera adapté ultérieurement)
- `app/[locale]/ville/*` (SEO local food truck — à laisser, ils marchent)
- Composants `LandingHeader`, `AnimatedSection`, `CountUp`
- Logique business / API / DB
- Analytics tracking (déjà OK)

## Conventions techniques

- **Server vs Client** : page.tsx reste server component (SEO + metadata + JSON-LD). Toutes les sections animées/interactives = HomeClient (client).
- **Tracking** : conserver `data-track-component` sur tous les CTA. Pour les nouveaux : `home-verticals-{name}`, `home-howitworks-cta`, `home-features-cta`, `home-pricing-tease-cta`, `home-footer-cta-primary`, `home-footer-cta-secondary`. Le hero garde `home-hero-cta-primary` / `home-hero-cta-secondary`.
- **CTAs** : tous les CTA "essai" pointent vers `/{locale}/register?utm_source=home&utm_medium=<section>`. Pas de `/demo`.
- **Icônes** : utiliser `lucide-react` (déjà importé). Verticales : `Wheat` (boulangerie), `Truck` (food truck), `Sandwich` (snack), `IceCream` (glacier), `Coffee` (café), `Tent` (marché).
- **TypeScript strict** : pas d'erreurs `npx tsc --noEmit -p .` à la fin.
- **next-intl** : utiliser `useTranslations('Landing')` côté client, `getTranslations('Landing')` côté server.

## Risques à éviter

1. ❌ Ne pas inventer de clés i18n hors schéma → divergence FR/EN
2. ❌ Ne pas casser le SEO existant : metadata FR/EN doit garder les mots-clés porteurs (logiciel gestion food truck, food truck management software) ET ajouter les nouveaux (logiciel boulangerie, etc.)
3. ❌ Ne pas supprimer les screenshots dashboardfr.jpg / dashboarden.jpg / stockfr.jpg / stocken.jpg (en `public/`) — les réutiliser
4. ❌ Ne pas changer les imports d'icônes existants → adapter seulement
5. ❌ Ne pas toucher à `LandingHeader` (header global)
