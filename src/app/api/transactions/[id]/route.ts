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
        console.log('DEBUG: Current User ID:', user.id);

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
        const isBuyer = transaction.buyerId === user.id;

        // Bypass Admin berdasarkan User ID Stack Auth di .env.local
        const adminIds = process.env.ADMIN_IDS?.split(',') || [];
        const isAdmin = dbUser?.role === 'ADMIN' || adminIds.includes(user.id);

        // Logic check:
        // Buyer can update to WAITING_VERIFICATION (upload proof)
        // Seller/Admin can update to SUCCESS/CANCELLED/FAILED

        let updateData: any = { status };

        if (isBuyer && status === 'WAITING_VERIFICATION') {
            const { paymentProofUrl } = body;
            if (paymentProofUrl) updateData.paymentProofUrl = paymentProofUrl;
        } else if (!isSeller && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedTransaction);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
