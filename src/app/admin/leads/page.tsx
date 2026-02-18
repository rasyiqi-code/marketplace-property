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
    Button,
    Avatar,
    Chip
} from '@mui/material';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { WhatsApp, Email, OpenInNew } from '@mui/icons-material';
import Link from 'next/link';
import SendPersonalNotificationDialog from '@/components/admin/leads/SendPersonalNotificationDialog';

export const metadata = {
    title: 'Admin - Leads & Peminat | ProEstate',
};

async function getLeads() {
    const rawLeads = await prisma.wishlist.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                }
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    slug: true,
                    status: true,
                    images: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return rawLeads.map(lead => ({
        ...lead,
        property: {
            ...lead.property,
            imageUrl: lead.property.images ? lead.property.images.split(',')[0] : null
        }
    }));
}

export default async function AdminLeadsPage() {
    const leads = await getLeads();

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Leads & Peminat
                    </Typography>
                    <Typography color="text.secondary">
                        Daftar pengguna yang menyimpan properti ke favorit. Potensial untuk di-follow up.
                    </Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Properti Diminati</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Waktu</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">Belum ada data leads.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={lead.user.image || undefined} alt={lead.user.name || 'User'} />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {lead.user.name || 'Tanpa Nama'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {lead.user.email}
                                                </Typography>
                                                {lead.user.phone && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        {lead.user.phone}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Link
                                                href={lead.property.slug ? `/${lead.property.status === 'sale' ? 'jual' : 'sewa'}/${lead.property.slug}` : `/property/${lead.property.id}`}
                                                target="_blank"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    color="primary"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {lead.property.title} <OpenInNew sx={{ fontSize: 12 }} />
                                                </Typography>
                                            </Link>
                                            <Typography variant="body2" color="text.secondary">
                                                ID: {lead.property.id}
                                            </Typography>
                                            <Chip
                                                label={lead.property.status === 'sale' ? 'Dijual' : 'Disewa'}
                                                size="small"
                                                color={lead.property.status === 'sale' ? 'primary' : 'secondary'}
                                                variant="outlined"
                                                sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {format(new Date(lead.createdAt), 'dd MMM yyyy', { locale: id })}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(lead.createdAt), 'HH:mm', { locale: id })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            {lead.user.phone && (
                                                <Button
                                                    component="a"
                                                    href={`https://wa.me/${lead.user.phone.replace(/^0/, '62').replace(/\D/g, '')}?text=Halo ${lead.user.name}, saya dari ProEstate. Saya lihat Anda tertarik dengan properti "${lead.property.title}". Ada yang bisa saya bantu?`}
                                                    target="_blank"
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<WhatsApp />}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Follow Up
                                                </Button>
                                            )}

                                            <Button
                                                component="a"
                                                href={`mailto:${lead.user.email}?subject=Info Properti: ${lead.property.title}`}
                                                variant="outlined"
                                                color="info"
                                                size="small"
                                                sx={{ minWidth: 0, px: 1 }}
                                            >
                                                <Email />
                                            </Button>

                                            <SendPersonalNotificationDialog
                                                userId={lead.user.id}
                                                userName={lead.user.name || 'User'}
                                                propertyTitle={lead.property.title}
                                                // Construct dynamic URL based on property status/slug
                                                propertyUrl={`/${lead.property.status === 'sale' ? 'jual' : 'sewa'}/${lead.property.slug || lead.property.id}`}
                                            />
                                        </Box>
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
