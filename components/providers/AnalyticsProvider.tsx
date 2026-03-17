'use client';

/**
 * AnalyticsProvider — Auto-tracking engine
 *
 * Automatically captures:
 *  1. Page views + UTM params  (every route change)
 *  2. Page exits               (time on page in ms, max scroll depth %)
 *  3. Navigation               (from → to paths)
 *  4. Button clicks            (<button> tags via event delegation)
 *  5. Link clicks              (<a> tags via event delegation)
 *  6. Rage clicks              (3+ rapid clicks within 60 px)
 *  7. Scroll depth             (25 / 50 / 75 / 100 % milestones per page)
 *  8. Batch sending            (every 2 s, or at 20 events)
 *  9. sendBeacon on unload     (no events lost during navigation)
 * 10. Session + anonymous IDs  (sessionStorage + 1-year cookie)
 *
 * Manual tracking:
 *   const { track } = useAnalytics();
 *   track('feature_used', { feature: 'ai_scan', tier: 'PRO' });
 *
 * Widget visibility:
 *   const ref = useWidgetTracking('PredictionsWidget');
 *   return <div ref={ref}>...</div>;
 */

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type {
  AnalyticsUser,
  AnalyticsPage,
  FirstLandingPage,
  EventType,
  EventProperties,
  AnalyticsError,
  TrackPayload,
  UtmParams,
} from '@/lib/analytics-events';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AnalyticsContextValue {
  track: (type: EventType, properties?: EventProperties, error?: AnalyticsError) => void;
}

export const AnalyticsContext = createContext<AnalyticsContextValue>({ track: () => {} });

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  try {
    const match = document.cookie.split('; ').find((r) => r.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  } catch { return null; }
}

