import { PrismaClient } from '@prisma/client';

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
