/**
 * GET /api/admin/analytics
 *
 * Returns aggregated analytics data from MongoDB for the admin dashboard.
 * Protected: only foodtracksio@gmail.com can access.
 *
 * Query params:
 *   ?section=overview|top-pages|traffic-sources|devices|recent-events|funnel|errors-rage-clicks
 *   &period=today|7d|30d  (default: 7d, used by overview)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEventsCollection } from '@/lib/mongodb-analytics';

const ADMIN_EMAIL = 'foodtracksio@gmail.com';

function startOfDay(daysAgo: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function periodToDaysAgo(period: string): number {
  switch (period) {
    case 'today': return 0;
    case '7d': return 7;
    case '30d': return 30;
    default: return 7;
  }
}

export async function GET(request: NextRequest) {
  // Auth check — allow ADMIN role or the specific admin email
  const session = await auth();
  const isAdmin =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email === ADMIN_EMAIL;
  if (!session?.user?.email || !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') ?? 'overview';
  const period = searchParams.get('period') ?? '7d';

  try {
    const col = await getEventsCollection();
    const since = startOfDay(periodToDaysAgo(period));

    switch (section) {
      // ── Overview: unique visitors, sessions, page views ──
      case 'overview': {
        const [visitors, sessions, pageViews] = await Promise.all([
          col.distinct('user.anonymousId', {
            timestamp: { $gte: since },
            'user.anonymousId': { $ne: null },
          }),
          col.distinct('sessionId', {
            timestamp: { $gte: since },
          }),
          col.countDocuments({
            type: 'page_view',
            timestamp: { $gte: since },
          }),
        ]);

        return NextResponse.json({
          visitors: visitors.length,
          sessions: sessions.length,
          pageViews,
          period,
        });
      }

      // ── Top Pages ──
      case 'top-pages': {
        const pipeline = [
          { $match: { type: 'page_view', timestamp: { $gte: since } } },
          { $group: { _id: '$page.path', count: { $sum: 1 } } },
          { $sort: { count: -1 as const } },
          { $limit: 20 },
          { $project: { _id: 0, path: '$_id', count: 1 } },
        ];
        const results = await col.aggregate(pipeline).toArray();
        return NextResponse.json(results);
      }

      // ── Traffic Sources ──
      case 'traffic-sources': {
        const [referrers, campaigns] = await Promise.all([
          col.aggregate([
            {
              $match: {
                type: 'page_view',
                timestamp: { $gte: since },
                'page.referrer': { $ne: '' },
              },
            },
            {
              $group: {
                _id: '$page.referrer',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 as const } },
            { $limit: 15 },
            { $project: { _id: 0, referrer: '$_id', count: 1 } },
          ]).toArray(),

          col.aggregate([
            {
              $match: {
                type: 'page_view',
                timestamp: { $gte: since },
                'page.utmSource': { $ne: null },
              },
            },
            {
              $group: {
                _id: {
                  source: '$page.utmSource',
                  medium: '$page.utmMedium',
                  campaign: '$page.utmCampaign',
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 as const } },
            { $limit: 15 },
            {
              $project: {
                _id: 0,
                source: '$_id.source',
                medium: '$_id.medium',
                campaign: '$_id.campaign',
                count: 1,
              },
            },
          ]).toArray(),
        ]);

        return NextResponse.json({ referrers, campaigns });
      }

      // ── Devices ──
      case 'devices': {
        const pipeline = [
          { $match: { type: 'page_view', timestamp: { $gte: since } } },
          {
            $group: {
              _id: '$device.isMobile',
              count: { $sum: 1 },
            },
          },
        ];
        const results = await col.aggregate(pipeline).toArray();

        const mobile = results.find((r) => r._id === true)?.count ?? 0;
        const desktop = results.find((r) => r._id === false)?.count ?? 0;

        return NextResponse.json({ mobile, desktop, total: mobile + desktop });
      }

      // ── Recent Events ──
      case 'recent-events': {
        const events = await col
          .find({})
          .sort({ timestamp: -1 })
          .limit(50)
          .project({
            _id: 0,
            type: 1,
            timestamp: 1,
            sessionId: 1,
            'page.path': 1,
            'user.email': 1,
            'user.anonymousId': 1,
            'device.isMobile': 1,
            properties: 1,
          })
          .toArray();

        return NextResponse.json(events);
      }

      // ── Conversion Funnel ──
      case 'funnel': {
        const [pageViews, registers, logins] = await Promise.all([
          col.countDocuments({ type: 'page_view', timestamp: { $gte: since } }),
          col.countDocuments({ type: 'auth_register', timestamp: { $gte: since } }),
          col.countDocuments({ type: 'auth_login', timestamp: { $gte: since } }),
        ]);

        return NextResponse.json({
          steps: [
            { name: 'Page Views', count: pageViews },
            { name: 'Registrations', count: registers },
            { name: 'Logins', count: logins },
          ],
        });
      }

      // ── Errors & Rage Clicks ──
      case 'errors-rage-clicks': {
        const [recentErrors, recentRageClicks, errorCount, rageClickCount, topErrorMessages] = await Promise.all([
          // Last 30 errors with full detail
          col
            .find({ type: 'error', timestamp: { $gte: since } })
            .sort({ timestamp: -1 })
            .limit(30)
            .project({
              _id: 0,
              eventId: 1,
              type: 1,
              timestamp: 1,
              sessionId: 1,
              'page.path': 1,
              'page.url': 1,
              'user.email': 1,
              'user.anonymousId': 1,
              'device.userAgent': 1,
              'device.isMobile': 1,
              properties: 1,
              error: 1,
            })
            .toArray(),
          // Last 30 rage clicks
          col
            .find({ type: 'rage_click', timestamp: { $gte: since } })
            .sort({ timestamp: -1 })
            .limit(30)
            .project({
              _id: 0,
              eventId: 1,
              type: 1,
              timestamp: 1,
              sessionId: 1,
              'page.path': 1,
              'page.url': 1,
              'user.email': 1,
              'user.anonymousId': 1,
              'device.isMobile': 1,
              properties: 1,
            })
            .toArray(),
          // Total error count in period
          col.countDocuments({ type: 'error', timestamp: { $gte: since } }),
          // Total rage click count in period
          col.countDocuments({ type: 'rage_click', timestamp: { $gte: since } }),
          // Top error messages (grouped)
          col.aggregate([
            { $match: { type: 'error', timestamp: { $gte: since } } },
            {
              $group: {
                _id: '$error.message',
                count: { $sum: 1 },
                lastSeen: { $max: '$timestamp' },
                severity: { $first: '$error.severity' },
                errorType: { $first: '$error.type' },
              },
            },
            { $sort: { count: -1 as const } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                message: '$_id',
                count: 1,
                lastSeen: 1,
                severity: 1,
                errorType: 1,
              },
            },
          ]).toArray(),
        ]);

        return NextResponse.json({
          recentErrors,
          recentRageClicks,
          errorCount,
          rageClickCount,
          topErrorMessages,
        });
      }

      default:
        return NextResponse.json({ error: 'Unknown section' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Admin Analytics API]', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
