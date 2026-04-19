'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat, XCircle, Loader2 } from 'lucide-react';

function ResetPasswordInner() {
  const router = useRouter();
  const locale = useLocale();
  const isFr = locale === 'fr';
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingToken = !token;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(isFr ? 'Le mot de passe doit contenir au moins 8 caractères.' : 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error ||
            (isFr
              ? 'Ce lien est invalide ou a expiré. Veuillez en demander un nouveau.'
              : 'This link is invalid or has expired. Please request a new one.')
        );
      }
      router.push(`/${locale}/login?reset=success`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : isFr ? 'Une erreur est survenue.' : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0B08] p-4">
      <div className="w-full max-w-md mx-auto p-8 md:p-10 space-y-7 bg-[#1A1410] rounded-2xl shadow-xl border border-white/10">
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2"
            style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}
          >
            <ChefHat className="h-6 w-6" style={{ color: '#F97316' }} />
          </div>
          <h1 className="font-jakarta text-2xl font-bold tracking-tight text-white">
            {isFr ? 'Nouveau mot de passe' : 'Set new password'}
          </h1>
          <p className="text-sm text-white/60">
            {isFr
              ? 'Choisissez un nouveau mot de passe pour votre compte.'
              : 'Choose a new password for your account.'}
          </p>
        </div>

        {missingToken ? (
          <div className="p-4 text-sm text-red-300 bg-red-900/30 rounded-xl border border-red-700/50 flex items-start gap-2.5">
            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
            <span>
              {isFr
                ? 'Lien invalide. Veuillez demander un nouveau lien de réinitialisation.'
                : 'Invalid link. Please request a new reset link.'}
            </span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-red-300 bg-red-900/30 rounded-xl border border-red-700/50 flex items-start gap-2.5">
                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/80">
                {isFr ? 'Nouveau mot de passe' : 'New password'}
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
              />
              <p className="text-xs text-white/40">
                {isFr ? '8 caractères minimum' : 'At least 8 characters'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium text-white/80">
                {isFr ? 'Confirmer le mot de passe' : 'Confirm password'}
              </Label>
              <Input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl h-11 font-semibold text-base"
              disabled={loading || !password || !confirm}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isFr ? 'Enregistrement...' : 'Saving...'}
                </span>
              ) : isFr ? (
                'Réinitialiser mon mot de passe'
              ) : (
                'Reset my password'
              )}
            </Button>
          </form>
        )}

        <div className="text-center text-sm text-white/50">
          <Link
            href={`/${locale}/login`}
            className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
          >
            {isFr ? 'Retour à la connexion' : 'Back to sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
