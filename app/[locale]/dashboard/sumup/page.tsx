import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SumUpDailyWidget } from "@/components/dashboard/SumUpDailyWidget";
import { SumUpSalesList } from "@/components/dashboard/SumUpSalesList";
import { isCurrencyCode, formatCurrency, type CurrencyCode } from "@/lib/currency";
import {
  CreditCard,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  CheckCircle2,
  Link2,
  Calendar,
  Zap,
  ArrowRight,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function SumUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/login`);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });

  if (!user?.business) redirect(`/${locale}/dashboard`);

  const business = user.business;
  const bSettings = (business.settings as Record<string, unknown>) ?? {};
  const currency: CurrencyCode = isCurrencyCode(bSettings.currency) ? bSettings.currency : "EUR";
  const isConnected = !!business.sumupAccessToken;

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [transactions, internalOrders] = isConnected
    ? await Promise.all([
        prisma.sumUpTransaction.findMany({
          where: {
            businessId: business.id,
            status: { in: ["SUCCESSFUL", "PAID", "COMPLETED"] },
            timestamp: { gte: since30 },
          },
          include: { matchedRecipe: { select: { name: true } } },
          orderBy: { timestamp: "desc" },
          take: 500,
        }),
        prisma.order.findMany({
          where: { businessId: business.id, date: { gte: since30 } },
          select: { date: true, totalRevenue: true },
        }),
      ])
    : [[], []];

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
  const txCount = transactions.length;
  const matchedCount = transactions.filter((t) => t.matchedRecipe !== null).length;
  const matchRate = txCount > 0 ? Math.round((matchedCount / txCount) * 100) : 0;
  const avgTx = txCount > 0 ? totalRevenue / txCount : 0;

  const internalData = internalOrders.map((o) => ({
    date: o.date.toISOString().slice(0, 10),
    revenue: o.totalRevenue ?? 0,
  }));

  return (
    <div className="flex-1 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00B6FF]/10 border border-[#00B6FF]/20 shrink-0">
            <CreditCard className="h-5 w-5 text-[#00B6FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SumUp</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Synchronisation des paiements par terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connecté
                {business.sumupMerchantCode && (
                  <span className="text-green-500 font-mono ml-0.5">· {business.sumupMerchantCode}</span>
                )}
              </div>
              <Link
                href={`/${locale}/dashboard/settings?tab=integrations`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:bg-muted/50 transition-colors"
              >
                <Settings className="h-3 w-3" />
                Gérer
              </Link>
            </>
          ) : (
            <a
              href="/api/sumup/connect"
              className="flex items-center gap-2 text-sm font-medium text-white rounded-full px-4 py-2 transition-all hover:opacity-90"
              style={{ background: "#00B6FF" }}
            >
              <Link2 className="h-4 w-4" />
              Connecter SumUp
            </a>
          )}
        </div>
      </div>

      {!isConnected ? (
        /* ── NOT CONNECTED ── */
        <div className="grid gap-6 lg:grid-cols-2">
          {/* CTA hero */}
          <div className="dash-card rounded-2xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            {/* Background accent */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, #00B6FF 0%, transparent 60%)",
              }}
            />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#00B6FF]/20 bg-[#00B6FF]/8">
                <CreditCard className="h-7 w-7 text-[#00B6FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Connectez votre terminal SumUp</h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Synchronisez automatiquement vos ventes par carte avec FoodTracks. Vos recettes
                  sont matchées, votre stock déduit.
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  { icon: Zap, text: "Sync automatique des transactions" },
                  { icon: Target, text: "Matching recettes intelligent" },
                  { icon: BarChart3, text: "Comparaison SumUp vs ventes internes" },
                  { icon: Activity, text: "Statistiques en temps réel" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-5 w-5 rounded-md bg-[#00B6FF]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-3 w-3 text-[#00B6FF]" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="/api/sumup/connect"
              className="relative mt-6 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#00B6FF" }}
            >
              <Link2 className="h-4 w-4" />
              Connecter avec SumUp
              <ArrowRight className="h-4 w-4 ml-auto" />
            </a>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
              Comment ça marche
            </p>
            {[
              {
                step: "1",
                title: "Autorisez l'accès",
                desc: "Connectez-vous avec votre compte SumUp via OAuth sécurisé.",
                color: "bg-[#00B6FF]/10 text-[#00B6FF] border-[#00B6FF]/20",
              },
              {
                step: "2",
                title: "Configurez les correspondances",
                desc: "Associez vos produits SumUp à vos recettes FoodTracks.",
                color: "bg-orange-50 text-orange-600 border-orange-100",
              },
              {
                step: "3",
                title: "Synchronisez",
                desc: "Vos transactions sont importées et les stocks déduits automatiquement.",
                color: "bg-green-50 text-green-600 border-green-100",
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="dash-card rounded-xl p-4 flex items-start gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold shrink-0 ${color}`}
                >
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── CONNECTED ── */
        <>
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Revenue */}
            <div className="dash-card rounded-xl p-6 animate-card-in" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Revenus 30j
                </p>
                <div className="h-7 w-7 rounded-lg bg-[#00B6FF]/10 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-[#00B6FF]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#00B6FF] tabular-nums">
                {formatCurrency(totalRevenue, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">via SumUp</p>
            </div>

            {/* Transactions */}
            <div className="dash-card rounded-xl p-6 animate-card-in" style={{ animationDelay: "50ms" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Transactions
                </p>
                <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold tabular-nums">{txCount}</p>
              <p className="text-xs text-muted-foreground mt-1">30 derniers jours</p>
            </div>

            {/* Match rate */}
            <div className="dash-card rounded-xl p-6 animate-card-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Taux de match
                </p>
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                    matchRate >= 80
                      ? "bg-green-50"
                      : matchRate >= 50
                      ? "bg-amber-50"
                      : "bg-red-50"
                  }`}
                >
                  <Target
                    className={`h-3.5 w-3.5 ${
                      matchRate >= 80
                        ? "text-green-500"
                        : matchRate >= 50
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-2xl font-bold tabular-nums ${
                  matchRate >= 80
                    ? "text-green-600"
                    : matchRate >= 50
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {matchRate}%
              </p>
              <div className="mt-2 mb-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    matchRate >= 80
                      ? "bg-green-500"
                      : matchRate >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${matchRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {matchedCount}/{txCount} recettes identifiées
              </p>
            </div>

            {/* Avg transaction */}
            <div className="dash-card rounded-xl p-6 animate-card-in" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Panier moyen
                </p>
                <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <BarChart3 className="h-3.5 w-3.5 text-orange-500" />
                </div>
              </div>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(avgTx, currency)}</p>
              <p className="text-xs text-muted-foreground mt-1">par transaction</p>
            </div>
          </div>

          {/* Match rate alert if low */}
          {txCount > 0 && matchRate < 70 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
              <Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">
                  {txCount - matchedCount} transaction{txCount - matchedCount > 1 ? "s" : ""} sans recette associée
                </p>
                <p className="text-amber-600 text-xs mt-0.5">
                  Configurez les correspondances pour améliorer l&apos;analyse.{" "}
                  <Link
                    href={`/${locale}/dashboard/settings?tab=integrations`}
                    className="underline underline-offset-2 font-medium hover:text-amber-800"
                  >
                    Configurer →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Connected since */}
          {business.sumupConnectedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Connecté depuis le{" "}
              {new Date(business.sumupConnectedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}

          {/* Chart */}
          <SumUpDailyWidget
            isSumUpConnected={true}
            internalData={internalData}
            currency={currency}
            days={30}
          />

          {/* Transactions list */}
          {transactions.length > 0 ? (
            <SumUpSalesList transactions={transactions} currency={currency} />
          ) : (
            <div className="dash-card rounded-xl p-12 text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mx-auto">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-semibold">Aucune transaction ce mois-ci</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Synchronisez vos transactions SumUp ou insérez des données de test depuis les
                paramètres.
              </p>
              <Link
                href={`/${locale}/dashboard/settings?tab=integrations`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#00B6FF] hover:underline mt-2"
              >
                <Settings className="h-3.5 w-3.5" />
                Aller aux paramètres
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
