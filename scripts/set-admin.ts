import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdmin(identifier: string) {
    try {
        const isEmail = identifier.includes('@');
        const whereClause = isEmail ? { email: identifier } : { id: identifier };

        const user = await prisma.user.update({
            where: whereClause,
            data: { role: 'ADMIN' },
        });
        console.log(`✓ Berhasil! User ${user.email} (ID: ${user.id}) sekarang adalah ADMIN.`);
    } catch (error) {
        console.error('Error: User tidak ditemukan di database lokal.');
        console.log('Tips: Pastikan user sudah pernah login ke aplikasi minimal satu kali.');
    } finally {
        await prisma.$disconnect();
    }
}

const identifier = process.argv[2];
if (!identifier) {
    console.log('Usage: npx ts-node scripts/set-admin.ts <email-or-id>');
    process.exit(1);
}

setAdmin(identifier);
