import { NextResponse } from 'next/server';
import webPush from 'web-push';
import { stackServerApp, isUserAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { PushSubscription } from '@prisma/client';

webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, message, url, userId } = await request.json();

    try {
        let subscriptions;

        if (userId) {
            subscriptions = await prisma.pushSubscription.findMany({
                where: { userId },
            });
        } else {
            // Send to all (Caution in production!)
            subscriptions = await prisma.pushSubscription.findMany();
        }

        const payload = JSON.stringify({
            title,
            body: message,
            url,
        });

        const notifications = subscriptions.map((sub: PushSubscription) => {
            return webPush.sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    },
                },
                payload
            ).catch((err) => {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log('Subscription has expired or is no longer valid: ', sub.endpoint);
                    return prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } });
                }
                console.error('Error sending notification:', err);
            });
        });

        await Promise.all(notifications);

        return NextResponse.json({ success: true, count: notifications.length });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
