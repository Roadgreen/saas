'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/image-upload';
import { PRODUCT_UNITS } from '@/lib/units';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const getProductSchema = (t: any) => z.object({
  name: z.string().min(1, t('validation.nameRequired')),
  quantity: z.coerce.number().min(0, t('validation.quantityPositive')),
  unit: z.string().min(1, t('validation.unitRequired')),
  expiryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: t('validation.invalidDate'),
  }),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<ReturnType<typeof getProductSchema>>;

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations('Products.form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(getProductSchema(t)) as any,
    defaultValues: initialData ? {
      ...initialData,
      expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
    } : {
      quantity: 1,
      unit: 'units',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    setError(null);

    try {
      const url = isEditing && initialData?.id
        ? `/api/products/${initialData.id}`
        : '/api/products';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label>{t('image')}</Label>
        <ImageUpload 
          value={watch('imageUrl')} 
          onChange={(url) => setValue('imageUrl', url)} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input id="name" {...register('name')} placeholder={t('namePlaceholder')} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">{t('quantity')}</Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">{t('unit')}</Label>
          <Select 
            onValueChange={(value) => setValue('unit', value)} 
            defaultValue={initialData?.unit || 'units'}
          >
            <SelectTrigger id="unit">
              <SelectValue placeholder={t('selectUnit')} />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {useTranslations('Products.units')(u.value as any)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && (
            <p className="text-sm text-red-500">{errors.unit.message as string}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
        <Input
          id="expiryDate"
          type="date"
          {...register('expiryDate')}
        />
        {errors.expiryDate && (
          <p className="text-sm text-red-500">{errors.expiryDate.message as string}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? t('saving') : isEditing ? useTranslations('Products')('updateProduct') : useTranslations('Products')('addProduct')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
