'use client';

import { type ReactNode } from 'react';
import { PageTransition } from './PageTransition';
import { PullToRefresh } from './PullToRefresh';
import { AppSplashScreen } from './SplashScreen';
import { useCapacitor } from '@/hooks/useCapacitor';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isNative } = useCapacitor();

  // Initialize push notifications on native platforms (auto-registers on mount)
  usePushNotifications();

  return (
    <>
      {isNative && <AppSplashScreen />}
      <PullToRefresh>
        <PageTransition>
          {children}
        </PageTransition>
      </PullToRefresh>
    </>
  );
}
