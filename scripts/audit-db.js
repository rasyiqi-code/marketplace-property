const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const props = await prisma.property.findMany({
            take: 10
        });
        console.log('--- DATABASE AUDIT ---');
        console.log('Total Properties:', props.length);
        props.forEach(p => {
            console.log(`ID: ${p.id} | Slug: ${p.slug} | Status: ${p.status} | Title: ${p.title}`);
        });
    } catch (e) {
        console.error('Error Audit:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
