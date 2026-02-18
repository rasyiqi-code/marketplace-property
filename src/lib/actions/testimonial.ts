'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/stack';

const TestimonialSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    role: z.string().min(1, 'Role/Jabatan harus diisi'),
    quote: z.string().min(10, 'Testimoni minimal 10 karakter'),
    rating: z.coerce.number().min(1).max(5).default(5),
    show: z.boolean().default(true),
    avatar: z.string().optional(),
});

export type TestimonialState = {
    error?: string;
    success?: boolean;
    errors?: {
        name?: string[];
        role?: string[];
        quote?: string[];
        rating?: string[];
        avatar?: string[];
    };
};

export async function createTestimonial(prevState: TestimonialState, formData: FormData): Promise<TestimonialState> {
    try {
        await requireAdmin();

        const validatedFields = TestimonialSchema.safeParse({
            name: formData.get('name'),
            role: formData.get('role'),
            quote: formData.get('quote'),
            rating: formData.get('rating'),
            show: formData.get('show') === 'on',
            avatar: formData.get('avatar'), // Handle file upload separately or assume URL string for now
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name, role, quote, rating, show, avatar } = validatedFields.data;

        await prisma.testimonial.create({
            data: {
                name,
                role,
                quote,
                rating,
                show,
                avatar,
            },
        });

        revalidatePath('/admin/testimonials');
        revalidatePath('/'); // Homepage shows testimonials

        return { success: true };
    } catch (error) {
        console.error('Failed to create testimonial:', error);
        return { error: 'Gagal membuat testimoni. Silakan coba lagi.' };
    }
}

export async function updateTestimonial(id: string, prevState: TestimonialState, formData: FormData): Promise<TestimonialState> {
    try {
        await requireAdmin();

        const validatedFields = TestimonialSchema.safeParse({
            name: formData.get('name'),
            role: formData.get('role'),
            quote: formData.get('quote'),
            rating: formData.get('rating'),
            show: formData.get('show') === 'on',
            avatar: formData.get('avatar'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name, role, quote, rating, show, avatar } = validatedFields.data;

        await prisma.testimonial.update({
            where: { id },
            data: {
                name,
                role,
                quote,
                rating,
                show,
                avatar,
            },
        });

        revalidatePath('/admin/testimonials');
        revalidatePath('/');

        return { success: true };
    } catch (error) {
        console.error('Failed to update testimonial:', error);
        return { error: 'Gagal memperbarui testimoni.' };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await requireAdmin();
        await prisma.testimonial.delete({ where: { id } });
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete testimonial:', error);
        return { error: 'Gagal menghapus testimoni.' };
    }
}

export async function toggleTestimonialVisibility(id: string, show: boolean) {
    try {
        await requireAdmin();
        await prisma.testimonial.update({
            where: { id },
            data: { show },
        });
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle visibility:', error);
        return { error: 'Gagal mengubah status.' };
    }
}
