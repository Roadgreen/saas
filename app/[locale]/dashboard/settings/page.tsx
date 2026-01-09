import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Clock, Users, Settings2, Sparkles } from "lucide-react";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { OperationsForm } from "@/components/settings/OperationsForm";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { ConfigForm } from "@/components/settings/ConfigForm";
import { IntelligenceForm } from "@/components/settings/IntelligenceForm";

export default function SettingsPage() {
  const t = useTranslations('Settings');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="profile" className="flex flex-col gap-2 py-3">
            <Building2 className="h-5 w-5" />
            <span>{t('tabs.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex flex-col gap-2 py-3">
            <Clock className="h-5 w-5" />
            <span>{t('tabs.operations')}</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex flex-col gap-2 py-3">
            <Users className="h-5 w-5" />
            <span>{t('tabs.team')}</span>
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex flex-col gap-2 py-3">
            <Settings2 className="h-5 w-5" />
            <span>{t('tabs.configuration')}</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex flex-col gap-2 py-3">
            <Sparkles className="h-5 w-5" />
            <span>{t('tabs.intelligence')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="operations" className="space-y-4">
          <OperationsForm />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamSettings />
        </TabsContent>
        <TabsContent value="configuration" className="space-y-4">
          <ConfigForm />
        </TabsContent>
        <TabsContent value="intelligence" className="space-y-4">
          <IntelligenceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
