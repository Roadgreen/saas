import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SumUpIntegration } from "@/components/settings/SumUpIntegration";
import { Plug } from "lucide-react";

export default async function IntegrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};

  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("Settings");

  const sumupSuccess = sp?.sumup_success === "1";
  const sumupError =
    typeof sp?.sumup_error === "string" ? sp.sumup_error : null;
  const sumupChoose = sp?.sumup_choose === "1";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Plug className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t("integrations.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("integrations.description")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
        <SumUpIntegration
          isConnected={!!user.business.sumupAccessToken}
          merchantCode={user.business.sumupMerchantCode}
          connectedAt={user.business.sumupConnectedAt}
          sumupSuccess={sumupSuccess}
          sumupError={sumupError}
          sumupChoose={sumupChoose}
        />
      </div>
    </div>
  );
}
