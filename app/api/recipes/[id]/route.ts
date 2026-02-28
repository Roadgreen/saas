import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const RecipeUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(0),
        unit: z.string(),
    })).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
            ingredients: {
                include: { product: true },
            },
        },
    });

    if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Verify ownership
    if (recipe.businessId !== user.business.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(recipe);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Verify recipe ownership
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id },
        select: { businessId: true },
    });

    if (!existingRecipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (existingRecipe.businessId !== user.business.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, description, ingredients } = RecipeUpdateSchema.parse(body);

        // If ingredients are provided, verify all productIds belong to the user's business
        if (ingredients && ingredients.length > 0) {
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

        // Transaction to update recipe and ingredients
        const recipe = await prisma.$transaction(async (tx) => {
            const updatedRecipe = await tx.recipe.update({
                where: { id },
                data: {
                    name,
                    description,
                },
            });

            if (ingredients) {
                // Delete existing ingredients
                await tx.recipeIngredient.deleteMany({
                    where: { recipeId: id },
                });

                // Create new ingredients
                await tx.recipeIngredient.createMany({
                    data: ingredients.map((ing) => ({
                        recipeId: id,
                        productId: ing.productId,
                        quantity: ing.quantity,
                        unit: ing.unit,
                    })),
                });
            }

            return updatedRecipe;
        });

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Update recipe error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Verify recipe ownership
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id },
        select: { businessId: true },
    });

    if (!existingRecipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (existingRecipe.businessId !== user.business.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await prisma.recipe.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete recipe error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
