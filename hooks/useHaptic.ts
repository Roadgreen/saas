'use client';

import { useCallback } from 'react';
import { useCapacitor } from './useCapacitor';

/**
 * Hook that provides haptic feedback on native platforms.
 * Gracefully degrades to no-op on web.
 */
export function useHaptic() {
  const { isNative } = useCapacitor();

  const impact = useCallback(
    async (style: 'light' | 'medium' | 'heavy' = 'light') => {
      if (!isNative) return;
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        const styles = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy,
        };
        await Haptics.impact({ style: styles[style] });
      } catch {
        // Silently fail on web or if plugin unavailable
      }
    },
    [isNative]
  );

  const notification = useCallback(
    async (type: 'success' | 'warning' | 'error' = 'success') => {
      if (!isNative) return;
      try {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        const types = {
          success: NotificationType.Success,
          warning: NotificationType.Warning,
          error: NotificationType.Error,
        };
        await Haptics.notification({ type: types[type] });
      } catch {
        // Silently fail
      }
    },
    [isNative]
  );

  const selectionStart = useCallback(async () => {
    if (!isNative) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionStart();
    } catch {
      // Silently fail
    }
  }, [isNative]);

  const selectionChanged = useCallback(async () => {
    if (!isNative) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionChanged();
    } catch {
      // Silently fail
    }
  }, [isNative]);

  const selectionEnd = useCallback(async () => {
    if (!isNative) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionEnd();
    } catch {
      // Silently fail
    }
  }, [isNative]);

  return { impact, notification, selectionStart, selectionChanged, selectionEnd };
}
