'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ChefHat, CheckCircle2, XCircle, Loader2, ShieldCheck, CreditCard, X, ChevronDown } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

type AuthFormData = {
  email: string;
  password: string;
  name?: string;
  businessName?: string;
};

function makeAuthSchema(isFr: boolean) {
  return z.object({
    email: z.string().email(isFr ? 'Adresse email invalide' : 'Invalid email address'),
    password: z.string().min(8, isFr ? '8 caractères minimum' : 'At least 8 characters'),
    name: z.string().optional(),
    businessName: z.string().optional(),
  });
}

interface AuthFormProps {
  type: 'login' | 'register';
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan'); // e.g. "PRO" or "ENTERPRISE"
  const verified = searchParams.get('verified') === 'true';
  const resetSuccess = searchParams.get('reset') === 'success';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState(false);
  const { track } = useAnalytics();

  const isFr = locale === 'fr';

  // Funnel step 1: form became visible. Fires once per mount. Lets us
  // measure viewed → submitted → succeeded at each step instead of just
  // page_view → (nothing).
  useEffect(() => {
    track('form_view', { formName: type, plan: plan ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(makeAuthSchema(isFr)),
  });

  const handleOAuthSignIn = async (provider: string) => {
    setOauthLoading(provider);
    setError(null);
    // OAuth submit: the flow leaves the page before we'd see success, so we
    // only log the attempt here. Successful OAuth logins are attributed
    // via auth_login emitted from the callback side when sessions appear
    // on the next page load.
    track('form_submit', { formName: `${type}_oauth`, success: false, provider });
    try {
      await signIn(provider, {
        callbackUrl: `/${locale}/dashboard`,
      });
    } catch {
      const msg = isFr ? 'Erreur de connexion. Veuillez réessayer.' : 'Sign in failed. Please try again.';
      setError(msg);
      track('form_error', { formName: `${type}_oauth`, errorMessage: msg, provider, phase: 'server' });
      setOauthLoading(null);
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

    // Funnel step 2: user clicked submit. We emit success=false here; a
    // second form_submit fires with success=true only after the full flow
    // (API + auto-login) completes, giving us a clean "attempted → succeeded"
    // ratio.
    track('form_submit', { formName: type, success: false, plan: plan ?? null });

    try {
      if (type === 'register') {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Registration failed');
        }

        // Auto login after registration
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          throw new Error(signInResult.error);
        }

        // Funnel success — fire BEFORE navigation, sendBeacon on unload
        // will flush it. auth_register is the "north star" conversion event.
        track('auth_register', { plan: plan ?? null });
        track('form_submit', { formName: type, success: true, plan: plan ?? null });

        // If a plan was requested, launch Stripe checkout directly
        if (plan === 'PRO' || plan === 'ENTERPRISE') {
          const checkoutRes = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier: plan, locale }),
          });

          if (checkoutRes.ok) {
            const { url } = await checkoutRes.json();
            if (url) {
              window.location.href = url; // redirect to Stripe hosted checkout
              return;
            }
          }
          // If Stripe checkout fails, fall back to dashboard
        }

