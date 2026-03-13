'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

interface UpgradeBannerProps {
  trialDaysUsed?: number | null;
  trialDaysTotal?: number;
  isTrialing?: boolean;
}

export function UpgradeBanner({ trialDaysUsed, trialDaysTotal = 14, isTrialing }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations('UpgradeBanner');
  const locale = useLocale();

  if (dismissed) return null;

  return (
    <div className="sticky top-0 z-[60] w-full border-b border-orange-500/20 bg-[#1A1410]/95 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-2.5 md:px-6">
        <Sparkles className="h-4 w-4 shrink-0 text-orange-400" />

        <div className="flex flex-1 flex-col gap-0.5 min-w-0 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-medium text-white/90 truncate">
            {t('headline')}
          </span>

          {isTrialing && trialDaysUsed != null && (
            <span className="text-xs font-medium text-orange-300/80 shrink-0">
              {t('trialCounter', { current: trialDaysUsed, total: trialDaysTotal })}
            </span>
          )}
        </div>

        <Link
          href={`/${locale}/pricing`}
          className="shrink-0 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-400 active:bg-orange-600"
        >
          {t('cta')}
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
          aria-label={t('dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
