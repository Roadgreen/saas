"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TeamSettings() {
  const t = useTranslations('Settings.Team');
  const tGlobal = useTranslations('Settings');
  
  // TODO: Replace with actual subscription check
  const isPro = false; 

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        
        {isPro ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {tGlobal('invite')}
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Lock className="h-4 w-4 text-amber-500" />
                {tGlobal('invite')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-amber-500" />
                  {t('premiumFeature')}
                </DialogTitle>
                <DialogDescription>
                  {t('upgradePrompt')}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                  {t('upgradeBtn')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-muted-foreground">john@example.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={i === 1 ? "default" : "secondary"}>
                    {i === 1 ? "Owner" : "Manager"}
                  </Badge>
                  <Button variant="ghost" size="sm">{tGlobal('edit')}</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
