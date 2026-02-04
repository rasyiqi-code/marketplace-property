import prisma from '@/lib/prisma';
import { stackServerApp } from '@/lib/stack';

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
    try {
        // Ambil semua user dari Stack Auth
        const stackUsers = await stackServerApp.listUsers();

        // Ambil data lokal untuk info tambahan (seperti jumlah properti)
        const localData = await prisma.user.findMany({
            select: {
                id: true,
                _count: {
                    select: { properties: true },
                },
            },
        });

        const propertyCountMap = new Map(localData.map(d => [d.id, d._count.properties]));

        return stackUsers.map((user: any) => ({
            id: user.id,
            name: user.displayName || null,
            email: user.primaryEmail || '',
            role: (user.metadata?.role as string) || 'USER', // Ambil role dari metadata Stack
            createdAt: new Date(user.createdAt || Date.now()),
            _count: {
                properties: propertyCountMap.get(user.id) || 0,
            },
        }));
    } catch (error) {
        console.error('Error fetching users from Stack Auth:', error);
        // Fallback ke Prisma jika terjadi kesalahan (tapi tetap filter agar data riil)
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
        return users as UserDTO[];
    }
}
