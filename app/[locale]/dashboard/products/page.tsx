import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { calculateStatus } from "@/lib/utils";
import { isCurrencyCode, type CurrencyCode } from "@/lib/currency";
import { getProductDemand } from "@/lib/stock-demand";
import type { WeekSchedule } from "@/lib/schedule";
import { EmptyStatePage } from "@/components/dashboard/EmptyStatePage";
import { LimitReachedNudge } from "@/components/dashboard/LimitReachedNudge";

const STATIC_LOW_STOCK_THRESHOLD = 5;

export default async function ProductsPage({
  params,
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

  if (!user?.business) {
    const t = await getTranslations("Products");
    return <div className="p-8">{t("noProducts")}</div>;
  }

  const bSettings = (user.business.settings as Record<string, unknown>) ?? {};
  const currency: CurrencyCode = isCurrencyCode(bSettings.currency) ? bSettings.currency : 'EUR';

  // Fetch products and demand predictions in parallel
  const [products, demandMap] = await Promise.all([
    prisma.product.findMany({
      where: {
        location: {
          businessId: user.business.id,
        },
      },
      orderBy: { expiryDate: "asc" },
      include: { location: { select: { name: true } } },
    }),
    getProductDemand(
      user.business.id,
      user.business.openingHours as WeekSchedule | null
    ).catch(() => new Map()),
  ]);

  if (products.length === 0) {
    return (
      <div className="flex-1 space-y-4">
        <EmptyStatePage page="products" />
      </div>
    );
  }

  const hasPredictions = demandMap.size > 0;

  // Recalculate status dynamically + attach demand data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = products.map((p: any) => {
    const demand = demandMap.get(p.id);
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      quantity: p.quantity,
      unit: p.unit,
      expiryDate: p.expiryDate ? p.expiryDate.toISOString() : null,
      costPerUnit: p.costPerUnit,
      status: p.expiryDate ? calculateStatus(p.expiryDate) : 'OK' as const,
      imageUrl: p.imageUrl,
      locationName: p.location?.name ?? '',
      demand: demand
        ? {
            coverageDays: demand.coverageDays,
            deficit: demand.deficit,
            topRecipes: demand.topRecipes,
          }
        : null,
    };
  });

  // Compute inventory stats
  let totalValue = 0;
  let lowStockCount = 0;
  const categoryMap = new Map<string, { count: number; value: number }>();

  for (const p of enriched) {
    const itemValue = p.costPerUnit != null ? p.quantity * p.costPerUnit : 0;
    totalValue += itemValue;

    // Smart low stock: prediction-based if available, static fallback
    const isLow = p.demand
      ? p.demand.coverageDays < 1.5
      : (!hasPredictions && p.quantity <= STATIC_LOW_STOCK_THRESHOLD);
    if (isLow) lowStockCount++;

    const cat = p.category || '__none__';
    const existing = categoryMap.get(cat) || { count: 0, value: 0 };
    categoryMap.set(cat, {
      count: existing.count + 1,
      value: existing.value + itemValue,
    });
  }

  const categoryStats = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
  })).sort((a, b) => b.value - a.value);

  // Extract unique filter options
  const categories = [...new Set(enriched.map((p: any) => p.category).filter(Boolean))] as string[];
  const locations = [...new Set(enriched.map((p: any) => p.locationName))];

  return (
    <div className="flex-1 space-y-4">
      <ProductTable
        products={enriched}
        currency={currency}
        stats={{
          totalValue,
          totalProducts: enriched.length,
          lowStockCount,
          categoryStats,
          categories: categoryMap.size,
        }}
        filterOptions={{ categories, locations }}
        hasPredictions={hasPredictions}
      />
      <LimitReachedNudge
        resource="products"
        currentCount={enriched.length}
        maxFree={50}
      />
    </div>
  );
}
