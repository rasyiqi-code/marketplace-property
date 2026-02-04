const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mapping = {
    'AcUnit': '❄️',
    'AddRoad': '🛣️',
    'WaterDrop': '💧',
    'Videocam': '📹',
    'DirectionsCar': '🚗',
    'Store': '🛒',
    'LocalHospital': '🏥',
    'School': '🏫',
    'Garage': '🚗',
    'FitnessCenter': '🏋️',
    'Security': '🛡️',
    'Pool': '🏊',
    'Park': '🌳',
    'LocalFireDepartment': '🔥'
};

async function main() {
    console.log('🚀 Memulai pembaruan ikon fasilitas...');

    const facilities = await prisma.facility.findMany();

    for (const facility of facilities) {
        const newIcon = mapping[facility.icon] || facility.icon;

        if (newIcon !== facility.icon) {
            await prisma.facility.update({
                where: { id: facility.id },
                data: { icon: newIcon }
            });
            console.log(`✅ Update ${facility.name}: ${facility.icon} -> ${newIcon}`);
        }
    }

    console.log('✨ Selesai memperbarui ikon fasilitas.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
