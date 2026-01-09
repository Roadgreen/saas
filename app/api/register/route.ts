import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { trackEvent } from '@/lib/tracking';

const prisma = new PrismaClient();

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    businessName: z.string().min(2),
});

export async function POST(req: Request) {
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
                },
            });

            return { user, business };
        });

        // Fire and forget tracking
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
