'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  Eye,
  Monitor,
  Smartphone,
  Globe,
  Activity,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface OverviewData {
  visitors: number;
  sessions: number;
  pageViews: number;
  period: string;
}

interface TopPage {
  path: string;
  count: number;
}

interface TrafficData {
  referrers: { referrer: string; count: number }[];
  campaigns: { source: string; medium: string; campaign: string; count: number }[];
}

interface DeviceData {
  mobile: number;
  desktop: number;
  total: number;
}

interface RecentEvent {
  type: string;
  timestamp: string;
  sessionId: string;
  page?: { path: string };
  user?: { email: string | null; anonymousId: string | null };
  device?: { isMobile: boolean };
  properties?: Record<string, unknown>;
}

interface FunnelData {
  steps: { name: string; count: number }[];
}

type Period = 'today' | '7d' | '30d';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
const DEVICE_COLORS = ['#3b82f6', '#f59e0b'];

const EVENT_TYPE_COLORS: Record<string, string> = {
  page_view: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  click: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  button_click: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  link_click: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  auth_login: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  auth_register: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  auth_logout: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  rage_click: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  form_submit: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  scroll_depth: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  navigation: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function shortenReferrer(ref: string): string {
  try {
    const url = new URL(ref);
    return url.hostname.replace('www.', '');
  } catch {
    return ref.length > 40 ? ref.slice(0, 40) + '...' : ref;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminAnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>('7d');
  const [overview, setOverview] = useState<Record<Period, OverviewData | null>>({
    today: null,
    '7d': null,
    '30d': null,
  });
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [devices, setDevices] = useState<DeviceData | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSection = useCallback(
    async (section: string, params?: Record<string, string>) => {
      const qs = new URLSearchParams({ section, period, ...params });
      const res = await fetch(`/api/admin/analytics?${qs}`);
      if (!res.ok) throw new Error(`Failed to fetch ${section}`);
      return res.json();
    },
    [period]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewToday,
        overview7d,
        overview30d,
        pages,
        trafficData,
        deviceData,
        events,
        funnelData,
      ] = await Promise.all([
        fetchSection('overview', { period: 'today' }),
        fetchSection('overview', { period: '7d' }),
        fetchSection('overview', { period: '30d' }),
        fetchSection('top-pages'),
        fetchSection('traffic-sources'),
        fetchSection('devices'),
        fetchSection('recent-events'),
        fetchSection('funnel'),
      ]);

      setOverview({
        today: overviewToday,
        '7d': overview7d,
        '30d': overview30d,
      });
      setTopPages(pages);
      setTraffic(trafficData);
      setDevices(deviceData);
      setRecentEvents(events);
      setFunnel(funnelData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [fetchSection]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentOverview = overview[period];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visitor analytics and event tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="inline-flex rounded-lg border bg-card p-1 text-sm">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === p
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── 1. Visitors Overview ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(currentOverview?.visitors ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {PERIOD_LABELS[period]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-2">
              <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(currentOverview?.sessions ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {PERIOD_LABELS[period]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <div className="rounded-md bg-purple-100 dark:bg-purple-900/30 p-2">
              <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(currentOverview?.pageViews ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {PERIOD_LABELS[period]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── 2. Top Pages + 3. Traffic Sources ── */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-8 text-center">No data</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topPages.slice(0, 10)}
                    layout="vertical"
                    margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="path"
                      type="category"
                      width={160}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v: string) => (v.length > 25 ? v.slice(0, 25) + '...' : v)}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--card)',
                        color: 'var(--card-foreground)',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : !traffic || (traffic.referrers.length === 0 && traffic.campaigns.length === 0) ? (
              <p className="text-sm text-muted-foreground italic py-8 text-center">No data</p>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {traffic.referrers.length > 0 && (
                  <>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Referrers
                    </h4>
                    <div className="space-y-2">
                      {traffic.referrers.map((r, i) => {
                        const maxCount = traffic.referrers[0]?.count ?? 1;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm truncate">{shortenReferrer(r.referrer)}</span>
                                <span className="text-sm font-medium ml-2">{r.count}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-blue-500"
                                  style={{ width: `${(r.count / maxCount) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {traffic.campaigns.length > 0 && (
                  <>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mt-4">
                      UTM Campaigns
                    </h4>
                    <div className="space-y-2">
                      {traffic.campaigns.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="truncate">
                            {c.source}
                            {c.medium ? ` / ${c.medium}` : ''}
                            {c.campaign ? ` — ${c.campaign}` : ''}
                          </span>
                          <span className="font-medium ml-2">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Device Breakdown + 6. Conversion Funnel ── */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-amber-600" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : !devices || devices.total === 0 ? (
              <p className="text-sm text-muted-foreground italic py-8 text-center">No data</p>
            ) : (
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Desktop', value: devices.desktop },
                          { name: 'Mobile', value: devices.mobile },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        strokeWidth={2}
                      >
                        <Cell fill={DEVICE_COLORS[0]} />
                        <Cell fill={DEVICE_COLORS[1]} />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          background: 'var(--card)',
                          color: 'var(--card-foreground)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Desktop</p>
                      <p className="text-2xl font-bold">{formatNumber(devices.desktop)}</p>
                      <p className="text-xs text-muted-foreground">
                        {devices.total > 0 ? ((devices.desktop / devices.total) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Mobile</p>
                      <p className="text-2xl font-bold">{formatNumber(devices.mobile)}</p>
                      <p className="text-xs text-muted-foreground">
                        {devices.total > 0 ? ((devices.mobile / devices.total) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-purple-600" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : !funnel || funnel.steps.every((s) => s.count === 0) ? (
              <p className="text-sm text-muted-foreground italic py-8 text-center">No data</p>
            ) : (
              <div className="space-y-4">
                {/* Visual funnel bars */}
                {funnel.steps.map((step, i) => {
                  const maxCount = funnel.steps[0]?.count || 1;
                  const pct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
                  const conversionFromPrev =
                    i > 0 && funnel.steps[i - 1].count > 0
                      ? ((step.count / funnel.steps[i - 1].count) * 100).toFixed(1)
                      : null;

                  return (
                    <div key={step.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{step.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{formatNumber(step.count)}</span>
                          {conversionFromPrev && (
                            <span className="text-xs text-muted-foreground">
                              ({conversionFromPrev}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-8 rounded-lg bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, 2)}%`,
                            background: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {/* Overall conversion rate */}
                {funnel.steps.length >= 2 && funnel.steps[0].count > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Overall conversion:{' '}
                      <span className="font-semibold text-foreground">
                        {((funnel.steps[funnel.steps.length - 1].count / funnel.steps[0].count) * 100).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 5. Recent Events ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Recent Events
            {!loading && (
              <span className="text-xs font-normal text-muted-foreground ml-2">
                (last 50, auto-refreshes every 60s)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-8 text-center">No events yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Type</th>
                    <th className="pb-2 pr-4 font-medium">Page</th>
                    <th className="pb-2 pr-4 font-medium">User</th>
                    <th className="pb-2 pr-4 font-medium">Device</th>
                    <th className="pb-2 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-2 pr-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            EVENT_TYPE_COLORS[event.type] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {event.type}
                        </span>
                      </td>
                      <td className="py-2 pr-4 max-w-[200px] truncate text-muted-foreground">
                        {event.page?.path ?? '-'}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {event.user?.email
                          ? event.user.email
                          : event.user?.anonymousId
                            ? event.user.anonymousId.slice(0, 8) + '...'
                            : '-'}
                      </td>
                      <td className="py-2 pr-4">
                        {event.device?.isMobile ? (
                          <Smartphone className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Monitor className="h-4 w-4 text-blue-500" />
                        )}
                      </td>
                      <td className="py-2 text-right text-muted-foreground whitespace-nowrap">
                        {timeAgo(event.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
