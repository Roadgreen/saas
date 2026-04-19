import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CheckCircle2, ChevronDown } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';
import { RentabilityCalculator } from './RentabilityCalculator';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';

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
    ? 'Calculateur de rentabilité food truck — Gratuit & instantané 2026'
    : 'Food Truck Profitability Calculator — Free & Instant 2026';
  const description = isFr
    ? 'Estimez en 30 secondes la rentabilité de votre food truck : chiffre d\u2019affaires, marge brute, résultat net mensuel et annuel. Sans inscription.'
    : 'Estimate your food truck profitability in 30 seconds: revenue, gross margin, monthly and yearly net profit. No sign-up required.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'calculateur rentabilité food truck',
          'simulateur rentabilité food truck',
          'marge food truck',
          'calcul rentabilité food truck',
          'chiffre affaires food truck',
          'combien gagne food truck',
          'salaire food truck',
          'business plan food truck',
        ]
      : [
          'food truck profitability calculator',
          'food truck income calculator',
          'food truck margin calculator',
          'how much does a food truck make',
          'food truck revenue',
          'food truck business plan',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/outils/calculateur-rentabilite`,
      languages: {
        fr: `${BASE_URL}/fr/outils/calculateur-rentabilite`,
        en: `${BASE_URL}/en/outils/calculateur-rentabilite`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/outils/calculateur-rentabilite`,
      siteName: 'FoodTracks',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: isFr ? 'Calculateur de rentabilité food truck' : 'Food truck profitability calculator',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group" style={{ borderBottom: '1px solid #EDEBE8' }}>
      <summary className="w-full flex items-center justify-between py-6 text-left gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-orange-600 transition-colors duration-200">
          {question}
        </span>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-open:bg-orange-50 bg-gray-50 transition-all">
          <ChevronDown className="h-4 w-4 text-gray-400 group-open:text-orange-500 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <p className="pb-7 text-sm md:text-base leading-relaxed max-w-2xl text-gray-600">{answer}</p>
    </details>
  );
}

