import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { merchantCode } = await req.json();
  if (!merchantCode || typeof merchantCode !== 'string') {
    return NextResponse.json({ error: 'merchantCode required' }, { status: 400 });
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
    data: { sumupMerchantCode: merchantCode },
  });

  return NextResponse.json({ ok: true, merchantCode });
}
