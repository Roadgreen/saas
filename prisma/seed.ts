import { PrismaClient, Role, SubscriptionTier, StockChangeType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@foodtracks.io';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Cleanup
    console.log('Nettoyage de la base...');
    await prisma.predictionAccuracy.deleteMany();
    await prisma.predictionSnapshot.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.dailySales.deleteMany();
    await prisma.stockHistory.deleteMany();
    await prisma.recipeIngredient.deleteMany();
    await prisma.wasteEvent.deleteMany();
    await prisma.product.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();

    // 2. Business + Locations
    console.log('Création du business...');
    const business = await prisma.business.create({
        data: {
            name: 'FoodTracks Demo',
            subscriptionTier: SubscriptionTier.ENTERPRISE,
            address: '12 Rue du Marché, Paris 75001',
            phone: '+33 6 12 34 56 78',
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
                    {
                        name: 'Marché Saint-Germain',
                        address: '4 Rue Lobineau, Paris 75006',
                        latitude: 48.8534,
                        longitude: 2.3356,
                        type: 'MARKET',
                    },
                    {
                        name: 'Place de la Bastille',
                        address: 'Place de la Bastille, Paris 75012',
                        latitude: 48.8533,
                        longitude: 2.3692,
                        type: 'SPOT',
                    },
                    {
                        name: 'Marché de Montreuil',
                        address: '161 Rue de Vincennes, Montreuil 93100',
                        latitude: 48.8584,
                        longitude: 2.4414,
                        type: 'MARKET',
                    },
                ],
            },
        },
        include: { locations: true },
    });

    const [loc1, loc2, loc3] = business.locations;

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Admin FoodTracks',
            role: Role.OWNER,
            businessId: business.id,
        },
    });

    // 3. Products — food truck crêpes & galettes
    console.log('Création des produits...');
    const now = new Date();
    const d = (offset: number) => {
        const date = new Date();
        date.setDate(now.getDate() + offset);
        return date;
    };

    const productsData = [
        // ── Produits secs
        { name: 'Farine de blé T55',      category: 'Produits secs',    quantity: 18,   unit: 'kg',      expiryDate: d(180), status: 'OK',          costPerUnit: 1.20 },
        { name: 'Farine de sarrasin',      category: 'Produits secs',    quantity: 12,   unit: 'kg',      expiryDate: d(150), status: 'OK',          costPerUnit: 2.80 },
        { name: 'Sucre en poudre',         category: 'Produits secs',    quantity: 8,    unit: 'kg',      expiryDate: d(365), status: 'OK',          costPerUnit: 0.90 },
        { name: 'Levure chimique',         category: 'Produits secs',    quantity: 0.5,  unit: 'kg',      expiryDate: d(90),  status: 'OK',          costPerUnit: 8.50 },
        { name: 'Sel fin',                 category: 'Produits secs',    quantity: 3,    unit: 'kg',      expiryDate: d(730), status: 'OK',          costPerUnit: 0.60 },
        { name: 'Nutella',                 category: 'Produits secs',    quantity: 6,    unit: 'kg',      expiryDate: d(120), status: 'OK',          costPerUnit: 7.20 },
        { name: 'Pâte à tartiner noisette',category: 'Produits secs',    quantity: 1.5,  unit: 'kg',      expiryDate: d(30),  status: 'OK',          costPerUnit: 6.90 },
        { name: 'Chocolat noir 70%',       category: 'Produits secs',    quantity: 2,    unit: 'kg',      expiryDate: d(200), status: 'OK',          costPerUnit: 11.00 },
        { name: 'Sucre glace',             category: 'Produits secs',    quantity: 2,    unit: 'kg',      expiryDate: d(300), status: 'OK',          costPerUnit: 1.10 },

        // ── Produits frais
        { name: 'Œufs frais (plein air)',  category: 'Frais',            quantity: 240,  unit: 'unités',  expiryDate: d(21),  status: 'OK',          costPerUnit: 0.28 },
        { name: 'Lait entier bio',         category: 'Frais',            quantity: 20,   unit: 'L',       expiryDate: d(8),   status: 'OK',          costPerUnit: 1.15 },
        { name: 'Crème fraîche épaisse',   category: 'Frais',            quantity: 4,    unit: 'L',       expiryDate: d(3),   status: 'NEAR_EXPIRY', costPerUnit: 3.20 },
        { name: 'Beurre doux AOP',         category: 'Frais',            quantity: 5,    unit: 'kg',      expiryDate: d(30),  status: 'OK',          costPerUnit: 9.50 },
        { name: 'Beurre demi-sel',         category: 'Frais',            quantity: 3,    unit: 'kg',      expiryDate: d(25),  status: 'OK',          costPerUnit: 9.80 },

        // ── Fromages
        { name: 'Gruyère râpé',            category: 'Fromages',         quantity: 4,    unit: 'kg',      expiryDate: d(14),  status: 'OK',          costPerUnit: 12.50 },
        { name: 'Fromage chèvre (bûche)',  category: 'Fromages',         quantity: 2,    unit: 'kg',      expiryDate: d(2),   status: 'NEAR_EXPIRY', costPerUnit: 18.00 },
        { name: 'Emmental tranché',        category: 'Fromages',         quantity: 1.5,  unit: 'kg',      expiryDate: d(-1),  status: 'EXPIRED',     costPerUnit: 10.20 },
        { name: 'Mozzarella di Bufala',    category: 'Fromages',         quantity: 3,    unit: 'kg',      expiryDate: d(7),   status: 'OK',          costPerUnit: 16.00 },

        // ── Charcuterie
        { name: 'Jambon blanc Label Rouge',category: 'Charcuterie',      quantity: 3,    unit: 'kg',      expiryDate: d(10),  status: 'OK',          costPerUnit: 14.50 },
        { name: 'Lardons fumés',           category: 'Charcuterie',      quantity: 2,    unit: 'kg',      expiryDate: d(1),   status: 'NEAR_EXPIRY', costPerUnit: 11.00 },
        { name: 'Saucisse de Morteau',     category: 'Charcuterie',      quantity: 1.5,  unit: 'kg',      expiryDate: d(5),   status: 'OK',          costPerUnit: 19.00 },

        // ── Fruits & Légumes
        { name: 'Tomates cerises',         category: 'Fruits & Légumes', quantity: 3,    unit: 'kg',      expiryDate: d(4),   status: 'OK',          costPerUnit: 4.50 },
        { name: 'Oignons jaunes',          category: 'Fruits & Légumes', quantity: 5,    unit: 'kg',      expiryDate: d(30),  status: 'OK',          costPerUnit: 1.20 },
        { name: 'Épinards frais',          category: 'Fruits & Légumes', quantity: 1,    unit: 'kg',      expiryDate: d(2),   status: 'NEAR_EXPIRY', costPerUnit: 6.00 },
        { name: 'Champignons de Paris',    category: 'Fruits & Légumes', quantity: 2,    unit: 'kg',      expiryDate: d(3),   status: 'NEAR_EXPIRY', costPerUnit: 5.50 },
        { name: 'Pommes Golden',           category: 'Fruits & Légumes', quantity: 4,    unit: 'kg',      expiryDate: d(14),  status: 'OK',          costPerUnit: 2.80 },
        { name: 'Fraises Gariguette',      category: 'Fruits & Légumes', quantity: 0.5,  unit: 'kg',      expiryDate: d(-2),  status: 'EXPIRED',     costPerUnit: 12.00 },
        { name: 'Bananes',                 category: 'Fruits & Légumes', quantity: 3,    unit: 'kg',      expiryDate: d(6),   status: 'OK',          costPerUnit: 1.80 },

        // ── Condiments & Sauces
        { name: 'Huile d\'olive vierge',   category: 'Condiments',       quantity: 5,    unit: 'L',       expiryDate: d(365), status: 'OK',          costPerUnit: 8.20 },
        { name: 'Sauce tomate artisanale', category: 'Condiments',       quantity: 8,    unit: 'boîtes',  expiryDate: d(180), status: 'OK',          costPerUnit: 2.40 },
        { name: 'Miel de lavande',         category: 'Condiments',       quantity: 2,    unit: 'kg',      expiryDate: d(500), status: 'OK',          costPerUnit: 14.00 },
        { name: 'Sirop d\'érable',         category: 'Condiments',       quantity: 1,    unit: 'L',       expiryDate: d(300), status: 'OK',          costPerUnit: 18.00 },
    ];

    const products = await Promise.all(
        productsData.map((p) =>
            prisma.product.create({
                data: {
                    name: p.name,
                    category: p.category,
                    quantity: p.quantity,
                    unit: p.unit,
                    expiryDate: p.expiryDate,
                    status: p.status as any,
                    costPerUnit: p.costPerUnit,
                    locationId: loc1.id,
                },
            })
        )
    );

    const byName = (name: string) => products.find((p) => p.name === name)!;

    // 4. Recipes
    console.log('Création des recettes...');
    const recipes = await Promise.all([
        prisma.recipe.create({
            data: {
                name: 'Crêpe beurre-sucre',
                description: 'La classique, simple et indémodable',
                sellingPrice: 3.50,
                businessId: business.id,
                ingredients: {
                    create: [
                        { quantity: 0.10, unit: 'kg',     productId: byName('Farine de blé T55').id },
                        { quantity: 0.15, unit: 'L',      productId: byName('Lait entier bio').id },
                        { quantity: 1,    unit: 'unités', productId: byName('Œufs frais (plein air)').id },
                        { quantity: 0.02, unit: 'kg',     productId: byName('Beurre doux AOP').id },
                        { quantity: 0.01, unit: 'kg',     productId: byName('Sucre en poudre').id },
                    ],
                },
            },
        }),
        prisma.recipe.create({
            data: {
                name: 'Crêpe Nutella',
                description: 'Crêpe garnie de Nutella généreusement',
                sellingPrice: 5.00,
                businessId: business.id,
                ingredients: {
                    create: [
                        { quantity: 0.10, unit: 'kg', productId: byName('Farine de blé T55').id },
                        { quantity: 0.15, unit: 'L',  productId: byName('Lait entier bio').id },
                        { quantity: 1,    unit: 'unités', productId: byName('Œufs frais (plein air)').id },
                        { quantity: 0.04, unit: 'kg', productId: byName('Nutella').id },
                    ],
                },
            },
        }),
        prisma.recipe.create({
            data: {
                name: 'Galette complète',
                description: 'Galette sarrasin — jambon, œuf, gruyère',
                sellingPrice: 8.50,
                businessId: business.id,
                ingredients: {
                    create: [
                        { quantity: 0.12, unit: 'kg',     productId: byName('Farine de sarrasin').id },
                        { quantity: 0.18, unit: 'L',      productId: byName('Lait entier bio').id },
                        { quantity: 1,    unit: 'unités', productId: byName('Œufs frais (plein air)').id },
                        { quantity: 0.08, unit: 'kg',     productId: byName('Jambon blanc Label Rouge').id },
                        { quantity: 0.05, unit: 'kg',     productId: byName('Gruyère râpé').id },
                    ],
                },
            },
        }),
        prisma.recipe.create({
            data: {
                name: 'Galette chèvre-miel',
                description: 'Galette sarrasin avec chèvre fondu et miel',
                sellingPrice: 9.00,
                businessId: business.id,
                ingredients: {
                    create: [
                        { quantity: 0.12, unit: 'kg', productId: byName('Farine de sarrasin').id },
                        { quantity: 0.18, unit: 'L',  productId: byName('Lait entier bio').id },
                        { quantity: 1,    unit: 'unités', productId: byName('Œufs frais (plein air)').id },
                        { quantity: 0.06, unit: 'kg', productId: byName('Fromage chèvre (bûche)').id },
                        { quantity: 0.02, unit: 'kg', productId: byName('Miel de lavande').id },
                    ],
                },
            },
        }),
        prisma.recipe.create({
            data: {
                name: 'Pancakes maison',
                description: 'Lot de 3 pancakes moelleux, sirop d\'érable',
                sellingPrice: 7.00,
                businessId: business.id,
                ingredients: {
                    create: [
                        { quantity: 0.15, unit: 'kg',     productId: byName('Farine de blé T55').id },
                        { quantity: 0.12, unit: 'L',      productId: byName('Lait entier bio').id },
                        { quantity: 1,    unit: 'unités', productId: byName('Œufs frais (plein air)').id },
                        { quantity: 0.02, unit: 'kg',     productId: byName('Sucre en poudre').id },
                        { quantity: 0.03, unit: 'L',      productId: byName('Sirop d\'érable').id },
                    ],
                },
            },
        }),
        prisma.recipe.create({
            data: {
                name: 'Crêpe chocolat-banane',
                description: 'Crêpe avec sauce chocolat et banane fraîche',
                sellingPrice: 6.50,
                businessId: business.id,
                ingredients: {
                    create: [
                        { quantity: 0.10, unit: 'kg',     productId: byName('Farine de blé T55').id },
                        { quantity: 0.15, unit: 'L',      productId: byName('Lait entier bio').id },
                        { quantity: 1,    unit: 'unités', productId: byName('Œufs frais (plein air)').id },
                        { quantity: 0.03, unit: 'kg',     productId: byName('Chocolat noir 70%').id },
                        { quantity: 0.08, unit: 'kg',     productId: byName('Bananes').id },
                    ],
                },
            },
        }),
    ]);

    const [crepe, crepeNutella, galette, galetteChevreM, pancakes, crepeChocoBanane] = recipes;

    // 5. Sales history — 30 days across both locations
    console.log('Création de l\'historique des ventes (30 jours)...');

    const salesConfig = [
        // Marché Saint-Germain (samedi / dimanche = forte activité)
        { location: loc1, recipe: crepe,            baseQty: 45, variance: 15, unitPrice: 3.50 },
        { location: loc1, recipe: crepeNutella,     baseQty: 38, variance: 12, unitPrice: 5.00 },
        { location: loc1, recipe: galette,          baseQty: 30, variance: 10, unitPrice: 8.50 },
        { location: loc1, recipe: galetteChevreM,   baseQty: 20, variance: 8,  unitPrice: 9.00 },
        // Place de la Bastille (mardi / jeudi = activité moyenne)
        { location: loc2, recipe: pancakes,         baseQty: 22, variance: 8,  unitPrice: 7.00 },
        { location: loc2, recipe: crepe,            baseQty: 28, variance: 10, unitPrice: 3.50 },
        { location: loc2, recipe: crepeChocoBanane, baseQty: 18, variance: 6,  unitPrice: 6.50 },
        // Marché de Montreuil (mercredi = activité modérée)
        { location: loc3, recipe: galette,          baseQty: 25, variance: 8,  unitPrice: 8.50 },
        { location: loc3, recipe: crepeNutella,     baseQty: 30, variance: 10, unitPrice: 5.00 },
    ];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dow = date.getDay(); // 0=Sun, 6=Sat

        // Weekend boost
        const multiplier = (dow === 0 || dow === 6) ? 1.4 : (dow === 1 || dow === 5) ? 0.7 : 1.0;

        for (const cfg of salesConfig) {
            // Skip some location-day combos realistically
            if (cfg.location.id === loc1.id && dow !== 6 && dow !== 0) continue; // marché: sam + dim
            if (cfg.location.id === loc2.id && dow !== 2 && dow !== 4) continue; // bastille: mar + jeu
            if (cfg.location.id === loc3.id && dow !== 3) continue;              // montreuil: mer

            const qty = Math.max(
                1,
                Math.round((cfg.baseQty + (Math.random() - 0.5) * cfg.variance * 2) * multiplier)
            );

            await prisma.dailySales.create({
                data: {
                    date,
                    quantity: qty,
                    unitPrice: cfg.unitPrice,
                    totalRevenue: qty * cfg.unitPrice,
                    recipeId: cfg.recipe.id,
                    locationId: cfg.location.id,
                },
            });
        }
    }

    // 6. Stock history for all products
    console.log('Création de l\'historique stock...');
    for (const product of products) {
        await prisma.stockHistory.create({
            data: {
                productId: product.id,
                quantity: product.quantity,
                type: StockChangeType.DELIVERY,
                note: 'Livraison initiale',
            },
        });
    }

    // 7. A few waste events
    console.log('Création des pertes...');
    await prisma.wasteEvent.createMany({
        data: [
            { productId: byName('Fraises Gariguette').id, quantity: 0.5, reason: 'EXPIRED', date: new Date() },
            { productId: byName('Emmental tranché').id,   quantity: 1.5, reason: 'EXPIRED', date: new Date() },
            { productId: byName('Crème fraîche épaisse').id, quantity: 1, reason: 'SPOILED', date: new Date() },
        ],
    });

    console.log(`\n✅ Seed terminé !
──────────────────────────────
🔑 Email    : ${email}
🔒 Password : ${password}
📍 3 emplacements créés
📦 ${products.length} produits créés
🍽  ${recipes.length} recettes créées
📊 Ventes sur 30 jours
──────────────────────────────`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
