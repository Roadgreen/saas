import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function keepalive() {
  const email = 'keepalive@foodtracks.io';
  try {
    // Create fake user
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Keepalive',
        password: 'keepalive-noop',
      },
    });
    console.log(`[keepalive] Created user: ${user.id}`);

    // Delete it immediately
    await prisma.user.delete({ where: { email } });
    console.log('[keepalive] Deleted user. Supabase connection alive.');
  } catch (err) {
    // If user already exists from a failed previous run, clean up
    if (err.code === 'P2002') {
      await prisma.user.delete({ where: { email } });
      console.log('[keepalive] Cleaned up stale keepalive user.');
    } else {
      console.error('[keepalive] Error:', err.message);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

keepalive();
