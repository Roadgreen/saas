import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { trackEvent } from '@/lib/tracking';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendVerificationEmail } from '@/lib/resend';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    businessName: z.string().min(2),
});

export async function POST(req: Request) {
    const { limited, retryAfter } = rateLimit(`register:${getClientIp(req)}`, { window: 60_000, max: 5 });
    if (limited) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
    }

    try {
        const body = await req.json();
        const { email, password, name, businessName } = RegisterSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a secure verification token (32 random bytes → hex string)
        const verificationToken = Array.from(
            crypto.getRandomValues(new Uint8Array(32))
        ).map(b => b.toString(16).padStart(2, '0')).join('');

        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Transaction to create Business and User
        const result = await prisma.$transaction(async (tx) => {
            const business = await tx.business.create({
                data: {
                    name: businessName,
                    locations: {
                        create: {
                            name: 'Main Location',
                        },
                    },
                },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'OWNER',
                    businessId: business.id,
                    verificationToken,
                    verificationTokenExpiry,
                },
            });

            return { user, business };
        });

        // Send verification email — must await so it completes before the
        // serverless function is torn down (setImmediate / fire-and-forget
        // silently drops emails on Vercel / edge runtimes).
        const appUrl =
            process.env.NEXTAUTH_URL ??
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        try {
            await sendVerificationEmail({
                to: email,
                name,
                verificationUrl: `${appUrl}/api/auth/verify-email?token=${verificationToken}`,
            });
        } catch (err) {
            console.error('[register] Failed to send verification email:', err);
            // Don't block registration if email fails — user can resend later
        }

        // Fire and forget analytics
        trackEvent('USER_REGISTERED', {
            userId: result.user.id,
            businessId: result.business.id,
            email: result.user.email,
        });

        return NextResponse.json({
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
