export const PRODUCT_UNITS = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
    { label: 'Liters (l)', value: 'l' },
    { label: 'Milliliters (ml)', value: 'ml' },
    { label: 'Units (pcs)', value: 'units' },
    { label: 'Packs', value: 'packs' },
    { label: 'Crates', value: 'crates' },
] as const;

export function convertToBaseUnit(quantity: number, unit: string): { quantity: number; unit: string } {
    const normalizedUnit = unit.toLowerCase();

    switch (normalizedUnit) {
        case 'kg':
        case 'kilogram':
        case 'kilograms':
            return { quantity: quantity * 1000, unit: 'g' };
        case 'g':
        case 'gram':
        case 'grams':
            return { quantity: quantity, unit: 'g' };
        case 'l':
        case 'liter':
        case 'liters':
            return { quantity: quantity * 1000, unit: 'ml' };
        case 'ml':
        case 'milliliter':
        case 'milliliters':
            return { quantity: quantity, unit: 'ml' };
        case 'pcs':
        case 'piece':
        case 'pieces':
        case 'unit':
        case 'units':
            return { quantity: quantity, unit: 'units' };
        default:
            // If unknown, return as is (or throw error if strict)
            return { quantity, unit: normalizedUnit };
    }
}

export function convertFromBaseUnit(quantity: number, targetUnit: string): number {
    const normalizedUnit = targetUnit.toLowerCase();

    switch (normalizedUnit) {
        case 'kg':
            return quantity / 1000;
        case 'l':
            return quantity / 1000;
        default:
            return quantity;
    }
}
