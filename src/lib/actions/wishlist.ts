'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';

/**
 * toggleWishlist - Menambah atau menghapus properti dari wishlist
 */
export async function toggleWishlist(propertyId: string) {
    const user = await stackServerApp.getUser();

    if (!user) {
        return { success: false, message: 'Harap login terlebih dahulu' };
    }

    try {
        // Ensure user exists in local DB to prevent foreign key error
        await prisma.user.upsert({
            where: { id: user.id },
            update: {}, // No update needed if exists
            create: {
                id: user.id,
                email: user.primaryEmail || `user-${user.id}@example.com`, // Fallback email
                name: user.displayName || user.primaryEmail?.split('@')[0] || "User",
                role: "USER"
            }
        });

        const existingWishlist = await prisma.wishlist.findUnique({
            where: {
                userId_propertyId: {
                    userId: user.id,
                    propertyId: propertyId
                }
            }
        });

        if (existingWishlist) {
            // Remove from wishlist
            await prisma.wishlist.delete({
                where: {
                    id: existingWishlist.id
                }
            });
            revalidatePath('/search');
            revalidatePath(`/property/${propertyId}`);
            revalidatePath('/wishlist'); // If we have a wishlist page
            return { success: true, isWishlisted: false, message: 'Dihapus dari favorit' };
        } else {
            // Add to wishlist
            await prisma.wishlist.create({
                data: {
                    userId: user.id,
                    propertyId: propertyId
                }
            });
            revalidatePath('/search');
            revalidatePath(`/property/${propertyId}`);
            return { success: true, isWishlisted: true, message: 'Disimpan ke favorit' };
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        return { success: false, message: 'Gagal menyimpan favorit' };
    }
}

/**
 * getWishlistStatus - Cek apakah properti ada di wishlist user
 */
export async function getWishlistStatus(propertyId: string) {
    const user = await stackServerApp.getUser();

    if (!user) {
        return false;
    }

    const wishlist = await prisma.wishlist.findUnique({
        where: {
            userId_propertyId: {
                userId: user.id,
                propertyId: propertyId
            }
        }
    });

    return !!wishlist;
}

/**
 * getUserWishlistIds - Ambil semua ID properti yang di-wishlist oleh user
 * Berguna untuk initial data di halaman search
 */
export async function getUserWishlistIds() {
    const user = await stackServerApp.getUser();

    if (!user) {
        return [];
    }

    const wishlists = await prisma.wishlist.findMany({
        where: { userId: user.id },
        select: { propertyId: true }
    });

    return wishlists.map(w => w.propertyId);
}
