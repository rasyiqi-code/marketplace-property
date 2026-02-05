'use client';

import * as React from 'react';
import {
    Button,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import {
    Person,
    Logout,
    ArrowDropDown,
    House,
} from '@mui/icons-material';
import Link from 'next/link';
import { NavbarUser, UserStatus } from './types';

interface UserMenuProps {
    user: NavbarUser;
    userStatus?: UserStatus | null;
}

export function UserMenu({ user, userStatus }: UserMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const displayName = user.displayName || user.primaryEmail?.split('@')[0] || 'User';

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <Button
                onClick={handleOpen}
                variant="contained"
                startIcon={
                    <Avatar
                        src={user.profileImageUrl || undefined}
                        sx={{
                            width: 24,
                            height: 24,
                            fontSize: '0.8rem',
                            bgcolor: 'primary.main',
                        }}
                    >
                        {displayName[0]?.toUpperCase()}
                    </Avatar>
                }
                endIcon={<ArrowDropDown />}
                sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'grey.100',
                    },
                }}
            >
                {displayName.split(' ')[0]}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {userStatus && (
                    <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                            KUOTA LISTING
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight="bold">
                                {userStatus.propertyCount} / {userStatus.listingLimit}
                            </Typography>
                            <Typography variant="caption" color={userStatus.propertyCount >= userStatus.listingLimit ? 'error.main' : 'primary.main'} fontWeight="bold">
                                {userStatus.propertyCount >= userStatus.listingLimit ? 'Penuh' : 'Tersedia'}
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 6, bgcolor: 'grey.100', borderRadius: 3, overflow: 'hidden' }}>
                            <Box
                                sx={{
                                    width: `${Math.min((userStatus.propertyCount / userStatus.listingLimit) * 100, 100)}%`,
                                    height: '100%',
                                    bgcolor: userStatus.propertyCount >= userStatus.listingLimit ? 'error.main' : 'primary.main',
                                    transition: 'width 0.5s ease-out'
                                }}
                            />
                        </Box>
                        {userStatus.propertyCount >= userStatus.listingLimit && (
                            <Button
                                component={Link}
                                href="/pricing"
                                fullWidth
                                variant="contained"
                                size="small"
                                sx={{ mt: 1.5, fontSize: '0.7rem', py: 0.5 }}
                                onClick={handleClose}
                            >
                                Upgrade Sekarang
                            </Button>
                        )}
                    </Box>
                )}
                {userStatus && <Divider />}
                <MenuItem component={Link} href="/account-settings" onClick={handleClose}>
                    <Person fontSize="small" sx={{ mr: 1.5 }} /> Profil Saya
                </MenuItem>
                <MenuItem component={Link} href="/my-properties" onClick={handleClose}>
                    <House fontSize="small" sx={{ mr: 1.5 }} /> Properti Saya
                </MenuItem>
                <Divider />
                <MenuItem component={Link} href="/handler/sign-out" onClick={handleClose}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Keluar
                </MenuItem>
            </Menu>
        </>
    );
}
