import Image from 'next/image';
import Link from 'next/link';
import { Brain, Package, BarChart3, TrendingUp, Wheat, Sandwich, IceCream, Coffee, Tent, Truck, BookOpen, ArrowRight } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { VERTICALS, type VerticalConfig } from '@/lib/verticals/data';

const ICONS = { Wheat, Sandwich, IceCream, Coffee, Tent } as const;

const RELATED_LABELS = {
  fr: {
    title: 'Tu gères un autre type de commerce ?',
    subtitle: 'Le même moteur, adapté à chaque métier.',
    foodTruckName: 'Food trucks',
    foodTruckUse: 'Mobile, événementiel, marchés',
    resourcesTitle: 'Pour aller plus loin',
    blogLabel: 'Blog : guides et études de cas',
    blogDesc: '160+ articles sur la gestion, les prévisions et la rentabilité',
    howItWorksLabel: 'Comment ça marche',
    howItWorksDesc: 'De la connexion de ta caisse à la prévision du lendemain, en 3 étapes',
  },
  en: {
    title: 'Run a different kind of food business?',
    subtitle: 'Same engine, tuned per trade.',
    foodTruckName: 'Food trucks',
    foodTruckUse: 'Mobile, events, markets',
    resourcesTitle: 'Go deeper',
    blogLabel: 'Blog: guides & case studies',
    blogDesc: '160+ articles on operations, forecasting and profitability',
    howItWorksLabel: 'How it works',
    howItWorksDesc: 'From connecting your till to tomorrow\u2019s forecast, in 3 steps',
  },
} as const;

interface Props {
  config: VerticalConfig;
  locale: 'fr' | 'en';
}

