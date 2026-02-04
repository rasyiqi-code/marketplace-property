import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function GET() {
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

        // Helper DTO Mapper
        const mapToDTO = (tx: Record<string, unknown>) => ({
            id: tx.id as string,
            amount: Number(tx.amount),
            status: tx.status as string,
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

        return NextResponse.json(transactions.map(mapToDTO));

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
