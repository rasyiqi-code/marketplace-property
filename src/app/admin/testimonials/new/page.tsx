import { requireAdmin } from '@/lib/stack';
import { Box, Typography, Button } from '@mui/material';
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewTestimonialPage() {
    await requireAdmin();

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
                    Tambah Testimoni Baru
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tambahkan ulasan pengguna secara manual.
                </Typography>
            </Box>

            <TestimonialForm mode="create" />
        </Box>
    );
}