function setCookie(name: string, value: string): void {
  try {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch { /* sandboxed iframe */ }
}

function getOrCreateAnonymousId(): string {
  const existing = getCookie('ft_uid');
  if (existing) return existing;
  const id = crypto.randomUUID();
  setCookie('ft_uid', id);
  return id;
}

function getOrCreateSessionId(): string {
  try {
    const key = 'ft_session_id';
    let id = sessionStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
    return id;
  } catch { return crypto.randomUUID(); }
}

// ─── UTM helpers ──────────────────────────────────────────────────────────────

function parseUtm(): UtmParams {
  try {
    const p = new URLSearchParams(location.search);
    return {
      utmSource:   p.get('utm_source'),
      utmMedium:   p.get('utm_medium'),
      utmCampaign: p.get('utm_campaign'),
      utmTerm:     p.get('utm_term'),
      utmContent:  p.get('utm_content'),
    };
  } catch {
    return { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null };
  }
}

function getOrSetFirstLandingPage(): FirstLandingPage {
  const raw = getCookie('ft_first_landing');
  if (raw) {
    try { return JSON.parse(raw) as FirstLandingPage; } catch { /* corrupted */ }
  }
  const utm = parseUtm();
  const landing: FirstLandingPage = {
    url: location.href,
    path: location.pathname,
    referrer: document.referrer,
    seenAt: new Date().toISOString(),
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
  };
  setCookie('ft_first_landing', JSON.stringify(landing));
  return landing;
}

// ─── Page info ────────────────────────────────────────────────────────────────

function getPageInfo(locale: string): AnalyticsPage {
  const utm = parseUtm();
  return {
    url: location.href,
    path: location.pathname,
    search: location.search,
    hash: location.hash,
    referrer: document.referrer,
    locale,
    title: document.title,
    ...utm,
  };
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  return {
    userAgent: ua,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    isMobile: /Mobi|Android|iPhone|iPad/i.test(ua),
    platform: navigator.platform ?? 'unknown',
  };
}

// ─── Click target finder ──────────────────────────────────────────────────────

function findTrackableElement(target: EventTarget | null) {
  let el = target as HTMLElement | null;
  let depth = 0;
  while (el && depth < 8) {
    const tag = el.tagName?.toLowerCase();
    if (tag === 'a' || tag === 'button' || el.dataset?.trackEvent) return el;
    el = el.parentElement;
    depth++;
  }
  return null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const BATCH_SIZE = 20;
const FLUSH_INTERVAL_MS = 2000;
const TRACK_URL = '/api/analytics/track';
// Rage click: 3+ clicks with ≤500 ms between consecutive clicks, within RAGE_RADIUS_PX
const RAGE_WINDOW_MS = 500;
const RAGE_RADIUS_PX = 60;
const RAGE_THRESHOLD = 3;

export function AnalyticsProvider({
  children,
  locale = 'en',
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // ── Stable refs ────────────────────────────────────────────────────────────
  const queueRef       = useRef<TrackPayload[]>([]);
  const sessionIdRef   = useRef<string>('');
  const pageViewIdRef  = useRef<string>(crypto.randomUUID()); // new UUID per page
  const localeRef      = useRef(locale);
  localeRef.current    = locale;

  // ── Identity init (client-only) ────────────────────────────────────────────
  const anonymousIdRef   = useRef<string | null>(null);
  const firstLandingRef  = useRef<FirstLandingPage | null>(null);

  useEffect(() => {
    sessionIdRef.current   = getOrCreateSessionId();
    anonymousIdRef.current = getOrCreateAnonymousId();
    firstLandingRef.current = getOrSetFirstLandingPage();
  }, []);

  // ── User ref (synced from session) ─────────────────────────────────────────
  const userRef = useRef<AnalyticsUser>({
    id: null, email: null, businessId: null,
    subscriptionTier: null, role: null,
    anonymousId: null, firstLandingPage: null,
  });

  useEffect(() => {
    const base = {
      anonymousId: anonymousIdRef.current,
      firstLandingPage: firstLandingRef.current,
    };
    if (session?.user) {
      const u = session.user as Record<string, string | undefined>;
      userRef.current = {
        id: u.id ?? null,
        email: u.email ?? null,
        businessId: u.businessId ?? null,
        subscriptionTier: (u.subscriptionTier as AnalyticsUser['subscriptionTier']) ?? null,
        role: (u.role as AnalyticsUser['role']) ?? null,
        ...base,
      };
    } else {
      userRef.current = {
        id: null, email: null, businessId: null,
        subscriptionTier: null, role: null,
        ...base,
      };
    }
  }, [session, anonymousIdRef.current, firstLandingRef.current]);

  // ── Flush ──────────────────────────────────────────────────────────────────
  const flush = useCallback((useBeacon = false) => {
    if (queueRef.current.length === 0) return;
    const batch = queueRef.current.splice(0);
    const body = JSON.stringify(batch.length === 1 ? batch[0] : batch);
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(TRACK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => flush(false), FLUSH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [flush]);

  // ── Core track ─────────────────────────────────────────────────────────────
  const track = useCallback((
    type: EventType,
    properties: EventProperties = {},
    error?: AnalyticsError,
  ) => {
    try {
      const payload: TrackPayload = {
        type,
        sessionId: sessionIdRef.current || getOrCreateSessionId(),
        pageViewId: pageViewIdRef.current,
        user: userRef.current,
        page: getPageInfo(localeRef.current),
        device: getDeviceInfo(),
        properties,
        ...(error ? { error } : {}),
      };
      queueRef.current.push(payload);
      if (queueRef.current.length >= BATCH_SIZE) flush(false);
    } catch { /* never break the app */ }
  }, [flush]);

  // ── Global error capture ────────────────────────────────────────────────────
  useEffect(() => {
    // Capture uncaught JS errors
    const onError = (event: ErrorEvent) => {
      try {
        const ref = `ERR_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        track('error', {
          source: 'window.onerror',
          fileName: event.filename ?? null,
          lineNo: event.lineno ?? null,
          colNo: event.colno ?? null,
        }, {
          ref,
          message: event.message || 'Unknown error',
          stack: event.error?.stack ?? null,
          type: 'runtime',
          component: null,
          severity: 'high',
          digest: null,
        });
      } catch { /* never break the app */ }
    };

    // Capture unhandled promise rejections
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        const ref = `ERR_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const reason = event.reason;
        const message =
          reason instanceof Error ? reason.message :
          typeof reason === 'string' ? reason :
          'Unhandled promise rejection';
        const stack = reason instanceof Error ? reason.stack ?? null : null;
        track('error', {
          source: 'unhandledrejection',
        }, {
          ref,
          message,
          stack,
          type: 'runtime',
          component: null,
          severity: 'high',
          digest: null,
        });
      } catch { /* never break the app */ }
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [track]);

  // ── Page view + exit + scroll ──────────────────────────────────────────────
  const prevPathRef      = useRef<string>('');
  const pageEnterTimeRef = useRef<number>(Date.now());
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const maxScrollPctRef  = useRef<number>(0);

  useEffect(() => {
    if (!pathname || pathname === prevPathRef.current) return;

    const from = prevPathRef.current;

    // Fire page_exit for the previous page
    if (from) {
      const timeOnPageMs = Date.now() - pageEnterTimeRef.current;
      track('page_exit', {
        path: from,
        timeOnPageMs,
        maxScrollDepthPct: maxScrollPctRef.current,
      });
    }

    // Reset per-page state
    pageViewIdRef.current = crypto.randomUUID();
    pageEnterTimeRef.current = Date.now();
    scrollMilestonesRef.current = new Set();
    maxScrollPctRef.current = 0;
    prevPathRef.current = pathname;

    const timer = setTimeout(() => {
      track('page_view', { from: from || null });
      if (from) track('navigation', { from, to: pathname });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, track]);

  // Flush + page_exit on tab close / browser close
  useEffect(() => {
    const handler = () => {
      const timeOnPageMs = Date.now() - pageEnterTimeRef.current;
      track('page_exit', {
        path: prevPathRef.current,
        timeOnPageMs,
        maxScrollDepthPct: maxScrollPctRef.current,
      });
      flush(true);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [flush, track]);

  // ── Scroll depth ───────────────────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        try {
          const scrolled = window.scrollY + window.innerHeight;
          const total = document.documentElement.scrollHeight;
          if (total <= 0) return;

          const pct = Math.round((scrolled / total) * 100);
          if (pct > maxScrollPctRef.current) maxScrollPctRef.current = pct;

          for (const milestone of [25, 50, 75, 100]) {
            if (pct >= milestone && !scrollMilestonesRef.current.has(milestone)) {
              scrollMilestonesRef.current.add(milestone);
              track('scroll_depth', { depthPct: milestone });
            }
          }
        } catch { /* ignore */ }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [track]);

  // ── Click tracking + rage click ────────────────────────────────────────────
  useEffect(() => {
    // Rage click buffer: { x, y, t }[]
    const clickBuf: { x: number; y: number; t: number }[] = [];

    const handleClick = (e: MouseEvent) => {
      try {
        // ── Rage click detection ──────────────────────────────────────────
        const now = Date.now();
        clickBuf.push({ x: e.clientX, y: e.clientY, t: now });
        // Prune: remove from front while consecutive gap > 500ms
        while (clickBuf.length >= 2 && clickBuf[1].t - clickBuf[0].t > RAGE_WINDOW_MS) {
          clickBuf.shift();
        }
        if (clickBuf.length >= RAGE_THRESHOLD) {
          // Check if all are within RAGE_RADIUS_PX of the first click
          const { x: x0, y: y0 } = clickBuf[0];
          const allClose = clickBuf.every(
            (c) => Math.hypot(c.x - x0, c.y - y0) <= RAGE_RADIUS_PX,
          );
          if (allClose) {
            const el = findTrackableElement(e.target);
            const targetEl = e.target as HTMLElement | null;
            const selector = targetEl
              ? `${targetEl.tagName?.toLowerCase() ?? ''}${targetEl.id ? `#${targetEl.id}` : ''}${targetEl.className ? `.${String(targetEl.className).split(' ').filter(Boolean).slice(0, 2).join('.')}` : ''}`
              : null;
            track('rage_click', {
              x: Math.round(e.clientX),
              y: Math.round(e.clientY),
              count: clickBuf.length,
              intervalMs: now - clickBuf[0].t,
              component: el?.dataset?.trackComponent ?? null,
              targetText: (el?.textContent ?? '').trim().slice(0, 60),
              targetSelector: selector,
            });
            clickBuf.length = 0; // reset after reporting
          }
        }

        // ── Normal click tracking ─────────────────────────────────────────
        const el = findTrackableElement(e.target);
        if (!el) return;
        const tag = el.tagName.toLowerCase();
        const { dataset } = el;

        if (dataset.trackEvent) {
          track(dataset.trackEvent as EventType, {
            name: dataset.trackName ?? null,
            component: dataset.trackComponent ?? null,
            feature: dataset.trackFeature ?? null,
          });
          return;
        }

        if (tag === 'a') {
          const anchor = el as HTMLAnchorElement;
          const href = anchor.getAttribute('href') ?? '';
          track('link_click', {
            href,
            text: (el.textContent ?? '').trim().slice(0, 100),
            isExternal: href.startsWith('http') && !href.includes(location.hostname),
            component: dataset.trackComponent ?? null,
          });
        } else if (tag === 'button') {
          const btn = el as HTMLButtonElement;
          track('button_click', {
            text: (el.textContent ?? '').trim().slice(0, 100),
            name: btn.name || btn.id || null,
            type: btn.type || 'button',
            component: dataset.trackComponent ?? null,
            form: btn.form?.id ?? null,
          });
        }
      } catch { /* never break the UI */ }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [track]);

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
