'use client';

import { useState, useMemo, Fragment } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RecordSalesForm } from './RecordSalesForm';
import { EditSalesForm } from './EditSalesForm';
import { TrendingUp, MapPin, CloudSun, X, Filter, ChevronDown, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number | null;
  subtotal: number | null;
  recipe: {
    name: string;
  };
  recipeId: string;
}

interface Order {
  id: string;
  date: Date;
  totalRevenue: number | null;
  weatherSnapshot?: any;
  location?: {
    name: string;
  } | null;
  locationId?: string | null;
  items: OrderItem[];
}

interface Recipe {
  id: string;
  name: string;
}

interface SalesListProps {
  orders: Order[];
  recipes: Recipe[];
  currency?: CurrencyCode;
}

export function SalesList({ orders, recipes, currency = 'EUR' }: SalesListProps) {
  const t = useTranslations('Sales');
  const locale = useLocale();

  // Filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Extract unique locations from orders
  const locations = useMemo(() => {
    const locationSet = new Map<string, string>();
    orders.forEach(order => {
      if (order.location?.name && order.locationId) {
        locationSet.set(order.locationId, order.location.name);
      }
    });
    return Array.from(locationSet, ([id, name]) => ({ id, name }));
  }, [orders]);

  // Apply filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      
      // Date from filter
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (orderDate < fromDate) return false;
      }
      
      // Date to filter
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) return false;
      }
      
      // Location filter
      if (locationFilter && order.locationId !== locationFilter) return false;
      
      return true;
    });
  }, [orders, dateFrom, dateTo, locationFilter]);

  const hasFilters = dateFrom || dateTo || locationFilter;

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setLocationFilter('');
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  return (
    <Card className="dash-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <RecordSalesForm recipes={recipes} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            {t('filters.title')}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t('filters.dateFrom')}</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-36 h-9"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t('filters.dateTo')}</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-36 h-9"
            />
          </div>
          
          {locations.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">{t('filters.location')}</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="flex h-9 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">{t('filters.all')}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1" />
              {t('filters.clearFilters')}
            </Button>
          )}
        </div>

        {/* Results count */}
        {hasFilters && (
          <div className="text-sm text-muted-foreground">
            {t('filters.results', { count: filteredOrders.length, total: orders.length })}
          </div>
        )}

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {hasFilters ? t('filters.noResults') : t('noSales')}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>{t('table.date')}</TableHead>
                  <TableHead>{t('table.items')}</TableHead>
                  <TableHead>{t('table.location')}</TableHead>
                  <TableHead className="text-right">{t('table.revenue')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

                  return (
                    <Fragment key={order.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleExpand(order.id)}
                      >
                        <TableCell>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>
                          {new Date(order.date).toLocaleDateString(locale)}
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            {t('filters.items', { count: itemCount })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {order.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {order.location.name}
                              </div>
                            )}
                            {order.weatherSnapshot && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CloudSun className="h-3 w-3" />
                                {order.weatherSnapshot.temp}°C
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {order.totalRevenue ? formatCurrency(order.totalRevenue, currency) : '-'}
                        </TableCell>
                      </TableRow>
                      
                      {isExpanded && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={5} className="p-0">
                            <div className="p-4 pl-14 grid gap-2">
                              <div className="text-sm font-medium text-muted-foreground mb-2">{t('orderDetails')}</div>
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.quantity}x</span>
                                    <span>{item.recipe.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">
                                      {item.unitPrice ? `${formatCurrency(item.unitPrice, currency)}/u` : ''}
                                    </span>
                                    <span className="font-medium w-16 text-right">
                                      {item.subtotal ? formatCurrency(item.subtotal, currency) : '-'}
                                    </span>
                                    <EditSalesForm item={item} recipes={recipes} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
