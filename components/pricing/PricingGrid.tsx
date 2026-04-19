'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { CheckoutButton } from '@/components/pricing/CheckoutButton';

export type Billing = 'monthly' | 'yearly';

interface PricingGridProps {
  /** Tier the signed-in user is currently on (FREE / PRO / ENTERPRISE) */
  currentTier: string;
}

const PLANS = [
  { key: 'free',       tier: 'FREE',       cardVariant: 'outline' as const, togglesPrice: false },
  { key: 'pro',        tier: 'PRO',        cardVariant: 'default' as const, togglesPrice: true  },
  { key: 'enterprise', tier: 'ENTERPRISE', cardVariant: 'outline' as const, togglesPrice: false },
];

export function PricingGrid({ currentTier }: PricingGridProps) {
  const t = useTranslations('Pricing');
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <>
      {/* ── Monthly / Yearly toggle ─────────────────────── */}
      <div
        className="mx-auto flex items-center gap-1 rounded-full border bg-muted/30 p-1 text-sm font-medium w-fit"
        role="radiogroup"
        aria-label={t('billing.toggleAria')}
      >
        <button
          type="button"
          role="radio"
          aria-checked={billing === 'monthly'}
          onClick={() => setBilling('monthly')}
          className={`rounded-full px-5 py-2 transition-colors ${
            billing === 'monthly'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('billing.monthly')}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={billing === 'yearly'}
          onClick={() => setBilling('yearly')}
          className={`rounded-full px-5 py-2 transition-colors inline-flex items-center gap-2 ${
            billing === 'yearly'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('billing.yearly')}
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#16A34A' }}
          >
            {t('billing.savingsBadge')}
          </span>
        </button>
      </div>

      {/* ── Plan cards ──────────────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-3 items-stretch">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const showYearly = plan.togglesPrice && billing === 'yearly';
          const priceLabel = showYearly ? t(`${plan.key}.priceYearly`) : t(`${plan.key}.price`);

          return (
            <Card key={plan.key} className={`flex flex-col h-full ${isCurrent ? 'border-primary border-2' : ''}`}>
              <CardHeader>
                {plan.key === 'pro' && (
                  <Badge variant="default" className="w-fit mb-2">{t('popular')}</Badge>
                )}
                <CardTitle>{t(`${plan.key}.title`)}</CardTitle>
                <CardDescription>{t(`${plan.key}.description`)}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{priceLabel}</span>
                  {plan.togglesPrice && (
                    <span className="text-sm text-muted-foreground">{t('billing.perMonth')}</span>
                  )}
                </div>

                {/* Secondary line below price: billed-annually hint or empty spacer
                    to keep card heights aligned. */}
                <p className="mb-4 text-xs text-muted-foreground min-h-[1.25rem]">
                  {showYearly
                    ? t('billing.billedAnnually', { total: t(`${plan.key}.priceYearlyTotal`) })
                    : ''}
                </p>

                <ul className="space-y-2">
                  {(t.raw(`${plan.key}.features`) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {plan.tier === 'FREE' ? (
                  <CheckoutButton
                    tier="FREE"
                    label={isCurrent ? t('currentPlan') : t('subscribe')}
                    variant="outline"
                    isCurrentPlan={isCurrent}
                    currentPlanLabel={t('currentPlan')}
                    disabled
                  />
                ) : plan.tier === 'ENTERPRISE' ? (
                  <CheckoutButton
                    tier="ENTERPRISE"
                    billing={billing}
                    label={isCurrent ? t('currentPlan') : t('contact')}
                    variant="outline"
                    isCurrentPlan={isCurrent}
                    currentPlanLabel={t('currentPlan')}
                  />
                ) : (
                  <CheckoutButton
                    tier="PRO"
                    billing={billing}
                    label={isCurrent ? t('currentPlan') : t('subscribe')}
                    variant="default"
                    isCurrentPlan={isCurrent}
                    currentPlanLabel={t('currentPlan')}
                  />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
