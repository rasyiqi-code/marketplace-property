'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, User } from 'lucide-react';
import Image from 'next/image';

interface OfferHistoryModalProps {
    offerId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface HistoryItem {
    id: string;
    action: string;
    price: number | null;
    message: string | null;
    createdAt: string;
    sender: {
        name: string | null;
        image: string | null;
    };
}

export function OfferHistoryModal({ offerId, isOpen, onClose }: OfferHistoryModalProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(isOpen && !!offerId);

    useEffect(() => {
        if (isOpen && offerId) {
            // No need to setLoading(true) here if initialized correctly
            fetch(`/api/offers/${offerId}/action`)
                .then((res) => res.json())
                .then((data) => setHistory(data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, offerId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold font-heading mb-4 border-b pb-2">Riwayat Negosiasi</h2>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
                    ) : history.length === 0 ? (
                        <p className="text-gray-500 text-center">Belum ada riwayat.</p>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                    {item.sender.image ? (
                                        <Image src={item.sender.image} alt="User" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={16} /></div>
                                    )}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg p-3 text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900">{item.sender.name || 'User'}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.createdAt).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    <div className="mb-1 font-semibold text-xs uppercase tracking-wide text-primary">
                                        {item.action} {item.price && `- ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}`}
                                    </div>

                                    {item.message && (
                                        <p className="text-gray-600">{item.message}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
