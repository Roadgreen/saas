/**
 * Server-side event tracking — writes directly to MongoDB Analytics.
 *
 * Called from API routes where a client-side provider is not available.
 * All client-side tracking (clicks, page views, navigation) is handled
 * by AnalyticsProvider in components/providers/AnalyticsProvider.tsx.
 *
 * Usage:
 *   trackEvent('feature_used', { feature: 'recipe_created', businessId, userId });
 *   trackEvent('auth_register', { email, businessId });
 */

import { getEventsCollection } from './mongodb-analytics';
import type { EventType } from './analytics-events';

/**
 * Legacy compatibility: maps old uppercase event names → new EventType.
 * New callers should pass EventType directly.
 */
const LEGACY_EVENT_MAP: Record<string, EventType> = {
  USER_REGISTERED: 'auth_register',
  RECIPE_CREATED: 'feature_used',
  SALE_RECORDED: 'feature_used',
  SALE_UPDATED: 'feature_used',
  ORDER_CREATED: 'feature_used',
  STOCK_UPDATED: 'feature_used',
  ORDER_ITEM_UPDATED: 'feature_used',
};

export async function trackEvent(event: string, data: Record<string, unknown> = {}) {
  // Fire-and-forget — never block the API response
  setImmediate(async () => {
    try {
      const type: EventType = LEGACY_EVENT_MAP[event] ?? 'feature_used';

      const col = await getEventsCollection();
      await col.insertOne({
        eventId: crypto.randomUUID(),
        type,
        timestamp: new Date(),
        sessionId: 'server',
        pageViewId: 'server',
        user: {
          id: (data.userId as string) ?? null,
          email: (data.email as string) ?? null,
          businessId: (data.businessId as string) ?? null,
          subscriptionTier: null,
          role: null,
          // Server-side events have no browser cookie context
          anonymousId: null,
          firstLandingPage: null,
        },
        page: {
          url: '',
          path: '',
          search: '',
          hash: '',
          referrer: '',
          locale: '',
          title: '',
          utmSource: null,
          utmMedium: null,
          utmCampaign: null,
          utmTerm: null,
          utmContent: null,
        },
        device: {
          userAgent: 'server',
          language: '',
          timezone: '',
          screenWidth: 0,
          screenHeight: 0,
          viewportWidth: 0,
          viewportHeight: 0,
          isMobile: false,
          platform: 'server',
        },
        properties: {
          // Preserve the original event name for filtering
          serverEvent: event,
          ...data,
        },
      });
    } catch {
      // Analytics must never break the app
    }
  });
}
