'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentPosition, getDistanceFromLatLonInKm } from '@/lib/geolocation';

interface LocationData {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  radius: number;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity?: number;
}

type DetectionMode = 'gps' | 'manual';

interface LocationContextType {
  currentLocation: LocationData | null;
  weather: WeatherData | null;
  isDetecting: boolean;
  error: string | null;
  mode: DetectionMode;
  availableLocations: LocationData[];
  refresh: () => Promise<void>;
  selectManual: (locationId: string | null) => void;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  weather: null,
  isDetecting: false,
  error: null,
  mode: 'gps',
  availableLocations: [],
  refresh: async () => {},
  selectManual: () => {},
});

export function useLocationContext() {
  return useContext(LocationContext);
}

const STORAGE_KEY = 'foodtracks-location';
const MANUAL_KEY = 'foodtracks-manual-location';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

interface CachedLocationData {
  currentLocation: LocationData | null;
  weather: WeatherData | null;
  timestamp: number;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<DetectionMode>('gps');
  const [availableLocations, setAvailableLocations] = useState<LocationData[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLocations = useCallback(async (): Promise<LocationData[]> => {
    try {
      const res = await fetch('/api/locations');
      if (!res.ok) return [];
      const locs: LocationData[] = await res.json();
      setAvailableLocations(locs);
      return locs;
    } catch {
      return [];
    }
  }, []);

  const detectLocation = useCallback(async (useCache: boolean = true) => {
    // Check for manual override first
    try {
      const manualId = sessionStorage.getItem(MANUAL_KEY);
      if (manualId) {
        const locations = await fetchLocations();
        const manual = locations.find(l => l.id === manualId);
        if (manual) {
          setCurrentLocation(manual);
          setMode('manual');
          setError(null);
          return;
        }
        // Invalid manual ID, clear it
        sessionStorage.removeItem(MANUAL_KEY);
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Try to use cached data from sessionStorage
    if (useCache) {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed: CachedLocationData = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < REFRESH_INTERVAL) {
            setCurrentLocation(parsed.currentLocation);
            setWeather(parsed.weather);
            setMode('gps');
            return;
          }
        }
      } catch {
        // Ignore sessionStorage errors
      }
    }

    setIsDetecting(true);
    setError(null);
    setMode('gps');

    try {
      const locations = await fetchLocations();

      // Get current GPS position
      const coords = await getCurrentPosition();

      // Find nearest known location within its radius
      let matchedLocation: LocationData | null = null;
      let minDistance = Infinity;

      for (const loc of locations) {
        if (loc.latitude != null && loc.longitude != null) {
          const distance = getDistanceFromLatLonInKm(
            coords.latitude,
            coords.longitude,
            loc.latitude,
            loc.longitude
          );
          const radiusInKm = loc.radius / 1000;
          if (distance <= radiusInKm && distance < minDistance) {
            minDistance = distance;
            matchedLocation = loc;
          }
        }
      }

      setCurrentLocation(matchedLocation);

      // Fetch weather for current position
      let weatherData: WeatherData | null = null;
      try {
        const weatherRes = await fetch(
          `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`
        );
        if (weatherRes.ok) {
          weatherData = await weatherRes.json();
          setWeather(weatherData);
        }
      } catch {
        // Weather fetch failed silently
      }

      // Cache result
      try {
        const cacheData: CachedLocationData = {
          currentLocation: matchedLocation,
          weather: weatherData,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch {
        // Ignore sessionStorage write errors
      }
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === err.PERMISSION_DENIED) {
          setError('GPS permission denied');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Position unavailable');
        } else if (err.code === err.TIMEOUT) {
          setError('GPS timeout');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Location detection failed');
      }

      // Even on GPS error, make sure locations are loaded for manual fallback
      if (availableLocations.length === 0) {
        await fetchLocations();
      }
    } finally {
      setIsDetecting(false);
    }
  }, [fetchLocations, availableLocations.length]);

  const selectManual = useCallback((locationId: string | null) => {
    if (locationId === null) {
      // Switch back to GPS mode
      try {
        sessionStorage.removeItem(MANUAL_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      setMode('gps');
      setCurrentLocation(null);
      setError(null);
      // Re-detect via GPS
      detectLocation(false);
    } else {
      const loc = availableLocations.find(l => l.id === locationId);
      if (loc) {
        setCurrentLocation(loc);
        setMode('manual');
        setError(null);
        try {
          sessionStorage.setItem(MANUAL_KEY, locationId);
        } catch {
          // Ignore
        }
      }
    }
  }, [availableLocations, detectLocation]);

  const refresh = useCallback(async () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(MANUAL_KEY);
    } catch {
      // Ignore
    }
    setMode('gps');
    await detectLocation(false);
  }, [detectLocation]);

  useEffect(() => {
    detectLocation(true);

    intervalRef.current = setInterval(() => {
      // Only auto-refresh in GPS mode
      if (mode === 'gps') {
        detectLocation(false);
      }
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [detectLocation, mode]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        weather,
        isDetecting,
        error,
        mode,
        availableLocations,
        refresh,
        selectManual,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
