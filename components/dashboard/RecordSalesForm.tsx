'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Loader2, MapPin, CloudSun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentPosition, getDistanceFromLatLonInKm } from '@/lib/geolocation';
import { getWeather } from '@/lib/weather';

const getSalesSchema = (t: any) => z.object({
  recipeId: z.string().min(1, t('validation.recipeRequired')),
  quantitySold: z.number().int().min(1, t('validation.quantityMin')),
  date: z.string().optional(),
  locationId: z.string().optional(),
});

type SalesFormValues = z.infer<ReturnType<typeof getSalesSchema>>;

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

interface RecordSalesFormProps {
  recipes: Recipe[];
}

export function RecordSalesForm({ recipes }: RecordSalesFormProps) {
  const t = useTranslations('Sales');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [detecting, setDetecting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SalesFormValues>({
    resolver: zodResolver(getSalesSchema(t)),
    defaultValues: {
      recipeId: '',
      quantitySold: 1,
      date: new Date().toISOString().split('T')[0],
      locationId: '',
    },
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Failed to fetch locations", error);
    }
  };

  const handleAutoDetect = async () => {
    setDetecting(true);
    try {
      const coords = await getCurrentPosition();
      
      // Find nearest location
      let nearestId = '';
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
            nearestId = loc.id;
          }
        }
      });

      // If within 1km, select it
      if (minDistance < 1 && nearestId) {
        setValue('locationId', nearestId);
        fetchWeather(coords.latitude, coords.longitude);
      } else {
        // Just fetch weather for current pos even if no location matched
        // But we can't save locationId if no match. 
        // Ideally we'd allow "Custom Location" but for now let's just fetch weather.
        fetchWeather(coords.latitude, coords.longitude);
      }

    } catch (error) {
      console.error("Geolocation error", error);
    } finally {
      setDetecting(false);
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

  // When location changes manually, try to fetch weather if it has coords
  const selectedLocationId = watch('locationId');
  useEffect(() => {
    const loc = locations.find(l => l.id === selectedLocationId);
    if (loc?.latitude && loc?.longitude) {
      fetchWeather(loc.latitude, loc.longitude);
    }
  }, [selectedLocationId, locations]);

  const onSubmit = async (data: SalesFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        weatherSnapshot: weather
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to record sales');

      reset();
      setWeather(null);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('record')}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{t('record')}</SheetTitle>
          <SheetDescription>
            {t('description')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="recipeId">{t('recipe')}</Label>
            <select
              id="recipeId"
              {...register('recipeId')}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('selectRecipe')}</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
            {errors.recipeId && (
              <p className="text-sm text-red-500">{errors.recipeId.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantitySold">{t('quantity')}</Label>
            <Input
              id="quantitySold"
              type="number"
              min="1"
              {...register('quantitySold', { valueAsNumber: true })}
            />
            {errors.quantitySold && (
              <p className="text-sm text-red-500">{errors.quantitySold.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">{t('location')}</Label>
            <div className="flex gap-2">
              <select
                id="locationId"
                {...register('locationId')}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">{t('selectLocation')}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" size="icon" onClick={handleAutoDetect} disabled={detecting}>
                {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {weather && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-background rounded-full">
                <CloudSun className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-medium">{weather.temp}°C - {weather.condition}</div>
                <div className="text-xs text-muted-foreground">{weather.description}</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">{t('date')}</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
