import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { SalesList } from "@/components/dashboard/SalesList";
import { SalesScannerWrapper } from "@/components/dashboard/SalesScannerWrapper";
import { QuickSalesGrid } from "@/components/dashboard/QuickSalesGrid";

const prisma = new PrismaClient();

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

  if (!user?.business) {
    return <div>Please complete your business profile.</div>;
  }

  const [sales, recipes] = await Promise.all([
    prisma.dailySales.findMany({
      where: {
        recipe: {
          businessId: user.business.id,
        },
      },
      include: {
        recipe: true,
        location: true,
      },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    prisma.recipe.findMany({
      where: { businessId: user.business.id },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
      </div>
      
      {/* Quick Sales Grid */}
      <QuickSalesGrid recipes={recipes} />

      {/* AI Scanner Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesScannerWrapper />
        
        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
            <div className="text-sm font-medium opacity-80">Today&apos;s Sales</div>
            <div className="text-3xl font-bold mt-2">
              {sales.filter(s => {
                const today = new Date();
                const saleDate = new Date(s.date);
                return saleDate.toDateString() === today.toDateString();
              }).reduce((sum, s) => sum + s.quantity, 0)}
            </div>
            <div className="text-sm mt-1 opacity-70">units sold</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
            <div className="text-sm font-medium opacity-80">This Week</div>
            <div className="text-3xl font-bold mt-2">
              {sales.filter(s => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(s.date) >= weekAgo;
              }).reduce((sum, s) => sum + s.quantity, 0)}
            </div>
            <div className="text-sm mt-1 opacity-70">units sold</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
            <div className="text-sm font-medium opacity-80">Top Product</div>
            <div className="text-xl font-bold mt-2 truncate">
              {(() => {
                const recipeCounts = sales.reduce((acc, s) => {
                  acc[s.recipe.name] = (acc[s.recipe.name] || 0) + s.quantity;
                  return acc;
                }, {} as Record<string, number>);
                const topRecipe = Object.entries(recipeCounts).sort((a, b) => b[1] - a[1])[0];
                return topRecipe ? topRecipe[0] : '-';
              })()}
            </div>
            <div className="text-sm mt-1 opacity-70">best seller</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white">
            <div className="text-sm font-medium opacity-80">Recipes</div>
            <div className="text-3xl font-bold mt-2">{recipes.length}</div>
            <div className="text-sm mt-1 opacity-70">active recipes</div>
          </div>
        </div>
      </div>

      {/* Sales History */}
      <SalesList sales={sales} recipes={recipes} />
    </div>
  );
}
