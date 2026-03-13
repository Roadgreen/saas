'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook to manage upgrade nudge visibility.
 * - Only shows for FREE tier users (not PRO/ENTERPRISE/ADMIN)
 * - Shows each nudge only once per session (sessionStorage)
 * - Returns { shouldShow, show, dismiss, isFreeUser }
 */
export function useUpgradeNudge(nudgeKey: string) {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  const tier = session?.user?.subscriptionTier;
  const role = session?.user?.role;
  const isFreeUser =
    !!session?.user && tier !== 'PRO' && tier !== 'ENTERPRISE' && role !== 'ADMIN';

  const storageKey = `upgrade-nudge-${nudgeKey}`;

  const wasShown = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(storageKey) === '1';
  }, [storageKey]);

  const markShown = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, '1');
    }
  }, [storageKey]);

  const show = useCallback(() => {
    if (!isFreeUser) return;
    if (wasShown()) return;
    markShown();
    setVisible(true);
  }, [isFreeUser, wasShown, markShown]);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    shouldShow: visible,
    show,
    dismiss,
    isFreeUser,
  };
}

/**
 * Hook that auto-shows the nudge on mount if user is FREE.
 * Useful for page-level nudges (predictions, scanner).
 */
export function useAutoUpgradeNudge(nudgeKey: string) {
  const nudge = useUpgradeNudge(nudgeKey);

  useEffect(() => {
    if (nudge.isFreeUser) {
      nudge.show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudge.isFreeUser]);

  return nudge;
}

/**
 * Hook for the 7-day usage nudge.
 * Shows after the user has been using FoodTracks for 7+ days.
 */
export function useDaysUsedNudge(daysUsed: number | null | undefined) {
  const nudge = useUpgradeNudge('7-days-usage');

  useEffect(() => {
    if (nudge.isFreeUser && daysUsed != null && daysUsed >= 7) {
      nudge.show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudge.isFreeUser, daysUsed]);

  return nudge;
}
