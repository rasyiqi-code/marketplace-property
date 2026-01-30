import { stackServerApp } from '@/lib/stack';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PropertyDTO {
    id: string;
    title: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: 'sale' | 'rent';
    imageUrl: string;
    featured: boolean;
}

export interface PropertyDetailDTO extends PropertyDTO {
    description: string;
    address: string;
    userId: string | null;
    agent: {
        name: string;
        email: string;
        phone: string;
        photo: string | null;
    };
}

function formatPrice(price: number, status: string): string {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    });

    const formatted = formatter.format(price);
    return status === 'rent' ? `${formatted} / thn` : formatted;
}

export async function getUserProperties(userId: string): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
    }));
}

export async function getPropertyById(id: string): Promise<PropertyDetailDTO | null> {
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            agent: true,
        },
    });

    if (!property) return null;

    return {
        id: property.id,
        title: property.title,
        price: formatPrice(Number(property.price), property.status),
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        type: property.type,
        status: property.status as 'sale' | 'rent',
        imageUrl: property.images,
        featured: property.featured,
        description: property.description,
        address: property.address,
        userId: property.userId,
        agent: property.agent ? {
            name: property.agent.name,
            email: property.agent.email,
            phone: property.agent.phone,
            photo: property.agent.photo,
        } : {
            name: 'ProEstate Agent',
            email: 'support@proestate.com',
            phone: '+6281234567890',
            photo: null,
        },
    };
}

export interface DashboardStats {
    totalProperties: number;
    totalViews: number;
    totalInquiries: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return {
            totalProperties: 0,
            totalViews: 0,
            totalInquiries: 0,
        };
    }

    const totalProperties = await prisma.property.count({
        where: { userId: userId },
    });

    const viewsAggregate = await prisma.property.aggregate({
        where: { userId: userId },
        _sum: { views: true },
    });
    const totalViews = viewsAggregate._sum.views || 0;

    const totalInquiries = await prisma.inquiry.count({
        where: {
            property: { userId: userId },
        },
    });

    return {
        totalProperties,
        totalViews,
        totalInquiries,
    };
}

export async function getFeaturedProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: {
            featured: true,
        },
        take: 6,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
    }));
}

export async function getPopularProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        take: 6,
        orderBy: {
            views: 'desc',
        },
    });

    return properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
    }));
}

export async function getNewProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        take: 6,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
    }));
}

export async function getRelatedProperties(currentId: string, type: string, limit: number = 3): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: {
            type: type,
            NOT: {
                id: currentId,
            },
        },
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
    }));
}

export interface PropertyInput {
    title: string;
    description: string;
    price: number;
    location: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: 'sale' | 'rent';
    imageUrl: string;
    featured?: boolean;
}

export async function getPropertyForEdit(id: string): Promise<PropertyInput | null> {
    const property = await prisma.property.findUnique({
        where: { id },
    });

    if (!property) return null;

    return {
        title: property.title,
        description: property.description,
        price: Number(property.price),
        location: property.location,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        type: property.type,
        status: property.status as 'sale' | 'rent',
        imageUrl: property.images,
        featured: property.featured,
    };
}

export interface SearchFilters {
    query?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    bedrooms?: number;
}

export async function getProperties(filters: SearchFilters): Promise<PropertyDTO[]> {
    const { query, type, minPrice, maxPrice, status, bedrooms } = filters;

    const where: any = {};

    if (query) {
        where.OR = [
            { title: { contains: query } },
            { location: { contains: query } },
            { address: { contains: query } },
        ];
    }

    if (type && type !== 'Semua Tipe') {
        where.type = type;
    }

    if (status && status !== 'active') {
        where.status = status;
    }

    if (minPrice !== undefined) {
        where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
        where.price = { ...where.price, lte: maxPrice };
    }

    if (bedrooms) {
        where.bedrooms = { gte: bedrooms };
    }

    const properties = await prisma.property.findMany({
        where,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
    }));
}
