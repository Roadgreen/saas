"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ProfileForm() {
  const t = useTranslations('Settings.Profile');
  const tGlobal = useTranslations('Settings');

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('identity.title')}</CardTitle>
          <CardDescription>{t('identity.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('identity.name')}</Label>
            <Input id="name" placeholder="Ex: Le Camion Gourmand" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logo">{t('identity.logo')}</Label>
            <Input id="logo" type="file" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">{t('identity.color')}</Label>
            <div className="flex gap-2">
              <Input id="color" type="color" className="w-12 p-1 h-10" />
              <Input placeholder="#000000" className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('contact.title')}</CardTitle>
          <CardDescription>{t('contact.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="address">{t('contact.address')}</Label>
            <Input id="address" placeholder="123 Rue de la Paix, 75000 Paris" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">{t('contact.phone')}</Label>
              <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('contact.email')}</Label>
              <Input id="email" type="email" placeholder="contact@example.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('socials.title')}</CardTitle>
          <CardDescription>{t('socials.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="@monfoodtruck" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" placeholder="facebook.com/monfoodtruck" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">{t('socials.website')}</Label>
            <Input id="website" placeholder="https://www.monfoodtruck.com" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{tGlobal('save')}</Button>
      </div>
    </div>
  );
}
