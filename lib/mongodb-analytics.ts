/**
 * MongoDB Analytics Client
 *
 * Singleton pattern (mirrors lib/prisma.ts) to reuse connections
 * across hot reloads in development and across requests in production.
 *
 * Uses a SEPARATE MongoDB database from the main Supabase/PostgreSQL —
 * analytics is high-write, schema-flexible, and suits the document model.
 *
 * Required env: MONGODB_ANALYTICS_URI
 */

import { MongoClient, type Collection, type Db } from 'mongodb';
import type { AnalyticsEvent } from './analytics-events';

const ANALYTICS_DB = 'foodtracks-analytics';
const EVENTS_COLLECTION = 'events';

// — Singleton connection cache (survives hot reload in dev) —
const globalForMongo = globalThis as unknown as {
  _mongoAnalyticsClient: MongoClient | undefined;
};

function getClient(): MongoClient {
  if (!process.env.MONGODB_ANALYTICS_URI) {
    throw new Error('MONGODB_ANALYTICS_URI environment variable is not set.');
  }

  if (!globalForMongo._mongoAnalyticsClient) {
    globalForMongo._mongoAnalyticsClient = new MongoClient(
      process.env.MONGODB_ANALYTICS_URI,
      {
        // Keep connections alive
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      }
    );
  }

  return globalForMongo._mongoAnalyticsClient;
}

/** Returns the connected analytics database */
export async function getAnalyticsDb(): Promise<Db> {
  const client = getClient();
  await client.connect();
  return client.db(ANALYTICS_DB);
}

/** Returns the `events` collection with the AnalyticsEvent type */
export async function getEventsCollection(): Promise<Collection<AnalyticsEvent>> {
  const db = await getAnalyticsDb();
  return db.collection<AnalyticsEvent>(EVENTS_COLLECTION);
}

/**
 * Ensures all required indexes exist on the events collection.
 * Call once on app startup (or via a migration script).
 * Safe to call multiple times — MongoDB ignores existing indexes.
 */
export async function ensureAnalyticsIndexes(): Promise<void> {
  const col = await getEventsCollection();

  await col.createIndexes([
    // Time-range queries (most common)
    { key: { timestamp: -1 }, name: 'timestamp_desc' },
    // Filter by event type + time
    { key: { type: 1, timestamp: -1 }, name: 'type_timestamp' },
    // Per-business analytics dashboards
    { key: { 'user.businessId': 1, timestamp: -1 }, name: 'business_timestamp' },
    // Session replay / funnel analysis
    { key: { sessionId: 1, timestamp: 1 }, name: 'session_timeline' },
    // Error lookup by reference (support tickets)
    { key: { 'error.ref': 1 }, name: 'error_ref', sparse: true },
    // Per-page analytics
    { key: { 'page.path': 1, timestamp: -1 }, name: 'page_path_timestamp' },
    // Per-user analytics (authenticated)
    { key: { 'user.id': 1, timestamp: -1 }, name: 'user_timestamp', sparse: true },
    // Per-visitor analytics — cross-session journey (anonymous → registered)
    { key: { 'user.anonymousId': 1, timestamp: -1 }, name: 'anonymous_id_timestamp' },
    // First landing page aggregations (acquisition source analysis)
    { key: { 'user.firstLandingPage.path': 1 }, name: 'first_landing_path', sparse: true },
    // Per-page-view grouping: time-on-page, scroll, rage clicks on the same visit
    { key: { pageViewId: 1 }, name: 'page_view_id' },
    // UTM attribution queries
    { key: { 'page.utmSource': 1, timestamp: -1 }, name: 'utm_source_timestamp', sparse: true },
    { key: { 'page.utmCampaign': 1, timestamp: -1 }, name: 'utm_campaign_timestamp', sparse: true },
  ]);
}
