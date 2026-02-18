import { stackServerApp } from '@/lib/stack';
import { getInquiriesByUserId } from '@/lib/data/inquiries';
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
    IconButton,
    Tooltip,
    Stack
} from '@mui/material';
import { Eye, Mail, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function UserInquiriesPage() {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect('/handler/sign-in');
    }

    const inquiries = await getInquiriesByUserId(user.id);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'var(--font-heading)', color: 'slate.900' }}>
                    Inquiry Properti
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Daftar pesan dan pertanyaan dari calon pembeli untuk properti Anda.
                </Typography>
            </Box>

            {inquiries.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                    <Mail size={48} className="mx-auto mb-4 text-slate-300" />
                    <Typography variant="h6" fontWeight="bold">Belum ada pesan</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Pesan dari pengunjung properti Anda akan muncul di sini.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'slate.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tanggal</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Pengirim</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Properti</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Pesan</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Calendar size={14} className="text-slate-400" />
                                            {format(new Date(inquiry.createdAt), 'dd MMM yyyy', { locale: id })}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{inquiry.name}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{inquiry.email}</Typography>
                                        {inquiry.phone && <Typography variant="caption" color="text.secondary">{inquiry.phone}</Typography>}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            component={Link}
                                            href={`/${inquiry.property.status === 'rent' ? 'sewa' : 'jual'}/${inquiry.property.slug || inquiry.property.id}`}
                                            variant="body2"
                                            color="primary"
                                            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            {inquiry.property.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                                            {inquiry.message}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={inquiry.isRead ? 'Dibaca' : 'Baru'}
                                            size="small"
                                            color={inquiry.isRead ? 'default' : 'primary'}
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Lihat Detail">
                                                <IconButton size="small">
                                                    <Eye size={18} />
                                                </IconButton>
                                            </Tooltip>
                                            {inquiry.phone && (
                                                <Tooltip title="WhatsApp">
                                                    <IconButton size="small" color="success" component="a" href={`https://wa.me/${inquiry.phone.replace(/\D/g, '').replace(/^0/, '62')}`} target="_blank">
                                                        <Phone size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
