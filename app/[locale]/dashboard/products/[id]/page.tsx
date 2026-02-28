import { ProductForm } from '@/components/product-form';
import { StockHistoryList } from '@/components/dashboard/StockHistoryList';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    notFound();
  }

  // Get user's business for ownership verification
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { location: { select: { businessId: true } } },
  });

  if (!product) {
    notFound();
  }

  // Verify ownership
  if (product.location.businessId !== user.business.id) {
    notFound();
  }

  const history = await prisma.stockHistory.findMany({
    where: { productId: id },
    orderBy: { date: 'desc' },
    take: 50, // Limit to last 50 entries
  });

  const t = await getTranslations('Products');

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t('editProductTitle')}</h1>
        <ProductForm
          initialData={{
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            unit: product.unit,
            expiryDate: product.expiryDate.toISOString(),
            imageUrl: product.imageUrl ?? undefined,
            costPerUnit: product.costPerUnit ?? undefined,
            category: product.category ?? undefined,
          }}
          isEditing
        />
      </div>

      <StockHistoryList history={history} />
    </div>
  );
}
