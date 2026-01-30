import { stackServerApp } from '@/lib/stack';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, price, location, address, bedrooms, bathrooms, area, type, status, imageUrl } = body;

        // Validation could be added here

        // Assign to a random agent for now or handle agent linkage differently
        const agent = await prisma.agent.findFirst();
        if (!agent) {
            return NextResponse.json({ error: 'System Error: No agent profile found' }, { status: 500 });
        }

        const property = await prisma.property.create({
            data: {
                title,
                description,
                price: Number(price), // Ensure number
                location,
                address,
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                area: Number(area),
                type,
                status,
                images: imageUrl,
                agentId: agent.id,
                userId: userId,
                featured: false,
            },
        });

        return NextResponse.json(property, { status: 201 });
    } catch (error: any) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
