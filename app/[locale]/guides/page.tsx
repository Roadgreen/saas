import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat, BookOpen, ScanLine, BarChart3, TrendingUp, MapPin, CreditCard, Package, ArrowLeft } from 'lucide-react';

const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Guides — FoodTracks' : 'Guides — FoodTracks';
  const description = isFr
    ? 'Guides pratiques pour maîtriser FoodTracks : scan de produits, gestion de stock, prédictions IA et plus.'
    : 'Practical guides to master FoodTracks: product scanning, stock management, AI predictions and more.';
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/guides`,
      languages: { fr: `${BASE_URL}/fr/guides`, en: `${BASE_URL}/en/guides` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/guides`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE_URL}/og-image.png`] },
  };
}

const GUIDES_FR = [
  {
    icon: ScanLine,
    title: 'Démarrer avec FoodTracks',
    desc: 'Créez votre compte, ajoutez vos premiers produits et configurez votre food truck en moins de 10 minutes.',
    steps: ['Créez votre compte gratuit', 'Ajoutez vos produits (scan ou manuel)', 'Configurez vos emplacements de vente', 'Lancez votre premier suivi de stock'],
  },
  {
    icon: Package,
    title: 'Gérer votre stock',
    desc: 'Apprenez à suivre votre inventaire en temps réel, scanner vos aliments et éviter le gaspillage.',
    steps: ['Scannez vos produits à réception', 'Suivez les dates de péremption', 'Recevez des alertes de stock bas', 'Consultez l\'historique des mouvements'],
  },
  {
    icon: TrendingUp,
    title: 'Prédictions IA',
    desc: 'Laissez l\'intelligence artificielle vous dire combien préparer selon le jour, la météo et l\'emplacement.',
    steps: ['Enregistrez vos ventes quotidiennes', 'Associez-les à vos emplacements', 'L\'IA analyse les tendances', 'Recevez vos prédictions pour demain'],
  },
  {
    icon: MapPin,
    title: 'Gérer vos emplacements',
    desc: 'Ajoutez vos spots de vente et comparez la rentabilité de chaque emplacement.',
    steps: ['Ajoutez vos emplacements habituels', 'Associez vos ventes par lieu', 'Comparez les performances', 'Identifiez vos meilleurs spots'],
  },
  {
    icon: BarChart3,
    title: 'Analyser vos résultats',
    desc: 'Dashboard complet avec chiffre d\'affaires, marges, tendances et comparaisons.',
    steps: ['Consultez le tableau de bord', 'Analysez vos marges par produit', 'Suivez l\'évolution semaine/mois', 'Exportez vos rapports'],
  },
  {
    icon: CreditCard,
    title: 'Connecter SumUp',
    desc: 'Synchronisez votre terminal SumUp pour importer automatiquement vos ventes.',
    steps: ['Allez dans Intégrations', 'Connectez votre compte SumUp', 'Les ventes s\'importent automatiquement', 'Retrouvez-les dans votre dashboard'],
  },
];

const GUIDES_EN = [
  {
    icon: ScanLine,
    title: 'Getting started with FoodTracks',
    desc: 'Create your account, add your first products, and set up your food truck in under 10 minutes.',
    steps: ['Create your free account', 'Add your products (scan or manual)', 'Set up your selling locations', 'Start your first stock tracking'],
  },
  {
    icon: Package,
    title: 'Manage your stock',
    desc: 'Learn to track your inventory in real time, scan your products, and avoid waste.',
    steps: ['Scan products on receipt', 'Track expiry dates', 'Get low stock alerts', 'View movement history'],
  },
  {
    icon: TrendingUp,
    title: 'AI predictions',
    desc: 'Let AI tell you how much to prepare based on the day, weather, and location.',
    steps: ['Record your daily sales', 'Link them to your locations', 'AI analyzes the trends', 'Get your predictions for tomorrow'],
  },
  {
    icon: MapPin,
    title: 'Manage your locations',
    desc: 'Add your selling spots and compare the profitability of each location.',
    steps: ['Add your usual locations', 'Associate sales by location', 'Compare performance', 'Identify your best spots'],
  },
  {
    icon: BarChart3,
    title: 'Analyze your results',
    desc: 'Full dashboard with revenue, margins, trends, and comparisons.',
    steps: ['Check the dashboard', 'Analyze margins per product', 'Track week/month trends', 'Export your reports'],
  },
  {
    icon: CreditCard,
    title: 'Connect SumUp',
    desc: 'Sync your SumUp terminal to automatically import your sales.',
    steps: ['Go to Integrations', 'Connect your SumUp account', 'Sales are imported automatically', 'Find them in your dashboard'],
  },
];

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const guides = isFr ? GUIDES_FR : GUIDES_EN;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Guides' : 'Guides', item: `${BASE_URL}/${locale}/guides` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isFr ? 'Guides pratiques FoodTracks' : 'FoodTracks Practical Guides',
    description: isFr
      ? 'Guides pour maîtriser FoodTracks et optimiser la gestion de votre food truck.'
      : 'Guides to master FoodTracks and optimize your food truck management.',
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: guide.title,
      description: guide.desc,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-lg">FoodTracks</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          {isFr ? 'Retour à l\'accueil' : 'Back to home'}
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-6">
            <BookOpen className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {isFr ? 'Guides pratiques' : 'Practical guides'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isFr
              ? 'Tout ce qu\'il faut pour maîtriser FoodTracks et optimiser la gestion de votre food truck.'
              : 'Everything you need to master FoodTracks and optimize your food truck management.'}
          </p>
        </div>

        <div className="space-y-8">
          {guides.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <div key={i} className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
                    <p className="text-gray-600 mb-4">{guide.desc}</p>
                    <ol className="space-y-2">
                      {guide.steps.map((step, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                            {j + 1}
                          </span>
                          <span className="text-sm text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {isFr
              ? 'Besoin d\'aide supplémentaire ?'
              : 'Need more help?'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFr ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center justify-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              {isFr ? 'Lire le blog' : 'Read the blog'}
            </Link>
            <Link
              href={`/${locale}/support`}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {isFr ? 'Contacter le support' : 'Contact support'}
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
