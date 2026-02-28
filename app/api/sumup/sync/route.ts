/**
 * POST /api/sumup/sync
 * Fetches SumUp transactions, stores them in SumUpTransaction table,
 * and attempts to match each product line to a recipe.
 * Returns synced counts and matched recipe sales.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  getSumUpTransactions,
  ensureFreshToken,
  matchProductToRecipe,
} from '@/lib/sumup';

export async function POST(req: NextRequest) {
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

  const body = await req.json().catch(() => ({}));
  const days = Math.min(parseInt(body.days ?? 30, 10), 90);

  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    // Refresh token if needed
    const { accessToken, updatedTokens } = await ensureFreshToken({
      sumupAccessToken: business.sumupAccessToken,
      sumupRefreshToken: business.sumupRefreshToken,
      sumupTokenExpiresAt: business.sumupTokenExpiresAt,
    });

    if (updatedTokens) {
      await prisma.business.update({
        where: { id: business.id },
        data: {
          sumupAccessToken: updatedTokens.access_token,
          sumupRefreshToken: updatedTokens.refresh_token,
          sumupTokenExpiresAt: updatedTokens.expiresAt,
        },
      });
    }

    // Fetch fresh transactions from SumUp (merchant-scoped to support sandbox)
    const transactions = await getSumUpTransactions(
      accessToken,
      from.toISOString(),
      now.toISOString()
    );

    // Load all business recipes for matching
    const recipes = await prisma.recipe.findMany({
      where: { businessId: business.id },
      select: { id: true, name: true },
    });

    // Load explicit product→recipe mappings from business settings
    const settings = (business.settings as Record<string, unknown>) ?? {};
    const explicitMappings = (settings.sumupMappings as Record<string, string>) ?? {};

    let synced = 0;
    let matched = 0;

    for (const t of transactions) {
      // Try to find an existing SumUpTransaction record
      const existing = await prisma.sumUpTransaction.findUnique({
        where: { sumupId: t.id },
      });
      if (existing) continue; // already synced

      // Attempt recipe match: explicit mapping first, then fuzzy fallback
      let matchedRecipeId: string | null = null;

      const productName = t.products?.[0]?.name ?? t.product_summary ?? null;

      if (productName && explicitMappings[productName]) {
        // Level 1: exact explicit mapping
        matchedRecipeId = explicitMappings[productName];
      } else if (t.products && t.products.length > 0) {
        // Level 2: fuzzy match on first product name
        matchedRecipeId = matchProductToRecipe(t.products[0].name, recipes);
      } else if (t.product_summary) {
        matchedRecipeId = matchProductToRecipe(t.product_summary, recipes);
      }

      if (matchedRecipeId) matched++;

      await prisma.sumUpTransaction.create({
        data: {
          sumupId: t.id,
          transactionCode: t.transaction_code ?? null,
          amount: t.amount,
          currency: t.currency,
          timestamp: new Date(t.timestamp),
          status: t.status,
          paymentType: t.payment_type ?? null,
          productSummary: t.product_summary ?? null,
          products: t.products ? JSON.parse(JSON.stringify(t.products)) : undefined,
          businessId: business.id,
          matchedRecipeId,
        },
      });

      synced++;
    }

    return NextResponse.json({
      synced,
      matched,
      total: transactions.length,
      period: { days, from: from.toISOString(), to: now.toISOString() },
    });
  } catch (err: any) {
    console.error('[SumUp sync error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
