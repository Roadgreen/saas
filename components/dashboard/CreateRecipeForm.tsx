'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';

const getRecipeSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t('validation.nameRequired')),
  description: z.string().optional(),
  sellingPrice: z.coerce.number().min(0, t('validation.priceMin')).default(0),
  ingredients: z.array(z.object({
    productId: z.string().min(1, t('validation.productRequired')),
    quantity: z.coerce.number().min(0.001, t('validation.quantityMin')),
    unit: z.string().min(1, t('validation.unitRequired')),
  })).min(1, t('validation.ingredientsMin')),
});

type RecipeFormValues = z.infer<ReturnType<typeof getRecipeSchema>>;

interface Product {
  id: string;
  name: string;
  unit: string;
}

interface CreateRecipeFormProps {
  products: Product[];
}

export function CreateRecipeForm({ products }: CreateRecipeFormProps) {
  const t = useTranslations('Recipes');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { notification } = useHaptic();

  const form = useForm({
    resolver: zodResolver(getRecipeSchema(t)),
    defaultValues: {
      name: '',
      description: '',
      sellingPrice: 0,
      ingredients: [{ productId: '', quantity: 0, unit: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  // Keyboard shortcut: "n" → open create sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'n') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (open) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.tagName === 'SELECT')) return;
      e.preventDefault();
      setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const onSubmit = async (data: RecipeFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create recipe');

      notification('success');
      toast.success(t('createSuccess'));
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('create')}
          <kbd className="ml-2 hidden md:inline-flex items-center rounded border border-white/30 bg-white/10 px-1 py-0.5 text-[10px] font-mono">
            N
          </kbd>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('create')}</SheetTitle>
          <SheetDescription>
            {t('addIngredient')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" {...form.register('name')} placeholder="Recipe Name" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellingPrice">{t('sellingPrice')}</Label>
            <Input 
              id="sellingPrice" 
              type="number" 
              step="0.01" 
              {...form.register('sellingPrice', { valueAsNumber: true })} 
              placeholder="0.00" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Input id="description" {...form.register('description')} placeholder="Optional description" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('ingredients')}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: '', quantity: 0, unit: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addIngredient')}
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <select
                    {...form.register(`ingredients.${index}.productId`)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value);
                      if (product) {
                        form.setValue(`ingredients.${index}.unit`, product.unit);
                      }
                      form.register(`ingredients.${index}.productId`).onChange(e);
                    }}
                  >
                    <option value="">{t('selectProduct')}</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.ingredients?.[index]?.productId && (
                    <p className="text-sm text-red-500">{t('required')}</p>
                  )}
                </div>

                <div className="w-24 space-y-2">
                  <Input
                    type="number"
                    step="0.001"
                    {...form.register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                    placeholder={t('qtyPlaceholder')}
                  />
                </div>

                <div className="w-20 space-y-2">
                  <Input
                    {...form.register(`ingredients.${index}.unit`)}
                    placeholder="Unit"
                    readOnly
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            {form.formState.errors.ingredients && (
              <p className="text-sm text-red-500">{form.formState.errors.ingredients.message}</p>
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
