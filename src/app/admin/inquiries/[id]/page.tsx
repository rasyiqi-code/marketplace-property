import { requireAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    Avatar
} from '@mui/material';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, User, Home, CheckCircle } from 'lucide-react';
import InquiryReplyForm from '@/components/admin/inquiries/InquiryReplyForm';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
    } catch {
        redirect('/');
    }

    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
        where: { id },
        include: {
            property: {
                include: {
                    user: true // Seller info
                }
            },
            user: true // Sender info if registered
        }
    });

    if (!inquiry) {
        notFound();
    }

    // Mark as read immediately when opened
    if (!inquiry.isRead) {
        await prisma.inquiry.update({
            where: { id },
            data: { isRead: true }
        });
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Link href="/admin/inquiries" style={{ textDecoration: 'none' }}>
                    <Button
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ mb: 2 }}
                        color="inherit"
                    >
                        Kembali ke Daftar
                    </Button>
                </Link>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="slate.900" sx={{ mb: 1 }}>
                            Detail Pesan
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            ID: {inquiry.id}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label={inquiry.isReplied ? 'Sudah Dibalas' : 'Belum Dibalas'}
                            color={inquiry.isReplied ? 'success' : 'warning'}
                            variant="filled"
                            icon={inquiry.isReplied ? <CheckCircle size={14} /> : undefined}
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Left Column: Message Content */}
                <Box sx={{ flex: { md: 2 }, width: '100%' }}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'slate.200', borderRadius: 3, mb: 4 }}>
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                                {inquiry.name[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {inquiry.name}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    {inquiry.email}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Dikirim pada {format(new Date(inquiry.createdAt), 'dd MMMM yyyy, HH:mm', { locale: idLocale })}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'slate.800', lineHeight: 1.6 }}>
                            {inquiry.message}
                        </Typography>

                        {inquiry.phone && (
                            <Box sx={{ mt: 4, p: 2, bgcolor: 'slate.50', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Phone size={20} className="text-slate-500" />
                                <Typography variant="body2" fontWeight="medium">
                                    {inquiry.phone}
                                </Typography>
                                <a href={`https://wa.me/${inquiry.phone.replace(/^0/, '62').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                                    <Button size="small" variant="outlined" color="success">Chat WA</Button>
                                </a>
                            </Box>
                        )}
                    </Paper>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Balas Pesan
                        </Typography>
                        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'slate.200', borderRadius: 3 }}>
                            <InquiryReplyForm inquiryId={inquiry.id} isReplied={inquiry.isReplied} />
                        </Paper>
                    </Box>
                </Box>

                {/* Right Column: Property & Seller Info */}
                <Box sx={{ flex: { md: 1 }, width: '100%' }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'slate.200', borderRadius: 3, mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home size={18} /> Info Properti
                        </Typography>
                        <Box>
                            <Image
                                src={inquiry.property.images.split(',')[0] || '/placeholder.jpg'}
                                alt={inquiry.property.title}
                                width={800}
                                height={400}
                                unoptimized
                                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
                            />
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                <Link href={`/${inquiry.property.type}/${inquiry.property.slug}`} className="hover:underline text-blue-600">
                                    {inquiry.property.title}
                                </Link>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {inquiry.property.location}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                Rp {Number(inquiry.property.price).toLocaleString('id-ID')}
                            </Typography>
                        </Box>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'slate.200', borderRadius: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <User size={18} /> Info Penjual
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar src={inquiry.property.user?.photo || undefined}>
                                {inquiry.property.user?.name?.[0] || 'S'}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {inquiry.property.user?.name || 'Unknown Seller'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {inquiry.property.user?.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            fullWidth
                            size="small"
                            href={`mailto:${inquiry.property.user?.email}`}
                        >
                            Hubungi Penjual
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
