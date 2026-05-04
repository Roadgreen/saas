'use client';

import { useMemo, useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ORANGE = '#F97316';

interface Props {
  isFr: boolean;
  locale: string;
}

type Values = {
  ticketMoyen: string;
  ticketsJour: string;
  joursMois: string;
  foodCost: string; // %
  chargesFixes: string;
};

const DEFAULTS: Values = {
  ticketMoyen: '12',
  ticketsJour: '60',
  joursMois: '22',
  foodCost: '32',
  chargesFixes: '2500',
};

function parseNum(raw: string): number {
  return parseFloat(raw.replace(',', '.'));
}

function fmtEUR(n: number, isFr: boolean): string {
  return n.toLocaleString(isFr ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

export function RentabilityCalculator({ isFr, locale }: Props) {
  const [values, setValues] = useState<Values>(DEFAULTS);

  const result = useMemo(() => {
    const ticket = parseNum(values.ticketMoyen);
    const parJour = parseNum(values.ticketsJour);
    const jours = parseNum(values.joursMois);
    const fc = parseNum(values.foodCost);
    const fixed = parseNum(values.chargesFixes);

    if ([ticket, parJour, jours, fc, fixed].some((v) => !isFinite(v) || v < 0)) return null;
    if (fc >= 100) return null;

    const revenuJour = ticket * parJour;
    const revenuMois = revenuJour * jours;
    const revenuAn = revenuMois * 12;

    const margeBruteRate = 1 - fc / 100;
    const margeBruteMois = revenuMois * margeBruteRate;

    const resultatMois = margeBruteMois - fixed;
    const resultatAn = resultatMois * 12;

    const margeNettePct = revenuMois > 0 ? (resultatMois / revenuMois) * 100 : 0;

    // Break-even: how many tickets/day needed to cover fixed costs with given margin?
    const breakEvenRevenuMois = margeBruteRate > 0 ? fixed / margeBruteRate : Infinity;
    const breakEvenTicketsJour =
      ticket > 0 && jours > 0 && isFinite(breakEvenRevenuMois)
        ? Math.ceil(breakEvenRevenuMois / (ticket * jours))
        : null;

    return {
      revenuMois,
      revenuAn,
      margeBruteMois,
      margeBruteRate: margeBruteRate * 100,
      resultatMois,
      resultatAn,
      margeNettePct,
      breakEvenRevenuMois,
      breakEvenTicketsJour,
      profitable: resultatMois > 0,
    };
  }, [values]);

  const set = (k: keyof Values, v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const reset = () => setValues(DEFAULTS);

  const field = (
    key: keyof Values,
    label: string,
    suffix: string,
    hint?: string,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={values[key]}
          onChange={(e) => set(key, e.target.value)}
          className="w-full px-4 py-3 pr-14 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 pointer-events-none">
          {suffix}
        </span>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: 'rgba(249,115,22,0.30)', backgroundColor: '#FFFBF7' }}
    >
      <div className="px-6 py-5 flex items-center gap-3" style={{ backgroundColor: ORANGE }}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">
            {isFr ? 'Calculateur de rentabilité' : 'Profitability calculator'}
          </h3>
          <p className="text-white/80 text-sm">
            {isFr
              ? 'Résultat instantané — sans inscription'
              : 'Instant result — no sign-up'}
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          {field(
            'ticketMoyen',
            isFr ? 'Ticket moyen' : 'Average ticket',
            '€',
            isFr ? 'Prix moyen payé par un client' : 'Average amount per customer',
          )}
          {field(
            'ticketsJour',
            isFr ? 'Tickets par jour' : 'Tickets per day',
            '×',
            isFr ? 'Nombre de clients servis par jour' : 'Customers served per day',
          )}
          {field(
            'joursMois',
            isFr ? 'Jours de service / mois' : 'Service days / month',
            'j',
            isFr ? '22 jours = semaine classique' : '22 days = typical week',
          )}
          {field(
            'foodCost',
            isFr ? 'Food cost' : 'Food cost',
            '%',
            isFr
              ? 'Coût matières premières (28–35% typique)'
              : 'Raw material cost (28–35% typical)',
          )}
          {field(
            'chargesFixes',
            isFr ? 'Charges fixes mensuelles' : 'Fixed monthly costs',
            '€',
            isFr
              ? 'Leasing, assurance, carburant, abonnements…'
              : 'Lease, insurance, fuel, subscriptions…',
          )}

          <button
            onClick={reset}
            className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
          >
            {isFr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                {isFr
                  ? 'Saisissez des valeurs valides (food cost < 100%).'
                  : 'Enter valid values (food cost < 100%).'}
              </span>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-white border border-gray-100 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                  {isFr ? 'Chiffre d\u2019affaires' : 'Revenue'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {fmtEUR(result.revenuMois, isFr)}
                    </p>
                    <p className="text-xs text-gray-500">{isFr ? '/ mois' : '/ month'}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {fmtEUR(result.revenuAn, isFr)}
                    </p>
                    <p className="text-xs text-gray-500">{isFr ? '/ an' : '/ year'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-gray-100 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                  {isFr ? 'Marge brute' : 'Gross margin'}
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {fmtEUR(result.margeBruteMois, isFr)}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    ({result.margeBruteRate.toFixed(0)}%)
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {isFr ? 'après food cost, / mois' : 'after food cost, / month'}
                </p>
              </div>

              <div
                className="rounded-xl p-5 border-2"
                style={{
                  borderColor: result.profitable ? ORANGE : '#EF4444',
                  backgroundColor: result.profitable ? '#FFF3E8' : '#FEF2F2',
                }}
              >
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: result.profitable ? ORANGE : '#EF4444' }}>
                  {isFr ? 'Résultat net' : 'Net profit'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-2xl font-extrabold"
                      style={{ color: result.profitable ? '#B45309' : '#B91C1C' }}
                    >
                      {fmtEUR(result.resultatMois, isFr)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {isFr ? '/ mois' : '/ month'} ({result.margeNettePct.toFixed(0)}%)
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-2xl font-extrabold"
                      style={{ color: result.profitable ? '#B45309' : '#B91C1C' }}
                    >
                      {fmtEUR(result.resultatAn, isFr)}
                    </p>
                    <p className="text-xs text-gray-600">{isFr ? '/ an' : '/ year'}</p>
                  </div>
                </div>
                {!result.profitable && result.breakEvenTicketsJour !== null && (
                  <p className="mt-3 text-xs text-red-700 flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    {isFr
                      ? `À ce rythme vous perdez de l\u2019argent. Il vous faut ${result.breakEvenTicketsJour} tickets/jour minimum pour atteindre l\u2019équilibre.`
                      : `At this pace you are losing money. You need at least ${result.breakEvenTicketsJour} tickets/day to break even.`}
                  </p>
                )}
                {result.profitable && result.breakEvenTicketsJour !== null && (
                  <p className="mt-3 text-xs text-gray-600 flex items-start gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                    {isFr
                      ? `Seuil de rentabilité : ${result.breakEvenTicketsJour} tickets/jour.`
                      : `Break-even: ${result.breakEvenTicketsJour} tickets/day.`}
                  </p>
                )}
              </div>

              <Link
                href={`/${locale}/register?utm_source=outils&utm_medium=calculateur_rentabilite&utm_campaign=cta_end`}
                className="block w-full text-center px-5 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
                style={{ backgroundColor: ORANGE, boxShadow: '0 6px 20px -4px rgba(249,115,22,0.35)' }}
                data-track-component="calc-cta-end"
              >
                <span className="inline-flex items-center gap-2">
                  {isFr ? 'Suivre ma rentabilité en temps réel' : 'Track my profitability live'}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <p className="text-center text-xs text-gray-500">
                {isFr
                  ? '14 jours d\u2019essai Pro gratuit · sans carte bancaire'
                  : '14-day free Pro trial · no credit card'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
