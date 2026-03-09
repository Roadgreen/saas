'use client';

import { useEffect } from 'react';

export function NativeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only init native plugins on Capacitor platforms
    import('@/lib/capacitor').then(({ initNativePlugins, isNative }) => {
      if (isNative) {
        initNativePlugins();
      }
    });
  }, []);

  return <>{children}</>;
}
