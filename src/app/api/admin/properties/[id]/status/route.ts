import { stackServerApp } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;
    const { id } = await params;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify Admin Role
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (dbUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { featured, urgency, priority } = body;

        // Perform Update
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                featured: featured !== undefined ? featured : undefined,
                urgency: urgency ? urgency : undefined,
                priority: priority !== undefined ? Number(priority) : undefined,
            }
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error('Error updating property status:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
