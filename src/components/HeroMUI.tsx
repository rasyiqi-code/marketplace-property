'use client';

import * as React from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    Paper,
    IconButton,
} from '@mui/material';
import {
    Search,
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Gambar hero - bisa diganti dengan gambar properti asli
const HERO_IMAGES = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
];

type PropertyStatus = 'sale' | 'rent' | 'new';

/**
 * HeroMUI - Hero section dengan MUI components
 * Features: Image slider, search bar, tab filter (Dijual/Disewa/Baru)
 */
export function HeroMUI() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [propertyStatus, setPropertyStatus] = React.useState<PropertyStatus>('sale');

    // Auto-play slider
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('query', searchQuery);
        if (propertyStatus !== 'new') {
            params.set('status', propertyStatus);
        } else {
            params.set('sort', 'newest');
        }
        router.push(`/search?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleStatusChange = (
        _: React.MouseEvent<HTMLElement>,
        newStatus: PropertyStatus | null,
    ) => {
        if (newStatus) setPropertyStatus(newStatus);
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

    return (
        <Box
            sx={{
                position: 'relative',
                height: { xs: 500, md: 600 },
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: { xs: 4, md: 6 },
                overflow: 'hidden',
            }}
        >
            {/* Background Slider */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                {HERO_IMAGES.map((img, index) => (
                    <Box
                        key={img}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            opacity: currentSlide === index ? 1 : 0,
                            transition: 'opacity 1s ease-in-out',
                        }}
                    >
                        <Image
                            src={img}
                            alt={`Hero Slide ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority={index === 0}
                        />
                        {/* Dark Overlay */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                            }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Navigation Arrows */}
            <IconButton
                onClick={prevSlide}
                sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.4)',
                    },
                }}
            >
                <ChevronLeft fontSize="large" />
            </IconButton>
            <IconButton
                onClick={nextSlide}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.4)',
                    },
                }}
            >
                <ChevronRight fontSize="large" />
            </IconButton>

            {/* Slide Indicators */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    display: 'flex',
                    gap: 1,
                }}
            >
                {HERO_IMAGES.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                            width: currentSlide === index ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    />
                ))}
            </Box>

            {/* Search Container */}
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 3, md: 4 },
                        background: 'linear-gradient(135deg, rgba(3,78,150,0.95) 0%, rgba(3,60,120,0.95) 100%)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 3,
                    }}
                >
                    {/* Title */}
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 2,
                        }}
                    >
                        Jual Beli dan Sewa Properti Jadi Mudah
                    </Typography>

                    {/* Status Tabs */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <ToggleButtonGroup
                            value={propertyStatus}
                            exclusive
                            onChange={handleStatusChange}
                            sx={{
                                '& .MuiToggleButton-root': {
                                    color: 'rgba(255,255,255,0.7)',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    px: 3,
                                    py: 1,
                                    '&.Mui-selected': {
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        borderColor: 'white',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="sale">Dijual</ToggleButton>
                            <ToggleButton value="rent">Disewa</ToggleButton>
                            <ToggleButton value="new">Properti Baru</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Search Input */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 1.5,
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Lokasi, keyword, area, project, developer"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="action" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSearch}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                minWidth: { xs: '100%', md: 120 },
                            }}
                        >
                            Cari
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
