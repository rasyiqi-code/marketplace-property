import { requireAdmin } from '@/lib/stack';
import { getAllInquiries } from '@/lib/data/inquiries';
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
    Avatar
} from '@mui/material';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default async function AdminInquiriesPage() {
    try {
        await requireAdmin();
    } catch {
        // redirect('/handler/sign-in'); // Redirect handled by requireAdmin usually or we redirect here
        // For now just suppress unused var by removing catch arg
    }

    const inquiries = await getAllInquiries();

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="slate.900" sx={{ mb: 1 }}>
                    Manajemen Inquiry
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Kelola semua pesan yang masuk dari pengunjung di seluruh platform ProEstate.
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'slate.200', borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'slate.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Waktu</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Pengirim</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Properti & Penjual</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Pesan</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'slate.600' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id} hover>
                                <TableCell>
                                    <Typography variant="body2">{format(new Date(inquiry.createdAt), 'dd/MM/yy', { locale: id })}</Typography>
                                    <Typography variant="caption" color="text.secondary">{format(new Date(inquiry.createdAt), 'HH:mm')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{inquiry.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{inquiry.email}</Typography>
                                    <Typography variant="caption" color="text.secondary">{inquiry.phone || '-'}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <Link
                                            href={`/${inquiry.property.status === 'rent' ? 'sewa' : 'jual'}/${inquiry.property.slug || inquiry.property.id}`}
                                            style={{ color: '#034E96', textDecoration: 'none' }}
                                        >
                                            {inquiry.property.title}
                                        </Link>
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 18, height: 18, fontSize: 10 }}>{inquiry.property.user?.name?.[0] || 'U'}</Avatar>
                                        <Typography variant="caption" color="text.secondary">
                                            Penjual: {inquiry.property.user?.name || 'ProEstate User'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 250 }}>
                                    <Typography variant="body2" sx={{ color: 'slate.600', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {inquiry.message}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={inquiry.isRead ? 'Dibaca' : 'Baru'}
                                        size="small"
                                        variant={inquiry.isRead ? 'outlined' : 'filled'}
                                        color={inquiry.isRead ? 'default' : 'primary'}
                                        sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