        router.push(`/${locale}/dashboard`);
      } else {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error('Invalid credentials');
        }

        track('auth_login', { method: 'credentials' });
        track('form_submit', { formName: type, success: true });

        router.push(`/${locale}/dashboard`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      track('form_error', {
        formName: type,
        errorMessage: message.slice(0, 200),
        phase: 'server',
      });
    } finally {
      setLoading(false);
    }
  };

  const isPlanRegister = type === 'register' && (plan === 'PRO' || plan === 'ENTERPRISE');

  return (
    <div className="w-full max-w-md mx-auto p-8 md:p-10 space-y-7 bg-[#1A1410] rounded-2xl shadow-xl border border-white/10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2" style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}>
          <ChefHat className="h-6 w-6" style={{ color: '#F97316' }} />
        </div>
        <h2 className="font-jakarta text-2xl font-bold tracking-tight text-white">
          {type === 'login'
            ? (isFr ? 'Connexion' : 'Sign In')
            : (isFr ? 'Démarrer mon essai gratuit' : 'Start my free trial')}
        </h2>
        {type === 'register' && (
          <p className="text-sm text-orange-600 font-medium">
            {isPlanRegister
              ? (isFr
                  ? `Essai gratuit ${plan === 'PRO' ? 'Pro' : 'Entreprise'} de 14 jours — sans carte bancaire`
                  : `14-day free ${plan === 'PRO' ? 'Pro' : 'Enterprise'} trial — no credit card required`)
              : (isFr
                  ? '14 jours gratuits — sans carte bancaire'
                  : '14 days free — no credit card required')}
          </p>
        )}
      </div>

      {type === 'register' && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-orange-500" />
            {isFr ? 'Sans carte bancaire' : 'No credit card'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
            {isFr ? '14 jours d’essai' : '14-day trial'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <X className="h-3.5 w-3.5 text-orange-500" />
            {isFr ? 'Annulation 1 clic' : '1-click cancel'}
          </span>
        </div>
      )}

      {verified && (
        <div className="p-4 text-sm text-green-300 bg-green-900/30 rounded-xl border border-green-700/50 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
          <span>{isFr ? 'Votre email a été vérifié avec succès ! Connectez-vous pour accéder à votre compte.' : 'Your email has been verified successfully! Sign in to access your account.'}</span>
        </div>
      )}

      {resetSuccess && type === 'login' && (
        <div className="p-4 text-sm text-green-300 bg-green-900/30 rounded-xl border border-green-700/50 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
          <span>{isFr ? 'Mot de passe réinitialisé. Connectez-vous avec votre nouveau mot de passe.' : 'Password reset. Sign in with your new password.'}</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-300 bg-red-900/30 rounded-xl border border-red-700/50 flex items-start gap-2.5">
          <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleOAuthSignIn('google')}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-white/15 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {oauthLoading === 'google' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {isFr ? 'Se connecter avec Google' : 'Sign in with Google'}
        </button>

        <button
          type="button"
          onClick={() => handleOAuthSignIn('apple')}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-white/15 bg-black text-white font-medium text-sm hover:bg-black/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {oauthLoading === 'apple' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <AppleIcon />
          )}
          {isFr ? 'Se connecter avec Apple' : 'Sign in with Apple'}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-sm text-white/40 font-medium">{isFr ? 'ou' : 'or'}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (fieldErrors) => {
          // Client-side validation failed — log each failing field so we can
          // see which ones trip users up most (typed email? short password?).
          for (const [field, err] of Object.entries(fieldErrors)) {
            track('form_error', {
              formName: type,
              field,
              errorMessage: (err?.message ?? 'invalid').toString().slice(0, 120),
              phase: 'validation',
            });
          }
        })}
        className="space-y-5"
      >
        {type === 'register' && showOptional && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white/80 flex items-center gap-2">
                {isFr ? 'Nom complet' : 'Full Name'}
                <span className="text-xs font-normal text-white/40">{isFr ? '(facultatif)' : '(optional)'}</span>
              </Label>
              <Input id="name" {...register('name')} placeholder="John Doe" autoComplete="name" className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium text-white/80 flex items-center gap-2">
                {isFr ? "Nom de l'établissement" : 'Business Name'}
                <span className="text-xs font-normal text-white/40">{isFr ? '(facultatif)' : '(optional)'}</span>
              </Label>
              <Input
                id="businessName"
                {...register('businessName')}
                placeholder="Joe's Food Truck"
                autoComplete="organization"
                className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
              />
              {errors.businessName && (
                <p className="text-sm text-red-500">
                  {errors.businessName.message}
                </p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="name@example.com"
            autoComplete="email"
            inputMode="email"
            className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-white/80">{isFr ? 'Mot de passe' : 'Password'}</Label>
            {type === 'login' && (
              <Link
                href={`/${locale}/forgot-password`}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
            autoComplete={type === 'register' ? 'new-password' : 'current-password'}
            className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {type === 'register' && !errors.password && (
            <p className="text-xs text-white/40">{isFr ? '8 caractères minimum' : 'At least 8 characters'}</p>
          )}
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {type === 'register' && !showOptional && (
          <button
            type="button"
            onClick={() => setShowOptional(true)}
            className="text-xs text-white/50 hover:text-white/80 inline-flex items-center gap-1 transition-colors"
          >
            <ChevronDown className="h-3 w-3" />
            {isFr ? 'Ajouter mon nom (facultatif)' : 'Add my name (optional)'}
          </button>
        )}

        <Button type="submit" className="w-full rounded-xl h-11 font-semibold text-base transition-all duration-300" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {isPlanRegister
                ? (isFr ? 'Création du compte...' : 'Creating account...')
                : (isFr ? 'Chargement...' : 'Loading...')}
            </span>
          ) : type === 'login' ? (
            isFr ? 'Se connecter' : 'Sign In'
          ) : (
            isFr ? 'Démarrer mon essai gratuit' : 'Start my free trial'
          )}
        </Button>

      </form>

      <div className="text-center text-sm text-white/50">
        {type === 'login' ? (
          <p>
            {isFr ? "Pas encore de compte ?" : "Don't have an account?"}{' '}
            <Link href={`/${locale}/register`} className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              {isFr ? "S'inscrire" : 'Register'}
            </Link>
          </p>
        ) : (
          <p>
            {isFr ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
            <Link href={`/${locale}/login`} className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              {isFr ? 'Se connecter' : 'Sign In'}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
