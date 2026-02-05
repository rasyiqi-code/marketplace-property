import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

        const body = await request.json();
        const { whatsappMessage } = body;

        const updatedUser = await prisma.user.upsert({
            where: { id: user.id },
            update: { whatsappMessage },
            create: {
                id: user.id,
                email: user.primaryEmail || '',
                name: user.displayName || 'User',
                whatsappMessage
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { whatsappMessage: true }
        });

        return NextResponse.json(dbUser || { whatsappMessage: null });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
