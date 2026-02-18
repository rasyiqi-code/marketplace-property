import { stackServerApp, isUserAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH /api/admin/packages/[id] - Update package
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await stackServerApp.getUser();
    const { id } = await params;

    // Auth Check
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, description, price, listingLimit, durationDays, type } = body;

        const updatedPackage = await prisma.listingPackage.update({
            where: { id },
            data: {
                name,
                description,
                price: price !== undefined ? Number(price) : undefined,
                listingLimit: listingLimit !== undefined ? Number(listingLimit) : undefined,
                durationDays: durationDays !== undefined ? Number(durationDays) : undefined,
                type
            }
        });

        return NextResponse.json(updatedPackage);
    } catch (error) {
        console.error('Error updating package:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/admin/packages/[id] - Delete package
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await stackServerApp.getUser();
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        await prisma.listingPackage.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error('Error deleting package:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
