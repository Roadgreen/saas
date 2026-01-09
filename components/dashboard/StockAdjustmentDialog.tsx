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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
}

export function StockAdjustmentDialog({ productId, productName, currentUnit }: StockAdjustmentDialogProps) {
  const t = useTranslations('Stock');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    try {
      const response = await fetch(`/api/products/${productId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to adjust stock');

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                step="0.001"
                {...form.register('quantity', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">{t('unit')}</Label>
              <Input
                id="unit"
                {...form.register('unit')}
              />
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
