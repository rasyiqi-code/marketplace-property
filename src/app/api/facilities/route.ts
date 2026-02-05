import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const facilities = await prisma.facility.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(facilities);
    } catch (error) {
        console.error('Error fetching facilities:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
