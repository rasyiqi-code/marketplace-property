'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';
import { TransactionDTO } from './types';
import { StatusBadge } from './StatusBadge';
import { generateInvoice } from './utils';

interface TransactionCardProps {
    tx: TransactionDTO;
    type: 'purchase' | 'sale';
    onUpdateStatus?: (id: string, status: string, extra?: any) => void;
}

export function TransactionCard({ tx, type, onUpdateStatus }: TransactionCardProps) {
    const isPurchase = type === 'purchase';

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
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
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900 truncate">{tx.propertyTitle}</h3>
                        <StatusBadge status={tx.status} />
                    </div>
                    <p className="text-sm text-gray-500">
                        {isPurchase ? `Seller: ${tx.seller.name || tx.seller.email}` : `Buyer: ${tx.buyer.name || tx.buyer.email}`}
                    </p>
                    <p className="text-sm text-gray-400 text-xs mt-1">
                        {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3 mt-auto">
                <span className="font-bold text-primary">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)}
                </span>

                <div className="flex gap-2">
                    {tx.status === 'SUCCESS' && (
                        <button
                            onClick={() => generateInvoice(tx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                        >
                            <Download size={14} />
                            Invoice
                        </button>
                    )}

                    {!isPurchase && (tx.status === 'PENDING' || tx.status === 'WAITING_VERIFICATION') && (
                        <>
                            <button
                                onClick={() => onUpdateStatus?.(tx.id, 'CANCELLED')}
                                className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                Tolak
                            </button>
                            <button
                                onClick={() => onUpdateStatus?.(tx.id, 'SUCCESS')}
                                className="px-3 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            >
                                Terima
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isPurchase && tx.status === 'PENDING' && tx.seller.bankAccount && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Instruksi Pembayaran</h4>
                    <p className="text-sm text-blue-700 font-medium">{tx.seller.bankName}</p>
                    <p className="text-lg font-bold text-blue-900">{tx.seller.bankAccount}</p>
                    <p className="text-sm text-blue-600">a/n {tx.seller.bankHolder}</p>
                    <button
                        onClick={() => {
                            const url = prompt('Masukkan URL Bukti Transfer (Image URL):');
                            if (url) onUpdateStatus?.(tx.id, 'WAITING_VERIFICATION', { paymentProofUrl: url });
                        }}
                        className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                        Sudah Bayar? Upload Bukti
                    </button>
                </div>
            )}

            {!isPurchase && tx.paymentProofUrl && (
                <div className="mt-2 text-xs flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <a href={tx.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                        Lihat Bukti Transfer
                    </a>
                </div>
            )}
        </div>
    );
}
