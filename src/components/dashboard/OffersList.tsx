'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, MessageSquare, Check, X, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OfferDTO {
    id: string;
    amount: number;
    status: string;
    propertyTitle: string;
    propertyId: string;
    buyerName: string;
    buyerId: string;
    sellerId: string;
    createdAt: string;
    propertyImage: string | null;
    historyCount: number;
}

import { OfferHistoryModal } from '@/components/OfferHistoryModal';

interface OffersListProps {
    type: 'sent' | 'received';
}

export function OffersList({ type }: OffersListProps) {
    const router = useRouter();
    const [offers, setOffers] = useState<OfferDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // History Modal State
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/offers?type=${type}`);
            if (res.ok) {
                const data = await res.json();
                setOffers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [type]);

    const handleAction = async (offerId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER') => {
        let amount = undefined;
        let message = undefined;

        if (action === 'COUNTER') {
            const input = prompt('Masukkan harga penawaran baru (Counter Offer):');
            if (!input) return;
            amount = Number(input);
            if (isNaN(amount) || amount <= 0) {
                alert('Harga tidak valid');
                return;
            }
        }

        if (action === 'REJECT') {
            if (!confirm('Apakah Anda yakin ingin menolak penawaran ini?')) return;
        }

        if (action === 'ACCEPT') {
            if (!confirm('Terima penawaran ini dan buat transaksi?')) return;
        }

        setActionLoading(offerId);
        try {
            const res = await fetch(`/api/offers/${offerId}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, amount, message }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (data.success) {
                alert(`Berhasil: ${action}`);
                fetchOffers();
                router.refresh(); // Refresh server components if any
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const openHistory = (id: string) => {
        setSelectedOfferId(id);
        setShowHistory(true);
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline text-primary" /></div>;

    if (offers.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {type === 'sent' ? 'Anda belum mengajukan penawaran apapun.' : 'Belum ada penawaran masuk.'}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {offers.map((offer) => (
                <div key={offer.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                            src={offer.propertyImage || '/images/placeholder.jpg'}
                            alt={offer.propertyTitle}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                offer.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    offer.status === 'COUNTERED' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                }`}>
                                {offer.status}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(offer.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 truncate">{offer.propertyTitle}</h3>
                        <div className="text-sm text-gray-500">
                            {type === 'sent' ? `Seller: User ...` : `Buyer: ${offer.buyerName}`}
                        </div>
                        <div className="mt-1 font-bold text-primary font-heading">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(offer.amount)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        {['PENDING', 'COUNTERED'].includes(offer.status) && (
                            <div className="flex gap-2">
                                {/* Logic: Who can act? 
                                    If type='received' (Seller viewing), can ACCEPT, REJECT, COUNTER.
                                    If type='sent' (Buyer viewing), can REJECT (Cancel), COUNTER (if status is COUNTERED?). 
                                    Ideally, we check turn based on who sent last, but for simplicity let's allow Counter anytime or just simpler flow.
                                */}

                                <button
                                    disabled={!!actionLoading}
                                    onClick={() => handleAction(offer.id, 'ACCEPT')}
                                    className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Check size={14} /> Terima
                                </button>
                                <button
                                    disabled={!!actionLoading}
                                    onClick={() => handleAction(offer.id, 'COUNTER')}
                                    className="flex-1 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-1"
                                >
                                    <RefreshCw size={14} /> Nego
                                </button>
                                <button
                                    disabled={!!actionLoading}
                                    onClick={() => handleAction(offer.id, 'REJECT')}
                                    className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                >
                                    <X size={14} /> Tolak
                                </button>
                            </div>
                        )}
                        {offer.status === 'ACCEPTED' && (
                            <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg text-center">
                                Deal Closed &rarr; <a href="/transactions" className="underline hover:text-green-800">Cek Transaksi</a>
                            </div>
                        )}

                        <button
                            onClick={() => openHistory(offer.id)}
                            className="text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 py-1"
                        >
                            <MessageSquare size={12} /> Lihat History ({offer.historyCount})
                        </button>
                    </div>
                </div>
            ))}

            {selectedOfferId && (
                <OfferHistoryModal
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                    offerId={selectedOfferId}
                />
            )}
        </div>
    );
}
