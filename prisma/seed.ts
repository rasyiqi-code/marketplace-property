import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed data untuk ProEstate Marketplace
 * 
 * CATATAN: Dengan Stack Auth, user dibuat melalui Stack Auth dashboard/signup.
 * Seed ini hanya untuk Agent, Facilities, dan Properties.
 */
async function main() {
    // =========================================================================
    // AGENT USER (User dengan role Agent untuk seeding properti)
    // =========================================================================
    const agentUser = await prisma.user.upsert({
        where: { email: 'agent@proestate.com' },
        update: {},
        create: {
            id: 'seed-agent-id',
            name: 'Budi Santoso',
            email: 'agent@proestate.com',
            phone: '08123456789',
            bio: 'Agen properti berpengalaman 10+ tahun di Jakarta',
            company: 'ProEstate Realty',
            verified: true,
            accountType: 'AGENT',
            role: 'USER',
        } as any,
    });
    console.log('✓ Agent User created:', agentUser.email);

    // =========================================================================
    // FACILITIES (Master Data)
    // =========================================================================
    const facilitiesData = [
        { name: 'Keamanan 24 Jam', icon: 'Security', category: 'Keamanan' },
        { name: 'CCTV', icon: 'Videocam', category: 'Keamanan' },
        { name: 'Kolam Renang', icon: 'Pool', category: 'Olahraga' },
        { name: 'Gym/Fitness', icon: 'FitnessCenter', category: 'Olahraga' },
        { name: 'Taman', icon: 'Park', category: 'Umum' },
        { name: 'Carport', icon: 'DirectionsCar', category: 'Parkir' },
        { name: 'Garasi', icon: 'Garage', category: 'Parkir' },
        { name: 'AC', icon: 'AcUnit', category: 'Interior' },
        { name: 'Water Heater', icon: 'LocalFireDepartment', category: 'Interior' },
        { name: 'Bebas Banjir', icon: 'WaterDrop', category: 'Lingkungan' },
        { name: 'Akses Jalan Lebar', icon: 'AddRoad', category: 'Lingkungan' },
        { name: 'Dekat Sekolah', icon: 'School', category: 'Lokasi' },
        { name: 'Dekat Mall', icon: 'Store', category: 'Lokasi' },
        { name: 'Dekat Rumah Sakit', icon: 'LocalHospital', category: 'Lokasi' },
    ];

    for (const facility of facilitiesData) {
        await prisma.facility.upsert({
            where: { name: facility.name },
            update: {},
            create: facility,
        });
    }
    console.log('✓ Facilities created:', facilitiesData.length);

    // =========================================================================
    // PROPERTIES
    // =========================================================================
    const existingProperties = await prisma.property.count();

    if (existingProperties === 0) {
        const propertiesData = [
            {
                title: 'Rumah Mewah Modern di Pondok Indah',
                description: 'Rumah mewah dengan desain modern minimalis. Dilengkapi kolam renang pribadi, taman luas, dan smart home system. Lokasi premium di kawasan elite Pondok Indah.',
                price: 15000000000,
                location: 'Pondok Indah, Jakarta Selatan',
                address: 'Jl. Metro Pondok Indah No. 123',
                bedrooms: 5,
                bathrooms: 4,
                area: 450,
                landArea: 600,
                type: 'House',
                status: 'sale',
                images: '/images/property-1.jpg',
                featured: true,
                latitude: -6.2726,
                longitude: 106.7847,
                certificate: 'SHM',
                condition: 'Baru',
                furnishing: 'Semi-Furnished',
                floors: 2,
                views: 156,
            },
            {
                title: 'Apartemen Premium di Sudirman',
                description: 'Unit apartemen fully furnished dengan view city. Fasilitas lengkap: gym, kolam renang infinity, concierge 24 jam. Walking distance ke MRT.',
                price: 25000000,
                location: 'Sudirman, Jakarta Pusat',
                address: 'Sudirman Central Business District',
                bedrooms: 2,
                bathrooms: 1,
                area: 85,
                type: 'Apartment',
                status: 'rent',
                images: '/images/property-2.jpg',
                featured: true,
                latitude: -6.2180,
                longitude: 106.8223,
                condition: 'Baru',
                furnishing: 'Furnished',
                floors: 1,
                views: 243,
            },
            {
                title: 'Villa Asri di Bali',
                description: 'Villa dengan arsitektur tradisional Bali modern. View sawah dan gunung, private pool, cocok untuk investasi atau hunian liburan.',
                price: 8500000000,
                location: 'Ubud, Bali',
                address: 'Jl. Raya Ubud No. 45',
                bedrooms: 4,
                bathrooms: 3,
                area: 350,
                landArea: 800,
                type: 'Villa',
                status: 'sale',
                images: '/images/property-3.jpg',
                featured: true,
                latitude: -8.5069,
                longitude: 115.2625,
                certificate: 'SHM',
                condition: 'Bekas',
                furnishing: 'Furnished',
                floors: 2,
                views: 89,
            },
            {
                title: 'Rumah Cluster Minimalis di BSD',
                description: 'Rumah baru dalam cluster eksklusif. Keamanan 24 jam, one gate system, dekat dengan sekolah internasional dan mall.',
                price: 2800000000,
                location: 'BSD City, Tangerang Selatan',
                address: 'Cluster Navia, BSD City',
                bedrooms: 3,
                bathrooms: 2,
                area: 120,
                landArea: 150,
                type: 'House',
                status: 'sale',
                images: '/images/property-4.jpg',
                featured: false,
                latitude: -6.2997,
                longitude: 106.6426,
                certificate: 'SHM',
                condition: 'Baru',
                furnishing: 'Unfurnished',
                floors: 2,
                views: 67,
            },
            {
                title: 'Ruko Strategis di Kelapa Gading',
                description: 'Ruko 3 lantai di jalan utama. Cocok untuk usaha, kantor, atau investasi. Parkir luas, akses mudah.',
                price: 5500000000,
                location: 'Kelapa Gading, Jakarta Utara',
                address: 'Boulevard Raya Kelapa Gading',
                bedrooms: 0,
                bathrooms: 3,
                area: 280,
                landArea: 100,
                type: 'Ruko',
                status: 'sale',
                images: '/images/property-5.jpg',
                featured: false,
                latitude: -6.1544,
                longitude: 106.9131,
                certificate: 'SHGB',
                condition: 'Bekas',
                floors: 3,
                views: 45,
            },
            {
                title: 'Apartemen Studio Cozy di Menteng',
                description: 'Studio apartment fully furnished, desain interior modern. Lokasi strategis dekat area bisnis dan pusat kota.',
                price: 8000000,
                location: 'Menteng, Jakarta Pusat',
                address: 'The Residences at Menteng',
                bedrooms: 1,
                bathrooms: 1,
                area: 35,
                type: 'Apartment',
                status: 'rent',
                images: '/images/property-6.jpg',
                featured: false,
                latitude: -6.1950,
                longitude: 106.8358,
                condition: 'Baru',
                furnishing: 'Furnished',
                floors: 1,
                views: 112,
            },
        ];

        for (const prop of propertiesData) {
            await prisma.property.create({
                data: {
                    ...prop,
                    userId: agentUser.id,
                },
            });
        }
        console.log('✓ Properties created:', propertiesData.length);
    } else {
        console.log('✓ Properties already exist:', existingProperties);
    }

    console.log('\n🌱 Seed completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
