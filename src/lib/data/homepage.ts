
import prisma from '@/lib/prisma';

export interface HomepageStats {
    activeListings: number;
    registeredUsers: number;
    successfulTransactions: number;
    totalViews: number;
}

export interface CategoryCount {
    name: string;
    count: number;
}

export async function getHomepageStats(): Promise<HomepageStats> {
    const [activeListings, userCount, successfulTransactions, viewsAggregate] = await Promise.all([
        prisma.property.count(),
        prisma.user.count(),
        prisma.order.count({
            where: { status: 'PAID' }
        }),
        prisma.property.aggregate({
            _sum: { views: true }
        })
    ]);

    return {
        activeListings,
        registeredUsers: userCount,
        successfulTransactions,
        totalViews: viewsAggregate._sum.views || 0,
    };
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
    const categories = await prisma.property.groupBy({
        by: ['type'],
        _count: {
            type: true,
        },
        orderBy: {
            _count: {
                type: 'desc',
            }
        }
    });

    return categories.map(c => ({
        name: c.type,
        count: c._count.type,
    }));
}

export async function getTestimonials() {
    return prisma.testimonial.findMany({
        where: { show: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
    });
}

export async function getFeaturedPropertyImages() {
    const properties = await prisma.property.findMany({
        where: { featured: true },
        select: { images: true },
        take: 5,
        orderBy: { updatedAt: 'desc' }
    });

    return properties.map(p => p.images).filter(Boolean);
}
