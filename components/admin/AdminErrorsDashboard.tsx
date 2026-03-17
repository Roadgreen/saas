'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Bug,
  AlertTriangle,
  MousePointerClick,
  ServerCrash,
  Globe,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Monitor,
  Smartphone,
  Clock,
  Hash,
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// ── Types ──

interface OverviewData {
  errorCount: number;
  rageClickCount: number;
  serverErrorCount: number;
  affectedPages: number;
  affectedSessions: number;
}

interface ErrorByType {
  type: string;
  count: number;
}

interface ErrorOverTime {
  label: string;
  errors: number;
  rageClicks: number;
  total: number;
}

interface ErrorEvent {
  eventId: string;
  type: string;
  timestamp: string;
  sessionId: string;
  page?: { path: string; url: string };
  user?: { email: string | null; anonymousId: string | null };
  device?: { userAgent: string; isMobile: boolean };
  properties?: Record<string, unknown>;
  error?: {
    ref: string;
    message: string;
    stack: string | null;
    type: string;
    component: string | null;
    severity: string;
    digest: string | null;
  };
}

interface RageClickLocation {
  page: string;
  targetText: string | null;
  component: string | null;
  count: number;
  lastSeen: string;
  avgClicks: number;
}

interface RageClickEvent {
  eventId: string;
  timestamp: string;
  sessionId: string;
  page?: { path: string };
  user?: { email: string | null; anonymousId: string | null };
  device?: { isMobile: boolean };
  properties?: Record<string, unknown>;
}

interface TopError {
  message: string;
  count: number;
  lastSeen: string;
  firstSeen: string;
  severity: string;
  errorType: string;
  affectedPages: number;
}

// ── Constants ──

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const TYPE_COLORS: Record<string, string> = {
  error: '#ef4444',
  rage_click: '#f59e0b',
  server_error: '#dc2626',
  runtime_error: '#f97316',
  unhandled_rejection: '#e11d48',
  unknown: '#6b7280',
};

const PIE_COLORS = ['#ef4444', '#f59e0b', '#dc2626', '#f97316', '#e11d48', '#8b5cf6', '#6b7280', '#06b6d4'];

type ErrorTypeFilter = '' | 'error' | 'rage_click' | '500_error';

// ── Helpers ──

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateUA(ua: string): string {
  if (!ua) return '-';
  // Extract browser name and version
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)[/\s](\d+)/);
  if (match) return `${match[1]} ${match[2]}`;
  if (ua.length > 40) return ua.slice(0, 40) + '...';
  return ua;
}

function getDefaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
}

function getDefaultTo(): string {
  return new Date().toISOString().split('T')[0];
}

// ── Component ──

