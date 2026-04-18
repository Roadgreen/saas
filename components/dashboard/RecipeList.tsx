'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateRecipeForm } from './CreateRecipeForm';
import { ChefHat, ArrowRight, Download } from 'lucide-react';
import { formatCurrency, type CurrencyCode } from '@/lib/currency';
import { toast } from 'sonner';

interface Ingredient {
  id: string;
  quantity: number;
  unit: string;
  product: {
    name: string;
  };
}

interface Recipe {
  id: string;
  name: string;
  description?: string | null;
  ingredients: Ingredient[];
  totalCost: number;
  sellingPrice?: number | null;
  grossMargin?: number | null;
}

interface Product {
  id: string;
  name: string;
  unit: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  products: Product[];
  currency?: CurrencyCode;
}

export function RecipeList({ recipes, products, currency = 'EUR' }: RecipeListProps) {
  const t = useTranslations('Recipes');

  const handleExportCSV = () => {
    if (recipes.length === 0) {
      toast.message(t('export.empty'));
      return;
    }
    const header = ['name', 'description', 'ingredientsCount', 'ingredients', 'cost', 'sellingPrice', 'grossMarginPct'];
    const esc = (v: string | number | null | undefined) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      header.join(','),
      ...recipes.map(r => [
        r.name,
        r.description ?? '',
        r.ingredients.length,
        r.ingredients.map(i => `${i.quantity} ${i.unit} ${i.product.name}`).join(' | '),
        r.totalCost.toFixed(2),
        r.sellingPrice != null ? r.sellingPrice.toFixed(2) : '',
        r.grossMargin != null ? r.grossMargin.toFixed(1) : '',
      ].map(esc).join(',')),
    ];
    const csv = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('export.success', { count: recipes.length }));
  };

  return (
    <Card className="dash-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={handleExportCSV}
            disabled={recipes.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('export.button')}
          </Button>
          <CreateRecipeForm products={products} />
        </div>
      </CardHeader>
      <CardContent>
        {recipes.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {t('noRecipes')}
          </div>
        ) : (
          <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="rounded-xl border border-border/60 p-4 bg-[#1A1410]"
              >
                {/* Recipe name */}
                <div className="font-semibold text-white text-lg leading-tight">
                  {recipe.name}
                </div>
                {recipe.description && (
                  <div className="text-sm text-muted-foreground mt-0.5">{recipe.description}</div>
                )}

                {/* Ingredient count */}
                <div className="mt-2 text-sm text-muted-foreground">
                  {recipe.ingredients.length} {t('table.ingredients').toLowerCase()}
                </div>

                {/* Cost -> Selling Price -> Margin */}
                <div className="mt-3 flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-white font-medium">{formatCurrency(recipe.totalCost, currency)}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-orange-400 font-medium">
                    {recipe.sellingPrice ? formatCurrency(recipe.sellingPrice, currency) : '-'}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  {recipe.grossMargin != null ? (
                    <span className={`font-bold ${recipe.grossMargin < 70 ? 'text-red-500' : 'text-green-500'}`}>
                      {recipe.grossMargin.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.ingredients')}</TableHead>
                <TableHead className="text-right">{t('cost')}</TableHead>
                <TableHead className="text-right">{t('sellingPrice')}</TableHead>
                <TableHead className="text-right">{t('margin')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">
                    <div>{recipe.name}</div>
                    {recipe.description && (
                      <div className="text-sm text-muted-foreground">{recipe.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-sm">
                      {recipe.ingredients.map((ing) => (
                        <li key={ing.id}>
                          {ing.quantity} {ing.unit} {ing.product.name}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(recipe.totalCost, currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {recipe.sellingPrice ? formatCurrency(recipe.sellingPrice, currency) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {recipe.grossMargin != null ? (
                      <span className={recipe.grossMargin < 70 ? 'text-red-600 font-bold' : 'text-green-600'}>
                        {recipe.grossMargin.toFixed(1)}%
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Actions like Edit/Delete can be added here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
