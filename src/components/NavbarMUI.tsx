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
    Drawer,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
    Avatar,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    AddCircleOutline,
    Person,
    Logout,
    ArrowDropDown,
    ShoppingCart,
    House,
} from '@mui/icons-material';
import Link from 'next/link';

export interface NavbarUser {
    id: string;
    displayName?: string | null;
    primaryEmail?: string | null;
    profileImageUrl?: string | null;
}

interface NavbarMUIProps {
    user: NavbarUser | null;
}

const NAV_LINKS = [
    { label: 'Dijual', href: '/search?status=sale' },
    { label: 'Disewa', href: '/search?status=rent' },
    { label: 'Properti Baru', href: '/search?sort=newest' },
    { label: 'KPR', href: '/kpr' },
];

/**
 * NavbarMUI - Navbar menggunakan Material UI + Stack Auth
 * Client component karena menggunakan menu/drawer
 */
export function NavbarMUI({ user }: NavbarMUIProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    // Nama user dari Stack Auth
    const displayName = user?.displayName || user?.primaryEmail?.split('@')[0] || 'User';

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
                <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
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
                                    <>
                                        <Button
                                            onClick={(e) => setAnchorEl(e.currentTarget)}
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
                                            onClose={() => setAnchorEl(null)}
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
                                            <MenuItem component={Link} href="/account-settings" onClick={() => setAnchorEl(null)}>
                                                <Person fontSize="small" sx={{ mr: 1.5 }} /> Profil Saya
                                            </MenuItem>
                                            <MenuItem component={Link} href="/transactions" onClick={() => setAnchorEl(null)}>
                                                <ShoppingCart fontSize="small" sx={{ mr: 1.5 }} /> Pesanan & Nego
                                            </MenuItem>
                                            <MenuItem component={Link} href="/my-properties" onClick={() => setAnchorEl(null)}>
                                                <House fontSize="small" sx={{ mr: 1.5 }} /> Properti Saya
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem component={Link} href="/handler/sign-out" onClick={() => setAnchorEl(null)}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Keluar
                                            </MenuItem>
                                        </Menu>
                                    </>
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
                                onClick={toggleDrawer(true)}
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
                            py: 1,
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

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
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
                                    onClick={toggleDrawer(false)}
                                >
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                href="/post-ad"
                                onClick={toggleDrawer(false)}
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
                                        onClick={toggleDrawer(false)}
                                    >
                                        <Person sx={{ mr: 1 }} />
                                        <ListItemText primary="Profil Saya" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href="/transactions"
                                        onClick={toggleDrawer(false)}
                                    >
                                        <ShoppingCart sx={{ mr: 1 }} />
                                        <ListItemText primary="Pesanan & Nego" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href="/my-properties"
                                        onClick={toggleDrawer(false)}
                                    >
                                        <House sx={{ mr: 1 }} />
                                        <ListItemText primary="Properti Saya" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href="/handler/sign-out"
                                        onClick={toggleDrawer(false)}
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
                                    onClick={toggleDrawer(false)}
                                >
                                    <Person sx={{ mr: 1 }} />
                                    <ListItemText primary="Masuk" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