export function VerticalLandingTemplate({ config, locale }: Props) {
  const content = config[locale];
  const slug = config.slug;
  const Icon = ICONS[config.iconName];

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-jakarta, sans-serif)' }}>
      <LandingHeader />

      {/* ── 1. HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0D0905' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Copy */}
            <div className="flex-1 flex flex-col items-start gap-6">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'rgba(249,115,22,0.12)', color: '#F97316', border: '1px solid rgba(249,115,22,0.25)' }}
              >
                <Icon className="h-4 w-4" />
                {content.heroBadge}
              </div>

              {/* H1 */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                style={{ color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
              >
                {content.heroTagline}
              </h1>

              {/* Sub */}
              <p className="text-lg md:text-xl max-w-xl leading-relaxed" style={{ color: '#9CA3AF' }}>
                {content.heroSub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/${locale}/register?utm_source=${slug}&utm_medium=hero`}
                  data-track-component={`vertical-${slug}-hero-cta`}
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: '#F97316', color: '#ffffff' }}
                >
                  {content.ctaPrimary}
                </Link>
                <Link
                  href={`/${locale}/pricing`}
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-80"
                  style={{ backgroundColor: 'transparent', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.18)' }}
                >
                  {content.ctaSecondary}
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 w-full max-w-lg md:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={config.heroImage}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PAIN POINTS ── */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#0D0905', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
          >
            {content.painTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.pains.map((pain, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 flex flex-col gap-3 shadow-sm"
                style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: 'rgba(249,115,22,0.08)', color: '#F97316' }}
                >
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold" style={{ color: '#111827', fontFamily: 'var(--font-jakarta, sans-serif)' }}>
                  {pain.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {pain.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ── */}
      <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#0D0905', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
          >
            {content.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, i) => {
              const FeatureIcons = [Brain, Package, BarChart3, TrendingUp];
              const FeatureIcon = FeatureIcons[i % FeatureIcons.length];
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{ backgroundColor: '#FAFAF9', border: '1px solid #E5E7EB' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}
                  >
                    <FeatureIcon className="h-5 w-5" style={{ color: '#F97316' }} />
                  </div>
                  <h3 className="font-semibold text-base" style={{ color: '#111827', fontFamily: 'var(--font-jakarta, sans-serif)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. USE CASES ── */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#0D0905', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
          >
            {content.useCasesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.useCases.map((uc, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 flex flex-col gap-3 text-center shadow-sm"
                style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
              >
                <div
                  className="text-4xl font-bold tracking-tight"
                  style={{ color: '#F97316', fontFamily: 'var(--font-jakarta, sans-serif)' }}
                >
                  {uc.metric}
                </div>
                <h3 className="font-semibold text-lg" style={{ color: '#111827', fontFamily: 'var(--font-jakarta, sans-serif)' }}>
                  {uc.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#0D0905', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
          >
            {content.faqTitle}
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border rounded-xl"
                style={{ borderColor: '#E5E7EB' }}
              >
                <summary
                  className="cursor-pointer px-6 py-4 font-medium transition-colors hover:text-orange-600 list-none flex items-center justify-between"
                  style={{ color: '#111827', fontFamily: 'var(--font-jakarta, sans-serif)' }}
                >
                  {faq.question}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform duration-200 inline-block">
                    &#8964;
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5b. RELATED VERTICALS + RESOURCES (internal linking) ── */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
              style={{ color: '#0D0905', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
            >
              {RELATED_LABELS[locale].title}
            </h2>
            <p className="text-base" style={{ color: '#6B7280' }}>
              {RELATED_LABELS[locale].subtitle}
            </p>
          </div>

          {/* Other verticals grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto mb-12">
            {VERTICALS.filter((v) => v.slug !== slug).map((other) => {
              const OtherIcon = ICONS[other.iconName];
              const otherContent = other[locale];
              return (
                <Link
                  key={other.slug}
                  href={`/${locale}/${other.slug}`}
                  data-track-component={`vertical-${slug}-related-${other.slug}`}
                  className="group rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}
                  >
                    <OtherIcon className="h-4 w-4" style={{ color: '#F97316' }} />
                  </div>
                  <span className="font-semibold text-sm" style={{ color: '#111827' }}>
                    {otherContent.title.split('—')[0]?.split(':')[0]?.replace(/^Logiciel\s+/i, '').trim() || other.slug}
                  </span>
                  <span className="text-xs leading-snug" style={{ color: '#6B7280' }}>
                    {otherContent.heroBadge}
                  </span>
                </Link>
              );
            })}
            {/* Food truck card (handled separately, has its own legacy route) */}
            <Link
              href={`/${locale}/food-truck-management-software`}
              data-track-component={`vertical-${slug}-related-foodtruck`}
              className="group rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}
              >
                <Truck className="h-4 w-4" style={{ color: '#F97316' }} />
              </div>
              <span className="font-semibold text-sm" style={{ color: '#111827' }}>
                {RELATED_LABELS[locale].foodTruckName}
              </span>
              <span className="text-xs leading-snug" style={{ color: '#6B7280' }}>
                {RELATED_LABELS[locale].foodTruckUse}
              </span>
            </Link>
          </div>

          {/* Resources */}
          <div className="border-t pt-10 max-w-3xl mx-auto" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-center text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>
              {RELATED_LABELS[locale].resourcesTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                href={`/${locale}/blog`}
                data-track-component={`vertical-${slug}-resources-blog`}
                className="group flex items-start gap-3 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}>
                  <BookOpen className="h-4 w-4" style={{ color: '#F97316' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: '#111827' }}>{RELATED_LABELS[locale].blogLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: '#9CA3AF' }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{RELATED_LABELS[locale].blogDesc}</p>
                </div>
              </Link>
              <Link
                href={`/${locale}/comment-ca-marche`}
                data-track-component={`vertical-${slug}-resources-howitworks`}
                className="group flex items-start gap-3 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}>
                  <Brain className="h-4 w-4" style={{ color: '#F97316' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: '#111827' }}>{RELATED_LABELS[locale].howItWorksLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: '#9CA3AF' }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{RELATED_LABELS[locale].howItWorksDesc}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER CTA ── */}
      <section
        className="py-20"
        style={{ backgroundColor: '#F97316' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 text-center flex flex-col items-center gap-6">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-jakarta, sans-serif)' }}
          >
            {content.footerCtaTitle}
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {content.footerCtaSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href={`/${locale}/register?utm_source=${slug}&utm_medium=footer`}
              data-track-component={`vertical-${slug}-footer-cta`}
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#ffffff', color: '#F97316' }}
            >
              {content.footerCtaPrimary}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: 'transparent', color: '#ffffff', border: '2px solid rgba(255,255,255,0.6)' }}
            >
              {content.footerCtaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
