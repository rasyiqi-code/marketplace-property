import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        // Verify authorized user (Seller or Admin)
        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: { seller: true }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        const isSeller = transaction.sellerId === user.id;
        const isAdmin = dbUser?.role === 'ADMIN';

        if (!isSeller && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedTransaction);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
