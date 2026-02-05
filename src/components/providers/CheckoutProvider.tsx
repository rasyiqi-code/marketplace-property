'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface MidtransResult {
    order_id: string;
    status_code: string;
    transaction_status: string;
}

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess?: (result: MidtransResult) => void;
                onPending?: (result: MidtransResult) => void;
                onError?: (result: MidtransResult) => void;
                onClose?: () => void;
            }) => void;
        };
    }
}

interface CheckoutContextType {
    checkout: (packageId: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkout = async (packageId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Call Checkout API
            const response = await fetch('/api/payment/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to checkout');

            // 2. Open Midtrans Snap
            if (window.snap) {
                window.snap.pay(data.snapToken, {
                    onSuccess: function (result: MidtransResult) {
                        console.log('Payment Success:', result);
                        router.push('/dashboard?status=payment_success');
                        router.refresh();
                        setIsLoading(false);
                    },
                    onPending: function (result: MidtransResult) {
                        console.log('Payment Pending:', result);
                        router.push('/dashboard?status=payment_pending');
                        setIsLoading(false);
                    },
                    onError: function (result: MidtransResult) {
                        console.log('Payment Error:', result);
                        setError('Pembayaran gagal. Silakan coba lagi.');
                        setIsLoading(false);
                    },
                    onClose: function () {
                        console.log('Customer closed the popup without finishing the payment');
                        setIsLoading(false);
                    }
                });
            } else {
                setError('Sistem pembayaran belum siap. Silakan refresh halaman.');
                setIsLoading(false);
            }

        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
            setIsLoading(false);
        }
    };

    return (
        <CheckoutContext.Provider value={{ checkout, isLoading, error }}>
            {children}
            {/* Simple Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center animate-pulse">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-800 font-medium">Memproses Pembayaran...</p>
                    </div>
                </div>
            )}
            {/* Error Toast/Alert could go here */}
            {error && (
                <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
                </div>
            )}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
