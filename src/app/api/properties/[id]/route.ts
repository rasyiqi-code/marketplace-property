import { stackServerApp } from '@/lib/stack';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PATCH /api/properties/[id] - Update Property
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

        const property = await prisma.property.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const isAdmin = dbUser?.role === 'ADMIN';
        const isOwner = property.userId === userId;

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized: You do not own this property' }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, price, location, address, bedrooms, bathrooms, area, type, status, imageUrl } = body;

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                price: price ? Number(price) : undefined,
                location,
                address,
                bedrooms: bedrooms ? Number(bedrooms) : undefined,
                bathrooms: bathrooms ? Number(bathrooms) : undefined,
                area: area ? Number(area) : undefined,
                type,
                status,
                images: imageUrl, // Update image if provided
            }
        });

        return NextResponse.json(updatedProperty);
    } catch (error: any) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/properties/[id] - Delete Property
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        const property = await prisma.property.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const isAdmin = dbUser?.role === 'ADMIN';
        const isOwner = property.userId === userId;

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized: You do not own this property' }, { status: 403 });
        }

        await prisma.property.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
