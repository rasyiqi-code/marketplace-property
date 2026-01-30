import { stackServerApp } from '@/lib/stack';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PATCH /api/admin/users/[id]/role
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;
    const { id } = await params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (dbUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { role } = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        });

        return NextResponse.json(updatedUser);

    } catch (error: any) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
