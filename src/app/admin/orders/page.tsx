import { requireAdmin } from '@/lib/stack';
import { prisma } from '@/lib/db';
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
    IconButton,
    Tooltip
} from '@mui/material';
import { CheckCircle, Image as ImageIcon } from 'lucide-react';
import { revalidatePath } from 'next/cache';

async function confirmPayment(orderId: string) {
    'use server';

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { package: true, user: true }
    });

    if (!order || order.status === 'PAID') return;

    // 1. Update User Quota
    const user = order.user;
    const newLimit = user.listingLimit + order.package.listingLimit;

    let expiryDate = user.packageExpiry;
    if (order.package.type === 'SUBSCRIPTION') {
        const days = order.package.durationDays;
        const now = new Date();
        const basisDate = (user.packageExpiry && user.packageExpiry > now) ? user.packageExpiry : now;
        expiryDate = new Date(basisDate.getTime() + (days * 24 * 60 * 60 * 1000));
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: {
                listingLimit: newLimit,
                packageExpiry: expiryDate
            }
        }),
        prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' }
        })
    ]);

    revalidatePath('/admin/orders');
    revalidatePath('/upgrade');
}

export default async function AdminOrdersPage() {
    await requireAdmin();

    const orders = await prisma.order.findMany({
        include: {
            user: { select: { name: true, email: true } },
            package: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Manajemen Pesanan (Orders)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tinjau dan konfirmasi pembayaran paket dari user.
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'slate.50' }}>
                        <TableRow>
                            <TableCell><Typography fontWeight="bold">ID / Tgl</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">User</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Paket</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Total</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Metode</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                            <TableCell align="center"><Typography fontWeight="bold">Aksi</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">{order.id.slice(-8)}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{order.user.name || 'User'}</Typography>
                                    <Typography variant="caption" color="text.secondary">{order.user.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={order.package.name} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(order.amount))}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.paymentMethod}
                                        size="small"
                                        color={order.paymentMethod === 'DOKU' ? 'primary' : 'secondary'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        size="small"
                                        color={order.status === 'PAID' ? 'success' : order.status === 'PENDING' ? 'warning' : 'default'}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        {order.paymentProof && (
                                            <Tooltip title="Lihat Bukti Bayar">
                                                <IconButton
                                                    size="small"
                                                    component="a"
                                                    href={order.paymentProof}
                                                    target="_blank"
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <ImageIcon size={18} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {order.status === 'PENDING' && (
                                            <form action={confirmPayment.bind(null, order.id)}>
                                                <Tooltip title="Konfirmasi & Aktivasi">
                                                    <IconButton size="small" type="submit" sx={{ color: 'success.main' }}>
                                                        <CheckCircle size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </form>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">Belum ada pesanan.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
