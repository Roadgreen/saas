import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { trackEvent } from '@/lib/tracking';

const RecipeSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    sellingPrice: z.number().min(0).optional(),
    ingredients: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(0),
        unit: z.string(),
    })),
});

export async function GET(req: Request) {
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

    const recipes = await (prisma as any).recipe.findMany({
        where: { businessId: user.business.id },
        include: {
            ingredients: {
                include: { product: true },
            },
        },
    });

    return NextResponse.json(recipes);
}

export async function POST(req: Request) {
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

    try {
        const body = await req.json();
        const { name, description, sellingPrice, ingredients } = RecipeSchema.parse(body);

        // Verify all productIds belong to the user's business
        if (ingredients.length > 0) {
            const productIds = ingredients.map((ing) => ing.productId);
            const products = await prisma.product.findMany({
                where: { id: { in: productIds } },
                include: { location: { select: { businessId: true } } },
            });

            const allOwned = products.length === productIds.length &&
                products.every((p) => p.location.businessId === user.business!.id);

            if (!allOwned) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const recipe = await (prisma as any).recipe.create({
            data: {
                name,
                description,
                sellingPrice,
                businessId: user.business.id,
                ingredients: {
                    create: ingredients.map((ing) => ({
                        productId: ing.productId,
                        quantity: ing.quantity,
                        unit: ing.unit,
                    })),
                },
            },
            include: { ingredients: true },
        });

        trackEvent('RECIPE_CREATED', {
            businessId: user.business.id,
            recipeId: recipe.id,
            recipeName: recipe.name,
            ingredientsCount: ingredients.length,
        });

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Create recipe error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
