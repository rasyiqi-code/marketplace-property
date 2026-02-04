import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            title, description, price, location, address, bedrooms, bathrooms, area, type, status, imageUrl,
            landArea, certificate, condition, furnishing, floors, mapsEmbed, videoUrl, virtualTourUrl, facilities
        } = body;

        // Validation could be added here

        // 1. Deteksi Duplikasi Properti (Listing Berulang)
        // Cek apakah ada properti dengan Alamat DAN Koordinat yang sama (Map Pin Accuracy)
        if (!body.latitude || !body.longitude) {
            return NextResponse.json(
                { error: 'Koordinat Lokasi Wajib', message: 'Anda harus menandai lokasi properti di peta.' },
                { status: 400 }
            );
        }

        // Build duplicate check conditions
        const conditions: any[] = [
            {
                // Exact physical spec match at same address
                address: body.address,
                type: body.type,
                area: body.area,
                landArea: body.landArea || null,
            },
            {
                // Map Pin collision (Same coordinates & type)
                latitude: body.latitude,
                longitude: body.longitude,
                type: body.type,
            }
        ];

        // Only check image hash if provided
        if (body.imageHash) {
            conditions.push({
                propertyImages: {
                    some: {
                        hash: body.imageHash,
                    }
                }
            });
        }

        const existingProperty = await prisma.property.findFirst({
            where: {
                OR: conditions
            } as any
        });

        if (existingProperty) {
            return NextResponse.json(
                { error: 'Properti Serupa Sudah Terdaftar', message: 'Listing dengan spesifikasi, lokasi, atau gambar yang identik sudah ada di sistem kami. Harap hubungi admin jika menurut Anda ini bukan duplikat.' },
                { status: 409 }
            );
        }

        // Sinkronisasi data user dari Stack Auth ke database lokal
        // Mencegah Foreign Key Constraint error jika user belum ada di DB lokal
        await prisma.user.upsert({
            where: { id: userId },
            update: {
                email: user.primaryEmail || '',
                name: user.displayName,
            },
            create: {
                id: userId,
                email: user.primaryEmail || '',
                name: user.displayName,
                role: 'USER', // Default role
            },
        });


        const property = await prisma.property.create({
            data: {
                title,
                description,
                price: Number(price), // Ensure number
                location,
                address,
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                area: Number(area),
                type,
                status,
                images: imageUrl,
                userId: userId,
                featured: false,
                landArea: landArea ? Number(landArea) : null,
                certificate,
                condition,
                furnishing,
                floors: floors ? Number(floors) : null,
                latitude: body.latitude ? Number(body.latitude) : null,
                longitude: body.longitude ? Number(body.longitude) : null,
                propertyImages: {
                    create: {
                        url: body.imageUrl,
                        hash: body.imageHash || null,
                        isPrimary: true,
                    } as any
                },
                mapsEmbed: mapsEmbed || null,
                videoUrl: videoUrl || null,
                virtualTourUrl: virtualTourUrl || null,
                facilities: facilities && Array.isArray(facilities) ? {
                    create: await Promise.all(facilities.map(async (item: string) => {
                        if (item.startsWith('custom:')) {
                            const name = item.replace('custom:', '');
                            return {
                                facility: {
                                    connectOrCreate: {
                                        where: { name },
                                        create: { name, icon: '✨' }
                                    }
                                }
                            };
                        }
                        return {
                            facility: { connect: { id: item } }
                        };
                    }))
                } : undefined,
            } as any,
        });

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
