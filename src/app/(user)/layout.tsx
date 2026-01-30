import { stackServerApp } from '@/lib/stack';
import { NavbarMUI } from '@/components/NavbarMUI';
import { FooterMUI } from '@/components/FooterMUI';
import { UserSidebar } from '@/components/UserSidebar';
import { Box, Container, Grid } from '@mui/material';

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ambil user dari Stack Auth
    const user = await stackServerApp.getUser();

    // Serialize user object
    const safeUser = user ? {
        id: user.id,
        displayName: user.displayName,
        primaryEmail: user.primaryEmail,
        profileImageUrl: user.profileImageUrl,
    } : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <NavbarMUI user={safeUser} />

            <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                <Grid container spacing={4}>
                    {/* Sidebar - Hidden on mobile, handled by Navbar drawer */}
                    <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <UserSidebar />
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
