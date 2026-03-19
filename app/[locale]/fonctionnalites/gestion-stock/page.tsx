import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  Package, CheckCircle2, ArrowRight, Zap, BarChart3,
  Bell, Shield, Clock, ChefHat, ChevronDown, ScanLine, History,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const TEAL   = '#14B8A6';
const DARK   = '#0D0905';
const GREEN  = '#22C55E';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Gestion de Stock Food Truck en Temps Réel — Alertes & Historique | FoodTracks'
    : 'Real-Time Food Truck Inventory Management — Alerts & History | FoodTracks';
  const description = isFr
    ? 'Gérez le stock de votre food truck en temps réel avec FoodTracks. Scan des arrivages, alertes de seuils, historique complet. Réduisez le gaspillage de 30 %. Gratuit.'
    : 'Manage your food truck inventory in real time with FoodTracks. Scan deliveries, threshold alerts, full history. Reduce waste by 30%. Free.';

  return {
    title,
    description,
    keywords: isFr
      ? ['gestion stock food truck', 'inventaire food truck', 'stock food truck temps réel', 'alerte rupture stock food truck', 'logiciel stock food truck', 'gestion inventaire restauration']
      : ['food truck inventory management', 'food truck stock tracking', 'real-time food truck inventory', 'food truck stock alerts', 'food truck inventory software', 'restaurant inventory management'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/fonctionnalites/gestion-stock`,
      languages: {
        fr: `${BASE_URL}/fr/fonctionnalites/gestion-stock`,
        en: `${BASE_URL}/en/fonctionnalites/gestion-stock`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/fonctionnalites/gestion-stock`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group" style={{ borderBottom: '1px solid #EDEBE8' }}>
      <summary className="w-full flex items-center justify-between py-7 text-left gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-orange-600 transition-colors duration-200">{question}</span>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-open:bg-orange-50 bg-gray-50 transition-all">
          <ChevronDown className="h-4 w-4 text-gray-400 group-open:text-orange-500 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <p className="pb-8 text-sm md:text-base leading-[1.8] max-w-2xl text-gray-500">{answer}</p>
    </details>
  );
}

