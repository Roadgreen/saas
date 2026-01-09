'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { StockAdjustmentDialog } from '@/components/dashboard/StockAdjustmentDialog';

export default function ProductsPage() {
  const locale = useLocale();
  const t = useTranslations('Products');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('inventory')}</h1>
        <Link href={`/${locale}/dashboard/products/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('addProduct')}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">{t('loading')}</div>
      ) : (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium w-16">{t('image')}</th>
              <th className="px-6 py-3 font-medium">{t('name')}</th>
              <th className="px-6 py-3 font-medium">{t('quantity')}</th>
              <th className="px-6 py-3 font-medium">{t('expiryDate')}</th>
              <th className="px-6 py-3 font-medium">{t('status')}</th>
              <th className="px-6 py-3 font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {t('noProducts')}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.imageUrl ? (
                      <div className="relative h-10 w-10 rounded overflow-hidden border">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded border bg-gray-50 flex items-center justify-center text-gray-400">
                        <Plus className="h-4 w-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">
                    {product.quantity} {product.unit}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'OK' ? 'bg-green-100 text-green-800' :
                      product.status === 'NEAR_EXPIRY' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <StockAdjustmentDialog 
                      productId={product.id} 
                      productName={product.name} 
                      currentUnit={product.unit} 
                    />
                    <Link href={`/${locale}/dashboard/products/${product.id}`} className="text-blue-600 hover:underline">
                      <Button variant="ghost" size="sm">{t('edit')}</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        if (confirm(t('deleteConfirm'))) {
                          await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
                          window.location.reload();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
