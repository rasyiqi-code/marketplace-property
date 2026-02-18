import { stackServerApp } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Container, Typography, Box, Grid, Stack } from '@mui/material';
import { Zap, ShieldCheck, Info } from 'lucide-react';
import { UpgradeFlow } from '@/components/upgrade/UpgradeFlow';

export default async function UpgradePage() {
    const user = await stackServerApp.getUser();
    if (!user) redirect('/handler/sign-in');

    const packagesRaw = await prisma.listingPackage.findMany({
        orderBy: { price: 'asc' }
    });

    const packages = packagesRaw.map(pkg => ({
        ...pkg,
        price: Number(pkg.price)
    }));

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="900" gutterBottom sx={{ fontFamily: 'var(--font-heading)' }}>
                    Tingkatkan Jangkauan Anda
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                    Pilih paket yang sesuai dengan kebutuhan Anda untuk memposting lebih banyak properti dan mendapatkan fitur prioritas.
                </Typography>
            </Box>

            <UpgradeFlow packages={packages} />

            <Box sx={{ mt: 10 }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                    Kenapa Memilih Paket Pro?
                </Typography>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: '50%', color: 'primary.main' }}>
                                <Zap size={32} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold">Post Lebih Cepat</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lewati proses review manual untuk setiap listing Anda.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: '50%', color: 'primary.main' }}>
                                <ShieldCheck size={32} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold">Badge Terverifikasi</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dapatkan badge verifikasi yang meningkatkan kepercayaan calon pembeli.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: '50%', color: 'primary.main' }}>
                                <Info size={32} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold">Statistik Lengkap</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pantau performa listing Anda dengan dashboard analitik yang komprehensif.
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
