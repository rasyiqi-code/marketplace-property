import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { bankName, bankAccount, bankHolder } = body;

        const updatedUser = await prisma.user.upsert({
            where: { id: user.id },
            update: { bankName, bankAccount, bankHolder } as any,
            create: {
                id: user.id,
                email: user.primaryEmail || '',
                name: user.displayName || 'User',
                bankName,
                bankAccount,
                bankHolder
            } as any
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
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { bankName: true, bankAccount: true, bankHolder: true } as any
        });

        return NextResponse.json(dbUser || {});
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
