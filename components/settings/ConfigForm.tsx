"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ConfigForm() {
  const t = useTranslations('Settings.Configuration');
  const tGlobal = useTranslations('Settings');

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
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('stock.autoDeduct')}</Label>
              <p className="text-sm text-muted-foreground">{t('stock.autoDeductDesc')}</p>
            </div>
            <Switch defaultChecked />
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
              <Select defaultValue="EUR">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
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
              <Input type="number" placeholder="20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{tGlobal('save')}</Button>
      </div>
    </div>
  );
}
