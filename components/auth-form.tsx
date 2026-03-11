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

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan'); // e.g. "PRO" or "ENTERPRISE"
  const verified = searchParams.get('verified') === 'true';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

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
    <div className="w-full max-w-md p-8 md:p-10 space-y-7 bg-white rounded-2xl shadow-xl border border-gray-100/80">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2" style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}>
          <ChefHat className="h-6 w-6" style={{ color: '#F97316' }} />
        </div>
        <h2 className="font-jakarta text-2xl font-bold tracking-tight text-gray-900">
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        {isPlanRegister && (
          <p className="text-sm text-orange-600 font-medium">
            14-day free {plan === 'PRO' ? 'Pro' : 'Enterprise'} trial — no credit card required
          </p>
        )}
      </div>

      {verified && (
        <div className="p-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-200 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
          <span>{locale === 'fr' ? 'Votre email a été vérifié avec succès ! Connectez-vous pour accéder à votre compte.' : 'Your email has been verified successfully! Sign in to access your account.'}</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2.5">
          <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {type === 'register' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input id="name" {...register('name')} placeholder="John Doe" className="input-premium rounded-xl h-11" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">Business Name</Label>
              <Input
                id="businessName"
                {...register('businessName')}
                placeholder="Joe's Food Truck"
                className="input-premium rounded-xl h-11"
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
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="name@example.com"
            className="input-premium rounded-xl h-11"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="input-premium rounded-xl h-11"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-xl h-11 font-semibold text-base transition-all duration-300" disabled={loading}>
          {loading
            ? (isPlanRegister ? 'Creating account...' : 'Loading...')
            : type === 'login'
            ? 'Sign In'
            : isPlanRegister
            ? 'Start my free trial'
            : 'Create Account'}
        </Button>

      </form>

      <div className="text-center text-sm text-gray-500">
        {type === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href={`/${locale}/register`} className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              Register
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href={`/${locale}/login`} className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
