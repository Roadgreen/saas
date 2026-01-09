import { ProductForm } from '@/components/product-form';
import { UploadAndAnalyze } from '@/components/UploadAndAnalyze';
import { useTranslations } from 'next-intl';

export default function NewProductPage() {
  const t = useTranslations('Products');

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">{t('newProductTitle')}</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t('scanTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('scanDesc')}</p>
            <UploadAndAnalyze />
        </div>

        <div className="space-y-4 border-t md:border-t-0 md:border-l pt-8 md:pt-0 md:pl-8">
             <h2 className="text-lg font-semibold">{t('manualEntryTitle')}</h2>
             <p className="text-sm text-muted-foreground">{t('manualEntryDesc')}</p>
             <ProductForm />
        </div>
      </div>
    </div>
  );
}
