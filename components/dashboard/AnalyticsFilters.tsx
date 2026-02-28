'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';

const PERIODS = [7, 14, 30, 90] as const;

interface Location {
    id: string;
    name: string;
}

interface AnalyticsFiltersProps {
    currentDays: number;
    currentLocationId?: string;
    locations: Location[];
}

export function AnalyticsFilters({ currentDays, currentLocationId, locations }: AnalyticsFiltersProps) {
    const t = useTranslations('Analytics');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateParams = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    const handlePeriod = (days: number) => {
        updateParams('days', days === 30 ? null : String(days));
    };

    const handleLocation = (locationId: string) => {
        updateParams('location', locationId || null);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Period filter */}
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    {PERIODS.map((days) => (
                        <button
                            key={days}
                            onClick={() => handlePeriod(days)}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                                currentDays === days
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {t(`period${days}` as 'period7')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Location filter */}
            {locations.length > 0 && (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <select
                        value={currentLocationId ?? ''}
                        onChange={(e) => handleLocation(e.target.value)}
                        className="h-8 rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    >
                        <option value="">{t('allLocations')}</option>
                        {locations.map((loc) => (
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
