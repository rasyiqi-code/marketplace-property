'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { theme } from '@/theme';

/**
 * ThemeRegistry - Provider wrapper untuk Material UI di Next.js App Router
 * 
 * Komponen ini menggabungkan:
 * - AppRouterCacheProvider: Cache untuk Emotion CSS-in-JS di App Router
 * - ThemeProvider: Menyediakan theme MUI ke seluruh aplikasi
 * - CssBaseline: Reset CSS dan normalisasi style browser
 */
export function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline untuk reset CSS dan normalisasi */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
