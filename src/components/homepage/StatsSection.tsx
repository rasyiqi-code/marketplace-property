'use client';

import * as React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { Home, People, CheckCircle, TrendingUp } from '@mui/icons-material';

interface StatsSectionProps {
    stats: {
        activeListings: number;
        registeredUsers: number;
        successfulTransactions: number;
        totalViews: number;
    };
}

export function StatsSection({ stats }: StatsSectionProps) {
    const STATS = [
        { label: 'Listing Aktif', value: `${stats.activeListings}+`, icon: <Home sx={{ fontSize: 40 }} />, color: '#034E96' },
        { label: 'Pengguna Terdaftar', value: `${stats.registeredUsers}+`, icon: <People sx={{ fontSize: 40 }} />, color: '#FED700' },
        { label: 'Transaksi Sukses', value: `${stats.successfulTransactions}+`, icon: <CheckCircle sx={{ fontSize: 40 }} />, color: '#4CAF50' },
        { label: 'Total Views', value: `${stats.totalViews.toLocaleString()}`, icon: <TrendingUp sx={{ fontSize: 40 }} />, color: '#F44336' },
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {STATS.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                    },
                                    border: '1px solid',
                                    borderColor: 'grey.100',
                                }}
                            >
                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        borderRadius: '50%',
                                        backgroundColor: `${stat.color}15`,
                                        color: stat.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'grey.900' }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'grey.600', fontWeight: 500 }}>
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box >
    );
}