export default function AdminErrorsDashboard() {
  const t = useTranslations('AdminErrors');
  const locale = useLocale();

  // Filters
  const [dateFrom, setDateFrom] = useState(getDefaultFrom);
  const [dateTo, setDateTo] = useState(getDefaultTo);
  const [errorType, setErrorType] = useState<ErrorTypeFilter>('');
  const [pageFilter, setPageFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Data
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [errorsByType, setErrorsByType] = useState<ErrorByType[]>([]);
  const [errorsOverTime, setErrorsOverTime] = useState<ErrorOverTime[]>([]);
  const [recentErrors, setRecentErrors] = useState<ErrorEvent[]>([]);
  const [recentErrorsTotal, setRecentErrorsTotal] = useState(0);
  const [rageClickLocations, setRageClickLocations] = useState<RageClickLocation[]>([]);
  const [rageClickEvents, setRageClickEvents] = useState<RageClickEvent[]>([]);
  const [topErrors, setTopErrors] = useState<TopError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const buildParams = useCallback(
    (section: string, extra?: Record<string, string>) => {
      const params: Record<string, string> = {
        section,
        from: new Date(dateFrom).toISOString(),
        to: new Date(dateTo + 'T23:59:59').toISOString(),
      };
      if (errorType) params.errorType = errorType;
      if (pageFilter.trim()) params.page = pageFilter.trim();
      if (extra) Object.assign(params, extra);
      return new URLSearchParams(params).toString();
    },
    [dateFrom, dateTo, errorType, pageFilter]
  );

  const fetchSection = useCallback(
    async (section: string, extra?: Record<string, string>) => {
      const res = await fetch(`/api/admin/errors?${buildParams(section, extra)}`);
      if (!res.ok) throw new Error(`Failed to fetch ${section}`);
      return res.json();
    },
    [buildParams]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, byType, overTime, errorsData, rageData, topErrorsData] =
        await Promise.all([
          fetchSection('overview'),
          fetchSection('errors-by-type'),
          fetchSection('errors-over-time'),
          fetchSection('recent-errors', {
            limit: String(pageSize),
            offset: String(page * pageSize),
          }),
          fetchSection('rage-clicks'),
          fetchSection('top-errors'),
        ]);

      setOverview(overviewData);
      setErrorsByType(byType);
      setErrorsOverTime(overTime);
      setRecentErrors(errorsData.events);
      setRecentErrorsTotal(errorsData.totalCount);
      setRageClickLocations(rageData.locations);
      setRageClickEvents(rageData.recentClicks);
      setTopErrors(topErrorsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load error data');
    } finally {
      setLoading(false);
    }
  }, [fetchSection, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const totalPages = Math.ceil(recentErrorsTotal / pageSize);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/analytics`}
            className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors"
            title={t('backToAnalytics')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
              filtersOpen ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'
            }`}
          >
            <Filter className="h-4 w-4" />
            {t('filters')}
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors disabled:opacity-50"
            title={t('refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('dateFrom')}</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('dateTo')}</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('errorType')}</label>
                <select
                  value={errorType}
                  onChange={(e) => { setErrorType(e.target.value as ErrorTypeFilter); setPage(0); }}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">{t('allTypes')}</option>
                  <option value="error">{t('jsErrors')}</option>
                  <option value="rage_click">{t('rageClicks')}</option>
                  <option value="500_error">{t('serverErrors')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('pageFilter')}</label>
                <input
                  type="text"
                  value={pageFilter}
                  onChange={(e) => { setPageFilter(e.target.value); setPage(0); }}
                  placeholder={t('pageFilterPlaceholder')}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalErrors')}</CardTitle>
            <div className="rounded-md bg-red-100 dark:bg-red-900/30 p-2">
              <Bug className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {loading ? '...' : formatNumber(overview?.errorCount ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('rageClicks')}</CardTitle>
            <div className="rounded-md bg-amber-100 dark:bg-amber-900/30 p-2">
              <MousePointerClick className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {loading ? '...' : formatNumber(overview?.rageClickCount ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 dark:border-rose-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('serverErrors500')}</CardTitle>
            <div className="rounded-md bg-rose-100 dark:bg-rose-900/30 p-2">
              <ServerCrash className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {loading ? '...' : formatNumber(overview?.serverErrorCount ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('affectedPages')}</CardTitle>
            <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-2">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(overview?.affectedPages ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('affectedSessions')}</CardTitle>
            <div className="rounded-md bg-purple-100 dark:bg-purple-900/30 p-2">
              <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(overview?.affectedSessions ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Errors Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              {t('errorsOverTime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : errorsOverTime.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-8 text-center">{t('noData')}</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorsOverTime} margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      stroke="var(--muted-foreground)"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="var(--muted-foreground)"
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--card)',
                        color: 'var(--card-foreground)',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      name={t('errors')}
                    />
                    <Line
                      type="monotone"
                      dataKey="rageClicks"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      name={t('rageClicks')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Types Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {t('errorsByType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : errorsByType.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-8 text-center">{t('noData')}</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={errorsByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={75}
                        dataKey="count"
                        nameKey="type"
                        strokeWidth={2}
                      >
                        {errorsByType.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
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
                <div className="space-y-2 flex-1">
                  {errorsByType.map((item, i) => (
                    <div key={item.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span>{item.type}</span>
                      </div>
                      <span className="font-medium">{formatNumber(item.count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Errors */}
      {!loading && topErrors.length > 0 && (
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {t('topErrors')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {topErrors.map((err, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium break-all leading-snug flex-1">
                      {err.message && err.message.length > 150
                        ? err.message.slice(0, 150) + '...'
                        : err.message || t('unknownError')}
                    </p>
                    <span className="text-sm font-bold whitespace-nowrap text-red-600">
                      {err.count}x
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                        SEVERITY_STYLES[err.severity] ?? SEVERITY_STYLES.low
                      }`}
                    >
                      {err.severity}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-medium">
                      {err.errorType}
                    </span>
                    {err.errorType === 'server_error' && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 font-medium">
                        500
                      </span>
                    )}
                    <span>{t('affectedPagesCount', { count: err.affectedPages })}</span>
                    <span>{t('firstSeen')}: {formatDate(err.firstSeen)}</span>
                    <span>{t('lastSeen')}: {timeAgo(err.lastSeen)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rage Click Locations */}
      {!loading && rageClickLocations.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-amber-600" />
              {t('rageClickLocations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">{t('page')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('target')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('component')}</th>
                    <th className="pb-2 pr-4 font-medium text-right">{t('occurrences')}</th>
                    <th className="pb-2 pr-4 font-medium text-right">{t('avgClicks')}</th>
                    <th className="pb-2 font-medium text-right">{t('lastSeen')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rageClickLocations.map((loc, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-2 pr-4 max-w-[200px] truncate">{loc.page ?? '-'}</td>
                      <td className="py-2 pr-4 max-w-[150px] truncate text-muted-foreground">
                        {loc.targetText ? `"${loc.targetText}"` : '-'}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {loc.component ? (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{loc.component}</code>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2 pr-4 text-right font-medium text-amber-600">{loc.count}</td>
                      <td className="py-2 pr-4 text-right text-muted-foreground">
                        {loc.avgClicks ? Math.round(loc.avgClicks) : '-'}
                      </td>
                      <td className="py-2 text-right text-muted-foreground whitespace-nowrap">
                        {timeAgo(loc.lastSeen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Errors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600" />
            {t('recentErrors')}
            {!loading && (
              <span className="text-xs font-normal text-muted-foreground ml-2">
                ({recentErrorsTotal} {t('total')})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : recentErrors.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-8 text-center">{t('noErrors')}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">{t('type')}</th>
                      <th className="pb-2 pr-3 font-medium">{t('severity')}</th>
                      <th className="pb-2 pr-3 font-medium">{t('message')}</th>
                      <th className="pb-2 pr-3 font-medium">{t('page')}</th>
                      <th className="pb-2 pr-3 font-medium hidden lg:table-cell">{t('userAgent')}</th>
                      <th className="pb-2 font-medium text-right">{t('time')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentErrors.map((evt, i) => {
                      const isServerError = evt.error?.type === 'server_error';
                      return (
                        <tr
                          key={i}
                          className={`border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors ${
                            isServerError ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                          }`}
                        >
                          <td className="py-2 pr-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                evt.type === 'rage_click'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              }`}
                            >
                              {evt.type === 'rage_click' ? t('rageClick') : evt.error?.type ?? 'error'}
                              {isServerError && ' (500)'}
                            </span>
                          </td>
                          <td className="py-2 pr-3">
                            {evt.error?.severity ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                  SEVERITY_STYLES[evt.error.severity] ?? SEVERITY_STYLES.low
                                }`}
                              >
                                {evt.error.severity}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-2 pr-3 max-w-[250px]">
                            {evt.type === 'rage_click' ? (
                              <span className="text-sm text-muted-foreground">
                                {evt.properties?.targetText
                                  ? `"${String(evt.properties.targetText)}"`
                                  : t('rageClickOn')}{' '}
                                {evt.properties?.count && `(${evt.properties.count}x)`}
                              </span>
                            ) : (
                              <>
                                <p className="truncate text-sm" title={evt.error?.message}>
                                  {evt.error?.message ?? '-'}
                                </p>
                                {evt.error?.stack && (
                                  <details className="mt-1">
                                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                      Stack trace
                                    </summary>
                                    <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
                                      {evt.error.stack}
                                    </pre>
                                  </details>
                                )}
                              </>
                            )}
                          </td>
                          <td className="py-2 pr-3 max-w-[150px] truncate text-muted-foreground">
                            {evt.page?.path ?? '-'}
                          </td>
                          <td className="py-2 pr-3 text-muted-foreground hidden lg:table-cell max-w-[120px] truncate">
                            <div className="flex items-center gap-1.5">
                              {evt.device?.isMobile ? (
                                <Smartphone className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                              ) : (
                                <Monitor className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                              )}
                              <span className="truncate" title={evt.device?.userAgent}>
                                {truncateUA(evt.device?.userAgent ?? '')}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 text-right text-muted-foreground whitespace-nowrap">
                            {formatDate(evt.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {t('showing')} {page * pageSize + 1}-{Math.min((page + 1) * pageSize, recentErrorsTotal)} {t('of')} {recentErrorsTotal}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm px-2">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
