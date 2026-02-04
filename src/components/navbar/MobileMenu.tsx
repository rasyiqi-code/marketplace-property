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
} from '@mui/material';
import {
    AddCircleOutline,
    Person,
    Logout,
    ShoppingCart,
    House,
} from '@mui/icons-material';
import Link from 'next/link';
import { NavbarUser } from './types';
import { NAV_LINKS } from './constants';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    user: NavbarUser | null;
}

export function MobileMenu({ open, onClose, user }: MobileMenuProps) {
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
