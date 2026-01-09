'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

interface StockHistoryItem {
  id: string;
  date: Date;
  quantity: number;
  type: string;
  note: string | null;
}

interface StockHistoryListProps {
  history: StockHistoryItem[];
}

export function StockHistoryList({ history }: StockHistoryListProps) {
  const t = useTranslations('Stock');

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          {t('history')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {t('noHistory')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('quantity')}</TableHead>
                <TableHead>{t('reason')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'MANUAL' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'SALES' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className={item.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.quantity > 0 ? '+' : ''}{item.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.note || '-'}
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
