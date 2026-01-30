'use client';

import * as React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
    Skeleton,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Bed,
    Bathtub,
    SquareFoot,
    LocationOn,
} from '@mui/icons-material';
import Link from 'next/link';
import type { PropertyDTO } from '@/lib/data/properties';

interface PropertyCardMUIProps {
    property: PropertyDTO;
    showWishlist?: boolean;
    isWishlisted?: boolean;
    onWishlistToggle?: (id: string) => void;
}

/**
 * PropertyCardMUI - Card properti menggunakan Material UI
 * Menampilkan gambar, harga, lokasi, dan spesifikasi properti
 */
export function PropertyCardMUI({
    property,
    showWishlist = true,
    isWishlisted = false,
    onWishlistToggle,
}: PropertyCardMUIProps) {
    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onWishlistToggle?.(property.id);
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
            }}
        >
            <CardActionArea
                component={Link}
                href={`/property/${property.id}`}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {/* Image Container */}
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={property.imageUrl || '/images/placeholder.jpg'}
                        alt={property.title}
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* Status Badge */}
                    <Chip
                        label={property.status === 'sale' ? 'Dijual' : 'Disewa'}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            fontWeight: 'bold',
                            backgroundColor: property.status === 'sale' ? 'primary.main' : 'secondary.main',
                            color: 'white',
                        }}
                    />

                    {/* Wishlist Button */}
                    {showWishlist && (
                        <Tooltip title={isWishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}>
                            <IconButton
                                onClick={handleWishlistClick}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                }}
                                size="small"
                            >
                                {isWishlisted ? (
                                    <Favorite sx={{ color: 'secondary.main' }} />
                                ) : (
                                    <FavoriteBorder sx={{ color: 'grey.600' }} />
                                )}
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Price */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}
                    >
                        {property.price}
                    </Typography>

                    {/* Title */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3,
                            minHeight: '2.6em',
                        }}
                    >
                        {property.title}
                    </Typography>

                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                        <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" noWrap>
                            {property.location}
                        </Typography>
                    </Box>

                    {/* Specs */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mt: 'auto',
                            pt: 1.5,
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Bed sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {property.bedrooms}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Bathtub sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {property.bathrooms}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <SquareFoot sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {property.area} m²
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

/**
 * PropertyCardSkeleton - Loading state untuk PropertyCardMUI
 */
export function PropertyCardSkeleton() {
    return (
        <Card sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Skeleton variant="text" width={40} />
                    <Skeleton variant="text" width={40} />
                    <Skeleton variant="text" width={60} />
                </Box>
            </CardContent>
        </Card>
    );
}
