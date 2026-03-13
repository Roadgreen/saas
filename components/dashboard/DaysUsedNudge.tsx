'use client';

import { useDaysUsedNudge } from '@/hooks/useUpgradeNudge';
import { UpgradeNudge } from '@/components/dashboard/UpgradeNudge';

interface DaysUsedNudgeProps {
  daysUsed: number | null;
}

export function DaysUsedNudge({ daysUsed }: DaysUsedNudgeProps) {
  const nudge = useDaysUsedNudge(daysUsed);

  return (
    <UpgradeNudge
      type="days-used"
      open={nudge.shouldShow}
      onClose={nudge.dismiss}
    />
  );
}
