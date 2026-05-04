import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ArrowRight, Zap, BarChart3,
  Package, ChefHat, ChevronDown, TrendingUp, Star, Compass,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { CityVerticalsBridge } from '@/components/landing/CityVerticalsBridge';
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
    ? 'Logiciel Gestion Food Truck Montpellier — Arceaux, Comédie & Campus'
    : 'Food Truck Management Software Montpellier — Arceaux, Comédie & Campus';
  const description = isFr
    ? 'Gérez votre food truck à Montpellier avec FoodTracks : stock en temps réel, prédictions IA adaptées au climat méditerranéen, aux festivals et au calendrier universitaire. Plan gratuit disponible.'
    : 'Manage your Montpellier food truck with FoodTracks: real-time inventory, AI predictions adapted to the Mediterranean climate, festivals and university calendar. Free plan available.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'logiciel gestion food truck Montpellier',
          'application food truck Montpellier',
          'gestion stock food truck Montpellier',
          'prédictions ventes food truck Montpellier',
          'logiciel restauration mobile Montpellier',
          'food truck Occitanie',
        ]
      : [
          'food truck management software Montpellier',
          'food truck app Montpellier',
          'food truck inventory Montpellier',
          'food truck sales forecasting Montpellier',
          'mobile catering software Montpellier France',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/ville/montpellier`,
      languages: {
        fr: `${BASE_URL}/fr/ville/montpellier`,
        en: `${BASE_URL}/en/ville/montpellier`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/ville/montpellier`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks Montpellier' }],
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

export default async function MontpellierFoodTruckPage({
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
    name: 'FoodTracks — Montpellier',
    description: isFr
      ? 'Logiciel de gestion pour food trucks opérant à Montpellier et en Occitanie.'
      : 'Management software for food trucks operating in Montpellier and Occitanie.',
    url: `${BASE_URL}/${locale}/ville/montpellier`,
    areaServed: {
      '@type': 'City',
      name: 'Montpellier',
      sameAs: 'https://www.wikidata.org/wiki/Q6441',
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Villes' : 'Cities', item: `${BASE_URL}/${locale}/ville/montpellier` },
      { '@type': 'ListItem', position: 3, name: 'Montpellier', item: `${BASE_URL}/${locale}/ville/montpellier` },
    ],
  };

  const faqData = isFr
    ? [
        {
          q: 'Quels sont les meilleurs emplacements pour un food truck à Montpellier ?',
          a: 'Montpellier offre de nombreux emplacements stratégiques : le marché des Arceaux (mardi et samedi matin), la place de la Comédie, l\'Écusson, Antigone, Port Marianne, les campus de l\'Université de Montpellier et les plages de Palavas et Carnon en été. FoodTracks analyse vos ventes par emplacement pour identifier les plus rentables.',
        },
        {
          q: 'Comment gérer les pics liés aux festivals et à la saison touristique ?',
          a: 'Festival de Radio France, Festival International du Cinéma Méditerranéen, Montpellier Danse, le Printemps des Comédiens, et l\'afflux touristique de juin à septembre créent une demande très variable. FoodTracks intègre ces événements dans ses prédictions pour ajuster vos commandes fournisseurs.',
        },
        {
          q: 'FoodTracks prend-il en compte le climat méditerranéen de Montpellier ?',
          a: 'Oui. Avec plus de 300 jours de soleil par an et des pics de chaleur en été, la demande varie énormément selon la météo. FoodTracks intègre les prévisions météo dans ses prédictions pour ajuster automatiquement vos besoins en boissons, glaces et produits frais.',
        },
        {
          q: 'Comment optimiser mon stock pour le calendrier étudiant montpelliérain ?',
          a: 'Avec plus de 70 000 étudiants répartis sur plusieurs campus, Montpellier est l\'une des villes les plus étudiantes de France. FoodTracks tient compte des périodes de cours, d\'examens et de vacances universitaires pour ajuster vos prédictions.',
        },
        {
          q: 'Quel est le coût de FoodTracks pour un food truck montpelliérain ?',
          a: 'FoodTracks propose un plan gratuit complet pour démarrer, sans carte de crédit. Les plans payants incluent les prédictions IA avancées, le scan de factures illimité et le support prioritaire — adapté à tous les budgets.',
        },
      ]
    : [
        {
          q: 'What are the best locations for a food truck in Montpellier?',
          a: 'Montpellier offers many strategic spots: Arceaux market (Tuesday and Saturday morning), Place de la Comédie, Écusson, Antigone, Port Marianne, the Université de Montpellier campuses, and Palavas and Carnon beaches in summer. FoodTracks analyses your sales by location to identify the most profitable ones.',
        },
        {
          q: 'How do I handle peaks during festivals and the tourist season?',
          a: 'Festival de Radio France, International Mediterranean Film Festival, Montpellier Danse, Printemps des Comédiens, and the summer tourist influx from June to September create highly variable demand. FoodTracks factors these events into its predictions to adjust supplier orders.',
        },
        {
          q: 'Does FoodTracks account for Montpellier\'s Mediterranean climate?',
          a: 'Yes. With over 300 days of sunshine per year and heatwaves in summer, demand shifts dramatically with weather. FoodTracks integrates weather forecasts into its predictions to automatically adjust your needs for drinks, ice creams and fresh products.',
        },
        {
          q: 'How do I optimise stock for the Montpellier student calendar?',
          a: 'With over 70,000 students across several campuses, Montpellier is one of France\'s most student-heavy cities. FoodTracks factors term times, exams and university holidays into predictions.',
        },
        {
          q: 'How much does FoodTracks cost for a Montpellier food truck?',
          a: 'FoodTracks offers a full free plan to get started, no credit card needed. Paid plans include advanced AI predictions, unlimited invoice scanning and priority support — suitable for every budget.',
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
      title: isFr ? 'Multi-emplacements montpelliérains' : 'Multiple Montpellier locations',
      desc: isFr
        ? 'Gérez marchés, places, campus et plages avec un stock centralisé.'
        : 'Manage markets, squares, campuses and beaches with centralised inventory.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />,
      title: isFr ? 'Prédictions météo & événements' : 'Weather & event forecasting',
      desc: isFr
        ? 'L\'IA intègre le climat méditerranéen, les festivals et la saison touristique.'
        : 'AI factors in the Mediterranean climate, festivals and tourist season.',
    },
    {
      icon: <Package className="h-6 w-6" style={{ color: GREEN }} />,
      title: isFr ? 'Zéro rupture de stock' : 'Zero stockouts',
      desc: isFr
        ? 'Alertes proactives avant les Arceaux et les gros événements pour ne jamais manquer d\'ingrédients clés.'
        : 'Proactive alerts before Arceaux market and major events so you never run out of key ingredients.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" style={{ color: '#8B5CF6' }} />,
      title: isFr ? 'Analyse de rentabilité' : 'Profitability analysis',
      desc: isFr
        ? 'Suivez vos marges par produit et par emplacement pour maximiser votre rentabilité à Montpellier.'
        : 'Track margins by product and location to maximise profitability across Montpellier.',
    },
    {
      icon: <Zap className="h-6 w-6" style={{ color: '#F59E0B' }} />,
      title: isFr ? 'Scan de factures fournisseurs' : 'Supplier invoice scanning',
      desc: isFr
        ? 'Scannez vos factures en quelques secondes pour mettre à jour votre stock automatiquement.'
        : 'Scan invoices in seconds to update your inventory automatically.',
    },
    {
      icon: <Star className="h-6 w-6" style={{ color: ORANGE }} />,
      title: isFr ? 'Plan gratuit sans limite' : 'Unlimited free plan',
      desc: isFr
        ? 'Commencez gratuitement sans carte de crédit. Évoluez quand votre activité grandit.'
        : 'Start free with no credit card. Upgrade as your business grows.',
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
              <span style={{ color: ORANGE }}>Montpellier</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <MapPin className="h-4 w-4" />
              {isFr ? 'Food Trucks Montpelliérains' : 'Montpellier Food Trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Logiciel de gestion<br />food truck <span style={{ color: ORANGE }}>Montpellier</span></>
                : <>Food truck management<br />software for <span style={{ color: ORANGE }}>Montpellier</span></>}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock en temps réel, prédictions IA adaptées au climat méditerranéen, aux festivals et au calendrier étudiant. Réduisez le gaspillage et maximisez vos ventes — du marché des Arceaux à Port Marianne.'
                : 'Real-time inventory, AI predictions adapted to the Mediterranean climate, festivals and student calendar. Cut waste and maximise sales — from Arceaux market to Port Marianne.'}
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
                  style={{ backgroundColor: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.20)' }}
                >
                  <Compass className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isFr ? 'Montpellier : soleil, étudiants et Méditerranée' : 'Montpellier: sun, students and the Mediterranean'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isFr
                      ? 'Septième ville de France et l\'une des plus dynamiques, Montpellier conjugue climat méditerranéen, scène culturelle dense (Radio France, Montpellier Danse, Printemps des Comédiens) et population étudiante massive. Du marché des Arceaux à la place de la Comédie, en passant par Port Marianne et les plages de Palavas, la demande varie selon la météo, les événements et le calendrier universitaire. FoodTracks prédit ces variations et optimise vos opérations quotidiennes.'
                      : 'France\'s seventh city and one of its most dynamic, Montpellier combines a Mediterranean climate, a dense cultural scene (Radio France, Montpellier Danse, Printemps des Comédiens) and a massive student population. From Arceaux market to Place de la Comédie, through Port Marianne and Palavas beaches, demand shifts with weather, events and the university calendar. FoodTracks predicts these variations and optimises your daily operations.'}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    stat: '300+',
                    label: isFr ? 'jours de soleil / an' : 'days of sun / year',
                    sub: isFr ? 'Climat méditerranéen' : 'Mediterranean climate',
                  },
                  {
                    stat: '70k+',
                    label: isFr ? 'étudiants' : 'students',
                    sub: isFr ? 'Université de Montpellier' : 'Université de Montpellier',
                  },
                  {
                    stat: '7e',
                    label: isFr ? 'ville de France' : 'city in France',
                    sub: isFr ? 'Croissance la plus rapide' : 'Fastest-growing',
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
                ? 'Tout ce dont votre food truck montpelliérain a besoin'
                : 'Everything your Montpellier food truck needs'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Une plateforme complète, pensée pour les contraintes uniques de Montpellier.'
                : 'A complete platform, designed for the unique constraints of Montpellier.'}
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
                href={`/${locale}/ville/marseille`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Marseille' : 'FoodTracks in Marseille'}
              </Link>
              <Link
                href={`/${locale}/ville/nice`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'FoodTracks à Nice' : 'FoodTracks in Nice'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CityVerticalsBridge locale={locale} cityName="Montpellier" />

      {/* FAQ */}
      <section className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
              {isFr ? 'Questions fréquentes — Montpellier' : 'FAQ — Montpellier'}
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
                ? <>Lancez-vous à <span style={{ color: ORANGE }}>Montpellier</span></>
                : <>Launch in <span style={{ color: ORANGE }}>Montpellier</span></>}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Rejoignez les food truckers montpelliérains qui utilisent FoodTracks pour vendre plus et gaspiller moins.'
                : 'Join Montpellier food truckers using FoodTracks to sell more and waste less.'}
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
