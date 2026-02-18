import { stackServerApp, isUserAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST /api/admin/packages - Create new package
export async function POST(request: Request) {
    const user = await stackServerApp.getUser();

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

        // Basic validation
        if (!name || price === undefined || !listingLimit || !durationDays || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newPackage = await prisma.listingPackage.create({
            data: {
                name,
                description,
                price: Number(price),
                listingLimit: Number(listingLimit),
                durationDays: Number(durationDays),
                type
            }
        });

        return NextResponse.json(newPackage, { status: 201 });
    } catch (error) {
        console.error('Error creating package:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
