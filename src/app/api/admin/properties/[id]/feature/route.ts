import { stackServerApp } from '@/lib/stack';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PATCH /api/admin/properties/[id]/feature
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;
    const { id } = await params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check for Admin Role
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (dbUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const updated = await prisma.property.update({
            where: { id },
            data: {
                featured: !property.featured,
            },
        });

        return NextResponse.json(updated);

    } catch (error: any) {
        console.error('Error toggling featured:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
