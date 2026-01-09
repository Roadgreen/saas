import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RecipeWithDetails {
    id: string;
    name: string;
    description: string | null;
    sellingPrice: number | null;
    ingredients: {
        id: string;
        quantity: number;
        unit: string;
        product: {
            name: string;
            costPerUnit: number | null;
            unit: string;
        };
    }[];
    totalCost: number;
    grossMargin: number | null;
}

export async function getRecipesWithCost(businessId: string): Promise<RecipeWithDetails[]> {
    const recipes = await (prisma as any).recipe.findMany({
        where: { businessId },
        include: {
            ingredients: {
                include: {
                    product: true,
                },
            },
        },
    });

    return recipes.map((recipe: any) => {
        const totalCost = recipe.ingredients.reduce((acc: number, ing: any) => {
            const cost = ing.quantity * (ing.product.costPerUnit || 0);
            return acc + cost;
        }, 0);

        let grossMargin = null;
        if (recipe.sellingPrice && recipe.sellingPrice > 0) {
            grossMargin = ((recipe.sellingPrice - totalCost) / recipe.sellingPrice) * 100;
        }

        return {
            ...recipe,
            totalCost,
            grossMargin,
        };
    });
}
