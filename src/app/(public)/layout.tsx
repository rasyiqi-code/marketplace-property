import { stackServerApp } from '@/lib/stack';
import { NavbarMUI } from '@/components/NavbarMUI';
import { FooterMUI } from '@/components/FooterMUI';
import { Box } from '@mui/material';
import prisma from '@/lib/prisma';

/**
 * PublicLayout - Layout untuk halaman publik
 * Menggunakan NavbarMUI dan FooterMUI dari Material UI
 */
export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Ambil user dari Stack Auth
    const user = await stackServerApp.getUser();

    // Ambil pengaturan footer dari database
    const footerSettings = await prisma.siteSetting.findUnique({
        where: { key: 'footer_settings' }
    });

    // Serialize user object to simple JSON to avoid passing functions to Client Component
    const safeUser = user ? {
        id: user.id,
        displayName: user.displayName,
        primaryEmail: user.primaryEmail,
        profileImageUrl: user.profileImageUrl,
    } : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavbarMUI user={safeUser} />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <FooterMUI settings={footerSettings?.value as any} />
        </Box>
    );
}
