import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { RecipeList } from "@/components/dashboard/RecipeList";
import { getRecipesWithCost } from "@/lib/recipes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { isCurrencyCode, type CurrencyCode } from "@/lib/currency";
import { EmptyStatePage } from "@/components/dashboard/EmptyStatePage";
import { LimitReachedNudge } from "@/components/dashboard/LimitReachedNudge";

export default async function RecipesPage({
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

  const t = await getTranslations('Recipes');

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

  const [recipes, products] = await Promise.all([
    getRecipesWithCost(user.business.id),
    prisma.product.findMany({
      where: {
        location: {
          businessId: user.business.id,
        },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (recipes.length === 0) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h2>
        </div>
        <EmptyStatePage page="recipes" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>
      <RecipeList recipes={recipes} products={products} currency={currency} />
      <LimitReachedNudge
        resource="recipes"
        currentCount={recipes.length}
        maxFree={10}
      />
    </div>
  );
}
