import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // In real app we check role again strictly, but for now we assume caller handles page protection or we can check DB role here.
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (dbUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const transactions = await prisma.transaction.findMany({
            include: {
                property: { select: { title: true, images: true } },
                buyer: { select: { name: true, email: true } },
                seller: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Helper DTO Mapper (duplicated for now, better in shared utils but keeping it simple)
        const mapToDTO = (tx: any) => ({
            id: tx.id,
            amount: Number(tx.amount),
            status: tx.status,
            propertyTitle: tx.propertyTitle,
            propertyId: tx.propertyId,
            buyerId: tx.buyerId,
            sellerId: tx.sellerId,
            createdAt: tx.createdAt,
            property: {
                title: tx.property.title,
                images: tx.property.images,
            },
            buyer: tx.buyer,
            seller: tx.seller,
        });

        return NextResponse.json(transactions.map(mapToDTO));

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
