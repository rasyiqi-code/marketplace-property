import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { createDokuCheckoutSession } from '@/lib/doku';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { packageId, paymentMethod } = await request.json();

        if (!packageId || !paymentMethod) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Get Package Details
        const listingPackage = await prisma.listingPackage.findUnique({
            where: { id: packageId }
        });

        if (!listingPackage) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }

        // 2. Create Order in DB
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                packageId: listingPackage.id,
                amount: listingPackage.price,
                status: 'PENDING',
                paymentMethod: paymentMethod, // 'DOKU' or 'MANUAL'
            }
        });

        // 3. Handle Payment Method
        if (paymentMethod === 'DOKU') {
            try {
                const dokuSession = await createDokuCheckoutSession({
                    id: order.id,
                    amount: Number(listingPackage.price),
                    customerName: user.displayName || 'User',
                    customerEmail: user.primaryEmail || '',
                    items: [{
                        id: listingPackage.id,
                        name: listingPackage.name,
                        price: Number(listingPackage.price),
                        quantity: 1
                    }]
                });

                // Update order with reference from DOKU if any (DOKU Checkout returns an URL usually)
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        referenceNo: dokuSession.response.payment.payment_url, // For DOKU Checkout, payment_url is the target
                        snapUrl: dokuSession.response.payment.payment_url // Keep snapUrl for UI compatibility if needed
                    }
                });

                return NextResponse.json({
                    orderId: order.id,
                    paymentUrl: dokuSession.response.payment.payment_url
                });
            } catch (dokuError) {
                console.error('DOKU Session Error:', dokuError);
                return NextResponse.json({ error: "Gagal menghubungkan ke layanan pembayaran DOKU" }, { status: 500 });
            }
        }

        // For MANUAL
        return NextResponse.json({
            orderId: order.id,
            message: "Order manual berhasil dibuat. Silakan transfer ke rekening yang tersedia."
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
