'use client';

import { useLocationContext } from '@/components/providers/LocationProvider';
import { useTranslations } from 'next-intl';
import { MapPin, RefreshCw, Loader2, WifiOff, ChevronDown, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function LocationIndicator() {
  const {
    currentLocation,
    weather,
    isDetecting,
    error,
    mode,
    availableLocations,
    refresh,
    selectManual,
  } = useLocationContext();
  const t = useTranslations('Location');
  const [showSelect, setShowSelect] = useState(false);

  const hasLocations = availableLocations.length > 0;
  const showManualFallback = (error || (!currentLocation && !isDetecting)) && hasLocations;

  return (
    <div className="space-y-2">
      <div className={cn(
        'rounded-lg p-3 transition-colors',
        currentLocation
          ? 'bg-green-500/10 border border-green-500/30'
          : error
            ? 'bg-amber-500/10 border border-amber-500/30'
            : 'bg-white/5 border border-transparent'
      )}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isDetecting ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
            ) : error ? (
              <WifiOff className="h-4 w-4 shrink-0 text-amber-400" />
            ) : currentLocation ? (
              <div className="relative shrink-0">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 ring-2 ring-green-900/50" />
              </div>
            ) : (
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {isDetecting
                  ? t('detecting')
                  : currentLocation
                    ? currentLocation.name
                    : error
                      ? t('noGPS')
                      : t('unknown')}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {mode === 'manual' && currentLocation && (
                  <span className="inline-flex items-center rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    {t('manualMode')}
                  </span>
                )}
                {mode === 'gps' && currentLocation && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
                    <Navigation className="h-2.5 w-2.5" />
                    {t('gpsMode')}
                  </span>
                )}
                {weather && !error && !isDetecting && (
                  <span className="text-xs text-gray-400">
                    {weather.temp}°C · {weather.condition}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {hasLocations && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-white/5"
                onClick={() => setShowSelect(!showSelect)}
                aria-label={t('manualSelect')}
              >
                <ChevronDown className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  showSelect && 'rotate-180'
                )} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-white/5"
              onClick={refresh}
              disabled={isDetecting}
              aria-label={t('refreshLocation')}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isDetecting && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </div>

      {(showSelect || showManualFallback) && hasLocations && (
        <div className="space-y-1.5">
          {error && !showSelect && (
            <p className="text-xs text-gray-400 px-1">
              {t('manualSelect')}
            </p>
          )}
          <select
            value={mode === 'manual' && currentLocation ? currentLocation.id : ''}
            onChange={(e) => {
              const val = e.target.value;
              selectManual(val || null);
              if (!val) setShowSelect(false);
            }}
            className="w-full h-8 rounded-md border border-white/10 bg-white/5 px-2 text-xs font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          >
            <option value="">
              {mode === 'manual' ? t('switchToGPS') : t('selectLocation')}
            </option>
            {availableLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
