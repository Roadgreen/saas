export interface WeatherData {
    temp: number;
    condition: string;
    description: string;
    icon: string;
    windSpeed: number;
    humidity?: number;
}

/**
 * Maps WMO Weather interpretation codes to our format
 * https://open-meteo.com/en/docs
 */
function mapWMOCode(code: number): { condition: string; description: string; icon: string } {
    // Clear sky
    if (code === 0) return { condition: 'Clear', description: 'Ciel dégagé', icon: '01d' };

    // Mainly clear, partly cloudy, and overcast
    if (code === 1) return { condition: 'Clouds', description: 'Peu nuageux', icon: '02d' };
    if (code === 2) return { condition: 'Clouds', description: 'Partiellement nuageux', icon: '03d' };
    if (code === 3) return { condition: 'Clouds', description: 'Couvert', icon: '04d' };

    // Fog
    if (code === 45 || code === 48) return { condition: 'Fog', description: 'Brouillard', icon: '50d' };

    // Drizzle
    if (code >= 51 && code <= 57) return { condition: 'Drizzle', description: 'Bruine', icon: '09d' };

    // Rain
    if (code >= 61 && code <= 67) return { condition: 'Rain', description: 'Pluie', icon: '10d' };
    if (code >= 80 && code <= 82) return { condition: 'Rain', description: 'Averses de pluie', icon: '09d' };

    // Snow
    if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'Neige', icon: '13d' };
    if (code >= 85 && code <= 86) return { condition: 'Snow', description: 'Averses de neige', icon: '13d' };

    // Thunderstorm
    if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', description: 'Orage', icon: '11d' };

    return { condition: 'Unknown', description: 'Inconnu', icon: '50d' };
}

/**
 * Fetches current weather for a given location using Open-Meteo API.
 * No API key required.
 */
export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );

        if (!res.ok) {
            throw new Error(`Weather API error: ${res.statusText}`);
        }

        const data = await res.json();
        const current = data.current;
        const weatherInfo = mapWMOCode(current.weather_code);

        return {
            temp: Math.round(current.temperature_2m),
            windSpeed: current.wind_speed_10m,
            humidity: current.relative_humidity_2m,
            ...weatherInfo
        };
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        // Fallback to mock data if API fails
        return {
            temp: 20,
            condition: 'Clear',
            description: 'Non disponible',
            icon: '01d',
            windSpeed: 0
        };
    }
}
