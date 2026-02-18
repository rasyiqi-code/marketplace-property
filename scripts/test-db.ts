import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        console.log('Connecting to database...');
        const result = await prisma.$queryRaw`SELECT 1 as connected`;
        console.log('Database connection successful:', result);
    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
