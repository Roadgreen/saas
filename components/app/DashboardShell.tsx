'use client';

import { type ReactNode } from 'react';
import { PageTransition } from './PageTransition';
import { PullToRefresh } from './PullToRefresh';
import { AppSplashScreen } from './SplashScreen';
import { useCapacitor } from '@/hooks/useCapacitor';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isNative } = useCapacitor();

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
