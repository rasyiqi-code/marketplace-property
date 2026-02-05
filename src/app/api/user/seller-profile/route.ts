import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Fetch seller profile
export async function GET() {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        // Upsert user - create if not exists
        const userProfile = await prisma.user.upsert({
            where: { id: userId },
            update: {},  // Don't update anything if exists
            create: {
                id: userId,
                email: user.primaryEmail || '',
                name: user.displayName || null,
            },
            select: {
                phone: true,
                bio: true,
                company: true,
                accountType: true,
                photo: true,
            },
        });

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error('Error fetching seller profile:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Update seller profile
export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { phone, bio, company } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                phone: phone || null,
                bio: bio || null,
                company: company || null,
            },
        });

        return NextResponse.json({
            success: true,
            profile: {
                phone: updatedUser.phone,
                bio: updatedUser.bio,
                company: updatedUser.company,
                accountType: updatedUser.accountType,
            }
        });
    } catch (error) {
        console.error('Error updating seller profile:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
