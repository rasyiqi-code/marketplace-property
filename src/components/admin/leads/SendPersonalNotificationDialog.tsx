'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { NotificationsActive, Close, Send } from '@mui/icons-material';
import { toast } from 'sonner';

interface SendPersonalNotificationDialogProps {
    userId: string;
    userName: string;
    propertyTitle: string;
    propertyUrl: string;
}

export default function SendPersonalNotificationDialog({
    userId,
    userName,
    propertyTitle,
    propertyUrl
}: SendPersonalNotificationDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(`Info Properti: ${propertyTitle}`);
    const [message, setMessage] = useState(`Halo ${userName}, properti "${propertyTitle}" yang Anda simpan masih tersedia. Silakan cek detailnya.`);
    const [url, setUrl] = useState(propertyUrl);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSend = async () => {
        if (!title || !message) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/web-push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    title,
                    message,
                    url
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send notification');
            }

            if (data.count === 0) {
                toast.warning('User ini belum mengaktifkan notifikasi web.');
            } else {
                toast.success('Notifikasi berhasil dikirim!');
                handleClose();
            }
        } catch (error: any) {
            console.error('Error sending notification:', error);
            toast.error(error.message || 'Gagal mengirim notifikasi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="warning" // Menggunakan warna warning (orange) agar beda dengan WA/Email
                size="small"
                onClick={handleOpen}
                sx={{ minWidth: 0, px: 1 }}
                title="Kirim Web Push Notifikasi"
            >
                <NotificationsActive fontSize="small" />
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsActive color="warning" />
                        Kirim Notifikasi Personal
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Kirim notifikasi langsung ke browser <strong>{userName}</strong>.
                            Pastikan user sudah mengizinkan notifikasi di perangkatnya.
                        </Typography>

                        <TextField
                            label="Judul"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            size="small"
                        />
                        <TextField
                            label="Pesan"
                            fullWidth
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            size="small"
                        />
                        <TextField
                            label="URL Tujuan"
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            size="small"
                            helperText="Halaman yang dibuka saat notifikasi diklik"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">Batal</Button>
                    <Button
                        onClick={handleSend}
                        variant="contained"
                        color="warning"
                        disabled={isLoading}
                        startIcon={<Send />}
                    >
                        {isLoading ? 'Mengirim...' : 'Kirim'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
