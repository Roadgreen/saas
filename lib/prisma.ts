import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Build connection URL with pgbouncer params for Supabase pooler (port 6543)
function getDatasourceUrl(): string {
  let url = process.env.DATABASE_URL ?? '';
  if (url.includes(':6543/')) {
    if (!url.includes('pgbouncer=true')) {
      url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
    }
    if (!url.includes('prepare=false')) {
      url += (url.includes('?') ? '&' : '?') + 'prepare=false';
    }
  }
  return url;
}

function createPrismaClient(): PrismaClient {
  const url = getDatasourceUrl();
  return new PrismaClient({
    datasources: {
      db: { url },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
