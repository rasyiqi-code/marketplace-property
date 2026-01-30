'use client';


import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { OfferModal } from './OfferModal';

interface TransactionButtonProps {
    propertyId: string;
    isOwner: boolean;
    status: 'sale' | 'rent';
    price: number; // Need price for modal
}

export function TransactionButton({ propertyId, isOwner, status, price }: TransactionButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showNego, setShowNego] = useState(false);

    const handleTransaction = async () => {
        if (!confirm(`Apakah Anda yakin ingin mengajukan ${status === 'sale' ? 'pembelian' : 'penyewaan'} langsung di harga listing?`)) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create transaction');
            }

            alert('Permintaan transaksi berhasil dibuat! Silakan cek dashboard Anda.');
            router.push('/transactions');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Gagal membuat transaksi. Pastikan Anda sudah login.');
            if (error.message.includes('Unauthorized')) {
                window.location.href = '/handler/sign-in';
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isOwner) {
        return (
            <button disabled className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <ShoppingCart size={20} />
                Properti Anda Sendiri
            </button>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleTransaction}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
            >
                <ShoppingCart size={20} />
                {isLoading ? 'Memproses...' : (status === 'sale' ? 'Beli Langsung' : 'Sewa Langsung')}
            </button>

            {status === 'sale' && (
                <button
                    onClick={() => setShowNego(true)}
                    className="w-full bg-white border-2 border-primary text-primary hover:bg-primary/5 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Nego Harga
                </button>
            )}

            <OfferModal
                isOpen={showNego}
                onClose={() => setShowNego(false)}
                propertyId={propertyId}
                listingPrice={price}
            />
        </div>
    );
}

