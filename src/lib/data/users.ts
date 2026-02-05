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

        return stackUsers.map((user) => ({
            id: user.id,
            name: user.displayName || null,
            email: user.primaryEmail || '',
            role: ((user as unknown as { metadata?: { role?: string } }).metadata?.role as string) || 'USER',
            createdAt: new Date((user as unknown as { createdAt?: string | number }).createdAt || Date.now()),
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

export interface UserStatus {
    listingLimit: number;
    propertyCount: number;
    accountType: 'INDIVIDUAL' | 'AGENT' | 'AGENCY';
    isPremium: boolean;
}

export async function getCurrentUserStatus(userId: string): Promise<UserStatus> {
    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            listingLimit: true,
            accountType: true,
            _count: {
                select: { properties: true }
            }
        }
    });

    if (!dbUser) {
        return {
            listingLimit: 1,
            propertyCount: 0,
            accountType: 'INDIVIDUAL',
            isPremium: false
        };
    }

    return {
        listingLimit: dbUser.listingLimit,
        propertyCount: dbUser._count.properties,
        accountType: dbUser.accountType as 'INDIVIDUAL' | 'AGENT' | 'AGENCY',
        isPremium: dbUser.accountType !== 'INDIVIDUAL' || dbUser.listingLimit > 1
    };
}
