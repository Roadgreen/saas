import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/resend';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  const appUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  if (!token) {
    return NextResponse.redirect(`${appUrl}/en/verify-email?error=missing_token`);
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) {
    return NextResponse.redirect(`${appUrl}/en/verify-email?error=invalid_token`);
  }

  if (user.emailVerified) {
    // Already verified — redirect to dashboard directly
    return NextResponse.redirect(`${appUrl}/en/dashboard`);
  }

  if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
    return NextResponse.redirect(`${appUrl}/en/verify-email?error=expired_token&email=${encodeURIComponent(user.email)}`);
  }

  // Mark email as verified and clear token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  // Send welcome email (fire and forget)
  const locale = req.nextUrl.searchParams.get('locale') ?? 'en';
  setImmediate(async () => {
    try {
      await sendWelcomeEmail({
        to: user.email,
        name: user.name ?? user.email,
        dashboardUrl: `${appUrl}/${locale}/dashboard`,
      });
    } catch (err) {
      console.error('[verify-email] Failed to send welcome email:', err);
    }
  });

  return NextResponse.redirect(`${appUrl}/${locale}/dashboard?verified=true`);
}
