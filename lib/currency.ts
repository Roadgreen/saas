export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
};

export function isCurrencyCode(value: unknown): value is CurrencyCode {
    return typeof value === 'string' && value in CURRENCY_SYMBOLS;
}

export function formatCurrency(amount: number, currency: CurrencyCode = 'EUR'): string {
    const symbol = CURRENCY_SYMBOLS[currency];
    return currency === 'USD' || currency === 'GBP'
        ? `${symbol}${amount.toFixed(2)}`
        : `${amount.toFixed(2)} ${symbol}`;
}

export function formatCurrencyShort(amount: number, currency: CurrencyCode = 'EUR'): string {
    const symbol = CURRENCY_SYMBOLS[currency];
    return currency === 'USD' || currency === 'GBP'
        ? `${symbol}${amount.toFixed(0)}`
        : `${amount.toFixed(0)} ${symbol}`;
}
