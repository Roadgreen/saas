'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Banknote,
  Filter,
  X,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';

interface SumUpTx {
  id: string;
  sumupId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: string;
  paymentType: string | null;
  productSummary: string | null;
  products: unknown;
  matchedRecipe: { name: string } | null;
}

interface SumUpSalesListProps {
  transactions: SumUpTx[];
  currency?: CurrencyCode;
}

export function SumUpSalesList({ transactions, currency = 'EUR' }: SumUpSalesListProps) {
  const locale = useLocale();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const d = new Date(tx.timestamp);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (d < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }
      return true;
    });
  }, [transactions, dateFrom, dateTo]);

  const hasFilters = dateFrom || dateTo;
  const total = filtered.reduce((s, tx) => s + tx.amount, 0);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const getProductName = (tx: SumUpTx): string => {
    if (tx.products && Array.isArray(tx.products) && tx.products.length > 0) {
      const first = (tx.products as { name?: string }[])[0];
      if (first.name) return first.name;
    }
    return tx.productSummary ?? '—';
  };

  const getProducts = (tx: SumUpTx): { name: string; quantity: number; price: number }[] => {
    if (tx.products && Array.isArray(tx.products)) {
      return (tx.products as { name?: string; quantity?: number; price?: number }[]).map((p) => ({
        name: p.name ?? '—',
        quantity: p.quantity ?? 1,
        price: p.price ?? 0,
      }));
    }
    return [];
  };

  if (transactions.length === 0) return null;

  return (
    <Card className="dash-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00B6FF]/10 border border-[#00B6FF]/15">
            <CreditCard className="h-3.5 w-3.5 text-[#00B6FF]" />
          </div>
          Transactions SumUp
          <span className="text-xs font-normal text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {transactions.length}
          </span>
        </CardTitle>
        <span className="text-sm font-bold text-[#00B6FF]">
          {formatCurrency(total, currency)}
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2.5 px-3 py-2 bg-muted/40 rounded-lg border border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" />
            <span className="font-medium">Filtrer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground">Du</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-34 h-7 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground">Au</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-34 h-7 text-xs"
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="h-7 text-xs px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Effacer
            </Button>
          )}
          {hasFilters && (
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length}/{transactions.length}
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-8 text-sm text-muted-foreground italic">
            Aucune transaction pour cette période.
          </p>
        ) : (
          <div className="rounded-lg border border-border/60 overflow-hidden divide-y divide-border/60">
            {filtered.map((tx) => {
              const isExpanded = expanded.has(tx.id);
              const products = getProducts(tx);
              const hasProducts = products.length > 1;
              const isCard = tx.paymentType === 'CARD';
              const isCash = tx.paymentType === 'CASH';

              return (
                <div key={tx.id}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      hasProducts ? 'cursor-pointer hover:bg-muted/30' : 'hover:bg-muted/20'
                    }`}
                    onClick={() => hasProducts && toggleExpand(tx.id)}
                  >
                    {/* Expand chevron */}
                    <span className="w-3.5 shrink-0 text-muted-foreground/50">
                      {hasProducts
                        ? isExpanded
                          ? <ChevronDown className="h-3.5 w-3.5" />
                          : <ChevronRight className="h-3.5 w-3.5" />
                        : null}
                    </span>

                    {/* Date/time */}
                    <div className="w-24 shrink-0">
                      <p className="font-medium text-xs">
                        {new Date(tx.timestamp).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-muted-foreground tabular-nums">
                        {new Date(tx.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Product + match */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-medium truncate text-xs">{getProductName(tx)}</p>
                      {tx.matchedRecipe ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5 text-green-500 shrink-0" />
                          <span className="text-[10px] text-green-600 font-medium truncate">
                            {tx.matchedRecipe.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5 text-amber-400 shrink-0" />
                          <span className="text-[10px] text-amber-500">Non mappé</span>
                        </div>
                      )}
                    </div>

                    {/* Payment type */}
                    <div className="shrink-0">
                      {isCard ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#00B6FF]/8 text-[#0090cc] border border-[#00B6FF]/20 rounded-full px-2 py-0.5">
                          <CreditCard className="h-2.5 w-2.5" />
                          Carte
                        </span>
                      ) : isCash ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2 py-0.5">
                          <Banknote className="h-2.5 w-2.5" />
                          Espèces
                        </span>
                      ) : tx.paymentType ? (
                        <Badge variant="secondary" className="text-[10px]">{tx.paymentType}</Badge>
                      ) : null}
                    </div>

                    {/* Amount */}
                    <span className="font-bold text-sm w-16 text-right shrink-0 text-[#00B6FF]">
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>

                  {isExpanded && products.length > 0 && (
                    <div className="bg-muted/20 border-t border-border/40 px-10 py-2.5 space-y-1.5">
                      {products.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{p.quantity}×</span>{' '}
                            {p.name}
                          </span>
                          <span className="font-medium tabular-nums">
                            {formatCurrency(p.price, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
