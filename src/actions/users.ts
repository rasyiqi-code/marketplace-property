'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export interface UserDTO {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    _count: {
        properties: number;
    };
}

export async function getUsers(): Promise<UserDTO[]> {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
                select: { properties: true },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return users;
}

export async function deleteUser(id: string) {
    // In a real app, verify Admin role here
    // Also handle related data gracefully (cascade or set null)

    // For now, we will just delete the user. 
    // Prisma schema might need Cascade on Delete for properties or we handle it manually.
    // Assuming schema default, it might fail if properties exist.

    await prisma.user.delete({
        where: { id },
    });

    revalidatePath('/admin/users');
}
