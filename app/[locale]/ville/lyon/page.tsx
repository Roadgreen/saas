import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star, UtensilsCrossed,
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
    ? 'Logiciel Gestion Food Truck Lyon — Gastronomie & Festivals | FoodTracks'
    : 'Food Truck Management Software Lyon — Gastronomy & Festivals | FoodTracks';
  const description = isFr
    ? 'Gérez votre food truck à Lyon avec FoodTracks : gestion de stock, prédictions IA adaptées à la scène gastronomique lyonnaise et aux festivals. Plan gratuit disponible.'
    : 'Manage your Lyon food truck with FoodTracks: inventory management, AI predictions adapted to Lyon\'s gastronomy scene and festivals. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Lyon',
          'application food truck Lyon',
          'gestion stock food truck Lyon',
          'prédictions ventes food truck Lyon',
          'logiciel restauration mobile Lyon',
          'food truck Auvergne-Rhône-Alpes',
        ]
      : [
          'food truck management software Lyon',
          'food truck app Lyon',
          'food truck inventory Lyon',
          'food truck sales forecasting Lyon',
          'mobile catering software Lyon France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/lyon`,
      languages: {
        fr: `${BASE_URL}/fr/ville/lyon`,
        en: `${BASE_URL}/en/ville/lyon`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/lyon`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Lyon' }],
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

export default async function LyonFoodTruckPage({
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
    name: 'FoodTracks — Lyon',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Lyon et en région Auvergne-Rhône-Alpes.'
      : 'Management software for food trucks operating in Lyon and the Auvergne-Rhône-Alpes region.',
    url: `${BASE_URL}/${locale}/ville/lyon`,
    areaServed: {
      '@type': 'City',
      name: 'Lyon',
      sameAs: 'https://www.wikidata.org/wiki/Q456',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/lyon` },
      { '@type': 'ListItem', position: 3, name: 'Lyon', item: `${BASE_URL}/${locale}/ville/lyon` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs événements pour un food truck à Lyon ?',
          a: 'Lyon est l\'une des capitales gastronomiques mondiales avec des événements incontournables : les Nuits de Fourvière (juin-juillet), le Sirha (salon international de l\'hôtellerie-restauration), la Fête des Lumières en décembre, et de nombreux festivals estivaux sur les quais de Saône. FoodTracks intègre ces pics d\'activité dans ses prédictions pour vous éviter de manquer d\'ingrédients.',
        },
        {
          q: 'Comment gérer la forte culture gastronomique lyonnaise avec un food truck ?',
          a: 'Lyon exige une qualité irréprochable. FoodTracks vous aide à tracer la fraîcheur de vos ingrédients, à suivre la rotation des stocks et à identifier les produits les plus rentables. Vous pouvez ainsi proposer une carte courte mais impeccable, fidèle aux exigences des bouchons lyonnais transposées au format street food.',
        },
        {
          q: 'FoodTracks aide-t-il à gérer les food trucks sur les Quais de Saône ?',
          a: 'Oui. Les quais de Saône, la Confluence et les berges du Rhône sont des emplacements très variables selon la météo et les événements. FoodTracks prédit vos ventes en tenant compte des conditions météorologiques locales et de l\'agenda culturel lyonnais, vous permettant d\'ajuster vos approvisionnements en conséquence.',
        },
        {
          q: 'Comment optimiser mes marges dans un marché gastronomique exigeant comme Lyon ?',
          a: 'FoodTracks calcule vos marges en temps réel par produit et par service. À Lyon, où les clients ont une culture gastronomique forte, identifier vos meilleurs produits en termes de rentabilité est essentiel. Les rapports FoodTracks vous indiquent exactement quoi conserver, quoi retirer et où concentrer vos investissements en ingrédients de qualité.',
        },
        {
          q: 'FoodTracks est-il compatible avec les équipements de caisse utilisés à Lyon ?',
          a: 'FoodTracks s\'intègre avec SumUp et peut importer des données de ventes depuis d\'autres sources. Le scan de factures fonctionne avec tous les fournisseurs lyonnais — grossistes de Rungis Lyon, MIN de Lyon ou producteurs locaux — quelle que soit leur mise en forme.',
        },
      ]
    : [
        {
          q: 'What are the best events for a food truck in Lyon?',
          a: 'Lyon is one of the world\'s gastronomic capitals with must-attend events: Nuits de Fourvière (June-July), Sirha (international hospitality trade show), Fête des Lumières in December, and numerous summer festivals along the Saône riverbanks. FoodTracks integrates these activity peaks into its predictions so you never run short of ingredients.',
        },
        {
          q: 'How do I handle Lyon\'s strong gastronomic culture with a food truck?',
          a: 'Lyon demands flawless quality. FoodTracks helps you trace ingredient freshness, monitor stock rotation and identify your most profitable products. You can offer a short but impeccable menu, in keeping with the standards of Lyon\'s famous bouchons translated to street food format.',
        },
        {
          q: 'Does FoodTracks help manage food trucks on the Saône Quais?',
          a: 'Yes. The Saône quays, Confluence and Rhône riverbanks are highly variable locations depending on weather and events. FoodTracks predicts your sales accounting for local weather conditions and Lyon\'s cultural calendar, letting you adjust supplies accordingly.',
        },
        {
          q: 'How do I optimise margins in a demanding gastronomic market like Lyon?',
          a: 'FoodTracks calculates your margins in real time by product and by service. In Lyon, where customers have strong gastronomic expectations, knowing your most profitable products is essential. FoodTracks reports tell you exactly what to keep, what to drop and where to invest in quality ingredients.',
        },
        {
          q: 'Is FoodTracks compatible with point-of-sale hardware used in Lyon?',
          a: 'FoodTracks integrates with SumUp and can import sales data from other sources. Invoice scanning works with all Lyon suppliers — wholesale distributors, Lyon MIN market or local producers — regardless of their invoice format.',
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
      icon: <UtensilsCrossed className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Adapté à la gastronomie lyonnaise' : 'Adapted to Lyon gastronomy',
      desc: isFr
        ? 'Tracez la fraîcheur, contrôlez la qualité des ingrédients et respectez les exigences d\'une clientèle gastronomique exigeante.'
        : 'Trace freshness, control ingredient quality and meet the demands of a discerning gastronomic clientele.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions festivals & événements' : 'Festival & event forecasting',
      desc: isFr
        ? 'Anticipez les pics de la Fête des Lumières, du Sirha et des festivals estivaux pour ne jamais être en rupture.'
        : 'Anticipate peaks at Fête des Lumières, Sirha and summer festivals so you\'re never out of stock.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Gestion multi-emplacements' : 'Multi-location management',
      desc: isFr
        ? 'Quais de Saône, Confluence, marché Saint-Antoine — gérez tout depuis une seule interface.'
        : 'Saône quays, Confluence, Marché Saint-Antoine — manage everything from a single interface.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse des marges' : 'Margin analysis',
      desc: isFr
        ? 'Mesurez votre rentabilité produit par produit pour optimiser votre carte et vos coûts d\'approvisionnement.'
        : 'Measure profitability product by product to optimise your menu and supply costs.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan fournisseurs locaux' : 'Local supplier scanning',
      desc: isFr
        ? 'Scannez les factures de vos fournisseurs lyonnais en quelques secondes pour mettre à jour votre stock automatiquement.'
        : 'Scan invoices from your Lyon suppliers in seconds to automatically update your inventory.',
    },
    {
      icon: <Star className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Gratuit pour démarrer' : 'Free to start',
      desc: isFr
        ? 'Plan gratuit complet sans limite de temps. Aucune carte de crédit requise pour commencer.'
        : 'Full free plan with no time limit. No credit card required to get started.',
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
              <span style={{ color: ORANGE }}>Lyon</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Lyonnais' : 'Lyon Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Lyon</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Lyon</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Prédictions IA calées sur les festivals lyonnais et la gastronomie locale. Gérez votre stock avec la rigueur qu\'exige la capitale mondiale de la gastronomie.'
                : 'AI predictions tuned to Lyon\'s festivals and local gastronomy. Manage your inventory with the rigour demanded by the world\'s gastronomic capital.'}
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
                  style={{ backgroundColor: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)' }}
                >
                  <UtensilsCrossed className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Lyon : la gastronomie au cœur du food truck' : 'Lyon: gastronomy at the heart of food trucks'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Surnommée capitale mondiale de la gastronomie, Lyon porte une tradition culinaire exceptionnelle qui se traduit aussi dans sa scène food truck. Les Lyonnais sont exigeants : qualité des produits, fraîcheur, originalité. La scène street food est dense — quais de Saône, marché Saint-Antoine, Confluence, festivals estivaux — et les pics d\'activité sont nombreux. La Fête des Lumières attire 2 millions de visiteurs en 4 jours. FoodTracks vous donne les outils pour anticiper ces volumes et maintenir votre niveau de qualité.'
                      : 'Nicknamed the world capital of gastronomy, Lyon carries an exceptional culinary tradition that also shines in its food truck scene. Lyonnais are demanding: product quality, freshness, originality. The street food scene is dense — Saône quays, Marché Saint-Antoine, Confluence, summer festivals — and activity peaks are frequent. Fête des Lumières draws 2 million visitors in 4 days. FoodTracks gives you the tools to anticipate these volumes and maintain your quality standards.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '2M',
                    label: isFr ? 'visiteurs Fête des Lumières' : 'Fête des Lumières visitors',
                    sub: isFr ? '4 jours de pic intense' : '4 days of intense peak',
                  },
                  {
                    stat: '3e',
                    label: isFr ? 'ville de France' : 'city in France',
                    sub: isFr ? 'Marché street food en croissance' : 'Growing street food market',
                  },
                  {
                    stat: '100+',
                    label: isFr ? 'food trucks actifs' : 'active food trucks',
                    sub: isFr ? 'Concurrence à gérer intelligemment' : 'Competition to manage smartly',
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
                ? 'Tout ce dont votre food truck lyonnais a besoin'
                : 'Everything your Lyon food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme pensée pour les défis uniques de la scène gastronomique lyonnaise.'
                : 'A platform designed for the unique challenges of Lyon\'s gastronomic scene.'}
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
                href={`/${locale}/ville/bordeaux`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Bordeaux' : 'FoodTracks in Bordeaux'}
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
              {isFr ? 'Questions fréquentes — Lyon' : 'FAQ — Lyon'}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Lyon</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Lyon</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers lyonnais qui utilisent FoodTracks pour gérer leur stock avec la précision qu\'exige la gastronomie.'
                : 'Join Lyon food truckers using FoodTracks to manage their inventory with the precision gastronomy demands.'}
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
