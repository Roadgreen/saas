import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { convertToBaseUnit } from '@/lib/units';

const prisma = new PrismaClient();

const AdjustmentSchema = z.object({
    quantity: z.number().positive(),
    unit: z.string().min(1),
    type: z.enum(['ADD', 'REMOVE']),
    reason: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { quantity, unit, type, reason } = AdjustmentSchema.parse(body);

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Normalize units
        const adjustmentBase = convertToBaseUnit(quantity, unit);
        const productBase = convertToBaseUnit(product.quantity, product.unit);

        if (adjustmentBase.unit !== productBase.unit) {
            return NextResponse.json({ error: `Unit mismatch. Product is in ${product.unit}, adjustment is in ${unit}` }, { status: 400 });
        }

        let newQuantityBase = productBase.quantity;
        if (type === 'ADD') {
            newQuantityBase += adjustmentBase.quantity;
        } else {
            newQuantityBase -= adjustmentBase.quantity;
        }

        // Convert back to product unit
        let newQuantity = newQuantityBase;
        // Simplified conversion back (assuming same unit family)
        if (product.unit.toLowerCase() === 'kg' || product.unit.toLowerCase() === 'kilograms') {
            newQuantity = newQuantityBase / 1000;
        } else if (product.unit.toLowerCase() === 'l' || product.unit.toLowerCase() === 'liters') {
            newQuantity = newQuantityBase / 1000;
        }

        // Update product and create history
        const result = await prisma.$transaction([
            prisma.product.update({
                where: { id },
                data: { quantity: newQuantity },
            }),
            prisma.stockHistory.create({
                data: {
                    productId: id,
                    quantity: type === 'ADD' ? quantity : -quantity,
                    type: 'MANUAL',
                    note: reason || `Manual ${type}`,
                },
            }),
        ]);

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error('Stock adjustment error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
