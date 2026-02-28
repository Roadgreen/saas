"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { MapPin, Loader2, Trash2 } from "lucide-react";
import { getCurrentPosition } from "@/lib/geolocation";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DaySchedule } from '@/lib/schedule';

interface Location {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

interface OperationsFormProps {
  initialOpeningHours?: Record<string, DaySchedule> | null;
  initialLocations?: Location[];
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function OperationsForm({ initialOpeningHours, initialLocations = [] }: OperationsFormProps) {
  const t = useTranslations('Settings.Operations');
  const tGlobal = useTranslations('Settings');
  const router = useRouter();

  // Schedule state
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(() => {
    const defaults: Record<string, DaySchedule> = {};
    for (const day of DAYS) {
      defaults[day] = initialOpeningHours?.[day] ?? {
        open: '09:00',
        close: '18:00',
        closed: false,
        locationId: null,
      };
    }
    return defaults;
  });
  const [saving, setSaving] = useState(false);

  // Location management state
  const [isLocating, setIsLocating] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState("");
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [open, setOpen] = useState(false);

  const updateDay = (day: string, field: keyof DaySchedule, value: string | boolean | null) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingHours: schedule }),
      });
      if (res.ok) {
        toast.success(t('hours.saved'));
        router.refresh();
      }
    } catch {
      toast.error('Error saving schedule');
    } finally {
      setSaving(false);
    }
  };

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

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const coords = await getCurrentPosition();
      setNewLocation({ lat: coords.latitude, lon: coords.longitude });
    } catch (error) {
      console.error("Geolocation error:", error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!newLocation || !locationName) return;

    setIsSavingLocation(true);
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: locationName,
          latitude: newLocation.lat,
          longitude: newLocation.lon,
        }),
      });

      if (res.ok) {
        setOpen(false);
        setNewLocation(null);
        setLocationName("");
        fetchLocations();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save location", error);
    } finally {
      setIsSavingLocation(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm(t('locations.confirmDelete'))) return;

    try {
      const res = await fetch(`/api/locations?id=${id}`, { method: 'DELETE' });

      if (res.ok) {
        // Clear locationId references in schedule
        setSchedule(prev => {
          const updated = { ...prev };
          for (const day of DAYS) {
            if (updated[day]?.locationId === id) {
              updated[day] = { ...updated[day], locationId: null };
            }
          }
          return updated;
        });
        fetchLocations();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete location", error);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('hours.title')}</CardTitle>
          <CardDescription>{t('hours.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DAYS.map((day) => {
            const daySchedule = schedule[day];
            const isClosed = daySchedule?.closed ?? false;
            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-28 font-medium capitalize shrink-0">
                  {t(`days.${day}`)}
                </div>
                <div className={`flex flex-wrap items-center gap-3 flex-1 ${isClosed ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      className="w-28"
                      value={daySchedule?.open ?? '09:00'}
                      onChange={(e) => updateDay(day, 'open', e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      className="w-28"
                      value={daySchedule?.close ?? '18:00'}
                      onChange={(e) => updateDay(day, 'close', e.target.value)}
                    />
                  </div>
                  {locations.length > 0 && (
                    <Select
                      value={daySchedule?.locationId ?? '__none__'}
                      onValueChange={(v) => updateDay(day, 'locationId', v === '__none__' ? null : v)}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder={t('hours.noLocation')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t('hours.noLocation')}</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    id={`closed-${day}`}
                    checked={isClosed}
                    onCheckedChange={(checked) => updateDay(day, 'closed', checked)}
                  />
                  <Label htmlFor={`closed-${day}`}>{t('hours.closed')}</Label>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('locations.title')}</CardTitle>
          <CardDescription>{t('locations.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {locations.length === 0 ? (
            <div className="p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground">
              {t('locations.placeholder')}
            </div>
          ) : (
            <div className="grid gap-2">
              {locations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{loc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => handleDeleteLocation(loc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                {t('locations.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('locations.add')}</DialogTitle>
                <DialogDescription>
                  {t('locations.addDesc')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t('locations.nameLabel')}</Label>
                  <Input
                    placeholder={t('locations.namePlaceholder')}
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleLocate}
                    disabled={isLocating}
                    className="w-full"
                  >
                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    {newLocation ? t('locations.positionFound') : t('locations.iAmHere')}
                  </Button>
                </div>
                {newLocation && (
                  <div className="text-xs text-muted-foreground text-center">
                    GPS: {newLocation.lat.toFixed(4)}, {newLocation.lon.toFixed(4)}
                  </div>
                )}
                <Button
                  onClick={handleSaveLocation}
                  disabled={!newLocation || !locationName || isSavingLocation}
                >
                  {isSavingLocation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('locations.saveLocation')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tGlobal('save')}
        </Button>
      </div>
    </div>
  );
}
