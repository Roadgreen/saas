import { PrismaClient, Role, SubscriptionTier, SubscriptionStatus, StockChangeType } from '@prisma/client';

function getUrl(): string {
  let url = process.env.DATABASE_URL ?? '';
  if (url.includes(':6543/')) {
    if (!url.includes('pgbouncer=true')) url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
    if (!url.includes('prepare=false')) url += (url.includes('?') ? '&' : '?') + 'prepare=false';
  }
  return url;
}

const prisma = new PrismaClient({ datasources: { db: { url: getUrl() } } });

async function main() {
  const email = 'foodtracksio@gmail.com';

  // Find existing user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }
  console.log('Found user:', user.id, user.email);

  // Clean existing data for this user's business if any
  if (user.businessId) {
    const biz = user.businessId;
    console.log('Cleaning existing business data...');
    await prisma.predictionAccuracy.deleteMany({ where: { businessId: biz } });
    await prisma.predictionSnapshot.deleteMany({ where: { businessId: biz } });
    await prisma.sumUpTransaction.deleteMany({ where: { businessId: biz } });
    await prisma.orderItem.deleteMany({ where: { order: { businessId: biz } } });
    await prisma.order.deleteMany({ where: { businessId: biz } });

    const locations = await prisma.location.findMany({ where: { businessId: biz } });
    for (const loc of locations) {
      await prisma.dailySales.deleteMany({ where: { locationId: loc.id } });
      await prisma.stockHistory.deleteMany({ where: { product: { locationId: loc.id } } });
      await prisma.wasteEvent.deleteMany({ where: { product: { locationId: loc.id } } });
      await prisma.recipeIngredient.deleteMany({ where: { product: { locationId: loc.id } } });
      await prisma.product.deleteMany({ where: { locationId: loc.id } });
    }
    await prisma.recipeIngredient.deleteMany({ where: { recipe: { businessId: biz } } });
    await prisma.recipe.deleteMany({ where: { businessId: biz } });
    await prisma.location.deleteMany({ where: { businessId: biz } });
    await prisma.business.delete({ where: { id: biz } });
  }

  // Create business
  console.log('Creating business...');
  const business = await prisma.business.create({
    data: {
      name: 'FoodTracks Demo',
      subscriptionTier: SubscriptionTier.PRO,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionEndDate: new Date('2099-12-31'),
      address: '12 Rue du Marche, Paris 75001',
      phone: '+33 6 80 72 70 96',
      email: 'contact@foodtracks.io',
      brandColor: '#F97316',
      settings: {
        stockAlerts: true,
        autoDeduct: true,
        currency: 'EUR',
        vat: 10,
        targetMargin: 65,
        wasteLimit: 8,
      },
      locations: {
        create: [
          { name: 'Marche Saint-Germain', address: '4 Rue Lobineau, Paris 75006', latitude: 48.8534, longitude: 2.3356, type: 'MARKET' },
          { name: 'Place de la Bastille', address: 'Place de la Bastille, Paris 75012', latitude: 48.8533, longitude: 2.3692, type: 'SPOT' },
          { name: 'Marche de Montreuil', address: '161 Rue de Vincennes, Montreuil 93100', latitude: 48.8584, longitude: 2.4414, type: 'MARKET' },
        ],
      },
    },
    include: { locations: true },
  });

  // Link user to business
  await prisma.user.update({
    where: { id: user.id },
    data: { businessId: business.id, role: Role.ADMIN },
  });

  const [loc1, loc2, loc3] = business.locations;

  // Products
  console.log('Creating products...');
  const now = new Date();
  const d = (offset: number) => { const dt = new Date(); dt.setDate(now.getDate() + offset); return dt; };

  const productsData = [
    { name: 'Farine de ble T55', category: 'Produits secs', quantity: 18, unit: 'kg', expiryDate: d(180), status: 'OK', costPerUnit: 1.20 },
    { name: 'Farine de sarrasin', category: 'Produits secs', quantity: 12, unit: 'kg', expiryDate: d(150), status: 'OK', costPerUnit: 2.80 },
    { name: 'Sucre en poudre', category: 'Produits secs', quantity: 8, unit: 'kg', expiryDate: d(365), status: 'OK', costPerUnit: 0.90 },
    { name: 'Nutella', category: 'Produits secs', quantity: 6, unit: 'kg', expiryDate: d(120), status: 'OK', costPerUnit: 7.20 },
    { name: 'Chocolat noir 70%', category: 'Produits secs', quantity: 2, unit: 'kg', expiryDate: d(200), status: 'OK', costPerUnit: 11.00 },
    { name: 'Oeufs frais', category: 'Frais', quantity: 240, unit: 'unites', expiryDate: d(21), status: 'OK', costPerUnit: 0.28 },
    { name: 'Lait entier bio', category: 'Frais', quantity: 20, unit: 'L', expiryDate: d(8), status: 'OK', costPerUnit: 1.15 },
    { name: 'Creme fraiche epaisse', category: 'Frais', quantity: 4, unit: 'L', expiryDate: d(3), status: 'NEAR_EXPIRY', costPerUnit: 3.20 },
    { name: 'Beurre doux AOP', category: 'Frais', quantity: 5, unit: 'kg', expiryDate: d(30), status: 'OK', costPerUnit: 9.50 },
    { name: 'Beurre demi-sel', category: 'Frais', quantity: 3, unit: 'kg', expiryDate: d(25), status: 'OK', costPerUnit: 9.80 },
    { name: 'Gruyere rape', category: 'Fromages', quantity: 4, unit: 'kg', expiryDate: d(14), status: 'OK', costPerUnit: 12.50 },
    { name: 'Fromage chevre', category: 'Fromages', quantity: 2, unit: 'kg', expiryDate: d(2), status: 'NEAR_EXPIRY', costPerUnit: 18.00 },
    { name: 'Emmental tranche', category: 'Fromages', quantity: 1.5, unit: 'kg', expiryDate: d(-1), status: 'EXPIRED', costPerUnit: 10.20 },
    { name: 'Mozzarella', category: 'Fromages', quantity: 3, unit: 'kg', expiryDate: d(7), status: 'OK', costPerUnit: 16.00 },
    { name: 'Jambon blanc', category: 'Charcuterie', quantity: 3, unit: 'kg', expiryDate: d(10), status: 'OK', costPerUnit: 14.50 },
    { name: 'Lardons fumes', category: 'Charcuterie', quantity: 2, unit: 'kg', expiryDate: d(1), status: 'NEAR_EXPIRY', costPerUnit: 11.00 },
    { name: 'Tomates cerises', category: 'Fruits & Legumes', quantity: 3, unit: 'kg', expiryDate: d(4), status: 'OK', costPerUnit: 4.50 },
    { name: 'Oignons', category: 'Fruits & Legumes', quantity: 5, unit: 'kg', expiryDate: d(30), status: 'OK', costPerUnit: 1.20 },
    { name: 'Epinards frais', category: 'Fruits & Legumes', quantity: 1, unit: 'kg', expiryDate: d(2), status: 'NEAR_EXPIRY', costPerUnit: 6.00 },
    { name: 'Pommes Golden', category: 'Fruits & Legumes', quantity: 4, unit: 'kg', expiryDate: d(14), status: 'OK', costPerUnit: 2.80 },
    { name: 'Fraises', category: 'Fruits & Legumes', quantity: 0.5, unit: 'kg', expiryDate: d(-2), status: 'EXPIRED', costPerUnit: 12.00 },
    { name: 'Bananes', category: 'Fruits & Legumes', quantity: 3, unit: 'kg', expiryDate: d(6), status: 'OK', costPerUnit: 1.80 },
    { name: 'Miel de lavande', category: 'Condiments', quantity: 2, unit: 'kg', expiryDate: d(500), status: 'OK', costPerUnit: 14.00 },
    { name: 'Sirop d\'erable', category: 'Condiments', quantity: 1, unit: 'L', expiryDate: d(300), status: 'OK', costPerUnit: 18.00 },
  ];

  const products = await Promise.all(
    productsData.map((p) =>
      prisma.product.create({
        data: {
          name: p.name, category: p.category, quantity: p.quantity, unit: p.unit,
          expiryDate: p.expiryDate, status: p.status as any, costPerUnit: p.costPerUnit,
          locationId: loc1.id,
        },
      })
    )
  );

  const byName = (name: string) => products.find((p) => p.name === name)!;

  // Recipes
  console.log('Creating recipes...');
  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        name: 'Crepe beurre-sucre', description: 'La classique', sellingPrice: 3.50, businessId: business.id,
        ingredients: { create: [
          { quantity: 0.10, unit: 'kg', productId: byName('Farine de ble T55').id },
          { quantity: 0.15, unit: 'L', productId: byName('Lait entier bio').id },
          { quantity: 1, unit: 'unites', productId: byName('Oeufs frais').id },
          { quantity: 0.02, unit: 'kg', productId: byName('Beurre doux AOP').id },
          { quantity: 0.01, unit: 'kg', productId: byName('Sucre en poudre').id },
        ]},
      },
    }),
    prisma.recipe.create({
      data: {
        name: 'Crepe Nutella', description: 'Crepe garnie de Nutella', sellingPrice: 5.00, businessId: business.id,
        ingredients: { create: [
          { quantity: 0.10, unit: 'kg', productId: byName('Farine de ble T55').id },
          { quantity: 0.15, unit: 'L', productId: byName('Lait entier bio').id },
          { quantity: 1, unit: 'unites', productId: byName('Oeufs frais').id },
          { quantity: 0.04, unit: 'kg', productId: byName('Nutella').id },
        ]},
      },
    }),
    prisma.recipe.create({
      data: {
        name: 'Galette complete', description: 'Jambon, oeuf, gruyere', sellingPrice: 8.50, businessId: business.id,
        ingredients: { create: [
          { quantity: 0.12, unit: 'kg', productId: byName('Farine de sarrasin').id },
          { quantity: 0.18, unit: 'L', productId: byName('Lait entier bio').id },
          { quantity: 1, unit: 'unites', productId: byName('Oeufs frais').id },
          { quantity: 0.08, unit: 'kg', productId: byName('Jambon blanc').id },
          { quantity: 0.05, unit: 'kg', productId: byName('Gruyere rape').id },
        ]},
      },
    }),
    prisma.recipe.create({
      data: {
        name: 'Galette chevre-miel', description: 'Chevre fondu et miel', sellingPrice: 9.00, businessId: business.id,
        ingredients: { create: [
          { quantity: 0.12, unit: 'kg', productId: byName('Farine de sarrasin').id },
          { quantity: 0.18, unit: 'L', productId: byName('Lait entier bio').id },
          { quantity: 1, unit: 'unites', productId: byName('Oeufs frais').id },
          { quantity: 0.06, unit: 'kg', productId: byName('Fromage chevre').id },
          { quantity: 0.02, unit: 'kg', productId: byName('Miel de lavande').id },
        ]},
      },
    }),
    prisma.recipe.create({
      data: {
        name: 'Pancakes maison', description: '3 pancakes moelleux, sirop d\'erable', sellingPrice: 7.00, businessId: business.id,
        ingredients: { create: [
          { quantity: 0.15, unit: 'kg', productId: byName('Farine de ble T55').id },
          { quantity: 0.12, unit: 'L', productId: byName('Lait entier bio').id },
          { quantity: 1, unit: 'unites', productId: byName('Oeufs frais').id },
          { quantity: 0.02, unit: 'kg', productId: byName('Sucre en poudre').id },
          { quantity: 0.03, unit: 'L', productId: byName('Sirop d\'erable').id },
        ]},
      },
    }),
    prisma.recipe.create({
      data: {
        name: 'Crepe chocolat-banane', description: 'Sauce chocolat et banane fraiche', sellingPrice: 6.50, businessId: business.id,
        ingredients: { create: [
          { quantity: 0.10, unit: 'kg', productId: byName('Farine de ble T55').id },
          { quantity: 0.15, unit: 'L', productId: byName('Lait entier bio').id },
          { quantity: 1, unit: 'unites', productId: byName('Oeufs frais').id },
          { quantity: 0.03, unit: 'kg', productId: byName('Chocolat noir 70%').id },
          { quantity: 0.08, unit: 'kg', productId: byName('Bananes').id },
        ]},
      },
    }),
  ]);

  const [crepe, crepeNutella, galette, galetteChevreM, pancakes, crepeChocoBanane] = recipes;

  // Sales history — 30 days
  console.log('Creating 30 days of sales...');
  const salesConfig = [
    { location: loc1, recipe: crepe, baseQty: 45, variance: 15, unitPrice: 3.50 },
    { location: loc1, recipe: crepeNutella, baseQty: 38, variance: 12, unitPrice: 5.00 },
    { location: loc1, recipe: galette, baseQty: 30, variance: 10, unitPrice: 8.50 },
    { location: loc1, recipe: galetteChevreM, baseQty: 20, variance: 8, unitPrice: 9.00 },
    { location: loc2, recipe: pancakes, baseQty: 22, variance: 8, unitPrice: 7.00 },
    { location: loc2, recipe: crepe, baseQty: 28, variance: 10, unitPrice: 3.50 },
    { location: loc2, recipe: crepeChocoBanane, baseQty: 18, variance: 6, unitPrice: 6.50 },
    { location: loc3, recipe: galette, baseQty: 25, variance: 8, unitPrice: 8.50 },
    { location: loc3, recipe: crepeNutella, baseQty: 30, variance: 10, unitPrice: 5.00 },
  ];

  const weatherConditions = ['sunny', 'cloudy', 'rainy', 'partly_cloudy', 'clear'];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dow = date.getDay();
    const multiplier = (dow === 0 || dow === 6) ? 1.4 : (dow === 1 || dow === 5) ? 0.7 : 1.0;

    for (const cfg of salesConfig) {
      if (cfg.location.id === loc1.id && dow !== 6 && dow !== 0) continue;
      if (cfg.location.id === loc2.id && dow !== 2 && dow !== 4) continue;
      if (cfg.location.id === loc3.id && dow !== 3) continue;

      const qty = Math.max(1, Math.round((cfg.baseQty + (Math.random() - 0.5) * cfg.variance * 2) * multiplier));
      const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const temp = Math.round(8 + Math.random() * 15);

      await prisma.dailySales.create({
        data: {
          date, quantity: qty, unitPrice: cfg.unitPrice, totalRevenue: qty * cfg.unitPrice,
          recipeId: cfg.recipe.id, locationId: cfg.location.id,
          weatherSnapshot: { temp, condition: weather, rain: weather === 'rainy' ? Math.random() * 5 : 0 },
        },
      });
    }
  }

  // Orders — 30 days
  console.log('Creating orders...');
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dow = date.getDay();

    const locForDay = dow === 6 || dow === 0 ? loc1 : dow === 2 || dow === 4 ? loc2 : dow === 3 ? loc3 : null;
    if (!locForDay) continue;

    const numOrders = 5 + Math.floor(Math.random() * 10);
    for (let o = 0; o < numOrders; o++) {
      const numItems = 1 + Math.floor(Math.random() * 3);
      const items = [];
      for (let it = 0; it < numItems; it++) {
        const r = recipes[Math.floor(Math.random() * recipes.length)];
        const qty = 1 + Math.floor(Math.random() * 3);
        items.push({ recipeId: r.id, quantity: qty, unitPrice: r.sellingPrice ?? 5, subtotal: qty * (r.sellingPrice ?? 5) });
      }
      const total = items.reduce((s, i) => s + (i.subtotal ?? 0), 0);

      await prisma.order.create({
        data: {
          date, totalRevenue: total, businessId: business.id, locationId: locForDay.id,
          items: { create: items },
        },
      });
    }
  }

  // Predictions
  console.log('Creating predictions...');
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(now.getDate() + i);
    const dow = date.getDay();

    for (const recipe of recipes) {
      const baseQty = 20 + Math.floor(Math.random() * 30);
      const trend = ['UP', 'DOWN', 'STABLE'][Math.floor(Math.random() * 3)] as any;
      const temp = Math.round(10 + Math.random() * 12);

      await prisma.predictionSnapshot.create({
        data: {
          date, recipeId: recipe.id, businessId: business.id, locationId: loc1.id,
          predictedQuantity: baseQty, trend,
          weatherForecast: { temp, condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)] },
          dayOfWeek: dow,
        },
      });
    }
  }

  // Prediction accuracy — last 14 days
  console.log('Creating prediction accuracy...');
  for (let i = 14; i >= 1; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    for (const recipe of recipes.slice(0, 3)) {
      const predicted = 20 + Math.floor(Math.random() * 25);
      const actual = predicted + Math.floor((Math.random() - 0.5) * 10);
      const deviation = actual - predicted;
      const deviationPercent = predicted > 0 ? (deviation / predicted) * 100 : 0;
      const accuracyPercent = Math.max(0, 100 - Math.abs(deviationPercent));

      await prisma.predictionAccuracy.create({
        data: {
          date, computedAt: new Date(), recipeId: recipe.id, businessId: business.id, locationId: loc1.id,
          predictedQuantity: predicted, actualQuantity: actual,
          deviation, deviationPercent, accuracyPercent,
          errorTags: [],
        },
      });
    }
  }

  // Stock history
  console.log('Creating stock history...');
  for (const product of products) {
    await prisma.stockHistory.create({
      data: { productId: product.id, quantity: product.quantity, type: StockChangeType.DELIVERY, note: 'Livraison initiale' },
    });
    // Add some movements
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(now.getDate() - Math.floor(Math.random() * 20));
      const type = [StockChangeType.SALES, StockChangeType.DELIVERY, StockChangeType.WASTE][Math.floor(Math.random() * 3)];
      const qty = type === StockChangeType.SALES ? -(Math.random() * 2) : (Math.random() * 5);
      await prisma.stockHistory.create({
        data: { productId: product.id, quantity: qty, type, date, note: type === StockChangeType.DELIVERY ? 'Reappro' : undefined },
      });
    }
  }

  // Waste events
  console.log('Creating waste events...');
  await prisma.wasteEvent.createMany({
    data: [
      { productId: byName('Fraises').id, quantity: 0.5, reason: 'EXPIRED', date: d(-1) },
      { productId: byName('Emmental tranche').id, quantity: 1.5, reason: 'EXPIRED', date: d(-2) },
      { productId: byName('Creme fraiche epaisse').id, quantity: 1, reason: 'SPOILED', date: d(-3) },
      { productId: byName('Lardons fumes').id, quantity: 0.5, reason: 'EXPIRED', date: d(-1) },
      { productId: byName('Epinards frais').id, quantity: 0.3, reason: 'SPOILED', date: d(-4) },
    ],
  });

  console.log(`
Done!
Business: ${business.name} (${business.id})
Locations: ${business.locations.length}
Products: ${products.length}
Recipes: ${recipes.length}
30 days of sales, orders, predictions, stock history, waste events
  `);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
