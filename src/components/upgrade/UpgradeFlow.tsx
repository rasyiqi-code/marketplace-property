'use client';

import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    CardActionArea,
    Fade
} from '@mui/material';
import { PricingCard } from '@/components/PricingCard';
import { ManualTransferInstructions } from '@/components/ManualTransferInstructions';
import { CreditCard, Banknote, ArrowLeft } from 'lucide-react';

interface Package {
    id: string;
    name: string;
    price: number;
    description: string | null;
    listingLimit: number;
    durationDays: number;
    type: string;
}

interface UpgradeFlowProps {
    packages: Package[];
}

export function UpgradeFlow({ packages }: UpgradeFlowProps) {
    const [step, setStep] = React.useState<'PACKAGE' | 'METHOD' | 'EXECUTION'>('PACKAGE');
    const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<'DOKU' | 'MANUAL' | null>(null);
    const [orderInfo, setOrderInfo] = React.useState<{ orderId: string, paymentUrl?: string } | null>(null);
    const [isPending, setIsPending] = React.useState(false);

    const handleSelectPackage = (pkg: Package) => {
        setSelectedPackage(pkg);
        setStep('METHOD');
    };

    const handleSelectMethod = (method: 'DOKU' | 'MANUAL') => {
        setPaymentMethod(method);
    };

    const handleNext = async () => {
        if (!selectedPackage || !paymentMethod) return;

        setIsPending(true);
        try {
            const response = await fetch('/api/payment/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    packageId: selectedPackage.id,
                    paymentMethod: paymentMethod
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Checkout gagal');

            setOrderInfo(result);

            if (paymentMethod === 'DOKU' && result.paymentUrl) {
                // Redirect to DOKU Checkout
                window.location.href = result.paymentUrl;
            } else {
                setStep('EXECUTION');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setIsPending(false);
        }
    };

    const handleUploadProof = async (file: File) => {
        if (!orderInfo?.orderId) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderId', orderInfo.orderId);

        const response = await fetch('/api/payment/manual-proof', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
    };

    return (
        <Box>
            {step === 'PACKAGE' && (
                <Fade in={true}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', alignItems: 'stretch' }}>
                        {packages.map((pkg) => (
                            <Box sx={{ width: { xs: '100%', md: '30%' }, minWidth: 280, maxWidth: 400, flexGrow: 1 }} key={pkg.id}>
                                <PricingCard
                                    {...pkg}
                                    onBuy={() => handleSelectPackage(pkg)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Fade>
            )}

            {step === 'METHOD' && selectedPackage && (
                <Fade in={true}>
                    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                        <Button
                            startIcon={<ArrowLeft size={20} />}
                            onClick={() => setStep('PACKAGE')}
                            sx={{ mb: 2 }}
                        >
                            Ganti Paket
                        </Button>
                        <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Pilih Metode Pembayaran</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Anda memilih paket <strong>{selectedPackage.name}</strong> seharga <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPackage.price)}</strong>.
                            </Typography>

                            <Stack spacing={2}>
                                <CardActionArea
                                    onClick={() => handleSelectMethod('DOKU')}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '2px solid',
                                        borderColor: paymentMethod === 'DOKU' ? 'primary.main' : 'divider',
                                        bgcolor: paymentMethod === 'DOKU' ? 'primary.50' : 'transparent'
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <CreditCard className="text-primary-main" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">Pembayaran Otomatis (DOKU)</Typography>
                                            <Typography variant="body2" color="text.secondary">Virtual Account, Kartu Kredit, QRIS, dll.</Typography>
                                        </Box>
                                    </Stack>
                                </CardActionArea>

                                <CardActionArea
                                    onClick={() => handleSelectMethod('MANUAL')}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '2px solid',
                                        borderColor: paymentMethod === 'MANUAL' ? 'primary.main' : 'divider',
                                        bgcolor: paymentMethod === 'MANUAL' ? 'primary.50' : 'transparent'
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Banknote className="text-success-main" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">Transfer Bank Manual</Typography>
                                            <Typography variant="body2" color="text.secondary">Konfirmasi manual oleh admin (1x24 jam).</Typography>
                                        </Box>
                                    </Stack>
                                </CardActionArea>
                            </Stack>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={!paymentMethod || isPending}
                                onClick={handleNext}
                                sx={{ mt: 6, py: 1.5, fontWeight: 'bold' }}
                            >
                                {isPending ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                            </Button>
                        </Paper>
                    </Box>
                </Fade>
            )}

            {step === 'EXECUTION' && orderInfo && selectedPackage && (
                <Fade in={true}>
                    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                        <ManualTransferInstructions
                            amount={selectedPackage.price}
                            orderId={orderInfo.orderId}
                            onUploadProof={handleUploadProof}
                        />
                    </Box>
                </Fade>
            )}
        </Box>
    );
}
