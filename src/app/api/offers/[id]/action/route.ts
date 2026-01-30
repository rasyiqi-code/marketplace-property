import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { action, amount, message } = body; // action: ACCEPT, REJECT, COUNTER

        const offer = await prisma.offer.findUnique({
            where: { id },
            include: { property: true }
        });

        if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });

        // Logic check: Who can do what?
        const isBuyer = offer.userId === user.id;
        const isSeller = offer.property.userId === user.id;

        if (!isBuyer && !isSeller) return NextResponse.json({ error: 'Forbiden' }, { status: 403 });

        let newStatus = offer.status;

        // --- ACTION LOGIC ---
        if (action === 'REJECT') {
            newStatus = 'REJECTED';
            // Both can reject (Buyer cancels, Seller rejects)
        }

        else if (action === 'COUNTER') {
            if (!amount) return NextResponse.json({ error: 'Counter offer must have an amount' }, { status: 400 });
            newStatus = 'COUNTERED';
            // Update offer amount to the counter amount
            await prisma.offer.update({
                where: { id },
                data: { amount: amount }
            });
        }

        else if (action === 'ACCEPT') {
            newStatus = 'ACCEPTED';
            // Only the "other party" should accept. 
            // e.g. If status is PENDING (Buyer sent), Seller accepts.
            // If status is COUNTERED (Seller sent), Buyer accepts.
            // Simplified: Anyone involved can accept the current price to close the deal.

            // AUTO CREATE TRANSACTION
            await prisma.transaction.create({
                data: {
                    amount: offer.amount,
                    status: 'PENDING',
                    propertyTitle: offer.property.title,
                    propertyId: offer.propertyId,
                    buyerId: offer.userId,
                    sellerId: offer.property.userId || 'system', // Fallback handled in createTransaction logic usually, but here strict.
                }
            });
        }

        // Update Offer Status
        await prisma.offer.update({
            where: { id },
            data: { status: newStatus }
        });

        // Add History Log
        await prisma.offerHistory.create({
            data: {
                offerId: id,
                senderId: user.id,
                action: action,
                price: amount || offer.amount,
                message: message || `User ${action}ed the offer.`,
            }
        });

        return NextResponse.json({ success: true, status: newStatus });

    } catch (error: any) {
        console.error('Offer Action Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Get History
    const { id } = await params;
    const history = await prisma.offerHistory.findMany({
        where: { offerId: id },
        include: { sender: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(history);
}
