import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

        const body = await request.json();
        const { bankName, bankAccount, bankHolder } = body;

        const updatedUser = await prisma.user.upsert({
            where: { id: user.id },
            update: { bankName, bankAccount, bankHolder },
            create: {
                id: user.id,
                email: user.primaryEmail || '',
                name: user.displayName || 'User',
                bankName,
                bankAccount,
                bankHolder
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
            select: { bankName: true, bankAccount: true, bankHolder: true }
        });

        return NextResponse.json(dbUser || {});
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
