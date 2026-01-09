import { NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
    }

    try {
        const weather = await getWeather(parseFloat(lat), parseFloat(lon));
        return NextResponse.json(weather);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
