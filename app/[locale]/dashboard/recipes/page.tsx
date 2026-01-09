import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { RecipeList } from "@/components/dashboard/RecipeList";
import { getRecipesWithCost } from "@/lib/recipes";

const prisma = new PrismaClient();

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

  if (!user?.business) {
    return <div>Please complete your business profile.</div>;
  }

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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Recipes</h2>
      </div>
      <RecipeList recipes={recipes} products={products} />
    </div>
  );
}
