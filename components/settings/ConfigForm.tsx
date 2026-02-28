"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessSettings {
  currency?: string;
  vat?: number;
  stockAlerts?: boolean;
  autoDeduct?: boolean;
}

interface ConfigFormProps {
  initialSettings?: BusinessSettings;
}

export function ConfigForm({ initialSettings }: ConfigFormProps) {
  const t = useTranslations('Settings.Configuration');
  const tGlobal = useTranslations('Settings');

  const [currency, setCurrency] = useState(initialSettings?.currency ?? 'EUR');
  const [vat, setVat] = useState(String(initialSettings?.vat ?? '20'));
  const [stockAlerts, setStockAlerts] = useState(initialSettings?.stockAlerts ?? true);
  const [autoDeduct, setAutoDeduct] = useState(initialSettings?.autoDeduct ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            currency,
            vat: parseFloat(vat) || 20,
            stockAlerts,
            autoDeduct,
          },
        }),
      });

      if (!res.ok) throw new Error();
      toast.success(tGlobal('save'));
    } catch {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('stock.title')}</CardTitle>
          <CardDescription>{t('stock.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('stock.alerts')}</Label>
              <p className="text-sm text-muted-foreground">{t('stock.alertsDesc')}</p>
            </div>
            <Switch
              checked={stockAlerts}
              onCheckedChange={setStockAlerts}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('stock.autoDeduct')}</Label>
              <p className="text-sm text-muted-foreground">{t('stock.autoDeductDesc')}</p>
            </div>
            <Switch
              checked={autoDeduct}
              onCheckedChange={setAutoDeduct}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('finance.title')}</CardTitle>
          <CardDescription>{t('finance.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t('finance.currency')}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t('finance.vat')}</Label>
              <Input
                type="number"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                placeholder="20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tGlobal('save')}
        </Button>
      </div>
    </div>
  );
}
