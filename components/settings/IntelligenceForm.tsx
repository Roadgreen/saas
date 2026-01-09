"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function IntelligenceForm() {
  const t = useTranslations('Settings.Intelligence');
  const tGlobal = useTranslations('Settings');

  return (
    <div className="grid gap-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>{t('ai.title')}</CardTitle>
          </div>
          <CardDescription>{t('ai.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('ai.suggestions')}</Label>
              <p className="text-sm text-muted-foreground">{t('ai.suggestionsDesc')}</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('ai.menuGen')}</Label>
              <p className="text-sm text-muted-foreground">{t('ai.menuGenDesc')}</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('goals.title')}</CardTitle>
          <CardDescription>{t('goals.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t('goals.margin')}</Label>
              <span className="text-sm text-muted-foreground">70%</span>
            </div>
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t('goals.waste')}</Label>
              <span className="text-sm text-muted-foreground">&lt; 5%</span>
            </div>
            <Slider defaultValue={[5]} max={20} step={1} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{tGlobal('save')}</Button>
      </div>
    </div>
  );
}
