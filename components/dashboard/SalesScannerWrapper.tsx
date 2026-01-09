'use client';

import { useRouter } from 'next/navigation';
import { SalesScanner } from './SalesScanner';

export function SalesScannerWrapper() {
    const router = useRouter();

    const handleSalesRecorded = () => {
        // Refresh the page to show new sales
        router.refresh();
    };

    return <SalesScanner onSalesRecorded={handleSalesRecorded} />;
}
