/**
 * POST /api/analytics/track
 *
 * Accepts a single TrackPayload or an array (batch) from the client.
 * Returns 202 immediately — fire-and-forget, never blocks the UI.
 *
 * No auth required — we track anonymous visitors too.
 * Rate limited per sessionId (200 events / minute).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getEventsCollection, ensureAnalyticsIndexes } from '@/lib/mongodb-analytics';
import type { AnalyticsEvent, TrackPayload } from '@/lib/analytics-events';

// — Zod schema for payload validation —

const FirstLandingSchema = z.object({
  url: z.string(),
  path: z.string(),
  referrer: z.string(),
  seenAt: z.string(),
  utmSource:   z.string().nullable().default(null),
  utmMedium:   z.string().nullable().default(null),
  utmCampaign: z.string().nullable().default(null),
});

const UserSchema = z.object({
  id: z.string().nullable(),
  email: z.string().nullable(),
  businessId: z.string().nullable(),
  subscriptionTier: z.enum(['FREE', 'PRO', 'ENTERPRISE']).nullable(),
  role: z.enum(['OWNER', 'EMPLOYEE']).nullable(),
  /** Persistent anonymous visitor ID from ft_uid cookie */
  anonymousId: z.string().nullable().default(null),
  /** First page the visitor ever landed on (ft_first_landing cookie) */
  firstLandingPage: FirstLandingSchema.nullable().default(null),
});

const PageSchema = z.object({
  url: z.string(),
  path: z.string(),
  search: z.string(),
  hash: z.string(),
  referrer: z.string(),
  locale: z.string(),
  title: z.string(),
  // UTM marketing attribution
  utmSource:   z.string().nullable().default(null),
  utmMedium:   z.string().nullable().default(null),
  utmCampaign: z.string().nullable().default(null),
  utmTerm:     z.string().nullable().default(null),
  utmContent:  z.string().nullable().default(null),
});

const DeviceSchema = z.object({
  userAgent: z.string(),
  language: z.string(),
  timezone: z.string(),
  screenWidth: z.number(),
  screenHeight: z.number(),
  viewportWidth: z.number(),
  viewportHeight: z.number(),
  isMobile: z.boolean(),
  platform: z.string(),
});

const ErrorSchema = z.object({
  ref: z.string(),
  message: z.string(),
  stack: z.string().nullable(),
  type: z.enum(['runtime', 'network', 'auth', 'validation', 'unknown']),
  component: z.string().nullable(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  digest: z.string().nullable(),
});

const EventTypeSchema = z.enum([
  'page_view',
  'page_exit',
  'navigation',
  'click',
  'button_click',
  'link_click',
  'rage_click',
  'form_submit',
  'form_error',
  'feature_used',
  'search',
  'filter_change',
  'widget_visible',
  'scroll_depth',
  'api_call',
  'auth_login',
  'auth_logout',
  'auth_register',
  'error',
]);

const TrackPayloadSchema = z.object({
  type: EventTypeSchema,
  sessionId: z.string().min(1).max(128),
  /** UUID per page navigation — groups all events from one page visit */
  pageViewId: z.string().min(1).max(128),
  user: UserSchema,
  page: PageSchema,
  device: DeviceSchema,
  properties: z.record(z.string(), z.unknown()).default({}),
  error: ErrorSchema.optional(),
});

// Allow a single payload or a batch of up to 50
const BodySchema = z.union([
  TrackPayloadSchema,
  z.array(TrackPayloadSchema).min(1).max(50),
]);

// — Simple in-memory rate limiter (per sessionId, resets per minute) —
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_EVENTS_PER_MINUTE = 200;

function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count += 1;

  if (entry.count > MAX_EVENTS_PER_MINUTE) return true;

  return false;
}

// Ensure indexes once per server boot
let indexesEnsured = false;
async function ensureIndexesOnce() {
  if (indexesEnsured) return;
  try {
    await ensureAnalyticsIndexes();
    indexesEnsured = true;
  } catch (err) {
    // Non-critical — indexes will be created on next successful call
    console.warn('[analytics/track] ensureAnalyticsIndexes failed:', err instanceof Error ? err.message : err);
  }
}

function extractIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; first entry is the client
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? null;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const ip = extractIp(request);

  // Must await processing before returning — on Vercel serverless,
  // the function is frozen/killed once the response is sent, so
  // fire-and-forget background work never completes.
  try {
    await processEvents(rawBody, ip);
  } catch (err) {
    // Analytics must never break the app — but log so we can debug
    console.error('[analytics/track] Failed to process events:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}

async function processEvents(rawBody: string, ip: string | null): Promise<void> {
  await ensureIndexesOnce();

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    console.warn('[analytics/track] Malformed JSON body — dropping');
    return;
  }

  const result = BodySchema.safeParse(parsed);
  if (!result.success) {
    console.warn('[analytics/track] Zod validation failed:', result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '));
    return;
  }

  const payloads: TrackPayload[] = Array.isArray(result.data)
    ? result.data
    : [result.data];

  if (payloads.length === 0) return;

  const sessionId = payloads[0].sessionId;

  // Rate limit check
  if (isRateLimited(sessionId)) return;

  const col = await getEventsCollection();

  // Build event documents — server always stamps the timestamp
  const events: AnalyticsEvent[] = payloads.map((payload) => ({
    eventId: crypto.randomUUID(),
    type: payload.type,
    timestamp: new Date(), // server-authoritative
    sessionId: payload.sessionId,
    pageViewId: payload.pageViewId,
    ip,
    user: {
      ...payload.user,
      id: payload.user.id ?? null,
    },
    page: payload.page,
    device: payload.device,
    properties: payload.properties,
    ...(payload.error ? { error: payload.error } : {}),
  }));

  if (events.length === 1) {
    await col.insertOne(events[0]);
  } else {
    await col.insertMany(events, { ordered: false });
  }
}
