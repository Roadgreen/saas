export interface BlogArticle {
  slug: string;
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  category: { fr: string; en: string };
  date: string;
  readTime: number;
  keywords: string[];
  heroImage: string;
  content: { fr: string; en: string };
  /** Short quotable takeaways for AI engines (GEO) */
  keyTakeaways?: { fr: string[]; en: string[] };
  /** Per-article FAQ for rich snippets + AI citation (GEO) */
  faqItems?: { question: { fr: string; en: string }; answer: { fr: string; en: string } }[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "comment-gerer-stock-food-truck",
    title: {
      fr: "Comment gérer le stock de son food truck efficacement",
      en: "How to Manage Food Truck Inventory Efficiently",
    },
    excerpt: {
      fr: "Découvrez les meilleures pratiques pour gérer votre stock en food truck : éviter les ruptures, limiter le gaspillage et maximiser vos marges.",
      en: "Discover best practices for food truck inventory management: avoid stockouts, limit waste, and maximize margins.",
    },
    category: { fr: "Gestion", en: "Management" },
    date: "2025-02-15",
    readTime: 12,
    keywords: ["gestion stock food truck", "inventaire food truck", "stock restaurant ambulant"],
    heroImage: "/blog/gestion-stock.png",
    content: {
      fr: `## Pourquoi la gestion des stocks est cruciale en food truck

La gestion des stocks est le nerf de la guerre pour tout food trucker. Contrairement à un restaurant classique, vous travaillez avec un espace de stockage limité, des produits périssables et une demande variable selon les emplacements. **Une mauvaise gestion peut réduire vos marges de 15 à 30%.**

### Le défi unique du food truck

En food truck, vous devez jongler avec plusieurs contraintes :
- **Espace limité** : votre camion ne peut stocker qu'une quantité finie de produits
- **Pas de chambre froide** : vos frigos embarqués ont une capacité réduite
- **Demande variable** : un marché le mardi et un festival le week-end n'ont rien à voir
- **Pas de réapprovisionnement rapide** : impossible de courir chez le fournisseur en plein service

## Les 5 piliers d'une gestion de stock efficace

### 1. Connaître sa consommation moyenne par service

La première étape est de **mesurer précisément** ce que vous consommez par service. Pour chaque produit, notez :
- La quantité utilisée par jour
- La quantité jetée (gaspillage)
- Les ruptures de stock rencontrées

Après quelques semaines, vous aurez une base solide pour vos commandes. Avec un outil comme **FoodTracks**, cette analyse se fait automatiquement grâce au scan de vos factures et au suivi de vos ventes via SumUp.

### 2. Adapter vos commandes à votre planning

Votre planning de la semaine dicte vos besoins en stock. Si vous faites 3 services dans la semaine, vous ne commandez pas comme si vous en faisiez 7.

**Astuce pro** : créez un tableau de commande type par nombre de services prévu. Par exemple :
- 2 services → commande légère (50% de la base)
- 4 services → commande standard (100%)
- 6+ services → commande renforcée (130%)

### 3. Appliquer la méthode FIFO (First In, First Out)

Le principe est simple : **les produits les plus anciens sortent en premier**. En food truck, c'est vital car vos produits frais ont une durée de vie courte.

Organisez votre stockage pour que les nouveaux produits aillent au fond et les anciens restent devant. Étiquetez tout avec la date de réception.

### 4. Suivre les dates de péremption en temps réel

Les pertes liées aux péremptions peuvent représenter **5 à 10% de votre chiffre d'affaires** si elles ne sont pas maîtrisées.

Avec FoodTracks, vous recevez des alertes automatiques quand un produit approche de sa date limite. Vous pouvez alors :
- Adapter votre menu pour écouler le produit
- Proposer une promotion flash
- Donner à une association (et bénéficier d'un avantage fiscal)

### 5. Analyser vos données pour prédire vos besoins

Les données sont votre meilleur allié. En croisant :
- Vos ventes passées par emplacement
- La météo prévue
- Le type d'événement

Vous pouvez **prédire avec précision** vos besoins pour chaque service. C'est exactement ce que fait le module de prédictions de FoodTracks.

## Les erreurs les plus courantes

### Sur-stockage
Commander trop "au cas où" semble prudent mais c'est un piège. Le sur-stockage entraîne :
- Du gaspillage (produits périmés)
- De la trésorerie immobilisée
- Un encombrement du camion

### Sous-stockage
À l'inverse, ne pas commander assez vous fait perdre des ventes. Un client qui ne peut pas commander son plat préféré est un client déçu — et potentiellement perdu.

### Ne pas tenir de fiches techniques
Chaque recette doit avoir sa **fiche technique** avec les quantités exactes par portion. Sans ça, impossible de calculer votre coût matière réel.

## Comment FoodTracks simplifie tout ça

FoodTracks est conçu spécifiquement pour les food truckers. Voici comment il résout chaque problème :

| Problème | Solution FoodTracks |
|----------|-------------------|
| Suivi des stocks | Scan automatique des factures |
| Prévisions de vente | IA prédictive par emplacement |
| Dates de péremption | Alertes automatiques |
| Coût matière | Fiches techniques avec calcul auto |
| Ventes | Intégration SumUp en temps réel |

### Résultat concret

Nos utilisateurs constatent en moyenne :
- **-25% de gaspillage** dès le premier mois
- **+15% de marge** grâce à l'optimisation des commandes
- **2h gagnées par semaine** sur la gestion administrative

## Conclusion

La gestion des stocks en food truck n'est pas une science exacte, mais avec les bons outils et les bonnes habitudes, vous pouvez transformer cette contrainte en avantage compétitif. **Commencez par mesurer, puis optimisez progressivement.**

[Essayez FoodTracks gratuitement](https://foodtracks.io/fr/pricing) et prenez le contrôle de vos stocks dès aujourd'hui.`,
      en: `## Why Inventory Management is Crucial for Food Trucks

Inventory management is the backbone of any food truck operation. Unlike a traditional restaurant, you work with limited storage, perishable products, and variable demand depending on locations. **Poor management can reduce your margins by 15 to 30%.**

### The Unique Food Truck Challenge

Food truck operators must juggle several constraints:
- **Limited space**: your truck can only store a finite quantity
- **No walk-in cooler**: your onboard fridges have reduced capacity
- **Variable demand**: a Tuesday market and a weekend festival are worlds apart
- **No quick restocking**: you can't run to the supplier mid-service

## The 5 Pillars of Efficient Inventory Management

### 1. Know Your Average Consumption Per Service

The first step is to **precisely measure** what you use per service. For each product, track:
- Quantity used per day
- Quantity wasted
- Stockouts encountered

After a few weeks, you'll have a solid foundation for ordering. With **FoodTracks**, this analysis happens automatically through invoice scanning and SumUp sales tracking.

### 2. Adapt Orders to Your Schedule

Your weekly schedule dictates your stock needs. If you have 3 services per week, you don't order as if you had 7.

### 3. Apply FIFO (First In, First Out)

The principle is simple: **oldest products go out first**. In a food truck, this is vital because fresh products have short shelf lives.

### 4. Track Expiration Dates in Real Time

Expiration losses can represent **5 to 10% of your revenue** if not controlled. With FoodTracks, you get automatic alerts when products approach their expiry date.

### 5. Analyze Data to Predict Needs

Data is your best ally. By cross-referencing past sales, weather forecasts, and event types, you can **accurately predict** needs for each service.

## How FoodTracks Simplifies Everything

FoodTracks is designed specifically for food truck operators, with automatic invoice scanning, AI-powered predictions, expiry alerts, and real-time SumUp integration.

[Try FoodTracks for free](https://foodtracks.io/en/pricing) and take control of your inventory today.`,
    },
    keyTakeaways: {
      fr: [
        "Une mauvaise gestion des stocks peut réduire vos marges de 15 à 30%",
        "La méthode FIFO (Premier Entré, Premier Sorti) est essentielle en food truck",
        "Les pertes liées aux péremptions représentent 5 à 10% du CA sans suivi",
        "L'IA permet de prédire vos besoins avec 92% de précision en croisant ventes, météo et événements",
      ],
      en: [
        "Poor inventory management can reduce margins by 15 to 30%",
        "FIFO (First In, First Out) is essential for food trucks",
        "Expiration losses represent 5-10% of revenue without tracking",
        "AI predicts needs with 92% accuracy by cross-referencing sales, weather, and events",
      ],
    },
    faqItems: [
      {
        question: { fr: "Comment éviter le gaspillage en food truck ?", en: "How to avoid food waste in a food truck?" },
        answer: { fr: "Utilisez la méthode FIFO, suivez les dates de péremption en temps réel, et utilisez un outil de prédictions IA comme FoodTracks pour commander la bonne quantité.", en: "Use the FIFO method, track expiration dates in real-time, and use an AI prediction tool like FoodTracks to order the right quantity." },
      },
      {
        question: { fr: "Quelle est la meilleure méthode de gestion de stock pour un food truck ?", en: "What is the best inventory management method for a food truck?" },
        answer: { fr: "La combinaison FIFO + prédictions IA + scan de factures est la plus efficace. Cela permet de réduire le gaspillage de 40% en moyenne.", en: "The combination of FIFO + AI predictions + invoice scanning is most effective. This reduces waste by 40% on average." },
      },
    ],
  },
  {
    slug: "logiciel-gestion-food-truck",
    title: {
      fr: "Quel logiciel de gestion choisir pour son food truck en 2025 ?",
      en: "Best Food Truck Management Software in 2025",
    },
    excerpt: {
      fr: "Comparatif des meilleurs logiciels de gestion pour food truck : fonctionnalités, prix et avis pour faire le bon choix.",
      en: "Compare the best food truck management software: features, pricing, and reviews to make the right choice.",
    },
    category: { fr: "Comparatif", en: "Comparison" },
    date: "2025-02-10",
    readTime: 10,
    keywords: ["logiciel gestion food truck", "application food truck", "outil gestion restaurant ambulant"],
    heroImage: "/blog/logiciel-gestion.png",
    content: {
      fr: `## Pourquoi un logiciel de gestion est indispensable en food truck

Gérer un food truck sans outil dédié, c'est comme conduire sans GPS. Vous pouvez y arriver, mais vous perdez du temps, de l'argent et de l'énergie. En 2025, les outils numériques ne sont plus un luxe — c'est une nécessité pour rester compétitif.

### Ce que doit faire un bon logiciel de gestion food truck

Un outil adapté aux food trucks doit couvrir :
- **Gestion des stocks** en temps réel
- **Suivi des ventes** avec connexion à votre TPE
- **Calcul des coûts matière** et marges
- **Prévisions de demande** selon les emplacements
- **Scan de factures** pour automatiser la saisie
- **Dashboard** avec KPIs essentiels

## Comparatif des solutions 2025

### FoodTracks — Le spécialiste food truck

**FoodTracks** est la seule solution conçue **exclusivement** pour les food trucks et restaurants ambulants.

**Points forts :**
- ✅ Scan IA des factures (plus de saisie manuelle)
- ✅ Intégration SumUp native
- ✅ Prédictions de vente par emplacement
- ✅ Suivi des péremptions avec alertes
- ✅ Dashboard de rentabilité en temps réel
- ✅ Interface mobile optimisée

**Prix :** Gratuit pour commencer, plans Pro dès 29€/mois

**Idéal pour :** Food truckers qui veulent un outil tout-en-un conçu pour leur métier.

### Solutions généralistes (Lightspeed, Square, etc.)

Les solutions comme Lightspeed ou Square sont des outils de caisse avec quelques fonctions de gestion.

**Points forts :**
- ✅ Écosystème mature
- ✅ Caisse enregistreuse intégrée

**Points faibles :**
- ❌ Pas conçu pour le food truck
- ❌ Pas de prédictions par emplacement
- ❌ Pas de scan de factures
- ❌ Prix élevé (79-199€/mois)

### Excel / Google Sheets

Beaucoup de food truckers commencent avec des tableurs. C'est gratuit, mais...

**Points faibles :**
- ❌ Saisie manuelle chronophage
- ❌ Pas de temps réel
- ❌ Erreurs humaines fréquentes
- ❌ Aucune automatisation
- ❌ Pas de prédictions

## Comment choisir ?

Posez-vous ces questions :
1. **Combien de temps** passez-vous sur la gestion administrative par semaine ?
2. **Combien perdez-vous** en gaspillage alimentaire par mois ?
3. **Avez-vous une vision claire** de votre rentabilité par emplacement ?

Si vous répondez "trop" à la première et "non" aux deux dernières, il est temps d'investir dans un outil adapté.

## Conclusion

En 2025, un logiciel de gestion n'est plus optionnel pour un food truck qui veut croître. **FoodTracks** se distingue par sa spécialisation food truck, son IA intégrée et son prix accessible.

[Testez FoodTracks gratuitement →](https://foodtracks.io/fr/pricing)`,
      en: `## Why Management Software is Essential for Food Trucks

Running a food truck without dedicated tools is like driving without GPS. You can manage, but you waste time, money, and energy. In 2025, digital tools aren't a luxury — they're a necessity to stay competitive.

### What Good Food Truck Software Should Do

A tool adapted for food trucks must cover:
- **Real-time inventory management**
- **Sales tracking** connected to your POS
- **Cost calculation** and margins
- **Demand forecasting** by location
- **Invoice scanning** for automated data entry
- **Dashboard** with essential KPIs

## 2025 Comparison

### FoodTracks — The Food Truck Specialist

**FoodTracks** is the only solution designed **exclusively** for food trucks and mobile restaurants.

**Strengths:**
- ✅ AI invoice scanning (no more manual entry)
- ✅ Native SumUp integration
- ✅ Sales predictions by location
- ✅ Expiry tracking with alerts
- ✅ Real-time profitability dashboard
- ✅ Mobile-optimized interface

**Price:** Free to start, Pro plans from €29/month

[Try FoodTracks for free →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "Un logiciel de gestion dédié food truck doit inclure : gestion de stock, prédictions IA, scan de factures et intégration caisse",
        "FoodTracks est le seul logiciel conçu exclusivement pour les food trucks avec intégration SumUp native",
        "Prix moyen d'un logiciel de gestion food truck : 20 à 100€/mois — FoodTracks commence à 0€",
      ],
      en: [
        "A food truck management software must include: inventory, AI predictions, invoice scanning, and POS integration",
        "FoodTracks is the only software designed exclusively for food trucks with native SumUp integration",
        "Average food truck software cost: €20-100/month — FoodTracks starts at €0",
      ],
    },
    faqItems: [
      {
        question: { fr: "Quel est le meilleur logiciel de gestion pour food truck ?", en: "What is the best management software for food trucks?" },
        answer: { fr: "FoodTracks est le logiciel le plus complet pour les food trucks : prédictions IA, scan de factures, intégration SumUp, suivi des marges. Gratuit pour commencer.", en: "FoodTracks is the most comprehensive software for food trucks: AI predictions, invoice scanning, SumUp integration, margin tracking. Free to start." },
      },
    ],
  },
  {
    slug: "reduire-gaspillage-alimentaire-food-truck",
    title: {
      fr: "Réduire le gaspillage alimentaire en food truck : guide pratique",
      en: "Reducing Food Waste in Your Food Truck: A Practical Guide",
    },
    excerpt: {
      fr: "Le gaspillage alimentaire coûte cher aux food truckers. Voici des stratégies concrètes pour le réduire et améliorer votre rentabilité.",
      en: "Food waste costs food truckers dearly. Here are concrete strategies to reduce it and improve profitability.",
    },
    category: { fr: "Conseils", en: "Tips" },
    date: "2025-02-05",
    readTime: 9,
    keywords: ["gaspillage alimentaire food truck", "réduire pertes food truck", "anti-gaspi restauration"],
    heroImage: "/blog/gaspillage-alimentaire.png",
    content: {
      fr: `## Le gaspillage alimentaire : un fléau silencieux pour les food trucks

En France, la restauration jette en moyenne **14% de la nourriture achetée**. Pour un food truck qui achète 2 000€ de matières premières par mois, ça représente **280€ jetés à la poubelle**. Sur un an : plus de 3 300€ de pertes évitables.

## Les 3 sources principales de gaspillage en food truck

### 1. Le sur-stockage
Commander trop par peur de manquer est le réflexe le plus coûteux. Les produits frais (légumes, viandes, sauces) ont une durée de vie courte dans un camion.

### 2. Les portions mal calibrées
Sans fiche technique précise, les portions varient d'un service à l'autre. Résultat : tantôt trop, tantôt pas assez.

### 3. La mauvaise prévision de fréquentation
Un mardi pluvieux et un samedi de festival n'ont rien à voir. Sans données fiables, vous préparez à l'aveugle.

## 7 stratégies concrètes pour réduire le gaspillage

### 1. Créez des fiches techniques pour chaque recette
Chaque plat doit avoir sa fiche avec les **quantités exactes par portion**. C'est la base de tout. FoodTracks vous permet de créer et gérer vos fiches techniques numériquement.

### 2. Utilisez la méthode FIFO
**First In, First Out** : les produits les plus anciens sortent en premier. Organisez votre stockage en conséquence.

### 3. Suivez vos dates de péremption
Un tableau blanc dans le camion ou, mieux, un **système d'alertes automatique** comme celui de FoodTracks. Vous recevez une notification quand un produit approche de sa date limite.

### 4. Analysez vos ventes par emplacement
Chaque emplacement a son propre rythme. Le marché du mardi ne génère pas les mêmes ventes que l'afterwork du jeudi. **FoodTracks analyse automatiquement vos ventes SumUp** par lieu et par jour pour affiner vos prévisions.

### 5. Adaptez votre menu
Proposez un "plat du jour" pour écouler les produits qui approchent de leur date limite. C'est anti-gaspi ET ça crée de la nouveauté pour vos clients fidèles.

### 6. Mesurez vos pertes
Ce qui ne se mesure pas ne s'améliore pas. Notez chaque perte (produit, quantité, raison) dans FoodTracks. Au bout d'un mois, vous verrez les patterns et pourrez agir.

### 7. Formez votre équipe
Si vous avez des employés, formez-les aux bonnes pratiques. Le gaspillage est souvent inconscient — une sensibilisation suffit à le réduire de 20%.

## L'impact financier concret

| Situation | Sans suivi | Avec FoodTracks |
|-----------|-----------|-----------------|
| Gaspillage mensuel | 280€ | 70€ |
| Marge nette | 35% | 42% |
| Temps de gestion | 4h/semaine | 1h/semaine |

## Conclusion

Réduire le gaspillage n'est pas qu'un geste écologique — c'est un levier de **rentabilité majeur**. Avec les bons outils et les bonnes habitudes, vous pouvez diviser vos pertes par 4.

[Commencez à réduire vos pertes avec FoodTracks →](https://foodtracks.io/fr/pricing)`,
      en: `## Food Waste: A Silent Problem for Food Trucks

In the restaurant industry, an average of **14% of purchased food is thrown away**. For a food truck spending €2,000 on raw materials monthly, that's **€280 in the bin**. Over a year: more than €3,300 in avoidable losses.

## 7 Concrete Strategies to Reduce Waste

1. Create technical sheets for each recipe
2. Use the FIFO method
3. Track expiration dates with automated alerts
4. Analyze sales by location
5. Adapt your menu with daily specials
6. Measure your losses systematically
7. Train your team

FoodTracks helps you implement all these strategies with automated invoice scanning, expiry alerts, and location-based sales analytics.

[Start reducing your losses with FoodTracks →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "Le gaspillage alimentaire coûte 15 à 30% du CA aux food truckers sans outil de gestion",
        "Le suivi des DLC et la méthode FIFO réduisent les pertes de 40%",
        "Les prédictions IA adaptent les commandes à la demande réelle par emplacement",
      ],
      en: [
        "Food waste costs food truckers 15-30% of revenue without management tools",
        "Expiry tracking and FIFO reduce losses by 40%",
        "AI predictions adapt orders to actual demand per location",
      ],
    },
    faqItems: [
      {
        question: { fr: "Combien coûte le gaspillage alimentaire en food truck ?", en: "How much does food waste cost in a food truck?" },
        answer: { fr: "Sans outil de gestion, le gaspillage alimentaire représente 15 à 30% du chiffre d'affaires d'un food truck, soit 22 500 à 75 000€ par an pour un CA de 150 000 à 250 000€.", en: "Without management tools, food waste represents 15-30% of a food truck's revenue, or €22,500-€75,000/year for €150,000-€250,000 annual revenue." },
      },
    ],
  },
  {
    slug: "ouvrir-food-truck-guide-complet",
    title: {
      fr: "Ouvrir un food truck en 2025 : le guide complet étape par étape",
      en: "How to Start a Food Truck in 2025: Complete Step-by-Step Guide",
    },
    excerpt: {
      fr: "De l'idée au premier service : tout ce qu'il faut savoir pour ouvrir son food truck en France. Budget, réglementation, équipement et conseils.",
      en: "From idea to first service: everything you need to know to start a food truck. Budget, regulations, equipment, and tips.",
    },
    category: { fr: "Guide", en: "Guide" },
    date: "2025-01-28",
    readTime: 15,
    keywords: ["ouvrir food truck", "créer food truck", "lancer food truck France", "guide food truck"],
    heroImage: "/blog/ouvrir-food-truck.png",
    content: {
      fr: `## Ouvrir un food truck : le rêve devenu accessible

Le food truck est l'un des modèles de restauration les plus dynamiques en France. Avec un investissement initial bien inférieur à un restaurant classique et une flexibilité incomparable, il attire de plus en plus d'entrepreneurs. Voici votre guide complet pour vous lancer.

## Étape 1 : Définir votre concept

Votre concept est votre identité. Il doit être :
- **Différenciant** : qu'est-ce qui vous rend unique ?
- **Réalisable** en camion : pas de plats nécessitant un four pro de restaurant
- **Rentable** : marge suffisante sur chaque plat
- **Identifiable** : les clients doivent comprendre votre offre en 3 secondes

### Les concepts qui marchent en 2025
- Smash burgers artisanaux
- Cuisine asiatique (bao, ramen, bibimbap)
- Pizzas napolitaines au feu de bois
- Cuisine healthy / veggie
- Crêpes et galettes bretonnes
- Tacos et cuisine tex-mex

## Étape 2 : Le business plan

Votre business plan doit inclure :

### Budget prévisionnel
| Poste | Budget estimé |
|-------|--------------|
| Camion (occasion aménagé) | 30 000 - 80 000€ |
| Aménagement / mise aux normes | 5 000 - 20 000€ |
| Matériel de cuisine | 3 000 - 10 000€ |
| Stock initial | 500 - 1 500€ |
| Assurances (année) | 1 500 - 3 000€ |
| Licences et formations | 500 - 1 000€ |
| Communication / branding | 1 000 - 5 000€ |
| **Total** | **41 500 - 120 500€** |

### Chiffre d'affaires prévisionnel
Un food truck en France génère en moyenne **3 000 à 8 000€ de CA par mois** la première année, selon le nombre de services et les emplacements.

## Étape 3 : Les démarches administratives

### Formation obligatoire
- **Formation hygiène HACCP** (14h minimum) — obligatoire
- Coût : 200-500€

### Statut juridique
Les options les plus courantes :
- **Micro-entreprise** : simple mais limitée (77 700€ de CA max)
- **SARL/EURL** : plus de flexibilité
- **SAS/SASU** : idéal si vous voulez des associés

### Autorisations
- **Carte de commerçant ambulant** : obligatoire si vous travaillez hors de votre commune
- **Autorisation d'occupation** du domaine public : à demander en mairie pour chaque emplacement fixe
- **Licence** : licence de débit de boissons si vous vendez de l'alcool

## Étape 4 : Choisir et aménager votre camion

### Neuf vs occasion
- **Occasion aménagée** : 30 000-80 000€, opérationnel rapidement
- **Neuf à aménager** : 50 000-120 000€, personnalisé mais plus long

### Équipement essentiel
- Plancha / grill
- Friteuse (si besoin)
- Réfrigérateur / congélateur
- Bac à plonge
- Hotte aspirante
- Groupe électrogène ou raccordement
- Terminal de paiement (SumUp recommandé pour sa simplicité)

## Étape 5 : Trouver vos emplacements

C'est **LE facteur clé de succès**. Les types d'emplacements :
- **Marchés** : réguliers, clientèle fidèle
- **Zones de bureaux** : midi en semaine
- **Événements** : festivals, mariages, événements d'entreprise
- **Zones commerciales** : parking de centres commerciaux (avec autorisation)

**Astuce** : utilisez les données de FoodTracks pour analyser la rentabilité de chaque emplacement et optimiser votre planning.

## Étape 6 : Gérer votre activité au quotidien

C'est là que beaucoup de food truckers galèrent. Entre les achats, les stocks, les ventes, la compta... ça peut vite devenir un cauchemar.

**FoodTracks** a été créé exactement pour ça :
- **Scannez vos factures** avec l'IA → vos stocks se mettent à jour automatiquement
- **Connectez SumUp** → vos ventes remontent en temps réel
- **Consultez votre dashboard** → rentabilité par emplacement, marge par plat
- **Recevez des prédictions** → combien préparer pour chaque service

## Conclusion

Ouvrir un food truck est une aventure passionnante et accessible. La clé du succès ? **Une bonne préparation et les bons outils.** Ne sous-estimez pas la partie gestion — c'est elle qui fait la différence entre un food truck qui survit et un food truck qui prospère.

[Commencez avec FoodTracks — gratuit pour démarrer →](https://foodtracks.io/fr/pricing)`,
      en: `## Starting a Food Truck: The Accessible Dream

The food truck is one of the most dynamic restaurant models. With a lower initial investment than a traditional restaurant and unmatched flexibility, it attracts more and more entrepreneurs.

## Key Steps

1. **Define your concept** — What makes you unique?
2. **Business plan** — Budget €41,500-€120,500 for a complete setup
3. **Administrative steps** — HACCP training, business registration, permits
4. **Choose your truck** — New vs used, essential equipment
5. **Find locations** — Markets, office zones, events
6. **Daily management** — Use FoodTracks to automate inventory, sales tracking, and predictions

[Get started with FoodTracks — free to begin →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "Budget total pour ouvrir un food truck : 41 500€ à 120 500€ (véhicule + équipement + démarches)",
        "La formation HACCP est obligatoire (14h minimum, ~400€)",
        "Les emplacements (marchés, zones de bureaux, festivals) sont le facteur clé de réussite",
        "Un logiciel de gestion comme FoodTracks est essentiel dès le démarrage pour piloter stocks et marges",
      ],
      en: [
        "Total budget to open a food truck: €41,500-€120,500 (vehicle + equipment + permits)",
        "HACCP training is mandatory (14h minimum, ~€400)",
        "Locations (markets, office zones, festivals) are the key success factor",
        "Management software like FoodTracks is essential from day one",
      ],
    },
    faqItems: [
      {
        question: { fr: "Combien coûte l'ouverture d'un food truck en France ?", en: "How much does it cost to open a food truck in France?" },
        answer: { fr: "Le budget total pour ouvrir un food truck en France se situe entre 41 500€ et 120 500€. Cela inclut le véhicule (25 000-80 000€), l'équipement (10 000-25 000€), les démarches administratives (1 500-5 500€) et le stock initial (5 000-10 000€).", en: "The total budget to open a food truck in France is between €41,500 and €120,500, including the vehicle (€25,000-€80,000), equipment (€10,000-€25,000), administrative costs (€1,500-€5,500), and initial stock (€5,000-€10,000)." },
      },
      {
        question: { fr: "Quelles sont les démarches pour ouvrir un food truck ?", en: "What are the steps to open a food truck?" },
        answer: { fr: "Les démarches incluent : formation HACCP obligatoire, immatriculation au RCS ou RNE, carte de commerçant ambulant, autorisation d'occupation du domaine public, assurance RC Pro, et déclaration en préfecture.", en: "Steps include: mandatory HACCP training, business registration, mobile trader card, public domain authorization, professional liability insurance, and prefecture declaration." },
      },
    ],
  },
  {
    slug: "rentabilite-food-truck-ameliorer",
    title: {
      fr: "Comment améliorer la rentabilité de son food truck : 10 leviers concrets",
      en: "How to Improve Food Truck Profitability: 10 Actionable Tips",
    },
    excerpt: {
      fr: "Votre food truck tourne mais les marges sont faibles ? Découvrez 10 leviers concrets pour booster votre rentabilité sans augmenter vos prix.",
      en: "Your food truck is running but margins are thin? Discover 10 actionable levers to boost profitability without raising prices.",
    },
    category: { fr: "Business", en: "Business" },
    date: "2025-01-20",
    readTime: 11,
    keywords: ["rentabilité food truck", "marge food truck", "augmenter bénéfices food truck"],
    heroImage: "/blog/rentabilite.png",
    content: {
      fr: `## La rentabilité : le vrai défi du food truck

Avoir un food truck qui tourne, c'est bien. Avoir un food truck **rentable**, c'est mieux. Beaucoup de food truckers font du chiffre mais peinent à dégager un vrai salaire. Voici 10 leviers concrets pour changer ça.

## Levier 1 : Connaître son coût matière réel

Le coût matière, c'est le rapport entre le coût des ingrédients et le prix de vente. **L'objectif : rester sous les 30%.**

Pour le calculer précisément, vous avez besoin de :
- Fiches techniques par recette (grammage exact)
- Prix d'achat actualisés de chaque ingrédient
- Suivi des portions réellement servies

**FoodTracks calcule automatiquement votre coût matière** en croisant vos factures scannées et vos fiches recettes.

## Levier 2 : Optimiser ses emplacements

Tous les emplacements ne se valent pas. Analysez pour chacun :
- Le chiffre d'affaires moyen
- Le nombre de clients
- Le panier moyen
- Les coûts associés (emplacement, carburant, temps de trajet)

Un emplacement qui génère 500€ de CA mais vous coûte 100€ en frais est moins rentable qu'un emplacement à 400€ sans frais.

## Levier 3 : Augmenter le panier moyen

Quelques techniques éprouvées :
- **Formules** : plat + boisson + dessert à prix réduit (mais marge globale supérieure)
- **Upselling** : "Vous voulez des frites avec ?" — classique mais efficace
- **Desserts à forte marge** : un cookie à 2€ avec un coût matière de 0,30€ = 85% de marge

## Levier 4 : Réduire le gaspillage

On en a parlé dans notre article dédié — chaque euro de gaspillage évité est un euro de bénéfice en plus. Visez **moins de 5% de pertes**.

## Levier 5 : Négocier avec vos fournisseurs

Regroupez vos commandes, comparez les prix, n'hésitez pas à changer de fournisseur. **Même 5% de réduction sur vos achats peut représenter 100-200€/mois** de marge supplémentaire.

## Levier 6 : Optimiser votre menu

Un menu trop large = plus de stocks, plus de complexité, plus de gaspillage. Les food trucks les plus rentables ont **5 à 8 plats maximum**.

Analysez la rentabilité de chaque plat (matrice BCG) :
- **Stars** : populaires ET rentables → mettez-les en avant
- **Vaches à lait** : rentables mais moins populaires → travaillez la présentation
- **Dilemmes** : populaires mais peu rentables → augmentez le prix ou réduisez les coûts
- **Poids morts** : ni populaires ni rentables → supprimez-les

## Levier 7 : Maîtriser ses charges fixes

Les charges fixes d'un food truck :
- Assurance : 150-250€/mois
- Emplacements : 0-500€/mois
- Abonnements (logiciels, téléphone) : 50-100€/mois
- Remboursement camion : 500-1 500€/mois
- Carburant : 200-400€/mois

Passez chaque poste en revue et cherchez des économies.

## Levier 8 : Digitaliser sa gestion

Le temps, c'est de l'argent. Chaque heure passée sur de la paperasse est une heure que vous ne passez pas à cuisiner ou à vendre.

**FoodTracks automatise** :
- La saisie des factures (scan IA)
- Le suivi des stocks
- L'analyse de rentabilité
- Les prévisions de vente

## Levier 9 : Développer la vente événementielle

Les événements privés (mariages, séminaires, anniversaires) offrent des marges bien supérieures :
- Prix fixé à l'avance (pas de surprise)
- Volume garanti
- Possibilité de menus premium

Créez une offre traiteur spécifique et communiquez dessus.

## Levier 10 : Fidéliser ses clients

Un client fidèle dépense **67% de plus** qu'un nouveau client. Mettez en place :
- Programme de fidélité (carte à tamponner ou digital)
- Présence sur les réseaux sociaux
- Newsletter avec vos emplacements de la semaine

## Conclusion

La rentabilité d'un food truck se joue sur de multiples leviers. Le plus important ? **Avoir des données fiables pour prendre les bonnes décisions.** C'est exactement la mission de FoodTracks.

[Optimisez votre rentabilité avec FoodTracks →](https://foodtracks.io/fr/pricing)`,
      en: `## Profitability: The Real Food Truck Challenge

Having a running food truck is good. Having a **profitable** one is better. Here are 10 concrete levers to improve your margins.

Key levers include knowing your true food cost (target under 30%), optimizing locations, increasing average ticket, reducing waste, negotiating with suppliers, optimizing your menu, controlling fixed costs, digitizing management, developing event catering, and building customer loyalty.

[Optimize your profitability with FoodTracks →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "Le coût matière (food cost) doit rester sous 30% du prix de vente",
        "Un food truck rentable vise une marge nette de 15 à 25%",
        "Les 3 leviers principaux : réduire le gaspillage, optimiser les emplacements, augmenter le ticket moyen",
        "La digitalisation de la gestion (stocks, ventes, marges) est le levier le plus sous-estimé",
      ],
      en: [
        "Food cost should stay under 30% of selling price",
        "A profitable food truck targets 15-25% net margin",
        "Top 3 levers: reduce waste, optimize locations, increase average ticket",
        "Digitizing management (stock, sales, margins) is the most underestimated lever",
      ],
    },
    faqItems: [
      {
        question: { fr: "Quelle est la marge d'un food truck ?", en: "What is a food truck's profit margin?" },
        answer: { fr: "Un food truck bien géré vise une marge brute de 65-75% et une marge nette de 15-25%. Le coût matière (food cost) doit rester sous 30% du prix de vente. Le CA moyen d'un food truck en France est de 150 000 à 250 000€/an.", en: "A well-managed food truck targets 65-75% gross margin and 15-25% net margin. Food cost should stay under 30%. Average food truck revenue in France is €150,000-€250,000/year." },
      },
    ],
  },
  {
    slug: "reglementation-food-truck-france",
    title: {
      fr: "Réglementation food truck en France : tout ce qu'il faut savoir en 2025",
      en: "Food Truck Regulations in France: Everything You Need to Know in 2025",
    },
    excerpt: {
      fr: "Normes d'hygiène, autorisations, assurances : le point complet sur la réglementation des food trucks en France.",
      en: "Hygiene standards, permits, insurance: a complete overview of food truck regulations in France.",
    },
    category: { fr: "Réglementation", en: "Regulations" },
    date: "2025-01-15",
    readTime: 13,
    keywords: ["réglementation food truck", "normes food truck France", "hygiène food truck", "autorisation food truck"],
    heroImage: "/blog/reglementation.png",
    content: {
      fr: `## La réglementation food truck : un passage obligé

La réglementation des food trucks en France peut sembler complexe, mais elle est essentielle pour exercer légalement et en toute sécurité. Ce guide fait le point sur tout ce que vous devez savoir en 2025.

## 1. Formation et qualifications obligatoires

### Formation HACCP
Toute personne manipulant des denrées alimentaires doit avoir suivi une **formation en hygiène alimentaire** (HACCP) d'au moins 14 heures.
- **Coût** : 200-500€
- **Validité** : à vie (mais une mise à jour régulière est recommandée)
- **Où** : organismes agréés (DRAAF)

### Déclaration auprès de la DDPP
Avant d'ouvrir, vous devez **déclarer votre activité** auprès de la Direction Départementale de la Protection des Populations (DDPP).

## 2. Normes d'hygiène

### Le Plan de Maîtrise Sanitaire (PMS)
Tout food truck doit avoir un **PMS** comprenant :
- Les bonnes pratiques d'hygiène (BPH)
- Le plan HACCP
- La traçabilité des produits
- Les procédures de nettoyage

### Obligations pratiques
- **Lavage des mains** : point d'eau avec savon et essuie-mains à usage unique
- **Chaîne du froid** : enregistrement des températures (FoodTracks peut automatiser ce suivi)
- **Séparation** : zones propres / zones sales
- **Affichage** : allergènes obligatoires (14 allergènes majeurs)
- **Traçabilité** : pouvoir retracer l'origine de chaque produit

## 3. Autorisations d'emplacement

### Carte de commerçant ambulant
**Obligatoire** si vous exercez hors de votre commune de domiciliation.
- Demande auprès du CFE (Centre de Formalités des Entreprises)
- Coût : ~30€
- Validité : 4 ans

### Autorisation d'occupation du domaine public (AOT)
Pour chaque emplacement sur la voie publique, vous avez besoin d'une **autorisation de la mairie**.
- Les conditions varient selon les communes
- Certaines mairies organisent des appels à candidatures
- Redevance : variable (0 à plusieurs centaines d'euros par mois)

### Marchés
Pour les marchés, c'est le **placier** qui attribue les emplacements. Vous devez :
- Vous inscrire auprès de la mairie
- Avoir votre carte de commerçant ambulant
- Payer un droit de place

## 4. Assurances obligatoires

### Responsabilité civile professionnelle
**Obligatoire** — elle couvre les dommages causés à des tiers (intoxication alimentaire, accident, etc.).

### Assurance du véhicule
Votre food truck est un **véhicule professionnel** — il nécessite une assurance spécifique couvrant :
- La circulation
- Le stationnement professionnel
- Le contenu (équipement, stock)
- La perte d'exploitation (optionnel mais recommandé)

**Budget** : 1 500 à 3 000€/an selon les garanties.

## 5. Réglementation spécifique

### Vente d'alcool
Si vous vendez de l'alcool, vous avez besoin d'une **licence** :
- Licence petite restauration (bière, vin, cidre)
- Formation obligatoire de 20h

### Affichage des prix
Les prix doivent être **visibles et lisibles** depuis l'extérieur du camion, TTC.

### Accessibilité
Votre service doit être **accessible aux personnes à mobilité réduite** dans la mesure du possible.

## 6. Contrôles et sanctions

Les **services vétérinaires** (DDPP) peuvent effectuer des contrôles à tout moment. En cas de non-conformité :
- **Avertissement** pour les manquements mineurs
- **Mise en demeure** avec délai pour se mettre en conformité
- **Fermeture administrative** pour les cas graves
- **Amendes** pouvant atteindre plusieurs milliers d'euros

### Comment se préparer ?
- Tenez votre PMS à jour
- Conservez toutes vos factures et bons de livraison (**FoodTracks les archive automatiquement**)
- Enregistrez les températures quotidiennement
- Maintenez un camion propre et bien entretenu

## Conclusion

La réglementation peut sembler lourde, mais elle protège vos clients et votre activité. **Être en règle, c'est aussi un argument commercial** : vos clients savent qu'ils mangent en sécurité.

FoodTracks vous aide à rester conforme en automatisant la traçabilité, l'archivage des factures et le suivi des stocks.

[Restez conforme avec FoodTracks →](https://foodtracks.io/fr/pricing)`,
      en: `## Food Truck Regulations in France

Operating a food truck in France requires compliance with several regulations. Here's what you need to know:

1. **HACCP Training** — Mandatory 14-hour food hygiene training
2. **Health Control Plan** (PMS) — HACCP plan, traceability, cleaning procedures
3. **Location Permits** — Mobile trader card, municipal authorization
4. **Insurance** — Professional liability + vehicle insurance (€1,500-3,000/year)
5. **Specific Rules** — Alcohol license, price display, allergen labeling

FoodTracks helps you stay compliant by automating traceability, invoice archiving, and stock tracking.

[Stay compliant with FoodTracks →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "La formation HACCP (400€, 14h) est obligatoire pour tout exploitant de food truck",
        "La carte de commerçant ambulant est nécessaire pour vendre hors de sa commune",
        "L'autorisation d'occupation du domaine public est délivrée par la mairie ou le gestionnaire du terrain",
        "L'assurance RC Pro coûte entre 1 500 et 3 000€/an pour un food truck",
      ],
      en: [
        "HACCP training (€400, 14h) is mandatory for all food truck operators",
        "A mobile trader card is required to sell outside your municipality",
        "Public domain authorization is issued by the town hall or site manager",
        "Professional liability insurance costs €1,500-€3,000/year for a food truck",
      ],
    },
    faqItems: [
      {
        question: { fr: "Faut-il un diplôme pour ouvrir un food truck ?", en: "Do you need a degree to open a food truck?" },
        answer: { fr: "Non, pas de diplôme requis. Mais la formation HACCP en hygiène alimentaire (14h, ~400€) est obligatoire. Il faut aussi une carte de commerçant ambulant et une autorisation d'occupation du domaine public.", en: "No degree required. But HACCP food hygiene training (14h, ~€400) is mandatory. You also need a mobile trader card and public domain authorization." },
      },
      {
        question: { fr: "Quelles sont les normes d'hygiène pour un food truck ?", en: "What are the hygiene standards for a food truck?" },
        answer: { fr: "Un food truck doit respecter le plan HACCP, avoir un point d'eau potable, des surfaces en inox, une chambre froide ou réfrigérateur aux normes, et afficher les allergènes. La traçabilité des produits est obligatoire.", en: "A food truck must follow HACCP, have potable water, stainless steel surfaces, regulation refrigeration, and display allergens. Product traceability is mandatory." },
      },
    ],
  },
  {
    slug: "trouver-meilleurs-emplacements-food-truck",
    title: {
      fr: "Comment trouver les meilleurs emplacements pour son food truck",
      en: "How to Find the Best Locations for Your Food Truck",
    },
    excerpt: {
      fr: "L'emplacement fait 80% du succès d'un food truck. Découvrez comment identifier, tester et optimiser vos spots de vente.",
      en: "Location accounts for 80% of food truck success. Learn how to identify, test, and optimize your selling spots.",
    },
    category: { fr: "Stratégie", en: "Strategy" },
    date: "2025-01-10",
    readTime: 10,
    keywords: ["emplacement food truck", "où se placer food truck", "spot food truck rentable"],
    heroImage: "/blog/meilleurs-emplacements.png",
    content: {
      fr: `## L'emplacement : le facteur n°1 de succès

Demandez à n'importe quel food trucker expérimenté : **l'emplacement fait 80% du chiffre d'affaires**. Vous pouvez avoir le meilleur burger du monde, si vous êtes mal placé, personne ne viendra.

## Les types d'emplacements et leur potentiel

### Marchés (potentiel : ⭐⭐⭐⭐)
- **Avantages** : clientèle régulière, flux piéton naturel
- **Inconvénients** : concurrence, horaires contraints
- **CA moyen** : 300-800€ par marché
- **Comment y accéder** : inscription en mairie, liste d'attente

### Zones de bureaux (potentiel : ⭐⭐⭐⭐⭐)
- **Avantages** : clientèle captive le midi, panier moyen élevé
- **Inconvénients** : uniquement en semaine, 11h30-14h
- **CA moyen** : 400-1 200€ par service
- **Comment y accéder** : contacter les entreprises/gestionnaires de zones

### Événements privés (potentiel : ⭐⭐⭐⭐⭐)
- **Avantages** : CA garanti, marge élevée, visibilité
- **Inconvénients** : logistique, négociation
- **CA moyen** : 1 000-5 000€ par événement
- **Comment y accéder** : réseaux sociaux, sites spécialisés, bouche-à-oreille

### Festivals et événements publics (potentiel : ⭐⭐⭐⭐)
- **Avantages** : gros volumes, visibilité massive
- **Inconvénients** : droits d'entrée élevés, concurrence, météo-dépendant
- **CA moyen** : 2 000-10 000€ par week-end
- **Comment y accéder** : candidatures anticipées (6-12 mois à l'avance)

### Zones commerciales (potentiel : ⭐⭐⭐)
- **Avantages** : flux piéton, week-end inclus
- **Inconvénients** : autorisation complexe, concurrence avec les fast-foods
- **CA moyen** : 300-700€ par jour

## Comment évaluer un emplacement

Avant de vous engager, analysez :

1. **Le flux piéton** : comptez les passants sur différents créneaux
2. **La concurrence** : combien de restaurants/food trucks à proximité ?
3. **L'accessibilité** : parking, visibilité, facilité d'installation
4. **Le coût** : droit de place, carburant, temps de trajet
5. **Le potentiel de récurrence** : pouvez-vous y revenir régulièrement ?

## Optimiser avec les données

C'est ici que **FoodTracks fait la différence**. En connectant vos ventes SumUp, l'application :
- **Compare la rentabilité** de chaque emplacement automatiquement
- **Identifie les jours/créneaux** les plus performants
- **Prédit les ventes** pour chaque futur service en fonction de l'historique

Résultat : vous allez là où c'est rentable, et vous évitez les emplacements qui vous font perdre du temps et de l'argent.

## Les erreurs à éviter

1. **S'accrocher à un mauvais emplacement** par habitude
2. **Ne pas tester** : essayez au moins 3 fois avant de juger
3. **Ignorer les données** : votre ressenti n'est pas toujours fiable
4. **Négliger le networking** : les meilleurs spots s'obtiennent par le réseau

## Conclusion

Trouver les bons emplacements est un travail continu. Testez, mesurez, optimisez. Et laissez les données guider vos décisions.

[Analysez vos emplacements avec FoodTracks →](https://foodtracks.io/fr/pricing)`,
      en: `## Location: The #1 Success Factor

Ask any experienced food trucker: **location accounts for 80% of revenue**. The best food in the world won't sell if you're in the wrong place.

## Location Types
- **Markets**: Regular clientele, €300-800 per market
- **Office zones**: Captive lunch crowd, €400-1,200 per service
- **Private events**: Guaranteed revenue, €1,000-5,000 per event
- **Festivals**: High volume, €2,000-10,000 per weekend
- **Commercial zones**: Foot traffic, €300-700 per day

FoodTracks automatically compares location profitability, identifies peak times, and predicts future sales based on history.

[Analyze your locations with FoodTracks →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "Les marchés et festivals restent les emplacements les plus rentables (500-2000€/jour en festival)",
        "Les zones de bureaux offrent une clientèle régulière mais un CA plafonné (300-700€/jour)",
        "Alterner entre emplacements fixes et événements est la stratégie la plus rentable",
        "L'analyse des données de ventes par emplacement permet d'optimiser son planning",
      ],
      en: [
        "Markets and festivals remain the most profitable locations (€500-2000/day at festivals)",
        "Office zones offer regular customers but capped revenue (€300-700/day)",
        "Alternating fixed locations and events is the most profitable strategy",
        "Analyzing sales data by location optimizes scheduling",
      ],
    },
    faqItems: [
      {
        question: { fr: "Où installer son food truck pour gagner le plus ?", en: "Where to set up a food truck to earn the most?" },
        answer: { fr: "Les festivals et événements sont les plus rentables (500-2000€/jour), suivis des marchés (200-800€/jour) et des zones de bureaux (300-700€/jour). La stratégie optimale combine emplacements fixes en semaine et événements le week-end.", en: "Festivals and events are most profitable (€500-2000/day), followed by markets (€200-800/day) and office zones (€300-700/day). The optimal strategy combines fixed weekday locations with weekend events." },
      },
    ],
  },
  {
    slug: "scanner-factures-food-truck-gagner-temps",
    title: {
      fr: "Scanner ses factures en food truck : comment gagner 2 heures par semaine",
      en: "Scanning Invoices for Your Food Truck: Save 2 Hours Per Week",
    },
    excerpt: {
      fr: "Fini la saisie manuelle ! Découvrez comment le scan IA de factures révolutionne la gestion quotidienne des food trucks.",
      en: "No more manual entry! Discover how AI invoice scanning revolutionizes daily food truck management.",
    },
    category: { fr: "Productivité", en: "Productivity" },
    date: "2025-01-05",
    readTime: 7,
    keywords: ["scanner factures food truck", "automatiser gestion food truck", "OCR factures restauration"],
    heroImage: "/blog/scanner-factures.png",
    content: {
      fr: `## La paperasse : l'ennemi n°1 du food trucker

Vous n'avez pas lancé un food truck pour passer vos soirées à saisir des factures dans un tableur. Pourtant, c'est le quotidien de la majorité des food truckers : **2 à 4 heures par semaine** perdues en gestion administrative.

## Le problème de la saisie manuelle

### C'est chronophage
Chaque facture fournisseur contient des dizaines de lignes. Saisir manuellement les produits, quantités, prix... c'est fastidieux et improductif.

### C'est source d'erreurs
Une virgule mal placée, un produit oublié, et vos données de stock sont fausses. **Les erreurs de saisie représentent 5 à 15% des écarts de stock** dans la restauration.

### C'est démotivant
Après une longue journée de service, la dernière chose dont vous avez envie c'est de la paperasse. Résultat : ça s'accumule, et vous perdez la visibilité sur votre activité.

## La solution : le scan IA de FoodTracks

FoodTracks intègre un **scanner de factures basé sur l'intelligence artificielle**. Concrètement :

### Comment ça marche
1. **Prenez en photo** votre facture avec votre smartphone
2. **L'IA analyse** le document en quelques secondes
3. **Les données sont extraites** : fournisseur, produits, quantités, prix, dates
4. **Vos stocks se mettent à jour** automatiquement

### Ce que l'IA détecte
- Nom du fournisseur
- Date de la facture
- Liste des produits avec quantités et prix unitaires
- TVA et totaux
- Dates de péremption (quand indiquées)

### Taux de précision
Notre IA atteint un taux de reconnaissance de **95%+** sur les factures courantes de fournisseurs alimentaires. Pour les cas ambigus, vous pouvez vérifier et corriger en un clic.

## Les bénéfices concrets

| Métrique | Avant FoodTracks | Après FoodTracks |
|----------|-----------------|-----------------|
| Temps de saisie / semaine | 2-4h | 15 min |
| Erreurs de stock | 5-15% | < 2% |
| Visibilité sur les coûts | Partielle | Temps réel |
| Traçabilité | Difficile | Automatique |

## Cas d'usage : la journée type

**6h** : Vous recevez votre livraison. Vous prenez les factures en photo avec FoodTracks.

**6h05** : C'est fait. Vos stocks sont à jour, les péremptions sont trackées.

**11h** : Vous servez vos clients l'esprit tranquille.

**20h** : Pas de paperasse ce soir. Vous consultez juste votre dashboard : ventes du jour, marge, stock restant.

## Au-delà du scan : l'écosystème FoodTracks

Le scan de factures n'est que le point d'entrée. Une fois vos données dans FoodTracks, vous débloquez :
- **Suivi des stocks en temps réel**
- **Alertes de péremption**
- **Calcul automatique du coût matière**
- **Prévisions de vente par emplacement**
- **Dashboard de rentabilité**

Tout est connecté. Vos factures alimentent vos stocks, vos stocks alimentent vos prévisions, vos prévisions alimentent vos commandes.

## Conclusion

Arrêtez de perdre du temps sur de la saisie manuelle. **Scannez, et passez à autre chose.** Votre énergie est mieux investie dans votre cuisine et vos clients.

[Essayez le scan IA de FoodTracks — gratuit →](https://foodtracks.io/fr/pricing)`,
      en: `## Paperwork: The Food Trucker's Worst Enemy

You didn't start a food truck to spend evenings entering invoices into spreadsheets. Yet that's the reality: **2-4 hours per week** lost to admin work.

## The Solution: FoodTracks AI Scanning

1. Take a photo of your invoice
2. AI analyzes it in seconds
3. Products, quantities, and prices are extracted
4. Your inventory updates automatically

**95%+ accuracy** on standard food supplier invoices. Save 2+ hours per week and eliminate manual entry errors.

[Try FoodTracks AI scanning — free →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "Le scan IA de factures fait gagner 2h+ par semaine aux food truckers",
        "Précision de 95%+ sur les factures fournisseurs alimentaires standards",
        "Le scan remplace la saisie manuelle et élimine les erreurs de transcription",
        "Le stock se met à jour automatiquement après chaque scan",
      ],
      en: [
        "AI invoice scanning saves food truckers 2+ hours per week",
        "95%+ accuracy on standard food supplier invoices",
        "Scanning replaces manual entry and eliminates transcription errors",
        "Inventory updates automatically after each scan",
      ],
    },
    faqItems: [
      {
        question: { fr: "Comment scanner ses factures fournisseur en food truck ?", en: "How to scan supplier invoices for a food truck?" },
        answer: { fr: "Avec FoodTracks, il suffit de prendre une photo de la facture avec votre téléphone. L'IA extrait automatiquement les produits, quantités et prix en moins de 30 secondes, et met à jour votre stock.", en: "With FoodTracks, just take a photo of the invoice with your phone. AI automatically extracts products, quantities, and prices in under 30 seconds, updating your inventory." },
      },
    ],
  },
  {
    slug: "connecter-sumup-food-truck-suivi-ventes",
    title: {
      fr: "Connecter SumUp à son food truck : le suivi des ventes en temps réel",
      en: "Connect SumUp to Your Food Truck: Real-Time Sales Tracking",
    },
    excerpt: {
      fr: "Découvrez comment l'intégration SumUp de FoodTracks transforme vos données de paiement en insights business actionnables.",
      en: "Learn how FoodTracks' SumUp integration turns your payment data into actionable business insights.",
    },
    category: { fr: "Intégrations", en: "Integrations" },
    date: "2024-12-28",
    readTime: 8,
    keywords: ["sumup food truck", "terminal paiement food truck", "suivi ventes food truck"],
    heroImage: "/blog/connecter-sumup.png",
    content: {
      fr: `## SumUp : le terminal de paiement préféré des food trucks

**SumUp** est devenu le standard de paiement pour les food trucks en France. Compact, abordable (pas d'abonnement, juste 1,75% de commission), il s'est imposé comme l'outil incontournable. Mais saviez-vous que vos données SumUp sont une **mine d'or** pour piloter votre activité ?

## Le problème : des données inexploitées

La plupart des food truckers utilisent SumUp uniquement pour encaisser. Les données de vente restent dans l'app SumUp, déconnectées du reste de la gestion.

Résultat :
- Pas de vision globale (ventes vs coûts)
- Impossible de calculer la marge par emplacement
- Aucune prévision fiable
- Reporting manuel et fastidieux

## La solution : FoodTracks + SumUp

FoodTracks se connecte directement à votre compte SumUp pour **synchroniser automatiquement toutes vos ventes**. En quelques clics, vous débloquez :

### Dashboard de ventes en temps réel
- CA du jour, de la semaine, du mois
- Évolution vs période précédente
- Détail par transaction

### Analyse par emplacement
C'est le vrai game-changer. FoodTracks associe automatiquement chaque vente à un emplacement et vous montre :
- **CA moyen par emplacement**
- **Nombre de clients par spot**
- **Panier moyen par lieu**
- **Rentabilité nette** (ventes - coûts matière - frais d'emplacement)

### Prédictions de vente
En analysant votre historique SumUp, FoodTracks **prédit le CA attendu** pour chaque futur service. Vous savez exactement combien préparer.

### Calcul de marge automatique
En croisant vos ventes (SumUp) et vos achats (factures scannées), FoodTracks calcule votre **marge brute en temps réel**. Plus besoin de tableur.

## Comment connecter SumUp à FoodTracks

1. Ouvrez FoodTracks → **Intégrations**
2. Cliquez sur **"Connecter SumUp"**
3. Autorisez l'accès à votre compte SumUp
4. C'est fait ! Vos ventes se synchronisent automatiquement

L'opération prend moins de 2 minutes et la synchronisation est continue.

## Ce que voient nos utilisateurs

> "Avant FoodTracks, je ne savais pas quel emplacement était vraiment rentable. Maintenant c'est clair : j'ai arrêté 2 spots qui me faisaient perdre du temps et j'ai doublé mes jours sur mon meilleur emplacement. +30% de marge en 2 mois."
> — Thomas, food trucker à Lyon

## Conclusion

Vos données SumUp ont de la valeur — ne les laissez pas dormir. Connectez-les à FoodTracks et transformez chaque transaction en insight business.

[Connectez SumUp à FoodTracks — gratuit →](https://foodtracks.io/fr/pricing)`,
      en: `## SumUp: The Food Truck Payment Standard

SumUp has become the go-to payment terminal for food trucks. Compact and affordable (no subscription, just 1.75% commission), it's essential. But your SumUp data is a **goldmine** for managing your business.

## FoodTracks + SumUp Integration

Connect your SumUp account to FoodTracks to automatically sync all sales data. Unlock:
- Real-time sales dashboard
- Per-location profitability analysis
- Sales predictions based on history
- Automatic margin calculation

Connection takes under 2 minutes.

[Connect SumUp to FoodTracks — free →](https://foodtracks.io/en/pricing)`,
    },
    keyTakeaways: {
      fr: [
        "L'intégration SumUp-FoodTracks se fait en moins de 2 minutes via OAuth",
        "Toutes les transactions carte sont synchronisées en temps réel automatiquement",
        "Le matching produit permet de calculer la marge exacte par article vendu",
        "Le dashboard SumUp de FoodTracks offre une vue consolidée CA + marges + prédictions",
      ],
      en: [
        "SumUp-FoodTracks integration takes under 2 minutes via OAuth",
        "All card transactions are synced in real-time automatically",
        "Product matching enables exact margin calculation per sold item",
        "FoodTracks SumUp dashboard provides consolidated revenue + margins + predictions view",
      ],
    },
    faqItems: [
      {
        question: { fr: "Comment connecter SumUp à FoodTracks ?", en: "How to connect SumUp to FoodTracks?" },
        answer: { fr: "Dans FoodTracks, allez dans Paramètres > Intégrations > SumUp, cliquez 'Connecter', autorisez l'accès OAuth, et c'est fait. Toutes vos ventes carte se synchronisent automatiquement en temps réel.", en: "In FoodTracks, go to Settings > Integrations > SumUp, click 'Connect', authorize OAuth access, and you're done. All card sales sync automatically in real-time." },
      },
      {
        question: { fr: "FoodTracks fonctionne-t-il avec SumUp ?", en: "Does FoodTracks work with SumUp?" },
        answer: { fr: "Oui, FoodTracks a une intégration native avec SumUp. Les transactions carte sont synchronisées en temps réel, permettant le suivi automatique du CA, le calcul des marges et les prédictions de ventes.", en: "Yes, FoodTracks has a native SumUp integration. Card transactions are synced in real-time, enabling automatic revenue tracking, margin calculation, and sales predictions." },
      },
    ],
  },
  {
    slug: "fixer-prix-menu-food-truck",
    title: {
      fr: "Comment fixer les prix de son menu food truck pour maximiser ses marges",
      en: "How to Price Your Food Truck Menu to Maximize Margins",
    },
    excerpt: {
      fr: "Apprenez à calculer vos coûts, fixer des prix rentables et structurer un menu food truck qui attire les clients tout en protégeant vos marges.",
      en: "Learn how to calculate costs, set profitable prices, and structure a food truck menu that attracts customers while protecting your margins.",
    },
    category: { fr: "Gestion", en: "Management" },
    date: "2025-03-10",
    readTime: 10,
    keywords: ["prix menu food truck", "fixer prix food truck", "menu rentable food truck", "calcul marge food truck"],
    heroImage: "/blog/menu-food-truck.png",
    content: {
      fr: `## Pourquoi le pricing est la clé de la rentabilité

Beaucoup de food truckers fixent leurs prix au feeling ou en copiant la concurrence. Résultat : **des marges trop faibles qui ne couvrent pas les charges réelles**. Un menu bien pricé, c'est la différence entre un food truck qui survit et un food truck qui prospère.

### Le coût matière : votre point de départ

Le coût matière (ou food cost) doit idéalement représenter **25 à 35% du prix de vente**. Pour le calculer :

1. Listez tous les ingrédients de chaque recette
2. Pesez les quantités exactes par portion
3. Calculez le coût unitaire de chaque ingrédient
4. Additionnez pour obtenir le coût matière total

**Exemple concret :** Un burger dont les ingrédients coûtent 2,50€ devrait être vendu entre 7€ et 10€.

### Les charges à ne pas oublier

Au-delà des ingrédients, intégrez dans votre calcul :
- **Emballages et consommables** (barquettes, serviettes, sauces) : 0,30€ à 0,80€ par vente
- **Emplacement** : droit de place, loyer marché, commission festival
- **Carburant et entretien** du véhicule
- **Assurances et charges sociales**
- **Amortissement** du matériel

### La méthode du coefficient multiplicateur

La méthode la plus simple : appliquez un **coefficient de 3 à 4** sur votre coût matière.

| Coût matière | Coeff. x3 | Coeff. x3.5 | Coeff. x4 |
|---|---|---|---|
| 2,00€ | 6,00€ | 7,00€ | 8,00€ |
| 3,00€ | 9,00€ | 10,50€ | 12,00€ |
| 4,00€ | 12,00€ | 14,00€ | 16,00€ |

### Structurer son menu pour vendre plus

Un menu food truck efficace suit ces règles :
- **5 à 8 plats maximum** — trop de choix paralyse le client et ralentit le service
- **Un produit star** à forte marge bien mis en avant
- **Des formules/combos** (plat + boisson + dessert) qui augmentent le panier moyen de 20 à 40%
- **Un prix d'appel** pour attirer, et des options premium pour upgrader

### La psychologie des prix

- Utilisez des **prix ronds** (8€, 10€, 12€) — en food truck ça facilite le rendu monnaie
- Placez le plat le plus cher en premier sur le menu — les suivants paraissent plus abordables
- **Ne mettez jamais le symbole €** sur le menu (études montrent que ça freine la dépense)

### Adapter ses prix selon le contexte

Vos prix peuvent varier selon :
- **L'emplacement** : centre-ville vs zone industrielle vs festival
- **L'événement** : mariage/corporate = +20-30% justifié par le service premium
- **La saison** : soupes l'hiver, salades l'été, ajustez les portions et les prix

### Comment FoodTracks vous aide

Avec FoodTracks, vous pouvez :
- **Scanner vos factures fournisseurs** pour calculer automatiquement vos coûts matière
- **Suivre vos marges en temps réel** par produit grâce à l'intégration SumUp
- **Comparer la rentabilité** de vos plats et identifier ceux à ajuster
- **Prédire la demande** par emplacement pour adapter vos quantités et réduire le gaspillage`,
      en: `## Why Pricing Is the Key to Profitability

Many food truckers set prices by gut feeling or by copying competitors. The result: **margins too thin to cover real costs**. A well-priced menu is the difference between a food truck that survives and one that thrives.

### Food Cost: Your Starting Point

Food cost should ideally represent **25 to 35% of the selling price**. To calculate it:

1. List all ingredients for each recipe
2. Weigh exact quantities per portion
3. Calculate the unit cost of each ingredient
4. Add up to get the total food cost

**Real example:** A burger with €2.50 in ingredients should sell for €7 to €10.

### Hidden Costs You Must Include

Beyond ingredients, factor in:
- **Packaging and supplies** (containers, napkins, sauces): €0.30 to €0.80 per sale
- **Location fees**: pitch rental, market fees, festival commission
- **Fuel and vehicle maintenance**
- **Insurance and social charges**
- **Equipment depreciation**

### The Multiplier Method

The simplest approach: apply a **multiplier of 3 to 4** on your food cost.

| Food Cost | x3 | x3.5 | x4 |
|---|---|---|---|
| €2.00 | €6.00 | €7.00 | €8.00 |
| €3.00 | €9.00 | €10.50 | €12.00 |
| €4.00 | €12.00 | €14.00 | €16.00 |

### Structure Your Menu to Sell More

An effective food truck menu follows these rules:
- **5 to 8 items maximum** — too much choice overwhelms customers and slows service
- **One star product** with high margins featured prominently
- **Combo deals** (main + drink + dessert) that increase average spend by 20-40%
- **An entry-level price** to attract, and premium options to upsell

### Pricing Psychology

- Use **round prices** (€8, €10, €12) — makes change easier in food trucks
- Place the most expensive item first on the menu — everything after seems more affordable
- **Never display the € symbol** on the menu (studies show it reduces spending)

### Adapt Prices to Context

Your prices can vary based on:
- **Location**: city center vs industrial zone vs festival
- **Event type**: weddings/corporate = +20-30% justified by premium service
- **Season**: soups in winter, salads in summer, adjust portions and prices

### How FoodTracks Helps

With FoodTracks, you can:
- **Scan supplier invoices** to automatically calculate food costs
- **Track margins in real-time** per product via SumUp integration
- **Compare profitability** across dishes and identify what needs adjusting
- **Predict demand** by location to adapt quantities and reduce waste`,
    },
    keyTakeaways: {
      fr: [
        "Le coût matière doit représenter 25 à 35% du prix de vente",
        "Appliquez un coefficient de 3 à 4 sur le coût matière pour fixer vos prix",
        "Limitez votre menu à 5-8 plats et proposez des formules combo",
        "FoodTracks calcule automatiquement vos marges par produit",
      ],
      en: [
        "Food cost should be 25 to 35% of selling price",
        "Apply a multiplier of 3 to 4 on food cost to set prices",
        "Limit your menu to 5-8 items and offer combo deals",
        "FoodTracks automatically calculates margins per product",
      ],
    },
    faqItems: [
      {
        question: { fr: "Quel coefficient appliquer pour fixer ses prix en food truck ?", en: "What multiplier should I use for food truck pricing?" },
        answer: { fr: "Un coefficient de 3 à 4 sur le coût matière est la norme en food truck. Si vos ingrédients coûtent 3€, vendez entre 9€ et 12€ selon l'emplacement et le positionnement.", en: "A multiplier of 3 to 4 on food cost is standard for food trucks. If your ingredients cost €3, sell between €9 and €12 depending on location and positioning." },
      },
      {
        question: { fr: "Combien de plats mettre sur un menu food truck ?", en: "How many items should a food truck menu have?" },
        answer: { fr: "Entre 5 et 8 plats maximum. Un menu court accélère le service, réduit le gaspillage et simplifie la gestion des stocks. Ajoutez des formules combo pour augmenter le panier moyen.", en: "Between 5 and 8 items maximum. A short menu speeds up service, reduces waste, and simplifies inventory. Add combo deals to increase average spend." },
      },
    ],
  },
  {
    slug: "marketing-digital-food-truck",
    title: {
      fr: "Marketing digital pour food truck : réseaux sociaux et visibilité en ligne",
      en: "Digital Marketing for Food Trucks: Social Media and Online Visibility",
    },
    excerpt: {
      fr: "Boostez la visibilité de votre food truck grâce aux réseaux sociaux, Google Maps et une stratégie digitale adaptée à votre activité ambulante.",
      en: "Boost your food truck's visibility with social media, Google Maps, and a digital strategy tailored to your mobile business.",
    },
    category: { fr: "Marketing", en: "Marketing" },
    date: "2025-03-15",
    readTime: 11,
    keywords: ["marketing food truck", "réseaux sociaux food truck", "instagram food truck", "visibilité food truck"],
    heroImage: "/blog/marketing-food-truck.png",
    content: {
      fr: `## Pourquoi le marketing digital est indispensable pour un food truck

Votre food truck est mobile, mais vos clients doivent savoir **où vous trouver et quand**. Le marketing digital est le moyen le plus efficace et le moins cher pour communiquer avec votre clientèle. **78% des consommateurs découvrent de nouveaux restaurants via les réseaux sociaux.**

### Instagram : votre vitrine n°1

Instagram est LA plateforme pour les food trucks. La nourriture est visuelle, et les gens mangent d'abord avec les yeux.

**Ce qui marche :**
- **Photos de vos plats** en lumière naturelle, gros plans appétissants
- **Stories quotidiennes** : préparation en cuisine, arrivée sur l'emplacement, file d'attente
- **Reels courts** (15-30s) : recette signature en accéléré, coulisses, ambiance service
- **Annonce de vos emplacements** chaque matin : "Aujourd'hui midi → Place de la République !"

**Fréquence idéale :** 3-4 posts par semaine + stories quotidiennes

### Google Business Profile : être trouvable

Créez et optimisez votre fiche Google Business :
- **Catégorie** : Food truck / Restaurant ambulant
- **Photos** récentes et de qualité
- **Horaires** mis à jour (même si variables)
- **Zone desservie** plutôt qu'adresse fixe
- Encouragez les **avis Google** — chaque avis booste votre visibilité locale

### Facebook : votre communauté locale

Facebook reste puissant pour :
- **Groupes locaux** : partagez vos emplacements dans les groupes de quartier
- **Événements** : créez un événement pour chaque marché ou festival
- **Facebook Marketplace** : certains food truckers y trouvent des clients corporate

### TikTok : le potentiel viral

Un seul TikTok viral peut faire exploser votre notoriété :
- Filmez la **préparation d'un plat signature** en POV
- Montrez les **coulisses** (approvisionnement au marché, nettoyage du truck)
- Surfez sur les **tendances** en les adaptant à votre univers food truck

### Le planning hebdomadaire type

| Jour | Contenu |
|---|---|
| Lundi | Post Instagram : plat de la semaine |
| Mardi | Story : préparation en cuisine |
| Mercredi | Reel : recette en accéléré |
| Jeudi | Post Facebook : emplacement du week-end |
| Vendredi | Stories : ambiance service + file d'attente |
| Samedi | TikTok : coulisses du rush |
| Dimanche | Story : bilan de la semaine |

### Les erreurs à éviter

- **Publier de manière irrégulière** — mieux vaut 3 posts/semaine réguliers que 10 puis rien
- **Oublier de répondre aux commentaires** et messages — c'est votre service client
- **Négliger les avis négatifs** — répondez toujours poliment et proposez une solution
- **Ne pas annoncer vos emplacements** — c'est l'info n°1 que vos clients cherchent

### Comment FoodTracks complète votre stratégie

FoodTracks vous aide à optimiser votre présence :
- **Données de vente par emplacement** pour savoir où communiquer en priorité
- **Prédictions de demande** pour anticiper les jours forts et adapter votre com
- **Suivi des tendances** de vos produits pour mettre en avant vos best-sellers`,
      en: `## Why Digital Marketing Is Essential for Food Trucks

Your food truck is mobile, but customers need to know **where to find you and when**. Digital marketing is the most effective and affordable way to communicate with your audience. **78% of consumers discover new restaurants through social media.**

### Instagram: Your #1 Showcase

Instagram is THE platform for food trucks. Food is visual, and people eat with their eyes first.

**What works:**
- **Photos of your dishes** in natural light, appetizing close-ups
- **Daily stories**: kitchen prep, arriving at location, customer queues
- **Short reels** (15-30s): signature recipe in timelapse, behind-the-scenes, service vibes
- **Location announcements** every morning: "Today's lunch → Republic Square!"

**Ideal frequency:** 3-4 posts per week + daily stories

### Google Business Profile: Be Findable

Create and optimize your Google Business listing:
- **Category**: Food truck / Mobile restaurant
- **Photos**: recent and high-quality
- **Hours**: updated (even if variable)
- **Service area** rather than fixed address
- Encourage **Google reviews** — each review boosts your local visibility

### Facebook: Your Local Community

Facebook remains powerful for:
- **Local groups**: share your locations in neighborhood groups
- **Events**: create an event for each market or festival
- **Facebook Marketplace**: some food truckers find corporate clients there

### TikTok: Viral Potential

A single viral TikTok can skyrocket your visibility:
- Film your **signature dish preparation** in POV
- Show **behind-the-scenes** (market sourcing, truck cleaning)
- Ride **trends** and adapt them to your food truck world

### Weekly Content Calendar

| Day | Content |
|---|---|
| Monday | Instagram post: dish of the week |
| Tuesday | Story: kitchen prep |
| Wednesday | Reel: timelapse recipe |
| Thursday | Facebook post: weekend location |
| Friday | Stories: service vibes + queue |
| Saturday | TikTok: rush behind-the-scenes |
| Sunday | Story: weekly recap |

### Mistakes to Avoid

- **Posting irregularly** — better 3 consistent posts/week than 10 then nothing
- **Ignoring comments and messages** — this is your customer service
- **Neglecting negative reviews** — always respond politely and offer a solution
- **Not announcing your locations** — this is the #1 info your customers want

### How FoodTracks Supports Your Strategy

FoodTracks helps optimize your presence:
- **Sales data by location** to know where to focus your marketing
- **Demand predictions** to anticipate busy days and adapt your communications
- **Product trend tracking** to highlight your best-sellers`,
    },
    keyTakeaways: {
      fr: [
        "Instagram est la plateforme n°1 pour un food truck — publiez 3-4 fois par semaine",
        "Google Business Profile est essentiel pour être trouvé localement",
        "Annoncez vos emplacements quotidiennement sur les réseaux",
        "FoodTracks fournit les données de vente pour cibler votre marketing",
      ],
      en: [
        "Instagram is the #1 platform for food trucks — post 3-4 times per week",
        "Google Business Profile is essential for local discoverability",
        "Announce your locations daily on social media",
        "FoodTracks provides sales data to target your marketing",
      ],
    },
    faqItems: [
      {
        question: { fr: "Quel réseau social choisir pour son food truck ?", en: "Which social media should a food truck use?" },
        answer: { fr: "Instagram en priorité pour le visuel, Facebook pour la communauté locale et les événements, et TikTok pour le potentiel viral. Publiez 3-4 fois par semaine minimum.", en: "Instagram first for visuals, Facebook for local community and events, and TikTok for viral potential. Post at least 3-4 times per week." },
      },
      {
        question: { fr: "Comment annoncer les emplacements de son food truck ?", en: "How to announce food truck locations?" },
        answer: { fr: "Publiez chaque matin votre emplacement du jour en story Instagram et sur Facebook. Utilisez une routine fixe pour que vos clients prennent l'habitude de vérifier.", en: "Post your daily location every morning via Instagram stories and Facebook. Use a fixed routine so customers get in the habit of checking." },
      },
    ],
  },
  {
    slug: "hygiene-haccp-food-truck",
    title: {
      fr: "Hygiène et HACCP en food truck : le guide complet pour être en règle",
      en: "Food Truck Hygiene and HACCP: Complete Compliance Guide",
    },
    excerpt: {
      fr: "Tout ce que vous devez savoir sur l'hygiène alimentaire et la méthode HACCP pour votre food truck : obligations légales, bonnes pratiques et contrôles.",
      en: "Everything you need to know about food hygiene and HACCP for your food truck: legal requirements, best practices, and inspections.",
    },
    category: { fr: "Réglementation", en: "Regulations" },
    date: "2025-03-20",
    readTime: 13,
    keywords: ["hygiène food truck", "HACCP food truck", "sécurité alimentaire food truck", "normes sanitaires food truck"],
    heroImage: "/blog/hygiene-food-truck.png",
    content: {
      fr: `## L'hygiène en food truck : une obligation légale et commerciale

L'hygiène alimentaire n'est pas optionnelle. En France, tout professionnel de la restauration doit respecter les normes sanitaires sous peine de **fermeture administrative et d'amendes pouvant aller jusqu'à 15 000€**. Mais au-delà de la loi, une hygiène irréprochable est aussi votre meilleur argument commercial.

### La formation HACCP : obligatoire

Au moins une personne dans votre équipe doit avoir suivi une **formation en hygiène alimentaire (HACCP)** de 14 heures. Cette formation couvre :
- Les dangers microbiologiques, chimiques et physiques
- La méthode HACCP (Hazard Analysis Critical Control Points)
- Les bonnes pratiques d'hygiène
- La traçabilité et la gestion des allergènes

**Coût** : 200€ à 500€ — **obligatoire** avant l'ouverture.

### Les 7 principes HACCP appliqués au food truck

1. **Analyser les dangers** : identifier les risques à chaque étape (réception, stockage, préparation, service)
2. **Déterminer les points critiques** (CCP) : cuisson, maintien au chaud/froid, réchauffage
3. **Établir les limites critiques** : ex. cuisson viande à cœur ≥ 63°C
4. **Mettre en place la surveillance** : relevés de température, contrôles visuels
5. **Définir les actions correctives** : que faire si la température est hors norme ?
6. **Vérifier le système** : audits internes réguliers
7. **Documenter** : registres de température, fiches de nettoyage, traçabilité

### La chaîne du froid : zéro tolérance

En food truck, la chaîne du froid est votre point critique n°1 :

- **Réfrigérateur** : entre 0°C et +4°C en permanence
- **Congélateur** : -18°C minimum
- **Transport** : sacs isothermes ou véhicule frigorifique pour l'approvisionnement
- **Relevé de température** : minimum 2 fois par jour (matin et midi)
- **En cas de rupture** : si un produit dépasse +8°C pendant plus de 2h → poubelle

### Le Plan de Maîtrise Sanitaire (PMS)

Votre PMS est le document qui prouve votre conformité. Il comprend :
- **Fiches de bonnes pratiques** d'hygiène (BPH)
- **Plan HACCP** adapté à votre activité
- **Plan de nettoyage et désinfection** (PNDS) avec fréquences et produits
- **Procédure de traçabilité** (conservation des bons de livraison 5 ans)
- **Gestion des allergènes** : liste des 14 allergènes obligatoire

### Le nettoyage quotidien du food truck

Un plan de nettoyage rigoureux :

| Zone | Fréquence | Produit |
|---|---|---|
| Plan de travail | Après chaque service | Dégraissant + désinfectant alimentaire |
| Frigo | Hebdomadaire | Nettoyant frigo alimentaire |
| Sol | Quotidien | Détergent + eau de javel diluée |
| Friteuse | Après chaque utilisation | Vidange + nettoyant spécial |
| Poignées/surfaces contact | Toutes les 2h en service | Spray désinfectant |

### Les contrôles sanitaires : à quoi s'attendre

Les inspecteurs de la DDPP (Direction Départementale de la Protection des Populations) peuvent contrôler à tout moment :
- Température des frigos et des plats
- Propreté générale et état du matériel
- Documents : PMS, formation HACCP, traçabilité
- Étiquetage des allergènes
- Dates de péremption

**Résultat publié sur Alim'confiance** — un mauvais résultat est visible de tous !

### Comment FoodTracks facilite la traçabilité

FoodTracks simplifie votre gestion HACCP :
- **Scan des factures fournisseurs** = traçabilité automatique des lots
- **Suivi des stocks** avec dates de péremption
- **Historique des achats** consultable à tout moment pour les contrôles
- **Alertes** sur les produits proches de la péremption`,
      en: `## Food Truck Hygiene: A Legal and Commercial Obligation

Food hygiene is not optional. In France, every food professional must comply with health standards or face **administrative closure and fines up to €15,000**. But beyond the law, impeccable hygiene is also your best commercial argument.

### HACCP Training: Mandatory

At least one person on your team must have completed a **14-hour food hygiene (HACCP) training**. This training covers:
- Microbiological, chemical, and physical hazards
- The HACCP method (Hazard Analysis Critical Control Points)
- Good hygiene practices
- Traceability and allergen management

**Cost**: €200 to €500 — **mandatory** before opening.

### The 7 HACCP Principles Applied to Food Trucks

1. **Analyze hazards**: identify risks at each stage (receiving, storage, preparation, service)
2. **Determine Critical Control Points** (CCPs): cooking, hot/cold holding, reheating
3. **Establish critical limits**: e.g., meat core temperature ≥ 63°C
4. **Set up monitoring**: temperature logs, visual checks
5. **Define corrective actions**: what to do if temperature is out of range?
6. **Verify the system**: regular internal audits
7. **Document everything**: temperature records, cleaning logs, traceability

### Cold Chain: Zero Tolerance

In a food truck, the cold chain is your #1 critical point:

- **Refrigerator**: between 0°C and +4°C at all times
- **Freezer**: -18°C minimum
- **Transport**: insulated bags or refrigerated vehicle for sourcing
- **Temperature logging**: minimum twice daily (morning and noon)
- **In case of breach**: if a product exceeds +8°C for more than 2h → discard

### The Sanitary Control Plan (PMS)

Your PMS is the document proving compliance. It includes:
- **Good Hygiene Practice** sheets (GHP)
- **HACCP plan** tailored to your operations
- **Cleaning and disinfection plan** with frequencies and products
- **Traceability procedure** (keep delivery receipts for 5 years)
- **Allergen management**: list of 14 mandatory allergens

### Daily Food Truck Cleaning

A rigorous cleaning schedule:

| Area | Frequency | Product |
|---|---|---|
| Work surfaces | After each service | Degreaser + food-safe disinfectant |
| Fridge | Weekly | Food-safe fridge cleaner |
| Floor | Daily | Detergent + diluted bleach |
| Fryer | After each use | Drain + special cleaner |
| Handles/contact surfaces | Every 2h during service | Disinfectant spray |

### Health Inspections: What to Expect

Inspectors from the DDPP can check at any time:
- Fridge and dish temperatures
- General cleanliness and equipment condition
- Documents: PMS, HACCP training, traceability
- Allergen labeling
- Expiration dates

**Results published on Alim'confiance** — a bad result is visible to everyone!

### How FoodTracks Simplifies Traceability

FoodTracks makes HACCP management easier:
- **Scan supplier invoices** = automatic lot traceability
- **Stock tracking** with expiration dates
- **Purchase history** accessible anytime for inspections
- **Alerts** on products nearing expiration`,
    },
    keyTakeaways: {
      fr: [
        "La formation HACCP de 14h est obligatoire avant l'ouverture",
        "La chaîne du froid doit être maintenue entre 0°C et +4°C en permanence",
        "Le Plan de Maîtrise Sanitaire (PMS) est votre document de conformité",
        "FoodTracks automatise la traçabilité via le scan de factures",
      ],
      en: [
        "14-hour HACCP training is mandatory before opening",
        "Cold chain must be maintained between 0°C and +4°C at all times",
        "The Sanitary Control Plan (PMS) is your compliance document",
        "FoodTracks automates traceability via invoice scanning",
      ],
    },
    faqItems: [
      {
        question: { fr: "La formation HACCP est-elle obligatoire pour un food truck ?", en: "Is HACCP training mandatory for a food truck?" },
        answer: { fr: "Oui, au moins une personne de l'équipe doit avoir suivi une formation HACCP de 14 heures. C'est une obligation légale en France pour toute activité de restauration, y compris ambulante.", en: "Yes, at least one team member must have completed a 14-hour HACCP training. It's a legal requirement in France for all food service activities, including mobile ones." },
      },
      {
        question: { fr: "Quelles sont les températures à respecter en food truck ?", en: "What temperatures must be maintained in a food truck?" },
        answer: { fr: "Réfrigérateur entre 0°C et +4°C, congélateur à -18°C minimum, cuisson à cœur des viandes ≥ 63°C. Relevez les températures au minimum 2 fois par jour.", en: "Refrigerator between 0°C and +4°C, freezer at -18°C minimum, meat core cooking temperature ≥ 63°C. Log temperatures at least twice daily." },
      },
    ],
  },
  {
    slug: "comptabilite-food-truck-guide",
    title: {
      fr: "Comptabilité food truck : obligations, régimes fiscaux et astuces",
      en: "Food Truck Accounting: Requirements, Tax Options, and Tips",
    },
    excerpt: {
      fr: "Maîtrisez la comptabilité de votre food truck : choix du régime fiscal, obligations déclaratives, charges déductibles et outils pour simplifier votre gestion.",
      en: "Master your food truck accounting: tax regime options, reporting obligations, deductible expenses, and tools to simplify management.",
    },
    category: { fr: "Gestion", en: "Management" },
    date: "2025-03-25",
    readTime: 12,
    keywords: ["comptabilité food truck", "fiscalité food truck", "charges food truck", "gestion comptable food truck"],
    heroImage: "/blog/comptabilite-food-truck.png",
    content: {
      fr: `## La comptabilité : un pilier de votre food truck

Beaucoup de food truckers se lancent par passion pour la cuisine, mais négligent la comptabilité. Pourtant, **une mauvaise gestion comptable est la première cause de faillite** dans la restauration ambulante. Comprendre vos obligations et optimiser votre fiscalité peut vous faire économiser des milliers d'euros par an.

### Choisir son statut juridique

Le choix du statut impacte directement votre fiscalité :

**Micro-entreprise (auto-entrepreneur)**
- ✅ Simplicité maximale : pas de bilan, déclaration trimestrielle du CA
- ✅ Charges sociales : 12,3% du CA (achat-revente) ou 21,2% (prestations)
- ❌ Plafond CA : 188 700€ (achat-revente)
- ❌ Pas de déduction des charges réelles
- 👉 **Idéal pour tester** avant de se développer

**EURL / SARL**
- ✅ Déduction de toutes les charges (véhicule, matériel, ingrédients)
- ✅ Choix entre IR et IS
- ❌ Comptabilité complète obligatoire
- ❌ Coût comptable : 1 500€ à 3 000€/an
- 👉 **Idéal si CA > 80 000€/an**

**SASU / SAS**
- ✅ Statut assimilé salarié (meilleure protection sociale)
- ✅ Flexibilité de rémunération (salaire + dividendes)
- ❌ Charges sociales plus élevées
- 👉 **Idéal si vous visez la croissance** (plusieurs trucks)

### Les obligations comptables

**En micro-entreprise :**
- Livre de recettes chronologique
- Registre des achats (si achat-revente)
- Déclaration trimestrielle ou mensuelle du CA
- Facturation avec mentions obligatoires

**En société (EURL, SASU...) :**
- Bilan et compte de résultat annuels
- Livre journal et grand livre
- Déclaration de TVA (mensuelle ou trimestrielle)
- Liasse fiscale
- Assemblée générale annuelle

### La TVA en food truck

- **Vente à emporter** : TVA à 10% (produits préparés consommés immédiatement)
- **Boissons non alcoolisées** : TVA à 5,5%
- **Boissons alcoolisées** : TVA à 20%
- **Franchise en base de TVA** : exonéré si CA < 91 900€ (micro-entrepreneur)

### Les charges déductibles à ne pas oublier

En société, déduisez tout ce qui est lié à l'activité :
- **Matières premières et ingrédients**
- **Carburant et entretien véhicule**
- **Loyer emplacement** et droits de place
- **Emballages et consommables**
- **Assurances** (RC pro, véhicule, marchandises)
- **Matériel de cuisine** (amortissement)
- **Abonnements logiciels** (FoodTracks, caisse, compta)
- **Frais de formation** (HACCP, gestion)
- **Téléphone et internet**
- **Vêtements de travail**

### Les erreurs comptables courantes

1. **Mélanger perso et pro** — ouvrez un compte bancaire dédié dès le jour 1
2. **Oublier de conserver les justificatifs** — gardez TOUT pendant 10 ans
3. **Ne pas provisionner les charges** — mettez 30% du CA de côté pour les charges
4. **Sous-estimer la TVA** — elle n'est pas un revenu, c'est un dû
5. **Déclarer en retard** — pénalités de 10% à 40% selon le retard

### Comment FoodTracks simplifie votre comptabilité

FoodTracks est votre allié comptable :
- **Scan des factures fournisseurs** — plus besoin de tout saisir manuellement
- **CA automatique via SumUp** — réconciliation ventes/encaissements en un clic
- **Suivi des marges par produit** — données prêtes pour votre comptable
- **Export des données** — format compatible avec les logiciels comptables
- **Historique complet** — tous vos chiffres accessibles pour les contrôles fiscaux`,
      en: `## Accounting: A Pillar of Your Food Truck Business

Many food truckers start out of passion for cooking but neglect accounting. Yet **poor financial management is the #1 cause of failure** in mobile food businesses. Understanding your obligations and optimizing your taxes can save thousands of euros per year.

### Choosing Your Legal Structure

Your legal structure directly impacts your taxation:

**Micro-enterprise (auto-entrepreneur)**
- ✅ Maximum simplicity: no balance sheet, quarterly revenue declaration
- ✅ Social charges: 12.3% of revenue (buy-resell) or 21.2% (services)
- ❌ Revenue cap: €188,700 (buy-resell)
- ❌ No deduction of actual expenses
- 👉 **Ideal for testing** before scaling

**EURL / SARL**
- ✅ Deduct all expenses (vehicle, equipment, ingredients)
- ✅ Choice between income tax and corporate tax
- ❌ Full accounting required
- ❌ Accounting cost: €1,500 to €3,000/year
- 👉 **Ideal if revenue > €80,000/year**

**SASU / SAS**
- ✅ Employee-equivalent status (better social protection)
- ✅ Flexible compensation (salary + dividends)
- ❌ Higher social charges
- 👉 **Ideal if targeting growth** (multiple trucks)

### Accounting Obligations

**As a micro-enterprise:**
- Chronological revenue ledger
- Purchase register (if buy-resell)
- Quarterly or monthly revenue declaration
- Invoicing with mandatory mentions

**As a company (EURL, SASU...):**
- Annual balance sheet and income statement
- General journal and general ledger
- VAT declaration (monthly or quarterly)
- Tax return package
- Annual general meeting

### VAT for Food Trucks

- **Takeaway food**: 10% VAT (prepared food for immediate consumption)
- **Non-alcoholic beverages**: 5.5% VAT
- **Alcoholic beverages**: 20% VAT
- **VAT exemption**: exempt if revenue < €91,900 (micro-entrepreneur)

### Deductible Expenses You Shouldn't Forget

As a company, deduct everything related to your activity:
- **Raw materials and ingredients**
- **Fuel and vehicle maintenance**
- **Location rental** and pitch fees
- **Packaging and supplies**
- **Insurance** (professional liability, vehicle, goods)
- **Kitchen equipment** (depreciation)
- **Software subscriptions** (FoodTracks, POS, accounting)
- **Training costs** (HACCP, management)
- **Phone and internet**
- **Work clothing**

### Common Accounting Mistakes

1. **Mixing personal and business** — open a dedicated bank account from day 1
2. **Forgetting to keep receipts** — keep EVERYTHING for 10 years
3. **Not setting aside for taxes** — put 30% of revenue aside for charges
4. **Underestimating VAT** — it's not income, it's owed
5. **Late declarations** — penalties of 10% to 40% depending on delay

### How FoodTracks Simplifies Your Accounting

FoodTracks is your accounting ally:
- **Scan supplier invoices** — no more manual data entry
- **Automatic revenue via SumUp** — sales/payment reconciliation in one click
- **Margin tracking per product** — data ready for your accountant
- **Data export** — format compatible with accounting software
- **Complete history** — all your figures accessible for tax audits`,
    },
    keyTakeaways: {
      fr: [
        "La micro-entreprise est idéale pour tester, la société pour se développer",
        "La TVA vente à emporter est de 10%, boissons non alcoolisées 5,5%",
        "Conservez tous vos justificatifs pendant 10 ans minimum",
        "FoodTracks automatise le suivi du CA et le scan des factures",
      ],
      en: [
        "Micro-enterprise is ideal for testing, company structure for scaling",
        "Takeaway VAT is 10%, non-alcoholic beverages 5.5%",
        "Keep all receipts for at least 10 years",
        "FoodTracks automates revenue tracking and invoice scanning",
      ],
    },
    faqItems: [
      {
        question: { fr: "Quel statut juridique choisir pour un food truck ?", en: "What legal structure should I choose for a food truck?" },
        answer: { fr: "La micro-entreprise pour débuter (simple, plafond 188 700€), l'EURL/SARL au-delà de 80 000€/an de CA pour déduire les charges, ou la SASU si vous visez plusieurs véhicules.", en: "Micro-enterprise to start (simple, €188,700 cap), EURL/SARL above €80,000/year revenue to deduct expenses, or SASU if you're targeting multiple vehicles." },
      },
      {
        question: { fr: "Quel taux de TVA pour un food truck ?", en: "What VAT rate applies to food trucks?" },
        answer: { fr: "10% pour la vente à emporter de plats préparés, 5,5% pour les boissons non alcoolisées, 20% pour les boissons alcoolisées. Exonération possible en micro-entreprise sous 91 900€ de CA.", en: "10% for prepared takeaway food, 5.5% for non-alcoholic beverages, 20% for alcoholic beverages. Exemption possible as micro-entrepreneur under €91,900 revenue." },
      },
    ],
  },
  {
    slug: "fideliser-clients-food-truck",
    title: {
      fr: "Fidéliser les clients de son food truck : stratégies et programmes de loyauté",
      en: "Building Food Truck Customer Loyalty: Strategies and Programs",
    },
    excerpt: {
      fr: "Découvrez comment fidéliser vos clients en food truck : carte de fidélité, expérience client, communauté et outils digitaux pour créer des habitués.",
      en: "Discover how to build customer loyalty for your food truck: loyalty cards, customer experience, community building, and digital tools.",
    },
    category: { fr: "Marketing", en: "Marketing" },
    date: "2025-04-01",
    readTime: 9,
    keywords: ["fidélisation food truck", "carte fidélité food truck", "clients réguliers food truck", "loyauté clients food truck"],
    heroImage: "/blog/food-truck-equipe.png",
    content: {
      fr: `## Pourquoi la fidélisation est vitale en food truck

Acquérir un nouveau client coûte **5 à 7 fois plus cher** que de fidéliser un client existant. En food truck, où vous changez souvent d'emplacement, avoir une base de clients fidèles qui vous suivent est la clé d'un chiffre d'affaires stable.

### La carte de fidélité : le classique qui marche

La carte de fidélité reste le moyen le plus simple et efficace :

**Version papier :**
- Carte avec tampons (ex : 10 repas = 1 offert)
- ✅ Simple, pas de techno, universel
- ❌ Les clients la perdent souvent

**Version digitale :**
- QR code scanné à chaque achat
- ✅ Pas de carte à perdre, données clients récupérées
- ✅ Possibilité d'envoyer des promos ciblées
- ❌ Nécessite un outil (app, plateforme)

**Le bon ratio :** offrez une récompense après **8 à 10 achats**. Trop tôt = pas rentable, trop tard = pas motivant.

### L'expérience client : votre meilleur outil de fidélisation

Au-delà des promos, c'est l'expérience qui fidélise :

- **Apprenez les prénoms** de vos réguliers — rien de plus puissant
- **Souvenez-vous de leurs commandes** : "Le classique comme d'habitude ?"
- **Soignez la rapidité** — le déjeuner c'est chronométré, respectez le temps de vos clients
- **Soyez constant** — même qualité, mêmes portions, toujours
- **Créez un rituel** : le petit extra surprise (sauce maison, cookie offert le vendredi)

### Créer une communauté autour de votre truck

Transformez vos clients en fans :

- **Groupe WhatsApp ou Telegram** pour annoncer vos emplacements en avant-première
- **Concours Instagram** : photo du plat = tirage au sort pour un repas gratuit
- **Nommez un plat** d'après un client fidèle (le "Burger de Marco")
- **Événements privés** : dégustation pour les meilleurs clients 2 fois par an

### Le programme VIP sans la complexité

Pas besoin d'une app sophistiquée. Créez 3 niveaux simples :

| Niveau | Condition | Avantage |
|---|---|---|
| Habitué | 5+ achats | Boisson offerte par mois |
| Fan | 20+ achats | -10% permanent + accès avant-première nouveaux plats |
| Ambassadeur | 50+ achats + partage réseaux | Menu gratuit mensuel + plat à son nom |

### Les promotions qui fidélisent (sans casser vos marges)

- **Happy hour** : -20% entre 14h et 14h30 (écouler les restes du rush)
- **Parrainage** : client qui amène un ami = dessert offert aux deux
- **Anniversaire** : envoyez un message + offrez un petit plus le jour J
- **Combo fidélité** : toutes les 2 semaines, un combo spécial réservé aux habitués

### Les erreurs de fidélisation

- **Tout miser sur les réductions** — ça attire les chasseurs de promos, pas les fidèles
- **Être irrégulier** — changer d'emplacements sans prévenir détruit la fidélité
- **Ignorer les retours** — un client qui se plaint est un client qui veut rester
- **Négliger le digital** — même un simple groupe WhatsApp fait la différence

### Comment FoodTracks renforce la fidélisation

Avec les données FoodTracks :
- **Identifiez vos best-sellers** pour ne jamais les retirer du menu
- **Analysez vos emplacements** les plus fidèles (plus de récurrence)
- **Optimisez vos stocks** pour ne jamais décevoir un habitué en rupture
- **Prédictions de vente** pour anticiper la demande de vos fidèles`,
      en: `## Why Loyalty Matters for Food Trucks

Acquiring a new customer costs **5 to 7 times more** than retaining an existing one. For food trucks that change locations often, having a loyal customer base that follows you is the key to stable revenue.

### Loyalty Cards: The Classic That Works

Loyalty cards remain the simplest and most effective method:

**Paper version:**
- Stamp card (e.g., 10 meals = 1 free)
- ✅ Simple, no tech required, universal
- ❌ Customers often lose them

**Digital version:**
- QR code scanned at each purchase
- ✅ No card to lose, customer data collected
- ✅ Ability to send targeted promos
- ❌ Requires a tool (app, platform)

**The right ratio:** offer a reward after **8 to 10 purchases**. Too soon = not profitable, too late = not motivating.

### Customer Experience: Your Best Loyalty Tool

Beyond promos, experience is what builds loyalty:

- **Learn regulars' names** — nothing is more powerful
- **Remember their orders**: "The usual?"
- **Prioritize speed** — lunch is timed, respect your customers' time
- **Be consistent** — same quality, same portions, always
- **Create rituals**: surprise extras (house sauce, free cookie on Fridays)

### Building a Community Around Your Truck

Turn customers into fans:

- **WhatsApp or Telegram group** to announce locations early
- **Instagram contests**: photo of dish = raffle for a free meal
- **Name a dish** after a loyal customer ("Marco's Burger")
- **Private events**: tastings for top customers twice a year

### VIP Program Without Complexity

No need for a sophisticated app. Create 3 simple tiers:

| Tier | Condition | Benefit |
|---|---|---|
| Regular | 5+ purchases | Free drink per month |
| Fan | 20+ purchases | -10% permanent + early access to new dishes |
| Ambassador | 50+ purchases + social shares | Free monthly meal + dish named after them |

### Promotions That Build Loyalty (Without Breaking Margins)

- **Happy hour**: -20% between 2:00 and 2:30 PM (clear rush leftovers)
- **Referral**: customer brings a friend = free dessert for both
- **Birthday**: send a message + offer a treat on the day
- **Loyalty combo**: every 2 weeks, a special combo reserved for regulars

### Loyalty Mistakes to Avoid

- **Relying only on discounts** — attracts deal hunters, not loyal fans
- **Being inconsistent** — changing locations without notice destroys loyalty
- **Ignoring feedback** — a complaining customer is a customer who wants to stay
- **Neglecting digital** — even a simple WhatsApp group makes a difference

### How FoodTracks Strengthens Loyalty

With FoodTracks data:
- **Identify your best-sellers** so you never remove them from the menu
- **Analyze your most loyal locations** (higher recurrence)
- **Optimize stock** to never disappoint a regular with stockouts
- **Sales predictions** to anticipate your regulars' demand`,
    },
    keyTakeaways: {
      fr: [
        "Fidéliser coûte 5 à 7 fois moins cher qu'acquérir un nouveau client",
        "Une carte de fidélité avec récompense après 8-10 achats est le format optimal",
        "L'expérience client (prénoms, commandes mémorisées) fidélise plus que les promos",
        "Un simple groupe WhatsApp pour annoncer vos emplacements crée une communauté fidèle",
      ],
      en: [
        "Retention costs 5 to 7 times less than acquisition",
        "A loyalty card with reward after 8-10 purchases is the optimal format",
        "Customer experience (names, remembered orders) builds more loyalty than promos",
        "A simple WhatsApp group to announce locations creates a loyal community",
      ],
    },
    faqItems: [
      {
        question: { fr: "Comment fidéliser les clients d'un food truck ?", en: "How to build food truck customer loyalty?" },
        answer: { fr: "Combinez carte de fidélité (8-10 achats = 1 offert), expérience client personnalisée (prénoms, commandes mémorisées), et communauté digitale (groupe WhatsApp pour les emplacements). La constance dans la qualité est clé.", en: "Combine loyalty cards (8-10 purchases = 1 free), personalized customer experience (names, remembered orders), and digital community (WhatsApp group for locations). Consistency in quality is key." },
      },
      {
        question: { fr: "Carte de fidélité papier ou digitale pour un food truck ?", en: "Paper or digital loyalty card for a food truck?" },
        answer: { fr: "Les deux ont des avantages. Le papier est simple et universel mais se perd. Le digital (QR code) ne se perd pas et permet de collecter des données clients pour du marketing ciblé. L'idéal est de proposer les deux.", en: "Both have advantages. Paper is simple and universal but gets lost. Digital (QR code) can't be lost and allows collecting customer data for targeted marketing. Ideally, offer both." },
      },
    ],
  },
  {
    slug: "food-truck-evenementiel-traiteur",
    title: {
      fr: "Food truck événementiel et traiteur : diversifier ses revenus",
      en: "Event Catering with Your Food Truck: Diversifying Revenue",
    },
    excerpt: {
      fr: "Développez votre activité de food truck vers l'événementiel : mariages, séminaires, festivals. Guide complet pour décrocher des contrats et maximiser vos revenus.",
      en: "Expand your food truck into event catering: weddings, corporate events, festivals. Complete guide to landing contracts and maximizing revenue.",
    },
    category: { fr: "Business", en: "Business" },
    date: "2025-04-05",
    readTime: 11,
    keywords: ["food truck événementiel", "food truck traiteur", "food truck mariage", "food truck séminaire"],
    heroImage: "/blog/food-truck-festival.png",
    content: {
      fr: `## L'événementiel : le booster de revenus du food truck

La vente quotidienne sur vos emplacements habituels, c'est votre base. Mais l'événementiel peut représenter **30 à 50% de votre CA annuel** avec des marges bien supérieures. Un seul mariage peut rapporter autant qu'une semaine entière de service street food.

### Les types d'événements les plus rentables

**Mariages et fêtes privées**
- Budget moyen : 1 500€ à 5 000€
- Marge : 60-70% (menu fixe, quantités prévisibles)
- Saison : avril à octobre
- 👉 Le plus rentable, mais demande une prestation premium

**Séminaires et événements corporate**
- Budget moyen : 800€ à 3 000€
- Récurrence : les entreprises reviennent chaque année
- Avantage : paiement rapide, volumes importants
- 👉 Excellent pour le CA régulier

**Festivals et marchés événementiels**
- Budget : droit de place 200€ à 2 000€ + vente libre
- CA potentiel : 2 000€ à 15 000€ le week-end
- Risque : météo, concurrence sur place
- 👉 Fort potentiel mais plus aléatoire

**Anniversaires et fêtes de quartier**
- Budget : 500€ à 1 500€
- Volume : plus faible mais fidélisant
- 👉 Bon pour le bouche-à-oreille local

### Comment décrocher des contrats événementiels

**1. Créez une offre dédiée**
- Menu événementiel séparé de votre menu street food
- 3 formules : Essentielle (entrée + plat), Confort (entrée + plat + dessert), Premium (apéro + entrée + plat + dessert + boisson)
- Tarification par personne (15€ à 35€/pers selon la formule)

**2. Rendez-vous visible**
- Page dédiée "Événements" sur votre site web
- Profil sur les plateformes : Mariages.net, EventBrite, TruckBooking
- Portfolio photos de vos prestations passées
- Avis clients événementiels sur Google

**3. Développez votre réseau**
- Wedding planners et organisateurs d'événements
- Comités d'entreprise (CE)
- Mairies et offices de tourisme
- Salles de réception sans traiteur attitré

**4. Soignez le premier contact**
- Répondez en moins de 24h
- Envoyez un devis pro et détaillé
- Proposez une dégustation (ça convertit énormément)

### La logistique événementielle

La prestation événementielle demande plus de préparation :

- **Reconnaissance du lieu** : accès camion, électricité, eau, espace
- **Préparation en avance** : maximum de préparations faites la veille
- **Staff supplémentaire** : prévoyez 1 personne pour 30-40 couverts
- **Matériel spécifique** : assiettes, couverts, décoration si demandé
- **Plan B météo** : si événement extérieur, prévoir une solution pluie

### La tarification événementielle

| Formule | Contenu | Prix/personne |
|---|---|---|
| Essentielle | 1 plat + 1 boisson | 15€ - 20€ |
| Confort | Entrée + plat + dessert + boisson | 22€ - 30€ |
| Premium | Apéro + entrée + plat + dessert + boisson | 30€ - 45€ |
| Corporate | Buffet + boissons illimitées | 25€ - 35€ |

**Ajoutez des options** : cocktail d'accueil (+5€/pers), bar à desserts (+8€/pers), animation cuisine live (+200€).

### Les erreurs à éviter

- **Sous-tarifer** par peur de ne pas avoir le contrat — vous méritez une marge premium
- **Accepter sans visiter le lieu** — l'accès et la logistique peuvent être un cauchemar
- **Négliger le contrat écrit** — détaillez tout : menu, horaires, conditions d'annulation, acompte (30-50%)
- **Oublier les extras** — kilomètres supplémentaires, heures sup, vaisselle, nettoyage

### Comment FoodTracks optimise vos événements

FoodTracks vous aide à professionnaliser vos prestations :
- **Calcul précis des quantités** via les prédictions IA selon le nombre de couverts
- **Coût matière par événement** pour garantir vos marges
- **Suivi du CA événementiel** séparé du CA quotidien
- **Gestion des stocks dédiés** pour ne rien oublier le jour J`,
      en: `## Event Catering: The Food Truck Revenue Booster

Daily sales at your regular spots are your baseline. But events can represent **30 to 50% of your annual revenue** with much higher margins. A single wedding can earn as much as an entire week of street food service.

### Most Profitable Event Types

**Weddings and private parties**
- Average budget: €1,500 to €5,000
- Margin: 60-70% (fixed menu, predictable quantities)
- Season: April to October
- 👉 Most profitable, but requires premium service

**Corporate seminars and events**
- Average budget: €800 to €3,000
- Recurrence: companies come back every year
- Advantage: fast payment, large volumes
- 👉 Excellent for regular revenue

**Festivals and event markets**
- Budget: pitch fee €200 to €2,000 + free sales
- Potential revenue: €2,000 to €15,000 per weekend
- Risk: weather, on-site competition
- 👉 High potential but more unpredictable

**Birthdays and neighborhood events**
- Budget: €500 to €1,500
- Volume: lower but loyalty-building
- 👉 Great for local word-of-mouth

### How to Land Event Contracts

**1. Create a dedicated offering**
- Event menu separate from your street food menu
- 3 packages: Essential (starter + main), Comfort (starter + main + dessert), Premium (appetizer + starter + main + dessert + drink)
- Per-person pricing (€15 to €35/person depending on package)

**2. Get visible**
- Dedicated "Events" page on your website
- Profile on platforms: Mariages.net, EventBrite, TruckBooking
- Photo portfolio of past events
- Event-specific Google reviews

**3. Build your network**
- Wedding planners and event organizers
- Company works councils
- City halls and tourist offices
- Reception venues without dedicated caterers

**4. Nail the first contact**
- Respond within 24 hours
- Send a professional, detailed quote
- Offer a tasting (converts extremely well)

### Event Logistics

Event catering requires more preparation:

- **Venue reconnaissance**: truck access, electricity, water, space
- **Advance prep**: maximum preparations done the day before
- **Extra staff**: plan 1 person per 30-40 covers
- **Specific equipment**: plates, cutlery, decoration if requested
- **Weather plan B**: for outdoor events, have a rain solution

### Event Pricing

| Package | Content | Price/person |
|---|---|---|
| Essential | 1 main + 1 drink | €15 - €20 |
| Comfort | Starter + main + dessert + drink | €22 - €30 |
| Premium | Appetizer + starter + main + dessert + drink | €30 - €45 |
| Corporate | Buffet + unlimited drinks | €25 - €35 |

**Add options**: welcome cocktail (+€5/person), dessert bar (+€8/person), live cooking show (+€200).

### Mistakes to Avoid

- **Underpricing** out of fear of losing the contract — you deserve a premium margin
- **Accepting without visiting the venue** — access and logistics can be a nightmare
- **Skipping a written contract** — detail everything: menu, times, cancellation terms, deposit (30-50%)
- **Forgetting extras** — additional kilometers, overtime, dishes, cleanup

### How FoodTracks Optimizes Your Events

FoodTracks helps professionalize your services:
- **Precise quantity calculation** via AI predictions based on headcount
- **Food cost per event** to guarantee your margins
- **Event revenue tracking** separate from daily revenue
- **Dedicated stock management** so you don't forget anything on the day`,
    },
    keyTakeaways: {
      fr: [
        "L'événementiel peut représenter 30 à 50% du CA annuel d'un food truck",
        "Les mariages sont les événements les plus rentables (marge 60-70%)",
        "Créez 3 formules tarifées par personne (15€ à 45€)",
        "FoodTracks calcule les quantités et coûts matière par événement",
      ],
      en: [
        "Events can represent 30 to 50% of a food truck's annual revenue",
        "Weddings are the most profitable events (60-70% margin)",
        "Create 3 per-person packages (€15 to €45)",
        "FoodTracks calculates quantities and food costs per event",
      ],
    },
    faqItems: [
      {
        question: { fr: "Combien facturer pour un food truck en mariage ?", en: "How much to charge for a food truck at a wedding?" },
        answer: { fr: "Entre 25€ et 45€ par personne selon la formule choisie, plus les options (cocktail d'accueil, bar à desserts). Pour 80 convives en formule Confort, comptez 2 000€ à 2 400€ HT.", en: "Between €25 and €45 per person depending on the package, plus options (welcome cocktail, dessert bar). For 80 guests on Comfort package, expect €2,000 to €2,400 excl. VAT." },
      },
      {
        question: { fr: "Comment trouver des événements pour son food truck ?", en: "How to find events for your food truck?" },
        answer: { fr: "Inscrivez-vous sur Mariages.net, EventBrite et TruckBooking. Contactez les wedding planners, CE d'entreprises et mairies. Créez une page Événements sur votre site avec un portfolio photos.", en: "Register on Mariages.net, EventBrite, and TruckBooking. Contact wedding planners, company councils, and city halls. Create an Events page on your site with a photo portfolio." },
      },
    ],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogArticles.map((a) => a.slug);
}
