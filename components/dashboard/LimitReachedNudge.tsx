'use client';

import { useEffect } from 'react';
import { useUpgradeNudge } from '@/hooks/useUpgradeNudge';
import { UpgradeNudge } from '@/components/dashboard/UpgradeNudge';

interface LimitReachedNudgeProps {
  /** Unique key for this limit (e.g., 'products', 'recipes') */
  resource: string;
  /** Current count of the resource */
  currentCount: number;
  /** Maximum allowed for FREE tier */
  maxFree: number;
}

export function LimitReachedNudge({ resource, currentCount, maxFree }: LimitReachedNudgeProps) {
  const nudge = useUpgradeNudge(`limit-${resource}`);

  useEffect(() => {
    if (nudge.isFreeUser && currentCount >= maxFree) {
      nudge.show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudge.isFreeUser, currentCount, maxFree]);

  return (
    <UpgradeNudge
      type="limit-reached"
      open={nudge.shouldShow}
      onClose={nudge.dismiss}
      limitContext={resource}
    />
  );
}
