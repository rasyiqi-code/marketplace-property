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
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (userId === id) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (dbUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        const body = await request.json();
        const { role } = body;

        // 1. Update di Stack Auth metadata agar konsisten
        // @ts-expect-error - Menggunakan internal/admin update jika tersedia
        await stackServerApp.updateUser(id, {
            metadata: { role }
        });

        // 2. Update di database lokal
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
