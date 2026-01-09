'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RecordSalesForm } from './RecordSalesForm';
import { TrendingUp, MapPin, CloudSun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DailySales {
  id: string;
  date: Date;
  quantity: number;
  totalRevenue: number | null;
  recipe: {
    name: string;
  };
  location?: {
    name: string;
  } | null;
  weatherSnapshot?: any;
}

interface Recipe {
  id: string;
  name: string;
}

interface SalesListProps {
  sales: DailySales[];
  recipes: Recipe[];
}

export function SalesList({ sales, recipes }: SalesListProps) {
  const t = useTranslations('Sales');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <RecordSalesForm recipes={recipes} />
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {t('noSales')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.date')}</TableHead>
                <TableHead>{t('table.recipe')}</TableHead>
                <TableHead>{t('table.location')}</TableHead>
                <TableHead>{t('table.quantity')}</TableHead>
                <TableHead className="text-right">{t('table.revenue')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {new Date(sale.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sale.recipe.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {sale.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {sale.location.name}
                        </div>
                      )}
                      {sale.weatherSnapshot && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CloudSun className="h-3 w-3" />
                          {sale.weatherSnapshot.temp}°C
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {sale.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {sale.totalRevenue ? `$${sale.totalRevenue.toFixed(2)}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
