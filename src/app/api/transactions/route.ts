import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

// Helper DTO Mapper
const mapToDTO = (tx: Record<string, unknown>) => ({
    id: tx.id as string,
    amount: Number(tx.amount),
    status: tx.status as string,
    paymentProofUrl: tx.paymentProofUrl as string | null,
    propertyTitle: tx.propertyTitle as string,
    propertyId: tx.propertyId as string,
    buyerId: tx.buyerId as string,
    sellerId: tx.sellerId as string,
    createdAt: tx.createdAt as string,
    property: {
        title: (tx.property as Record<string, unknown>).title as string,
        images: (tx.property as Record<string, unknown>).images as string,
    },
    buyer: tx.buyer,
    seller: tx.seller,
});

export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ purchases: [], sales: [] });
        }

        const purchases = await prisma.transaction.findMany({
            where: { buyerId: user.id },
            include: {
                property: { select: { title: true, images: true } },
                buyer: { select: { name: true, email: true } },
                seller: { select: { name: true, email: true, bankName: true, bankAccount: true, bankHolder: true } as any },
            },
            orderBy: { createdAt: 'desc' },
        });

        const sales = await prisma.transaction.findMany({
            where: { sellerId: user.id },
            include: {
                property: { select: { title: true, images: true } },
                buyer: { select: { name: true, email: true } },
                seller: { select: { name: true, email: true, bankName: true, bankAccount: true, bankHolder: true } as any },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            purchases: purchases.map(mapToDTO),
            sales: sales.map(mapToDTO),
        });

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure buyer exists in local DB to satisfy FK constraints
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
                role: 'USER', // Default role
            },
        });

        const body = await request.json();
        const { propertyId } = body;

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Fallback for legacy data (properties without userId)
        let sellerId = property.userId;

        if (!sellerId) {
            const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
            sellerId = admin ? admin.id : (await prisma.user.findFirst())?.id || null;
        }

        if (!sellerId) {
            return NextResponse.json({ error: 'System Error: No valid seller found' }, { status: 500 });
        }

        if (sellerId === user.id) {
            return NextResponse.json({ error: 'Cannot buy your own property' }, { status: 400 });
        }

        // Create Transaction
        const transaction = await prisma.transaction.create({
            data: {
                amount: property.price,
                status: 'PENDING',
                propertyTitle: property.title,
                propertyId: property.id,
                buyerId: user.id,
                sellerId: sellerId,
            },
        });

        return NextResponse.json(transaction);

    } catch (error) {
        console.error('API Transaction Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
