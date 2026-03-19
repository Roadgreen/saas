import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat, ArrowRight, CheckCircle2, TrendingUp, Package, BarChart3, ChevronDown } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';
import { BreakEvenCalculator } from './BreakEvenCalculator';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const DARK = '#0D0905';

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
    ? 'Calculer le seuil de rentabilité d\'un food truck — Guide + Calculateur 2026'
    : 'Break-Even Calculator for Food Trucks — Free Guide 2026';
  const description = isFr
    ? 'Apprenez à calculer le seuil de rentabilité de votre food truck : formule, charges fixes/variables, exemple chiffré et calculateur interactif gratuit. Guide complet 2026.'
    : 'Learn how to calculate your food truck break-even point: formula, fixed/variable costs, concrete example, and free interactive calculator. Complete 2026 guide.';

  return {
    title,
    description,
    keywords: isFr
      ? ['seuil rentabilité food truck', 'calculer seuil rentabilité food truck', 'point mort food truck', 'charges fixes food truck', 'rentabilité food truck', 'calcul marge food truck', 'combien vendre food truck', 'business plan food truck']
      : ['food truck break even', 'food truck break-even calculator', 'food truck profitability', 'food truck fixed costs', 'food truck margins', 'food truck business plan', 'how many sales food truck'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/guides/seuil-rentabilite-food-truck`,
      languages: {
        fr: `${BASE_URL}/fr/guides/seuil-rentabilite-food-truck`,
        en: `${BASE_URL}/en/guides/seuil-rentabilite-food-truck`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/guides/seuil-rentabilite-food-truck`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: isFr ? 'Calculateur seuil de rentabilité food truck' : 'Food truck break-even calculator' }],
      type: 'article',
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

