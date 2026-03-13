'use client';

import { Lock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProFeatureGateProps {
  /** Icon to show in the card header behind the overlay */
  icon: React.ReactNode;
  /** Title to show in the card header behind the overlay */
  title: string;
  /** Optional fake content for the blurred background */
  children?: React.ReactNode;
}

export function ProFeatureGate({ icon, title, children }: ProFeatureGateProps) {
  const t = useTranslations('UpgradeBanner');
  const locale = useLocale();

  return (
    <Card className="relative overflow-hidden dash-card">
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-[#0D0905]/80 p-6 text-center">
        <div className="rounded-full bg-orange-500/10 p-3 mb-3">
          <Lock className="h-6 w-6 text-orange-400" />
        </div>
        <h3 className="font-bold text-base text-white">{t('featureLockedTitle')}</h3>
        <p className="text-sm text-white/60 mb-4 max-w-xs">{t('featureLockedDesc')}</p>
        <Link
          href={`/${locale}/pricing`}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-400"
        >
          {t('featureLockedCta')}
        </Link>
      </div>

      {/* Blurred background content */}
      <CardHeader className="opacity-30">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="opacity-30 space-y-3">
        {children ?? (
          <>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="h-3 w-full bg-white/10 rounded" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="h-3 w-3/4 bg-white/10 rounded" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="h-3 w-1/2 bg-white/10 rounded" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
