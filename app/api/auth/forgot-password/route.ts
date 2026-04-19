/**
 * POST /api/auth/forgot-password
 *
 * Accepts an email, generates a single-use reset token (1 h expiry), and
 * emails a /reset-password link. Always returns 200 regardless of whether
 * the email maps to a real user — this prevents account enumeration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendPasswordResetEmail } from '@/lib/resend';

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  // Layered rate limit: IP (loose) + email (tight). Residential proxy pools
  // can rotate IPs but not the target address, so email-keyed limit is the
  // one that actually blocks inbox flooding.
  const ipLimit = rateLimit(`forgot-password-ip:${getClientIp(req)}`, { window: 10 * 60_000, max: 10 });
  if (ipLimit.limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    // Still return 200 to avoid revealing validation outcomes publicly.
    return NextResponse.json({ ok: true });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const emailLimit = rateLimit(`forgot-password-email:${email}`, { window: 10 * 60_000, max: 3 });
  if (emailLimit.limited) {
    // Silently succeed — we still don't want to leak whether the email exists.
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Constant-time-ish: always respond 200 with the same shape whether the
  // user exists or not. We skip DB writes + send when no user matches.
  if (user) {
    const token = Array.from(
      crypto.getRandomValues(new Uint8Array(32))
    ).map(b => b.toString(16).padStart(2, '0')).join('');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 h

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: expiry,
      },
    });

    const appUrl =
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const locale = user.locale ?? 'fr';
    const resetUrl = `${appUrl}/${locale}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (err) {
      console.error('[forgot-password] email failed:', err);
      // Still return 200 — no leak. User can retry; rate limit protects us.
    }
  }

  return NextResponse.json({ ok: true });
}
