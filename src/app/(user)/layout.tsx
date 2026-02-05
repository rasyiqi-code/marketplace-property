import { stackServerApp } from '@/lib/stack';
import { NavbarMUI, NavbarUser } from '@/components/NavbarMUI';
import { FooterMUI } from '@/components/FooterMUI';
import { UserSidebar } from '@/components/UserSidebar';
import { Box, Container, Grid } from '@mui/material';
import { getCurrentUserStatus } from '@/lib/data/users';

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ambil user dari Stack Auth
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    // Ambil status kuota dari DB jika user login
    const userStatus = userId ? await getCurrentUserStatus(userId) : null;

    // Serialize user object
    const safeUser: NavbarUser | null = user ? {
        id: user.id,
        displayName: user.displayName,
        primaryEmail: user.primaryEmail,
        profileImageUrl: user.profileImageUrl,
    } : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <NavbarMUI user={safeUser} userStatus={userStatus} />

            <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                <Grid container spacing={4}>
                    {/* Sidebar - Hidden on mobile, handled by Navbar drawer */}
                    <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <UserSidebar userStatus={userStatus} />
                    </Grid>

                    {/* Content Area */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        {children}
                    </Grid>
                </Grid>
            </Container>

            <FooterMUI />
        </Box>
    );
}
