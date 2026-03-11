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
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        {isPlanRegister && (
          <p className="text-sm text-orange-600 font-medium mt-1">
            14-day free {plan === 'PRO' ? 'Pro' : 'Enterprise'} trial — no credit card required
          </p>
        )}
      </div>

      {verified && (
        <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
          ✅ {locale === 'fr' ? 'Votre email a été vérifié avec succès ! Connectez-vous pour accéder à votre compte.' : 'Your email has been verified successfully! Sign in to access your account.'}
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === 'register' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} placeholder="John Doe" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                {...register('businessName')}
                placeholder="Joe's Food Truck"
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? (isPlanRegister ? 'Creating account…' : 'Loading...')
            : type === 'login'
            ? 'Sign In'
            : isPlanRegister
            ? 'Start my free trial →'
            : 'Create Account'}
        </Button>

        {type === 'login' && (
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={async () => {
              setLoading(true);
              try {
                const result = await signIn('credentials', {
                  email: 'admin@snaptrack.com',
                  password: 'admin123',
                  redirect: false,
                });
                if (result?.error) throw new Error('Demo login failed');
                router.push(`/${locale}/dashboard`);
              } catch {
                setError('Demo login failed');
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            🔑 Demo Admin
          </Button>
        )}
      </form>

      <div className="text-center text-sm">
        {type === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href={`/${locale}/register`} className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
