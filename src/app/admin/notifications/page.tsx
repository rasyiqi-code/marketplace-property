import { requireAdmin } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { People, Devices } from '@mui/icons-material';
import SendNotificationForm from '@/components/admin/notifications/SendNotificationForm';

export const metadata = {
    title: 'Admin - Web Push Notification | ProEstate',
};

async function getStats() {
    const totalSubscribers = await prisma.pushSubscription.count();

    // Group by user (approximate unique users)
    const uniqueUsers = await prisma.pushSubscription.groupBy({
        by: ['userId'],
    });

    return {
        totalSubscribers,
        uniqueUsers: uniqueUsers.length
    };
}

export default async function AdminNotificationsPage() {
    await requireAdmin();
    const stats = await getStats();

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Web Push Notifications
                </Typography>
                <Typography color="text.secondary">
                    Kelola notifikasi push ke browser user.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 2 }}>
                            <Devices fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalSubscribers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Perangkat Terdaftar
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, bgcolor: 'success.light', color: 'success.main', borderRadius: 2 }}>
                            <People fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                {stats.uniqueUsers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                User Unik (Login)
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <SendNotificationForm />
        </Box>
    );
}

// Fix Grid v2 props if needed based on project config, but assuming v1/v2 compat based on other files
