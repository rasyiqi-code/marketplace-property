import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { snap } from '@/lib/midtrans';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        const { packageId } = await request.json();

        // 1. Get Package Details
        const listingPackage = await prisma.listingPackage.findUnique({
            where: { id: packageId }
        });

        if (!listingPackage) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // 2. Create Order in DB
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                packageId: listingPackage.id,
                amount: listingPackage.price,
                status: 'PENDING',
            }
        });

        // 3. Request Midtrans Snap Token
        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: Number(listingPackage.price),
            },
            customer_details: {
                first_name: user.displayName || 'User',
                email: user.primaryEmail || '',
            },
            item_details: [{
                id: listingPackage.id,
                price: Number(listingPackage.price),
                quantity: 1,
                name: listingPackage.name,
            }],
        };

        const transaction = await snap.createTransaction(parameter);

        // 4. Update Order with Snap Token
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                snapToken: transaction.token,
                snapUrl: transaction.redirect_url,
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error in checkout:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        }, { status: 500 });
    }
}