export default async function RentabilityCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: isFr ? 'Outils' : 'Tools',
        item: `${BASE_URL}/${locale}/outils/calculateur-rentabilite`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: isFr ? 'Calculateur de rentabilité' : 'Profitability calculator',
        item: `${BASE_URL}/${locale}/outils/calculateur-rentabilite`,
      },
    ],
  };

  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: isFr ? 'Calculateur de rentabilité food truck' : 'Food Truck Profitability Calculator',
    url: `${BASE_URL}/${locale}/outils/calculateur-rentabilite`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
  };

  const faqItems = isFr
    ? [
        {
          question: 'Comment calcule-t-on la rentabilité d\u2019un food truck ?',
          answer:
            'La rentabilité d\u2019un food truck se calcule en soustrayant l\u2019ensemble des coûts (food cost + charges fixes) du chiffre d\u2019affaires. Formule : Résultat net = (CA × (1 − food cost %)) − charges fixes mensuelles. Notre calculateur fait ce calcul automatiquement à partir du ticket moyen, du nombre de tickets/jour, du food cost et des charges fixes.',
        },
        {
          question: 'Quel est le salaire moyen d\u2019un food trucker en France ?',
          answer:
            'Un food trucker en France dégage en moyenne entre 1 500€ et 3 500€ net par mois après charges et impôts, avec une forte variabilité selon la saison, la zone géographique et la spécialité. Les food trucks premium ou très bien placés (événements, marchés, zones bureaux) peuvent dépasser 5 000€ net/mois en haute saison.',
        },
        {
          question: 'Quelle est une bonne marge nette pour un food truck ?',
          answer:
            'Une marge nette saine pour un food truck se situe entre 10% et 20% du chiffre d\u2019affaires. En-dessous de 10%, la structure est fragile (un mauvais mois en météo peut la faire basculer). Au-dessus de 20%, c\u2019est excellent et souvent le signe d\u2019un ticket moyen fort et de charges maîtrisées.',
        },
        {
          question: 'Le calculateur tient-il compte des charges sociales et impôts ?',
          answer:
            'Non, il calcule le résultat net avant impôts. Ajoutez vos charges sociales (environ 22% du bénéfice pour un micro-entrepreneur BIC prestations, autour de 45% en EURL à l\u2019IS selon la rémunération) dans la case "charges fixes mensuelles" si vous voulez une estimation après charges.',
        },
        {
          question: 'Comment suivre ma rentabilité réelle au quotidien ?',
          answer:
            'FoodTracks calcule votre marge en temps réel à partir des ventes (connectées à SumUp), des stocks et des coûts d\u2019achats. Vous voyez chaque soir si le service a été rentable, et par emplacement. Les prédictions IA évitent le gaspillage et les ruptures, ce qui améliore directement la marge.',
        },
      ]
    : [
        {
          question: 'How do you calculate food truck profitability?',
          answer:
            'Food truck profitability is calculated by subtracting all costs (food cost + fixed costs) from revenue. Formula: Net profit = (Revenue × (1 − food cost %)) − fixed monthly costs. Our calculator runs this automatically from your average ticket, tickets/day, food cost and fixed costs.',
        },
        {
          question: 'How much does a food truck owner make on average?',
          answer:
            'A food truck owner typically makes between €1,500 and €3,500 net per month after costs and taxes, with high variability depending on season, location and specialty. Premium or very well-located trucks (events, markets, office zones) can exceed €5,000 net/month in peak season.',
        },
        {
          question: 'What is a good net margin for a food truck?',
          answer:
            'A healthy net margin for a food truck sits between 10% and 20% of revenue. Below 10%, the business is fragile (one bad weather month can flip it). Above 20% is excellent and usually signals a strong average ticket and tight cost control.',
        },
        {
          question: 'Does the calculator include taxes and social charges?',
          answer:
            'No, it calculates net profit before taxes. Add your social charges (around 22% of profit for a French micro-entrepreneur, ~45% for an EURL under corporate tax) to the "fixed monthly costs" input if you want a post-charges estimate.',
        },
        {
          question: 'How can I track my actual profitability every day?',
          answer:
            'FoodTracks calculates your margin in real time from sales (connected to SumUp), stock and purchase costs. You see every evening whether the service was profitable, broken down by location. AI predictions avoid waste and stockouts, which directly improves margin.',
        },
      ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        <LandingHeader />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 pt-6 pb-0" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
                FoodTracks
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {isFr ? 'Calculateur de rentabilité' : 'Profitability calculator'}
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <section className="container mx-auto px-4 pt-14 pb-10 max-w-4xl">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: '#FFF3E8', color: ORANGE }}
          >
            <TrendingUp className="h-4 w-4" />
            {isFr ? 'Outil gratuit · 100% en ligne' : 'Free tool · 100% online'}
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {isFr
              ? 'Calculateur de rentabilité food truck'
              : 'Food Truck Profitability Calculator'}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
            {isFr
              ? 'Votre food truck est-il vraiment rentable ? Entrez 5 chiffres et obtenez instantanément votre chiffre d\u2019affaires, votre marge brute et votre résultat net — mensuel et annuel.'
              : 'Is your food truck actually profitable? Enter 5 numbers and instantly get your revenue, gross margin and net profit — monthly and yearly.'}
          </p>
        </section>

        {/* CALCULATOR */}
        <section id="calculateur" className="container mx-auto px-4 pb-16 max-w-4xl">
          <RentabilityCalculator isFr={isFr} locale={locale} />
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
              {isFr ? 'Comment le calcul fonctionne' : 'How the calculation works'}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {isFr
                ? 'La rentabilité d\u2019un food truck se résume à une équation simple : ce qui rentre, moins ce qui sort. Le calculateur utilise deux étapes :'
                : 'Food truck profitability boils down to a simple equation: money in minus money out. The calculator runs two steps:'}
            </p>

            <ul className="space-y-4 mb-8">
              {(isFr
                ? [
                    ['Chiffre d\u2019affaires', 'Ticket moyen × tickets/jour × jours de service. Ex : 12€ × 60 × 22 = 15 840€/mois.'],
                    [
                      'Marge brute',
                      'On enlève le food cost (matières premières). Avec 32% de food cost, il reste 68% du CA, soit ~10 771€.',
                    ],
                    [
                      'Résultat net',
                      'On retire ensuite les charges fixes (leasing, assurance, abonnements…). 10 771€ − 2 500€ = 8 271€ de résultat net mensuel.',
                    ],
                  ]
                : [
                    ['Revenue', 'Average ticket × tickets/day × service days. E.g. €12 × 60 × 22 = €15,840/month.'],
                    [
                      'Gross margin',
                      'Subtract food cost (raw ingredients). At 32% food cost, 68% of revenue remains, i.e. ~€10,771.',
                    ],
                    [
                      'Net profit',
                      'Then subtract fixed costs (lease, insurance, subscriptions…). €10,771 − €2,500 = €8,271 monthly net profit.',
                    ],
                  ]
              ).map(([title, body], i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-5">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                {isFr ? (
                  <>
                    <strong>Envie d\u2019aller plus loin ?</strong> Pour connaître le nombre exact de tickets à
                    vendre chaque jour pour atteindre l\u2019équilibre, utilisez notre{' '}
                    <Link
                      href={`/${locale}/guides/seuil-rentabilite-food-truck`}
                      className="font-semibold text-orange-700 hover:underline"
                    >
                      calculateur de seuil de rentabilité
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    <strong>Want to go further?</strong> To know the exact number of tickets you need to sell
                    every day to break even, use our{' '}
                    <Link
                      href={`/${locale}/guides/seuil-rentabilite-food-truck`}
                      className="font-semibold text-orange-700 hover:underline"
                    >
                      break-even calculator
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-8">
              {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
            </h2>
            <div>
              {faqItems.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16" style={{ backgroundColor: '#0D0905' }}>
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold text-white mb-4">
              {isFr
                ? 'Passez du calcul théorique à la rentabilité réelle'
                : 'Go from theoretical calculation to real profitability'}
            </h2>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              {isFr
                ? 'FoodTracks calcule votre marge en temps réel à partir de vos ventes, stocks et coûts d\u2019achats — chaque soir, vous savez exactement combien vous avez gagné.'
                : 'FoodTracks calculates your margin in real time from sales, stock and purchase costs — every night, you know exactly how much you made.'}
            </p>
            <Link
              href={`/${locale}/register?utm_source=outils&utm_medium=calculateur_rentabilite&utm_campaign=final_cta`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              style={{ backgroundColor: ORANGE, boxShadow: '0 10px 30px -5px rgba(249,115,22,0.45)' }}
            >
              {isFr ? 'Démarrer mon essai gratuit 14 jours' : 'Start my 14-day free trial'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-sm text-white/50">
              {isFr ? 'Sans carte bancaire · annulation en 1 clic' : 'No credit card · cancel in 1 click'}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
