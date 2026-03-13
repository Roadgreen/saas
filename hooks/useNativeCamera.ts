'use client';

import { useCallback } from 'react';
import { useCapacitor } from './useCapacitor';

/**
 * Hook that provides native camera access on Capacitor platforms.
 * Returns null on web (fallback to file input).
 */
export function useNativeCamera() {
  const { isNative } = useCapacitor();

  /**
   * Opens the native camera and returns a File object.
   * Returns null if cancelled or on web.
   */
  const takePhoto = useCallback(async (): Promise<File | null> => {
    if (!isNative) return null;

    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1920,
        height: 1920,
        correctOrientation: true,
      });

      if (!photo.dataUrl) return null;

      // Convert data URL to File
      const response = await fetch(photo.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `camera-${Date.now()}.${photo.format || 'jpeg'}`, {
        type: `image/${photo.format || 'jpeg'}`,
      });

      return file;
    } catch (error: any) {
      // User cancelled or camera unavailable
      if (error?.message?.includes('cancelled') || error?.message?.includes('canceled')) {
        return null;
      }
      console.error('Camera error:', error);
      return null;
    }
  }, [isNative]);

  /**
   * Opens photo picker (gallery) on native, returns a File.
   * Returns null if cancelled or on web.
   */
  const pickPhoto = useCallback(async (): Promise<File | null> => {
    if (!isNative) return null;

    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 1920,
        height: 1920,
      });

      if (!photo.dataUrl) return null;

      const response = await fetch(photo.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `gallery-${Date.now()}.${photo.format || 'jpeg'}`, {
        type: `image/${photo.format || 'jpeg'}`,
      });

      return file;
    } catch (error: any) {
      if (error?.message?.includes('cancelled') || error?.message?.includes('canceled')) {
        return null;
      }
      console.error('Gallery picker error:', error);
      return null;
    }
  }, [isNative]);

  return { takePhoto, pickPhoto, isNative };
}
