import { stackServerApp } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/packages - List all packages
export async function GET() {
    const user = await stackServerApp.getUser();

    // Basic Auth Check (In production, use robust middleware/CASL)
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check Admin Role
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true }
    });

    if (dbUser?.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const packages = await prisma.listingPackage.findMany({
        orderBy: { price: 'asc' }
    });

    return NextResponse.json(packages);
}

// POST /api/admin/packages - Create new package
export async function POST(request: Request) {
    const user = await stackServerApp.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true }
    });

    if (dbUser?.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, description, price, listingLimit, durationDays, type } = body;

        // Simple validation
        if (!name || !price || !listingLimit) {
            return NextResponse.json({ error: "Name, price, and limit are required" }, { status: 400 });
        }

        const newPackage = await prisma.listingPackage.create({
            data: {
                name,
                description,
                price: Number(price),
                listingLimit: Number(listingLimit),
                durationDays: Number(durationDays) || 30,
                type: type || 'SUBSCRIPTION'
            }
        });

        return NextResponse.json(newPackage, { status: 201 });
    } catch (error) {
        console.error('Error creating package:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
