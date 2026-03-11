"use client";

import { Package, ChefHat, ShoppingCart, MapPin } from "lucide-react";
import { EmptyStateCard } from "./EmptyStateCard";
import { useTranslations, useLocale } from "next-intl";

interface DashboardEmptyStatesProps {
  productCount: number;
  recipeCount: number;
  orderCount: number;
  locationCount: number;
}

export function DashboardEmptyStates({
  productCount,
  recipeCount,
  orderCount,
  locationCount,
}: DashboardEmptyStatesProps) {
  const t = useTranslations("EmptyStates");
  const locale = useLocale();

  const hasAnyEmpty =
    productCount === 0 ||
    recipeCount === 0 ||
    orderCount === 0 ||
    locationCount === 0;

  if (!hasAnyEmpty) return null;

  const cards = [];
  let idx = 0;

  if (productCount === 0) {
    cards.push(
      <EmptyStateCard
        key="products"
        icon={Package}
        title={t("products.title")}
        description={t("products.description")}
        ctaLabel={t("products.cta")}
        ctaHref={`/${locale}/dashboard/products`}
        delay={idx * 0.1}
      />
    );
    idx++;
  }

  if (recipeCount === 0) {
    cards.push(
      <EmptyStateCard
        key="recipes"
        icon={ChefHat}
        title={t("recipes.title")}
        description={t("recipes.description")}
        ctaLabel={t("recipes.cta")}
        ctaHref={`/${locale}/dashboard/recipes`}
        delay={idx * 0.1}
      />
    );
    idx++;
  }

  if (orderCount === 0) {
    cards.push(
      <EmptyStateCard
        key="sales"
        icon={ShoppingCart}
        title={t("sales.title")}
        description={t("sales.description")}
        ctaLabel={t("sales.cta")}
        ctaHref={`/${locale}/dashboard/sales`}
        delay={idx * 0.1}
      />
    );
    idx++;
  }

  if (locationCount === 0) {
    cards.push(
      <EmptyStateCard
        key="locations"
        icon={MapPin}
        title={t("locations.title")}
        description={t("locations.description")}
        ctaLabel={t("locations.cta")}
        ctaHref={`/${locale}/dashboard/settings`}
        delay={idx * 0.1}
      />
    );
    idx++;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards}
    </div>
  );
}
