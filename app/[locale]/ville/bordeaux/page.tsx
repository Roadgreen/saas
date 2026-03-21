import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star, Waves,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const TEAL   = '#14B8A6';
const DARK   = '#0D0905';
const GREEN  = '#22C55E';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Logiciel Gestion Food Truck Bordeaux — Quais & Événements'
    : 'Food Truck Management Software Bordeaux — Quays & Events';
  const description = isFr
    ? 'Gérez votre food truck à Bordeaux avec FoodTracks : gestion de stock, prédictions IA adaptées aux événements des quais et à l\'agenda bordelais. Plan gratuit disponible.'
    : 'Manage your Bordeaux food truck with FoodTracks: inventory management, AI predictions adapted to riverside events and Bordeaux\'s agenda. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Bordeaux',
          'application food truck Bordeaux',
          'gestion stock food truck Bordeaux',
          'prédictions ventes food truck Bordeaux',
          'logiciel restauration mobile Bordeaux',
          'food truck Nouvelle-Aquitaine',
        ]
      : [
          'food truck management software Bordeaux',
          'food truck app Bordeaux',
          'food truck inventory Bordeaux',
          'food truck sales forecasting Bordeaux',
          'mobile catering software Bordeaux France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/bordeaux`,
      languages: {
        fr: `${BASE_URL}/fr/ville/bordeaux`,
        en: `${BASE_URL}/en/ville/bordeaux`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/bordeaux`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Bordeaux' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group" style={{ borderBottom: '1px solid #EDEBE8' }}>
      <summary className="w-full flex items-center justify-between py-7 text-left gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-orange-600 transition-colors duration-200">
          {question}
        </span>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-open:bg-orange-50 bg-gray-50 transition-all">
          <ChevronDown className="h-4 w-4 text-gray-400 group-open:text-orange-500 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <p className="pb-8 text-sm md:text-base leading-[1.8] max-w-2xl text-gray-500">{answer}</p>
    </details>
  );
}

export default async function BordeauxFoodTruckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  /* ── Schema.org ──────────────────────────────────────── */
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FoodTracks — Bordeaux',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Bordeaux et en région Nouvelle-Aquitaine.'
      : 'Management software for food trucks operating in Bordeaux and the Nouvelle-Aquitaine region.',
    url: `${BASE_URL}/${locale}/ville/bordeaux`,
    areaServed: {
      '@type': 'City',
      name: 'Bordeaux',
      sameAs: 'https://www.wikidata.org/wiki/Q1479',
    },
    brand: { '@type': 'Brand', name: 'FoodTracks' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: isFr ? 'Plan gratuit disponible' : 'Free plan available',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/bordeaux` },
      { '@type': 'ListItem', position: 3, name: 'Bordeaux', item: `${BASE_URL}/${locale}/ville/bordeaux` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs emplacements pour un food truck à Bordeaux ?',
          a: 'Bordeaux offre des emplacements stratégiques très prisés : les quais de la Garonne (Quai des Marques, Darwin Écosystème), la Place de la Victoire, le quartier Saint-Pierre, et les nombreux événements organisés autour du lac de Bordeaux. La ville est piétonne dans son centre historique classé UNESCO, ce qui crée des flux piétons exceptionnels propices à la street food.',
        },
        {
          q: 'Comment gérer les événements saisonniers à Bordeaux avec un food truck ?',
          a: 'Bordeaux est une ville d\'événements : Bordeaux Fête le Vin (juin), les Fêtes du Fleuve, Darwin Événements, les concerts de la Rock School Barbey, et le marché des Capucins. FoodTracks intègre ces pics dans ses prédictions IA pour vous permettre d\'anticiper vos commandes fournisseurs et de vous positionner aux bons endroits aux bons moments.',
        },
        {
          q: 'Comment optimiser son stock avec la forte culture viticole bordelaise ?',
          a: 'Les Bordelais ont un goût prononcé pour la qualité alimentaire, fort de leur culture gastronomique et viticole. FoodTracks vous aide à identifier les produits premium qui se vendent le mieux à Bordeaux, à mesurer vos marges par produit et à synchroniser vos approvisionnements avec les producteurs locaux de Nouvelle-Aquitaine.',
        },
        {
          q: 'FoodTracks est-il adapté aux food trucks des quais de Bordeaux ?',
          a: 'Oui. Les quais de la Garonne connaissent une forte affluence lors des belles journées et des événements, mais l\'activité peut être très différente par temps de pluie. FoodTracks prédit la demande en tenant compte des prévisions météo locales, vous permettant d\'ajuster vos quantités de façon précise et de réduire le gaspillage.',
        },
        {
          q: 'Comment profiter du dynamisme de Darwin Écosystème pour mon food truck ?',
          a: 'Darwin est un des lieux food truck les plus populaires de Bordeaux, avec une clientèle jeune et exigeante. FoodTracks vous permet de suivre vos performances par emplacement, de comparer vos ventes Darwin versus autres spots, et d\'ajuster votre offre selon les préférences du public de chaque lieu.',
        },
      ]
    : [
        {
          q: 'What are the best locations for a food truck in Bordeaux?',
          a: 'Bordeaux offers prime strategic spots: the Garonne quays (Quai des Marques, Darwin Ecosystème), Place de la Victoire, the Saint-Pierre quarter, and the many events around Lac de Bordeaux. The city has a pedestrianised UNESCO-listed historic centre, creating exceptional foot traffic ideal for street food.',
        },
        {
          q: 'How do I manage seasonal events in Bordeaux with a food truck?',
          a: 'Bordeaux is an events city: Bordeaux Fête le Vin (June), Fêtes du Fleuve, Darwin Events, Rock School Barbey concerts, and the Marché des Capucins. FoodTracks integrates these peaks into its AI predictions so you can anticipate supplier orders and position yourself at the right spots at the right times.',
        },
        {
          q: 'How do I optimise stock given Bordeaux\'s strong wine culture?',
          a: 'Bordelais have a strong taste for food quality, shaped by their gastronomic and wine culture. FoodTracks helps you identify premium products that sell best in Bordeaux, measure margins by product and synchronise supplies with local Nouvelle-Aquitaine producers.',
        },
        {
          q: 'Is FoodTracks suited to food trucks on the Bordeaux quays?',
          a: 'Yes. The Garonne quays see strong footfall on sunny days and during events, but activity can vary greatly in wet weather. FoodTracks predicts demand factoring in local weather forecasts, letting you adjust quantities accurately and reduce waste.',
        },
        {
          q: 'How do I capitalise on Darwin Écosystème\'s dynamism for my food truck?',
          a: 'Darwin is one of Bordeaux\'s most popular food truck venues, with a young and discerning crowd. FoodTracks lets you track performance by location, compare Darwin sales versus other spots, and adjust your offering based on each venue\'s audience preferences.',
        },
      ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const benefits = [
    {
      icon: <Waves className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions quais & événements' : 'Quays & events forecasting',
      desc: isFr
        ? 'Anticipez les flux sur les quais de la Garonne selon la météo, les événements et la saison touristique.'
        : 'Anticipate footfall on the Garonne quays based on weather, events and tourist season.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Analyse par emplacement' : 'Location-by-location analysis',
      desc: isFr
        ? 'Comparez Darwin, les quais, les marchés — identifiez vos spots les plus rentables et optimisez votre planning.'
        : 'Compare Darwin, quays, markets — identify your most profitable spots and optimise your schedule.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro gaspillage' : 'Zero waste',
      desc: isFr
        ? 'Prédictions météo intégrées pour ajuster vos quantités et ne jamais sur-stocker les jours de faible affluence.'
        : 'Integrated weather forecasting to adjust quantities and never overstock on low-footfall days.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Marges & rentabilité' : 'Margins & profitability',
      desc: isFr
        ? 'Suivez la rentabilité de chaque produit pour optimiser votre carte aux standards de la culture bordelaise.'
        : 'Track profitability per product to optimise your menu to Bordeaux\'s quality standards.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan fournisseurs locaux' : 'Local supplier scanning',
      desc: isFr
        ? 'Factures des producteurs de Nouvelle-Aquitaine scannées en quelques secondes pour une mise à jour instantanée du stock.'
        : 'Invoices from Nouvelle-Aquitaine producers scanned in seconds for instant inventory updates.',
    },
    {
      icon: <Star className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Gratuit pour démarrer' : 'Free to start',
      desc: isFr
        ? 'Plan gratuit complet, sans carte de crédit. Idéal pour les food truckers bordelais qui débutent.'
        : 'Full free plan, no credit card. Ideal for Bordeaux food truckers just starting out.',
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LandingHeader />

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-36"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(249,115,22,0.14) 0%, transparent 50%),
                       radial-gradient(ellipse 80% 60% at 100% 75%, rgba(20,184,166,0.10) 0%, transparent 50%),
                       #07111E`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: '#6B7280' }}>
              <Link href={`/${locale}`} className="hover:text-white transition-colors">FoodTracks</Link>
              <span>/</span>
              <span style={{ color: ORANGE }}>Bordeaux</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Bordelais' : 'Bordeaux Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Bordeaux</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Bordeaux</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Prédictions IA adaptées aux quais de la Garonne, à Darwin et aux événements bordelais. Réduisez le gaspillage et maximisez vos ventes sur chaque emplacement.'
                : 'AI predictions adapted to the Garonne quays, Darwin and Bordeaux events. Cut waste and maximise sales at every location.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4 text-white text-base"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.4)' }}
                >
                  <Package className="h-4 w-4" />
                  {isFr ? 'Démarrer gratuitement' : 'Start for free'}
                </button>
              </Link>
              <a href="#fonctionnalites">
                <button
                  className="btn-landing btn-outline-dark inline-flex items-center justify-center rounded-full font-semibold px-10 py-4 border text-base"
                  style={{ borderColor: 'rgba(249,115,22,0.25)', color: '#D1D5DB', backgroundColor: 'transparent' }}
                >
                  {isFr ? 'Voir les fonctionnalités' : 'See features'}
                </button>
              </a>
            </div>

            <p className="text-sm" style={{ color: '#6B7280' }}>
              {isFr ? 'Gratuit · Sans carte de crédit · Sans engagement' : 'Free · No credit card · No commitment'}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LOCAL CONTEXT
          ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-2xl p-8 md:p-12"
              style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDEBE8' }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="p-3 rounded-xl shrink-0"
                  style={{ backgroundColor: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.20)' }}
                >
                  <Waves className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Bordeaux : quais, événements et exigence gastronomique' : 'Bordeaux: quays, events and gastronomic excellence'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Bordeaux est une ville en pleine transformation, dont le centre historique classé UNESCO attire chaque année plus de 6 millions de visiteurs. Les quais de la Garonne, réaménagés en espace piéton et de loisirs, sont devenus le lieu de référence pour la street food bordelaise. Darwin Écosystème, les fêtes du fleuve, les marchés nocturnes et les concerts créent des pics d\'activité intenses. L\'enjeu : être là au bon moment, avec le bon stock. FoodTracks vous donne les prédictions et les outils pour ne jamais rater une opportunité.'
                      : 'Bordeaux is a city in full transformation, whose UNESCO-listed historic centre attracts over 6 million visitors per year. The Garonne quays, redesigned as a pedestrian and leisure space, have become the reference location for Bordeaux street food. Darwin Ecosystème, river festivals, night markets and concerts create intense activity peaks. The challenge: being in the right place at the right time, with the right stock. FoodTracks gives you the predictions and tools to never miss an opportunity.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '6M+',
                    label: isFr ? 'visiteurs / an' : 'visitors / year',
                    sub: isFr ? 'Centre UNESCO très fréquenté' : 'Highly visited UNESCO centre',
                  },
                  {
                    stat: '50+',
                    label: isFr ? 'événements annuels' : 'annual events',
                    sub: isFr ? 'Quais, festivals, marchés' : 'Quays, festivals, markets',
                  },
                  {
                    stat: '5e',
                    label: isFr ? 'ville de France' : 'city in France',
                    sub: isFr ? 'Marché food truck en forte croissance' : 'Rapidly growing food truck market',
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="font-jakarta text-4xl font-extrabold mb-1" style={{ color: ORANGE }}>
                      {item.stat}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENEFITS
          ══════════════════════════════════════ */}
      <section id="fonctionnalites" className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {isFr
                ? 'Tout ce dont votre food truck bordelais a besoin'
                : 'Everything your Bordeaux food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme conçue pour les défis uniques de la scène street food bordelaise.'
                : 'A platform designed for the unique challenges of Bordeaux\'s street food scene.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-7 space-y-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {b.icon}
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTERNAL LINKS
          ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-4">{isFr ? 'Fonctionnalités clés' : 'Key features'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/fonctionnalites/gestion-stock`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Gestion de stock en temps réel' : 'Real-time inventory management'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/predictions-ventes`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Prédictions de ventes IA' : 'AI sales forecasting'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/scan-factures`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Scan de factures' : 'Invoice scanning'}
              </Link>
              <Link
                href={`/${locale}/ville/paris`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Paris' : 'FoodTracks in Paris'}
              </Link>
              <Link
                href={`/${locale}/ville/lyon`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Lyon' : 'FoodTracks in Lyon'}
              </Link>
              <Link
                href={`/${locale}/ville/marseille`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Marseille' : 'FoodTracks in Marseille'}
              </Link>
              <Link
                href={`/${locale}/ville/nantes`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Nantes' : 'FoodTracks in Nantes'}
              </Link>
              <Link
                href={`/${locale}/ville/toulouse`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Toulouse' : 'FoodTracks in Toulouse'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
              {isFr ? 'Questions fréquentes — Bordeaux' : 'FAQ — Bordeaux'}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {faqData.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════ */}
      <section
        className="relative py-28 md:py-36 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto space-y-10">
            <h2 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Bordeaux</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Bordeaux</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers bordelais qui utilisent FoodTracks pour gérer leur stock et maximiser leurs ventes sur les quais et les événements.'
                : 'Join Bordeaux food truckers using FoodTracks to manage their inventory and maximise sales on the quays and at events.'}
            </p>
            <div className="flex flex-col items-center gap-6">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-14 py-5 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
                >
                  <ArrowRight className="h-5 w-5" />
                  {isFr ? 'Commencer gratuitement' : 'Get started free'}
                </button>
              </Link>
              <p className="text-sm text-white/70">
                {isFr ? 'Gratuit · Sans carte de crédit' : 'Free · No credit card'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer
        className="py-12 relative"
        style={{ backgroundColor: '#070503', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
              <span className="font-jakarta text-lg font-bold text-white tracking-tight">FoodTracks</span>
            </Link>
            <div className="flex items-center gap-6 text-sm" style={{ color: '#4B5563' }}>
              <Link href={`/${locale}/pricing`} className="hover:text-gray-300 transition-colors">{isFr ? 'Tarifs' : 'Pricing'}</Link>
              <Link href={`/${locale}/blog`} className="hover:text-gray-300 transition-colors">Blog</Link>
              <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
            </div>
            <p className="text-xs" style={{ color: '#374151' }}>
              © {new Date().getFullYear()} FoodTracks
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
