import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's business for ownership verification
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return new NextResponse('Business not found', { status: 404 });
    }

    // Check subscription tier
    if (user.business.subscriptionTier === 'FREE') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const businessId = user.business.id;

    try {
        const [products, recipes, sales] = await Promise.all([
            prisma.product.findMany({ where: { location: { businessId } } }),
            prisma.recipe.findMany({ where: { businessId } }),
            prisma.dailySales.findMany({
                where: { location: { businessId } },
                include: { recipe: true, location: true }
            }),
        ]);

        let csvContent = "Type,ID,Name,Quantity,Unit,Date,Extra\n";

        // Add Products
        products.forEach(p => {
            csvContent += `Product,${p.id},"${p.name.replace(/"/g, '""')}",${p.quantity},${p.unit},${p.expiryDate.toISOString()},Status: ${p.status}\n`;
        });

        // Add Recipes
        recipes.forEach(r => {
            csvContent += `Recipe,${r.id},"${r.name.replace(/"/g, '""')}",,,${r.createdAt.toISOString()},Price: ${r.sellingPrice || 0}\n`;
        });

        // Add Sales
        sales.forEach(s => {
            csvContent += `Sale,${s.id},"${s.recipe.name.replace(/"/g, '""')}",${s.quantity},,${s.date.toISOString()},Revenue: ${s.totalRevenue || 0}\n`;
        });

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="snaptrack_export.csv"',
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
