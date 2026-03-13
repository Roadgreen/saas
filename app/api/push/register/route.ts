import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { pushToken } = body;

    if (!pushToken || typeof pushToken !== 'string') {
      return NextResponse.json({ error: 'Push token is required' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { pushToken },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to register push token:', error);
    return NextResponse.json({ error: 'Failed to register push token' }, { status: 500 });
  }
}
