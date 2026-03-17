import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Apple from 'next-auth/providers/apple';
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
        async signIn({ user, account }) {
            // For OAuth providers, auto-link or auto-create the user
            if (account && account.provider !== 'credentials') {
                const email = user.email;
                if (!email) return false;

                // Check if a user with this email already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                    include: { accounts: true },
                });

                if (existingUser) {
                    // Check if this OAuth account is already linked
                    const existingAccount = existingUser.accounts.find(
                        (a) => a.provider === account.provider && a.providerAccountId === account.providerAccountId
                    );

                    if (!existingAccount) {
                        // Link the OAuth account to the existing user
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token as string | undefined,
                                access_token: account.access_token as string | undefined,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token as string | undefined,
                                session_state: account.session_state as string | undefined,
                            },
                        });
                    }

                    // Mark email as verified for OAuth users
                    if (!existingUser.emailVerified) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { emailVerified: new Date() },
                        });
                    }
                } else {
                    // Create a new user + business for OAuth sign-ups
                    await prisma.$transaction(async (tx) => {
                        const business = await tx.business.create({
                            data: {
                                name: user.name ? `${user.name}'s Business` : 'My Business',
                                locations: {
                                    create: { name: 'Main Location' },
                                },
                            },
                        });

                        const newUser = await tx.user.create({
                            data: {
                                email,
                                password: '', // OAuth users have no password
                                name: user.name || null,
                                image: user.image || null,
                                role: 'OWNER',
                                businessId: business.id,
                                emailVerified: new Date(),
                            },
                        });

                        await tx.account.create({
                            data: {
                                userId: newUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token as string | undefined,
                                access_token: account.access_token as string | undefined,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token as string | undefined,
                                session_state: account.session_state as string | undefined,
                            },
                        });
                    });
                }
            }

            return true;
        },
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
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        Apple({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(8) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    if (!user.password) return null; // OAuth-only user, no password
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
});
