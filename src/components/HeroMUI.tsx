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

import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import { searchProperties, SearchResult } from '@/lib/actions/live-search';
import { useDebounce } from 'use-debounce';

// Default images if no dynamic images are provided
const DEFAULT_HERO_IMAGES = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
];

type PropertyStatus = 'sale' | 'rent' | 'new';

interface HeroMUIProps {
    heroImages?: string[];
}

/**
 * HeroMUI - Hero section dengan MUI components
 * Features: Image slider, search bar, tab filter (Dijual/Disewa/Baru)
 */
export function HeroMUI({ heroImages = [] }: HeroMUIProps) {
    const router = useRouter();
    const imagesToDisplay = heroImages.length > 0 ? heroImages : DEFAULT_HERO_IMAGES;

    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showResults, setShowResults] = React.useState(false);
    const [propertyStatus, setPropertyStatus] = React.useState<PropertyStatus>('sale');

    // Live Search Effect
    React.useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchProperties(debouncedQuery);
                setResults(data);
                setShowResults(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    // Close results when clicking outside (handled simply by specific actions for now, could add ClickAwayListener)
    React.useEffect(() => {
        const handleClickOutside = () => setShowResults(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    // Auto-play slider
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % imagesToDisplay.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [imagesToDisplay.length]);

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

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % imagesToDisplay.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length);

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
                backgroundColor: 'grey.900', // Fallback background
            }}
        >
            {/* Background Slider */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                {imagesToDisplay.map((img, index) => (
                    <Box
                        key={`${img}-${index}`}
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
                {imagesToDisplay.map((_, index) => (
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
                            id="hero-search-input"
                            fullWidth
                            placeholder="Lokasi, keyword, area, project, developer"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                // Reset results if query is cleared
                                if (!e.target.value) setResults([]);
                            }}
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

                        {/* Live Search Results */}
                        {showResults && (results.length > 0 || isLoading) && (
                            <Paper
                                elevation={5}
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    mt: 1,
                                    zIndex: 50,
                                    maxHeight: 400,
                                    overflowY: 'auto',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <List sx={{ p: 0 }}>
                                    {isLoading ? (
                                        <ListItem>
                                            <ListItemText primary="Mencari..." sx={{ textAlign: 'center', color: 'text.secondary' }} />
                                        </ListItem>
                                    ) : (
                                        results.map((prop) => (
                                            <ListItemButton
                                                key={prop.id}
                                                onClick={() => {
                                                    router.push(`/${prop.status === 'sale' ? 'jual' : 'sewa'}/${prop.slug}`);
                                                    setSearchQuery('');
                                                    setResults([]);
                                                }}
                                                divider
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={prop.images ? prop.images.split(',')[0] : undefined}
                                                        alt={prop.title}
                                                        sx={{ width: 56, height: 56, mr: 2 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                                            {prop.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                                {prop.location}
                                                            </Typography>
                                                            <Typography variant="caption" color="primary.main" fontWeight="bold">
                                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(prop.price))}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItemButton>
                                        ))
                                    )}
                                </List>
                            </Paper>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, width: '100%' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSearch}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                minWidth: { xs: '100%', md: 120 },
                                width: { xs: '100%', md: 'auto' }
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
