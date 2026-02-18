import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
    PropertyDTO,
    SearchFilters
} from './types';
import { mapToPropertyDTO } from './basic-queries';

/**
 * Mendapatkan daftar properti berdasarkan filter pencarian
 */
export async function getProperties(filters: SearchFilters): Promise<PropertyDTO[]> {
    const { query, type, location, minPrice, maxPrice, status, bedrooms } = filters;
    const where: Prisma.PropertyWhereInput = {};

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
        ];
    }

    if (location) {
        where.location = { contains: location, mode: 'insensitive' };
    }

    if (type && type !== 'Semua Tipe') {
        where.type = type;
    }

    if (status && status !== 'active') { // Assuming 'active' is default or 'all' equivalent. Check usage.
        where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter: Prisma.DecimalFilter = {};
        if (minPrice !== undefined) priceFilter.gte = minPrice;
        if (maxPrice !== undefined) priceFilter.lte = maxPrice;
        where.price = priceFilter;
    }

    if (bedrooms) {
        where.bedrooms = { gte: bedrooms };
    }

    const properties = await prisma.property.findMany({
        where,
        orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' }
        ],
    });

    return properties.map(mapToPropertyDTO);
}

/**
 * Mendapatkan properti unggulan (featured)
 */
export async function getFeaturedProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: { featured: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

/**
 * Mendapatkan properti populer berdasarkan jumlah view
 */
export async function getPopularProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        take: 6,
        orderBy: { views: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

/**
 * Mendapatkan properti terbaru
 */
export async function getNewProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

/**
 * Mendapatkan properti terkait berdasarkan tipe
 */
export async function getRelatedProperties(currentId: string, type: string, limit: number = 3): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: {
            type,
            NOT: { id: currentId },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}
