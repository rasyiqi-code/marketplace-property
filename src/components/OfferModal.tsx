'use client';

import { useState } from 'react';
import { X, DollarSign, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OfferModalProps {
    propertyId: string;
    listingPrice: number;
    isOpen: boolean;
    onClose: () => void;
    propertyStatus?: 'sale' | 'rent';
}

export function OfferModal({ propertyId, listingPrice, isOpen, onClose, propertyStatus = 'sale' }: OfferModalProps) {
    const router = useRouter();
    const [amount, setAmount] = useState(listingPrice);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId, amount, message }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit offer');
            }

            alert('Penawaran berhasil dikirim! Pantau statusnya di Dashboard.');
            router.push('/transactions?tab=offers');
            onClose();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
            alert(message);
            if (message.includes('Unauthorized')) {
                window.location.href = '/handler/sign-in';
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold font-heading mb-1">Ajukan Penawaran {propertyStatus === 'rent' ? 'Sewa' : 'Harga'}</h2>
                <p className="text-gray-500 text-sm mb-6">Mulai negosiasi {propertyStatus === 'rent' ? 'harga sewa' : 'harga'} dengan penjual.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Harga Penawaran {propertyStatus === 'rent' ? '(per Periode)' : ''} (IDR)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="number"
                                required
                                min={listingPrice * 0.5} // Example validation
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Listing Price: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(listingPrice)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pesan untuk Penjual</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                            <textarea
                                required
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Halo, saya tertarik dengan properti ini. Apakah harga bisa nego?"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Mengirim...' : 'Kirim Penawaran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
