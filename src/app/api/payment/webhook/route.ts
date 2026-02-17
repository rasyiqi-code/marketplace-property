import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            order_id,
            transaction_status,
            fraud_status,
            status_code,
            gross_amount,
            signature_key
        } = body;

        // 1. Verify Signature
        const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
        const hashed = crypto
            .createHash('sha512')
            .update(order_id + status_code + gross_amount + serverKey)
            .digest('hex');

        if (hashed !== signature_key) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // 2. Find Order
        const order = await prisma.order.findUnique({
            where: { id: order_id },
            include: { package: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // Idempotency Check: prevent double processing
        if (order.status === 'PAID') {
            return NextResponse.json({ status: 'OK', message: 'Order already paid' });
        }

        // 3. Update Order Status & User Quota
        let newStatus = 'PENDING';

        if (transaction_status === 'capture') {
            if (fraud_status === 'challenge') {
                newStatus = 'CHALLENGE';
            } else if (fraud_status === 'accept') {
                newStatus = 'PAID';
            }
        } else if (transaction_status === 'settlement') {
            newStatus = 'PAID';
        } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
            newStatus = 'FAILED';
        } else if (transaction_status === 'pending') {
            newStatus = 'PENDING';
        }

        await prisma.order.update({
            where: { id: order_id },
            data: { status: newStatus }
        });

        // 4. If PAID, update User's listingLimit
        if (newStatus === 'PAID') {
            const user = await prisma.user.findUnique({
                where: { id: order.userId }
            });

            if (user) {
                // If it's a TOPUP, we add to the limit. 
                // If it's a SUBSCRIPTION, we usually set a fixed limit and expiry.
                // For simplicity in this implementation, we add the limit.

                const newLimit = user.listingLimit + order.package.listingLimit;

                // Set expiry if it's a subscription
                let expiryDate = user.packageExpiry;
                if (order.package.type === 'SUBSCRIPTION') {
                    const days = order.package.durationDays;
                    const now = new Date();

                    // Smart Extension: If current expiry is in future, add days to IT.
                    // If null or past, add days to NOW.
                    const basisDate = (user.packageExpiry && user.packageExpiry > now) ? user.packageExpiry : now;
                    expiryDate = new Date(basisDate.getTime() + (days * 24 * 60 * 60 * 1000));
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        listingLimit: newLimit,
                        packageExpiry: expiryDate
                    }
                });
            }
        }

        return NextResponse.json({ status: 'OK' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
