'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Home, Settings, LogOut } from 'lucide-react';
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';

const MENU_ITEMS = [
    {
        label: 'Profil Saya',
        href: '/account-settings',
        icon: <User size={20} />,
    },
    {
        label: 'Pesanan & Nego',
        href: '/transactions',
        icon: <ShoppingCart size={20} />,
    },
    {
        label: 'Properti Saya',
        href: '/my-properties',
        icon: <Home size={20} />,
    },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3, // Matches var(--radius) ~ 12px
                overflow: 'hidden',
                bgcolor: 'white',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: 'text.primary' }}>
                    Menu User
                </Typography>
            </Box>
            <List disablePadding sx={{ p: 1 }}>
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    py: 1, // Reduced from 1.5
                                    px: 1.5, // Reduced from 2
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                        '& .MuiTypography-root': {
                                            fontWeight: 600,
                                            color: 'primary.contrastText',
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: 'grey.50',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: isActive ? 600 : 500
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        href="/handler/sign-out"
                        sx={{
                            borderRadius: 2,
                            py: 1, // Reduced from 1.5
                            px: 1.5, // Reduced from 2
                            color: 'error.main',
                            '&:hover': {
                                bgcolor: 'error.50',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                            <LogOut size={20} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Keluar"
                            primaryTypographyProps={{
                                fontWeight: 500,
                                fontSize: '0.95rem'
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Paper>
    );
}
