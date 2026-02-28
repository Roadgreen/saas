import { prisma } from '@/lib/prisma';
import { getSalesForecast } from '@/lib/predictions';
import { convertToBaseUnit, convertFromBaseUnit } from '@/lib/units';
import { getNextOpenDay, type WeekSchedule } from '@/lib/schedule';

export interface RecipeShortage {
  productName: string;
  needed: number;
  available: number;
  deficit: number;
  unit: string;
}

export interface IngredientReadiness {
  productName: string;
  needed: number;
  available: number;
  unit: string;
  status: 'OK' | 'TIGHT' | 'SHORT';  // OK = >50% surplus, TIGHT = 0-50% surplus, SHORT = deficit
  deficit: number;  // 0 if covered
}

export interface RecipeReadiness {
  recipeId: string;
  recipeName: string;
  predictedQuantity: number;
  ingredients: IngredientReadiness[];
  status: 'OK' | 'TIGHT' | 'SHORT';  // worst ingredient status
}

export interface ProductDemand {
  requiredBase: number;
  baseUnit: string;
  coverageDays: number;
  deficit: number;
  topRecipes: string[];
}

export async function getProductDemand(
  businessId: string,
  openingHours?: WeekSchedule | null
): Promise<Map<string, ProductDemand>> {
  const { date: nextOpen, locationId } = getNextOpenDay(openingHours ?? null);

  // 1. Get sales predictions for next open day (with location if configured)
  const predictions = await getSalesForecast(businessId, nextOpen, {
    locationId: locationId ?? undefined,
    openingHours: openingHours ?? undefined,
  });

  if (predictions.length === 0) {
    return new Map();
  }

  // 2. Load all recipes with ingredients and products
  const recipeIds = predictions.map((p) => p.recipeId);
  const recipes = await prisma.recipe.findMany({
    where: { id: { in: recipeIds }, businessId },
    include: {
      ingredients: {
        include: { product: true },
      },
    },
  });

  const recipeMap = new Map(recipes.map((r) => [r.id, r]));

  // 3. Accumulate demand per product
  // Track per-recipe contribution for topRecipes
  const demandAccum: Record<
    string,
    {
      requiredBase: number;
      baseUnit: string;
      productUnit: string;
      productQuantity: number;
      recipeContributions: Record<string, number>; // recipeName -> base qty
    }
  > = {};

  for (const prediction of predictions) {
    const recipe = recipeMap.get(prediction.recipeId);
    if (!recipe) continue;

    for (const ingredient of recipe.ingredients) {
      const product = ingredient.product;

      const totalRequired = ingredient.quantity * prediction.predictedQuantity;
      const requiredBase = convertToBaseUnit(totalRequired, ingredient.unit);
      const productBase = convertToBaseUnit(product.quantity, product.unit);

      // Skip incompatible units (e.g. grams vs milliliters)
      if (requiredBase.unit !== productBase.unit) continue;

      if (!demandAccum[product.id]) {
        demandAccum[product.id] = {
          requiredBase: 0,
          baseUnit: requiredBase.unit,
          productUnit: product.unit,
          productQuantity: product.quantity,
          recipeContributions: {},
        };
      }

      demandAccum[product.id].requiredBase += requiredBase.quantity;

      const recipeName = recipe.name;
      demandAccum[product.id].recipeContributions[recipeName] =
        (demandAccum[product.id].recipeContributions[recipeName] || 0) +
        requiredBase.quantity;
    }
  }

  // 4. Build result map
  const result = new Map<string, ProductDemand>();

  for (const [productId, entry] of Object.entries(demandAccum)) {
    const stockBase = convertToBaseUnit(entry.productQuantity, entry.productUnit);

    if (stockBase.unit !== entry.baseUnit) continue;

    const coverageDays =
      entry.requiredBase > 0
        ? stockBase.quantity / entry.requiredBase
        : Infinity;

    const deficitBase = Math.max(0, entry.requiredBase - stockBase.quantity);
    const deficit = convertFromBaseUnit(deficitBase, entry.productUnit);

    // Top 3 recipes by consumption
    const topRecipes = Object.entries(entry.recipeContributions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    result.set(productId, {
      requiredBase: entry.requiredBase,
      baseUnit: entry.baseUnit,
      coverageDays: Math.round(coverageDays * 10) / 10,
      deficit: Math.round(deficit * 100) / 100,
      topRecipes,
    });
  }

  return result;
}

/**
 * For each predicted recipe, compute which ingredients are short.
 * Returns a map: recipeId → list of shortages.
 */
export async function getRecipeShortages(
  businessId: string,
  predictions: { recipeId: string; predictedQuantity: number }[],
): Promise<Map<string, RecipeShortage[]>> {
  if (predictions.length === 0) return new Map();

  const recipeIds = predictions.map((p) => p.recipeId);
  const recipes = await prisma.recipe.findMany({
    where: { id: { in: recipeIds }, businessId },
    include: {
      ingredients: {
        include: { product: true },
      },
    },
  });

  const recipeMap = new Map(recipes.map((r) => [r.id, r]));
  const result = new Map<string, RecipeShortage[]>();

  for (const prediction of predictions) {
    const recipe = recipeMap.get(prediction.recipeId);
    if (!recipe) continue;

    const shortages: RecipeShortage[] = [];

    for (const ingredient of recipe.ingredients) {
      const product = ingredient.product;

      const totalRequired = ingredient.quantity * prediction.predictedQuantity;
      const requiredBase = convertToBaseUnit(totalRequired, ingredient.unit);
      const stockBase = convertToBaseUnit(product.quantity, product.unit);

      // Skip incompatible units
      if (requiredBase.unit !== stockBase.unit) continue;

      if (requiredBase.quantity > stockBase.quantity) {
        const deficitBase = requiredBase.quantity - stockBase.quantity;
        const deficit = convertFromBaseUnit(deficitBase, product.unit);
        const needed = convertFromBaseUnit(requiredBase.quantity, product.unit);
        const available = convertFromBaseUnit(stockBase.quantity, product.unit);

        shortages.push({
          productName: product.name,
          needed: Math.round(needed * 100) / 100,
          available: Math.round(available * 100) / 100,
          deficit: Math.round(deficit * 100) / 100,
          unit: product.unit,
        });
      }
    }

    if (shortages.length > 0) {
      result.set(prediction.recipeId, shortages);
    }
  }

  return result;
}

/**
 * Full readiness analysis: for each predicted recipe, returns ALL ingredients
 * with their coverage status (OK / TIGHT / SHORT).
 */
export async function getRecipeReadiness(
  businessId: string,
  predictions: { recipeId: string; recipeName: string; predictedQuantity: number }[],
): Promise<RecipeReadiness[]> {
  if (predictions.length === 0) return [];

  const recipeIds = predictions.map((p) => p.recipeId);
  const recipes = await prisma.recipe.findMany({
    where: { id: { in: recipeIds }, businessId },
    include: {
      ingredients: {
        include: { product: true },
      },
    },
  });

  const recipeMap = new Map(recipes.map((r) => [r.id, r]));
  const result: RecipeReadiness[] = [];

  for (const prediction of predictions) {
    const recipe = recipeMap.get(prediction.recipeId);
    if (!recipe || recipe.ingredients.length === 0) continue;

    const ingredients: IngredientReadiness[] = [];

    for (const ingredient of recipe.ingredients) {
      const product = ingredient.product;

      const totalRequired = ingredient.quantity * prediction.predictedQuantity;
      const requiredBase = convertToBaseUnit(totalRequired, ingredient.unit);
      const stockBase = convertToBaseUnit(product.quantity, product.unit);

      // Skip incompatible units
      if (requiredBase.unit !== stockBase.unit) continue;

      const needed = convertFromBaseUnit(requiredBase.quantity, product.unit);
      const available = convertFromBaseUnit(stockBase.quantity, product.unit);

      let status: 'OK' | 'TIGHT' | 'SHORT';
      let deficit = 0;

      if (stockBase.quantity < requiredBase.quantity) {
        status = 'SHORT';
        deficit = Math.round(convertFromBaseUnit(requiredBase.quantity - stockBase.quantity, product.unit) * 100) / 100;
      } else if (stockBase.quantity < requiredBase.quantity * 1.5) {
        status = 'TIGHT';
      } else {
        status = 'OK';
      }

      ingredients.push({
        productName: product.name,
        needed: Math.round(needed * 100) / 100,
        available: Math.round(available * 100) / 100,
        unit: product.unit,
        status,
        deficit,
      });
    }

    // Overall recipe status = worst ingredient status
    let recipeStatus: 'OK' | 'TIGHT' | 'SHORT' = 'OK';
    if (ingredients.some((i) => i.status === 'SHORT')) recipeStatus = 'SHORT';
    else if (ingredients.some((i) => i.status === 'TIGHT')) recipeStatus = 'TIGHT';

    result.push({
      recipeId: prediction.recipeId,
      recipeName: prediction.recipeName,
      predictedQuantity: prediction.predictedQuantity,
      ingredients,
      status: recipeStatus,
    });
  }

  return result;
}
