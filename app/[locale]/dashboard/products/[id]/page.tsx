import { ProductForm } from '@/components/product-form';
import { StockHistoryList } from '@/components/dashboard/StockHistoryList';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const history = await prisma.stockHistory.findMany({
    where: { productId: id },
    orderBy: { date: 'desc' },
    take: 50, // Limit to last 50 entries
  });

  const t = await getTranslations('Products');

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">{t('editProductTitle')}</h1>
        <ProductForm 
          initialData={{
            ...product,
            expiryDate: product.expiryDate.toISOString(),
          }} 
          isEditing 
        />
      </div>
      
      <StockHistoryList history={history} />
    </div>
  );
}
