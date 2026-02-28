'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PRODUCT_UNITS } from '@/lib/units';
import { toast } from 'sonner';

const adjustmentSchema = z.object({
  type: z.enum(['ADD', 'REMOVE']),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  reason: z.string().optional(),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

interface StockAdjustmentDialogProps {
  productId: string;
  productName: string;
  currentUnit: string;
  currentQuantity?: number;
}

export function StockAdjustmentDialog({ productId, productName, currentUnit, currentQuantity }: StockAdjustmentDialogProps) {
  const t = useTranslations('Stock');
  const tUnits = useTranslations('Products.units');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: 'ADD',
      quantity: 0,
      unit: currentUnit,
      reason: '',
    },
  });

  const onSubmit = async (data: AdjustmentFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || t('adjustError'));
      }

      toast.success(t('adjustSuccess'));
      form.reset({ type: 'ADD', quantity: 0, unit: currentUnit, reason: '' });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setError(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          {t('adjust')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('adjust')} - {productName}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        {currentQuantity != null && (
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            {t('currentStock')}: <span className="font-medium text-foreground">{currentQuantity} {currentUnit}</span>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('type')}</Label>
            <RadioGroup
              defaultValue="ADD"
              onValueChange={(val) => form.setValue('type', val as 'ADD' | 'REMOVE')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ADD" id="add" />
                <Label htmlFor="add">{t('addStock')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="REMOVE" id="remove" />
                <Label htmlFor="remove">{t('removeStock')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('quantity')}</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...form.register('quantity', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">{t('unit')}</Label>
              <Select
                defaultValue={currentUnit}
                onValueChange={(value) => form.setValue('unit', value)}
              >
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {tUnits(u.value as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">{t('reason')}</Label>
            <Input
              id="reason"
              {...form.register('reason')}
              placeholder={t('optionalNote')}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
