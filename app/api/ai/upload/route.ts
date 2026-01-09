import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { analyzeImage } from '@/lib/ai';
import { calculateStatus } from '@/lib/utils';
import { processDailySales } from '@/lib/consumption';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: { include: { locations: true } } },
    });

    if (!user?.business || user.business.locations.length === 0) {
        return NextResponse.json({ error: 'Business or Location not found' }, { status: 404 });
    }

    const locationId = user.business.locations[0].id;

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        // Call AI directly with base64
        const parsedData = await analyzeImage(base64Image);

        if (parsedData.type === 'stock' && parsedData.items) {
            const results = [];
            for (const item of parsedData.items) {
                const expiryDate = item.expiryDate
                    ? new Date(item.expiryDate)
                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                const product = await prisma.product.create({
                    data: {
                        name: item.name,
                        quantity: item.quantity,
                        unit: item.unit,
                        expiryDate: expiryDate,
                        locationId: locationId,
                        status: calculateStatus(expiryDate),
                        costPerUnit: item.unitPrice || null,
                        purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : new Date(),
                    },
                });

                await prisma.stockHistory.create({
                    data: {
                        quantity: item.quantity,
                        type: 'MANUAL',
                        productId: product.id,
                        note: `AI Import. Price: ${item.totalPrice || 'N/A'} ${item.currency || ''}`,
                    },
                });
                results.push(product);
            }
            return NextResponse.json({ type: 'stock', count: results.length, items: results });

        } else if (parsedData.type === 'recipe' && parsedData.recipeName && parsedData.ingredients) {
            const ingredientsData = [];

            for (const ing of parsedData.ingredients) {
                let product = await prisma.product.findFirst({
                    where: {
                        name: { equals: ing.name, mode: 'insensitive' },
                        locationId: locationId
                    }
                });

                if (!product) {
                    product = await prisma.product.create({
                        data: {
                            name: ing.name,
                            quantity: 0,
                            unit: ing.unit,
                            expiryDate: new Date(),
                            locationId: locationId,
                            status: 'OK'
                        }
                    });
                }

                ingredientsData.push({
                    productId: product.id,
                    quantity: ing.quantityPerPortion,
                    unit: ing.unit
                });
            }

            const recipe = await prisma.recipe.create({
                data: {
                    name: parsedData.recipeName,
                    businessId: user.business.id,
                    ingredients: {
                        create: ingredientsData
                    }
                },
                include: { ingredients: true }
            });

            return NextResponse.json({ type: 'recipe', recipe });

        } else if (parsedData.type === 'sales' && parsedData.recipeName && parsedData.quantitySold) {
            const recipe = await prisma.recipe.findFirst({
                where: {
                    name: { equals: parsedData.recipeName, mode: 'insensitive' },
                    businessId: user.business.id
                }
            });

            if (!recipe) {
                return NextResponse.json({ error: `Recipe '${parsedData.recipeName}' not found` }, { status: 404 });
            }

            const salesRecord = await prisma.dailySales.create({
                data: {
                    recipeId: recipe.id,
                    quantity: parsedData.quantitySold,
                    date: parsedData.date ? new Date(parsedData.date) : new Date(),
                    unitPrice: parsedData.unitPrice,
                    totalRevenue: parsedData.totalRevenue,
                },
            });

            const consumption = await processDailySales(recipe.id, parsedData.quantitySold);

            return NextResponse.json({ type: 'sales', salesRecord, consumption });
        } else {
            return NextResponse.json({ error: 'Invalid or unrecognized data format from AI', data: parsedData }, { status: 400 });
        }

    } catch (error: any) {
        console.error('AI processing error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
