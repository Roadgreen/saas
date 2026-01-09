'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Loader2, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCurrentPosition, getDistanceFromLatLonInKm } from '@/lib/geolocation';

interface Recipe {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

interface QuickSalesGridProps {
  recipes: Recipe[];
}

export function QuickSalesGrid({ recipes }: QuickSalesGridProps) {
  const t = useTranslations('QuickSales');
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      // 1. Fetch saved locations
      const res = await fetch('/api/locations');
      if (!res.ok) return;
      const locations: Location[] = await res.json();

      // 2. Get current position
      const coords = await getCurrentPosition();

      // 3. Find nearest
      let nearest: Location | null = null;
      let minDistance = Infinity;

      locations.forEach(loc => {
        if (loc.latitude && loc.longitude) {
          const dist = getDistanceFromLatLonInKm(
            coords.latitude, 
            coords.longitude, 
            loc.latitude, 
            loc.longitude
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearest = loc;
          }
        }
      });

      // If within 1km, set it
      if (minDistance < 1 && nearest) {
        setCurrentLocation(nearest);
        // Fetch weather
        fetchWeather(coords.latitude, coords.longitude);
      }
    } catch (error) {
      console.log("QuickSales: Location detection failed or denied");
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (error) {
      console.error("Weather error", error);
    }
  };

  const handleQuickAdd = async (recipe: Recipe) => {
    setLoadingId(recipe.id);
    try {
      const payload = {
        recipeId: recipe.id,
        quantitySold: 1,
        date: new Date().toISOString().split('T')[0],
        locationId: currentLocation?.id,
        weatherSnapshot: weather
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to record sale');

      toast.success(t('added', { name: recipe.name }));
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            {t('title')}
          </div>
          {currentLocation && (
            <div className="flex items-center gap-1 text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              <MapPin className="h-3 w-3" />
              {currentLocation.name}
              {weather && <span>• {weather.temp}°C</span>}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recipes.map((recipe) => (
            <Button
              key={recipe.id}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
              onClick={() => handleQuickAdd(recipe)}
              disabled={loadingId === recipe.id}
            >
              {loadingId === recipe.id ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-2xl">🍔</span>
              )}
              <span className="font-medium text-wrap text-center leading-tight">
                {recipe.name}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
