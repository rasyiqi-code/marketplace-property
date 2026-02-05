import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import Script from 'next/script';
import { CheckoutHandler } from '@/components/payment/CheckoutHandler';

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
              <CheckoutHandler />
            </ThemeRegistry>
          </StackTheme>
        </StackProvider>
        <Script
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true'
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
