import prisma from '@/lib/prisma';


/**
 * Menyimpan inquiry baru ke database
 */
export async function createInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    propertyId: string;
    userId?: string;
}) {
    return await prisma.inquiry.create({
        data,
    });
}

/**
 * Mengambil daftar inquiry untuk properti milik user tertentu (penjual/agen)
 */
export async function getInquiriesByUserId(userId: string) {
    return await prisma.inquiry.findMany({
        where: {
            property: {
                userId: userId,
            },
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Mengambil semua inquiry untuk dashboard admin
 */
export async function getAllInquiries() {
    return await prisma.inquiry.findMany({
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Menandai inquiry sebagai sudah dibaca
 */
export async function markInquiryAsRead(id: string) {
    return await prisma.inquiry.update({
        where: { id },
        data: { isRead: true },
    });
}

/**
 * Menghapus inquiry
 */
export async function deleteInquiry(id: string) {
    return await prisma.inquiry.delete({
        where: { id },
    });
}
