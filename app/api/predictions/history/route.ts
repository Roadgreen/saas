import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const HistoryParamsSchema = z.object({
    recipeId: z.string().min(1),
    days: z.coerce.number().int().positive().default(30),
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

    if (user.business.subscriptionTier === 'FREE') {
        return NextResponse.json({ error: 'Premium feature' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const parsed = HistoryParamsSchema.parse({
            recipeId: searchParams.get('recipeId'),
            days: searchParams.get('days') || '30',
        });

        const { recipeId, days } = parsed;

        // IDOR check: verify the recipe belongs to the user's business
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { businessId: true },
        });

        if (!recipe || recipe.businessId !== user.business.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);

        const records = await prisma.predictionAccuracy.findMany({
            where: {
                recipeId,
                businessId: user.business.id,
                date: { gte: sinceDate },
            },
            orderBy: { date: 'desc' },
            include: { recipe: { select: { name: true } } },
        });

        return NextResponse.json(records);
    } catch (error) {
        console.error('Prediction history error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
