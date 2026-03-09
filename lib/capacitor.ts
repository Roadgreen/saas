// Capacitor native integration utilities
// Only runs on native platforms (iOS/Android), no-op on web

import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Initialize native plugins when running in Capacitor shell
 */
export async function initNativePlugins() {
  if (!isNative) return;

  // Status bar
  const { StatusBar, Style } = await import('@capacitor/status-bar');
  await StatusBar.setStyle({ style: Style.Light });

  if (platform === 'android') {
    await StatusBar.setBackgroundColor({ color: '#16a34a' });
  }

  // Splash screen — hide after app is ready
  const { SplashScreen } = await import('@capacitor/splash-screen');
  await SplashScreen.hide();

  // Handle deep links / back button on Android
  const { App } = await import('@capacitor/app');
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  // Keyboard adjustments
  const { Keyboard } = await import('@capacitor/keyboard');
  Keyboard.addListener('keyboardWillShow', () => {
    document.body.classList.add('keyboard-open');
  });
  Keyboard.addListener('keyboardWillHide', () => {
    document.body.classList.remove('keyboard-open');
  });
}

/**
 * Trigger haptic feedback
 */
export async function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (!isNative) return;
  const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
  const styles = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };
  await Haptics.impact({ style: styles[type] });
}

/**
 * Open camera for scanning (food items, receipts)
 */
export async function openCamera() {
  if (!isNative) return null;
  const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
  });
  return photo.base64String;
}

/**
 * Register for push notifications
 */
export async function registerPushNotifications() {
  if (!isNative) return null;
  const { PushNotifications } = await import('@capacitor/push-notifications');

  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') return null;

  await PushNotifications.register();

  return new Promise<string>((resolve) => {
    PushNotifications.addListener('registration', (token) => {
      resolve(token.value);
    });
  });
}
