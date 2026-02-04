import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - List all upgrade requests (with optional status filter)
export async function GET(request: Request) {
    const user = await stackServerApp.getUser();

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
        where: { id: user?.id },
        select: { role: true },
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
        const requests = await (prisma.accountUpgradeRequest.findMany({
            where: status ? { status } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        }) as any);

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Error fetching upgrade requests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
