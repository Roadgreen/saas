'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Package, Pencil, Search, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle, DollarSign, BarChart3, X, TrendingDown } from 'lucide-react';
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
  const [products, setProducts] = useState(initialProducts);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Sort
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sync local state when server re-renders with fresh data
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    setProducts(prev => prev.filter(p => p.id !== productId));

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) {
        setProducts(initialProducts);
        toast.error(t('deleteError'));
      } else {
        toast.success(t('deleteSuccess', { name: productName }));
        router.refresh();
      }
    } catch {
      setProducts(initialProducts);
      toast.error(t('deleteError'));
    }
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
  }, [products, search, statusFilter, categoryFilter, locationFilter, sortField, sortDirection]);

  const hasActiveFilters = search || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setLocationFilter('all');
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
          <Link href={`/${locale}/dashboard/products/new`}>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t('addProduct')}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                        className={critical ? 'bg-red-50/50' : low ? 'bg-orange-50/50' : ''}
                      >
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
