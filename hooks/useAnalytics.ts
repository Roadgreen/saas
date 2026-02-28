'use client';

/**
 * useAnalytics — hook for manual event tracking
 *
 * @example
 * const { track } = useAnalytics();
 * track('feature_used', { feature: 'ai_scan', tier: 'PRO' });
 * track('search', { query: 'tomato', resultCount: 12 });
 * track('form_submit', { formName: 'create_product', success: true });
 */

import { useContext } from 'react';
import { AnalyticsContext } from '@/components/providers/AnalyticsProvider';

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
