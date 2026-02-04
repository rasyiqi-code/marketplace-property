                                                                                                                                                            import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST - Submit upgrade request
export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }                            

    try {
        const body = await request.json();
        const { requestedType, reason } = body;

        // Validasi requestedType
        if (!['AGENT', 'AGENCY'].includes(requestedType)) {
            return NextResponse.json({ error: 'Invalid requestedType. Must be AGENT or AGENCY' }, { status: 400 });
        } 

        // Upsert user - create if not exists
        const currentUser = await prisma.user.upsert({
            where: { id: userId },
            update: {},  // Don't update if exists
            create: {
                id: userId,
                email: user.primaryEmail || '',
                name: user.displayName || null,
            },
            select: { accountType: true },
        });

        // Check if user is already AGENT/AGENCY
        if (currentUser.accountType !== 'INDIVIDUAL') {
            return NextResponse.json({
                error: 'You are already an ' + currentUser.accountType
            }, { status: 400 });
        }

        // Check for existing pending request
        const existingRequest = await (prisma.accountUpgradeRequest.findFirst({
            where: {
                userId,
                status: 'PENDING',
            },
        }) as any);

        if (existingRequest) {
            return NextResponse.json({
                error: 'You already have a pending upgrade request'
            }, { status: 400 });
        }

        // Create upgrade request
        const upgradeRequest = await (prisma.accountUpgradeRequest.create({
            data: {
                userId,
                requestedType,
                currentType: currentUser.accountType,
                reason: reason || null,
                status: 'PENDING',
            },
        }) as any);

        return NextResponse.json({
            success: true,
            requestId: upgradeRequest.id,
            status: 'PENDING',
            message: 'Upgrade request submitted successfully. Please wait for admin approval.'
        });
    } catch (error) {
        console.error('Error creating upgrade request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET - Check current request status
export async function GET() {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const request = await (prisma.accountUpgradeRequest.findFirst({
            where: {
                userId,
                status: { in: ['PENDING', 'APPROVED', 'REJECTED'] },
            },
            orderBy: { createdAt: 'desc' },
        }) as any);

        if (!request) {
            return NextResponse.json({
                hasRequest: false,
                request: null
            });
        }

        return NextResponse.json({
            hasRequest: true,
            request: {
                id: request.id,
                requestedType: request.requestedType,
                status: request.status,
                createdAt: request.createdAt,
                adminNote: request.adminNote,
            }
        });
    } catch (error) {
        console.error('Error fetching upgrade request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
