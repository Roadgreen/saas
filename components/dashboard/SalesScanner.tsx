'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Camera,
    Upload,
    Loader2,
    CheckCircle,
    AlertCircle,
    X,
    ScanLine,
    Save,
    RefreshCw,
    FileText,
    Hash,
    MapPin,
    Lock,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLocationContext } from '@/components/providers/LocationProvider';

interface ScannedSale {
    scannedName: string;
    quantity: number;
    confidence: 'high' | 'medium' | 'low';
    matched: boolean;
    recipe: { id: string; name: string } | null;
    saved?: boolean;
    salesRecord?: any;
}

interface ScanResult {
    success: boolean;
    date: string;
    notes?: string;
    sales: ScannedSale[];
    summary: {
        total: number;
        matched: number;
        saved: number;
        totalQuantity: number;
    };
}

export function SalesScanner({ onSalesRecorded }: { onSalesRecorded?: () => void }) {
    const t = useTranslations('Sales');
    const tAI = useTranslations('AIScanner');
    const locale = useLocale();
    const { data: session } = useSession();
    const isPremium = session?.user?.subscriptionTier === 'PRO' || session?.user?.subscriptionTier === 'ENTERPRISE';
    const { currentLocation, weather } = useLocationContext();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setResult(null);
            setError(null);
        }
    };

    const clearSelection = () => {
        setPreview(null);
        setSelectedFile(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleScan = async (autoSave = false) => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('autoSave', autoSave.toString());
            if (currentLocation?.id) {
                formData.append('locationId', currentLocation.id);
            }
            if (weather) {
                formData.append('weatherSnapshot', JSON.stringify(weather));
            }

            const res = await fetch('/api/ai/scan-sales', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to scan image');
            }

            setResult(data);

            if (autoSave && onSalesRecorded) {
                onSalesRecorded();
            }
        } catch (err: any) {
            console.error('Scan error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAll = async () => {
        if (!result) return;

        setSaving(true);
        try {
            // Save each unmatched sale that has a recipe match
            const unsavedMatched = result.sales.filter((s) => s.matched && !s.saved);

            for (const sale of unsavedMatched) {
                if (sale.recipe) {
                    await fetch('/api/sales', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            recipeId: sale.recipe.id,
                            quantitySold: sale.quantity,
                            date: result.date,
                            locationId: currentLocation?.id,
                            weatherSnapshot: weather,
                        }),
                    });
                    sale.saved = true;
                }
            }

            // Update result
            setResult({
                ...result,
                sales: [...result.sales],
                summary: {
                    ...result.summary,
                    saved: result.sales.filter((s) => s.saved).length,
                },
            });

            if (onSalesRecorded) {
                onSalesRecorded();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save sales');
        } finally {
            setSaving(false);
        }
    };

    const getConfidenceBadge = (confidence: string) => {
        const styles = {
            high: 'bg-green-100 text-green-700 border-green-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-red-100 text-red-700 border-red-200',
        };
        return styles[confidence as keyof typeof styles] || styles.medium;
    };

    if (!isPremium) {
        return (
            <Card className="w-full relative overflow-hidden dash-card">
                <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-white/80 p-6 text-center">
                    <Lock className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-bold text-lg text-blue-900">{tAI('upgradeTitle')}</h3>
                    <p className="text-sm text-blue-700 mb-4 max-w-xs">{tAI('upgradeDesc')}</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href={`/${locale}/pricing`}>{tAI('upgradeBtn')}</Link>
                    </Button>
                </div>
                <CardHeader className="opacity-50">
                    <CardTitle className="flex items-center gap-2">
                        <ScanLine className="h-5 w-5 text-blue-600" />
                        {t('scannerTitle')}
                    </CardTitle>
                    <CardDescription>{t('scannerDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="opacity-50">
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="p-4 bg-blue-100 rounded-full">
                                <Camera className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="font-medium">{t('takePhotoSales')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full dash-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ScanLine className="h-5 w-5 text-blue-600" />
                    {t('scannerTitle')}
                </CardTitle>
                <CardDescription>
                    {t('scannerDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {currentLocation && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit">
                        <MapPin className="h-3 w-3" />
                        {currentLocation.name}
                        {weather && <span>• {weather.temp}°C</span>}
                    </div>
                )}

                {!preview ? (
                    <div className="flex flex-col gap-4">
                        <div
                            className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <div className="p-4 bg-blue-100 rounded-full">
                                    <Camera className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {t('takePhotoSales')}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('scanHint')}
                                    </p>
                                </div>
                                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> {t('hintPaper')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Hash className="h-3 w-3" /> {t('hintTally')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ScanLine className="h-3 w-3" /> {t('hintScreen')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                            <Image src={preview} alt="Preview" fill className="object-contain" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={clearSelection}
                                disabled={loading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {!result && (
                            <div className="flex gap-2">
                                <Button onClick={() => handleScan(false)} className="flex-1" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('scanning')}
                                        </>
                                    ) : (
                                        <>
                                            <ScanLine className="mr-2 h-4 w-4" />
                                            {t('scanOnly')}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => handleScan(true)}
                                    variant="default"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('scanning')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {t('scanAndSave')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
                                <div className="text-2xl font-bold text-blue-700">{result.summary.totalQuantity}</div>
                                <div className="text-xs text-blue-700/70">{t('totalSales')}</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                                <div className="text-2xl font-bold text-green-700">{result.summary.matched}</div>
                                <div className="text-xs text-green-700/70">{t('matched')}</div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200">
                                <div className="text-2xl font-bold text-purple-700">{result.summary.saved}</div>
                                <div className="text-xs text-purple-700/70">{t('saved')}</div>
                            </div>
                        </div>

                        {/* Notes from AI */}
                        {result.notes && (
                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-start gap-2 border border-gray-100">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {result.notes}
                            </div>
                        )}

                        {/* Sales list */}
                        <div className="border rounded-lg divide-y">
                            {result.sales.map((sale, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 flex items-center justify-between ${
                                        sale.saved ? 'bg-green-50/50' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                                                sale.matched
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {sale.quantity}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {sale.recipe?.name || sale.scannedName}
                                            </div>
                                            {!sale.matched && (
                                                <div className="text-xs text-yellow-600">
                                                    ⚠️ {t('noMatch')}
                                                </div>
                                            )}
                                            {sale.saved && (
                                                <div className="text-xs text-green-600 flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    {t('savedToSystem')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full border ${getConfidenceBadge(
                                            sale.confidence
                                        )}`}
                                    >
                                        {sale.confidence}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {result.summary.matched > result.summary.saved && (
                                <Button
                                    onClick={handleSaveAll}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {t('saveAll')}
                                        </>
                                    )}
                                </Button>
                            )}
                            <Button variant="outline" onClick={clearSelection} className="flex-1">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                {t('scanAnother')}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
