'use client';

import { useState, useCallback } from 'react';
import { getCurrentPosition, type Coordinates } from '@/lib/geolocation';

interface GeolocationState {
  position: Coordinates | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook that provides geolocation access using Capacitor on native platforms,
 * falling back to browser Geolocation API on web.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: false,
    error: null,
  });

  const getPosition = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const coords = await getCurrentPosition();
      setState({
        position: coords,
        loading: false,
        error: null,
      });
      return coords;
    } catch (error: any) {
      const errorMessage = error?.message || 'geolocation_failed';
      setState({
        position: null,
        loading: false,
        error: errorMessage,
      });
      return null;
    }
  }, []);

  const clearPosition = useCallback(() => {
    setState({
      position: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    getPosition,
    clearPosition,
  };
}