export default async function InventoryManagementPage() {
  const t = await getTranslations('InventoryManagement');
  const locale = await getLocale();
  const isFr = locale === 'fr';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Fonctionnalités' : 'Features', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 3, name: isFr ? 'Gestion de stock' : 'Inventory Management', item: `${BASE_URL}/${locale}/fonctionnalites/gestion-stock` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4].map((i) => ({
      '@type': 'Question',
      name: t(`faq.q${i}.question`),
      acceptedAnswer: { '@type': 'Answer', text: t(`faq.q${i}.answer`) },
    })),
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('steps.title'),
    description: t('steps.subtitle'),
    totalTime: 'PT5M',
    tool: [
      { '@type': 'HowToTool', name: isFr ? 'Application FoodTracks' : 'FoodTracks app' },
    ],
    step: [1, 2, 3].map((i) => ({
      '@type': 'HowToStep',
      position: i,
      name: t(`steps.step${i}.title`),
      text: t(`steps.step${i}.desc`),
    })),
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FoodTracks',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Android, iOS',
    url: BASE_URL,
    description: isFr
      ? 'Logiciel de gestion de stock food truck en temps réel. Scan des arrivages, alertes de seuils, historique complet.'
      : 'Real-time food truck inventory management software. Delivery scanning, threshold alerts, full history.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    featureList: isFr
      ? 'Gestion de stock temps réel, Scan arrivages, Alertes de seuils, Historique mouvements, Multi-emplacements'
      : 'Real-time inventory, Delivery scanning, Threshold alerts, Movement history, Multi-location',
  };

  const steps = [
    { icon: <ScanLine className="h-8 w-8" style={{ color: ORANGE }} />, color: ORANGE },
    { icon: <Package className="h-8 w-8" style={{ color: TEAL }} />, color: TEAL },
    { icon: <Bell className="h-8 w-8" style={{ color: GREEN }} />, color: GREEN },
  ];

  const benefits = [
    { icon: <BarChart3 className="h-6 w-6" style={{ color: ORANGE }} /> },
    { icon: <Shield className="h-6 w-6" style={{ color: GREEN }} /> },
    { icon: <History className="h-6 w-6" style={{ color: TEAL }} /> },
    { icon: <ScanLine className="h-6 w-6" style={{ color: '#00B6FF' }} /> },
    { icon: <Package className="h-6 w-6" style={{ color: '#F59E0B' }} /> },
    { icon: <Zap className="h-6 w-6" style={{ color: ORANGE }} /> },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

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
              <span style={{ color: ORANGE }}>{isFr ? 'Gestion de stock' : 'Inventory Management'}</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <Package className="h-4 w-4" />
              {t('hero.badge')}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {t('hero.title')}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4.5 text-white text-base"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.4)' }}
                >
                  <Package className="h-4.5 w-4.5" />
                  {t('hero.cta')}
                </button>
              </Link>
              <a href="#comment-ca-marche">
                <button
                  className="btn-landing btn-outline-dark inline-flex items-center justify-center rounded-full font-semibold px-10 py-4.5 border text-base"
                  style={{ borderColor: 'rgba(249,115,22,0.25)', color: '#D1D5DB', backgroundColor: 'transparent' }}
                >
                  {t('hero.ctaSecondary')}
                </button>
              </a>
            </div>

            <p className="text-sm" style={{ color: '#6B7280' }}>
              {t('hero.noCreditCard')}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — 3 steps
          ══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-gray-900 tracking-tight">
              {t('steps.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('steps.subtitle')}</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8 md:gap-6 max-w-5xl mx-auto">
            <div
              className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5"
              style={{ background: `linear-gradient(to right, ${ORANGE}, ${GREEN})`, opacity: 0.25 }}
            />

            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center space-y-5">
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg"
                  style={{ backgroundColor: step.color, boxShadow: `0 0 24px ${step.color}55` }}
                >
                  {idx + 1}
                </div>
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: `${step.color}18`, border: `1px solid ${step.color}30` }}
                >
                  {step.icon}
                </div>
                <h3 className="font-jakarta text-xl font-bold text-gray-900">{t(`steps.step${idx + 1}.title`)}</h3>
                <p className="text-sm leading-relaxed max-w-[280px] text-gray-500">{t(`steps.step${idx + 1}.desc`)}</p>
                {idx < 2 && (
                  <div className="md:hidden flex justify-center pt-2">
                    <ArrowRight className="h-5 w-5 rotate-90" style={{ color: `${ORANGE}80` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENEFITS — dark section
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {t('benefits.title')}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-7 space-y-4 feature-card-dark"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {b.icon}
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t(`benefits.b${idx + 1}.title`)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t(`benefits.b${idx + 1}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MOCK WIDGET — visual demo
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold border"
                style={{ backgroundColor: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.25)', color: ORANGE }}
              >
                <Zap className="h-3.5 w-3.5" />
                {t('demo.badge')}
              </div>
              <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
                {t('demo.title')}
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">{t('demo.subtitle')}</p>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                    <span className="text-gray-700">{t(`demo.bullet${i}`)}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary inline-flex items-center gap-2 rounded-xl font-bold px-6 py-3 text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* Mock stock dashboard widget */}
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                border: '1px solid rgba(249,115,22,0.30)',
                backgroundColor: 'rgba(7,22,38,0.95)',
              }}
            >
              <div
                className="px-6 pt-6 pb-5"
                style={{ borderBottom: '1px solid rgba(249,115,22,0.14)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                      style={{ backgroundColor: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.25)' }}
                    >
                      <Package className="h-4 w-4" style={{ color: ORANGE }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{isFr ? 'État du stock' : 'Stock Status'}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>{isFr ? 'Mise à jour en temps réel' : 'Real-time update'}</p>
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold rounded-full px-2.5 py-1"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.20)' }}
                  >
                    ● {isFr ? 'À jour' : 'Up to date'}
                  </span>
                </div>
                <div className="font-jakarta text-4xl font-extrabold tracking-tight" style={{ color: ORANGE }}>
                  142 {isFr ? 'articles' : 'items'}
                </div>
                <p className="text-xs mt-1.5 font-medium" style={{ color: '#4B5563' }}>
                  {isFr ? '3 alertes actives · 0 rupture' : '3 active alerts · 0 stockouts'}
                </p>
              </div>
              <div
                className="px-6 pt-5 pb-5"
                style={{ borderBottom: '1px solid rgba(249,115,22,0.14)' }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#4B5563' }}>
                  {isFr ? 'Niveaux de stock' : 'Stock levels'}
                </p>
                <div className="space-y-3">
                  {[
                    { name: isFr ? 'Pains burger' : 'Burger buns', pct: 85, color: GREEN },
                    { name: isFr ? 'Steak haché' : 'Beef patties', pct: 45, color: '#F59E0B' },
                    { name: isFr ? 'Frites' : 'French fries', pct: 92, color: GREEN },
                    { name: isFr ? 'Sauce spéciale' : 'Special sauce', pct: 18, color: '#EF4444' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/80">{item.name}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pt-4 pb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#4B5563' }}>
                    {isFr ? 'Gaspillage ce mois' : 'Waste this month'}
                  </span>
                  <span className="text-sm font-extrabold text-green-400">-30 %</span>
                </div>
                <p className="text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  <span style={{ color: '#6B7280' }}>{isFr ? 'Objectif atteint ce mois-ci' : 'Target reached this month'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTERNAL LINKS
          ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-4">{isFr ? 'Découvrez aussi' : 'Also discover'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/fonctionnalites/integration-sumup`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Intégration SumUp' : 'SumUp Integration'}
              </Link>
              <Link href={`/${locale}/fonctionnalites/predictions-ventes`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Prédictions de ventes' : 'Sales Forecasting'}
              </Link>
              <Link href={`/${locale}/fonctionnalites/scan-factures`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                {isFr ? 'Scan de factures' : 'Invoice Scanning'}
              </Link>
              <Link href={`/${locale}/blog`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                Blog
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
              {t('faq.title')}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <FAQAccordion
                key={i}
                question={t(`faq.q${i}.question`)}
                answer={t(`faq.q${i}.answer`)}
              />
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
              {t('cta.title')}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col items-center gap-6">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-14 py-5 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
                >
                  <Package className="h-5 w-5" />
                  {t('cta.button')}
                </button>
              </Link>
              <p className="text-sm text-white/70">
                {t('hero.noCreditCard')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER (minimal)
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
