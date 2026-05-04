export interface UseCase {
  metric: string;
  title: string;
  description: string;
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
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroTagline: string;
  heroSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  painTitle: string;
  pains: [PainItem, PainItem, PainItem];
  featuresTitle: string;
  features: [FeatureItem, FeatureItem, FeatureItem, FeatureItem];
  useCasesTitle: string;
  useCases: [UseCase, UseCase, UseCase];
  faqTitle: string;
  faqs: [FaqItem, FaqItem, FaqItem, FaqItem];
  footerCtaTitle: string;
  footerCtaSubtitle: string;
  footerCtaPrimary: string;
  footerCtaSecondary: string;
}

export interface VerticalConfig {
  slug: 'boulangerie' | 'snack' | 'glacier' | 'cafe' | 'marche';
  vertical: 'bakery' | 'snack' | 'icecream' | 'cafe' | 'market';
  iconName: 'Wheat' | 'Sandwich' | 'IceCream' | 'Coffee' | 'Tent';
  heroImage: string;
  keywords: {
    fr: string[];
    en: string[];
  };
  fr: VerticalContent;
  en: VerticalContent;
}

export const VERTICALS: VerticalConfig[] = [
  // ─── BOULANGERIE ────────────────────────────────────────────────────────────
  {
    slug: 'boulangerie',
    vertical: 'bakery',
    iconName: 'Wheat',
    heroImage: '/verticals/boulangerie.jpg',
    keywords: {
      fr: [
        'logiciel boulangerie indépendante',
        'réduire invendus boulangerie',
        'gestion stock pâtisserie',
        'prévision production baguettes',
        'logiciel pâtisserie artisanale',
        'application boulangerie gestion ventes',
        'outil prévision invendus pain',
        'logiciel gestion boulangerie sandwiches',
        'rentabilité boulangerie viennoiseries',
        'météo impact ventes boulangerie',
      ],
      en: [
        'independent bakery management software',
        'reduce bakery waste',
        'pastry shop stock management',
        'bread production forecasting tool',
        'artisan bakery software',
        'bakery sales analytics app',
        'unsold bread reduction tool',
        'bakery sandwich sales forecast',
        'bakery profitability software',
        'weather-based bakery forecast',
      ],
    },
    fr: {
      title: 'Logiciel pour boulangerie & pâtisserie indépendante',
      metaTitle: 'Logiciel boulangerie — Réduisez vos invendus | FoodTracks',
      metaDescription:
        'Prévoyez exactement combien de baguettes, viennoiseries et sandwiches produire chaque jour. Invendus divisés par 2 dès le premier mois. Essai 14j gratuit.',
      heroBadge: 'Pour les boulangers indépendants',
      heroTagline: 'Préparez le bon nombre de baguettes, chaque jour.',
      heroSub:
        "FoodTracks analyse la météo, les jours de marché et votre historique pour calculer exactement ce qu'il faut cuire. Plus de poubelle pleine le soir.",
      ctaPrimary: 'Essai 14 jours gratuit',
      ctaSecondary: 'Voir comment ça marche',
      painTitle: 'Les vraies douleurs du boulanger indépendant',
      pains: [
        {
          title: 'Trop d\'invendus chaque soir',
          description:
            'Pain de seigle, croissants, tartes — vous jetez en moyenne 8 à 15 % de votre production quotidienne faute d\'une prévision fiable.',
        },
        {
          title: 'Météo et affluence impossibles à anticiper',
          description:
            'Un jour de canicule réduit les ventes de pain de 30 %, mais une pluie soudaine fait exploser les sandwiches. Sans données, c\'est du hasard.',
        },
        {
          title: 'Stock matières premières mal calibré',
          description:
            'Trop de farine commandée avant un pont, ou rupture de beurre un samedi matin : gérer les approvisionnements sans visibilité coûte cher.',
        },
      ],
      featuresTitle: 'Quatre piliers pour piloter votre boulangerie',
      features: [
        {
          title: 'Prévision de production journalière',
          description:
            'L\'IA combine météo locale, historique de ventes et agenda (fêtes, marchés) pour vous dire combien de baguettes, pains spéciaux et viennoiseries cuire demain.',
        },
        {
          title: 'Stock farine & ingrédients',
          description:
            'Suivez en temps réel vos niveaux de farine, beurre, levure et fruits. Recevez une alerte avant la rupture et évitez les achats de dernière minute.',
        },
        {
          title: 'Ventes par gamme de produits',
          description:
            'Visualisez quels pains, viennoiseries et sandwiches génèrent vos meilleures marges par heure, par jour de semaine et par saison.',
        },
        {
          title: 'Rentabilité par produit',
          description:
            'Calculez automatiquement le coût de revient de chaque recette et identifiez les produits à repositionner en prix ou à retirer de l\'offre.',
        },
      ],
      useCasesTitle: 'Ce que gagnent les boulangers avec FoodTracks',
      useCases: [
        {
          metric: '+€380/mois',
          title: 'Moins de pain jeté',
          description:
            'En réduisant les invendus de 40 %, une boulangerie de quartier récupère en moyenne 380 € par mois sur ses seules baguettes et viennoiseries.',
        },
        {
          metric: '−28%',
          title: 'Achats matières premières',
          description:
            'Grâce aux alertes de stock, les commandes fournisseurs sont calibrées à la semaine : 28 % de dépenses en moins sur la farine et le beurre.',
        },
        {
          metric: '5h/semaine',
          title: 'Temps de gestion économisé',
          description:
            'Plus besoin de compter manuellement les invendus ni de refaire les commandes fournisseurs chaque lundi : l\'automatisation récupère 5 heures par semaine.',
        },
      ],
      faqTitle: 'Questions fréquentes — Boulangerie',
      faqs: [
        {
          question: 'FoodTracks fonctionne-t-il pour une boulangerie qui fait aussi salon de thé ?',
          answer:
            'Oui. Vous pouvez créer autant de gammes que vous voulez (pain, viennoiseries, sandwiches midi, boissons) et suivre les ventes et stocks de chaque gamme séparément.',
        },
        {
          question: 'Comment FoodTracks tient-il compte de la météo pour la boulangerie ?',
          answer:
            'L\'IA intègre les prévisions météo locales sur 3 jours. Par exemple, si 30 °C sont annoncés demain, le système réduit automatiquement la prévision pain chaud et augmente celle des sandwiches et boissons fraîches.',
        },
        {
          question: 'Dois-je avoir une caisse connectée pour utiliser FoodTracks ?',
          answer:
            'Non. Vous pouvez entrer vos ventes manuellement ou importer un fichier CSV depuis n\'importe quelle caisse. L\'IA s\'améliore au fil des saisies, dès les premières semaines.',
        },
        {
          question: 'Quel est le prix après l\'essai gratuit ?',
          answer:
            'Le premier mois est à 9,99 € (offre lancement), puis 19,99 €/mois sans engagement. Annulation en un clic depuis votre compte, sans condition.',
        },
      ],
      footerCtaTitle: 'Arrêtez de jeter. Commencez à prévoir.',
      footerCtaSubtitle:
        '14 jours d\'essai gratuit, puis 9,99 € le premier mois. Sans carte bancaire.',
      footerCtaPrimary: 'Démarrer mon essai gratuit',
      footerCtaSecondary: 'Voir tous les tarifs',
    },
    en: {
      title: 'Bakery & pastry shop management software',
      metaTitle: 'Bakery Software — Cut Waste, Boost Profit | FoodTracks',
      metaDescription:
        'Know exactly how many loaves, pastries and sandwiches to bake each day. Halve your unsold waste from week one. 14-day free trial, no credit card.',
      heroBadge: 'Built for independent bakers',
      heroTagline: 'Bake the right amount, every single morning.',
      heroSub:
        'FoodTracks reads the weather forecast, local events and your sales history to calculate exactly what to put in the oven. No more binning half your output at closing time.',
      ctaPrimary: 'Start 14-day free trial',
      ctaSecondary: 'See how it works',
      painTitle: 'The real headaches of running a bakery',
      pains: [
        {
          title: 'Unsold stock piling up every evening',
          description:
            'Sourdough, croissants, tarts — most independent bakeries throw away 8–15 % of daily output simply because there is no reliable production forecast.',
        },
        {
          title: 'Weather and footfall are unpredictable',
          description:
            'A heatwave cuts bread sales by 30 %, while sudden rain spikes sandwich demand. Without data, every morning is a gamble.',
        },
        {
          title: 'Ingredient ordering is always off',
          description:
            'Too much flour before a bank holiday, or running out of butter on a Saturday — poor stock visibility turns small mistakes into real losses.',
        },
      ],
      featuresTitle: 'Four pillars to run a sharper bakery',
      features: [
        {
          title: 'Daily production forecast',
          description:
            'The AI blends local weather, your sales history and calendar events (bank holidays, local markets) to tell you how many loaves, pastries and specials to bake tomorrow.',
        },
        {
          title: 'Flour & ingredient stock tracking',
          description:
            'Monitor flour, butter, yeast and fruit levels in real time. Get a low-stock alert before you run out, and stop making emergency supplier runs.',
        },
        {
          title: 'Sales by product range',
          description:
            'See which breads, pastries and sandwiches drive the best margins — by time of day, day of the week or season — and adjust your offer accordingly.',
        },
        {
          title: 'Per-product profitability',
          description:
            'Automatically calculate the cost price of each recipe and identify products to reprice or retire from your menu.',
        },
      ],
      useCasesTitle: 'What bakers gain with FoodTracks',
      useCases: [
        {
          metric: '+€380/month',
          title: 'Less bread thrown away',
          description:
            'By cutting unsold stock by 40 %, a neighbourhood bakery recovers an average of €380 per month on loaves and pastries alone.',
        },
        {
          metric: '−28%',
          title: 'Ingredient purchasing costs',
          description:
            'Weekly stock alerts calibrate supplier orders precisely — 28 % less spent on flour and butter year-round.',
        },
        {
          metric: '5 hrs/week',
          title: 'Management time saved',
          description:
            'No more manual end-of-day counts or Monday morning reorder spreadsheets — automation hands back five hours every week.',
        },
      ],
      faqTitle: 'FAQ — Bakery',
      faqs: [
        {
          question: 'Does FoodTracks work for a bakery that also runs a tea room?',
          answer:
            'Yes. You can create as many product ranges as you need (bread, pastries, lunchtime sandwiches, drinks) and track sales and stock independently for each.',
        },
        {
          question: 'How does FoodTracks use weather data for a bakery?',
          answer:
            'The AI pulls 3-day local weather forecasts. If 30 °C is forecast tomorrow, the system automatically trims the hot-bread prediction and boosts the sandwich and cold-drink forecast.',
        },
        {
          question: 'Do I need a connected POS system to use FoodTracks?',
          answer:
            'No. You can enter sales manually or import a CSV from any till. The AI improves as you add data, and most users see meaningful forecasts within the first two weeks.',
        },
        {
          question: 'What does it cost after the free trial?',
          answer:
            '€9.99 for your first month (launch offer), then €19.99/month with no commitment. Cancel in one click from your account at any time.',
        },
      ],
      footerCtaTitle: 'Stop wasting. Start forecasting.',
      footerCtaSubtitle:
        '14-day free trial, then €9.99 your first month. No credit card required.',
      footerCtaPrimary: 'Start my free trial',
      footerCtaSecondary: 'See all pricing',
    },
  },

  // ─── SNACK ──────────────────────────────────────────────────────────────────
  {
    slug: 'snack',
    vertical: 'snack',
    iconName: 'Sandwich',
    heroImage: '/verticals/snack.jpg',
    keywords: {
      fr: [
        'logiciel snack indépendant',
        'gestion stock sandwicherie',
        'snack restauration rapide logiciel',
        'réduire food cost snack',
        'prévision rush midi sandwicherie',
        'gestion ingrédients sandwich',
        'logiciel fast-good indépendant',
        'tableau de bord ventes snack',
        'rentabilité snack restauration',
        'application gestion snack bar',
      ],
      en: [
        'snack bar management software',
        'sandwich shop stock management',
        'fast food independent software',
        'reduce food cost snack bar',
        'lunch rush forecasting tool',
        'sandwich ingredient stock app',
        'independent fast-good software',
        'snack sales dashboard',
        'snack bar profitability tool',
        'snack shop analytics software',
      ],
    },
    fr: {
      title: 'Logiciel snack, sandwicherie & fast-good indépendant',
      metaTitle: 'Logiciel snack & sandwicherie — Gérez votre rush | FoodTracks',
      metaDescription:
        'Anticipez votre rush du midi, calibrez vos stocks viandes et sauces, et pilotez votre food cost en temps réel. Essai 14j gratuit pour votre snack.',
      heroBadge: 'Pour les snacks et sandwicheries indépendants',
      heroTagline: 'Préparez exactement assez pour le rush du midi.',
      heroSub:
        "FoodTracks prédit combien de sandwiches, paninis et wraps vous allez vendre entre 12h et 14h. Finies les ruptures à 13h30 et les restes qui finissent à la poubelle.",
      ctaPrimary: 'Essai 14 jours gratuit',
      ctaSecondary: 'Voir comment ça marche',
      painTitle: 'Les galères quotidiennes d\'un snack indépendant',
      pains: [
        {
          title: 'Rush du midi impossible à calibrer',
          description:
            'Vous préparez trop et jetez, ou pas assez et des clients repartent les mains vides. Sans prévision, chaque midi ressemble à un pari.',
        },
        {
          title: 'Food cost hors de contrôle',
          description:
            'Viandes, sauces, pains spéciaux : quand les quantités ne sont pas calibrées, le coût matières grimpe silencieusement et grignote votre marge.',
        },
        {
          title: 'Livraison Uber Eats + service sur place mal synchronisés',
          description:
            'Gérer deux canaux de vente sans vue consolidée crée des doublons de stock et des ruptures que vous ne voyez qu\'une fois la rupture arrivée.',
        },
      ],
      featuresTitle: 'Quatre leviers pour piloter votre snack',
      features: [
        {
          title: 'Prévision de volume midi',
          description:
            'L\'IA analyse la météo (canicule = -20 % de fréquentation), les jours fériés, les alentours (concerts, chantiers) et prédit votre chiffre d\'affaires du lendemain à 15 % près.',
        },
        {
          title: 'Stock ingrédients en temps réel',
          description:
            'Suivez viandes, légumes, pains et sauces au gramme. L\'alerte de seuil bas vous prévient la veille pour que votre commande arrive à temps.',
        },
        {
          title: 'Ventes par formule et canal',
          description:
            'Comparez vos ventes sur place, à emporter et en livraison. Identifiez les formules les plus rentables et celles qui ralentissent votre service.',
        },
        {
          title: 'Rentabilité par recette',
          description:
            'Calculez le food cost précis de chaque sandwich ou wrap et sachez quels produits méritent d\'être en avant, en promo ou retirés de la carte.',
        },
      ],
      useCasesTitle: 'Ce que gagnent les snacks avec FoodTracks',
      useCases: [
        {
          metric: '−35%',
          title: 'Pertes matières premières',
          description:
            'Un snack de 40 couverts à Paris a réduit ses pertes ingrédients de 35 % en six semaines en calibrant ses commandes viande sur les prévisions du lundi.',
        },
        {
          metric: '+€290/mois',
          title: 'Marge récupérée',
          description:
            'En supprimant les achats de dépannage (livreur express quand le stock est vide), la marge nette remonte en moyenne de 290 € par mois.',
        },
        {
          metric: '3h/semaine',
          title: 'Inventaire automatisé',
          description:
            'Fini le comptage manuel des ingrédients chaque dimanche soir : le suivi des sorties en temps réel remplace l\'inventaire hebdomadaire.',
        },
      ],
      faqTitle: 'Questions fréquentes — Snack & sandwicherie',
      faqs: [
        {
          question: 'FoodTracks gère-t-il les recettes multi-ingrédients pour les sandwiches ?',
          answer:
            'Oui. Vous définissez vos recettes (ex. : steak-frites = 180 g viande + 200 g pommes de terre), et chaque vente déduit automatiquement les quantités de votre stock.',
        },
        {
          question: 'Peut-on connecter Uber Eats ou Deliveroo pour importer les commandes ?',
          answer:
            'L\'import CSV est disponible depuis toutes les plateformes de livraison. La connexion directe par API est prévue dans les prochaines mises à jour.',
        },
        {
          question: 'La prévision fonctionne-t-elle si j\'ai moins de 3 mois d\'historique ?',
          answer:
            'L\'IA démarre avec seulement 2 semaines de données et s\'améliore chaque jour. Les premières prévisions sont utiles dès la troisième semaine d\'utilisation.',
        },
        {
          question: 'Quel est le coût après l\'essai de 14 jours ?',
          answer:
            '9,99 € le premier mois (offre lancement pour les 50 premiers commerces), puis 19,99 €/mois. Aucun engagement, annulation en un clic.',
        },
      ],
      footerCtaTitle: 'Votre rush du midi, enfin sous contrôle.',
      footerCtaSubtitle:
        '14 jours d\'essai gratuit, puis 9,99 € le premier mois. Sans carte bancaire.',
      footerCtaPrimary: 'Démarrer mon essai gratuit',
      footerCtaSecondary: 'Voir tous les tarifs',
    },
    en: {
      title: 'Snack bar & sandwich shop management software',
      metaTitle: 'Snack Bar Software — Master Your Lunch Rush | FoodTracks',
      metaDescription:
        'Predict your midday rush, calibrate meat and sauce stocks, and track food cost in real time. 14-day free trial for your snack bar or sandwich shop.',
      heroBadge: 'Built for independent snack bars & sandwich shops',
      heroTagline: 'Prep exactly enough for the lunch rush.',
      heroSub:
        'FoodTracks predicts how many sandwiches, paninis and wraps you will sell between noon and 2 pm. No more running out at 1:30 pm or binning leftovers at close.',
      ctaPrimary: 'Start 14-day free trial',
      ctaSecondary: 'See how it works',
      painTitle: 'The daily headaches of an independent snack bar',
      pains: [
        {
          title: 'Lunch rush impossible to size',
          description:
            'Over-prep and waste, or under-prep and lose customers. Without a forecast, every midday service is a coin flip.',
        },
        {
          title: 'Food cost creeping out of control',
          description:
            'Meat, sauces, specialty breads — when quantities are not calibrated, ingredient costs quietly erode your margin week after week.',
        },
        {
          title: 'Delivery and dine-in out of sync',
          description:
            'Running two sales channels without a consolidated view creates stock duplications and stockouts you only notice once they have already cost you sales.',
        },
      ],
      featuresTitle: 'Four levers to sharpen your snack bar',
      features: [
        {
          title: 'Midday volume forecast',
          description:
            'The AI factors in weather (heatwave = −20 % footfall), bank holidays and local events to predict your next-day revenue within 15 %.',
        },
        {
          title: 'Ingredient stock in real time',
          description:
            'Track meat, vegetables, bread and sauces to the gram. Low-stock alerts fire the evening before so your order arrives on time.',
        },
        {
          title: 'Sales by meal deal and channel',
          description:
            'Compare dine-in, takeaway and delivery performance. Identify which meal deals are most profitable and which are slowing your service.',
        },
        {
          title: 'Per-recipe profitability',
          description:
            'Calculate the exact food cost of each sandwich or wrap and know which products deserve a prime spot on the menu — and which to retire.',
        },
      ],
      useCasesTitle: 'What snack bars gain with FoodTracks',
      useCases: [
        {
          metric: '−35%',
          title: 'Ingredient waste cut',
          description:
            'A 40-cover snack bar in Paris cut ingredient losses by 35 % in six weeks by sizing Monday meat orders against the weekly forecast.',
        },
        {
          metric: '+€290/month',
          title: 'Margin recovered',
          description:
            'Eliminating emergency supplier runs (courier deliveries when stock runs dry) pushes net margin up by an average of €290 per month.',
        },
        {
          metric: '3 hrs/week',
          title: 'Inventory automated',
          description:
            'Real-time stock deductions replace the Sunday evening manual count — three hours handed back every week.',
        },
      ],
      faqTitle: 'FAQ — Snack bar & sandwich shop',
      faqs: [
        {
          question: 'Does FoodTracks handle multi-ingredient recipes for sandwiches?',
          answer:
            'Yes. Define your recipes (e.g. steak sandwich = 180 g meat + 200 g fries) and every sale automatically deducts the right quantities from stock.',
        },
        {
          question: 'Can I connect Uber Eats or Deliveroo to import orders?',
          answer:
            'CSV import is available from all delivery platforms today. Direct API integration is on the near-term roadmap.',
        },
        {
          question: 'Does the forecast work if I have less than 3 months of history?',
          answer:
            'The AI starts with as little as two weeks of data and improves daily. Most users see actionable forecasts by their third week of use.',
        },
        {
          question: 'What does it cost after the 14-day trial?',
          answer:
            '€9.99 for your first month (launch offer for the first 50 shops), then €19.99/month. No commitment — cancel in one click.',
        },
      ],
      footerCtaTitle: 'Your lunch rush, finally under control.',
      footerCtaSubtitle:
        '14-day free trial, then €9.99 your first month. No credit card required.',
      footerCtaPrimary: 'Start my free trial',
      footerCtaSecondary: 'See all pricing',
    },
  },

  // ─── GLACIER ────────────────────────────────────────────────────────────────
  {
    slug: 'glacier',
    vertical: 'icecream',
    iconName: 'IceCream',
    heroImage: '/verticals/glacier.jpg',
    keywords: {
      fr: [
        'logiciel glacier artisanal',
        'prévision météo glacier glace',
        'gestion production parfums glace',
        'réduire pertes glaces invendues',
        'logiciel gestion stock sorbet',
        'application glacier indépendant',
        'prévision ventes glaces été',
        'rentabilité glacier artisan',
        'logiciel crémerie artisanale',
        'outil gestion glacier saison',
      ],
      en: [
        'artisan ice cream shop software',
        'weather-based ice cream forecast',
        'ice cream flavour production planning',
        'reduce unsold ice cream waste',
        'gelato stock management software',
        'independent ice cream shop app',
        'summer ice cream sales forecast',
        'ice cream shop profitability tool',
        'artisan gelateria software',
        'seasonal ice cream management tool',
      ],
    },
    fr: {
      title: 'Logiciel pour glacier artisanal',
      metaTitle: 'Logiciel glacier artisanal — Prévisions météo glace | FoodTracks',
      metaDescription:
        'Anticipez vos ventes de glaces selon la météo et la saison. Planifiez votre production par parfum sans gâcher. Essai 14j gratuit pour votre glacier.',
      heroBadge: 'Pour les glaciers artisanaux',
      heroTagline: 'Vendez plus de glaces les jours de soleil. Évitez les pertes quand il pleut.',
      heroSub:
        'FoodTracks prédit vos ventes à 48h en fonction de la température réelle et vous dit exactement quels parfums produire. Zéro bac gaspillé, zéro rupture un samedi d\'août.',
      ctaPrimary: 'Essai 14 jours gratuit',
      ctaSecondary: 'Voir comment ça marche',
      painTitle: 'Les défis uniques d\'un glacier artisanal',
      pains: [
        {
          title: 'Météo = montagnes russes de ventes',
          description:
            'À 35 °C vous vendez trois fois plus qu\'à 18 °C nuageux, mais à 15 °C un samedi de pluie vous jetez la moitié de la production. Sans prévision météo intégrée, les pertes s\'accumulent.',
        },
        {
          title: 'Production de parfums difficile à planifier',
          description:
            'Préparer un bac de glace prend 24 à 48h. Si vous ratez la prévision, vous êtes en rupture sur le parfum star ou vous jetez des parfums de niche jamais vendus.',
        },
        {
          title: 'Saisonnalité brutale sans vision claire',
          description:
            'Entre mai et septembre vous faites 80 % de votre chiffre annuel. Hors saison, les stocks de matières premières (lait, crème, fruits) mal calibrés immobilisent inutilement de la trésorerie.',
        },
      ],
      featuresTitle: 'Quatre piliers pour piloter votre glacier',
      features: [
        {
          title: 'Prévision météo des ventes à 48h',
          description:
            'L\'IA corrèle température, ensoleillement et humidité avec votre historique pour prédire vos ventes du lendemain et du surlendemain parfum par parfum.',
        },
        {
          title: 'Planning de production par parfum',
          description:
            'Recevez chaque matin un plan de production : combien de litres de chaque parfum préparer, en tenant compte du délai de congélation de 24-48h.',
        },
        {
          title: 'Ventes par parfum et par saison',
          description:
            'Identifiez vos tops (vanille, pistache) et flops (spéculoos hiver) et calibrez votre offre saison par saison pour maximiser la rotation.',
        },
        {
          title: 'Rentabilité matières premières',
          description:
            'Calculez le coût réel de chaque parfum (lait, crème, fruits frais, inserts) et repérez les recettes dont la marge ne justifie pas la complexité de production.',
        },
      ],
      useCasesTitle: 'Ce que gagnent les glaciers avec FoodTracks',
      useCases: [
        {
          metric: '−42%',
          title: 'Glaces jetées',
          description:
            'En alignant la production sur les prévisions météo à 48h, un glacier artisanal de bord de mer a réduit ses pertes de 42 % dès la première saison.',
        },
        {
          metric: '+€520/mois',
          title: 'Chiffre d\'affaires récupéré',
          description:
            'Plus de rupture sur les parfums phares les week-ends ensoleillés : 520 € de ventes supplémentaires par mois en saison haute récupérés grâce aux prévisions.',
        },
        {
          metric: '−25%',
          title: 'Stock matières hors saison',
          description:
            'Le pilotage des approvisionnements lait, crème et fruits entre octobre et avril réduit les immobilisations de trésorerie de 25 % sur la période creuse.',
        },
      ],
      faqTitle: 'Questions fréquentes — Glacier artisanal',
      faqs: [
        {
          question: 'FoodTracks fonctionne-t-il pour un glacier qui vend aussi des crêpes ou des gaufres ?',
          answer:
            'Oui. Vous pouvez gérer plusieurs gammes de produits (glaces, crêpes, boissons, sorbets) séparément dans le même compte et suivre les stocks de chaque gamme indépendamment.',
        },
        {
          question: 'Comment la prévision météo est-elle intégrée ?',
          answer:
            'FoodTracks récupère automatiquement les prévisions météo de votre ville (température, ensoleillement, précipitations) et les croise avec votre historique de ventes pour ajuster les quantités recommandées.',
        },
        {
          question: 'Je n\'ouvre qu\'en saison (mai-septembre). Puis-je suspendre mon abonnement ?',
          answer:
            'Oui, vous pouvez annuler votre abonnement en un clic et le rouvrir à la prochaine saison. Vos données historiques sont conservées pour que l\'IA reparte avec le contexte complet.',
        },
        {
          question: 'Quel est le tarif après l\'essai gratuit ?',
          answer:
            '9,99 € le premier mois (offre de lancement), puis 19,99 €/mois. Sans engagement, sans carte bancaire requise pour démarrer.',
        },
      ],
      footerCtaTitle: 'La météo, c\'est votre bilan. Anticipez-la.',
      footerCtaSubtitle:
        '14 jours d\'essai gratuit, puis 9,99 € le premier mois. Sans carte bancaire.',
      footerCtaPrimary: 'Démarrer mon essai gratuit',
      footerCtaSecondary: 'Voir tous les tarifs',
    },
    en: {
      title: 'Ice cream shop management software',
      metaTitle: 'Ice Cream Shop Software — Weather Forecasting Built In | FoodTracks',
      metaDescription:
        'Predict ice cream sales 48 hours ahead based on real weather data. Plan production by flavour, cut waste, never run out on a sunny Saturday. Free trial.',
      heroBadge: 'Built for artisan ice cream shops',
      heroTagline: 'Sell more on sunny days. Waste nothing when it rains.',
      heroSub:
        'FoodTracks predicts your sales 48 hours out using real temperature forecasts and tells you exactly which flavours to churn. No wasted tubs, no stockouts on a hot August weekend.',
      ctaPrimary: 'Start 14-day free trial',
      ctaSecondary: 'See how it works',
      painTitle: 'The unique challenges of an artisan ice cream shop',
      pains: [
        {
          title: 'Weather makes sales unpredictable',
          description:
            'At 35 °C you sell three times more than on a cloudy 18 °C day. A rainy Saturday can leave you throwing out half your production. Without weather-integrated forecasting, losses stack up fast.',
        },
        {
          title: 'Flavour production is hard to time',
          description:
            'A batch of ice cream takes 24–48 hours to churn and freeze. Miss the forecast and you are either out of your bestseller or discarding slow-moving niche flavours.',
        },
        {
          title: 'Seasonal swings with no clear picture',
          description:
            'May to September is 80 % of your annual revenue. Off-season, poorly calibrated stocks of milk, cream and fruit tie up cash you do not need to spend.',
        },
      ],
      featuresTitle: 'Four pillars to run a sharper ice cream shop',
      features: [
        {
          title: '48-hour weather-driven sales forecast',
          description:
            'The AI correlates temperature, sunshine and humidity with your history to predict tomorrow and the day after — flavour by flavour.',
        },
        {
          title: 'Per-flavour production planning',
          description:
            'Receive a daily churn plan each morning: how many litres of each flavour to prepare, accounting for the 24–48-hour freeze time.',
        },
        {
          title: 'Sales by flavour and season',
          description:
            'Spot your stars (vanilla, pistachio) and slow movers (speculoos in winter) and tune your seasonal offer to maximise rotation and revenue.',
        },
        {
          title: 'Ingredient cost per flavour',
          description:
            'Calculate the true cost of each flavour (milk, cream, fresh fruit, inclusions) and flag recipes whose margin no longer justifies their production complexity.',
        },
      ],
      useCasesTitle: 'What ice cream shops gain with FoodTracks',
      useCases: [
        {
          metric: '−42%',
          title: 'Wasted tubs eliminated',
          description:
            'Aligning production with 48-hour weather forecasts helped a seaside artisan glacier cut waste by 42 % in its very first season.',
        },
        {
          metric: '+€520/month',
          title: 'Revenue recovered',
          description:
            'No more stockouts on headline flavours during sunny weekends — €520 in extra monthly sales recovered during peak season.',
        },
        {
          metric: '−25%',
          title: 'Off-season ingredient stock',
          description:
            'Better milk, cream and fruit procurement planning between October and April reduces tied-up cash by 25 % over the quiet period.',
        },
      ],
      faqTitle: 'FAQ — Artisan ice cream shop',
      faqs: [
        {
          question: 'Does FoodTracks work for an ice cream shop that also sells crepes or waffles?',
          answer:
            'Yes. You can manage multiple product ranges (ice cream, crepes, drinks, sorbets) in the same account and track stock for each range independently.',
        },
        {
          question: 'How is the weather forecast integrated?',
          answer:
            'FoodTracks automatically pulls weather forecasts for your town (temperature, sunshine, precipitation) and cross-references them with your sales history to adjust recommended quantities.',
        },
        {
          question: 'I only open in season (May–September). Can I pause my subscription?',
          answer:
            'Yes — cancel in one click and reopen next season. Your historical data is preserved so the AI picks up right where it left off.',
        },
        {
          question: 'What does it cost after the free trial?',
          answer:
            '€9.99 for your first month (launch offer), then €19.99/month. No commitment and no credit card needed to start.',
        },
      ],
      footerCtaTitle: 'The weather is your P&L. Start forecasting it.',
      footerCtaSubtitle:
        '14-day free trial, then €9.99 your first month. No credit card required.',
      footerCtaPrimary: 'Start my free trial',
      footerCtaSecondary: 'See all pricing',
    },
  },

  // ─── CAFE ────────────────────────────────────────────────────────────────────
  {
    slug: 'cafe',
    vertical: 'cafe',
    iconName: 'Coffee',
    heroImage: '/verticals/cafe.jpg',
    keywords: {
      fr: [
        'logiciel café indépendant',
        'logiciel coffee shop gestion',
        'gestion stock pâtisseries café',
        'prévision affluence coffee shop',
        'logiciel café spécialité',
        'suivi ventes boissons café',
        'rentabilité coffee shop indépendant',
        'application gestion café restaurant',
        'invendus croissants gestion café',
        'outil pilotage café boissons',
      ],
      en: [
        'independent coffee shop software',
        'café management software',
        'coffee shop pastry stock management',
        'café footfall forecasting tool',
        'specialty coffee shop software',
        'café drinks sales tracker',
        'coffee shop profitability app',
        'café management application',
        'unsold pastry reduction café',
        'coffee shop operations tool',
      ],
    },
    fr: {
      title: 'Logiciel café & coffee shop indépendant',
      metaTitle: 'Logiciel coffee shop & café — Pilotez ventes et stocks | FoodTracks',
      metaDescription:
        'Prévoyez l\'affluence horaire, gérez vos stocks de pâtisseries et boissons, et calculez votre rentabilité par article. Essai 14j gratuit pour votre café.',
      heroBadge: 'Pour les cafés et coffee shops indépendants',
      heroTagline: 'Finies les vitrines vides à 9h et les croissants jetés à midi.',
      heroSub:
        'FoodTracks prédit votre affluence heure par heure, vous dit combien de croissants, cookies et lattés préparer chaque matin et suit votre marge en temps réel.',
      ctaPrimary: 'Essai 14 jours gratuit',
      ctaSecondary: 'Voir comment ça marche',
      painTitle: 'Les vraies douleurs d\'un coffee shop indépendant',
      pains: [
        {
          title: 'Pâtisseries invendues à midi',
          description:
            'Croissants, cookies, babkas — sans prévision d\'affluence matinale, vous en commandez trop et finissez par jeter entre 10 et 20 % de vos pâtisseries chaque jour.',
        },
        {
          title: 'Rupture de boissons spécialité en plein service',
          description:
            'Lait d\'avoine, sirop vanille, matcha en poudre : une rupture sur une boisson signature fait perdre des ventes et trahit l\'image de votre café.',
        },
        {
          title: 'Pic du matin difficile à staffa et calibrer',
          description:
            'Entre 8h et 9h30, tout s\'accélère. Sans données sur l\'affluence prévisionnelle, vous sur-staffez certains jours et sous-staffez d\'autres, grignotant votre masse salariale.',
        },
      ],
      featuresTitle: 'Quatre piliers pour piloter votre café',
      features: [
        {
          title: 'Prévision d\'affluence par heure',
          description:
            'L\'IA prédit votre trafic heure par heure en tenant compte de la météo, du jour de la semaine, des congés scolaires et de votre historique de transactions.',
        },
        {
          title: 'Stock pâtisseries & ingrédients boissons',
          description:
            'Suivez en temps réel vos niveaux de croissants (frais ou surgelés), de grains de café, de laits alternatifs et de sirops. Commandez au bon moment, jamais en urgence.',
        },
        {
          title: 'Ventes par boisson et heure de la journée',
          description:
            'Voyez quels lattés, cappuccinos, thés et boissons froides se vendent le mieux par tranche horaire et par jour, et ajustez votre carte en conséquence.',
        },
        {
          title: 'Rentabilité par article',
          description:
            'Comparez la marge de votre flat white maison, de vos cookies artisanaux et de vos boissons signature pour savoir quoi mettre en avant sur votre ardoise.',
        },
      ],
      useCasesTitle: 'Ce que gagnent les cafés avec FoodTracks',
      useCases: [
        {
          metric: '−38%',
          title: 'Pâtisseries invendues',
          description:
            'Un coffee shop parisien a réduit ses invendus pâtisseries de 38 % en ajustant ses commandes au fournisseur chaque veille selon la prévision d\'affluence du lendemain.',
        },
        {
          metric: '+€210/mois',
          title: 'Marge boissons améliorée',
          description:
            'En identifiant les boissons à forte marge sous-représentées en vitrine, le café a augmenté sa marge boissons de 210 € par mois sans changer ses prix.',
        },
        {
          metric: '4h/semaine',
          title: 'Temps admin économisé',
          description:
            'Les commandes fournisseurs pâtisseries et boissons sont générées automatiquement chaque dimanche soir, économisant 4 heures de gestion par semaine.',
        },
      ],
      faqTitle: 'Questions fréquentes — Café & coffee shop',
      faqs: [
        {
          question: 'FoodTracks gère-t-il les cafés qui vendent aussi des brunchs ou des déjeuners ?',
          answer:
            'Oui. Vous pouvez créer des gammes distinctes (boissons, pâtisseries, snacks salés, plats midi) et suivre les stocks et ventes de chaque gamme séparément dans le même tableau de bord.',
        },
        {
          question: 'Comment importer mes ventes si j\'utilise une caisse iPad ou SumUp ?',
          answer:
            'FoodTracks propose une intégration directe avec SumUp. Pour les autres caisses, l\'export CSV suffit. Les ventes remontent en quelques clics sans ressaisie manuelle.',
        },
        {
          question: 'La prévision d\'affluence fonctionne-t-elle dès le premier jour ?',
          answer:
            'Les premières prévisions sont disponibles dès 2 semaines de données saisies. Plus vous utilisez FoodTracks, plus le modèle apprend vos spécificités (clientèle bureau le lundi, familles le week-end, etc.).',
        },
        {
          question: 'Combien ça coûte après l\'essai gratuit ?',
          answer:
            '9,99 € le premier mois (offre lancement), puis 19,99 €/mois, sans engagement. Annulation en un clic depuis votre espace client.',
        },
      ],
      footerCtaTitle: 'Votre café mérite un pilotage aux petits oignons.',
      footerCtaSubtitle:
        '14 jours d\'essai gratuit, puis 9,99 € le premier mois. Sans carte bancaire.',
      footerCtaPrimary: 'Démarrer mon essai gratuit',
      footerCtaSecondary: 'Voir tous les tarifs',
    },
    en: {
      title: 'Coffee shop & café management software',
      metaTitle: 'Coffee Shop Software — Forecast Footfall & Cut Pastry Waste | FoodTracks',
      metaDescription:
        'Predict hourly footfall, manage pastry and drink stocks, and track per-item margin in real time. 14-day free trial for your independent café.',
      heroBadge: 'Built for independent coffee shops & cafés',
      heroTagline: 'No more empty display cases at 9 am or binned croissants at noon.',
      heroSub:
        'FoodTracks predicts your footfall hour by hour, tells you how many croissants, cookies and lattes to prepare each morning, and tracks your margin in real time.',
      ctaPrimary: 'Start 14-day free trial',
      ctaSecondary: 'See how it works',
      painTitle: 'The real headaches of running an independent coffee shop',
      pains: [
        {
          title: 'Unsold pastries piling up at noon',
          description:
            'Croissants, cookies, babka — without a morning footfall forecast, you over-order and end up discarding 10–20 % of your pastries every day.',
        },
        {
          title: 'Specialty drink stockouts mid-service',
          description:
            'Oat milk, vanilla syrup, matcha powder — running out of a signature ingredient loses sales and dents the image your café has worked hard to build.',
        },
        {
          title: 'Morning rush hard to staff and calibrate',
          description:
            'Between 8 and 9:30 am everything ramps up. Without predictive footfall data, you over-staff some days and under-staff others, eating into your payroll budget.',
        },
      ],
      featuresTitle: 'Four pillars to run a sharper café',
      features: [
        {
          title: 'Hourly footfall forecast',
          description:
            'The AI predicts traffic hour by hour using weather, day of the week, school holidays and your transaction history.',
        },
        {
          title: 'Pastry & drink ingredient stock',
          description:
            'Track croissant levels (fresh or frozen), coffee beans, alternative milks and syrups in real time. Order at the right time — never in a panic.',
        },
        {
          title: 'Sales by drink and time of day',
          description:
            'See which lattes, cappuccinos, teas and cold drinks perform best by time slot and day, then tune your menu accordingly.',
        },
        {
          title: 'Per-item profitability',
          description:
            'Compare the margin on your house flat white, artisan cookies and signature drinks to know exactly what to push on the blackboard.',
        },
      ],
      useCasesTitle: 'What coffee shops gain with FoodTracks',
      useCases: [
        {
          metric: '−38%',
          title: 'Unsold pastries cut',
          description:
            'A Paris coffee shop cut pastry waste by 38 % by adjusting its daily bakery order the evening before based on the next-day footfall forecast.',
        },
        {
          metric: '+€210/month',
          title: 'Drink margin improved',
          description:
            'Identifying high-margin drinks that were under-represented in the display raised drink margin by €210 per month — with no price changes.',
        },
        {
          metric: '4 hrs/week',
          title: 'Admin time saved',
          description:
            'Pastry and drink supplier orders generated automatically every Sunday evening save four hours of admin every week.',
        },
      ],
      faqTitle: 'FAQ — Coffee shop & café',
      faqs: [
        {
          question: 'Does FoodTracks work for cafés that also serve brunch or lunch?',
          answer:
            'Yes. Create separate ranges (drinks, pastries, savoury snacks, lunch plates) and track stock and sales for each in the same dashboard.',
        },
        {
          question: 'How do I import sales if I use an iPad till or SumUp?',
          answer:
            'FoodTracks integrates directly with SumUp. For other tills, a CSV export is all you need — sales sync in a few clicks with no manual re-entry.',
        },
        {
          question: 'Does the footfall forecast work from day one?',
          answer:
            'First forecasts are available after two weeks of data. The more you use FoodTracks, the sharper it gets — learning your crowd patterns (office crowd Monday, families at the weekend, etc.).',
        },
        {
          question: 'What does it cost after the free trial?',
          answer:
            '€9.99 for your first month (launch offer), then €19.99/month with no commitment. Cancel in one click from your account.',
        },
      ],
      footerCtaTitle: 'Your café deserves sharper management.',
      footerCtaSubtitle:
        '14-day free trial, then €9.99 your first month. No credit card required.',
      footerCtaPrimary: 'Start my free trial',
      footerCtaSecondary: 'See all pricing',
    },
  },

  // ─── MARCHÉ ──────────────────────────────────────────────────────────────────
  {
    slug: 'marche',
    vertical: 'market',
    iconName: 'Tent',
    heroImage: '/verticals/marche.jpg',
    keywords: {
      fr: [
        'logiciel marchand marché alimentaire',
        'gestion étal marché logiciel',
        'vendeur marché alimentaire application',
        'prévision quantités marché plein air',
        'logiciel gestion plusieurs marchés',
        'transport stock marché logiciel',
        'réduire invendus étal marché',
        'saisonnalité produits frais marché',
        'rentabilité marchand marché',
        'logiciel fromager charcutier marché',
      ],
      en: [
        'market stallholder management software',
        'food market stall app',
        'market trader stock management',
        'outdoor market sales forecast',
        'multi-market management software',
        'market stall transport planning tool',
        'reduce unsold market produce',
        'seasonal market produce planner',
        'market trader profitability tool',
        'cheese and charcuterie market software',
      ],
    },
    fr: {
      title: 'Logiciel pour marchand de marché alimentaire',
      metaTitle: 'Logiciel marchand de marché — Gérez vos étals | FoodTracks',
      metaDescription:
        'Préparez exactement ce qu\'il faut pour chaque marché. Suivez vos stocks, prévoyez la météo et les saisons, et réduisez vos invendus. Essai 14j gratuit.',
      heroBadge: 'Pour les marchands de marché alimentaire',
      heroTagline: 'Chargez la bonne quantité pour chaque marché, chaque semaine.',
      heroSub:
        'FoodTracks analyse la météo, le jour du marché et votre historique d\'étal pour calculer exactement quoi charger dans la camionnette. Moins de produits frais perdus, plus de marge.',
      ctaPrimary: 'Essai 14 jours gratuit',
      ctaSecondary: 'Voir comment ça marche',
      painTitle: 'Les contraintes uniques du marchand de marché',
      pains: [
        {
          title: 'Invendus de produits frais impossibles à stocker',
          description:
            'Fromage, charcuterie, poisson, légumes : ce qui n\'est pas vendu le mardi ne sera plus frais le samedi. Chaque marché raté se traduit directement en perte sèche.',
        },
        {
          title: 'Météo et jours fériés chamboulent tout',
          description:
            'Pluie = fréquentation en berne. Veille de Noël = trois fois plus de clients. Sans prévision intégrée, vous arrivez avec la mauvaise quantité trop souvent.',
        },
        {
          title: 'Plusieurs marchés, impossible de tout suivre de tête',
          description:
            'Mardi à Vincennes, jeudi à Montreuil, samedi à Nogent : gérer les stocks, les tournées et la rentabilité de chaque étal séparément sans outil dédié, c\'est épuisant.',
        },
      ],
      featuresTitle: 'Quatre piliers pour piloter vos marchés',
      features: [
        {
          title: 'Prévision de chargement par marché',
          description:
            'L\'IA prédit pour chaque jour de marché les quantités à charger (par produit), en tenant compte de la météo prévue, du marché (taille, clientèle habituée) et de votre historique.',
        },
        {
          title: 'Stock produits frais multi-étal',
          description:
            'Gérez un stock central et affectez les quantités à chaque étal avant de partir. Connaissez exactement ce qui reste après chaque marché sans refaire l\'inventaire à la main.',
        },
        {
          title: 'Ventes par marché et par produit',
          description:
            'Comparez la performance de chaque marché (chiffre d\'affaires, panier moyen, taux d\'écoulement) et concentrez votre énergie là où la rentabilité est la meilleure.',
        },
        {
          title: 'Rentabilité par tournée',
          description:
            'Calculez le coût réel de chaque tournée (carburant, achat marchandise, frais de place) et comparez la marge nette de chaque marché pour arbitrer intelligemment.',
        },
      ],
      useCasesTitle: 'Ce que gagnent les marchands avec FoodTracks',
      useCases: [
        {
          metric: '−45%',
          title: 'Produits frais invendus',
          description:
            'Un fromager sur 3 marchés a réduit ses pertes de produits frais de 45 % en calibrant ses chargements sur les prévisions météo et l\'historique de chaque étal.',
        },
        {
          metric: '+€340/mois',
          title: 'Marge nette améliorée',
          description:
            'En abandonnant un marché peu rentable (détecté grâce au comparatif de rentabilité) et en renforçant les deux autres, le marchand a gagné 340 € de marge nette par mois.',
        },
        {
          metric: '2h/semaine',
          title: 'Préparation de tournée',
          description:
            'La liste de chargement auto-générée la veille de chaque marché remplace le calcul manuel des quantités et réduit la préparation de 2 heures par semaine.',
        },
      ],
      faqTitle: 'Questions fréquentes — Marchand de marché',
      faqs: [
        {
          question: 'FoodTracks gère-t-il plusieurs marchés avec des jours différents ?',
          answer:
            'Oui. Vous pouvez créer autant d\'emplacements (marchés) que vous voulez, chacun avec ses propres jours d\'activité. Le tableau de bord consolide tous vos marchés et permet de les comparer.',
        },
        {
          question: 'Comment saisir mes ventes si je n\'ai pas de caisse électronique sur l\'étal ?',
          answer:
            'Vous pouvez saisir vos totaux en fin de marché depuis votre téléphone en moins de 3 minutes. FoodTracks a été conçu pour fonctionner même sans caisse connectée, avec une saisie rapide par produit.',
        },
        {
          question: 'La prévision tient-elle compte des marchés de Noël ou des marchés saisonniers ?',
          answer:
            'Oui. Vous pouvez signaler dans le calendrier les événements exceptionnels (fêtes, marchés spéciaux, vacances scolaires) et l\'IA les intègre dans ses prévisions de chargement.',
        },
        {
          question: 'Quel est le tarif après les 14 jours d\'essai ?',
          answer:
            '9,99 € le premier mois (offre lancement pour les 50 premiers commerces), puis 19,99 €/mois. Sans engagement, annulation en un clic.',
        },
      ],
      footerCtaTitle: 'Chargez juste. Perdez moins. Gagnez plus.',
      footerCtaSubtitle:
        '14 jours d\'essai gratuit, puis 9,99 € le premier mois. Sans carte bancaire.',
      footerCtaPrimary: 'Démarrer mon essai gratuit',
      footerCtaSecondary: 'Voir tous les tarifs',
    },
    en: {
      title: 'Food market stallholder management software',
      metaTitle: 'Market Stall Software — Load the Right Quantity Every Time | FoodTracks',
      metaDescription:
        'Know exactly what to load for each market day. Track fresh produce stock, forecast weather and seasons, and reduce unsold waste. 14-day free trial.',
      heroBadge: 'Built for food market traders',
      heroTagline: 'Load the right quantity for every market, every week.',
      heroSub:
        'FoodTracks analyses the weather, the specific market and your stall history to calculate exactly what to put in the van. Less fresh produce wasted, more margin kept.',
      ctaPrimary: 'Start 14-day free trial',
      ctaSecondary: 'See how it works',
      painTitle: 'The unique constraints of a market trader',
      pains: [
        {
          title: 'Unsold fresh produce cannot be stored',
          description:
            'Cheese, charcuterie, fish, vegetables — what does not sell on Tuesday will not be fresh on Saturday. Every unsold unit at market close is a direct loss.',
        },
        {
          title: 'Weather and bank holidays derail every plan',
          description:
            'Rain kills footfall. Christmas Eve triples it. Without a weather-integrated forecast, you arrive with the wrong quantities far too often.',
        },
        {
          title: 'Multiple markets are impossible to track in your head',
          description:
            'Tuesday in one town, Thursday in another, Saturday somewhere else — managing stock, runs and per-stall profitability without a dedicated tool is exhausting.',
        },
      ],
      featuresTitle: 'Four pillars to run your market stalls smarter',
      features: [
        {
          title: 'Per-market loading forecast',
          description:
            'The AI predicts how much of each product to load for every market day, factoring in the weather forecast, the market\'s typical footfall and your historical sell-through.',
        },
        {
          title: 'Multi-stall fresh produce stock',
          description:
            'Manage a central stock, allocate quantities to each stall before you leave, and know exactly what is left after every market — without a manual count.',
        },
        {
          title: 'Sales by market and product',
          description:
            'Compare each market\'s revenue, average basket and sell-through rate, and focus your energy where profitability is highest.',
        },
        {
          title: 'Per-run profitability',
          description:
            'Calculate the true cost of each market run (fuel, produce, pitch fee) and compare net margin across markets to make smarter decisions about where to trade.',
        },
      ],
      useCasesTitle: 'What market traders gain with FoodTracks',
      useCases: [
        {
          metric: '−45%',
          title: 'Fresh produce waste',
          description:
            'A cheesemonger trading at three markets cut fresh produce losses by 45 % by calibrating loads against weather forecasts and per-stall history.',
        },
        {
          metric: '+€340/month',
          title: 'Net margin gained',
          description:
            'Dropping a low-margin market (identified via the profitability comparison) and reinforcing the two stronger ones added €340 in net monthly margin.',
        },
        {
          metric: '2 hrs/week',
          title: 'Market prep time saved',
          description:
            'An auto-generated loading list the evening before each market replaces manual quantity calculations and cuts prep time by two hours a week.',
        },
      ],
      faqTitle: 'FAQ — Food market trader',
      faqs: [
        {
          question: 'Does FoodTracks handle multiple markets on different days?',
          answer:
            'Yes. Create as many market locations as you need, each with its own trading days. The dashboard consolidates all your markets and lets you compare them side by side.',
        },
        {
          question: 'How do I enter sales if I have no electronic till on the stall?',
          answer:
            'Enter your totals on your phone at the end of each market — it takes less than three minutes. FoodTracks is designed to work without a connected till, with quick per-product entry.',
        },
        {
          question: 'Does the forecast account for Christmas markets or seasonal events?',
          answer:
            'Yes. Flag exceptional events (holidays, special markets, school breaks) in the calendar and the AI factors them into the next loading forecast.',
        },
        {
          question: 'What does it cost after the 14-day trial?',
          answer:
            '€9.99 for your first month (launch offer for the first 50 shops), then €19.99/month. No commitment — cancel in one click.',
        },
      ],
      footerCtaTitle: 'Load right. Waste less. Earn more.',
      footerCtaSubtitle:
        '14-day free trial, then €9.99 your first month. No credit card required.',
      footerCtaPrimary: 'Start my free trial',
      footerCtaSecondary: 'See all pricing',
    },
  },
];

export function getVerticalBySlug(slug: string): VerticalConfig | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}
