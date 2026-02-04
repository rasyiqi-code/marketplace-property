import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const props = await prisma.property.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            status: true
        },
        take: 10
    });
    console.log(JSON.stringify(props, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
