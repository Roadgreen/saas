export async function trackEvent(event: string, data: any) {
    try {
        await fetch('http://82.64.161.81:3001/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: 'oknvonberbvpnewqr23452435',
                event,
                data
            })
        });
    } catch (error) {
        // Fire and forget, do not block application if tracking fails
        console.error('Tracking error:', error);
    }
}
