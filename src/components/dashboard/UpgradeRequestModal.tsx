'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface UpgradeRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UpgradeRequestModal({ isOpen, onClose, onSuccess }: UpgradeRequestModalProps) {
    const [requestedType, setRequestedType] = useState<'AGENT' | 'AGENCY'>('AGENT');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/user/upgrade-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestedType, reason }),
            });

            const data = await res.json();

            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    // Reset state
                    setShowSuccess(false);
                    setReason('');
                    setRequestedType('AGENT');
                }, 2500);
            } else {
                setErrorMessage(data.error || 'Gagal mengirim request.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Terjadi kesalahan network. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !showSuccess) {
            setErrorMessage('');
            setReason('');
            setRequestedType('AGENT');
            onClose();
        }
    };

    if (!isOpen) return null;

    // Success State
    if (showSuccess) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">
                            Request Berhasil Dikirim!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Request upgrade Anda telah diterima dan sedang menunggu review dari admin.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Status:</strong> Menunggu Review Admin
                            </p>
                            <p className="text-xs text-yellow-600 mt-1">
                                Kami akan segera mereview kredensial Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form State
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-heading text-gray-900">
                        Request Upgrade Akun
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Upgrade akun Anda ke Agent atau Agency untuk mendapatkan verified badge dan meningkatkan kredibilitas listing Anda.
                </p>

                {/* Error Alert */}
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-800">Gagal mengirim request</p>
                            <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                        </div>
                        <button
                            onClick={() => setErrorMessage('')}
                            className="text-red-400 hover:text-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Tipe Akun yang Diinginkan
                        </label>
                        <select
                            value={requestedType}
                            onChange={(e) => setRequestedType(e.target.value as any)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="AGENT">Agent Properti</option>
                            <option value="AGENCY">Agency Properti</option>
                        </select>
                        <p className="text-xs text-gray-400">
                            {requestedType === 'AGENT'
                                ? 'Untuk agen properti individual profesional'
                                : 'Untuk perusahaan/agensi properti'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Alasan & Kredensial
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Jelaskan pengalaman Anda di bidang properti, sertifikasi yang dimiliki, atau informasi perusahaan..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                            required
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-400">
                            Admin akan review kredensial Anda sebelum menyetujui upgrade.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={20} /> Mengirim...</>
                            ) : (
                                <><Send size={20} /> Kirim Request</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
