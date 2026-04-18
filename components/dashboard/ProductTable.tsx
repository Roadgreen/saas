'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Package, Pencil, Search, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle, DollarSign, BarChart3, X, TrendingDown, Calendar, Download } from 'lucide-react';
import { StockAdjustmentDialog } from '@/components/dashboard/StockAdjustmentDialog';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';
import { toast } from 'sonner';

interface ProductDemandInfo {
  coverageDays: number;
  deficit: number;
  topRecipes: string[];
}

interface Product {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  unit: string;
  expiryDate: string;
  costPerUnit: number | null;
  status: 'OK' | 'NEAR_EXPIRY' | 'EXPIRED';
  imageUrl: string | null;
  locationName: string;
  demand: ProductDemandInfo | null;
}

interface CategoryStat {
  name: string;
  count: number;
  value: number;
}

interface InventoryStats {
  totalValue: number;
  totalProducts: number;
  lowStockCount: number;
  categoryStats: CategoryStat[];
  categories: number;
}

interface ProductTableProps {
  products: Product[];
  currency?: CurrencyCode;
  stats?: InventoryStats;
  filterOptions?: { categories: string[]; locations: string[] };
  hasPredictions?: boolean;
}

type SortField = 'name' | 'quantity' | 'costPerUnit' | 'expiryDate' | 'status';
type SortDirection = 'asc' | 'desc';

const statusOrder: Record<string, number> = { EXPIRED: 0, NEAR_EXPIRY: 1, OK: 2 };

