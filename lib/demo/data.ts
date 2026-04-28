/**
 * Demo data — used by /demo to showcase FoodTracks without signup.
 *
 * Numbers are fictional but realistic for a 1-truck crêpes operation
 * running 4-5 days/week across 2 spots in Lyon. Tuned to make the
 * value props (waste reduction, margin visibility, AI forecast) land
 * in <10 seconds of scanning.
 *
 * Anchor date: today — events are computed relative to Date.now() so
 * the demo never feels stale. The 7-day window always shows "this week".
 */

export type DemoLocale = 'fr' | 'en';

const T = (fr: string, en: string) => ({ fr, en });

export const business = {
  name: T('Crêpes du Marché', 'Lyon Crêpes & Co.'),
  city: 'Lyon',
  truckCount: 1,
};

export const locations = [
  { id: 'marche', label: T('Marché de la Croix-Rousse', 'Croix-Rousse Market'), color: '#F97316' },
  { id: 'centre', label: T('Place Bellecour', 'Bellecour Square'),             color: '#0EA5E9' },
];

export const products = [
  { id: 'p1', label: T('Crêpe beurre-sucre',     'Butter-sugar crêpe'),     price: 4.5,  cost: 0.85 },
  { id: 'p2', label: T('Crêpe Nutella',          'Nutella crêpe'),          price: 5.5,  cost: 1.10 },
  { id: 'p3', label: T('Galette complète',       'Complete galette'),       price: 9.0,  cost: 2.20 },
  { id: 'p4', label: T('Galette chèvre-miel',    'Goat-cheese & honey'),    price: 9.5,  cost: 2.40 },
  { id: 'p5', label: T('Cidre brut (25cl)',      'Cider 25cl'),             price: 4.0,  cost: 0.90 },
];

/**
 * AI forecast for tomorrow — the headline value prop. Confidence is
 * deliberately not 100% to feel real; spots and weather drive the variance.
 */
export const forecast = {
  date: addDays(new Date(), 1),
  location: 'marche' as const,
  weather: T('Ensoleillé · 18°C', 'Sunny · 18°C'),
  accuracy: 89,
  items: [
    { productId: 'p1', qty: 47, trend: 'up'   as const, vsLastWeek: '+12%' },
    { productId: 'p3', qty: 23, trend: 'flat' as const, vsLastWeek:  '+2%' },
    { productId: 'p2', qty: 31, trend: 'up'   as const, vsLastWeek: '+18%' },
    { productId: 'p4', qty: 14, trend: 'down' as const, vsLastWeek:  '-5%' },
  ],
};

/** Stock readiness — what AI predicted vs. what's actually in inventory. */
export const stockReadiness = [
  { label: T('Farine de sarrasin', 'Buckwheat flour'), needKg: 3.1, haveKg: 4.2, status: 'covered' as const },
  { label: T('Beurre',             'Butter'),          needKg: 0.9, haveKg: 0.8, status: 'tight'   as const },
  { label: T('Gruyère râpé',       'Grated Gruyère'),  needKg: 1.1, haveKg: 0.4, status: 'short'   as const },
  { label: T('Nutella',            'Nutella'),         needKg: 0.7, haveKg: 1.4, status: 'covered' as const },
];

/**
 * 7-day P&L sparkline — keeps the most recent day in front so the
 * trend at a glance reads as "growing". Cost ≈ 24-28% of revenue.
 */
export const last7Days = (() => {
  const series = [
    { revenue: 412, cost: 108 },
    { revenue: 487, cost: 121 },
    { revenue: 0,   cost: 0   }, // closed
    { revenue: 528, cost: 142 },
    { revenue: 612, cost: 159 },
    { revenue: 743, cost: 184 },
    { revenue: 689, cost: 175 },
  ];
  return series.map((d, i) => ({
    date: addDays(new Date(), -6 + i),
    revenue: d.revenue,
    cost: d.cost,
    margin: d.revenue - d.cost,
  }));
})();

/** Headline KPI — money saved vs wasted, the "why this matters" stat. */
export const monthSummary = {
  saved:        820,   // € prevented from waste this month thanks to AI tuning
  wasted:       187,   // € of stock thrown out anyway (vs ~600 industry avg)
  marginPct:    73,    // % gross margin
  hoursSaved:   18,    // hours / month spent NOT on spreadsheet planning
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function product(id: string) {
  return products.find((p) => p.id === id)!;
}

export function pick<T extends { fr: string; en: string }>(t: T, locale: DemoLocale): string {
  return t[locale];
}
