'use server';

import { z } from 'zod';
import { createInquiry } from '@/lib/data/inquiries';
import { stackServerApp, requireAdmin } from '@/lib/stack';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

const InquirySchema = z.object({
    name: z.string().min(2, 'Nama harus minimal 2 karakter'),
    email: z.string().email('Format email tidak valid'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Pesan harus minimal 10 karakter'),
    propertyId: z.string(),
});

export type InquiryState = {
    error?: string;
    success?: boolean;
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        message?: string[];
    };
};

/**
 * Action untuk mengirim inquiry dari formulir kontak properti
 */
export async function submitInquiry(prevState: InquiryState, formData: FormData): Promise<InquiryState> {
    const validatedFields = InquirySchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        propertyId: formData.get('propertyId'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, phone, message, propertyId } = validatedFields.data;

    try {
        // Cek jika user sedang login untuk menyertakan userId (opsional)
        const user = await stackServerApp.getUser();

        await createInquiry({
            name,
            email,
            phone,
            message,
            propertyId,
            userId: user?.id,
        });

        // Revalidate cache untuk admin dan dashboard user jika diperlukan (nantinya)
        // revalidatePath('/admin/inquiries');
        // revalidatePath('/inquiries');

        return { success: true };
    } catch (error) {
        console.error('Failed to create inquiry:', error);
        return {
            error: 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.',
        };
    }
}

/**
 * Action untuk admin membalas inquiry (simulasi kirim email & update status)
 */
export async function replyInquiry(id: string, prevState: unknown, formData: FormData) {
    try {
        await requireAdmin();

        const replyMessage = formData.get('replyMessage') as string;

        if (!replyMessage || replyMessage.length < 5) {
            return { error: 'Pesan balasan terlalu pendek.' };
        }

        // TODO: Implement actual email sending logic here (e.g. via Resend or Nodemailer)
        // For now, we just update the database status

        await prisma.inquiry.update({
            where: { id },
            data: {
                isReplied: true,
                isRead: true, // Auto mark as read if replied
                // In a real app, we might store the reply content in a separate table or field
            },
        });

        revalidatePath(`/admin/inquiries`);
        revalidatePath(`/admin/inquiries/${id}`);

        return { success: true };
    } catch (error) {
        console.error('Failed to reply inquiry:', error);
        return { error: 'Gagal mengirim balasan.' };
    }
}

export async function markAsRead(id: string) {
    try {
        await requireAdmin();
        await prisma.inquiry.update({
            where: { id },
            data: { isRead: true },
        });
        revalidatePath(`/admin/inquiries`);
    } catch (error) {
        console.error('Failed to mark as read:', error);
    }
}

