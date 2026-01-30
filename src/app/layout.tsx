import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'ProEstate - Temukan Hunian Impian',
  description: 'Marketplace properti terpercaya di Indonesia.',
};

/**
 * RootLayout - Layout utama aplikasi
 * Wraps dengan:
 * - StackProvider untuk autentikasi
 * - ThemeRegistry untuk Material UI
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
