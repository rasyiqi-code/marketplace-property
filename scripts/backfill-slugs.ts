import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function main() {
    const properties = await prisma.property.findMany({
        where: {
            OR: [
                { slug: null },
                { slug: '' }
            ]
        }
    });

    console.log(`Menemukan ${properties.length} properti tanpa slug.`);

    for (const property of properties) {
        let slug = generateSlug(property.title);

        // Cek duplikasi slug
        let existing = await prisma.property.findUnique({
            where: { slug }
        });

        let counter = 1;
        let baseSlug = slug;
        while (existing) {
            slug = `${baseSlug}-${counter}`;
            existing = await prisma.property.findUnique({
                where: { slug }
            });
            counter++;
        }

        await prisma.property.update({
            where: { id: property.id },
            data: { slug }
        });
        console.log(`Updated: ${property.title} -> ${slug}`);
    }

    console.log('Backfill selesai.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
