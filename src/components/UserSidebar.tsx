'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Home, LogOut, Zap } from 'lucide-react';
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Button } from '@mui/material';
import { UserStatus } from './navbar/types';

const MENU_ITEMS = [
    {
        label: 'Profil Saya',
        href: '/account-settings',
        icon: <User size={20} />,
    },
    {
        label: 'Properti Saya',
        href: '/my-properties',
        icon: <Home size={20} />,
    },
];

export function UserSidebar({ userStatus }: { userStatus?: UserStatus | null }) {
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

            {userStatus && (
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', m: 1, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                    {/* Background decoration */}
                    <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
                        <Zap size={80} />
                    </Box>

                    <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.9, display: 'block', mb: 1, letterSpacing: 0.5 }}>
                        STATUS LISTING
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                            {userStatus.propertyCount} <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>/ {userStatus.listingLimit}</Typography>
                        </Typography>
                        <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.2)', px: 1, py: 0.2, borderRadius: 1 }}>
                            {userStatus.accountType}
                        </Typography>
                    </Box>

                    <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', mb: 2 }}>
                        <Box
                            sx={{
                                width: `${Math.min((userStatus.propertyCount / userStatus.listingLimit) * 100, 100)}%`,
                                height: '100%',
                                bgcolor: 'white',
                                transition: 'width 0.5s ease'
                            }}
                        />
                    </Box>

                    <Button
                        component={Link}
                        href="/pricing"
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                    >
                        Tingkatkan Kuota
                    </Button>
                </Box>
            )}

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
