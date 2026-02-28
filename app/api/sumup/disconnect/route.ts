import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { businessId: true },
  });

  if (!user?.businessId) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  await prisma.business.update({
    where: { id: user.businessId },
    data: {
      sumupAccessToken: null,
      sumupRefreshToken: null,
      sumupMerchantCode: null,
      sumupTokenExpiresAt: null,
      sumupConnectedAt: null,
    },
  });

  return NextResponse.json({ success: true });
}
