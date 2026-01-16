import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
// Navbar and Footer moved to (public)/layout.tsx
// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'ProEstate - Temukan Hunian Impian',
  description: 'Marketplace properti terpercaya di Indonesia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
