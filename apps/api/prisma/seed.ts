import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create test user
    const user = await prisma.user.upsert({
        where: { email: 'test@qrstudio.app' },
        update: {},
        create: {
            email: 'test@qrstudio.app',
            name: 'Test User',
        },
    });

    console.log('✅ Created test user:', user.email);

    // Create subscription for user
    const subscription = await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            plan: 'free',
            status: 'active',
            qrLimit: 5,
        },
    });

    console.log('✅ Created subscription:', subscription.plan);

    // Create sample QR codes
    const menuQr = await prisma.qrCode.create({
        data: {
            shortcode: nanoid(8),
            type: 'menu',
            name: 'Restaurant Menu',
            userId: user.id,
            payload: {
                restaurant_info: {
                    name: 'The Gourmet Kitchen',
                    description: 'Fine dining experience',
                },
                content: {
                    categories: [
                        {
                            id: 'cat_1',
                            name: 'Appetizers',
                            items: [
                                {
                                    id: 'item_1',
                                    name: 'Bruschetta',
                                    description: 'Toasted bread with tomatoes and basil',
                                    price: 8,
                                    currency: 'USD',
                                    available: true,
                                },
                            ],
                        },
                    ],
                    language: 'en',
                },
                styles: { primary_color: '#f97316' },
            },
            design: {
                dots: { color: '#000000', style: 'square' },
                background: { color: '#ffffff' },
                cornersSquare: { color: '#000000', style: 'square' },
                cornersDot: { color: '#000000', style: 'square' },
                margin: 1,
            },
        },
    });

    console.log('✅ Created menu QR code:', menuQr.shortcode);

    const urlQr = await prisma.qrCode.create({
        data: {
            shortcode: nanoid(8),
            type: 'url',
            name: 'Company Website',
            userId: user.id,
            payload: {
                url: 'https://example.com',
            },
            design: {
                dots: { color: '#1e40af', style: 'dots' },
                background: { color: '#ffffff' },
                cornersSquare: { color: '#1e40af', style: 'extra-rounded' },
                cornersDot: { color: '#1e40af', style: 'dot' },
                margin: 1,
            },
        },
    });

    console.log('✅ Created URL QR code:', urlQr.shortcode);

    // Create some sample scans
    const now = new Date();
    for (let i = 0; i < 10; i++) {
        await prisma.scan.create({
            data: {
                qrCodeId: menuQr.id,
                scannedAt: new Date(now.getTime() - i * 24 * 60 * 60 * 1000), // Last 10 days
                country: i % 2 === 0 ? 'United States' : 'United Kingdom',
                city: i % 2 === 0 ? 'New York' : 'London',
                device: i % 3 === 0 ? 'mobile' : i % 3 === 1 ? 'tablet' : 'desktop',
                os: i % 2 === 0 ? 'iOS' : 'Android',
                browser: i % 2 === 0 ? 'Safari' : 'Chrome',
            },
        });
    }

    console.log('✅ Created 10 sample scans');

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
