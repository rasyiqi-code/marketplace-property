'use server';

import { requireAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateFooterSettings(prevState: unknown, formData: FormData) {
    try {
        await requireAdmin();

        const about = formData.get('about') as string;
        const address = formData.get('address') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const facebook = formData.get('facebook') as string;
        const instagram = formData.get('instagram') as string;
        const linkedin = formData.get('linkedin') as string;

        const footerData = {
            about,
            contact: {
                address,
                phone,
                email
            },
            socials: {
                facebook,
                instagram,
                linkedin
            }
        };

        // Simpan ke database (menggunakan modul SiteSetting key-value store)
        await prisma.siteSetting.upsert({
            where: { key: 'footer_config' },
            create: {
                key: 'footer_config',
                value: footerData
            },
            update: {
                value: footerData
            }
        });

        revalidatePath('/'); // Footer is global
        revalidatePath('/admin/settings');

        return { success: true, message: 'Pengaturan footer berhasil disimpan.' };

    } catch (error) {
        console.error('Failed to update footer settings:', error);
        return { error: 'Gagal menyimpan pengaturan.' };
    }
}

export async function getFooterSettings() {
    const setting = await prisma.siteSetting.findUnique({
        where: { key: 'footer_config' }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return setting?.value as Record<string, any> || null;
}
