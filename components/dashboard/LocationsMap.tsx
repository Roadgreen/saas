'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export default function LocationsMap() {
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
        // Import dynamique de Leaflet
        const L = await import('leaflet');
        
        // Configurer l'icône par défaut
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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
        });

        mapInstanceRef.current = map;

        // Ajouter le layer OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Ajouter les marqueurs et zones pour chaque location
        locations.forEach((loc) => {
          if (loc.latitude && loc.longitude) {
            // Cercle de 2 km autour du lieu
            L.circle([loc.latitude, loc.longitude], {
              radius: 2000, // 2 km en mètres
              color: '#6366f1', // Bordure indigo
              fillColor: '#6366f1',
              fillOpacity: 0.15,
              weight: 2,
            }).addTo(map);

            // Marqueur
            L.marker([loc.latitude, loc.longitude])
              .addTo(map)
              .bindPopup(`<strong>${loc.name}</strong>${loc.address ? `<br/><small>${loc.address}</small>` : ''}<br/><small style="color: #6366f1;">Zone de 2 km</small>`);
          }
        });

        // Si plusieurs locations, ajuster la vue
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

    // Petit délai pour s'assurer que le DOM est prêt
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
    <Card className="col-span-4 md:col-span-2 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5" />
          Carte des emplacements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapContainerRef}
          id="locations-map"
          style={{ 
            height: '300px', 
            width: '100%',
            borderRadius: '0 0 0.5rem 0.5rem',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0'
          }}
        />
        {locations.length === 0 && mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-b-lg">
            <p className="text-muted-foreground text-sm">Aucun emplacement enregistré</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
