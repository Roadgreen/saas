'use client';

import { useEffect } from 'react';

export function NativeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import('@capacitor/core').then(({ Capacitor }) => {
      if (!Capacitor.isNativePlatform()) return;

      // Add native app class to body for CSS targeting
      document.body.classList.add('app-mode');

      // Add platform-specific class
      const platform = Capacitor.getPlatform();
      document.body.classList.add(`platform-${platform}`);

      // Init native plugins
      import('@/lib/capacitor').then(({ initNativePlugins }) => {
        initNativePlugins();
      });

      // Setup payment link interceptor (opens in external browser)
      import('@/lib/payment-redirect').then(({ setupPaymentInterceptor }) => {
        setupPaymentInterceptor();
      });
    });
  }, []);

  return <>{children}</>;
}
