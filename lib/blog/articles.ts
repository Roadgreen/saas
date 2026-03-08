export interface BlogArticle {
  slug: string;
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  category: { fr: string; en: string };
  date: string;
  readTime: number;
  keywords: string[];
  content: { fr: string; en: string };
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
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogArticles.map((a) => a.slug);
}
