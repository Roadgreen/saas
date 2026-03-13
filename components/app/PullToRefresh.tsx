'use client';

import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHaptic } from '@/hooks/useHaptic';

interface PullToRefreshProps {
  children: ReactNode;
  className?: string;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

export function PullToRefresh({ children, className }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullDistance = useMotionValue(0);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { impact } = useHaptic();

  // Transforms
  const indicatorOpacity = useTransform(pullDistance, [0, 30, PULL_THRESHOLD], [0, 0.5, 1]);
  const indicatorScale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.5, 1]);
  const indicatorY = useTransform(pullDistance, [0, MAX_PULL], ['-100%', '16px']);
  const rotation = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 180]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await impact('medium');

    // Give router a moment to refresh
    router.refresh();

    // Minimum visible refresh time
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
    animate(pullDistance, 0, { type: 'spring', stiffness: 300, damping: 30 });
  }, [router, pullDistance, impact]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      // Only enable pull-to-refresh when scrolled to top
      const scrollTop = container.scrollTop || window.scrollY;
      if (scrollTop > 5 || isRefreshing) return;
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - startY.current;

      if (delta > 0) {
        // Apply resistance curve
        const resistance = Math.min(delta * 0.5, MAX_PULL);
        pullDistance.set(resistance);

        // Haptic at threshold
        if (resistance >= PULL_THRESHOLD && (pullDistance.getPrevious() ?? 0) < PULL_THRESHOLD) {
          impact('light');
        }
      }
    };

    const onTouchEnd = () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (pullDistance.get() >= PULL_THRESHOLD && !isRefreshing) {
        handleRefresh();
      } else {
        animate(pullDistance, 0, { type: 'spring', stiffness: 300, damping: 30 });
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [isRefreshing, pullDistance, handleRefresh, impact]);

  return (
    <div ref={containerRef} className={className}>
      {/* Pull indicator */}
      <motion.div
        style={{
          opacity: indicatorOpacity,
          scale: indicatorScale,
          y: indicatorY,
        }}
        className="fixed left-1/2 -translate-x-1/2 z-[60] w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center"
      >
        {isRefreshing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4 text-orange-500" />
          </motion.div>
        ) : (
          <motion.div style={{ rotate: rotation }}>
            <RefreshCw className="w-4 h-4 text-orange-500" />
          </motion.div>
        )}
      </motion.div>

      {children}
    </div>
  );
}
