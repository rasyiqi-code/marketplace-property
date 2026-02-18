'use client';

import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Divider,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { Copy, Upload, CheckCircle } from 'lucide-react';

interface ManualTransferInstructionsProps {
    amount: number;
    orderId: string;
    onUploadProof: (file: File) => Promise<void>;
}

export function ManualTransferInstructions({ amount, orderId, onUploadProof }: ManualTransferInstructionsProps) {
    const [file, setFile] = React.useState<File | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const accounts = [
        { bank: 'BCA', number: '1234567890', owner: 'PT ProEstate Digital' },
        { bank: 'Mandiri', number: '0987654321', owner: 'PT ProEstate Digital' }
    ];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Nomor rekening berhasil disalin!');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            await onUploadProof(file);
            setIsSuccess(true);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Gagal mengunggah bukti. Silakan coba lagi.');
        } finally {
            setIsUploading(false);
        }
    };

    if (isSuccess) {
        return (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid', borderColor: 'success.light', bgcolor: 'success.50' }}>
                <CheckCircle size={48} className="text-success-main mb-3 mx-auto" style={{ color: '#2e7d32' }} />
                <Typography variant="h6" fontWeight="bold">Bukti Terkirim!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Terima kasih. Admin kami akan melakukan verifikasi dalam waktu maksimal 1x24 jam.
                    Status paket Anda akan diperbarui secara otomatis.
                </Typography>
                <Button variant="contained" color="success" sx={{ mt: 3 }} onClick={() => window.location.href = '/my-properties'}>
                    Kembali ke Dashboard
                </Button>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Instruksi Transfer Manual</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Silakan transfer tepat sejumlah <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}</strong> ke salah satu rekening berikut:
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
                {accounts.map((acc, index) => (
                    <Box key={index} sx={{ p: 2, bgcolor: 'slate.50', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{acc.bank}</Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>{acc.number}</Typography>
                            <Typography variant="caption" color="text.secondary">a.n {acc.owner}</Typography>
                        </Box>
                        <Button size="small" startIcon={<Copy size={16} />} onClick={() => handleCopy(acc.number)}>Salin</Button>
                    </Box>
                ))}
            </Stack>

            <Alert severity="info" sx={{ mb: 4 }}>
                Sertakan kode referensi <strong>{orderId}</strong> pada berita acara transfer jika tersedia.
            </Alert>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Upload Bukti Transfer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Agar proses verifikasi lebih cepat, harap lampirkan bukti transfer Anda di sini.
            </Typography>

            <Box
                component="label"
                sx={{
                    display: 'block',
                    p: 4,
                    border: '2px dashed',
                    borderColor: file ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: file ? 'primary.50' : 'transparent',
                    '&:hover': { bgcolor: 'slate.50' }
                }}
            >
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                <Upload size={32} className="mx-auto mb-2 text-slate-400" />
                <Typography variant="body2" fontWeight="medium">
                    {file ? file.name : 'Klik untuk pilih file atau seret gambar ke sini'}
                </Typography>
                <Typography variant="caption" color="text.secondary">PNG, JPG (Maks. 2MB)</Typography>
            </Box>

            <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!file || isUploading}
                onClick={handleSubmit}
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
            >
                {isUploading ? 'Sedang Mengunggah...' : 'Konfirmasi Pembayaran'}
            </Button>
        </Paper>
    );
}
