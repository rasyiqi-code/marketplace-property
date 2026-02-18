import { stackServerApp } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { DashboardStats } from './types';

/**
 * Mendapatkan statistik untuk dashboard user
 * Menghitung total properti, view, dan inquiry milik user yang login
 */
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
