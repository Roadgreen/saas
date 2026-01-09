"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { MapPin, Loader2, Trash2 } from "lucide-react";
import { getCurrentPosition } from "@/lib/geolocation";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Location {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

export function OperationsForm() {
  const t = useTranslations('Settings.Operations');
  const tGlobal = useTranslations('Settings');
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const router = useRouter();
  
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newLocation, setNewLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationName, setLocationName] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);

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

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const coords = await getCurrentPosition();
      setNewLocation({ lat: coords.latitude, lon: coords.longitude });
    } catch (error) {
      console.error("Geolocation error:", error);
      // TODO: Show toast error
    } finally {
      setIsLocating(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!newLocation || !locationName) return;

    setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm(t('locations.confirmDelete'))) return;

    try {
      const res = await fetch(`/api/locations?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
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
        <CardContent className="space-y-6">
          {days.map((day) => (
            <div key={day} className="flex items-center justify-between">
              <div className="w-32 font-medium capitalize">{t(`days.${day}`)}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input type="time" className="w-32" defaultValue="09:00" />
                  <span>-</span>
                  <Input type="time" className="w-32" defaultValue="18:00" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id={`closed-${day}`} />
                  <Label htmlFor={`closed-${day}`}>{t('hours.closed')}</Label>
                </div>
              </div>
            </div>
          ))}
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
                  Enregistrez votre position actuelle comme lieu de vente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nom du lieu</Label>
                  <Input 
                    placeholder="Ex: Marché du Samedi" 
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
                    {newLocation ? "Position trouvée !" : "📍 Je suis ici"}
                  </Button>
                </div>
                {newLocation && (
                  <div className="text-xs text-muted-foreground text-center">
                    GPS: {newLocation.lat.toFixed(4)}, {newLocation.lon.toFixed(4)}
                  </div>
                )}
                <Button 
                  onClick={handleSaveLocation} 
                  disabled={!newLocation || !locationName || isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer ce lieu
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{tGlobal('save')}</Button>
      </div>
    </div>
  );
}
