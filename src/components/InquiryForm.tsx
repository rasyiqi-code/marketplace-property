'use client';

import * as React from 'react';
import { useActionState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Stack,
    Fade
} from '@mui/material';
import { Send, CheckCircle } from 'lucide-react';
import { submitInquiry, InquiryState } from '@/lib/actions/inquiry';

interface InquiryFormProps {
    propertyId: string;
    propertyTitle: string;
}

const initialState: InquiryState = {};

export function InquiryForm({ propertyId, propertyTitle }: InquiryFormProps) {
    const [state, formAction, isPending] = useActionState(submitInquiry, initialState);

    if (state.success) {
        return (
            <Fade in={true}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: 'success.50',
                        border: '1px solid',
                        borderColor: 'success.light',
                        borderRadius: 3
                    }}
                >
                    <CheckCircle size={48} className="text-success-main mb-3 mx-auto" style={{ color: '#2e7d32' }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                        Pesan Terkirim!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Pertanyaan Anda mengenai <strong>{propertyTitle}</strong> telah terkirim. Penjual akan segera menghubungi Anda melalui email atau telepon.
                    </Typography>
                    <Button
                        onClick={() => window.location.reload()}
                        sx={{ mt: 3 }}
                        variant="outlined"
                        size="small"
                        color="success"
                    >
                        Kirim Pesan Lain
                    </Button>
                </Paper>
            </Fade>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: 'var(--font-heading)' }}>
                Minat dengan Properti Ini?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Isi formulir di bawah ini untuk mendapatkan informasi lebih lanjut atau menjadwalkan kunjungan.
            </Typography>

            <form action={formAction}>
                <input type="hidden" name="propertyId" value={propertyId} />

                <Stack spacing={2.5}>
                    {state.error && <Alert severity="error">{state.error}</Alert>}

                    <TextField
                        fullWidth
                        label="Nama Lengkap"
                        name="name"
                        variant="outlined"
                        required
                        error={!!state.errors?.name}
                        helperText={state.errors?.name?.[0]}
                        disabled={isPending}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Alamat Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        required
                        error={!!state.errors?.email}
                        helperText={state.errors?.email?.[0]}
                        disabled={isPending}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Nomor Telepon (WhatsApp)"
                        name="phone"
                        variant="outlined"
                        placeholder="Contoh: 08123456789"
                        error={!!state.errors?.phone}
                        helperText={state.errors?.phone?.[0]}
                        disabled={isPending}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Tulis Pesan Anda"
                        name="message"
                        multiline
                        rows={4}
                        variant="outlined"
                        required
                        defaultValue={`Halo, saya tertarik dengan properti "${propertyTitle}". Apakah masih tersedia?`}
                        error={!!state.errors?.message}
                        helperText={state.errors?.message?.[0]}
                        disabled={isPending}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isPending}
                        startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                        sx={{
                            py: 1.5,
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(3, 78, 150, 0.2)'
                        }}
                    >
                        {isPending ? 'Mengirim...' : 'Kirim Pertanyaan'}
                    </Button>
                </Stack>
            </form>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                Data Anda aman dan hanya akan diteruskan ke penjual properti ini.
            </Typography>
        </Paper>
    );
}
