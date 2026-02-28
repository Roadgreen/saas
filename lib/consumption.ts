import { prisma } from '@/lib/prisma';
import { convertToBaseUnit, convertFromBaseUnit } from './units';

export async function processDailySales(recipeId: string, quantitySold: number) {
    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: {
            ingredients: {
                include: { product: true },
            },
        },
    });

    if (!recipe) {
        throw new Error('Recipe not found');
    }

    const results: { productName: string; consumed: number; unit: string; remaining: number }[] = [];

    // Transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
        for (const ingredient of recipe.ingredients) {
            const product = ingredient.product;

            // Calculate total required amount for this ingredient
            const requiredAmount = ingredient.quantity * quantitySold;

            // Normalize units to compare/subtract
            const requiredBase = convertToBaseUnit(requiredAmount, ingredient.unit);
            const productBase = convertToBaseUnit(product.quantity, product.unit);

            if (requiredBase.unit !== productBase.unit) {
                console.warn(`Unit mismatch for ${product.name}: Recipe uses ${ingredient.unit}, Stock uses ${product.unit}`);
                continue; // Skip if units are incompatible (e.g. kg vs liters)
            }

            // Calculate new quantity in base unit
            const newQuantityBase = productBase.quantity - requiredBase.quantity;

            // Convert back to product's original unit for storage
            const newQuantity = convertFromBaseUnit(newQuantityBase, product.unit);

            // Update product stock
            await tx.product.update({
                where: { id: product.id },
                data: { quantity: newQuantity },
            });

            // Log stock history
            await tx.stockHistory.create({
                data: {
                    quantity: -requiredAmount, // Negative because it's consumption
                    type: 'SALES',
                    productId: product.id,
                    note: `Sales: ${quantitySold}x ${recipe.name}`,
                },
            });

            results.push({
                productName: product.name,
                consumed: requiredAmount,
                unit: ingredient.unit,
                remaining: newQuantity,
            });
        }
    });

    return results;
}
