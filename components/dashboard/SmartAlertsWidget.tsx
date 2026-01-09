'use client';

import { useTranslations } from 'next-intl';
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

  if (!isPremium) {
    return (
      <Card className="relative overflow-hidden border-indigo-200 bg-indigo-50/30">
        <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center bg-white/40 p-6 text-center">
          <Lock className="h-8 w-8 text-indigo-600 mb-2" />
          <h3 className="font-bold text-lg text-indigo-900">{ts('upgradeTitle')}</h3>
          <p className="text-sm text-indigo-700 mb-4 max-w-xs">{ts('upgradeDesc')}</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/pricing">{ts('upgradeBtn')}</Link>
          </Button>
        </div>
        
        {/* Fake content for background visual */}
        <CardHeader className="opacity-50">
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Brain className="h-5 w-5" />
            {ts('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="opacity-50 space-y-4">
           <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium text-indigo-900">Tomatoes</div>
                <div className="text-xs text-indigo-600">{ts('rec_promo', { name: 'Tomatoes' })}</div>
              </div>
           </div>
           <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium text-indigo-900">Chicken</div>
                <div className="text-xs text-indigo-600">{ts('rec_freeze', { name: 'Chicken' })}</div>
              </div>
           </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <Brain className="h-5 w-5 text-indigo-600" />
          {ts('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.length === 0 ? (
          <p className="text-sm text-indigo-600 italic">No risks detected. Great job!</p>
        ) : (
          analysis.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100 shadow-sm">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-indigo-900">{item.productName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                    {item.type === 'HIGH_WASTE' ? ts('highWaste') : ts('expiringSoon')}
                  </span>
                </div>
                <div className="text-sm text-indigo-700 mt-1">
                  {item.type === 'HIGH_WASTE' 
                   ? t('highWasteDetail', { rate: item.detail }) 
                   : t('expiryDetail', { count: item.detail })}
                </div>
                <div className="text-xs text-indigo-500 italic mt-1">
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
