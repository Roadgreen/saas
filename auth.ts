import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
            }
            // Always refresh role and subscription from DB
            if (token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                    include: { business: true },
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    if (dbUser.business) {
                        token.businessId = dbUser.business.id;
                        token.subscriptionTier = dbUser.business.subscriptionTier;
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                if (token.role) {
                    session.user.role = token.role as string;
                }
                if (token.businessId) {
                    session.user.businessId = token.businessId as string;
                    session.user.subscriptionTier = token.subscriptionTier as string;
                }
            }
            return session;
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(8) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
});
