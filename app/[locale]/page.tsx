import { LandingHeader } from "@/components/landing/Header";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from 'next-intl/server';
import {
  Flame, TrendingUp, CreditCard, ArrowRight,
} from "lucide-react";
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

const ORANGE = '#F97316';
const DARK   = '#0D0905';
const SUMUP  = '#00B6FF';
const BASE_URL = 'https://foodtracks.io';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const title = isFr
    ? 'FoodTracks — Logiciel Gestion Food Truck France | Stock, Ventes & IA'
    : 'FoodTracks — Food Truck Management Software | Inventory, Sales & AI';
  const description = isFr
    ? 'Application food truck gratuite : gestion stock, prévision ventes IA, optimiser rentabilité food truck. Essai 14 jours sans CB.'
    : 'Free food truck inventory app: stock management, AI sales predictions, margin analytics. 14-day free trial, no credit card.';
  const keywords = isFr
    ? [
        'logiciel gestion food truck france',
        'application food truck gratuite',
        'gestion stock food truck',
        'prévision ventes food truck',
        'optimiser rentabilité food truck',
        'logiciel food truck',
        'caisse enregistreuse food truck',
        'gestion restaurant ambulant',
      ]
    : [
        'food truck management software',
        'food truck inventory app',
        'food truck stock management',
        'food truck sales predictions',
        'food truck pos software',
        'free food truck app',
        'mobile restaurant management',
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: { fr: `${BASE_URL}/fr`, en: `${BASE_URL}/en` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      siteName: 'FoodTracks',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: isFr ? 'FoodTracks — Logiciel gestion food truck' : 'FoodTracks — Food truck management software' }],
      locale: isFr ? 'fr_FR' : 'en_US',
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Landing');

  const dashboardSrc   = locale === 'fr' ? '/dashboardfr.jpg'  : '/dashboarden.jpg';
  const stockWidgetSrc = locale === 'fr' ? '/stockfr.jpg'       : '/stocken.jpg';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5, 6, 7].map((i) => ({
      '@type': 'Question',
      name: t(`faq.q${i}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.q${i}.answer`),
      },
    })),
  };

  const heroTitle = t('hero.title');
  const parts = heroTitle.split('.');

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingHeader />

      {/* ══════════════════════════════════════
          HERO — dark, full viewport (server-rendered for SEO)
          ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{ backgroundColor: DARK, minHeight: 'calc(100svh - 72px)', maxHeight: 'calc(100svh - 72px)' }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(249,115,22,0.14) 0%, transparent 60%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(20,184,166,0.06) 0%, transparent 55%)' }}
        />

        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16 py-6 md:py-10 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

            {/* Left — copy */}
            <div className="space-y-6">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border"
                style={{ backgroundColor: 'rgba(249,115,22,0.08)', color: '#FDBA74', borderColor: 'rgba(249,115,22,0.2)' }}
              >
                <Flame className="h-3.5 w-3.5" /> {t('badge')}
              </span>

              <h1 className="font-jakarta text-5xl md:text-6xl lg:text-[5.25rem] font-extrabold leading-[1.02] tracking-tight text-white">
                {parts[0]}.<br />
                <span className="text-gradient-orange">{parts.slice(1).join('.').trim()}</span>
              </h1>

              <p className="text-lg md:text-xl leading-[1.7] max-w-lg hero-description" style={{ color: '#8B8B8B' }}>
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/${locale}/register?plan=PRO`}>
                  <button
                    className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4.5 text-white text-base"
                    style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.5)' }}
                  >
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </Link>
                <a href="#comment-ca-marche">
                  <button
                    className="btn-landing btn-outline-dark inline-flex items-center justify-center rounded-full font-semibold px-10 py-4.5 border text-base"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#D1D5DB', backgroundColor: 'transparent' }}
                  >
                    {t('hero.ctaSecondary')}
                  </button>
                </a>
              </div>

            </div>

            {/* Right — locale-aware dashboard screenshot */}
            <div className="relative hidden lg:block">
              {/* Ambient glow */}
              <div
                className="absolute -inset-8 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
              />

              {/* Browser chrome */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ backgroundColor: '#1A100A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
                  </div>
                  <div
                    className="flex-1 mx-3 rounded-md px-3 py-1 text-xs"
                    style={{ backgroundColor: '#0D0905', color: '#4B5563' }}
                  >
                    app.foodtracks.io/dashboard
                  </div>
                </div>
                <Image
                  key={dashboardSrc}
                  src={dashboardSrc}
                  alt="FoodTracks Dashboard"
                  width={1200}
                  height={780}
                  className="w-full"
                  priority
                />
              </div>

              {/* Floating stock widget */}
              <div
                className="absolute -bottom-6 -left-8 rounded-xl overflow-hidden shadow-2xl w-56"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Image
                  key={stockWidgetSrc}
                  src={stockWidgetSrc}
                  alt="Stock widget"
                  width={400}
                  height={220}
                  className="w-full"
                />
              </div>

              {/* Accuracy badge */}
              <div
                className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-xl"
                style={{ backgroundColor: ORANGE, color: '#fff' }}
              >
                <TrendingUp className="h-3 w-3" /> {t('hero.accuracyStat')} accuracy
              </div>

              {/* SumUp sync badge */}
              <div
                className="absolute bottom-16 -right-5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-xl"
                style={{
                  backgroundColor: 'rgba(5,18,28,0.95)',
                  border: `1px solid rgba(0,182,255,0.35)`,
                  color: SUMUP,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <CreditCard className="h-3.5 w-3.5" />
                SumUp · +€147.50
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${DARK})` }}
        />
      </section>

      {/* All interactive/animated sections — client component */}
      <HomeClient />
    </main>
  );
}
