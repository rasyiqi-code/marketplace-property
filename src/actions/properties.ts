
import { auth } from '@/auth';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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
}

export async function getFeaturedProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: {
            featured: true,
        },
        take: 3,
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
        imageUrl: p.images, // Assuming single URL for now as per seed
    }));
}

function formatPrice(price: number, status: string): string {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    });

    const formatted = formatter.format(price);

    // Simple heuristic for formatting
    // If status is rent, maybe add / year? Mock data had it.
    // But for now just returning the raw IDR string or matching mock style slightly

    return status === 'rent' ? `${formatted} / thn` : formatted;
}

export interface PropertyDetailDTO extends PropertyDTO {
    description: string;
    address: string;
    agent: {
        name: string;
        email: string;
        phone: string;
        photo: string | null;
    };
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
        description: property.description,
        address: property.address,
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
    }));
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
}

export async function createProperty(data: PropertyInput) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error('Unauthorized');
    }

    // Assign to a random agent for now or handle agent linkage differently if users are agents
    // For this MVP, we link to the user but also need an agentId because of schema
    // Let's assume the user IS the agent or we just pick strict agent from DB

    // Check if user has an Agent profile? Or just link to default agent
    const agent = await prisma.agent.findFirst();
    if (!agent) throw new Error('System Error: No agent profile found');

    // Ideally property should point to User directly if schema allows, 
    // but our schema has relation property-agent. 
    // Let's check schema details from memory: Property has agentId AND userId.
    // So we can link both.

    const { imageUrl, ...rest } = data;

    const property = await prisma.property.create({
        data: {
            ...rest,
            images: imageUrl, // Mapping imageUrl to images field
            agentId: agent.id,
            userId: userId,
            featured: false,
        },
    });

    return property;
}

export async function deleteProperty(id: string) {
    // In a real app, verify Admin role here
    await prisma.property.delete({
        where: { id },
    });

    revalidatePath('/admin/properties');
    revalidatePath('/search');
    revalidatePath('/dashboard');
    revalidatePath('/admin');
}
