import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@snaptrack.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log('Admin user already exists.');
        return;
    }

    const business = await prisma.business.create({
        data: {
            name: 'SnapTrack Demo HQ',
            subscriptionTier: 'ENTERPRISE',
            locations: {
                create: {
                    name: 'Main Location',
                },
            },
        },
    });

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Admin Demo',
            role: 'OWNER',
            businessId: business.id,
        },
    });

    console.log(`Created admin user: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
