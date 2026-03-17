'use client';

import { useState } from 'react';
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
import { ChefHat, CheckCircle2, XCircle } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  businessName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const isFr = locale === 'fr';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const handleOAuthSignIn = async (provider: string) => {
    setOauthLoading(provider);
    setError(null);
    try {
      await signIn(provider, {
        callbackUrl: `/${locale}/dashboard`,
      });
    } catch {
      setError(isFr ? 'Erreur de connexion. Veuillez réessayer.' : 'Sign in failed. Please try again.');
      setOauthLoading(null);
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

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

        router.push(`/${locale}/dashboard`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
            : (isFr ? 'Créer un compte' : 'Create Account')}
        </h2>
        {isPlanRegister && (
          <p className="text-sm text-orange-600 font-medium">
            {isFr
              ? `Essai gratuit ${plan === 'PRO' ? 'Pro' : 'Entreprise'} de 14 jours — sans carte bancaire`
              : `14-day free ${plan === 'PRO' ? 'Pro' : 'Enterprise'} trial — no credit card required`}
          </p>
        )}
      </div>

      {verified && (
        <div className="p-4 text-sm text-green-300 bg-green-900/30 rounded-xl border border-green-700/50 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
          <span>{isFr ? 'Votre email a été vérifié avec succès ! Connectez-vous pour accéder à votre compte.' : 'Your email has been verified successfully! Sign in to access your account.'}</span>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {type === 'register' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white/80">{isFr ? 'Nom complet' : 'Full Name'}</Label>
              <Input id="name" {...register('name')} placeholder="John Doe" className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium text-white/80">{isFr ? "Nom de l'établissement" : 'Business Name'}</Label>
              <Input
                id="businessName"
                {...register('businessName')}
                placeholder="Joe's Food Truck"
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
            className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-white/80">{isFr ? 'Mot de passe' : 'Password'}</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="input-premium rounded-xl h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-xl h-11 font-semibold text-base transition-all duration-300" disabled={loading}>
          {loading
            ? (isPlanRegister
                ? (isFr ? 'Création du compte...' : 'Creating account...')
                : (isFr ? 'Chargement...' : 'Loading...'))
            : type === 'login'
            ? (isFr ? 'Se connecter' : 'Sign In')
            : isPlanRegister
            ? (isFr ? 'Démarrer mon essai gratuit' : 'Start my free trial')
            : (isFr ? 'Créer un compte' : 'Create Account')}
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
