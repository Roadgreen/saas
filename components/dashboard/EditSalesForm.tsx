'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pencil, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getEditSalesSchema = (t: any) => z.object({
  recipeId: z.string().min(1, t('validation.recipeRequired')),
  quantitySold: z.number().int().min(1, t('validation.quantityMin')),
});

type EditSalesFormValues = z.infer<ReturnType<typeof getEditSalesSchema>>;

interface Recipe {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  recipe: { name: string };
  recipeId: string;
}

interface EditSalesFormProps {
  item: OrderItem;
  recipes: Recipe[];
}

export function EditSalesForm({ item, recipes }: EditSalesFormProps) {
  const t = useTranslations('Sales');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSalesFormValues>({
    resolver: zodResolver(getEditSalesSchema(t)),
    defaultValues: {
      recipeId: item.recipeId,
      quantitySold: item.quantity,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        recipeId: item.recipeId,
        quantitySold: item.quantity,
      });
    }
  }, [open, item, reset]);

  const onSubmit = async (data: EditSalesFormValues) => {
    setLoading(true);
    try {
      const payload = {
        id: item.id,
        ...data,
      };

      const response = await fetch('/api/order-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update item');

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Pencil className="h-3 w-3" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{t('editSale')}</SheetTitle>
          <SheetDescription>
            {t('editDescription')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="recipeId">{t('recipe')}</Label>
            <select
              id="recipeId"
              {...register('recipeId')}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('selectRecipe')}</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
            {errors.recipeId && (
              <p className="text-sm text-red-500">{errors.recipeId.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantitySold">{t('quantity')}</Label>
            <Input
              id="quantitySold"
              type="number"
              min="1"
              {...register('quantitySold', { valueAsNumber: true })}
            />
            {errors.quantitySold && (
              <p className="text-sm text-red-500">{errors.quantitySold.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
