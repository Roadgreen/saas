import { NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: Request) {
    const { limited, retryAfter } = rateLimit(`weather:${getClientIp(request)}`, { window: 60_000, max: 30 });
    if (limited) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    try {
        const weather = await getWeather(latNum, lonNum);
        return NextResponse.json(weather);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
