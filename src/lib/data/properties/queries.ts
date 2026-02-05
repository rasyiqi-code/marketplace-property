import { stackServerApp } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
    PropertyDTO,
    PropertyDetailDTO,
    DashboardStats,
    PropertyInput,
    SearchFilters
} from './types';
import { formatPrice } from './utils';

type PropertyWithBasicFields = Prisma.PropertyGetPayload<{
    select: {
        id: true;
        title: true;
        slug: true;
        price: true;
        location: true;
        bedrooms: true;
        bathrooms: true;
        area: true;
        type: true;
        status: true;
        images: true;
        featured: true;
        latitude: true;
        longitude: true;
        mapsEmbed: true;
        videoUrl: true;
        virtualTourUrl: true;
    }
}>;

function mapToPropertyDTO(p: PropertyWithBasicFields): PropertyDTO {
    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: formatPrice(Number(p.price), p.status),
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type,
        status: p.status as 'sale' | 'rent',
        imageUrl: p.images,
        featured: p.featured,
        latitude: p.latitude,
        longitude: p.longitude,
        mapsEmbed: p.mapsEmbed,
        videoUrl: p.videoUrl,
        virtualTourUrl: p.virtualTourUrl,
    };
}

export async function getUserProperties(userId: string): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

type PropertyWithRelations = Prisma.PropertyGetPayload<{
    include: {
        user: {
            select: {
                name: true;
                email: true;
                phone: true;
                photo: true;
                whatsappMessage: true;
                verified: true;
                accountType: true;
                bio: true;
                company: true;
            }
        };
        propertyImages: { orderBy: { sortOrder: 'asc' } };
        facilities: { include: { facility: true } };
    }
}>;

export async function getPropertyById(id: string): Promise<PropertyDetailDTO | null> {
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    photo: true,
                    whatsappMessage: true,
                    verified: true,
                    accountType: true,
                    bio: true,
                    company: true
                }
            },
            propertyImages: { orderBy: { sortOrder: 'asc' } },
            facilities: { include: { facility: true } },
        },
    }) as PropertyWithRelations | null;

    if (!property) return null;

    return {
        ...mapToPropertyDTO(property),
        description: property.description,
        address: property.address,
        userId: property.userId,
        seller: {
            name: property.user?.name || 'ProEstate User',
            email: property.user?.email || 'support@proestate.com',
            phone: property.user?.phone || null,
            photo: property.user?.photo || null,
            whatsappMessage: property.user?.whatsappMessage || null,
            verified: property.user?.verified || false,
            accountType: property.user?.accountType || 'INDIVIDUAL',
            bio: property.user?.bio || null,
            company: property.user?.company || null,
        },
        propertyImages: property.propertyImages.map((img) => ({
            id: img.id,
            url: img.url,
            caption: img.caption,
            isPrimary: img.isPrimary,
        })),
        facilities: property.facilities.map((pf) => ({
            id: pf.facility.id,
            name: pf.facility.name,
            icon: pf.facility.icon,
        })),
        landArea: property.landArea,
        certificate: property.certificate,
        condition: property.condition,
        furnishing: property.furnishing,
        floors: property.floors,
        mapsEmbed: property.mapsEmbed,
        videoUrl: property.videoUrl,
        virtualTourUrl: property.virtualTourUrl,
    };
}

export async function getPropertyBySlug(slug: string, status: string): Promise<PropertyDetailDTO | null> {
    // Try to find by slug first
    let property = await prisma.property.findFirst({
        where: { slug, status },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    photo: true,
                    whatsappMessage: true,
                    verified: true,
                    accountType: true,
                    bio: true,
                    company: true
                }
            },
            propertyImages: { orderBy: { sortOrder: 'asc' } },
            facilities: { include: { facility: true } },
        },
    }) as PropertyWithRelations | null;

    // Fallback: try to find by ID if slug search fails (handling old IDs or stale data)
    if (!property) {
        property = await prisma.property.findFirst({
            where: { id: slug, status },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        photo: true,
                        whatsappMessage: true,
                        verified: true,
                        accountType: true,
                        bio: true,
                        company: true
                    }
                },
                propertyImages: { orderBy: { sortOrder: 'asc' } },
                facilities: { include: { facility: true } },
            },
        }) as PropertyWithRelations | null;
    }

    if (!property) return null;

    return {
        ...mapToPropertyDTO(property),
        description: property.description,
        address: property.address,
        userId: property.userId,
        seller: {
            name: property.user?.name || 'ProEstate User',
            email: property.user?.email || 'support@proestate.com',
            phone: property.user?.phone || null,
            photo: property.user?.photo || null,
            whatsappMessage: property.user?.whatsappMessage || null,
            verified: property.user?.verified || false,
            accountType: property.user?.accountType || 'INDIVIDUAL',
            bio: property.user?.bio || null,
            company: property.user?.company || null,
        },
        propertyImages: property.propertyImages.map((img) => ({
            id: img.id,
            url: img.url,
            caption: img.caption,
            isPrimary: img.isPrimary,
        })),
        facilities: property.facilities.map((pf) => ({
            id: pf.facility.id,
            name: pf.facility.name,
            icon: pf.facility.icon,
        })),
        landArea: property.landArea,
        certificate: property.certificate,
        condition: property.condition,
        furnishing: property.furnishing,
        floors: property.floors,
        mapsEmbed: property.mapsEmbed,
        videoUrl: property.videoUrl,
        virtualTourUrl: property.virtualTourUrl,
    };
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        return { totalProperties: 0, totalViews: 0, totalInquiries: 0 };
    }

    const totalProperties = await prisma.property.count({
        where: { userId },
    });

    const viewsAggregate = await prisma.property.aggregate({
        where: { userId },
        _sum: { views: true },
    });
    const totalViews = viewsAggregate._sum.views || 0;

    const totalInquiries = await prisma.inquiry.count({
        where: {
            property: { userId },
        },
    });

    return { totalProperties, totalViews, totalInquiries };
}

export async function getFeaturedProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: { featured: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

export async function getPopularProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        take: 6,
        orderBy: { views: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

export async function getNewProperties(): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

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
        landArea: property.landArea || undefined,
        certificate: property.certificate || undefined,
        condition: property.condition || undefined,
        furnishing: property.furnishing || undefined,
        floors: property.floors || undefined,
        latitude: property.latitude || undefined,
        longitude: property.longitude || undefined,
        mapsEmbed: property.mapsEmbed || undefined,
        videoUrl: property.videoUrl || undefined,
        virtualTourUrl: property.virtualTourUrl || undefined,
    };
}

export async function getProperties(filters: SearchFilters): Promise<PropertyDTO[]> {
    const { query, type, minPrice, maxPrice, status, bedrooms } = filters;
    const where: Prisma.PropertyWhereInput = {};

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
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}
