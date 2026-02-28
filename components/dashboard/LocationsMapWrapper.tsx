'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const LocationsMap = dynamic(
  () => import('@/components/dashboard/LocationsMap'),
  {
    ssr: false,
    loading: () => (
      <Card className="dash-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-b-lg" />
        </CardContent>
      </Card>
    )
  }
);

export default function LocationsMapWrapper() {
  return <LocationsMap />;
}
