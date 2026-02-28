import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ensureFreshToken } from '@/lib/sumup';

/**
 * GET /api/sumup/debug
 * Returns raw SumUp API responses for debugging.
 * Remove this route before going to production.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business?.sumupAccessToken) {
    return NextResponse.json({ error: 'SumUp not connected' }, { status: 400 });
  }

  const { accessToken } = await ensureFreshToken({
    sumupAccessToken: user.business.sumupAccessToken,
    sumupRefreshToken: user.business.sumupRefreshToken!,
    sumupTokenExpiresAt: user.business.sumupTokenExpiresAt,
  });

  const now = new Date();
  const from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Test 1: /me
  const meRes = await fetch('https://api.sumup.com/v0.1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const me = await meRes.json();

  // Test 2: transactions (no date filter)
  const txNoFilterRes = await fetch(
    'https://api.sumup.com/v0.1/me/transactions/history?limit=10&order=desc',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const txNoFilter = await txNoFilterRes.json();

  // Test 3: transactions (with date filter, 90 days)
  const txWithFilterRes = await fetch(
    `https://api.sumup.com/v0.1/me/transactions/history?oldest_time=${from.toISOString()}&newest_time=${now.toISOString()}&limit=10&order=desc`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const txWithFilter = await txWithFilterRes.json();

  // Test 4: memberships raw
  const membershipsRes = await fetch('https://api.sumup.com/v0.1/memberships', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const membershipsRaw = await membershipsRes.json();

  const storedCode = user.business.sumupMerchantCode;
  const primaryCode = me?.merchant_profile?.merchant_code ?? null;

  // Auto-fix: if stored merchant code is a test/sandbox account, revert to primary
  const membershipsItems: any[] = Array.isArray(membershipsRaw) ? membershipsRaw : (membershipsRaw?.items ?? []);
  const storedMembership = membershipsItems.find((m: any) => m.resource_id === storedCode);
  const isTestAccount = storedMembership?.resource?.attributes?.is_test_account === true;

  if (isTestAccount && primaryCode && storedCode !== primaryCode) {
    await prisma.business.update({
      where: { id: user.business.id },
      data: { sumupMerchantCode: primaryCode },
    });
    console.log(`[SumUp debug] Auto-fixed test account ${storedCode} → primary ${primaryCode}`);
  }

  // Test 5: merchant-specific endpoint (if a different merchant is stored)
  const altCode = !isTestAccount && storedCode && storedCode !== primaryCode ? storedCode : null;

  let txMerchantEndpoint: { status: number; data: unknown } | null = null;
  let txMeQueryParam: { status: number; data: unknown } | null = null;

  if (altCode) {
    // Approach A: /v0.1/merchants/{code}/transactions/history
    const resA = await fetch(
      `https://api.sumup.com/v0.1/merchants/${altCode}/transactions/history?limit=10&order=desc`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    txMerchantEndpoint = { status: resA.status, data: await resA.json() };

    // Approach B: /v0.1/me/transactions/history?merchant_code={code}
    const resB = await fetch(
      `https://api.sumup.com/v0.1/me/transactions/history?merchant_code=${altCode}&limit=10&order=desc`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    txMeQueryParam = { status: resB.status, data: await resB.json() };
  }

  return NextResponse.json({
    storedMerchantCode: storedCode,
    primaryMerchantCode: primaryCode,
    autoFixed: isTestAccount && primaryCode && storedCode !== primaryCode ? `test account ${storedCode} → ${primaryCode}` : null,
    altMerchantCode: altCode,
    memberships: { status: membershipsRes.status, data: membershipsRaw },
    me: { status: meRes.status, data: me },
    transactionsNoFilter: { status: txNoFilterRes.status, data: txNoFilter },
    transactionsWithFilter: { status: txWithFilterRes.status, data: txWithFilter },
    ...(altCode ? {
      txMerchantEndpoint,
      txMeQueryParam,
    } : {}),
  });
}
