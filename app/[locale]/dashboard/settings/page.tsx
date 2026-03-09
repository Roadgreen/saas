import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Clock, Users, Settings2, Sparkles } from "lucide-react";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { OperationsForm } from "@/components/settings/OperationsForm";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { ConfigForm } from "@/components/settings/ConfigForm";
import { IntelligenceForm } from "@/components/settings/IntelligenceForm";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  const t = await getTranslations('Settings');

  if (!user?.business) {
    return <div className="p-8">Please complete your business profile.</div>;
  }

  const settings = (user.business.settings as Record<string, unknown>) ?? {};
  const openingHours = user.business.openingHours as Record<string, any> | null;

  const locations = await prisma.location.findMany({
    where: { businessId: user.business.id },
    select: { id: true, name: true, latitude: true, longitude: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-5 h-auto">
            <TabsTrigger value="profile" className="flex flex-col gap-1.5 py-2.5 px-3 min-w-[80px] md:min-w-0">
              <Building2 className="h-5 w-5" />
              <span className="text-xs md:text-sm whitespace-nowrap">{t('tabs.profile')}</span>
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex flex-col gap-1.5 py-2.5 px-3 min-w-[80px] md:min-w-0">
              <Clock className="h-5 w-5" />
              <span className="text-xs md:text-sm whitespace-nowrap">{t('tabs.operations')}</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex flex-col gap-1.5 py-2.5 px-3 min-w-[80px] md:min-w-0">
              <Users className="h-5 w-5" />
              <span className="text-xs md:text-sm whitespace-nowrap">{t('tabs.team')}</span>
            </TabsTrigger>
            <TabsTrigger value="configuration" className="flex flex-col gap-1.5 py-2.5 px-3 min-w-[80px] md:min-w-0">
              <Settings2 className="h-5 w-5" />
              <span className="text-xs md:text-sm whitespace-nowrap">{t('tabs.configuration')}</span>
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex flex-col gap-1.5 py-2.5 px-3 min-w-[80px] md:min-w-0">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs md:text-sm whitespace-nowrap">{t('tabs.intelligence')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="operations" className="space-y-4">
          <OperationsForm initialOpeningHours={openingHours} initialLocations={locations} />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamSettings />
        </TabsContent>
        <TabsContent value="configuration" className="space-y-4">
          <ConfigForm initialSettings={{
            currency: (settings.currency as string) ?? 'EUR',
            vat: (settings.vat as number) ?? 20,
            stockAlerts: (settings.stockAlerts as boolean) ?? true,
            autoDeduct: (settings.autoDeduct as boolean) ?? true,
          }} />
        </TabsContent>
        <TabsContent value="intelligence" className="space-y-4">
          <IntelligenceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
