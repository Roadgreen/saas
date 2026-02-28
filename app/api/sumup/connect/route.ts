import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSumUpAuthURL } from '@/lib/sumup';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.SUMUP_CLIENT_ID) {
    return NextResponse.json(
      { error: 'SumUp integration not configured. Add SUMUP_CLIENT_ID to your environment.' },
      { status: 503 }
    );
  }

  // Use NEXTAUTH_URL if set, otherwise derive from request origin
  if (!process.env.NEXTAUTH_URL) {
    const origin = new URL(req.url).origin;
    process.env.NEXTAUTH_URL = origin;
  }

  const state = crypto.randomBytes(16).toString('hex');
  const authURL = getSumUpAuthURL(state);
  return NextResponse.redirect(authURL);
}
