const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- TESTING SLUG FILTER ---');
        const slugToTest = 'villa-asri-di-bali';
        const p = await prisma.property.findFirst({
            where: { slug: slugToTest }
        });
        if (p) {
            console.log('SUCCESS: Found property with slug:', p.slug);
        } else {
            console.log('FAILURE: Property not found, but query worked.');
        }
    } catch (e) {
        console.error('CRITICAL ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
