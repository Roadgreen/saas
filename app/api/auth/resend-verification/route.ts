import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendVerificationEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  // Rate limit: max 3 resend attempts per 10 minutes per IP
  const { limited, retryAfter } = rateLimit(`resend-verification:${getClientIp(req)}`, {
    window: 10 * 60_000,
    max: 3,
  });
  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  const { email } = await req.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return 200 — don't reveal whether the email exists
  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true });
  }

  // Generate a fresh token
  const verificationToken = Array.from(
    crypto.getRandomValues(new Uint8Array(32))
  ).map(b => b.toString(16).padStart(2, '0')).join('');

  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken, verificationTokenExpiry },
  });

  const appUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    await sendVerificationEmail({
      to: user.email,
      name: user.name ?? user.email,
      verificationUrl: `${appUrl}/api/auth/verify-email?token=${verificationToken}`,
    });
  } catch (err) {
    console.error('[resend-verification] email failed:', err);
    // Still return 200 — don't reveal whether sending succeeded
  }

  return NextResponse.json({ ok: true });
}
