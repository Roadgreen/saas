/**
 * GET  /api/sumup/mappings  — load current product→recipe mappings + detected products
 * POST /api/sumup/mappings  — save mappings and re-match existing unmatched transactions
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      businessId: true,
      business: { select: { settings: true } },
    },
  });

  if (!user?.businessId || !user.business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const settings = (user.business.settings as Record<string, unknown>) ?? {};
  const mappings = (settings.sumupMappings as Record<string, string>) ?? {};

  // Collect distinct product names from the last 90 days of SumUp transactions
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const transactions = await prisma.sumUpTransaction.findMany({
    where: { businessId: user.businessId, timestamp: { gte: since } },
    select: { products: true, productSummary: true },
  });

  const productNamesSet = new Set<string>();
  for (const tx of transactions) {
    if (tx.products && Array.isArray(tx.products)) {
      for (const p of tx.products as { name?: string }[]) {
        if (p.name) productNamesSet.add(p.name);
      }
    } else if (tx.productSummary) {
      productNamesSet.add(tx.productSummary);
    }
  }

  const recipes = await prisma.recipe.findMany({
    where: { businessId: user.businessId },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({
    mappings,
    recipes,
    recentProducts: Array.from(productNamesSet).sort(),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      businessId: true,
      business: { select: { settings: true } },
    },
  });

  if (!user?.businessId || !user.business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const body = await req.json();
  const incoming: Record<string, string> = body.mappings ?? {};
  const replace: boolean = body.replace === true;

  const currentSettings = (user.business.settings as Record<string, unknown>) ?? {};
  const existingMappings = (currentSettings.sumupMappings as Record<string, string>) ?? {};

  // replace=true: UI sent the complete mapping, overwrite entirely
  // replace=false (default): merge with existing
  const base = replace ? {} : existingMappings;
  const mergedMappings: Record<string, string> = { ...base, ...incoming };
  for (const [key, val] of Object.entries(mergedMappings)) {
    if (!val) delete mergedMappings[key];
  }

  await prisma.business.update({
    where: { id: user.businessId },
    data: { settings: { ...currentSettings, sumupMappings: mergedMappings } },
  });

  // Re-match existing unmatched transactions using the updated mappings
  const unmatchedTxs = await prisma.sumUpTransaction.findMany({
    where: { businessId: user.businessId, matchedRecipeId: null },
    select: { id: true, products: true, productSummary: true },
  });

  let rematched = 0;
  for (const tx of unmatchedTxs) {
    let productName: string | null = null;

    if (tx.products && Array.isArray(tx.products) && tx.products.length > 0) {
      productName = ((tx.products as { name?: string }[])[0].name) ?? null;
    } else if (tx.productSummary) {
      productName = tx.productSummary;
    }

    if (productName && mergedMappings[productName]) {
      await prisma.sumUpTransaction.update({
        where: { id: tx.id },
        data: { matchedRecipeId: mergedMappings[productName] },
      });
      rematched++;
    }
  }

  return NextResponse.json({ ok: true, rematched });
}
