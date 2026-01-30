'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, X, Clock, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { OffersList } from '@/components/dashboard/OffersList';

interface TransactionDTO {
    id: string;
    amount: number;
    status: string;
    propertyTitle: string | null;
    propertyId: string;
    buyerId: string;
    sellerId: string;
    createdAt: string;
    property: {
        title: string;
        images: string;
    };
    buyer: {
        name: string | null;
        email: string;
    };
    seller: {
        name: string | null;
        email: string;
    };
}

export function TransactionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'transactions'; // 'transactions' | 'offers'

    const [purchases, setPurchases] = useState<TransactionDTO[]>([]);
    const [sales, setSales] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/transactions');
            if (res.ok) {
                const data = await res.json();
                setPurchases(data.purchases);
                setSales(data.sales);
            }
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'transactions') {
            fetchTransactions();
        }
    }, [activeTab]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        if (!confirm(`Ubah status transaksi menjadi ${newStatus}?`)) return;

        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert('Status berhasil diperbarui!');
                fetchTransactions(); // Refresh data
            } else {
                const err = await res.json();
                alert('Gagal update: ' + err.error);
            }
        } catch (error) {
            console.error('Update failed', error);
            alert('Terjadi kesalahan network.');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let color = 'bg-gray-100 text-gray-600';
        let icon = <Clock size={14} />;

        if (status === 'SUCCESS') {
            color = 'bg-green-100 text-green-700';
            icon = <Check size={14} />;
        } else if (status === 'CANCELLED' || status === 'FAILED') {
            color = 'bg-red-100 text-red-700';
            icon = <X size={14} />;
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
                {icon}
                {status}
            </span>
        );
    };

    const LoadingState = () => (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">Transaksi & Negosiasi</h1>
                <p className="text-gray-600">Kelola pembelian, penjualan, dan penawaran Anda.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => router.push('?tab=transactions')}
                        className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Transaksi (Deals)
                    </button>
                    <button
                        onClick={() => router.push('?tab=offers')}
                        className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'offers' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Negosiasi (Penawaran)
                    </button>
                </div>
            </div>

            {/* Content: Transactions */}
            {activeTab === 'transactions' && (
                loading ? <LoadingState /> :
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Pembelian (Outgoing)</h2>
                            {purchases.length === 0 ? (
                                <p className="text-gray-500 italic">Belum ada transaksi pembelian.</p>
                            ) : (
                                <div className="space-y-4">
                                    {purchases.map((tx) => (
                                        <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                <Image
                                                    src={tx.property.images || '/images/placeholder.jpg'}
                                                    alt={tx.propertyTitle || 'Property'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate">{tx.propertyTitle}</h3>
                                                <p className="text-sm text-gray-500 mb-2">Seller: {tx.seller.name || tx.seller.email}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-primary">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)}
                                                    </span>
                                                    <StatusBadge status={tx.status} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Penjualan (Incoming)</h2>
                            {sales.length === 0 ? (
                                <p className="text-gray-500 italic">Belum ada transaksi masuk.</p>
                            ) : (
                                <div className="space-y-4">
                                    {sales.map((tx) => (
                                        <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    <Image
                                                        src={tx.property.images || '/images/placeholder.jpg'}
                                                        alt={tx.propertyTitle || 'Property'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 truncate">{tx.propertyTitle}</h3>
                                                    <p className="text-sm text-gray-500">Buyer: {tx.buyer.name || tx.buyer.email}</p>
                                                    <p className="text-sm text-gray-400 text-xs mt-1">
                                                        {new Date(tx.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t pt-3">
                                                <StatusBadge status={tx.status} />
                                                {tx.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(tx.id, 'CANCELLED')}
                                                            className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            Tolak
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(tx.id, 'SUCCESS')}
                                                            className="px-3 py-1 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                                        >
                                                            Terima
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
            )}

            {/* Content: Offers */}
            {activeTab === 'offers' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800">Penawaran Dikirim (Sent)</h2>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">Anda sebagai Buyer</span>
                        </div>
                        <OffersList type="sent" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800">Penawaran Masuk (Received)</h2>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">Anda sebagai Seller</span>
                        </div>
                        <OffersList type="received" />
                    </div>
                </div>
            )}
        </div>
    );
}
