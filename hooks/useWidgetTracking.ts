'use client';

/**
 * useWidgetTracking — fires a `widget_visible` event the first time
 * a dashboard widget enters the viewport (Intersection Observer).
 *
 * Usage:
 *   const ref = useWidgetTracking('PredictionsWidget');
 *   return <div ref={ref}>...</div>;
 *
 * The event is fired ONCE per mount (tracks genuine first impressions).
 * `threshold` controls how much of the element must be visible (0–1).
 *
 * Works automatically on any element — attach the ref to your widget wrapper.
 */

import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export function useWidgetTracking(
  widgetName: string,
  threshold = 0.4,
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  const { track } = useAnalytics();
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          track('widget_visible', {
            widget: widgetName,
            visibilityRatio: Math.round(entry.intersectionRatio * 100) / 100,
          });
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [widgetName, threshold, track]);

  return ref;
}