export default async function SeuilRentabilitePage({
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Guides' : 'Guides', item: `${BASE_URL}/${locale}/guides` },
      {
        '@type': 'ListItem',
        position: 3,
        name: isFr ? 'Seuil de rentabilité food truck' : 'Food truck break-even',
        item: `${BASE_URL}/${locale}/guides/seuil-rentabilite-food-truck`,
      },
    ],
  };

  const faqItems = isFr
    ? [
        {
          question: 'Comment calculer le seuil de rentabilité d\'un food truck ?',
          answer: 'Le seuil de rentabilité d\'un food truck se calcule avec la formule : CA minimum = Charges fixes mensuelles ÷ Taux de marge brute. Par exemple, si vos charges fixes sont de 2 500€/mois et votre taux de marge brute de 65%, votre CA minimum mensuel est de 3 846€. En divisant par le nombre de jours de service (ex. 22), vous obtenez le CA journalier minimum, puis le nombre de tickets à vendre.',
        },
        {
          question: 'Quelles sont les charges fixes d\'un food truck ?',
          answer: 'Les charges fixes d\'un food truck comprennent : le leasing ou remboursement d\'emprunt du camion (300–800€/mois), l\'assurance professionnelle et responsabilité civile (100–200€/mois), le carburant et entretien estimé (200–400€/mois), les charges sociales si vous êtes salarié ou gérant (selon statut), les abonnements logiciels et outils de gestion (30–100€/mois), et les éventuels frais d\'emplacement ou de marché (50–500€/mois selon les emplacements).',
        },
        {
          question: 'Quel taux de marge brute est normal pour un food truck ?',
          answer: 'Le taux de marge brute d\'un food truck se situe généralement entre 60% et 75%. Il représente le pourcentage du chiffre d\'affaires restant après déduction des matières premières (food cost). Un food truck vendant des burgers aura typiquement un food cost de 28–35%, soit une marge brute de 65–72%. Des plats plus élaborés ou des matières premières premium peuvent réduire cette marge à 55–60%.',
        },
        {
          question: 'Combien de couverts par jour pour être rentable avec un food truck ?',
          answer: 'Le nombre de couverts (tickets) minimum dépend de votre ticket moyen et de vos charges. Avec un ticket moyen de 12€, une marge brute de 65% et des charges fixes de 2 500€/mois, vous avez besoin d\'environ 15 tickets/jour sur 22 jours. Avec un ticket moyen de 15€, ce seuil descend à 12 tickets/jour. Utilisez notre calculateur gratuit pour obtenir votre chiffre exact.',
        },
        {
          question: 'FoodTracks peut-il m\'aider à suivre ma rentabilité en temps réel ?',
          answer: 'Oui, FoodTracks calcule automatiquement vos marges par produit et par emplacement. En connectant votre terminal SumUp, les ventes s\'importent en temps réel et vous voyez instantanément si vous avez atteint votre seuil de rentabilité journalier. Les prédictions IA vous indiquent en avance combien préparer pour chaque service, évitant gaspillage et ruptures.',
        },
      ]
    : [
        {
          question: 'How do you calculate the break-even point for a food truck?',
          answer: 'The food truck break-even point is calculated with the formula: Minimum revenue = Fixed monthly costs ÷ Gross margin rate. For example, if your fixed costs are €2,500/month and your gross margin rate is 65%, your minimum monthly revenue is €3,846. Divide by the number of service days (e.g. 22) to get the daily minimum, then divide by your average ticket price to get the number of sales needed.',
        },
        {
          question: 'What are the fixed costs of a food truck?',
          answer: 'Food truck fixed costs include: vehicle lease or loan repayment (€300–800/month), professional and liability insurance (€100–200/month), estimated fuel and maintenance (€200–400/month), social charges if you are an employee or manager (varies by status), software and management tool subscriptions (€30–100/month), and any location or market fees (€50–500/month depending on spots).',
        },
        {
          question: 'What is a normal gross margin rate for a food truck?',
          answer: 'A food truck\'s gross margin rate typically ranges from 60% to 75%. It represents the percentage of revenue remaining after deducting ingredients (food cost). A burger food truck typically has a food cost of 28–35%, giving a gross margin of 65–72%. More elaborate dishes or premium ingredients may reduce this margin to 55–60%.',
        },
        {
          question: 'How many covers per day to break even with a food truck?',
          answer: 'The minimum number of covers (tickets) depends on your average ticket price and fixed costs. With a €12 average ticket, 65% gross margin and €2,500/month fixed costs, you need around 15 tickets/day over 22 days. With a €15 average ticket, this threshold drops to 12 tickets/day. Use our free calculator to get your exact number.',
        },
        {
          question: 'Can FoodTracks help me track my profitability in real time?',
          answer: 'Yes, FoodTracks automatically calculates your margins per product and per location. By connecting your SumUp terminal, sales are imported in real time and you instantly see whether you have reached your daily break-even threshold. AI predictions tell you in advance how much to prepare for each service, avoiding both waste and stockouts.',
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFr
      ? 'Calculer le seuil de rentabilité de son food truck — Guide + Calculateur 2026'
      : 'Break-Even Calculator for Food Trucks — Free Guide 2026',
    description: isFr
      ? 'Guide complet pour calculer le seuil de rentabilité d\'un food truck avec formule, exemple chiffré et calculateur interactif.'
      : 'Complete guide to calculating food truck break-even point with formula, worked example and interactive calculator.',
    datePublished: '2026-01-01',
    dateModified: '2026-03-01',
    author: { '@type': 'Organization', name: 'FoodTracks', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTracks',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/guides/seuil-rentabilite-food-truck`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        <LandingHeader />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 pt-6 pb-0" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li><Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">FoodTracks</Link></li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/guides`} className="hover:text-gray-700 transition-colors">
                {isFr ? 'Guides' : 'Guides'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {isFr ? 'Seuil de rentabilité' : 'Break-even point'}
            </li>
          </ol>
        </nav>

        {/* ══════════════════════════════════════
            HERO
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 pt-14 pb-10 max-w-4xl">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: '#FFF3E8', color: ORANGE }}
          >
            <TrendingUp className="h-4 w-4" />
            {isFr ? 'Guide pratique · Mis à jour mars 2026' : 'Practical guide · Updated March 2026'}
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {isFr
              ? 'Calculer le seuil de rentabilité de son food truck — Guide + Calculateur 2026'
              : 'Break-Even Calculator for Food Trucks — Free Guide 2026'}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
            {isFr
              ? 'Combien de tickets devez-vous vendre chaque jour pour couvrir vos charges ? On vous explique la formule, on vous donne un exemple concret chiffré, et on vous offre un calculateur interactif gratuit.'
              : 'How many tickets do you need to sell every day to cover your costs? We explain the formula, walk through a real example with numbers, and give you a free interactive calculator.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#calculateur">
              <button
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
                style={{ backgroundColor: ORANGE, boxShadow: '0 8px 24px -4px rgba(249,115,22,0.35)' }}
              >
                {isFr ? 'Accéder au calculateur' : 'Go to calculator'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </a>
            <a href="#formule">
              <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all">
                {isFr ? 'Comprendre la formule' : 'Understand the formula'}
              </button>
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CALCULATOR (interactive, client)
            ══════════════════════════════════════ */}
        <section id="calculateur" className="container mx-auto px-4 pb-16 max-w-4xl">
          <BreakEvenCalculator isFr={isFr} />
        </section>

        {/* ══════════════════════════════════════
            LONG-FORM CONTENT
            ══════════════════════════════════════ */}
        <article className="py-16" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container mx-auto px-4 max-w-3xl">

            {/* Section 1 — Définition */}
            <section id="definition" className="mb-14">
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
                {isFr
                  ? 'Qu\'est-ce que le seuil de rentabilité d\'un food truck ?'
                  : 'What is the break-even point for a food truck?'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isFr
                  ? 'Le seuil de rentabilité (aussi appelé point mort) est le niveau de chiffre d\'affaires minimum que votre food truck doit réaliser pour couvrir l\'intégralité de ses coûts — sans dégager de bénéfice, ni subir de perte. En-dessous de ce seuil, vous perdez de l\'argent. Au-dessus, vous commencez à dégager un bénéfice.'
                  : 'The break-even point is the minimum revenue level your food truck must achieve to cover all its costs — without making a profit or a loss. Below this threshold, you lose money. Above it, you start generating profit.'}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isFr
                  ? 'Pour un food trucker, cet indicateur est fondamental : contrairement à un restaurant fixe, vos revenus varient beaucoup selon le jour, la météo, l\'emplacement et la saison. Connaître votre point mort journalier vous aide à décider quels emplacements sont rentables, à quel moment il vaut mieux ne pas sortir, et combien vous devez préparer pour chaque service.'
                  : 'For a food trucker, this indicator is fundamental: unlike a fixed restaurant, your revenue varies greatly depending on the day, weather, location and season. Knowing your daily break-even helps you decide which locations are profitable, when it\'s not worth going out, and how much to prepare for each service.'}
              </p>
            </section>

            {/* Section 2 — Charges */}
            <section id="charges" className="mb-14">
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
                {isFr
                  ? 'Charges fixes et charges variables : bien les distinguer'
                  : 'Fixed costs and variable costs: understanding the difference'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Charges fixes */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ORANGE }}
                    />
                    {isFr ? 'Charges fixes (mensuelles)' : 'Fixed costs (monthly)'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {(isFr
                      ? [
                          'Leasing ou remboursement emprunt camion : 300–800€',
                          'Assurance professionnelle (RC + véhicule) : 100–200€',
                          'Carburant & entretien estimé : 200–400€',
                          'Charges sociales (gérant / TNS) : variable',
                          'Loyers d\'emplacements fixes : 50–500€',
                          'Logiciels & abonnements (dont FoodTracks) : 0–100€',
                          'Comptabilité : 50–150€',
                        ]
                      : [
                          'Vehicle lease or loan repayment: €300–800',
                          'Professional insurance (liability + vehicle): €100–200',
                          'Estimated fuel & maintenance: €200–400',
                          'Social charges (self-employed): varies',
                          'Fixed location rents: €50–500',
                          'Software & subscriptions (incl. FoodTracks): €0–100',
                          'Accountancy: €50–150',
                        ]
                    ).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Charges variables */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-teal-500 flex-shrink-0" />
                    {isFr ? 'Charges variables (selon l\'activité)' : 'Variable costs (activity-dependent)'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {(isFr
                      ? [
                          'Matières premières (food cost) : 25–40% du CA',
                          'Emballages & consommables : 2–5% du CA',
                          'Main d\'œuvre supplémentaire (extras) : variable',
                          'Commissions plateforme de paiement (SumUp) : ~1,75%',
                          'Carburant supplémentaire selon trajets : variable',
                        ]
                      : [
                          'Ingredients (food cost): 25–40% of revenue',
                          'Packaging & consumables: 2–5% of revenue',
                          'Additional labour (extras): variable',
                          'Payment platform commission (SumUp): ~1.75%',
                          'Additional fuel by route: variable',
                        ]
                    ).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-teal-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic">
                {isFr
                  ? 'Astuce : pour le calcul du seuil de rentabilité, on intègre uniquement les charges fixes dans la formule. Les charges variables sont déjà prises en compte dans le taux de marge brute.'
                  : 'Tip: for the break-even calculation, only fixed costs are used in the formula. Variable costs are already captured in the gross margin rate.'}
              </p>
            </section>

            {/* Section 3 — Formule */}
            <section id="formule" className="mb-14">
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
                {isFr
                  ? 'La formule du seuil de rentabilité pour un food truck'
                  : 'The break-even formula for a food truck'}
              </h2>

              {/* Formule en box */}
              <div
                className="rounded-2xl p-8 mb-8 text-center"
                style={{ backgroundColor: DARK }}
              >
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: ORANGE }}>
                  {isFr ? 'Formule' : 'Formula'}
                </p>
                <div className="font-mono text-white text-lg md:text-2xl font-bold leading-relaxed">
                  {isFr ? (
                    <>
                      <span style={{ color: ORANGE }}>CA minimum mensuel</span>
                      <span className="text-gray-400"> = </span>
                      <span className="text-white">Charges fixes mensuelles</span>
                      <span className="text-gray-400"> ÷ </span>
                      <span style={{ color: '#14B8A6' }}>Taux de marge brute</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: ORANGE }}>Min. monthly revenue</span>
                      <span className="text-gray-400"> = </span>
                      <span className="text-white">Monthly fixed costs</span>
                      <span className="text-gray-400"> ÷ </span>
                      <span style={{ color: '#14B8A6' }}>Gross margin rate</span>
                    </>
                  )}
                </div>
                <div className="mt-4 font-mono text-white text-lg md:text-xl font-bold leading-relaxed">
                  {isFr ? (
                    <>
                      <span style={{ color: '#22C55E' }}>Tickets/jour</span>
                      <span className="text-gray-400"> = </span>
                      <span style={{ color: ORANGE }}>CA min mensuel</span>
                      <span className="text-gray-400"> ÷ (</span>
                      <span className="text-white">Jours de service</span>
                      <span className="text-gray-400"> × </span>
                      <span style={{ color: '#14B8A6' }}>Prix moyen ticket</span>
                      <span className="text-gray-400">)</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#22C55E' }}>Tickets/day</span>
                      <span className="text-gray-400"> = </span>
                      <span style={{ color: ORANGE }}>Min monthly rev.</span>
                      <span className="text-gray-400"> ÷ (</span>
                      <span className="text-white">Service days</span>
                      <span className="text-gray-400"> × </span>
                      <span style={{ color: '#14B8A6' }}>Avg ticket price</span>
                      <span className="text-gray-400">)</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                {isFr
                  ? 'Le taux de marge brute représente ce qu\'il reste du chiffre d\'affaires après avoir payé vos matières premières. Si vous vendez un burger à 12€ avec 4€ de food cost, votre marge brute est de 8€, soit 67%.'
                  : 'The gross margin rate is what remains of your revenue after paying for ingredients. If you sell a burger for €12 with €4 of food cost, your gross margin is €8, i.e. 67%.'}
              </p>
            </section>

            {/* Section 4 — Exemple concret */}
            <section id="exemple" className="mb-14">
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
                {isFr
                  ? 'Exemple concret : le food truck de Camille'
                  : 'Worked example: Camille\'s food truck'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {isFr
                  ? 'Camille vient de lancer son food truck burgers artisanaux à Lyon. Voici ses chiffres du mois de mars :'
                  : 'Camille just launched her artisan burger food truck in Lyon. Here are her March numbers:'}
              </p>

              {/* Table charges */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-8">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#F8F6F3' }}>
                      <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                        {isFr ? 'Poste de charge' : 'Cost item'}
                      </th>
                      <th className="text-right px-5 py-4 text-sm font-semibold text-gray-700">
                        {isFr ? 'Montant mensuel' : 'Monthly amount'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isFr
                      ? [
                          ['Leasing camion', '550€'],
                          ['Assurance professionnelle', '140€'],
                          ['Carburant & entretien', '280€'],
                          ['Charges sociales (TNS)', '800€'],
                          ['Frais d\'emplacement (marchés)', '200€'],
                          ['FoodTracks Pro + SumUp', '55€'],
                          ['Comptabilité', '80€'],
                        ]
                      : [
                          ['Vehicle lease', '€550'],
                          ['Professional insurance', '€140'],
                          ['Fuel & maintenance', '€280'],
                          ['Social charges (self-employed)', '€800'],
                          ['Location fees (markets)', '€200'],
                          ['FoodTracks Pro + SumUp', '€55'],
                          ['Accountancy', '€80'],
                        ]
                    ).map(([item, amount], i) => (
                      <tr key={i} className="border-t border-gray-100" style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{item}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">{amount}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-300" style={{ backgroundColor: '#FFF8F5' }}>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900">
                        {isFr ? 'Total charges fixes' : 'Total fixed costs'}
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold text-right" style={{ color: ORANGE }}>
                        {isFr ? '2 105€/mois' : '€2,105/month'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Calcul pas à pas */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 space-y-5">
                <h3 className="font-bold text-gray-900 text-lg">
                  {isFr ? 'Application de la formule' : 'Applying the formula'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: ORANGE }}
                    >1</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {isFr ? 'Taux de marge brute' : 'Gross margin rate'}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {isFr
                          ? 'Ticket moyen 13€ · Food cost 4,55€ (35%) → Marge brute = 65%'
                          : 'Average ticket €13 · Food cost €4.55 (35%) → Gross margin = 65%'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: ORANGE }}
                    >2</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {isFr ? 'CA minimum mensuel' : 'Minimum monthly revenue'}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {isFr
                          ? '2 105€ ÷ 0,65 = 3 238€/mois'
                          : '€2,105 ÷ 0.65 = €3,238/month'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: ORANGE }}
                    >3</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {isFr ? 'CA minimum journalier' : 'Minimum daily revenue'}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {isFr
                          ? '3 238€ ÷ 22 jours = 147€/jour'
                          : '€3,238 ÷ 22 days = €147/day'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: '#22C55E' }}
                    >4</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {isFr ? 'Nombre de tickets/jour' : 'Tickets per day'}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {isFr
                          ? '147€ ÷ 13€ = 12 tickets/jour minimum'
                          : '€147 ÷ €13 = 12 tickets/day minimum'}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm font-semibold text-green-800">
                    {isFr
                      ? 'Conclusion : Camille doit vendre au minimum 12 burgers par jour (sur 22 jours/mois) pour couvrir toutes ses charges.'
                      : 'Conclusion: Camille needs to sell a minimum of 12 burgers per day (over 22 days/month) to cover all her costs.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 — Améliorer sa rentabilité */}
            <section id="ameliorer" className="mb-14">
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
                {isFr
                  ? '5 leviers pour améliorer la rentabilité de votre food truck'
                  : '5 levers to improve your food truck profitability'}
              </h2>

              <div className="space-y-4">
                {(isFr
                  ? [
                      {
                        num: '01',
                        title: 'Augmenter le ticket moyen',
                        desc: 'Proposez des formules (plat + boisson + dessert), upsell intelligemment (frites supplémentaires, sauce premium). Passer de 12€ à 14€ de ticket moyen réduit votre seuil de ~14%.',
                      },
                      {
                        num: '02',
                        title: 'Réduire le food cost',
                        desc: 'Renégociez avec vos fournisseurs, réduisez le gaspillage grâce au suivi de stock en temps réel, adaptez vos quantités préparées aux prédictions de vente. FoodTracks vous aide à réduire le gaspillage de 30% en moyenne.',
                      },
                      {
                        num: '03',
                        title: 'Choisir des emplacements rentables',
                        desc: 'Tous les emplacements ne se valent pas. Comparez vos performances par emplacement avec FoodTracks pour identifier vos spots les plus rentables et réduire le temps sur les moins bons.',
                      },
                      {
                        num: '04',
                        title: 'Prédire la demande pour éviter les pertes',
                        desc: 'Préparer trop, c\'est du gaspillage. Préparer trop peu, c\'est du CA perdu. L\'IA de FoodTracks prédit vos ventes à 92% de précision pour que vous prépariez exactement ce qu\'il faut.',
                      },
                      {
                        num: '05',
                        title: 'Optimiser vos charges fixes',
                        desc: 'Renégociez votre assurance annuellement, optimisez votre régime social (auto-entrepreneur vs. EURL), mutualisez des emplacements avec d\'autres food truckers pour réduire les frais.',
                      },
                    ]
                  : [
                      {
                        num: '01',
                        title: 'Increase the average ticket',
                        desc: 'Offer meal deals (main + drink + dessert), upsell smartly (extra fries, premium sauce). Going from €12 to €14 average ticket reduces your break-even by ~14%.',
                      },
                      {
                        num: '02',
                        title: 'Reduce food cost',
                        desc: 'Renegotiate with suppliers, reduce waste with real-time stock tracking, adjust preparation quantities based on sales predictions. FoodTracks helps reduce waste by 30% on average.',
                      },
                      {
                        num: '03',
                        title: 'Choose profitable locations',
                        desc: 'Not all locations are equal. Compare your performance by location with FoodTracks to identify your most profitable spots and reduce time at lower performers.',
                      },
                      {
                        num: '04',
                        title: 'Predict demand to avoid losses',
                        desc: 'Preparing too much means waste. Too little means lost revenue. FoodTracks\'s AI predicts your sales with 92% accuracy so you prepare exactly what you need.',
                      },
                      {
                        num: '05',
                        title: 'Optimize your fixed costs',
                        desc: 'Renegotiate your insurance annually, optimize your social regime, share locations with other food truckers to split fees.',
                      },
                    ]
                ).map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-5">
                    <div
                      className="flex-shrink-0 text-3xl font-extrabold leading-none"
                      style={{ color: 'rgba(249,115,22,0.18)' }}
                    >
                      {item.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6 — Suivi avec FoodTracks */}
            <section id="foodtracks" className="mb-14">
              <h2 className="font-jakarta text-3xl font-bold text-gray-900 mb-6">
                {isFr
                  ? 'Comment FoodTracks vous aide à piloter votre rentabilité'
                  : 'How FoodTracks helps you manage your profitability'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {isFr
                  ? 'Calculer votre seuil de rentabilité manuellement une fois est utile. Mais ce qui transforme vraiment votre business, c\'est de le suivre en temps réel au quotidien.'
                  : 'Calculating your break-even point manually once is useful. But what truly transforms your business is tracking it in real time, every day.'}
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {(isFr
                  ? [
                      {
                        icon: <BarChart3 className="h-6 w-6" style={{ color: ORANGE }} />,
                        title: 'Dashboard marges en temps réel',
                        desc: 'Visualisez votre marge brute par produit et par emplacement. Identifiez les plats qui plombent votre rentabilité.',
                        link: `/${locale}/fonctionnalites/gestion-stock`,
                        linkText: 'Voir gestion de stock',
                      },
                      {
                        icon: <TrendingUp className="h-6 w-6" style={{ color: '#14B8A6' }} />,
                        title: 'Prédictions IA des ventes',
                        desc: 'L\'IA anticipe votre CA pour chaque service. Vous savez à l\'avance si vous allez dépasser votre seuil de rentabilité.',
                        link: `/${locale}/fonctionnalites/predictions-ventes`,
                        linkText: 'Voir les prédictions',
                      },
                      {
                        icon: <Package className="h-6 w-6" style={{ color: '#22C55E' }} />,
                        title: 'Scan de factures IA',
                        desc: 'Vos coûts matières sont automatiquement calculés depuis vos factures fournisseurs. Votre taux de marge se met à jour tout seul.',
                        link: `/${locale}/fonctionnalites/gestion-stock`,
                        linkText: 'Voir le scan factures',
                      },
                    ]
                  : [
                      {
                        icon: <BarChart3 className="h-6 w-6" style={{ color: ORANGE }} />,
                        title: 'Real-time margin dashboard',
                        desc: 'View your gross margin per product and per location. Identify dishes that hurt your profitability.',
                        link: `/${locale}/fonctionnalites/gestion-stock`,
                        linkText: 'See stock management',
                      },
                      {
                        icon: <TrendingUp className="h-6 w-6" style={{ color: '#14B8A6' }} />,
                        title: 'AI sales predictions',
                        desc: 'AI anticipates your revenue for each service. You know in advance whether you\'ll exceed your break-even point.',
                        link: `/${locale}/fonctionnalites/predictions-ventes`,
                        linkText: 'See predictions',
                      },
                      {
                        icon: <Package className="h-6 w-6" style={{ color: '#22C55E' }} />,
                        title: 'AI invoice scanning',
                        desc: 'Your ingredient costs are automatically calculated from supplier invoices. Your margin rate updates itself.',
                        link: `/${locale}/fonctionnalites/gestion-stock`,
                        linkText: 'See invoice scanning',
                      },
                    ]
                ).map((card, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="p-2.5 rounded-xl w-fit mb-3" style={{ backgroundColor: '#F8F6F3' }}>
                      {card.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{card.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{card.desc}</p>
                    <Link
                      href={card.link}
                      className="text-xs font-semibold hover:underline transition-colors"
                      style={{ color: ORANGE }}
                    >
                      {card.linkText} →
                    </Link>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </article>

        {/* ══════════════════════════════════════
            FAQ
            ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="font-jakarta text-3xl font-bold text-gray-900 text-center mb-10">
            {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
          </h2>
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA FINAL
            ══════════════════════════════════════ */}
        <section
          className="relative py-20 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
          }}
        >
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', color: ORANGE, border: '1px solid rgba(249,115,22,0.30)' }}
            >
              <ChefHat className="h-4 w-4" />
              FoodTracks
            </div>
            <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              {isFr
                ? 'Calculez votre rentabilité en temps réel'
                : 'Track your profitability in real time'}
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'FoodTracks calcule automatiquement vos marges, prédit vos ventes et vous alerte quand vous approchez votre seuil de rentabilité journalier.'
                : 'FoodTracks automatically calculates your margins, predicts your sales and alerts you when you approach your daily break-even threshold.'}
            </p>
            <Link href={`/${locale}/register`}>
              <button
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: ORANGE, boxShadow: '0 12px 36px -4px rgba(249,115,22,0.4)' }}
              >
                {isFr ? 'Essayer gratuitement' : 'Try for free'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <p className="text-sm mt-3" style={{ color: '#6B7280' }}>
              {isFr
                ? 'Sans carte bancaire · Sans engagement · Opérationnel en 30 minutes'
                : 'No credit card · No commitment · Operational in 30 minutes'}
            </p>

            {/* Internal links */}
            <div className="mt-10 pt-8 border-t text-left" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold mb-4" style={{ color: '#9CA3AF' }}>
                {isFr ? 'Articles liés' : 'Related articles'}
              </p>
              <ul className="space-y-2">
                {[
                  {
                    href: `/${locale}/fonctionnalites/gestion-stock`,
                    label: isFr
                      ? '→ Gestion de stock food truck en temps réel'
                      : '→ Real-time food truck stock management',
                  },
                  {
                    href: `/${locale}/fonctionnalites/predictions-ventes`,
                    label: isFr
                      ? '→ Prédictions de ventes IA pour food trucks'
                      : '→ AI sales predictions for food trucks',
                  },
                  {
                    href: `/${locale}/guides/gestion-food-truck`,
                    label: isFr
                      ? '→ Guide complet : gérer son food truck en 2026'
                      : '→ Complete guide: managing your food truck in 2026',
                  },
                  {
                    href: `/${locale}/comparatif/inpulse-vs-foodtracks`,
                    label: isFr
                      ? '→ FoodTracks vs Inpulse : quel logiciel choisir ?'
                      : '→ FoodTracks vs Inpulse: which software to choose?',
                  },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm hover:underline transition-colors"
                      style={{ color: ORANGE }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer minimal */}
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
                <Link href={`/${locale}/guides`} className="hover:text-gray-300 transition-colors">{isFr ? 'Guides' : 'Guides'}</Link>
                <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
              </div>
              <p className="text-xs" style={{ color: '#374151' }}>
                © {new Date().getFullYear()} FoodTracks
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
