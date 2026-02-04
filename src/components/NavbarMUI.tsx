'use client';

import * as React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Typography,
    Container,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    AddCircleOutline,
    Person,
} from '@mui/icons-material';
import Link from 'next/link';
import { NavbarUser } from './navbar/types';
import { NAV_LINKS } from './navbar/constants';
import { UserMenu } from './navbar/UserMenu';
import { MobileMenu } from './navbar/MobileMenu';

export type { NavbarUser };

interface NavbarMUIProps {
    user: NavbarUser | null;
}

/**
 * NavbarMUI - Navbar utama menggunakan Material UI + Stack Auth
 */
export function NavbarMUI({ user }: NavbarMUIProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    backgroundColor: 'primary.main',
                    boxShadow: 'none',
                }}
            >
                {/* Top Bar */}
                <Toolbar sx={{ minHeight: { xs: 52, md: 56 } }}>
                    <Container
                        maxWidth="lg"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Logo */}
                        <Typography
                            component={Link}
                            href="/"
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                color: 'white',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Home sx={{ fontSize: 28 }} />
                            ProEstate
                        </Typography>

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    component={Link}
                                    href="/post-ad"
                                    variant="outlined"
                                    startIcon={<AddCircleOutline />}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    Pasang Iklan
                                </Button>

                                {user ? (
                                    <UserMenu user={user} />
                                ) : (
                                    <Button
                                        component={Link}
                                        href="/handler/sign-in"
                                        variant="outlined"
                                        startIcon={<Person />}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                            },
                                        }}
                                    >
                                        Masuk
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                onClick={() => setDrawerOpen(true)}
                                edge="end"
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Container>
                </Toolbar>

                {/* Secondary Nav - Desktop */}
                {!isMobile && (
                    <Box
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.15)',
                            py: 0.5,
                        }}
                    >
                        <Container maxWidth="lg">
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {NAV_LINKS.map((link) => (
                                    <Typography
                                        key={link.href}
                                        component={Link}
                                        href={link.href}
                                        sx={{
                                            color: 'rgba(255,255,255,0.85)',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            '&:hover': {
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Typography>
                                ))}
                            </Box>
                        </Container>
                    </Box>
                )}
            </AppBar>

            {/* Mobile Menu Component */}
            <MobileMenu
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={user}
            />
        </>
    );
}
