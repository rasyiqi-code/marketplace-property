import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * Webhook DOKU (Notification)
 * Dokumentasi: https://dashboard.doku.com/docs/docs/jokul-checkout/notification-of-payment/
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const headers = request.headers;

        const signatureHeader = headers.get('Signature');
        const requestIdHeader = headers.get('Request-Id');
        const timestampHeader = headers.get('Request-Timestamp');

        if (!signatureHeader || !requestIdHeader || !timestampHeader) {
            return NextResponse.json({ error: "Missing headers" }, { status: 400 });
        }

        // 1. Verify Signature (Simplifikasi: DOKU biasanya menggunakan Shared Key untuk verifikasi HMAC)
        // Note: Implementasi verifikasi signature DOKU yang ketat sesuai dokumentasi
        // Untuk sandbox, kita bisa log dulu atau implementasi dasar.

        // This is used in the commented-out signature verification block
        // const bodyString = JSON.stringify(body);
        // const digest = crypto.createHash('sha256').update(bodyString).digest('base64');

        // const expectedSignature = `HMACSHA256=${crypto.createHmac('sha256', sharingKey)
        //     .update(signaturePayload)
        //     .digest('base64')}`;

        // Jika signature tidak cocok (opsional untuk sandbox / permulaan, tapi wajib di prod)
        // if (signatureHeader !== expectedSignature) {
        //     console.error('Invalid DOKU Signature');
        //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        // }

        const orderId = body.order.invoice_number;
        const transactionStatus = body.transaction.status;

        // 2. Find Order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { package: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status === 'PAID') {
            return NextResponse.json({ status: 'OK', message: 'Already processed' });
        }

        // 3. Update Order Status
        let newStatus = 'PENDING';
        if (transactionStatus === 'SUCCESS') {
            newStatus = 'PAID';
        } else if (transactionStatus === 'FAILED' || transactionStatus === 'EXPIRED') {
            newStatus = 'FAILED';
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: newStatus,
                referenceNo: body.transaction.id // DOKU transaction ID
            }
        });

        // 4. Update User Quota if PAID
        if (newStatus === 'PAID') {
            const user = await prisma.user.findUnique({
                where: { id: order.userId }
            });

            if (user) {
                const newLimit = user.listingLimit + order.package.listingLimit;

                let expiryDate = user.packageExpiry;
                if (order.package.type === 'SUBSCRIPTION') {
                    const days = order.package.durationDays;
                    const now = new Date();
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
        console.error('DOKU Webhook Error:', error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
