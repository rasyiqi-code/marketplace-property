'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Theme kustom untuk ProEstate (Clone Rumah123)
 * Warna utama mengikuti branding Rumah123:
 * - Primary: Biru (#034E96)
 * - Secondary: Merah (#E0193E)
 */
export const theme = createTheme({
    palette: {
        primary: {
            main: '#034E96',
            light: '#3571B8',
            dark: '#023468',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#E0193E',
            light: '#E84764',
            dark: '#9C112B',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#6B7280',
        },
        success: {
            main: '#22C55E',
        },
        warning: {
            main: '#F59E0B',
        },
        error: {
            main: '#EF4444',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        button: {
            textTransform: 'none', // Tidak uppercase
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        // Kustomisasi default MUI Button
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#023468',
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#9C112B',
                    },
                },
            },
        },
        // Kustomisasi default MUI Card
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                },
            },
        },
        // Kustomisasi default MUI TextField
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        // Kustomisasi default MUI Chip
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
            },
        },
    },
});
