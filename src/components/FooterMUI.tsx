'use client';

import * as React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Link as MuiLink,
    Divider,
    IconButton,
    Stack,
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Email,
    Phone,
    LocationOn,
} from '@mui/icons-material';
import Link from 'next/link';

const FOOTER_LINKS = {
    perusahaan: [
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Karir', href: '/careers' },
        { label: 'Pers', href: '/press' },
    ],
    dukungan: [
        { label: 'Pusat Bantuan', href: '/help' },
        { label: 'Syarat & Ketentuan', href: '/terms' },
        { label: 'Kebijakan Privasi', href: '/privacy' },
    ],
    layanan: [
        { label: 'Jual Properti', href: '/post-ad' },
        { label: 'Cari Properti', href: '/search' },
        { label: 'Kalkulator KPR', href: '/kpr' },
    ],
};

/**
 * FooterMUI - Footer menggunakan Material UI
 */
export function FooterMUI() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                pt: 6,
                pb: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand & Description */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                            component={Link}
                            href="/"
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                textDecoration: 'none',
                                display: 'inline-block',
                                mb: 2,
                            }}
                        >
                            ProEstate
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
                            Platform properti terpercaya untuk menemukan rumah impian Anda.
                            Jual, beli, dan sewa properti dengan mudah dan aman.
                        </Typography>

                        {/* Social Media */}
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" color="primary">
                                <Facebook />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <Twitter />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <Instagram />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <LinkedIn />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Perusahaan */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Perusahaan
                        </Typography>
                        <Stack spacing={1.5}>
                            {FOOTER_LINKS.perusahaan.map((link) => (
                                <MuiLink
                                    key={link.href}
                                    component={Link}
                                    href={link.href}
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.9rem' }}
                                >
                                    {link.label}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Dukungan */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Dukungan
                        </Typography>
                        <Stack spacing={1.5}>
                            {FOOTER_LINKS.dukungan.map((link) => (
                                <MuiLink
                                    key={link.href}
                                    component={Link}
                                    href={link.href}
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.9rem' }}
                                >
                                    {link.label}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Hubungi Kami */}
                    <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Hubungi Kami
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    support@proestate.id
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    +62 21 5555 6666
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Jakarta, Indonesia
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Copyright */}
                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} ProEstate. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
