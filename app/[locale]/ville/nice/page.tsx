import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star,
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
    ? 'Logiciel Gestion Food Truck Nice — Stock & Prédictions IA | FoodTracks'
    : 'Food Truck Management Software Nice — Inventory & AI Forecasting | FoodTracks';
  const description = isFr
    ? 'Gérez votre food truck à Nice avec FoodTracks : gestion de stock en temps réel, prédictions IA adaptées à la Côte d\'Azur, au Carnaval de Nice et au tourisme estival. Plan gratuit disponible.'
    : 'Manage your Nice food truck with FoodTracks: real-time inventory, AI predictions adapted to the Côte d\'Azur, Nice Carnival and summer tourism. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Nice',
          'application food truck Nice',
          'gestion stock food truck Nice',
          'food truck Côte d\'Azur',
          'food truck Carnaval Nice',
          'food truck PACA',
          'food truck Alpes-Maritimes',
        ]
      : [
          'food truck management software Nice',
          'food truck app Nice',
          'food truck inventory Nice',
          'food truck Côte d\'Azur',
          'food truck Nice Carnival',
          'mobile catering software Nice France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/nice`,
      languages: {
        fr: `${BASE_URL}/fr/ville/nice`,
        en: `${BASE_URL}/en/ville/nice`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/nice`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Nice' }],
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

export default async function NiceFoodTruckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FoodTracks — Nice',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Nice et sur la Côte d\'Azur.'
      : 'Management software for food trucks operating in Nice and on the Côte d\'Azur.',
    url: `${BASE_URL}/${locale}/ville/nice`,
    areaServed: {
      '@type': 'City',
      name: 'Nice',
      sameAs: 'https://www.wikidata.org/wiki/Q33959',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/nice` },
      { '@type': 'ListItem', position: 3, name: 'Nice', item: `${BASE_URL}/${locale}/ville/nice` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Comment gérer le Carnaval de Nice avec FoodTracks ?',
          a: 'Le Carnaval de Nice est l\'un des plus grands carnavals du monde avec plus d\'un million de visiteurs sur 3 semaines en février. FoodTracks anticipe ce pic majeur grâce à ses prédictions IA : vous recevez des alertes de réapprovisionnement plusieurs semaines à l\'avance. Que vous soyez sur le Cours Saleya ou le long du défilé, vous n\'êtes jamais en rupture de stock pendant cet événement clé.',
        },
        {
          q: 'Quels sont les meilleurs emplacements food truck à Nice ?',
          a: 'Nice offre des spots très prisés : le Cours Saleya (marché historique), la Promenade des Anglais pour les touristes et joggeurs, le Vieux-Nice pour la clientèle locale, les plages privées en été, et le quartier de l\'Arenas pour la clientèle d\'affaires. FoodTracks analyse vos ventes par emplacement pour identifier vos spots les plus rentables selon la saison.',
        },
        {
          q: 'Comment FoodTracks gère-t-il la forte saisonnalité de la Côte d\'Azur ?',
          a: 'Nice connaît une saisonnalité marquée : la haute saison estivale (juin-août) avec 5 millions de touristes, le printemps avec le Festival de Cannes voisin et les événements nautiques, et l\'hiver avec le Carnaval. FoodTracks intègre cette saisonnalité dans ses prédictions IA pour que vous adaptiez vos stocks et votre offre tout au long de l\'année sans improviser.',
        },
        {
          q: 'FoodTracks est-il adapté aux food trucks qui changent d\'emplacement sur la Riviera ?',
          a: 'Oui, c\'est exactement pour cela qu\'il a été conçu. Si vous alternez entre Nice, Cannes, Monaco, Antibes ou Menton selon les événements — MIPIM, Grand Prix de Monaco, Cannes Lions — FoodTracks gère tous vos emplacements, synchronise votre stock central et prédit la demande pour chaque destination.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck niçois ?',
          a: 'FoodTracks propose un plan gratuit complet sans carte de crédit. Les plans payants incluent les prédictions IA avancées adaptées à la saisonnalité azuréenne, le scan de factures illimité et le support prioritaire. Parfait pour le food trucker indépendant sur la Promenade comme pour une flotte couvrant toute la Riviera.',
        },
      ]
    : [
        {
          q: 'How does FoodTracks help manage the Nice Carnival?',
          a: 'The Nice Carnival is one of the world\'s largest carnivals with over a million visitors across 3 weeks in February. FoodTracks anticipates this major peak through AI predictions: you receive restocking alerts several weeks in advance. Whether you are on Cours Saleya or along the parade route, you are never out of stock during this key event.',
        },
        {
          q: 'What are the best food truck locations in Nice?',
          a: 'Nice offers highly sought-after spots: Cours Saleya (historic market), Promenade des Anglais for tourists and joggers, Vieux-Nice for local clientele, private beaches in summer, and the Arenas business district. FoodTracks analyses your sales by location to identify your most profitable spots by season.',
        },
        {
          q: 'How does FoodTracks handle the strong seasonality of the Côte d\'Azur?',
          a: 'Nice experiences pronounced seasonality: peak summer (June-August) with 5 million tourists, spring with the neighbouring Cannes Film Festival and nautical events, and winter with the Carnival. FoodTracks integrates this seasonality into its AI predictions so you adapt your stock and offer throughout the year without improvising.',
        },
        {
          q: 'Is FoodTracks suited to food trucks that move between Riviera locations?',
          a: 'Yes, that is exactly what it was built for. If you alternate between Nice, Cannes, Monaco, Antibes or Menton depending on events — MIPIM, Monaco Grand Prix, Cannes Lions — FoodTracks manages all your locations, syncs your central inventory and predicts demand for each destination.',
        },
        {
          q: 'How much does FoodTracks cost for a Nice food truck?',
          a: 'FoodTracks offers a full free plan with no credit card required. Paid plans include advanced AI predictions tailored to Riviera seasonality, unlimited invoice scanning, and priority support. Perfect for a solo operator on the Promenade or a fleet covering the entire Riviera.',
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
      icon: <MapPin className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Multi-emplacements Riviera' : 'Multi-location Riviera coverage',
      desc: isFr
        ? 'Nice, Cannes, Antibes, Monaco, Menton — gérez tous vos spots Côte d\'Azur avec un stock centralisé et des prédictions par lieu.'
        : 'Nice, Cannes, Antibes, Monaco, Menton — manage all your Côte d\'Azur spots with centralised inventory and per-location forecasts.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions tourisme & Carnaval' : 'Tourism & Carnival forecasting',
      desc: isFr
        ? 'L\'IA anticipe le Carnaval, les 5 millions de touristes estivaux et les grands événements azuréens pour que vous soyez toujours prêt.'
        : 'AI anticipates the Carnival, 5 million summer tourists, and major Riviera events so you are always prepared.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro rupture de stock' : 'Zero stockouts',
      desc: isFr
        ? 'Alertes proactives avant les plages bondées de l\'été et les événements de prestige de la Riviera pour ne jamais manquer d\'ingrédients.'
        : 'Proactive alerts before packed summer beaches and prestigious Riviera events so you never run out of key ingredients.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse de rentabilité' : 'Profitability analysis',
      desc: isFr
        ? 'Identifiez vos produits et emplacements les plus rentables pour optimiser votre offre entre haute et basse saison azuréenne.'
        : 'Identify your most profitable products and locations to optimise your offer between high and low seasons on the Riviera.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan de factures fournisseurs' : 'Supplier invoice scanning',
      desc: isFr
        ? 'Scannez vos factures en quelques secondes — idéal pour gérer vos approvisionnements auprès des fournisseurs locaux de la région PACA.'
        : 'Scan invoices in seconds — ideal for managing supply from local PACA region producers.',
    },
    {
      icon: <Star className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Plan gratuit sans limite de temps' : 'Unlimited free plan',
      desc: isFr
        ? 'Commencez gratuitement sans carte de crédit. Évoluez vers le plan Pro quand votre activité grandit.'
        : 'Start free with no credit card. Upgrade to Pro as your business grows.',
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LandingHeader />

      {/* HERO */}
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
              <span style={{ color: ORANGE }}>Nice</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Côte d\'Azur' : 'Côte d\'Azur Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Nice</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Nice</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées à la Côte d\'Azur, au Carnaval de Nice et aux 5 millions de touristes estivaux. Réduisez le gaspillage et maximisez vos ventes toute l\'année.'
                : 'Real-time inventory, AI predictions adapted to the Côte d\'Azur, Nice Carnival, and 5 million summer tourists. Cut waste and maximise sales all year round.'}
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

      {/* LOCAL CONTEXT */}
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
                  style={{ backgroundColor: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)' }}
                >
                  <MapPin className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Nice et la Côte d\'Azur : tourisme intense et saisonnalité extrême' : 'Nice and the Côte d\'Azur: intense tourism and extreme seasonality'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Cinquième ville de France et première destination touristique nationale, Nice cumule 5 millions de touristes en été, un Carnaval mondial en hiver, et une clientèle d\'affaires internationale toute l\'année grâce aux salons du Palais des Congrès et à la proximité de Monaco. Pour un food trucker, cette richesse représente une opportunité unique — mais aussi un défi de gestion : comment commander la bonne quantité quand la fréquentation peut varier de 1 à 10 selon le mois ? FoodTracks résout ce problème avec des prédictions IA qui intègrent la saisonnalité azuréenne, la météo méditerranéenne et le calendrier événementiel de la Riviera.'
                      : 'France\'s fifth city and top domestic tourist destination, Nice combines 5 million summer tourists, a world-famous Carnival in winter, and international business clientele year-round thanks to the Palais des Congrès exhibitions and proximity to Monaco. For a food truck operator, this richness represents a unique opportunity — but also a management challenge: how do you order the right quantity when footfall can vary tenfold by month? FoodTracks solves this with AI predictions that integrate Riviera seasonality, Mediterranean weather, and the event calendar.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '5M',
                    label: isFr ? 'touristes estivaux' : 'summer tourists',
                    sub: isFr ? 'Pic juin-août à anticiper' : 'June-August peak to plan for',
                  },
                  {
                    stat: '1M+',
                    label: isFr ? 'visiteurs Carnaval' : 'Carnival visitors',
                    sub: isFr ? 'En 3 semaines en février' : 'In 3 weeks in February',
                  },
                  {
                    stat: '10×',
                    label: isFr ? 'variation saisonnière' : 'seasonal variation',
                    sub: isFr ? 'Été vs hiver à gérer' : 'Summer vs winter to manage',
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

      {/* BENEFITS */}
      <section id="fonctionnalites" className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {isFr
                ? 'Tout ce dont votre food truck azuréen a besoin'
                : 'Everything your Côte d\'Azur food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour la saisonnalité méditerranéenne et les événements de la Riviera.'
                : 'A complete platform, designed for Mediterranean seasonality and Riviera events.'}
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

      {/* INTERNAL LINKS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-4">{isFr ? 'Fonctionnalités clés' : 'Key features'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/fonctionnalites/gestion-stock`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Gestion de stock en temps réel' : 'Real-time inventory management'}
              </Link>
              <Link href={`/${locale}/fonctionnalites/predictions-ventes`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Prédictions de ventes IA' : 'AI sales forecasting'}
              </Link>
              <Link href={`/${locale}/fonctionnalites/scan-factures`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Scan de factures' : 'Invoice scanning'}
              </Link>
              <Link href={`/${locale}/ville/marseille`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Marseille' : 'FoodTracks in Marseille'}
              </Link>
              <Link href={`/${locale}/ville/strasbourg`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Strasbourg' : 'FoodTracks in Strasbourg'}
              </Link>
              <Link href={`/${locale}/ville/paris`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Paris' : 'FoodTracks in Paris'}
              </Link>
              <Link href={`/${locale}/ville/lyon`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'FoodTracks à Lyon' : 'FoodTracks in Lyon'}
              </Link>
              <Link href={`/${locale}/guides/seuil-rentabilite-food-truck`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Calcul du seuil de rentabilité food truck' : 'Food truck break-even calculation'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
              {isFr ? 'Questions fréquentes — Nice' : 'FAQ — Nice'}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {faqData.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Nice</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Nice</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers azuréens qui utilisent FoodTracks pour anticiper le Carnaval, gérer le tourisme estival et vendre plus toute l\'année sur la Riviera.'
                : 'Join Riviera food truckers using FoodTracks to anticipate the Carnival, manage summer tourism, and sell more all year round on the Côte d\'Azur.'}
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

      {/* FOOTER */}
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
