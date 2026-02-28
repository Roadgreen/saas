'use client';

import { useState } from 'react';
import { Mail, X, CheckCircle } from 'lucide-react';

interface Props {
  email: string;
}

export function EmailVerificationBanner({ email }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  if (dismissed) return null;

  const handleResend = async () => {
    setResending(true);
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-sm">
      <Mail className="h-4 w-4 shrink-0 text-amber-500" />
      <span className="flex-1">
        <strong>Verify your email address</strong> — check your inbox at{' '}
        <span className="font-medium">{email}</span> to fully secure your account.
      </span>
      {resent ? (
        <span className="flex items-center gap-1 text-green-700 font-medium shrink-0">
          <CheckCircle className="h-4 w-4" /> Sent!
        </span>
      ) : (
        <button
          onClick={handleResend}
          disabled={resending}
          className="shrink-0 font-semibold underline underline-offset-2 hover:text-amber-900 disabled:opacity-60"
        >
          {resending ? 'Sending…' : 'Resend'}
        </button>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded p-0.5 hover:bg-amber-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
