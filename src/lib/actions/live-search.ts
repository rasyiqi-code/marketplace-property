'use server';

import prisma from '@/lib/prisma';
import { Property } from '@prisma/client';

export type SearchResult = Omit<Pick<Property, 'id' | 'title' | 'slug' | 'location' | 'price' | 'images' | 'status'>, 'price'> & { price: number };

export async function searchProperties(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
        const properties = await prisma.property.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                    { address: { contains: query, mode: 'insensitive' } },
                ],
                status: { in: ['sale', 'rent'] } // Only active properties
            },
            select: {
                id: true,
                title: true,
                slug: true,
                location: true,
                price: true,
                images: true,
                status: true,
            },
            take: 5,
            orderBy: {
                views: 'desc' // Prioritize popular items
            }
        });

        // Convert Decimal to Number for serialization to Client Components
        return properties.map(prop => ({
            ...prop,
            price: Number(prop.price)
        }));
    } catch (error) {
        console.error('Live search error:', error);
        return [];
    }
}
