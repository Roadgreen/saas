'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Link2,
  Link2Off,
  RefreshCw,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard,
  TrendingUp,
  Zap,
  Store,
  ChevronRight,
  FlaskConical,
  Trash2,
  GitMerge,
} from 'lucide-react';
import { SumUpMappingPanel } from '@/components/settings/SumUpMappingPanel';
import { toast } from 'sonner';

interface SumUpMembership {
  merchant_code: string;
  business_name: string;
  country: string;
  currency: string;
  is_test_account?: boolean;
  roles?: string[];
}

interface SumUpIntegrationProps {
  isConnected: boolean;
  merchantCode?: string | null;
  connectedAt?: Date | null;
  sumupSuccess?: boolean;
  sumupError?: string | null;
  sumupChoose?: boolean;
}

export function SumUpIntegration({
  isConnected,
  merchantCode,
  connectedAt,
  sumupSuccess,
  sumupError,
  sumupChoose,
}: SumUpIntegrationProps) {
  const t = useTranslations('SumUp');
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showMappings, setShowMappings] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  // Merchant selection state
  const [showMerchantPicker, setShowMerchantPicker] = useState(sumupChoose ?? false);
  const [memberships, setMemberships] = useState<SumUpMembership[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [selectingMerchant, setSelectingMerchant] = useState<string | null>(null);

  useEffect(() => {
    if (showMerchantPicker || (isConnected && !merchantCode)) {
      fetchMemberships();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMemberships = async () => {
    setLoadingMerchants(true);
    try {
      const res = await fetch('/api/sumup/memberships');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMemberships(data.memberships ?? []);
      setShowMerchantPicker(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to load merchants');
    } finally {
      setLoadingMerchants(false);
    }
  };

  const handleSelectMerchant = async (code: string) => {
    setSelectingMerchant(code);
    try {
      const res = await fetch('/api/sumup/select-merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantCode: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t('merchantSelected'));
      setShowMerchantPicker(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to select merchant');
    } finally {
      setSelectingMerchant(null);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sumup/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 30 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t('syncSuccess', { synced: data.synced, matched: data.matched }));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? t('syncError'));
    } finally {
      setSyncing(false);
    }
  };

  const handleSeedTestData = async () => {
    if (!confirm('Insérer ~90 transactions de test basées sur tes recettes ? (Les précédentes données de test seront remplacées)')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/sumup/seed-test-data', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`✅ ${data.seeded} transactions de test insérées`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? 'Erreur lors du seed');
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteTestData = async () => {
    if (!confirm('Supprimer toutes les transactions de test ?')) return;
    try {
      const res = await fetch('/api/sumup/seed-test-data', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.deleted} transactions de test supprimées`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? 'Erreur');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(t('disconnectConfirm'))) return;
    setDisconnecting(true);
    try {
      const res = await fetch('/api/sumup/disconnect', { method: 'POST' });
      if (!res.ok) throw new Error();
      toast.success(t('disconnected'));
      router.refresh();
    } catch {
      toast.error(t('disconnectError'));
    } finally {
      setDisconnecting(false);
    }
  };

  const renderMerchantPicker = () => (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t('chooseMerchant')}</p>
      {loadingMerchants ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('loadingMerchants')}
        </div>
      ) : memberships.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{t('noMerchants')}</p>
      ) : (
        <div className="space-y-2">
          {memberships.map((m) => (
            <div key={m.merchant_code}>
              <button
                onClick={() => !m.is_test_account && handleSelectMerchant(m.merchant_code)}
                disabled={selectingMerchant !== null || !!m.is_test_account}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B6FF]/10">
                    <Store className="h-4 w-4 text-[#00B6FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      {m.business_name || m.merchant_code}
                      {m.is_test_account && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-medium">
                          SANDBOX
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {m.merchant_code}{m.country ? ` · ${m.country}` : ''}{m.currency ? ` · ${m.currency}` : ''}
                    </p>
                  </div>
                </div>
                {selectingMerchant === m.merchant_code ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {m.is_test_account && (
                <p className="text-[11px] text-amber-600 px-1 mt-1">
                  Compte sandbox — transactions accessibles uniquement avec des identifiants SumUp sandbox (<code className="text-[10px]">cc_sandbox_</code>).
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="dash-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00B6FF]/10 border border-[#00B6FF]/20">
            <CreditCard className="h-5 w-5 text-[#00B6FF]" />
          </div>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              SumUp
              {isConnected && merchantCode ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t('connected')}
                </Badge>
              ) : isConnected && !merchantCode ? (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                  {t('chooseMerchantBadge')}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {t('notConnected')}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {t('description')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* OAuth callback feedback */}
        {sumupSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {t('connectSuccess')}
          </div>
        )}
        {sumupError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t('connectError')}: {sumupError}
          </div>
        )}

        {isConnected && merchantCode && !showMerchantPicker ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-xs text-muted-foreground">{t('merchantCode')}</p>
                <p className="font-mono font-medium text-sm mt-0.5">{merchantCode}</p>
              </div>
              {connectedAt && (
                <div className="rounded-lg bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{t('connectedSince')}</p>
                  <p className="font-medium text-sm mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(connectedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {[
                { icon: TrendingUp, label: t('featureDaily') },
                { icon: Zap, label: t('featureMatch') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-green-500" />
                  {label}
                </div>
              ))}
            </div>

            {isDev && (
              <div className="flex gap-2 p-3 rounded-lg border border-dashed border-amber-300 bg-amber-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSeedTestData}
                  disabled={seeding}
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100 text-xs"
                >
                  {seeding
                    ? <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    : <FlaskConical className="h-3 w-3 mr-1" />}
                  Seed données de test
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteTestData}
                  className="text-red-500 hover:bg-red-50 text-xs"
                  title="Supprimer les transactions de test"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Product → Recipe mapping panel */}
            {showMappings ? (
              <div className="rounded-lg border border-border bg-muted/10 p-4">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <GitMerge className="h-4 w-4 text-primary" />
                  Correspondances produits SumUp → recettes
                </p>
                <SumUpMappingPanel onClose={() => setShowMappings(false)} />
              </div>
            ) : (
              <button
                onClick={() => setShowMappings(true)}
                className="w-full flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/10 px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <GitMerge className="h-4 w-4" />
                  Configurer les correspondances produits → recettes
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSync} disabled={syncing} className="flex-1">
                {syncing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('syncing')}</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" />{t('syncNow')}</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchMemberships()}
                disabled={loadingMerchants}
                title={t('changeMerchant')}
              >
                {loadingMerchants
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Store className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {disconnecting
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Link2Off className="h-4 w-4" />}
              </Button>
            </div>
          </>
        ) : isConnected && (!merchantCode || showMerchantPicker) ? (
          renderMerchantPicker()
        ) : (
          <>
            <div className="space-y-2">
              {[
                { icon: TrendingUp, label: t('featureDaily') },
                { icon: Zap, label: t('featureMatch') },
                { icon: Calendar, label: t('featureHistory') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-blue-500" />
                  {label}
                </div>
              ))}
            </div>

            <a
              href="/api/sumup/connect"
              style={{ backgroundColor: '#00B6FF', color: '#ffffff' }}
              className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
            >
              <Link2 className="h-4 w-4" />
              {t('connectBtn')}
            </a>
            <p className="text-xs text-muted-foreground text-center">
              {t('oauthNote')}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
