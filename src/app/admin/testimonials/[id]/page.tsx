import { requireAdmin } from '@/lib/stack';
import { Box, Typography, Button } from '@mui/material';
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    await requireAdmin();
    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
        where: { id },
    });

    if (!testimonial) {
        notFound();
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Link href="/admin/testimonials" style={{ textDecoration: 'none' }}>
                    <Button
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ mb: 2 }}
                        color="inherit"
                    >
                        Kembali
                    </Button>
                </Link>
                <Typography variant="h4" fontWeight="bold" color="slate.900" sx={{ mb: 1 }}>
                    Edit Testimoni
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Perbarui data ulasan pengguna.
                </Typography>
            </Box>

            <TestimonialForm mode="edit" initialData={testimonial} />
        </Box>
    );
}
