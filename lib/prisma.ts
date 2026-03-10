import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Ensure pgbouncer params are in DATABASE_URL before any PrismaClient reads it
if (process.env.DATABASE_URL?.includes(':6543/')) {
  let url = process.env.DATABASE_URL;
  if (!url.includes('pgbouncer=true')) {
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }
  if (!url.includes('prepare=false')) {
    url += (url.includes('?') ? '&' : '?') + 'prepare=false';
  }
  process.env.DATABASE_URL = url;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
