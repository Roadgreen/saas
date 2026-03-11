import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      businessId?: string;
      subscriptionTier?: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    businessId?: string;
    subscriptionTier?: string;
    role?: string;
  }
}
