'use client';

import { useState } from 'react';
import { Button, TextField, Box, Typography, Paper, Alert } from '@mui/material';
import { Send, NotificationsActive } from '@mui/icons-material';
import { toast } from 'sonner';

export default function SendNotificationForm() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('/');
    const [isLoading, setIsLoading] = useState(false);
    const [lastResult, setLastResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLastResult(null);

        try {
            const res = await fetch('/api/web-push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message, url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send notification');
            }

            setLastResult({ success: true, count: data.count });
            toast.success(`Berhasil mengirim ke ${data.count} subscriber!`);

            // Reset form
            setTitle('');
            setMessage('');
            setUrl('/');
        } catch (error: unknown) {
            console.error('Error sending notification:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setLastResult({ success: false, error: errorMessage });
            toast.error('Gagal mengirim notifikasi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <NotificationsActive color="primary" fontSize="large" />
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        Kirim Notifikasi Broadcast
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Kirim notifikasi ke semua user yang telah subscribe.
                    </Typography>
                </Box>
            </Box>

            {lastResult && (
                <Alert severity={lastResult.success ? 'success' : 'error'} sx={{ mb: 3 }}>
                    {lastResult.success
                        ? `Notifikasi berhasil dikirim ke ${lastResult.count} perangkat.`
                        : `Gagal mengirim: ${lastResult.error}`}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Judul Notifikasi"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                        size="small"
                        placeholder="Contoh: Promo Spesial Hari Ini!"
                    />

                    <TextField
                        label="Pesan"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        placeholder="Contoh: Dapatkan diskon 50% untuk upgrade akun pro..."
                    />

                    <TextField
                        label="Target URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        fullWidth
                        size="small"
                        helperText="Halaman yang akan dibuka saat notifikasi diklik"
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            startIcon={<Send />}
                            sx={{ minWidth: 120 }}
                        >
                            {isLoading ? 'Mengirim...' : 'Kirim Broadcast'}
                        </Button>
                    </Box>
                </Box>
            </form>
        </Paper>
    );
}
