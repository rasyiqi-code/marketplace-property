import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

// Helper to map Offer to DTO
function mapOfferToDTO(offer: Record<string, unknown>) {
    return {
        id: offer.id as string,
        amount: Number(offer.amount),
        status: offer.status as string,
        propertyTitle: (offer.property as Record<string, unknown>).title as string,
        propertyId: offer.propertyId as string,
        buyerName: ((offer.user as Record<string, unknown>).name || (offer.user as Record<string, unknown>).email) as string,
        buyerId: offer.userId as string,
        sellerId: (offer.property as Record<string, unknown>).userId as string, // needed for permission checks
        createdAt: offer.createdAt as Date,
        historyCount: (offer.history as unknown[]).length,
        propertyImage: (offer.property as Record<string, unknown>).images ? ((offer.property as Record<string, unknown>).images as string).split(',')[0] : null,
    };
}

export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Ensure user exists in local DB (upsert)
        await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.primaryEmail || '',
                name: user.displayName || 'User',
                image: user.profileImageUrl || '',
            },
            create: {
                id: user.id,
                email: user.primaryEmail || '',
                name: user.displayName || 'User',
                image: user.profileImageUrl || '',
                role: 'USER',
            },
        });

        const body = await request.json();
        const { propertyId, amount, message } = body;

        if (!propertyId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        if (property.userId === user.id) return NextResponse.json({ error: 'Cannot make offer on your own property' }, { status: 400 });

        // Check for existing pending/countered offer
        const existingOffer = await prisma.offer.findFirst({
            where: {
                propertyId,
                userId: user.id,
                status: { in: ['PENDING', 'COUNTERED'] }
            }
        });

        if (existingOffer) {
            return NextResponse.json({ error: 'You already have an active negotiation for this property' }, { status: 400 });
        }

        // Create Offer
        const offer = await prisma.offer.create({
            data: {
                amount: amount,
                propertyId,
                userId: user.id,
                status: 'PENDING',
                history: {
                    create: {
                        senderId: user.id,
                        action: 'CREATE',
                        price: amount,
                        message: message || 'Memulai penawaran baru.',
                    }
                }
            }
        });

        return NextResponse.json(offer);

    } catch (error) {
        console.error('Create Offer Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const searchParams = new URL(request.url).searchParams;
        const type = searchParams.get('type') || 'sent'; // 'sent' (buyer) or 'received' (seller)

        let offers;

        if (type === 'sent') {
            // Offers made BY this user
            offers = await prisma.offer.findMany({
                where: { userId: user.id },
                include: {
                    property: { select: { title: true, images: true, userId: true } },
                    user: { select: { name: true, email: true } },
                    history: { select: { id: true } } // just to count
                },
                orderBy: { updatedAt: 'desc' }
            });
        } else {
            // Offers received FOR properties owned by this user
            offers = await prisma.offer.findMany({
                where: { property: { userId: user.id } },
                include: {
                    property: { select: { title: true, images: true, userId: true } },
                    user: { select: { name: true, email: true } },
                    history: { select: { id: true } }
                },
                orderBy: { updatedAt: 'desc' }
            });
        }

        return NextResponse.json(offers.map(mapOfferToDTO));

    } catch (error) {
        console.error('Get Offers Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
