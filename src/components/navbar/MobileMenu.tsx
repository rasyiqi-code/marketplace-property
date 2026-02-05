'use client';

import * as React from 'react';
import {
    Box,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
} from '@mui/material';
import {
    AddCircleOutline,
    Person,
    Logout,
    ShoppingCart,
    House,
} from '@mui/icons-material';
import Link from 'next/link';
import { NavbarUser, UserStatus } from './types';
import { NAV_LINKS } from './constants';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    user: NavbarUser | null;
    userStatus?: UserStatus | null;
}

export function MobileMenu({ open, onClose, user, userStatus }: MobileMenuProps) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Box sx={{ width: 280 }} role="presentation">
                <Box sx={{ p: 2, backgroundColor: 'primary.main' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        ProEstate
                    </Typography>
                </Box>
                <List>
                    {NAV_LINKS.map((link) => (
                        <ListItem key={link.href} disablePadding>
                            <ListItemButton
                                component={Link}
                                href={link.href}
                                onClick={onClose}
                            >
                                <ListItemText primary={link.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            href="/post-ad"
                            onClick={onClose}
                        >
                            <AddCircleOutline sx={{ mr: 1 }} />
                            <ListItemText primary="Pasang Iklan" />
                        </ListItemButton>
                    </ListItem>
                    {userStatus && (
                        <Box sx={{ px: 2, py: 2, bgcolor: 'grey.50', mx: 2, my: 1, borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                                KUOTA LISTING
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    {userStatus.propertyCount} / {userStatus.listingLimit} Terpakai
                                </Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden', mb: 1.5 }}>
                                <Box
                                    sx={{
                                        width: `${Math.min((userStatus.propertyCount / userStatus.listingLimit) * 100, 100)}%`,
                                        height: '100%',
                                        bgcolor: userStatus.propertyCount >= userStatus.listingLimit ? 'error.main' : 'primary.main',
                                    }}
                                />
                            </Box>
                            <Button
                                component={Link}
                                href="/pricing"
                                fullWidth
                                variant="outlined"
                                size="small"
                                onClick={onClose}
                                sx={{ fontSize: '0.75rem' }}
                            >
                                {userStatus.propertyCount >= userStatus.listingLimit ? 'Upgrade Paket' : 'Tambah Kuota'}
                            </Button>
                        </Box>
                    )}
                    {user ? (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href="/account-settings"
                                    onClick={onClose}
                                >
                                    <Person sx={{ mr: 1 }} />
                                    <ListItemText primary="Profil Saya" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href="/transactions"
                                    onClick={onClose}
                                >
                                    <ShoppingCart sx={{ mr: 1 }} />
                                    <ListItemText primary="Pesanan & Nego" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href="/my-properties"
                                    onClick={onClose}
                                >
                                    <House sx={{ mr: 1 }} />
                                    <ListItemText primary="Properti Saya" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href="/handler/sign-out"
                                    onClick={onClose}
                                >
                                    <Logout sx={{ mr: 1 }} />
                                    <ListItemText primary="Keluar" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                href="/handler/sign-in"
                                onClick={onClose}
                            >
                                <Person sx={{ mr: 1 }} />
                                <ListItemText primary="Masuk" />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Box>
        </Drawer>
    );
}
