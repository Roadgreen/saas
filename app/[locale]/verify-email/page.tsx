'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const error = searchParams.get('error');
  const email = searchParams.get('email') ?? '';

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setResent(true);
    } finally {
      setResending(false);
    }
  };

  // ─── Error: invalid token ─────────────────────────────────────────────────
  if (error === 'invalid_token' || error === 'missing_token') {
    return (
      <Layout>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid link</h1>
        <p className="text-gray-500 mb-8">
          This verification link is invalid or has already been used.
        </p>
        <button
          onClick={() => router.push(`/${locale}/register`)}
          className="w-full py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          Create a new account
        </button>
      </Layout>
    );
  }

  // ─── Error: expired token ─────────────────────────────────────────────────
  if (error === 'expired_token') {
    return (
      <Layout>
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-6 w-6 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link expired</h1>
        <p className="text-gray-500 mb-8">
          This verification link has expired (valid 24 hours). We can send you a new one.
        </p>
        {resent ? (
          <div className="flex items-center gap-2 justify-center text-green-600 font-medium">
            <CheckCircle className="h-5 w-5" />
            New email sent!
          </div>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending || !email}
            className="w-full py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-60"
          >
            {resending ? 'Sending…' : 'Resend verification email'}
          </button>
        )}
      </Layout>
    );
  }

  // ─── Default: "check your inbox" state ───────────────────────────────────
  return (
    <Layout>
      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
        <Mail className="h-8 w-8 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
      <p className="text-gray-500 mb-2">
        We've sent a verification link to your email address.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Click the link in the email to activate your account. The link expires in 24 hours.
      </p>
      <div className="text-sm text-gray-400 space-y-1">
        <p>Didn't receive it? Check your spam folder.</p>
        {email && (
          <>
            {resent ? (
              <p className="text-green-600 font-medium flex items-center gap-1 justify-center">
                <CheckCircle className="h-4 w-4" /> New email sent!
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-orange-500 hover:underline disabled:opacity-60"
              >
                {resending ? 'Sending…' : 'Resend verification email'}
              </button>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-xl">🍽️</div>
          <span className="text-xl font-bold text-gray-900">FoodTracks</span>
        </div>
        {children}
      </div>
    </div>
  );
}
