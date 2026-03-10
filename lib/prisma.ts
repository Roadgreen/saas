import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl() {
  let url = process.env.DATABASE_URL ?? '';
  if (url.includes(':6543/')) {
    const separator = url.includes('?') ? '&' : '?';
    if (!url.includes('pgbouncer=true')) {
      url = `${url}${separator}pgbouncer=true`;
    }
    if (!url.includes('prepare=false')) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}prepare=false`;
    }
  }
  return url;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
