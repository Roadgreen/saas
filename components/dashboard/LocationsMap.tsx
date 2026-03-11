'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Settings2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContextualInfoCard } from './ContextualInfoCard';

// Import CSS au sommet pour garantir le chargement
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export default function LocationsMap() {
  const t = useTranslations('Dashboard');
  const tMap = useTranslations('LocationsMap');
  const tHelp = useTranslations('ContextualHelp');
  const locale = useLocale();
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Charger les locations
  useEffect(() => {
    fetchLocations();
  }, []);

  // Initialiser la carte une fois les locations chargées
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Déjà initialisée

    const initializeMap = async () => {
      try {
        // Import dynamique de Leaflet pour éviter les erreurs SSR
        const L = await import('leaflet');
        
        // Configurer l'icône personnalisée (camion)
        const truckIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10a1 1 0 0 0 1 1Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
              </svg>
              <div class="absolute -bottom-1 w-2 h-2 bg-blue-600 rotate-45 border-r-2 border-b-2 border-white"></div>
            </div>
          `,
          className: '', // On enlève les styles par défaut de Leaflet
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        // Centre par défaut (Paris) ou premier emplacement
        const defaultCenter: [number, number] = [48.8566, 2.3522];
        const center: [number, number] = locations.length > 0 && locations[0].latitude && locations[0].longitude
          ? [locations[0].latitude, locations[0].longitude]
          : defaultCenter;

        // Créer la carte
        const map = L.map(mapContainerRef.current!, {
          center: center,
          zoom: 12,
          scrollWheelZoom: false,
          zoomControl: false,
        });

        mapInstanceRef.current = map;

        // Ajouter le layer CartoDB Voyager pour un look plus pro/moderne
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        // Ajouter les marqueurs et zones pour chaque location
        locations.forEach((loc) => {
          if (loc.latitude && loc.longitude) {
            L.circle([loc.latitude, loc.longitude], {
              radius: 1000,
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 1,
            }).addTo(map);

            L.marker([loc.latitude, loc.longitude], { icon: truckIcon })
              .addTo(map)
              .bindPopup(`
                <div class="p-1">
                  <strong class="text-slate-900">${loc.name}</strong>
                  ${loc.address ? `<div class="text-xs text-slate-500 mt-0.5">${loc.address}</div>` : ''}
                </div>
              `);
          }
        });

        if (locations.length > 1) {
          const validLocations = locations.filter(l => l.latitude && l.longitude);
          if (validLocations.length > 1) {
            const bounds = L.latLngBounds(
              validLocations.map(l => [l.latitude!, l.longitude!] as [number, number])
            );
            map.fitBounds(bounds, { padding: [30, 30] });
          }
        }

        setMapReady(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
      }
    };

    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      if (res.ok) {
        const data = await res.json();
        setLocations(data.filter((l: Location) => l.latitude && l.longitude));
      }
    } catch (error) {
      console.error("Failed to fetch locations", error);
    }
  };

  return (
    <Card className="col-span-4 md:col-span-2 lg:col-span-2 overflow-hidden dash-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MapPin className="h-5 w-5 text-blue-500" />
          {tMap('title')}
        </CardTitle>
        <Link href={`/${locale}/dashboard/settings?tab=operations`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 opacity-70 hover:opacity-100">
            <Settings2 className="h-3.5 w-3.5" />
            {t('manageLocations')}
          </Button>
        </Link>
      </CardHeader>
      <div className="px-4 pb-2">
        <ContextualInfoCard
          message={tHelp('locationsInfo')}
          learnMore={tHelp('locationsLearnMore')}
          storageKey="locations-info"
          compact
          icon="lightbulb"
        />
      </div>
      <CardContent className="p-0 relative">
        <div 
          ref={mapContainerRef}
          id="locations-map"
          className="h-[300px] w-full bg-gray-100"
          style={{ minHeight: '300px' }}
        />
        {locations.length === 0 && mapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-2 z-[20]">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm font-medium">{tMap('noLocations')}</p>
            <Link href={`/${locale}/dashboard/settings?tab=operations`}>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                {tMap('addFirst')}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
