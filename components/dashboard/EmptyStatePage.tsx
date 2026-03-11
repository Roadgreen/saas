"use client";

import { Package, ChefHat, ShoppingCart } from "lucide-react";
import { EmptyStateCard } from "./EmptyStateCard";
import { useTranslations, useLocale } from "next-intl";
import { type LucideIcon } from "lucide-react";

const pageConfig: Record<
  string,
  { icon: LucideIcon; translationKey: string; hrefSuffix: string }
> = {
  products: { icon: Package, translationKey: "products", hrefSuffix: "/dashboard/products/new" },
  recipes: { icon: ChefHat, translationKey: "recipes", hrefSuffix: "/dashboard/recipes" },
  sales: { icon: ShoppingCart, translationKey: "sales", hrefSuffix: "/dashboard/sales" },
};

interface EmptyStatePageProps {
  page: "products" | "recipes" | "sales";
}

export function EmptyStatePage({ page }: EmptyStatePageProps) {
  const t = useTranslations("EmptyStates");
  const locale = useLocale();
  const config = pageConfig[page];

  return (
    <EmptyStateCard
      icon={config.icon}
      title={t(`${config.translationKey}.pageTitle`)}
      description={t(`${config.translationKey}.pageDescription`)}
      ctaLabel={t(`${config.translationKey}.pageCta`)}
      ctaHref={`/${locale}${config.hrefSuffix}`}
      fullPage
    />
  );
}
