import { Capacitor } from '@capacitor/core';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @returns Distance in kilometers
 */
export function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Gets the current position using Capacitor Geolocation (native GPS) when available,
 * falls back to browser Geolocation API on web.
 */
export async function getCurrentPosition(): Promise<Coordinates> {
    if (Capacitor.isNativePlatform()) {
        const { Geolocation } = await import('@capacitor/geolocation');
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'denied') {
            throw new Error('GPS permission denied');
        }
        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        });
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
    }

    // Web fallback
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000,
                }
            );
        }
    });
}

/**
 * Watch position changes continuously (useful for food trucks on the move).
 * Returns a callback ID to stop watching.
 */
export async function watchPosition(
    onPosition: (coords: Coordinates) => void,
    onError?: (error: Error) => void
): Promise<string | number> {
    if (Capacitor.isNativePlatform()) {
        const { Geolocation } = await import('@capacitor/geolocation');
        const id = await Geolocation.watchPosition(
            { enableHighAccuracy: true },
            (position, err) => {
                if (err) {
                    onError?.(new Error(err.message));
                } else if (position) {
                    onPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            }
        );
        return id;
    }

    const id = navigator.geolocation.watchPosition(
        (position) => {
            onPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        },
        (error) => {
            onError?.(new Error(error.message));
        },
        { enableHighAccuracy: true }
    );
    return id;
}

/**
 * Stop watching position.
 */
export async function clearWatch(watchId: string | number): Promise<void> {
    if (Capacitor.isNativePlatform() && typeof watchId === 'string') {
        const { Geolocation } = await import('@capacitor/geolocation');
        await Geolocation.clearWatch({ id: watchId });
    } else if (typeof watchId === 'number') {
        navigator.geolocation.clearWatch(watchId);
    }
}
