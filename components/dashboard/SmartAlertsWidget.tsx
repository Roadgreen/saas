'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Lock, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface SmartAnalysisItem {
  type: string;
  productName: string;
  detail: string;
  recommendation: string;
}

interface SmartAlertsWidgetProps {
  analysis: SmartAnalysisItem[];
  isPremium: boolean;
}

export function SmartAlertsWidget({ analysis, isPremium }: SmartAlertsWidgetProps) {
  const t = useTranslations('Dashboard');
  const ts = useTranslations('SmartAlerts');
  const locale = useLocale();

  if (!isPremium) {
    return (
      <Card className="relative overflow-hidden dash-card">
        <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-white/80 p-6 text-center">
          <Lock className="h-8 w-8 text-emerald-600 mb-2" />
          <h3 className="font-bold text-lg text-gray-900">{ts('upgradeTitle')}</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-xs">{ts('upgradeDesc')}</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
            <Link href={`/${locale}/pricing`}>{ts('upgradeBtn')}</Link>
          </Button>
        </div>

        <CardHeader className="opacity-30">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-600" />
            {ts('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="opacity-30 space-y-4">
           <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium">Tomatoes</div>
                <div className="text-xs text-muted-foreground">{ts('rec_promo', { name: 'Tomatoes' })}</div>
              </div>
           </div>
           <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium">Chicken</div>
                <div className="text-xs text-muted-foreground">{ts('rec_freeze', { name: 'Chicken' })}</div>
              </div>
           </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dash-card border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-600" />
          {ts('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">{ts('noRisks')}</p>
        ) : (
          analysis.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                    {item.type === 'HIGH_WASTE' ? ts('highWaste') : ts('expiringSoon')}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.type === 'HIGH_WASTE'
                   ? t('highWasteDetail', { rate: item.detail })
                   : t('expiryDetail', { count: item.detail })}
                </div>
                <div className="text-xs text-emerald-600 italic mt-1">
                  {ts(item.recommendation, { name: item.productName })}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
