'use client';

import * as React from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Grid,
    Button,
    useTheme,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { PropertyCardMUI, PropertyCardSkeleton } from './PropertyCardMUI';
import type { PropertyDTO } from '@/lib/data/properties';

type ShowcaseTab = 'featured' | 'popular' | 'new';

interface PropertyShowcaseProps {
    featuredProperties: PropertyDTO[];
    popularProperties: PropertyDTO[];
    newProperties: PropertyDTO[];
}

/**
 * PropertyShowcase - Section homepage untuk menampilkan properti
 * dengan tabs: Pilihan Kami, Terpopuler, Terbaru
 */
export function PropertyShowcase({
    featuredProperties,
    popularProperties,
    newProperties,
}: PropertyShowcaseProps) {
    const theme = useTheme();
    const [activeTab, setActiveTab] = React.useState<ShowcaseTab>('featured');

    const handleTabChange = (_: React.SyntheticEvent, newValue: ShowcaseTab) => {
        setActiveTab(newValue);
    };

    // Pilih data berdasarkan tab aktif
    const getActiveProperties = (): PropertyDTO[] => {
        switch (activeTab) {
            case 'featured':
                return featuredProperties;
            case 'popular':
                return popularProperties;
            case 'new':
                return newProperties;
            default:
                return featuredProperties;
        }
    };

    const activeProperties = getActiveProperties();

    // Tab label dengan jumlah
    const getTabLabel = (label: string, count: number) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {label}
            <Box
                component="span"
                sx={{
                    backgroundColor: 'grey.200',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                }}
            >
                {count}
            </Box>
        </Box>
    );

    return (
        <Box
            component="section"
            sx={{
                py: 6,
                backgroundColor: 'background.default',
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{ fontWeight: 'bold', mb: 0.5 }}
                        >
                            Temukan Properti Impian
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Cek rekomendasi properti terbaik dari kami
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href="/search"
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        sx={{ mt: { xs: 0, md: 1 } }}
                    >
                        Lihat Semua
                    </Button>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        mb: 4,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            minWidth: 'auto',
                            px: 2,
                        },
                    }}
                >
                    <Tab
                        value="featured"
                        label={getTabLabel('Pilihan Kami', featuredProperties.length)}
                    />
                    <Tab
                        value="popular"
                        label={getTabLabel('Terpopuler', popularProperties.length)}
                    />
                    <Tab
                        value="new"
                        label={getTabLabel('Terbaru', newProperties.length)}
                    />
                </Tabs>

                {/* Property Grid */}
                <Grid container spacing={3}>
                    {activeProperties.length > 0 ? (
                        activeProperties.map((property) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
                                <PropertyCardMUI property={property} />
                            </Grid>
                        ))
                    ) : (
                        // Empty state
                        <Grid size={12}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Belum ada properti
                                </Typography>
                                <Typography variant="body2">
                                    Properti akan segera tersedia
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}

/**
 * PropertyShowcaseSkeleton - Loading state
 */
export function PropertyShowcaseSkeleton() {
    return (
        <Box component="section" sx={{ py: 6, backgroundColor: 'background.default' }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <PropertyCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
