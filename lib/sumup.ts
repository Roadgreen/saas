/**
 * SumUp API integration
 * OAuth 2.0 Authorization Code Flow + Transactions History
 * Docs: https://developer.sumup.com/docs/api/
 */

const SUMUP_API_BASE = 'https://api.sumup.com';
const SUMUP_AUTH_URL = 'https://api.sumup.com/authorize';
const SUMUP_TOKEN_URL = 'https://api.sumup.com/token';

// ─── OAuth Helpers ────────────────────────────────────────────────────────────

export function getSumUpAuthURL(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SUMUP_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/sumup/callback`,
    scope: 'transactions.history user.profile_readonly',
    state,
  });
  return `${SUMUP_AUTH_URL}?${params.toString()}`;
}

export interface SumUpTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export async function exchangeCodeForTokens(code: string): Promise<SumUpTokenResponse> {
  const res = await fetch(SUMUP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SUMUP_CLIENT_ID!,
      client_secret: process.env.SUMUP_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/sumup/callback`,
      code,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp token exchange failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function refreshSumUpToken(refreshToken: string): Promise<SumUpTokenResponse> {
  const res = await fetch(SUMUP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SUMUP_CLIENT_ID!,
      client_secret: process.env.SUMUP_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp token refresh failed: ${res.status} ${text}`);
  }
  return res.json();
}

// ─── Merchant Profile ─────────────────────────────────────────────────────────

export interface SumUpMerchant {
  merchant_code: string;
  business_name: string;
  country: string;
  currency: string;
}

export interface SumUpMembership {
  merchant_code: string;
  business_name: string;
  country: string;
  currency: string;
  roles: string[];
}

export async function getSumUpMerchant(accessToken: string): Promise<SumUpMerchant> {
  const res = await fetch(`${SUMUP_API_BASE}/v0.1/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`SumUp merchant fetch failed: ${res.status}`);
  return res.json();
}

/**
 * List all merchants the authenticated user has access to.
 * Returns the memberships array from GET /v0.1/memberships.
 */
export async function getSumUpMemberships(accessToken: string): Promise<SumUpMembership[]> {
  const res = await fetch(`${SUMUP_API_BASE}/v0.1/memberships`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    // Fall back gracefully — memberships endpoint may not be available for all accounts
    console.warn(`[SumUp] memberships fetch failed: ${res.status}`);
    return [];
  }
  const data = await res.json();
  // SumUp returns { items: [...] } or directly an array
  return Array.isArray(data) ? data : (data.items ?? data.memberships ?? []);
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface SumUpProduct {
  name: string;
  quantity: number;
  price: number;
  total_price: number;
  vat_rate?: string;
}

export interface SumUpTransaction {
  id: string;
  transaction_code: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'SUCCESSFUL' | 'CANCELLED' | 'FAILED' | 'PENDING' | string;
  payment_type: string;
  product_summary?: string;
  products?: SumUpProduct[];
  tip_amount?: number;
  vat_amount?: number;
}

export interface SumUpTransactionsResponse {
  items: SumUpTransaction[];
}

export async function getSumUpTransactions(
  accessToken: string,
  oldestTime: string,
  newestTime: string,
  limit = 100
): Promise<SumUpTransaction[]> {
  const params = new URLSearchParams({
    oldest_time: oldestTime,
    newest_time: newestTime,
    limit: String(limit),
    order: 'desc',
  });

  const res = await fetch(
    `${SUMUP_API_BASE}/v0.1/me/transactions/history?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp transactions fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  console.log('[SumUp] raw response keys:', Object.keys(data));

  // SumUp returns { items: [...] } or directly an array depending on version
  const items: SumUpTransaction[] = Array.isArray(data) ? data : (data.items ?? []);
  console.log(`[SumUp] total items before filter: ${items.length}, statuses:`, [...new Set(items.map((t) => t.status))]);

  // Accept SUCCESSFUL (live) and PAID/COMPLETED (sandbox/other variants)
  const VALID_STATUSES = new Set(['SUCCESSFUL', 'PAID', 'COMPLETED']);
  return items.filter((t) => VALID_STATUSES.has(t.status));
}

// ─── Token Refresh Utility ────────────────────────────────────────────────────

/**
 * Ensure the access token is fresh, refreshing if needed.
 * Returns { accessToken, updatedTokens } where updatedTokens is set if refreshed.
 */
export async function ensureFreshToken(business: {
  sumupAccessToken: string;
  sumupRefreshToken: string;
  sumupTokenExpiresAt: Date | null;
}): Promise<{
  accessToken: string;
  updatedTokens?: { access_token: string; refresh_token: string; expiresAt: Date };
}> {
  const now = new Date();
  const expiresAt = business.sumupTokenExpiresAt;

  // Refresh if expired or expiring within 5 minutes
  const needsRefresh =
    !expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

  if (!needsRefresh) {
    return { accessToken: business.sumupAccessToken };
  }

  const tokens = await refreshSumUpToken(business.sumupRefreshToken);
  const newExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);

  return {
    accessToken: tokens.access_token,
    updatedTokens: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiresAt: newExpiresAt,
    },
  };
}

// ─── Recipe Matching ──────────────────────────────────────────────────────────

/**
 * Try to match a SumUp product name to a recipe name using simple fuzzy matching.
 * Returns the recipe ID if a good match is found, null otherwise.
 */
export function matchProductToRecipe(
  productName: string,
  recipes: { id: string; name: string }[]
): string | null {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

  const needle = normalize(productName);
  if (!needle) return null;

  // Exact match first
  const exact = recipes.find((r) => normalize(r.name) === needle);
  if (exact) return exact.id;

  // Substring match (recipe name contains product name or vice versa)
  const partial = recipes.find((r) => {
    const hay = normalize(r.name);
    return hay.includes(needle) || needle.includes(hay);
  });
  if (partial) return partial.id;

  // Word-level overlap: match if >50% of words overlap
  const needleWords = needle.split(/\s+/).filter(Boolean);
  let bestScore = 0;
  let bestMatch: (typeof recipes)[0] | null = null;

  for (const recipe of recipes) {
    const hayWords = normalize(recipe.name).split(/\s+/).filter(Boolean);
    const common = needleWords.filter((w) => hayWords.includes(w)).length;
    const score = common / Math.max(needleWords.length, hayWords.length);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = recipe;
    }
  }

  return bestScore >= 0.5 ? bestMatch!.id : null;
}

// ─── Daily Aggregation ────────────────────────────────────────────────────────

export interface SumUpDailyRevenue {
  date: string; // YYYY-MM-DD
  revenue: number;
  transactionCount: number;
  currency: string;
}

/**
 * Aggregate SumUp transactions into daily totals.
 */
export function aggregateByDay(transactions: SumUpTransaction[]): SumUpDailyRevenue[] {
  const map = new Map<string, { revenue: number; count: number; currency: string }>();

  for (const t of transactions) {
    const date = t.timestamp.slice(0, 10); // YYYY-MM-DD
    const existing = map.get(date);
    if (existing) {
      existing.revenue += t.amount;
      existing.count += 1;
    } else {
      map.set(date, { revenue: t.amount, count: 1, currency: t.currency });
    }
  }

  return Array.from(map.entries())
    .map(([date, v]) => ({
      date,
      revenue: Math.round(v.revenue * 100) / 100,
      transactionCount: v.count,
      currency: v.currency,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
