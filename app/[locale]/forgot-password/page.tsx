'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // We always show the same success screen regardless of whether the
      // email matches a real user — the API does the same to prevent
      // account enumeration.
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
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
            {isFr ? 'Mot de passe oublié' : 'Forgot password'}
          </h1>
          <p className="text-sm text-white/60">
            {isFr
              ? 'Entrez votre email. Si un compte existe, vous recevrez un lien de réinitialisation.'
              : 'Enter your email. If an account exists, you\u2019ll receive a reset link.'}
          </p>
        </div>

        {submitted ? (
          <div className="p-4 text-sm text-green-300 bg-green-900/30 rounded-xl border border-green-700/50 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
            <span>
              {isFr
                ? "Si un compte existe pour cette adresse, vous allez recevoir un email de réinitialisation dans les prochaines minutes. Pensez à vérifier vos spams."
                : 'If an account exists for this address, you\u2019ll get a reset email in the next few minutes. Check your spam folder too.'}
            </span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                inputMode="email"
                className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl h-11 font-semibold text-base"
              disabled={loading || !email}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isFr ? 'Envoi...' : 'Sending...'}
                </span>
              ) : isFr ? (
                "Envoyer le lien de réinitialisation"
              ) : (
                'Send reset link'
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
