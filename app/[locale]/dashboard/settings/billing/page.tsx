'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Crown,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Download,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Sparkles,
  Shield,
} from 'lucide-react';

type BillingStatus = {
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'TRIALING' | 'CANCELED' | 'PAST_DUE';
  subscriptionEndDate: string | null;
  trialEndsAt: string | null;
  trialDaysRemaining: number | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
};

type Invoice = {
  id: string;
  number: string | null;
  date: number;
  amount: number;
  currency: string;
  status: string | null;
  pdfUrl: string | null;
  hostedUrl: string | null;
};

export default function BillingPage() {
  const t = useTranslations('Billing');
  const locale = useLocale();
  const router = useRouter();

  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, invoicesRes] = await Promise.all([
        fetch('/api/billing/status'),
        fetch('/api/billing/invoices'),
      ]);
      if (statusRes.ok) {
        setBilling(await statusRes.json());
      }
      if (invoicesRes.ok) {
        const data = await invoicesRes.json();
        setInvoices(data.invoices ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch billing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'PRO', locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  const tierBadge = (tier: string) => {
    const styles: Record<string, string> = {
      FREE: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      PRO: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      ENTERPRISE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${styles[tier] ?? styles.FREE}`}
      >
        {tier === 'PRO' && <Crown className="h-3.5 w-3.5" />}
        {tier === 'ENTERPRISE' && <Shield className="h-3.5 w-3.5" />}
        {tier}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'text-emerald-400',
      TRIALING: 'text-blue-400',
      CANCELED: 'text-red-400',
      PAST_DUE: 'text-yellow-400',
    };
    const labels: Record<string, string> = {
      ACTIVE: t('statusActive'),
      TRIALING: t('statusTrialing'),
      CANCELED: t('statusCanceled'),
      PAST_DUE: t('statusPastDue'),
    };
    return (
      <span className={`text-sm font-medium ${styles[status] ?? 'text-gray-400'}`}>
        {labels[status] ?? status}
      </span>
    );
  };

  const formatDate = (dateStr: string | null | number) => {
    if (!dateStr) return '—';
    const d = typeof dateStr === 'number' ? new Date(dateStr * 1000) : new Date(dateStr);
    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/${locale}/dashboard/settings`)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="text-sm md:text-base text-gray-400">{t('description')}</p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1A1410] p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10">
              <CreditCard className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{t('currentPlan')}</h3>
              <p className="text-sm text-gray-400">{t('currentPlanDesc')}</p>
            </div>
          </div>
          {billing && tierBadge(billing.tier)}
        </div>

        {billing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </span>
              </div>
              {statusBadge(billing.status)}
            </div>

            {/* Start Date */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {t('startDate')}
                </span>
              </div>
              <span className="text-sm text-white">{formatDate(billing.createdAt)}</span>
            </div>

            {/* End Date or Trial */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {billing.status === 'TRIALING' ? t('trialEnds') : t('endDate')}
                </span>
              </div>
              {billing.status === 'TRIALING' && billing.trialDaysRemaining !== null ? (
                <div>
                  <span className="text-sm text-white">{formatDate(billing.trialEndsAt)}</span>
                  <span className="ml-2 text-xs font-medium text-blue-400">
                    {t('daysRemaining', { days: billing.trialDaysRemaining })}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-white">
                  {formatDate(billing.subscriptionEndDate)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {billing && (
          <div className="flex flex-wrap gap-3 pt-2">
            {billing.tier === 'FREE' ? (
              <button
                onClick={handleUpgrade}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors text-sm"
              >
                <Crown className="h-4 w-4" />
                {t('upgradePro')}
              </button>
            ) : (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-medium transition-colors text-sm disabled:opacity-50"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {t('manageSubscription')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1A1410] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10">
            <FileText className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t('paymentHistory')}</h3>
            <p className="text-sm text-gray-400">{t('paymentHistoryDesc')}</p>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{t('noInvoices')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('invoiceDate')}
                  </th>
                  <th className="text-left py-3 px-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('invoiceNumber')}
                  </th>
                  <th className="text-right py-3 px-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('invoiceAmount')}
                  </th>
                  <th className="text-center py-3 px-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('invoiceStatus')}
                  </th>
                  <th className="text-right py-3 px-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('invoiceActions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-300">{formatDate(inv.date)}</td>
                    <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                      {inv.number ?? '—'}
                    </td>
                    <td className="py-3 px-2 text-right text-white font-medium">
                      {formatAmount(inv.amount, inv.currency)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : inv.status === 'open'
                              ? 'bg-yellow-500/15 text-yellow-400'
                              : 'bg-gray-500/15 text-gray-400'
                        }`}
                      >
                        {inv.status === 'paid'
                          ? t('paid')
                          : inv.status === 'open'
                            ? t('pending')
                            : (inv.status ?? '—')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors text-xs"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Subscription */}
      {billing && billing.tier !== 'FREE' && billing.status !== 'CANCELED' && (
        <div className="rounded-2xl border border-red-500/10 bg-[#1A1410] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{t('cancelTitle')}</h3>
              <p className="text-sm text-gray-400">{t('cancelDesc')}</p>
            </div>
          </div>

          {!cancelConfirm ? (
            <button
              onClick={() => setCancelConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
              {t('cancelButton')}
            </button>
          ) : (
            <div className="space-y-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <p className="text-sm text-red-300">{t('cancelConfirmMessage')}</p>
              <div className="flex gap-3">
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('cancelConfirm')
                  )}
                </button>
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 transition-colors text-sm font-medium"
                >
                  {t('cancelKeep')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
