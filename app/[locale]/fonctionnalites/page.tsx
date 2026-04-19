import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChefHat, Sparkles, Package, CreditCard, LineChart, ScanLine } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const DARK   = '#0D0905';

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
    ? 'Fonctionnalités FoodTracks — Stock, Ventes, IA & Scan de Factures'
    : 'FoodTracks Features — Stock, Sales, AI & Invoice Scanning';
  const description = isFr
    ? 'Découvrez toutes les fonctionnalités FoodTracks : gestion de stock temps réel, intégration SumUp, prédictions IA, scan de factures. Pensé pour food trucks.'
    : 'Discover every FoodTracks feature: real-time inventory, SumUp integration, AI predictions, invoice scanning. Built for food trucks.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/fonctionnalites`,
      languages: {
        fr: `${BASE_URL}/fr/fonctionnalites`,
        en: `${BASE_URL}/en/fonctionnalites`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/fonctionnalites`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'FoodTracks features' }],
      type: 'website',
    },
  };
}

const FEATURES: Array<{
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  name: { fr: string; en: string };
  tagline: { fr: string; en: string };
  body: { fr: string; en: string };
}> = [
  {
    slug: 'gestion-stock',
    icon: Package,
    name: { fr: 'Gestion de stock temps réel', en: 'Real-time inventory' },
    tagline: {
      fr: 'Stock live, alertes de seuils, historique complet',
      en: 'Live stock, threshold alerts, full history',
    },
    body: {
      fr: 'Suivez vos ingrédients à la dose près, recevez des alertes avant la rupture et visualisez l’historique de chaque mouvement.',
      en: 'Track ingredients to the gram, get alerts before stockout and visualize every movement in history.',
    },
  },
  {
    slug: 'integration-sumup',
    icon: CreditCard,
    name: { fr: 'Intégration SumUp native', en: 'Native SumUp integration' },
    tagline: {
      fr: 'Ventes synchronisées, stock déduit automatiquement',
      en: 'Sales synced, stock deducted automatically',
    },
    body: {
      fr: 'Chaque vente SumUp déduit le stock ingrédient en temps réel — plus besoin de ressaisir ou d’exporter des CSV.',
      en: 'Every SumUp sale deducts ingredient stock in real time — no re-entry, no CSV exports.',
    },
  },
  {
    slug: 'predictions-ventes',
    icon: LineChart,
    name: { fr: 'Prédictions IA par emplacement', en: 'AI predictions per location' },
    tagline: {
      fr: 'Anticipez la demande, commandez juste',
      en: 'Anticipate demand, order accurately',
    },
    body: {
      fr: 'Nos modèles croisent ventes, météo et emplacement pour prédire la demande et éviter surstock comme rupture.',
      en: 'Our models cross sales, weather and location to forecast demand and avoid overstock or stockouts.',
    },
  },
  {
    slug: 'scan-factures',
    icon: ScanLine,
    name: { fr: 'Scan de factures fournisseurs', en: 'Supplier invoice scanning' },
    tagline: {
      fr: 'Photo de la facture, stock mis à jour',
      en: 'Photo of the invoice, stock updated',
    },
    body: {
      fr: 'Photographiez la facture, FoodTracks extrait les lignes et met à jour votre stock en un clic.',
      en: 'Snap a picture of the invoice, FoodTracks extracts line items and updates stock in one click.',
    },
  },
];

export default async function FonctionnalitesIndexPage({
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
      { '@type': 'ListItem', position: 2, name: isFr ? 'Fonctionnalités' : 'Features', item: `${BASE_URL}/${locale}/fonctionnalites` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isFr ? 'Fonctionnalités FoodTracks' : 'FoodTracks features',
    itemListElement: FEATURES.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/${locale}/fonctionnalites/${f.slug}`,
      name: isFr ? f.name.fr : f.name.en,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <LandingHeader />

      {/* HERO */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(249,115,22,0.14) 0%, transparent 50%),
                       radial-gradient(ellipse 80% 60% at 100% 75%, rgba(20,184,166,0.10) 0%, transparent 50%),
                       #07111E`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: '#6B7280' }}>
              <Link href={`/${locale}`} className="hover:text-white transition-colors">FoodTracks</Link>
              <span>/</span>
              <span style={{ color: ORANGE }}>{isFr ? 'Fonctionnalités' : 'Features'}</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
              style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
            >
              <Sparkles className="h-4 w-4" />
              {isFr ? 'Pensé pour les food trucks' : 'Built for food trucks'}
            </div>

            <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {isFr
                ? <>Toutes les <span style={{ color: ORANGE }}>fonctionnalités</span></>
                : <>Every <span style={{ color: ORANGE }}>feature</span></>}
            </h1>

            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              {isFr
                ? 'Stock, ventes, IA, scan de factures : une seule plateforme, pensée pour le terrain et le mobile.'
                : 'Stock, sales, AI, invoice scanning: one platform, built for the field and for mobile.'}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid gap-6 max-w-5xl mx-auto md:grid-cols-2">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.slug}
                  href={`/${locale}/fonctionnalites/${f.slug}`}
                  className="group block rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDEBE8' }}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl"
                      style={{ backgroundColor: 'rgba(249,115,22,0.12)', color: ORANGE }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-jakarta text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {isFr ? f.name.fr : f.name.en}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {isFr ? f.tagline.fr : f.tagline.en}
                      </p>
                      <p className="text-sm md:text-base text-gray-700 mt-4 leading-relaxed">
                        {isFr ? f.body.fr : f.body.en}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm font-semibold mt-5" style={{ color: ORANGE }}>
                        {isFr ? 'En savoir plus' : 'Learn more'}
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              {isFr ? <>Essayez FoodTracks gratuitement</> : <>Try FoodTracks for free</>}
            </h2>
            <p className="text-lg leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'Plan gratuit permanent, sans carte de crédit. Installez FoodTracks et testez toutes les fonctionnalités en conditions réelles.'
                : 'Permanent free plan, no credit card. Install FoodTracks and try every feature in real conditions.'}
            </p>
            <Link href={`/${locale}/register`}>
              <button
                className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4 text-white"
                style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.4)' }}
              >
                <ArrowRight className="h-4 w-4" />
                {isFr ? 'Démarrer gratuitement' : 'Start for free'}
              </button>
            </Link>
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
              <Link href={`/${locale}/comparatif`} className="hover:text-gray-300 transition-colors">{isFr ? 'Comparatifs' : 'Comparisons'}</Link>
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
