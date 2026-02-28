import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ensureFreshToken } from '@/lib/sumup';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business?.sumupAccessToken || !user.business.sumupRefreshToken) {
    return NextResponse.json({ error: 'SumUp not connected' }, { status: 400 });
  }

  const { accessToken, updatedTokens } = await ensureFreshToken({
    sumupAccessToken: user.business.sumupAccessToken,
    sumupRefreshToken: user.business.sumupRefreshToken,
    sumupTokenExpiresAt: user.business.sumupTokenExpiresAt,
  });

  if (updatedTokens) {
    await prisma.business.update({
      where: { id: user.business.id },
      data: {
        sumupAccessToken: updatedTokens.access_token,
        sumupRefreshToken: updatedTokens.refresh_token,
        sumupTokenExpiresAt: updatedTokens.expiresAt,
      },
    });
  }

  // Fetch raw response to inspect structure
  const res = await fetch('https://api.sumup.com/v0.1/memberships', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const raw = await res.json();
  console.log('[SumUp memberships] status:', res.status, 'raw:', JSON.stringify(raw, null, 2));

  // SumUp memberships response: { items: [...], total_count: N }
  const items: any[] = Array.isArray(raw) ? raw : (raw.items ?? raw.memberships ?? []);

  // Normalize: merchant_code is in resource_id or resource.attributes.merchant_code
  const memberships = items.map((m: any) => ({
    merchant_code: m.resource_id ?? m.resource?.attributes?.merchant_code ?? m.resource?.id ?? m.id ?? '',
    business_name: m.resource?.name ?? m.resource?.attributes?.business_name ?? '',
    country: m.resource?.attributes?.merchant_country ?? '',
    currency: m.resource?.attributes?.currency ?? '',
    is_test_account: m.resource?.attributes?.is_test_account === true,
    roles: m.roles ?? [],
  }));

  console.log('[SumUp memberships] normalized:', memberships);
  return NextResponse.json({ memberships, selected: user.business.sumupMerchantCode });
}
