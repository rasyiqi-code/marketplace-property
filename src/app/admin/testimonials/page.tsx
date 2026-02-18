import { requireAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Button
} from '@mui/material';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import TestimonialActions from '@/components/admin/testimonials/TestimonialActions';

export default async function AdminTestimonialsPage() {
    try {
        await requireAdmin();
    } catch {
        redirect('/');
    }

    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="slate.900" sx={{ mb: 1 }}>
                        Manajemen Testimoni
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Kelola ulasan pengguna yang ditampilkan di beranda.
                    </Typography>
                </Box>
                <Link href="/admin/testimonials/new">
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                    >
                        Tambah Testimoni
                    </Button>
                </Link>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'slate.200', borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'slate.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Quote</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Rating</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Tanggal</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600', textAlign: 'right' }}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {testimonials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">Belum ada testimoni.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            testimonials.map((t) => (
                                <TableRow key={t.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={t.avatar || undefined} alt={t.name}>{t.name[0]}</Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">{t.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="body2" sx={{ color: 'slate.600', fontStyle: 'italic', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            &quot;{t.quote}&quot;
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span style={{ color: '#F59E0B' }}>★</span>
                                            <Typography variant="body2" fontWeight="bold">{t.rating}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={t.show ? 'Tampil' : 'Sembunyi'}
                                            size="small"
                                            color={t.show ? 'success' : 'default'}
                                            variant={t.show ? 'filled' : 'outlined'}
                                            sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{format(new Date(t.createdAt), 'dd MMM yyyy', { locale: id })}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TestimonialActions id={t.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
