import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>
            <Footer />
        </>
    );
}
