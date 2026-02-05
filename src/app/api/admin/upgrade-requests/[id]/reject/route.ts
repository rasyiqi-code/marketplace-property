import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST - Reject upgrade request
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

        if (!adminNote) {
            return NextResponse.json({
                error: 'adminNote is required when rejecting a request'
            }, { status: 400 });
        }

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
                status: 'REJECTED',
                adminNote,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Request rejected'
        });
    } catch (error) {
        console.error('Error rejecting upgrade request:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal server error"
        }, { status: 500 });
    }
}
