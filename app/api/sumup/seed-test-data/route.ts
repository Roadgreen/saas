/**
 * POST /api/sumup/seed-test-data
 * Insert fake SumUp transactions into the DB for testing the sync flow.
 * Uses the business's real recipes so recipe-matching works correctly.
 * REMOVE THIS ROUTE BEFORE GOING TO PRODUCTION.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { matchProductToRecipe } from '@/lib/sumup';

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  // random time between 10h and 19h
  d.setHours(10 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60), 0, 0);
  return d;
}

export async function POST() {
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

  // Load all recipes to generate realistic transactions
  const recipes = await prisma.recipe.findMany({
    where: { businessId: business.id },
    select: { id: true, name: true, sellingPrice: true },
  });

  if (recipes.length === 0) {
    return NextResponse.json({ error: 'No recipes found — create at least one recipe first' }, { status: 400 });
  }

  // Delete existing test transactions (prefixed with TEST_)
  const deleted = await prisma.sumUpTransaction.deleteMany({
    where: { businessId: business.id, sumupId: { startsWith: 'TEST_' } },
  });

  const toCreate: Parameters<typeof prisma.sumUpTransaction.create>[0]['data'][] = [];

  // Generate transactions for the last 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    // Skip ~20% of days (closed days)
    if (Math.random() < 0.2) continue;

    // 3–10 transactions per open day
    const txCount = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < txCount; i++) {
      // Pick a random recipe
      const recipe = recipes[Math.floor(Math.random() * recipes.length)];
      const unitPrice = recipe.sellingPrice ?? randomBetween(3, 12);
      const qty = Math.floor(Math.random() * 3) + 1;
      const amount = Math.round(unitPrice * qty * 100) / 100;

      const sumupId = `TEST_${Date.now()}_${dayOffset}_${i}_${Math.random().toString(36).slice(2, 7)}`;
      const timestamp = daysAgo(dayOffset);

      const matchedRecipeId = matchProductToRecipe(recipe.name, recipes.map(r => ({ id: r.id, name: r.name })));

      toCreate.push({
        sumupId,
        transactionCode: `T${sumupId.slice(-8).toUpperCase()}`,
        amount,
        currency: 'EUR',
        timestamp,
        status: 'SUCCESSFUL',
        paymentType: Math.random() > 0.3 ? 'CARD' : 'CASH',
        productSummary: recipe.name,
        products: [
          {
            name: recipe.name,
            quantity: qty,
            price: unitPrice,
            total_price: amount,
          },
        ],
        businessId: business.id,
        matchedRecipeId,
      });
    }
  }

  // Insert all at once
  let seeded = 0;
  for (const data of toCreate) {
    await prisma.sumUpTransaction.create({ data });
    seeded++;
  }

  return NextResponse.json({
    ok: true,
    deleted: deleted.count,
    seeded,
    recipes: recipes.map(r => r.name),
    message: `${seeded} test transactions inserted (${deleted.count} previous test transactions replaced)`,
  });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { businessId: true },
  });

  if (!user?.businessId) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const deleted = await prisma.sumUpTransaction.deleteMany({
    where: { businessId: user.businessId, sumupId: { startsWith: 'TEST_' } },
  });

  return NextResponse.json({ ok: true, deleted: deleted.count });
}
