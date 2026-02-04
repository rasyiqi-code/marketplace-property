'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OffersList } from '@/components/dashboard/OffersList';
import { TransactionDTO } from '@/components/transactions/types';
import { LoadingState } from '@/components/transactions/LoadingState';
import { TransactionCard } from '@/components/transactions/TransactionCard';

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

    const handleUpdateStatus = async (id: string, newStatus: string, extraData: any = {}) => {
        if (!confirm(`Ubah status transaksi menjadi ${newStatus}?`)) return;

        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, ...extraData }),
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
                                        <TransactionCard
                                            key={tx.id}
                                            tx={tx}
                                            type="purchase"
                                            onUpdateStatus={handleUpdateStatus}
                                        />
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
                                        <TransactionCard
                                            key={tx.id}
                                            tx={tx}
                                            type="sale"
                                            onUpdateStatus={handleUpdateStatus}
                                        />
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
