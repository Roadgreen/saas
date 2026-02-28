/**
 * Simple in-memory sliding-window rate limiter.
 * Works on both Node.js and Edge runtimes.
 * For multi-instance deployments, replace with Redis/Upstash.
 */

const store = new Map<string, { count: number; ts: number }>();

// Cleanup stale entries every 2 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.ts > 120_000) store.delete(key);
    }
  }, 120_000);
}

interface RateLimitResult {
  limited: boolean;
  retryAfter?: number;
}

export function rateLimit(
  key: string,
  { window = 60_000, max = 5 }: { window?: number; max?: number } = {}
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.ts > window) {
    store.set(key, { count: 1, ts: now });
    return { limited: false };
  }

  entry.count++;
  if (entry.count > max) {
    return {
      limited: true,
      retryAfter: Math.ceil((entry.ts + window - now) / 1000),
    };
  }

  return { limited: false };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
