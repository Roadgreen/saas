'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useCapacitor } from './useCapacitor';

interface PushNotificationState {
  token: string | null;
  permissionGranted: boolean;
  isRegistering: boolean;
  error: string | null;
}

/**
 * Hook that manages push notification registration on native platforms.
 * Gracefully degrades to no-op on web.
 */
export function usePushNotifications() {
  const { isNative } = useCapacitor();
  const [state, setState] = useState<PushNotificationState>({
    token: null,
    permissionGranted: false,
    isRegistering: false,
    error: null,
  });
  const registeredRef = useRef(false);

  const registerToken = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pushToken: token }),
      });

      if (!res.ok) {
        throw new Error('Failed to register push token');
      }
    } catch (error) {
      console.error('Push token registration error:', error);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isNative) return;

    setState(prev => ({ ...prev, isRegistering: true, error: null }));

    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');

      // Check current permission status
      const permResult = await PushNotifications.checkPermissions();

      if (permResult.receive === 'prompt' || permResult.receive === 'prompt-with-rationale') {
        const requestResult = await PushNotifications.requestPermissions();
        if (requestResult.receive !== 'granted') {
          setState(prev => ({
            ...prev,
            isRegistering: false,
            permissionGranted: false,
            error: 'permission_denied',
          }));
          return;
        }
      } else if (permResult.receive === 'denied') {
        setState(prev => ({
          ...prev,
          isRegistering: false,
          permissionGranted: false,
          error: 'permission_denied',
        }));
        return;
      }

      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration success
      PushNotifications.addListener('registration', async (pushToken) => {
        setState(prev => ({
          ...prev,
          token: pushToken.value,
          permissionGranted: true,
          isRegistering: false,
        }));

        // Save token to backend
        await registerToken(pushToken.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
        setState(prev => ({
          ...prev,
          isRegistering: false,
          error: 'registration_failed',
        }));
      });

      // Listen for push notifications received while app is in foreground
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });

      // Listen for push notification action (user tapped on notification)
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action:', notification);
      });

      setState(prev => ({ ...prev, permissionGranted: true }));
    } catch (error: any) {
      console.error('Push notification setup error:', error);
      setState(prev => ({
        ...prev,
        isRegistering: false,
        error: error.message || 'setup_failed',
      }));
    }
  }, [isNative, registerToken]);

  // Auto-register on mount if native
  useEffect(() => {
    if (isNative && !registeredRef.current) {
      registeredRef.current = true;
      requestPermission();
    }
  }, [isNative, requestPermission]);

  return {
    ...state,
    requestPermission,
    isSupported: isNative,
  };
}
