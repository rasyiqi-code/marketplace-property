'use client';

import * as React from 'react';
import { Box, Container, Typography, Grid, Paper, ButtonBase } from '@mui/material';
import { Home, Domain, Business, Landscape, Apartment, Store } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface CategoryCount {
    name: string;
    count: number;
}

interface CategorySectionProps {
    categories: CategoryCount[];
}

const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('rumah')) return <Home fontSize="large" />;
    if (lower.includes('apartemen')) return <Apartment fontSize="large" />;
    if (lower.includes('ruko')) return <Store fontSize="large" />;
    if (lower.includes('kantor')) return <Business fontSize="large" />;
    if (lower.includes('tanah')) return <Landscape fontSize="large" />;
    return <Domain fontSize="large" />; // Default
};

const getCategoryColor = (index: number) => {
    const colors = ['#034E96', '#FED700', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
    return colors[index % colors.length];
};

export function CategorySection({ categories }: CategorySectionProps) {
    const router = useRouter();

    const handleCategoryClick = (name: string) => {
        router.push(`/search?type=${encodeURIComponent(name)}`);
    };

    // If no categories, show nothing or a default empty state
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'grey.900' }}>
                        Cari Berdasarkan Tipe
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'grey.600', maxWidth: 600, mx: 'auto' }}>
                        Temukan berbagai pilihan properti yang sesuai dengan kebutuhan Anda melalui kategori pilihan kami.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {categories.map((cat, index) => {
                        const color = getCategoryColor(index);
                        return (
                            <Grid size={{ xs: 6, md: 3 }} key={index}>
                                <ButtonBase
                                    onClick={() => handleCategoryClick(cat.name)}
                                    sx={{
                                        width: '100%',
                                        textAlign: 'left',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        display: 'block',
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            border: '1px solid',
                                            borderColor: 'grey.200',
                                            borderRadius: 4,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                borderColor: color,
                                                boxShadow: `0 8px 16px ${color}15`,
                                                '& .icon-box': {
                                                    backgroundColor: color,
                                                    color: 'white',
                                                    transform: 'scale(1.1)',
                                                },
                                            },
                                        }}
                                    >
                                        <Box
                                            className="icon-box"
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 3,
                                                backgroundColor: 'grey.50',
                                                color: 'grey.700',
                                                display: 'flex',
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {getCategoryIcon(cat.name)}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'grey.900' }}>
                                            {cat.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'grey.500', mt: 0.5 }}>
                                            {cat.count} Properti
                                        </Typography>
                                    </Paper>
                                </ButtonBase>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}
