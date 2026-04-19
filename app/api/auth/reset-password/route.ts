/**
 * POST /api/auth/reset-password
 *
 * Validates { token, password }, updates the user's hashed password, and
 * nulls the reset token so the link can't be replayed. Rate-limited per IP
 * to slow brute-force guessing of tokens.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const Schema = z.object({
  token: z.string().min(32).max(128),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  // Token is 32 bytes → 64 hex chars; ~10^77 search space, so brute force
  // is impossible even without a rate limit. We still apply one to shed
  // obvious abuse and keep the DB quiet.
  const { limited, retryAfter } = rateLimit(`reset-password:${getClientIp(req)}`, {
    window: 10 * 60_000,
    max: 20,
  });
  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
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
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { token, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { resetPasswordToken: token },
  });

  if (!user || !user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < new Date()) {
    return NextResponse.json(
      { error: 'This reset link is invalid or has expired. Please request a new one.' },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    },
  });

  return NextResponse.json({ ok: true });
}
