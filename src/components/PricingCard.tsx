'use client';

import * as React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Check, Zap, Star, ShieldCheck } from 'lucide-react';

interface PricingCardProps {
    id: string;
    name: string;
    description: string | null;
    price: number;
    listingLimit: number;
    durationDays: number;
    type: string;
    onBuy: (id: string) => void;
    isPending?: boolean;
}

export function PricingCard({
    id,
    name,
    description,
    price,
    listingLimit,
    durationDays,
    type,
    onBuy,
    isPending
}: PricingCardProps) {
    const isPopular = name.toLowerCase().includes('silver') || name.toLowerCase().includes('populer');

    // Format price to IDR
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(price);

    const features = [
        `Kuota listing: ${listingLimit} Properti`,
        `Masa aktif: ${durationDays} Hari`,
        type === 'SUBSCRIPTION' ? 'Perpanjangan otomatis tersedia' : 'Sekali bayar (Top-up)',
        'Support prioritas 24/7',
        'Tampil di hasil pencarian teratas'
    ];

    return (
        <Paper
            elevation={isPopular ? 8 : 1}
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: isPopular ? 'primary.main' : 'divider',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 20
                },
                ...(isPopular && {
                    bgcolor: 'white',
                    '&::before': {
                        content: '"Paling Populer"',
                        position: 'absolute',
                        top: 20,
                        right: -10,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '4px 4px 0 4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(3, 78, 150, 0.3)'
                    }
                })
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {isPopular ? <Star size={20} className="text-amber-500" /> : <ShieldCheck size={20} className="text-slate-400" />}
                    <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'var(--font-heading)' }}>
                        {name}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                    {description || `Posting lebih banyak properti dengan paket ${name}.`}
                </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="900" color="primary.main">
                    {formattedPrice}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {type === 'SUBSCRIPTION' ? 'Sekali Bayar / Berlangganan' : 'Top-up Saldo Listing'}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <List sx={{ mb: 'auto', py: 0 }}>
                {features.map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <Check size={18} className="text-success-main" style={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: index === 0 ? 'bold' : 'normal' }}
                        />
                    </ListItem>
                ))}
            </List>

            <Button
                variant={isPopular ? 'contained' : 'outlined'}
                fullWidth
                size="large"
                startIcon={<Zap size={20} />}
                onClick={() => onBuy(id)}
                disabled={isPending}
                sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem'
                }}
            >
                {isPending ? 'Memproses...' : 'Beli Paket Sekarang'}
            </Button>
        </Paper>
    );
}
