import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { exchangeCodeForTokens, getSumUpMerchant, getSumUpMemberships } from '@/lib/sumup';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(
      new URL('/api/auth/signin', req.url)
    );
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Detect locale from the referer or default to 'fr'
  const locale = 'fr';
  const settingsURL = new URL(`/${locale}/dashboard/integrations`, req.url);

  if (error || !code) {
    settingsURL.searchParams.set('sumup_error', error ?? 'missing_code');
    return NextResponse.redirect(settingsURL);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { businessId: true },
    });

    if (!user?.businessId) {
      settingsURL.searchParams.set('sumup_error', 'no_business');
      return NextResponse.redirect(settingsURL);
    }

    // Always get the real merchant code from /v0.1/me
    const merchant = await getSumUpMerchant(tokens.access_token);

    // Fetch memberships only to detect multi-merchant accounts (for future picker)
    const memberships = await getSumUpMemberships(tokens.access_token);

    await prisma.business.update({
      where: { id: user.businessId },
      data: {
        sumupAccessToken: tokens.access_token,
        sumupRefreshToken: tokens.refresh_token,
        sumupTokenExpiresAt: expiresAt,
        sumupConnectedAt: new Date(),
        sumupMerchantCode: merchant.merchant_code,
      },
    });

    if (memberships.length > 1) {
      settingsURL.searchParams.set('sumup_choose', '1');
    } else {
      settingsURL.searchParams.set('sumup_success', '1');
    }
    return NextResponse.redirect(settingsURL);
  } catch (err: any) {
    console.error('[SumUp callback error]', err);
    settingsURL.searchParams.set('sumup_error', 'token_exchange_failed');
    return NextResponse.redirect(settingsURL);
  }
}
