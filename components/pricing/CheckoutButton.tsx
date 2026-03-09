'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

interface CheckoutButtonProps {
  tier: string;
  label: string;
  variant?: 'default' | 'outline';
  disabled?: boolean;
  isCurrentPlan?: boolean;
  currentPlanLabel?: string;
}

export function CheckoutButton({
  tier,
  label,
  variant = 'default',
  disabled,
  isCurrentPlan,
  currentPlanLabel,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  if (isCurrentPlan) {
    return (
      <Button className="w-full" variant={variant} disabled>
        {currentPlanLabel}
      </Button>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, locale }),
      });

      if (res.status === 401) {
        window.location.href = `/${locale}/login`;
        return;
      }

      if (!res.ok) {
        try {
          const err = await res.json();
          alert(err.error ?? `Erreur ${res.status}`);
        } catch {
          alert(`Erreur serveur (${res.status}) — vérifie la console du terminal`);
        }
        return;
      }

      const data = await res.json();
      if (data.url) {
        // On native app, open Stripe in external browser (avoids Apple 30% cut)
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          const { Browser } = await import('@capacitor/browser');
          await Browser.open({ url: data.url });
        } else {
          window.location.href = data.url;
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full"
      variant={variant}
      disabled={disabled || loading}
      onClick={handleCheckout}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </Button>
  );
}
