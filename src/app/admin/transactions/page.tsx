'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';

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

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/admin/transactions');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error('Failed to fetch transactions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        let color = 'bg-gray-100 text-gray-600';

        if (status === 'SUCCESS') color = 'bg-green-100 text-green-700';
        else if (status === 'CANCELLED' || status === 'FAILED') color = 'bg-red-100 text-red-700';

        return (
            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${color}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-white">Transaksi Sistem</h1>
                <p className="text-gray-400">Daftar seluruh transaksi yang terjadi di platform.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Properti</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Seller</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden relative">
                                                <Image src={tx.property.images || '/images/placeholder.jpg'} alt="p" fill className="object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-900 truncate max-w-[150px]" title={tx.propertyTitle || ''}>
                                                {tx.propertyTitle}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{tx.buyer.name}</span>
                                            <span className="text-xs text-gray-400">{tx.buyer.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{tx.seller.name}</span>
                                            <span className="text-xs text-gray-400">{tx.seller.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tx.amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                                        Belum ada data transaksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
