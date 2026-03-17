/**
 * GET /api/admin/errors
 *
 * Returns error monitoring data from MongoDB analytics.
 * Protected: only ADMIN role or foodtracksio@gmail.com can access.
 *
 * Query params:
 *   ?section=overview|errors-by-type|recent-errors|rage-clicks|errors-over-time
 *   &from=ISO date string (optional, defaults to 7 days ago)
 *   &to=ISO date string (optional, defaults to now)
 *   &errorType=error|rage_click|500_error (optional filter)
 *   &page=path filter (optional, prefix match)
 *   &limit=number (optional, default 50)
 *   &offset=number (optional, default 0)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEventsCollection } from '@/lib/mongodb-analytics';

const ADMIN_EMAIL = 'foodtracksio@gmail.com';

const ERROR_TYPES = ['error', 'rage_click'] as const;

function parseDate(str: string | null, fallback: Date): Date {
  if (!str) return fallback;
  const d = new Date(str);
  return isNaN(d.getTime()) ? fallback : d;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  const isAdmin =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email === ADMIN_EMAIL;
  if (!session?.user?.email || !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') ?? 'overview';

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const from = parseDate(searchParams.get('from'), sevenDaysAgo);
  const to = parseDate(searchParams.get('to'), now);
  const errorTypeFilter = searchParams.get('errorType');
  const pageFilter = searchParams.get('page');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  try {
    const col = await getEventsCollection();

    // Build base match filter
    const baseMatch: Record<string, unknown> = {
      timestamp: { $gte: from, $lte: to },
    };

    if (errorTypeFilter === '500_error') {
      baseMatch.type = 'error';
      baseMatch['error.type'] = 'server_error';
    } else if (errorTypeFilter && (ERROR_TYPES as readonly string[]).includes(errorTypeFilter)) {
      baseMatch.type = errorTypeFilter;
    } else {
      baseMatch.type = { $in: ERROR_TYPES };
    }

    if (pageFilter) {
      baseMatch['page.path'] = { $regex: `^${pageFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` };
    }

    switch (section) {
      // ── Overview: total counts ──
      case 'overview': {
        const [errorCount, rageClickCount, serverErrorCount, affectedPages, affectedSessions] =
          await Promise.all([
            col.countDocuments({
              type: 'error',
              timestamp: { $gte: from, $lte: to },
              ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
            }),
            col.countDocuments({
              type: 'rage_click',
              timestamp: { $gte: from, $lte: to },
              ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
            }),
            col.countDocuments({
              type: 'error',
              'error.type': 'server_error',
              timestamp: { $gte: from, $lte: to },
              ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
            }),
            col.distinct('page.path', {
              type: { $in: ERROR_TYPES as unknown as string[] },
              timestamp: { $gte: from, $lte: to },
              ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
            } as any),
            col.distinct('sessionId', {
              type: { $in: ERROR_TYPES as unknown as string[] },
              timestamp: { $gte: from, $lte: to },
              ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
            } as any),
          ]);

        return NextResponse.json({
          errorCount,
          rageClickCount,
          serverErrorCount,
          affectedPages: affectedPages.length,
          affectedSessions: affectedSessions.length,
        });
      }

      // ── Errors by type (for chart) ──
      case 'errors-by-type': {
        const results = await col
          .aggregate([
            {
              $match: {
                type: { $in: ERROR_TYPES },
                timestamp: { $gte: from, $lte: to },
                ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
              },
            },
            {
              $group: {
                _id: {
                  $cond: [
                    { $eq: ['$type', 'rage_click'] },
                    'rage_click',
                    { $ifNull: ['$error.type', 'unknown'] },
                  ],
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 as const } },
            {
              $project: {
                _id: 0,
                type: '$_id',
                count: 1,
              },
            },
          ])
          .toArray();

        return NextResponse.json(results);
      }

      // ── Errors over time (for line/bar chart) ──
      case 'errors-over-time': {
        const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
        const groupByHour = daysDiff <= 2;

        const results = await col
          .aggregate([
            { $match: baseMatch },
            {
              $group: {
                _id: groupByHour
                  ? {
                      year: { $year: '$timestamp' },
                      month: { $month: '$timestamp' },
                      day: { $dayOfMonth: '$timestamp' },
                      hour: { $hour: '$timestamp' },
                    }
                  : {
                      year: { $year: '$timestamp' },
                      month: { $month: '$timestamp' },
                      day: { $dayOfMonth: '$timestamp' },
                    },
                errors: {
                  $sum: { $cond: [{ $eq: ['$type', 'error'] }, 1, 0] },
                },
                rageClicks: {
                  $sum: { $cond: [{ $eq: ['$type', 'rage_click'] }, 1, 0] },
                },
                total: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': 1 as const, '_id.month': 1 as const, '_id.day': 1 as const, '_id.hour': 1 as const } },
          ])
          .toArray();

        const formatted = results.map((r) => {
          const id = r._id as { year: number; month: number; day: number; hour?: number };
          const label = groupByHour
            ? `${id.month}/${id.day} ${String(id.hour ?? 0).padStart(2, '0')}:00`
            : `${id.month}/${id.day}`;
          return {
            label,
            errors: r.errors,
            rageClicks: r.rageClicks,
            total: r.total,
          };
        });

        return NextResponse.json(formatted);
      }

      // ── Recent errors list ──
      case 'recent-errors': {
        const errorMatch: Record<string, unknown> = {
          timestamp: { $gte: from, $lte: to },
          ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
        };

        if (errorTypeFilter === '500_error') {
          errorMatch.type = 'error';
          errorMatch['error.type'] = 'server_error';
        } else if (errorTypeFilter === 'rage_click') {
          errorMatch.type = 'rage_click';
        } else if (errorTypeFilter === 'error') {
          errorMatch.type = 'error';
        } else {
          errorMatch.type = { $in: ERROR_TYPES };
        }

        const [events, totalCount] = await Promise.all([
          col
            .find(errorMatch)
            .sort({ timestamp: -1 })
            .skip(offset)
            .limit(limit)
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
          col.countDocuments(errorMatch),
        ]);

        return NextResponse.json({ events, totalCount });
      }

      // ── Rage clicks with location details ──
      case 'rage-clicks': {
        const rageMatch: Record<string, unknown> = {
          type: 'rage_click',
          timestamp: { $gte: from, $lte: to },
          ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
        };

        const [locations, recentClicks] = await Promise.all([
          col
            .aggregate([
              { $match: rageMatch },
              {
                $group: {
                  _id: {
                    path: '$page.path',
                    target: '$properties.targetText',
                    component: '$properties.component',
                  },
                  count: { $sum: 1 },
                  lastSeen: { $max: '$timestamp' },
                  avgClicks: { $avg: '$properties.count' },
                },
              },
              { $sort: { count: -1 as const } },
              { $limit: 20 },
              {
                $project: {
                  _id: 0,
                  page: '$_id.path',
                  targetText: '$_id.target',
                  component: '$_id.component',
                  count: 1,
                  lastSeen: 1,
                  avgClicks: 1,
                },
              },
            ])
            .toArray(),
          col
            .find(rageMatch)
            .sort({ timestamp: -1 })
            .limit(20)
            .project({
              _id: 0,
              eventId: 1,
              timestamp: 1,
              sessionId: 1,
              'page.path': 1,
              'user.email': 1,
              'user.anonymousId': 1,
              'device.isMobile': 1,
              properties: 1,
            })
            .toArray(),
        ]);

        return NextResponse.json({ locations, recentClicks });
      }

      // ── Top error messages ──
      case 'top-errors': {
        const results = await col
          .aggregate([
            {
              $match: {
                type: 'error',
                timestamp: { $gte: from, $lte: to },
                ...(pageFilter ? { 'page.path': baseMatch['page.path'] } : {}),
              },
            },
            {
              $group: {
                _id: '$error.message',
                count: { $sum: 1 },
                lastSeen: { $max: '$timestamp' },
                firstSeen: { $min: '$timestamp' },
                severity: { $first: '$error.severity' },
                errorType: { $first: '$error.type' },
                pages: { $addToSet: '$page.path' },
              },
            },
            { $sort: { count: -1 as const } },
            { $limit: 20 },
            {
              $project: {
                _id: 0,
                message: '$_id',
                count: 1,
                lastSeen: 1,
                firstSeen: 1,
                severity: 1,
                errorType: 1,
                affectedPages: { $size: '$pages' },
              },
            },
          ])
          .toArray();

        return NextResponse.json(results);
      }

      default:
        return NextResponse.json({ error: 'Unknown section' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Admin Errors API]', error);
    return NextResponse.json(
      { error: 'Failed to fetch error data' },
      { status: 500 }
    );
  }
}
