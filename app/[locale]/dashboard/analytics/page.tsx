import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProfitabilityData, getExpirationAnalytics } from "@/lib/analytics";
import { ProfitabilityChart } from "@/components/dashboard/ProfitabilityChart";
import { WasteBarChart } from "@/components/dashboard/WasteBarChart";
import { DailyBreakdownTable } from "@/components/dashboard/DailyBreakdownTable";
import { AnalyticsFilters } from "@/components/dashboard/AnalyticsFilters";
import { ExpirationAnalysisCard } from "@/components/dashboard/ExpirationAnalysisCard";
import { SumUpDailyWidget } from "@/components/dashboard/SumUpDailyWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, ShoppingCart, BarChart3, Lock, CalendarCheck, CalendarX, Trash2, TableIcon, PackageX } from "lucide-react";
import Link from "next/link";
import { formatCurrency, isCurrencyCode, type CurrencyCode } from "@/lib/currency";

const VALID_PERIODS = [7, 14, 30, 90];

export default async function AnalyticsPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { locale } = await params;
    const sp = await searchParams;
    const session = await auth();
    if (!session?.user?.email) {
        redirect(`/${locale}/login`);
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    const t = await getTranslations('Analytics');

    if (!user?.business) {
        return <div className="p-8">{t('profileIncomplete')}</div>;
    }

    const isPremium =
        user.business.subscriptionTier === 'PRO' ||
        user.business.subscriptionTier === 'ENTERPRISE';

    const bSettings = (user.business.settings as Record<string, unknown>) ?? {};
    const rawCurrency = bSettings.currency;
    const currency: CurrencyCode = isCurrencyCode(rawCurrency) ? rawCurrency : 'EUR';

    // Parse period from search params
    const rawDays = parseInt(String(sp.days ?? '30'), 10);
    const days = VALID_PERIODS.includes(rawDays) ? rawDays : 30;

    // Parse location filter
    const rawLocationId = typeof sp.location === 'string' ? sp.location : undefined;

    // Fetch business locations
    const locations = await prisma.location.findMany({
        where: { businessId: user.business.id },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    // Validate locationId against actual locations
    const locationId = locations.some(l => l.id === rawLocationId) ? rawLocationId : undefined;

    const [data, expirationData] = isPremium
        ? await Promise.all([
            getProfitabilityData(user.business.id, days, locationId),
            getExpirationAnalytics(user.business.id, days, locationId),
        ])
        : [[], null];

    const isSumUpConnected = !!user.business.sumupAccessToken;

    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
    const totalCost = data.reduce((s, d) => s + d.cost, 0);
    const totalMargin = data.reduce((s, d) => s + d.margin, 0);
    const totalWaste = data.reduce((s, d) => s + d.wastesCost, 0);
    const avgDailyMargin = data.length > 0 ? totalMargin / data.length : 0;
    const overallMarginPercent = totalRevenue > 0
        ? (totalMargin / totalRevenue) * 100
        : 0;

    // Best and worst days (only days with actual sales)
    const activeDays = data.filter(d => d.revenue > 0);
    const bestDay = activeDays.length > 0
        ? activeDays.reduce((best, d) => d.margin > best.margin ? d : best)
        : null;
    const worstDay = activeDays.length > 0
        ? activeDays.reduce((worst, d) => d.margin < worst.margin ? d : worst)
        : null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('subtitle')}
                    </p>
                </div>
                {isPremium && (
                    <AnalyticsFilters
                        currentDays={days}
                        currentLocationId={locationId}
                        locations={locations}
                    />
                )}
            </div>

            {!isPremium ? (
                <Card className="relative overflow-hidden dash-card">
                    <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center bg-white/80 p-8 text-center">
                        <Lock className="h-10 w-10 text-emerald-600 mb-3" />
                        <h3 className="font-bold text-xl text-emerald-900 mb-1">
                            {t('upgradeTitle')}
                        </h3>
                        <p className="text-sm text-emerald-700 mb-5 max-w-sm">
                            {t('upgradeDesc')}
                        </p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Link href={`/${locale}/pricing`}>{t('upgradeBtn')}</Link>
                        </Button>
                    </div>
                    <CardHeader className="opacity-40">
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            {t('chartTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="opacity-40 h-64 bg-gradient-to-br from-slate-100 to-white rounded-lg" />
                </Card>
            ) : (
                <>
                    {/* Summary cards row 1: revenue, cost, margin, avg margin */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="dash-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {t('totalRevenue')}
                                </CardTitle>
                                <div className="rounded-md bg-blue-100 p-2">
                                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(totalRevenue, currency)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t('periodLabel', { days })}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="dash-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {t('totalCost')}
                                </CardTitle>
                                <div className="rounded-md bg-red-100 p-2">
                                    <DollarSign className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(totalCost, currency)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t('periodLabel', { days })}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="dash-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {t('totalMargin')}
                                </CardTitle>
                                <div className="rounded-md bg-green-100 p-2">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(totalMargin, currency)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {overallMarginPercent.toFixed(1)}% {t('marginRate')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="dash-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {t('avgDailyMargin')}
                                </CardTitle>
                                <div className="rounded-md bg-purple-100 p-2">
                                    <BarChart3 className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(avgDailyMargin, currency)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t('perDay')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary cards row 2: best day, worst day, total waste */}
                    {activeDays.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-3">
                            {bestDay && (
                                <Card className="dash-card">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {t('bestDay')}
                                        </CardTitle>
                                        <div className="rounded-md bg-emerald-100 p-2">
                                            <CalendarCheck className="h-4 w-4 text-emerald-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatCurrency(bestDay.margin, currency)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(bestDay.date)} — {t('bestDayLabel')}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {worstDay && (
                                <Card className="dash-card">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {t('worstDay')}
                                        </CardTitle>
                                        <div className="rounded-md bg-amber-100 p-2">
                                            <CalendarX className="h-4 w-4 text-amber-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-amber-600">
                                            {formatCurrency(worstDay.margin, currency)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(worstDay.date)} — {t('worstDayLabel')}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="dash-card">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {t('detailWaste')}
                                    </CardTitle>
                                    <div className="rounded-md bg-orange-100 p-2">
                                        <Trash2 className="h-4 w-4 text-orange-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {formatCurrency(totalWaste, currency)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t('periodLabel', { days })}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* SumUp daily revenue vs internal */}
                    <SumUpDailyWidget
                        isSumUpConnected={isSumUpConnected}
                        internalData={data.map(d => ({ date: d.date, revenue: d.revenue }))}
                        currency={currency}
                        days={days}
                    />

                    {/* Profitability chart */}
                    <Card className="dash-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-emerald-600" />
                                {t('chartTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data.length === 0 || data.every(d => d.revenue === 0) ? (
                                <p className="text-sm text-muted-foreground italic py-12 text-center">
                                    {t('noData')}
                                </p>
                            ) : (
                                <ProfitabilityChart data={data} currency={currency} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Waste bar chart */}
                    {data.some(d => d.wastesCost > 0) && (
                        <Card className="dash-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trash2 className="h-5 w-5 text-orange-600" />
                                    {t('wasteChartTitle')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <WasteBarChart data={data} currency={currency} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Daily breakdown table */}
                    <Card className="dash-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TableIcon className="h-5 w-5 text-muted-foreground" />
                                {t('detailsTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic py-12 text-center">
                                    {t('noData')}
                                </p>
                            ) : (
                                <DailyBreakdownTable data={data} currency={currency} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Expiration & Waste Analysis */}
                    {expirationData && (
                        <Card className="dash-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PackageX className="h-5 w-5 text-red-600" />
                                    {t('expirationSectionTitle')}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t('expirationSectionSubtitle')}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ExpirationAnalysisCard
                                    data={expirationData}
                                    currency={currency}
                                    days={days}
                                />
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
