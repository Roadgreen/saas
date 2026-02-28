import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = new Set(['SUCCESSFUL', 'PAID', 'COMPLETED']);

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const business = user.business;

  if (!business.sumupAccessToken || !business.sumupRefreshToken) {
    return NextResponse.json({ error: 'SumUp not connected' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.min(parseInt(searchParams.get('days') ?? '30', 10), 90);

  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Read from DB (populated by sync or seed-test-data)
  const transactions = await prisma.sumUpTransaction.findMany({
    where: {
      businessId: business.id,
      timestamp: { gte: from, lte: now },
    },
    orderBy: { timestamp: 'desc' },
    select: {
      sumupId: true,
      amount: true,
      currency: true,
      timestamp: true,
      status: true,
      paymentType: true,
      productSummary: true,
      products: true,
      matchedRecipeId: true,
    },
  });

  // Only count successful/completed transactions
  const successful = transactions.filter((t) => VALID_STATUSES.has(t.status));

  // Aggregate into daily totals
  const dailyMap = new Map<string, { revenue: number; count: number; currency: string }>();
  for (const tx of successful) {
    const date = tx.timestamp.toISOString().slice(0, 10);
    const entry = dailyMap.get(date);
    if (entry) {
      entry.revenue += tx.amount;
      entry.count++;
    } else {
      dailyMap.set(date, { revenue: tx.amount, count: 1, currency: tx.currency });
    }
  }

  const daily = Array.from(dailyMap.entries())
    .map(([date, v]) => ({
      date,
      revenue: Math.round(v.revenue * 100) / 100,
      transactionCount: v.count,
      currency: v.currency,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    transactions: successful,
    daily,
    total: successful.length,
    merchantCode: business.sumupMerchantCode,
    connectedAt: business.sumupConnectedAt,
    period: { days, from: from.toISOString(), to: now.toISOString() },
  });
}
