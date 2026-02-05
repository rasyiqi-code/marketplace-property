import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST - Approve upgrade request
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: requestId } = await params;
    const user = await stackServerApp.getUser();

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
        where: { id: user?.id },
        select: { role: true },
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { adminNote } = body;

        // Get the upgrade request
        const upgradeRequest = await prisma.accountUpgradeRequest.findUnique({
            where: { id: requestId },
        });

        if (!upgradeRequest) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        if (upgradeRequest.status !== 'PENDING') {
            return NextResponse.json({
                error: `Request already ${upgradeRequest.status.toLowerCase()}`
            }, { status: 400 });
        }

        // Update request status
        await prisma.accountUpgradeRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                adminNote: adminNote || 'Request approved',
            },
        });

        // Update user accountType and set verified
        await prisma.user.update({
            where: { id: upgradeRequest.userId },
            data: {
                accountType: upgradeRequest.requestedType,
                verified: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: `User upgraded to ${upgradeRequest.requestedType} and verified`
        });
    } catch (error) {
        console.error('Error approving upgrade request:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal server error"
        }, { status: 500 });
    }
}
