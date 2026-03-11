import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SalesList } from "@/components/dashboard/SalesList";
import { SalesScannerWrapper } from "@/components/dashboard/SalesScannerWrapper";
import { QuickSalesGrid } from "@/components/dashboard/QuickSalesGrid";
import { SumUpSalesList } from "@/components/dashboard/SumUpSalesList";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ShoppingBag, CalendarDays, Trophy, ChefHat } from "lucide-react";
import { isCurrencyCode, type CurrencyCode } from "@/lib/currency";
import { EmptyStatePage } from "@/components/dashboard/EmptyStatePage";

export default async function SalesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  const t = await getTranslations('Sales');

  if (!user?.business) {
    return (
      <div className="flex-1 p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{t('profileIncomplete')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const bSettings = (user.business.settings as Record<string, unknown>) ?? {};
  const currency: CurrencyCode = isCurrencyCode(bSettings.currency) ? bSettings.currency : 'EUR';

  const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Fetch Orders, Recipes, and SumUp transactions in parallel
  const [orders, recipes, sumupTransactions] = await Promise.all([
    prisma.order.findMany({
      where: {
        businessId: user.business.id,
      },
      include: {
        items: {
          include: {
            recipe: true,
          },
        },
        location: true,
      },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    prisma.recipe.findMany({
      where: { businessId: user.business.id },
      orderBy: { name: 'asc' },
    }),
    user.business.sumupAccessToken
      ? prisma.sumUpTransaction.findMany({
          where: {
            businessId: user.business.id,
            status: { in: ['SUCCESSFUL', 'PAID', 'COMPLETED'] },
            timestamp: { gte: since90 },
          },
          include: {
            matchedRecipe: { select: { name: true } },
          },
          orderBy: { timestamp: 'desc' },
          take: 200,
        })
      : Promise.resolve([]),
  ]);

  if (orders.length === 0 && sumupTransactions.length === 0 && recipes.length === 0) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h2>
        </div>
        <EmptyStatePage page="sales" />
      </div>
    );
  }

  // Calculate stats from orders + SumUp transactions
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  let todaysUnits = 0;
  let weekUnits = 0;
  const recipeCounts: Record<string, number> = {};

  orders.forEach(order => {
    const orderDate = new Date(order.date);
    const isToday = orderDate.toDateString() === today.toDateString();
    const isThisWeek = orderDate >= weekAgo;

    order.items.forEach(item => {
      if (isToday) todaysUnits += item.quantity;
      if (isThisWeek) weekUnits += item.quantity;

      const recipeName = item.recipe.name;
      recipeCounts[recipeName] = (recipeCounts[recipeName] || 0) + item.quantity;
    });
  });

  // Also count SumUp transactions in stats
  sumupTransactions.forEach(tx => {
    const txDate = new Date(tx.timestamp);
    const isToday = txDate.toDateString() === today.toDateString();
    const isThisWeek = txDate >= weekAgo;

    // Sum quantities from products JSON, fallback to 1
    const products = Array.isArray(tx.products) ? tx.products as { quantity?: number }[] : [];
    const qty = products.length > 0
      ? products.reduce((s, p) => s + (p.quantity ?? 1), 0)
      : 1;

    if (isToday) todaysUnits += qty;
    if (isThisWeek) weekUnits += qty;

    if (tx.matchedRecipe) {
      const name = tx.matchedRecipe.name;
      recipeCounts[name] = (recipeCounts[name] || 0) + qty;
    }
  });

  const topRecipe = Object.entries(recipeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{t('title')}</h2>
      </div>

      {/* Quick Sales Grid */}
      <QuickSalesGrid recipes={recipes} />

      {/* AI Scanner Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesScannerWrapper />

        {/* Quick Stats */}
        <div className="grid gap-3 md:gap-4 grid-cols-2">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
                <ShoppingBag className="h-4 w-4 shrink-0" />
                {t('stats.today')}
              </div>
              <div className="text-2xl md:text-3xl font-bold mt-1.5 md:mt-2">{todaysUnits}</div>
              <div className="text-xs md:text-sm mt-1 text-muted-foreground">{t('stats.unitsSold')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                {t('stats.week')}
              </div>
              <div className="text-2xl md:text-3xl font-bold mt-1.5 md:mt-2">{weekUnits}</div>
              <div className="text-xs md:text-sm mt-1 text-muted-foreground">{t('stats.unitsSold')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
                <Trophy className="h-4 w-4 shrink-0" />
                {t('stats.topProduct')}
              </div>
              <div className="text-lg md:text-xl font-bold mt-1.5 md:mt-2 truncate">
                {topRecipe ? topRecipe[0] : '-'}
              </div>
              <div className="text-xs md:text-sm mt-1 text-muted-foreground">{t('stats.bestSeller')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
                <ChefHat className="h-4 w-4 shrink-0" />
                {t('stats.recipes')}
              </div>
              <div className="text-2xl md:text-3xl font-bold mt-1.5 md:mt-2">{recipes.length}</div>
              <div className="text-xs md:text-sm mt-1 text-muted-foreground">{t('stats.activeRecipes')}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sales History */}
      <SalesList orders={orders} recipes={recipes} currency={currency} />

      {/* SumUp Transactions */}
      <SumUpSalesList transactions={sumupTransactions} currency={currency} />
    </div>
  );
}