export function ProductTable({
  products: initialProducts,
  currency = 'EUR',
  stats,
  filterOptions,
  hasPredictions = false,
}: ProductTableProps) {
  const t = useTranslations('Products');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);

  // Filters — initial values hydrated from URL so the view is shareable/bookmarkable
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [statusFilter, setStatusFilter] = useState<string>(() => searchParams.get('status') ?? 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>(() => searchParams.get('cat') ?? 'all');
  const [locationFilter, setLocationFilter] = useState<string>(() => searchParams.get('loc') ?? 'all');
  const [quickChip, setQuickChip] = useState<'lowStock' | 'expiring' | 'noCategory' | 'outOfStock' | null>(() => {
    const chip = searchParams.get('chip');
    return chip === 'lowStock' || chip === 'expiring' || chip === 'noCategory' || chip === 'outOfStock' ? chip : null;
  });

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sort
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sync local state when server re-renders with fresh data
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Persist filters to the URL so the current view can be bookmarked/shared.
  // Uses replaceState (no history noise, no network) debounced lightly for the search input.
  const urlSyncTimer = useRef<number | null>(null);
  useEffect(() => {
    if (urlSyncTimer.current) window.clearTimeout(urlSyncTimer.current);
    urlSyncTimer.current = window.setTimeout(() => {
      const sp = new URLSearchParams();
      if (search) sp.set('q', search);
      if (statusFilter !== 'all') sp.set('status', statusFilter);
      if (categoryFilter !== 'all') sp.set('cat', categoryFilter);
      if (locationFilter !== 'all') sp.set('loc', locationFilter);
      if (quickChip) sp.set('chip', quickChip);
      const qs = sp.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      window.history.replaceState(null, '', next);
    }, 200);
    return () => {
      if (urlSyncTimer.current) window.clearTimeout(urlSyncTimer.current);
    };
  }, [search, statusFilter, categoryFilter, locationFilter, quickChip, pathname]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcuts: "n" → new product, "/" → focus search (ignore when typing in fields)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.tagName === 'SELECT');
      if (typing) return;
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        router.push(`/${locale}/dashboard/products/new`);
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, locale]);

  const handleDelete = (productId: string, productName: string) => {
    const snapshot = products;
    let undone = false;

    // Optimistic removal
    setProducts(prev => prev.filter(p => p.id !== productId));

    // Defer the actual DELETE by 5s so the user can undo
    const timer = window.setTimeout(async () => {
      if (undone) return;
      try {
        const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        if (!res.ok) {
          setProducts(snapshot);
          toast.error(t('deleteError'));
        } else {
          router.refresh();
        }
      } catch {
        setProducts(snapshot);
        toast.error(t('deleteError'));
      }
    }, 5000);

    toast.success(t('deletePending', { name: productName }), {
      duration: 5000,
      action: {
        label: t('undo'),
        onClick: () => {
          undone = true;
          window.clearTimeout(timer);
          setProducts(snapshot);
          toast.message(t('restored'));
        },
      },
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const filteredAndSorted = useMemo(() => {
    let result = products;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(p => (p.category || '') === categoryFilter);
    }

    if (locationFilter !== 'all') {
      result = result.filter(p => p.locationName === locationFilter);
    }

    if (quickChip === 'lowStock') {
      result = result.filter(p =>
        p.quantity > 0 && (p.demand
          ? p.demand.coverageDays < 1.5
          : (!hasPredictions && p.quantity <= 5))
      );
    } else if (quickChip === 'expiring') {
      result = result.filter(p => p.status === 'NEAR_EXPIRY' || p.status === 'EXPIRED');
    } else if (quickChip === 'noCategory') {
      result = result.filter(p => !p.category);
    } else if (quickChip === 'outOfStock') {
      result = result.filter(p => p.quantity === 0);
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case 'name':
            cmp = a.name.localeCompare(b.name);
            break;
          case 'quantity':
            cmp = a.quantity - b.quantity;
            break;
          case 'costPerUnit':
            cmp = (a.costPerUnit ?? 0) - (b.costPerUnit ?? 0);
            break;
          case 'expiryDate':
            cmp = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
            break;
          case 'status':
            cmp = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
            break;
        }
        return sortDirection === 'desc' ? -cmp : cmp;
      });
    }

    return result;
  }, [products, search, statusFilter, categoryFilter, locationFilter, quickChip, hasPredictions, sortField, sortDirection]);

  const hasActiveFilters = search || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all' || quickChip !== null;

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setLocationFilter('all');
    setQuickChip(null);
  };

  // Counts for chip badges (computed once from the full set, independent of current filters)
  const chipCounts = useMemo(() => {
    let lowStock = 0, expiring = 0, noCategory = 0, outOfStock = 0;
    for (const p of products) {
      if (p.quantity === 0) outOfStock++;
      else if (p.demand ? p.demand.coverageDays < 1.5 : (!hasPredictions && p.quantity <= 5)) lowStock++;
      if (p.status === 'NEAR_EXPIRY' || p.status === 'EXPIRED') expiring++;
      if (!p.category) noCategory++;
    }
    return { lowStock, expiring, noCategory, outOfStock };
  }, [products, hasPredictions]);

  const toggleChip = (chip: typeof quickChip) => {
    setQuickChip(prev => prev === chip ? null : chip);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    setSelectedIds(prev => {
      const visibleIds = filteredAndSorted.map(p => p.id);
      const allSelected = visibleIds.length > 0 && visibleIds.every(id => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        visibleIds.forEach(id => next.delete(id));
        return next;
      }
      const next = new Set(prev);
      visibleIds.forEach(id => next.add(id));
      return next;
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const snapshot = products;
    let undone = false;

    // Optimistic removal
    setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());

    const timer = window.setTimeout(async () => {
      if (undone) return;
      try {
        const results = await Promise.all(
          ids.map(id => fetch(`/api/products/${id}`, { method: 'DELETE' }).then(r => r.ok).catch(() => false))
        );
        if (results.some(ok => !ok)) {
          toast.error(t('bulk.deleteError'));
          router.refresh();
        } else {
          router.refresh();
        }
      } catch {
        setProducts(snapshot);
        toast.error(t('bulk.deleteError'));
      }
    }, 5000);

    toast.success(t('bulk.deletePending', { count: ids.length }), {
      duration: 5000,
      action: {
        label: t('undo'),
        onClick: () => {
          undone = true;
          window.clearTimeout(timer);
          setProducts(snapshot);
          toast.message(t('restored'));
        },
      },
    });
  };

  const handleExportCSV = () => {
    const rows = filteredAndSorted;
    if (rows.length === 0) {
      toast.message(t('export.empty'));
      return;
    }
    const header = ['name', 'category', 'quantity', 'unit', 'costPerUnit', 'expiryDate', 'status', 'location'];
    const esc = (v: string | number | null | undefined) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      header.join(','),
      ...rows.map(p => [
        p.name,
        p.category ?? '',
        p.quantity,
        p.unit,
        p.costPerUnit ?? '',
        p.expiryDate ? new Date(p.expiryDate).toISOString().slice(0, 10) : '',
        p.status,
        p.locationName,
      ].map(esc).join(',')),
    ];
    const csv = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('export.success', { count: rows.length }));
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-100 text-green-800';
      case 'NEAR_EXPIRY': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-50 text-muted-foreground';
    }
  };

  const isLowStock = (p: Product) => {
    if (p.demand) return p.demand.coverageDays < 1.5;
    // Static fallback only when no predictions exist at all
    if (!hasPredictions) return p.quantity <= 5 && p.quantity > 0;
    return false;
  };

  const isCriticalStock = (p: Product) => {
    if (p.demand) return p.demand.coverageDays < 1;
    return false;
  };

  const getStockBadge = (product: Product) => {
    if (product.quantity === 0) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
          0
        </span>
      );
    }

    if (product.demand) {
      if (product.demand.coverageDays < 1) {
        return (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 cursor-help"
            title={product.demand.topRecipes.length > 0
              ? t('topConsumers', { recipes: product.demand.topRecipes.join(', ') })
              : undefined}
          >
            <TrendingDown className="h-3 w-3" />
            {t('lowStockInsufficient')}
          </span>
        );
      }
      if (product.demand.coverageDays < 1.5) {
        return (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 cursor-help"
            title={product.demand.topRecipes.length > 0
              ? t('topConsumers', { recipes: product.demand.topRecipes.join(', ') })
              : undefined}
          >
            <AlertTriangle className="h-3 w-3" />
            {t('lowStockTight')}
          </span>
        );
      }
      return null;
    }

    // Static fallback
    if (!hasPredictions && product.quantity <= 5 && product.quantity > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
          <AlertTriangle className="h-3 w-3" />
          {t('lowStock')}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Inventory Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="dash-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="rounded-md bg-green-100 p-1.5"><DollarSign className="h-3.5 w-3.5 text-green-600" /></div>
                {t('stats.totalValue')}
              </div>
              <div className="text-2xl font-bold mt-1 text-green-600">
                {formatCurrency(stats.totalValue, currency)}
              </div>
            </CardContent>
          </Card>
          <Card className="dash-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="rounded-md bg-blue-100 p-1.5"><Package className="h-3.5 w-3.5 text-blue-600" /></div>
                {t('stats.totalProducts')}
              </div>
              <div className="text-2xl font-bold mt-1 text-blue-600">
                {stats.totalProducts}
                <span className="text-sm font-normal text-muted-foreground ml-1">{t('stats.items')}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="dash-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="rounded-md bg-teal-100 p-1.5"><BarChart3 className="h-3.5 w-3.5 text-teal-600" /></div>
                {t('stats.categories')}
              </div>
              <div className="text-2xl font-bold mt-1 text-teal-600">
                {stats.categories}
              </div>
              {stats.categoryStats.length > 0 && (
                <div className="mt-2 space-y-1">
                  {stats.categoryStats.slice(0, 3).map(cat => (
                    <div key={cat.name} className="flex justify-between text-xs text-muted-foreground">
                      <span>{cat.name === '__none__' ? t('stats.noCategory') : cat.name}</span>
                      <span>{cat.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className={`dash-card ${stats.lowStockCount > 0 ? 'border-orange-200 bg-orange-50/50' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`rounded-md p-1.5 ${stats.lowStockCount > 0 ? 'bg-orange-100' : 'bg-gray-50'}`}>
                  <AlertTriangle className={`h-3.5 w-3.5 ${stats.lowStockCount > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
                </div>
                {t('stats.lowStock')}
              </div>
              <div className={`text-2xl font-bold mt-1 ${stats.lowStockCount > 0 ? 'text-red-600' : ''}`}>
                {stats.lowStockCount}
                <span className="text-sm font-normal text-muted-foreground ml-1">{t('stats.items')}</span>
              </div>
              {hasPredictions && (
                <div className="text-xs text-muted-foreground mt-1">
                  {t('demandBased')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="dash-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 space-y-0 pb-4">
          <CardTitle className="text-lg md:text-xl font-semibold tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t('inventory')}
          </CardTitle>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={handleExportCSV}
              disabled={products.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('export.button')}
            </Button>
            <Link href={`/${locale}/dashboard/products/new`} className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                {t('addProduct')}
                <kbd className="ml-2 hidden md:inline-flex items-center rounded border border-white/30 bg-white/10 px-1 py-0.5 text-[10px] font-mono">
                  N
                </kbd>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk action bar (desktop only; appears when any row is selected) */}
          {selectedIds.size > 0 && (
            <div className="hidden md:flex items-center justify-between gap-3 mb-3 rounded-lg border border-orange-500/30 bg-orange-500/5 px-3 py-2">
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {t('bulk.selected', { count: selectedIds.size })}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                  {t('bulk.clearSelection')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t('bulk.deleteSelected')}
                </Button>
              </div>
            </div>
          )}

          {/* Quick-filter chips */}
          {(chipCounts.lowStock + chipCounts.expiring + chipCounts.noCategory + chipCounts.outOfStock) > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {chipCounts.outOfStock > 0 && (
                <ChipButton
                  active={quickChip === 'outOfStock'}
                  onClick={() => toggleChip('outOfStock')}
                  tone="red"
                  icon={<AlertTriangle className="h-3 w-3" />}
                  label={t('chips.outOfStock')}
                  count={chipCounts.outOfStock}
                />
              )}
              {chipCounts.lowStock > 0 && (
                <ChipButton
                  active={quickChip === 'lowStock'}
                  onClick={() => toggleChip('lowStock')}
                  tone="amber"
                  icon={<TrendingDown className="h-3 w-3" />}
                  label={t('chips.lowStock')}
                  count={chipCounts.lowStock}
                />
              )}
              {chipCounts.expiring > 0 && (
                <ChipButton
                  active={quickChip === 'expiring'}
                  onClick={() => toggleChip('expiring')}
                  tone="orange"
                  icon={<Calendar className="h-3 w-3" />}
                  label={t('chips.expiring')}
                  count={chipCounts.expiring}
                />
              )}
              {chipCounts.noCategory > 0 && (
                <ChipButton
                  active={quickChip === 'noCategory'}
                  onClick={() => toggleChip('noCategory')}
                  tone="gray"
                  icon={<Package className="h-3 w-3" />}
                  label={t('chips.noCategory')}
                  count={chipCounts.noCategory}
                />
              )}
            </div>
          )}

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-10"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground pointer-events-none">
                /
              </kbd>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                <SelectItem value="OK">{t('status_OK')}</SelectItem>
                <SelectItem value="NEAR_EXPIRY">{t('status_NEAR_EXPIRY')}</SelectItem>
                <SelectItem value="EXPIRED">{t('status_EXPIRED')}</SelectItem>
              </SelectContent>
            </Select>
            {filterOptions && filterOptions.categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allCategories')}</SelectItem>
                  {filterOptions.categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {filterOptions && filterOptions.locations.length > 1 && (
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allLocations')}</SelectItem>
                  {filterOptions.locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
                <X className="h-4 w-4 mr-1" />
                {t('filters.clear')}
              </Button>
            )}
          </div>

          {/* Filter results count */}
          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground mb-3">
              {t('filters.results', { count: filteredAndSorted.length, total: products.length })}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('noProducts')}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('filters.results', { count: 0, total: products.length })}
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {filteredAndSorted.map((product, index) => {
                  const low = isLowStock(product);
                  const critical = isCriticalStock(product);
                  const badge = getStockBadge(product);
                  const expiryColor = product.status === 'EXPIRED'
                    ? 'text-red-500'
                    : product.status === 'NEAR_EXPIRY'
                      ? 'text-yellow-500'
                      : 'text-muted-foreground';
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className={`rounded-xl border border-border/60 p-4 ${
                        critical ? 'bg-red-950/20 border-red-800/40' : low ? 'bg-orange-950/20 border-orange-800/40' : 'bg-[#1A1410]'
                      }`}
                    >
                      {/* Row 1: Image + Name + Category */}
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-border/40">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 shrink-0 rounded-lg border border-border/40 bg-[#0D0905] flex items-center justify-center text-muted-foreground">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white truncate">{product.name}</span>
                            {badge}
                          </div>
                          {product.category && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs bg-orange-500/15 text-orange-400">
                              {product.category}
                            </span>
                          )}
                        </div>
                        {/* Status badge */}
                        <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${statusClass(product.status)}`}>
                          {t(`status_${product.status}` as any)}
                        </span>
                      </div>

                      {/* Row 2: Quantity + Cost + Expiry */}
                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs">{t('quantity')}</div>
                          <span className={`font-medium ${critical ? 'text-red-500' : low ? 'text-orange-500' : 'text-white'}`}>
                            {product.quantity} {product.unit}
                          </span>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">{t('costPerUnit')}</div>
                          <span className="text-white font-medium">
                            {product.costPerUnit != null
                              ? formatCurrency(product.costPerUnit, currency)
                              : '-'}
                          </span>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t('expiryDate')}
                          </div>
                          <span className={`font-medium ${expiryColor}`}>
                            {new Date(product.expiryDate).toLocaleDateString(locale, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Demand info */}
                      {product.demand && (low || critical) && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {product.demand.coverageDays === Infinity
                            ? null
                            : t('coverageDays', { days: product.demand.coverageDays.toFixed(1) })}
                        </div>
                      )}

                      {/* Row 3: Action buttons */}
                      <div className="mt-3 flex items-center justify-end gap-1 border-t border-border/30 pt-3">
                        <StockAdjustmentDialog
                          productId={product.id}
                          productName={product.name}
                          currentUnit={product.unit}
                          currentQuantity={product.quantity}
                        />
                        <Link href={`/${locale}/dashboard/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-11 w-11 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-11 w-11 p-0 text-red-500 hover:text-red-700 hover:bg-red-950/50"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          aria-label={t('bulk.selectAll')}
                          className="h-4 w-4 rounded border-input accent-orange-500 cursor-pointer"
                          checked={
                            filteredAndSorted.length > 0 &&
                            filteredAndSorted.every(p => selectedIds.has(p.id))
                          }
                          onChange={toggleSelectAllVisible}
                        />
                      </TableHead>
                      <TableHead className="w-12">{t('image')}</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => handleSort('name')}
                        >
                          {t('name')}
                          {getSortIcon('name')}
                        </button>
                      </TableHead>
                      <TableHead>{t('category')}</TableHead>
                      <TableHead className="text-right">
                        <button
                          className="flex items-center ml-auto hover:text-foreground transition-colors"
                          onClick={() => handleSort('quantity')}
                        >
                          {t('quantity')}
                          {getSortIcon('quantity')}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">
                        <button
                          className="flex items-center ml-auto hover:text-foreground transition-colors"
                          onClick={() => handleSort('costPerUnit')}
                        >
                          {t('costPerUnit')}
                          {getSortIcon('costPerUnit')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => handleSort('expiryDate')}
                        >
                          {t('expiryDate')}
                          {getSortIcon('expiryDate')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          {t('status')}
                          {getSortIcon('status')}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSorted.map((product) => {
                      const low = isLowStock(product);
                      const critical = isCriticalStock(product);
                      const badge = getStockBadge(product);
                      return (
                        <TableRow
                          key={product.id}
                          data-selected={selectedIds.has(product.id) ? "true" : undefined}
                          className={`${critical ? 'bg-red-50/50' : low ? 'bg-orange-50/50' : ''} data-[selected=true]:bg-orange-500/5`}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              aria-label={product.name}
                              className="h-4 w-4 rounded border-input accent-orange-500 cursor-pointer"
                              checked={selectedIds.has(product.id)}
                              onChange={() => toggleSelect(product.id)}
                            />
                          </TableCell>
                          <TableCell>
                            {product.imageUrl ? (
                              <div className="relative h-10 w-10 rounded overflow-hidden border">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center text-muted-foreground">
                                <Package className="h-4 w-4" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2 flex-wrap">
                              {product.name}
                              {badge}
                            </div>
                            {product.demand && (low || critical) && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {product.demand.coverageDays === Infinity
                                  ? null
                                  : t('coverageDays', { days: product.demand.coverageDays.toFixed(1) })}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {product.category || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={critical ? 'text-red-600 font-medium' : low ? 'text-orange-600 font-medium' : ''}>
                              {product.quantity} {product.unit}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {product.costPerUnit != null
                              ? formatCurrency(product.costPerUnit, currency)
                              : <span className="text-muted-foreground text-xs">{t('noCostSet')}</span>
                            }
                          </TableCell>
                          <TableCell>
                            {new Date(product.expiryDate).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(product.status)}`}>
                              {t(`status_${product.status}` as any)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <StockAdjustmentDialog
                                productId={product.id}
                                productName={product.name}
                                currentUnit={product.unit}
                                currentQuantity={product.quantity}
                              />
                              <Link href={`/${locale}/dashboard/products/${product.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(product.id, product.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type ChipTone = 'red' | 'amber' | 'orange' | 'gray';

function ChipButton({
  active,
  onClick,
  tone,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  tone: ChipTone;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  const palette: Record<ChipTone, { activeBg: string; activeText: string; activeBorder: string; idleText: string; idleBorder: string }> = {
    red: {
      activeBg: 'bg-red-500/15',
      activeText: 'text-red-600 dark:text-red-300',
      activeBorder: 'border-red-500/40',
      idleText: 'text-red-600/90 dark:text-red-300/80',
      idleBorder: 'border-red-500/20',
    },
    amber: {
      activeBg: 'bg-amber-500/15',
      activeText: 'text-amber-700 dark:text-amber-300',
      activeBorder: 'border-amber-500/40',
      idleText: 'text-amber-700/90 dark:text-amber-300/80',
      idleBorder: 'border-amber-500/20',
    },
    orange: {
      activeBg: 'bg-orange-500/15',
      activeText: 'text-orange-600 dark:text-orange-300',
      activeBorder: 'border-orange-500/40',
      idleText: 'text-orange-600/90 dark:text-orange-300/80',
      idleBorder: 'border-orange-500/20',
    },
    gray: {
      activeBg: 'bg-muted',
      activeText: 'text-foreground',
      activeBorder: 'border-foreground/30',
      idleText: 'text-muted-foreground',
      idleBorder: 'border-border',
    },
  };
  const p = palette[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors active:scale-[0.97] ${
        active ? `${p.activeBg} ${p.activeText} ${p.activeBorder}` : `bg-transparent ${p.idleText} ${p.idleBorder} hover:bg-muted/40`
      }`}
    >
      {icon}
      {label}
      <span className={`ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums ${active ? 'bg-background/60' : 'bg-muted/60'}`}>
        {count}
      </span>
    </button>
  );
}
