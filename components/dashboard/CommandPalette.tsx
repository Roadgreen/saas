"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import {
  Search,
  LayoutDashboard,
  Package,
  ChefHat,
  TrendingUp,
  CreditCard,
  Plug,
  Settings,
  Receipt,
  BarChart3,
  FileDown,
  PlusCircle,
  ScanLine,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  href: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
  group: "navigation" | "actions";
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("CommandPalette");
  const tSidebar = useTranslations("Sidebar");
  const { data: session } = useSession();

  const tier = session?.user?.subscriptionTier as string | undefined;
  const role = session?.user?.role as string | undefined;
  const email = session?.user?.email as string | undefined;
  const isPremium = tier === "PRO" || tier === "ENTERPRISE";
  const isAdmin = role === "ADMIN" || email === "foodtracksio@gmail.com";

  // Build command list (memoized on session changes)
  const items = useMemo<CommandItem[]>(() => {
    const base: CommandItem[] = [
      {
        id: "nav-dashboard",
        label: tSidebar("dashboard"),
        href: `/${locale}/dashboard`,
        keywords: ["home", "accueil", "dashboard", "tableau"],
        icon: LayoutDashboard,
        group: "navigation",
      },
      {
        id: "nav-stock",
        label: tSidebar("stock"),
        href: `/${locale}/dashboard/products`,
        keywords: ["stock", "products", "produits", "inventaire"],
        icon: Package,
        group: "navigation",
      },
      {
        id: "nav-recipes",
        label: tSidebar("recipes"),
        href: `/${locale}/dashboard/recipes`,
        keywords: ["recipes", "recettes", "menu"],
        icon: ChefHat,
        group: "navigation",
      },
      {
        id: "nav-sales",
        label: tSidebar("sales"),
        href: `/${locale}/dashboard/sales`,
        keywords: ["sales", "ventes", "orders"],
        icon: TrendingUp,
        group: "navigation",
      },
      {
        id: "nav-sumup",
        label: tSidebar("sumup"),
        href: `/${locale}/dashboard/sumup`,
        keywords: ["sumup", "paiement", "terminal", "card"],
        icon: CreditCard,
        group: "navigation",
      },
      {
        id: "nav-integrations",
        label: tSidebar("integrations"),
        href: `/${locale}/dashboard/integrations`,
        keywords: ["integrations", "intégrations", "api"],
        icon: Plug,
        group: "navigation",
      },
      {
        id: "nav-settings",
        label: tSidebar("settings"),
        href: `/${locale}/dashboard/settings`,
        keywords: ["settings", "paramètres", "reglages", "config"],
        icon: Settings,
        group: "navigation",
      },
      {
        id: "nav-billing",
        label: tSidebar("billing"),
        href: `/${locale}/dashboard/settings/billing`,
        keywords: ["billing", "facturation", "abonnement", "plan"],
        icon: Receipt,
        group: "navigation",
      },
      {
        id: "action-new-product",
        label: t("newProduct"),
        description: t("newProductDesc"),
        href: `/${locale}/dashboard/products/new`,
        keywords: ["add", "ajouter", "new", "nouveau", "product", "produit"],
        icon: PlusCircle,
        group: "actions",
      },
      {
        id: "action-new-recipe",
        label: t("newRecipe"),
        description: t("newRecipeDesc"),
        href: `/${locale}/dashboard/recipes?new=1`,
        keywords: ["add", "ajouter", "new", "nouvelle", "recipe", "recette"],
        icon: PlusCircle,
        group: "actions",
      },
      {
        id: "action-record-sale",
        label: t("recordSale"),
        description: t("recordSaleDesc"),
        href: `/${locale}/dashboard/sales`,
        keywords: ["sale", "vente", "add", "enregistrer"],
        icon: ShoppingCart,
        group: "actions",
      },
      {
        id: "action-scan-invoice",
        label: t("scanInvoice"),
        description: t("scanInvoiceDesc"),
        href: `/${locale}/dashboard`,
        keywords: ["scan", "invoice", "facture", "ocr"],
        icon: ScanLine,
        group: "actions",
      },
    ];

    if (isPremium) {
      base.splice(4, 0, {
        id: "nav-analytics",
        label: tSidebar("analytics"),
        href: `/${locale}/dashboard/analytics`,
        keywords: ["analytics", "analyses", "stats", "reports"],
        icon: BarChart3,
        group: "navigation",
      });
      base.push({
        id: "action-export",
        label: tSidebar("exportData"),
        description: t("exportDesc"),
        href: "/api/export/csv",
        keywords: ["export", "csv", "download", "télécharger"],
        icon: FileDown,
        group: "actions",
      });
    }

    if (isAdmin) {
      base.push({
        id: "nav-errors",
        label: tSidebar("errorMonitoring"),
        href: `/${locale}/dashboard/admin/errors`,
        keywords: ["admin", "errors", "debug", "monitoring"],
        icon: LayoutDashboard,
        group: "navigation",
      });
    }

    return base;
  }, [locale, t, tSidebar, isPremium, isAdmin]);

  // Filtered items (simple case-insensitive substring match on label + keywords)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [item.label, item.description ?? "", ...item.keywords]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((token) => haystack.includes(token));
    });
  }, [items, query]);

  // Group for display
  const groups = useMemo(() => {
    const nav = filtered.filter((i) => i.group === "navigation");
    const actions = filtered.filter((i) => i.group === "actions");
    return [
      { key: "navigation" as const, label: t("navigation"), items: nav },
      { key: "actions" as const, label: t("quickActions"), items: actions },
    ].filter((g) => g.items.length > 0);
  }, [filtered, t]);

  // Flat list for keyboard nav
  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  // Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input after open animation
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const run = (item: CommandItem) => {
    setOpen(false);
    // Use router.push for client-side nav; API routes fall through to full nav
    if (item.href.startsWith("/api/")) {
      window.location.href = item.href;
    } else {
      router.push(item.href);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(flatItems.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) run(item);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="p-0 gap-0 max-w-xl overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={t("placeholder")}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            aria-label={t("placeholder")}
          />
          <kbd className="hidden md:inline-flex items-center gap-1 rounded border bg-muted/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {flatItems.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </div>
          )}
          {groups.map((group) => (
            <div key={group.key} className="py-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              <ul>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const flatIdx = flatItems.findIndex((f) => f.id === item.id);
                  const isActive = flatIdx === activeIndex;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => run(item)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors",
                          isActive
                            ? "bg-orange-500/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-orange-500" : "text-muted-foreground/70"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-foreground">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {isActive && (
                          <ArrowRight className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border bg-background px-1 py-0.5 text-[10px] font-mono">↑↓</kbd>
              {t("navigate")}
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border bg-background px-1 py-0.5 text-[10px] font-mono">↵</kbd>
              {t("select")}
            </span>
          </div>
          <span className="hidden sm:inline">{t("shortcutHint")}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
