import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Cloud, MapPin, Sparkles, TrendingUp, TrendingDown, Minus, Check, AlertTriangle, X, Clock, Coins } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import {
  business, locations, forecast, stockReadiness, last7Days,
  monthSummary, product, pick, type DemoLocale,
} from '@/lib/demo/data';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Démo FoodTracks — Voir le tableau de bord sans inscription'
    : 'FoodTracks Demo — See the dashboard without signing up';
  const description = isFr
    ? 'Aperçu interactif de FoodTracks avec données fictives : prévisions IA, stock, marges. Aucune inscription nécessaire.'
    : 'Interactive preview of FoodTracks with fictional data: AI forecasts, stock, margins. No signup needed.';
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/demo`,
      languages: { fr: `${BASE_URL}/fr/demo`, en: `${BASE_URL}/en/demo` },
    },
    robots: { index: true, follow: true },
  };
}

const STRINGS = {
  fr: {
    badge: 'Mode démo · données fictives',
    title: 'Voici ce que tu vois chaque matin avec FoodTracks',
    sub: 'Un seul écran. Trois questions répondues : combien préparer, ai-je le stock, où va l\'argent ?',
    bannerText: 'Tu vois le compte démo de',
    bannerCta: 'Connecter mes vraies ventes',
    forecastTitle: 'Prévision pour demain',
    weather: 'Météo',
    location: 'Spot',
    accuracy: 'Précision modèle',
    qty: 'Préparer',
    vsLast: 'vs sem. dernière',
    stockTitle: 'Stock vs prévision',
    stockSub: 'L\'IA croise ton stock avec ce qu\'elle prévoit. Tu sais en 5 secondes ce qui manque.',
    statusCovered: 'Couvert',
    statusTight: 'Juste',
    statusShort: 'Insuffisant',
    weekTitle: 'Semaine en cours',
    weekSub: 'Marge nette par jour. Le rouge = jours fermés ou en perte.',
    revenue: 'CA',
    cost: 'Coût',
    margin: 'Marge',
    closed: 'Fermé',
    summaryTitle: 'Ton mois en un coup d\'œil',
    saved: 'Économisé',
    savedSub: 'Stock optimisé grâce aux prévisions',
    wasted: 'Gaspillé',
    wastedSub: 'À comparer aux 600 € moyens du secteur',
    marginPct: 'Marge brute',
    marginSub: 'Sur les 30 derniers jours',
    hours: 'Heures gagnées',
    hoursSub: 'Sur la planif. hebdo',
    finalTitle: 'Convaincu ? Ton tableau de bord t\'attend.',
    finalSub: 'Connecte SumUp ou saisis tes ventes manuellement. Première prévision en moins de 5 jours.',
    finalCta: 'Démarrer mon essai 14 jours',
    finalNote: 'Sans carte bancaire · Annulation 1 clic',
  },
  en: {
    badge: 'Demo mode · fictional data',
    title: 'Here is what you see every morning with FoodTracks',
    sub: 'One screen. Three questions answered: how much to prep, do I have the stock, where does the money go ?',
    bannerText: 'You\'re viewing the demo account of',
    bannerCta: 'Connect my real sales',
    forecastTitle: 'Tomorrow\'s forecast',
    weather: 'Weather',
    location: 'Spot',
    accuracy: 'Model accuracy',
    qty: 'Prep',
    vsLast: 'vs last week',
    stockTitle: 'Stock vs forecast',
    stockSub: 'AI cross-checks your stock against the forecast. You know in 5 seconds what\'s missing.',
    statusCovered: 'Covered',
    statusTight: 'Tight',
    statusShort: 'Short',
    weekTitle: 'This week',
    weekSub: 'Net margin per day. Red = closed days or losses.',
    revenue: 'Rev.',
    cost: 'Cost',
    margin: 'Margin',
    closed: 'Closed',
    summaryTitle: 'Your month at a glance',
    saved: 'Saved',
    savedSub: 'Stock optimized via forecasts',
    wasted: 'Wasted',
    wastedSub: 'Vs ~€600 industry avg.',
    marginPct: 'Gross margin',
    marginSub: 'Over the past 30 days',
    hours: 'Hours saved',
    hoursSub: 'On weekly planning',
    finalTitle: 'Convinced ? Your dashboard awaits.',
    finalSub: 'Connect SumUp or log sales manually. First forecast in under 5 days.',
    finalCta: 'Start my 14-day trial',
    finalNote: 'No credit card · Cancel in 1 click',
  },
} as const;

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: DemoLocale = rawLocale === 'fr' ? 'fr' : 'en';
  const s = STRINGS[locale];
  const loc = locations.find((l) => l.id === forecast.location)!;
  const totalUnits = forecast.items.reduce((sum, it) => sum + it.qty, 0);
  const weekRevenue = last7Days.reduce((sum, d) => sum + d.revenue, 0);
  const weekMargin = last7Days.reduce((sum, d) => sum + d.margin, 0);
  const maxMargin = Math.max(...last7Days.map((d) => d.margin), 1);
  const dateLabel = forecast.date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <main className="flex-1" style={{ backgroundColor: '#FFFBF7' }}>
      <LandingHeader />

      {/* ── Sticky demo banner ─────────────────────────────────────────── */}
      <div
        className="sticky top-[72px] z-40 backdrop-blur"
        style={{ backgroundColor: 'rgba(249,115,22,0.95)', color: '#fff' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 py-2.5 flex items-center justify-between gap-4">
          <p className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{s.bannerText} </span>
            <strong>{pick(business.name, locale)}</strong>
          </p>
          <Link
            href={`/${locale}/register?utm_source=demo&utm_medium=sticky_banner&utm_campaign=demo_top`}
          >
            <button
              className="inline-flex items-center gap-2 rounded-full text-sm font-bold px-5 py-2 bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              data-track-component="demo-banner-cta"
              data-track-name="top"
            >
              {s.bannerCta} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* ── Demo intro ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-5 sm:px-8 lg:px-16 pt-10 pb-6 text-center max-w-3xl">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4"
          style={{ backgroundColor: '#FFF7ED', color: ORANGE, border: `1px solid ${ORANGE}33` }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ORANGE }} />
          {s.badge}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {s.title}
        </h1>
        <p className="mt-3 text-lg text-gray-600">{s.sub}</p>
      </section>

      {/* ── Widget grid ────────────────────────────────────────────────── */}
      <section className="container mx-auto px-5 sm:px-8 lg:px-16 pb-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* — Forecast widget — */}
          <div className="rounded-2xl bg-white shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {s.forecastTitle}
                </h2>
                <p className="text-xl font-bold text-gray-900 mt-1 capitalize">{dateLabel}</p>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: ORANGE, color: '#fff' }}
              >
                <Sparkles className="h-3 w-3" /> {forecast.accuracy}%
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600 mt-2 mb-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" style={{ color: loc.color }} />
                {pick(loc.label, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cloud className="h-3.5 w-3.5 text-sky-500" />
                {pick(forecast.weather, locale)}
              </span>
            </div>

            <div className="space-y-2">
              {forecast.items.map((item) => {
                const p = product(item.productId);
                const TrendIcon = item.trend === 'up' ? TrendingUp : item.trend === 'down' ? TrendingDown : Minus;
                const trendColor = item.trend === 'up' ? '#16A34A' : item.trend === 'down' ? '#DC2626' : '#6B7280';
                return (
                  <div key={item.productId} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-900 flex-1">{pick(p.label, locale)}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">{item.vsLastWeek}</span>
                    <TrendIcon className="h-4 w-4" style={{ color: trendColor }} />
                    <span className="text-base font-bold tabular-nums w-12 text-right" style={{ color: ORANGE }}>
                      {item.qty}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-500">{s.qty}</span>
              <span className="font-bold text-gray-900">{totalUnits} {locale === 'fr' ? 'pièces' : 'items'}</span>
            </div>
          </div>

          {/* — Stock readiness — */}
          <div className="rounded-2xl bg-white shadow-sm p-6 border border-gray-100">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{s.stockTitle}</h2>
            <p className="text-sm text-gray-600 mt-1 mb-5">{s.stockSub}</p>
            <div className="space-y-2">
              {stockReadiness.map((row, i) => {
                const cfg =
                  row.status === 'covered' ? { Icon: Check,          color: '#16A34A', bg: '#DCFCE7', label: s.statusCovered } :
                  row.status === 'tight'   ? { Icon: AlertTriangle,  color: '#CA8A04', bg: '#FEF3C7', label: s.statusTight } :
                                              { Icon: X,              color: '#DC2626', bg: '#FEE2E2', label: s.statusShort };
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: cfg.bg }}>
                    <cfg.Icon className="h-5 w-5 flex-shrink-0" style={{ color: cfg.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{pick(row.label, locale)}</div>
                      <div className="text-xs text-gray-600">
                        {row.haveKg.toFixed(1)} kg / {row.needKg.toFixed(1)} kg
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* — 7-day margin bars — */}
          <div className="rounded-2xl bg-white shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{s.weekTitle}</h2>
              <div className="text-xs text-gray-500">
                {s.revenue} <span className="font-bold text-gray-900">€{weekRevenue}</span> · {s.margin} <span className="font-bold" style={{ color: '#16A34A' }}>€{weekMargin}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{s.weekSub}</p>
            <div className="grid grid-cols-7 gap-2 h-40">
              {last7Days.map((d, i) => {
                const heightPct = d.margin > 0 ? Math.max(8, (d.margin / maxMargin) * 100) : 4;
                const isClosed = d.revenue === 0;
                const dayLabel = d.date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' });
                return (
                  <div key={i} className="flex flex-col items-center justify-end gap-1.5">
                    <div className="text-xs font-bold tabular-nums" style={{ color: isClosed ? '#9CA3AF' : '#16A34A' }}>
                      {isClosed ? '—' : `€${d.margin}`}
                    </div>
                    <div
                      className="w-full rounded-md transition-all"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: isClosed ? '#E5E7EB' : ORANGE,
                        opacity: isClosed ? 0.4 : 0.85,
                      }}
                    />
                    <div className="text-xs text-gray-500 capitalize">{isClosed ? s.closed : dayLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* — Month summary KPIs — */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{s.summaryTitle}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={Coins}      color="#16A34A" label={s.saved}     value={`€${monthSummary.saved}`}    sub={s.savedSub}    big />
              <KpiCard icon={X}          color="#DC2626" label={s.wasted}    value={`€${monthSummary.wasted}`}   sub={s.wastedSub}            />
              <KpiCard icon={TrendingUp} color="#0EA5E9" label={s.marginPct} value={`${monthSummary.marginPct}%`} sub={s.marginSub}            />
              <KpiCard icon={Clock}      color="#F97316" label={s.hours}     value={`${monthSummary.hoursSaved}h`} sub={s.hoursSub}             />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="container mx-auto px-5 sm:px-8 lg:px-16 pb-20 max-w-3xl text-center">
        <div
          className="rounded-3xl p-10 border"
          style={{ backgroundColor: '#FFF7ED', borderColor: '#F97316' + '40' }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">{s.finalTitle}</h2>
          <p className="mt-3 text-gray-600 max-w-lg mx-auto">{s.finalSub}</p>
          <div className="mt-6">
            <Link
              href={`/${locale}/register?plan=PRO&utm_source=demo&utm_medium=final_cta&utm_campaign=demo_bottom`}
            >
              <button
                className="inline-flex items-center gap-3 rounded-full font-bold px-8 py-4 text-white text-base shadow-lg"
                style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.5)' }}
                data-track-component="demo-final-cta"
                data-track-name="bottom"
              >
                {s.finalCta} <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-gray-500">{s.finalNote}</p>
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon, color, label, value, sub, big = false,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  value: string;
  sub: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color }}>
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={`mt-2 font-extrabold tabular-nums ${big ? 'text-3xl' : 'text-2xl'}`} style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1 leading-snug">{sub}</div>
    </div>
  );
}
