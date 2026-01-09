'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const LocationsMap = dynamic(
  () => import('@/components/dashboard/LocationsMap'),
  { 
    ssr: false,
    loading: () => (
      <Card className="col-span-4 md:col-span-2 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5" />
            Carte des emplacements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            style={{ 
              height: '300px', 
              width: '100%',
              borderRadius: '0 0 0.5rem 0.5rem',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ color: '#888' }}>Chargement de la carte...</span>
          </div>
        </CardContent>
      </Card>
    )
  }
);

export default function LocationsMapWrapper() {
  return <LocationsMap />;
}
