import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
    PropertyDTO,
    PropertyDetailDTO,
    PropertyInput
} from './types';
import { formatPrice } from './utils';
import { DEFAULT_PROPERTY_IMAGE } from '@/lib/constants';

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

/**
 * Helper: Map Prisma property object to PropertyDTO
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapToPropertyDTO(p: any): PropertyDTO {
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
        imageUrl: p.images || DEFAULT_PROPERTY_IMAGE,
        featured: p.featured,
        latitude: p.latitude,
        longitude: p.longitude,
        mapsEmbed: p.mapsEmbed,
        videoUrl: p.videoUrl,
        virtualTourUrl: p.virtualTourUrl,
        priority: p.priority,
        urgency: p.urgency as 'NONE' | 'HOT_DEAL' | 'DISTRESS_SALE',
    };
}

/**
 * Mendapatkan daftar properti milik user tertentu
 */
export async function getUserProperties(userId: string): Promise<PropertyDTO[]> {
    const properties = await prisma.property.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return properties.map(mapToPropertyDTO);
}

/**
 * Mendapatkan detail properti berdasarkan ID
 */
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

/**
 * Mendapatkan detail properti berdasarkan Slug dan Status
 */
export async function getPropertyBySlug(slug: string, status: string): Promise<PropertyDetailDTO | null> {
    const whereCondition = {
        status: { equals: status, mode: 'insensitive' as Prisma.QueryMode }
    };

    let property = await prisma.property.findFirst({
        where: { slug, ...whereCondition },
        include: {
            user: {
                select: {
                    name: true, email: true, phone: true, photo: true,
                    whatsappMessage: true, verified: true, accountType: true,
                    bio: true, company: true
                }
            },
            propertyImages: { orderBy: { sortOrder: 'asc' } },
            facilities: { include: { facility: true } },
        },
    }) as PropertyWithRelations | null;

    if (!property) {
        property = await prisma.property.findFirst({
            where: { id: slug, ...whereCondition },
            include: {
                user: {
                    select: {
                        name: true, email: true, phone: true, photo: true,
                        whatsappMessage: true, verified: true, accountType: true,
                        bio: true, company: true
                    }
                },
                propertyImages: { orderBy: { sortOrder: 'asc' } },
                facilities: { include: { facility: true } },
            },
        }) as PropertyWithRelations | null;
    }

    if (!property) return null;

    return getPropertyById(property.id);
}

/**
 * Mendapatkan data properti untuk keperluan edit
 */
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
