/**
 * Analytics Event Types & Schema
 *
 * All events tracked in MongoDB follow this structure.
 * Add new EventTypes here as the product grows.
 */

export type EventType =
  // Navigation
  | 'page_view'          // auto: every route change
  | 'page_exit'          // auto: on navigation away / unload (includes timeOnPageMs)
  | 'navigation'         // auto: from/to paths
  // Interactions
  | 'click'
  | 'button_click'       // auto: any <button>
  | 'link_click'         // auto: any <a>
  | 'rage_click'         // auto: 3+ rapid clicks in same zone (frustration signal)
  // Forms
  | 'form_submit'
  | 'form_error'
  // Features
  | 'feature_used'
  | 'search'
  | 'filter_change'
  // Dashboard-specific
  | 'widget_visible'     // hook: widget enters viewport (Intersection Observer)
  | 'scroll_depth'       // auto: 25 / 50 / 75 / 100 % milestones per page
  // API
  | 'api_call'
  // Auth
  | 'auth_login'
  | 'auth_logout'
  | 'auth_register'
  // Errors
  | 'error';

// ─── UTM params ───────────────────────────────────────────────────────────────

export interface UtmParams {
  utmSource: string | null;    // utm_source  e.g. "google"
  utmMedium: string | null;    // utm_medium  e.g. "cpc"
  utmCampaign: string | null;  // utm_campaign
  utmTerm: string | null;      // utm_term
  utmContent: string | null;   // utm_content
}

// ─── Visitor identity ─────────────────────────────────────────────────────────

export interface FirstLandingPage {
  /** Full URL of the very first page the visitor ever loaded */
  url: string;
  /** Pathname only e.g. /en/pricing */
  path: string;
  /** The referrer at the time of first visit (traffic source) */
  referrer: string;
  /** ISO timestamp of the first visit */
  seenAt: string;
  /** UTM params present on the first landing URL */
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

export interface AnalyticsUser {
  /** NextAuth user id — null for anonymous visitors */
  id: string | null;
  email: string | null;
  businessId: string | null;
  subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE' | null;
  role: 'OWNER' | 'EMPLOYEE' | null;
  /**
   * Persistent anonymous identifier stored in a 1-year cookie (ft_uid).
   * Survives across sessions and links pre-login behaviour to post-login.
   */
  anonymousId: string | null;
  /**
   * The first page the visitor ever landed on (ft_first_landing cookie).
   * Written once, never overwritten — acquisition / funnel analysis.
   */
  firstLandingPage: FirstLandingPage | null;
}

// ─── Page context ─────────────────────────────────────────────────────────────

export interface AnalyticsPage extends UtmParams {
  /** Full URL e.g. https://foodtracks.io/en/dashboard */
  url: string;
  /** Pathname e.g. /en/dashboard */
  path: string;
  /** Query string e.g. ?filter=expired */
  search: string;
  hash: string;
  /** document.referrer */
  referrer: string;
  /** Active i18n locale */
  locale: string;
  /** document.title */
  title: string;
}

// ─── Device context ───────────────────────────────────────────────────────────

export interface AnalyticsDevice {
  userAgent: string;
  /** Navigator language e.g. "en-US" */
  language: string;
  /** IANA timezone e.g. "Europe/Paris" */
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  isMobile: boolean;
  /** navigator.platform */
  platform: string;
}

// ─── Error context ────────────────────────────────────────────────────────────

export interface AnalyticsError {
  /**
   * Human-readable error reference for support tickets.
   * Format: ERR_<timestamp>_<random6>
   * e.g.  ERR_1709036400000_ab3f2c
   */
  ref: string;
  message: string;
  stack: string | null;
  /** Broad category of the error */
  type: 'runtime' | 'network' | 'auth' | 'validation' | 'unknown';
  /** React component or page name where the error occurred */
  component: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Next.js error digest (from error.digest) */
  digest: string | null;
}

/** Properties vary by event type — see EVENT_PROPERTIES_DOCS below */
export type EventProperties = Record<string, unknown>;

// ─── Full event document (stored in MongoDB) ──────────────────────────────────

export interface AnalyticsEvent {
  /** UUID v4 — unique event identifier */
  eventId: string;
  type: EventType;
  /**
   * Server-assigned timestamp (client value is ignored to prevent clock skew).
   */
  timestamp: Date;
  /** UUID persisted in sessionStorage — ties events to a browser session */
  sessionId: string;
  /** Client IP from x-forwarded-for / x-real-ip — server-extracted */
  ip: string | null;
  /**
   * UUID generated fresh on every page navigation.
   * Groups all events that happen on a single page visit:
   * clicks, scroll depths, rage clicks, the final page_exit.
   * Enables time-on-page and per-page funnel analysis.
   */
  pageViewId: string;
  user: AnalyticsUser;
  page: AnalyticsPage;
  device: AnalyticsDevice;
  /** Event-specific payload — see EVENT_PROPERTIES_DOCS */
  properties: EventProperties;
  /** Only present on type === 'error' events */
  error?: AnalyticsError;
}

// ─── Client payload (POST body) ───────────────────────────────────────────────

export interface TrackPayload {
  type: EventType;
  sessionId: string;
  pageViewId: string;
  user: AnalyticsUser;
  page: AnalyticsPage;
  device: AnalyticsDevice;
  properties: EventProperties;
  error?: AnalyticsError;
}

/**
 * EVENT PROPERTIES DOCUMENTATION
 *
 * page_view       : { referrer }  — auto-captured
 * page_exit       : { timeOnPageMs, maxScrollDepthPct }  — auto-captured
 * navigation      : { from, to }  — auto-captured
 * button_click    : { text, name, id, type, component, form }
 * link_click      : { href, text, isExternal, component }
 * rage_click      : { x, y, count, intervalMs, component }
 * scroll_depth    : { depthPct: 25 | 50 | 75 | 100 }  — auto-captured
 * widget_visible  : { widget, visibilityRatio }  — via useWidgetTracking()
 * form_submit     : { formName, success, fieldCount }
 * form_error      : { formName, field, errorMessage }
 * api_call        : { endpoint, method, status, durationMs }
 * error           : see AnalyticsError (.error field)
 * auth_login      : { method: 'credentials' }
 * auth_logout     : {}
 * auth_register   : {}
 * feature_used    : { feature, tier }
 * search          : { query, resultCount }
 * filter_change   : { filterName, value }
 */

/** Generates a unique error reference for support tickets */
export function generateErrorRef(): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `ERR_${Date.now()}_${random}`;
}
