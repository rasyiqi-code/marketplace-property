'use client';

import { useEffect } from 'react';
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

export function CheckoutHandler() {
    const router = useRouter();

    useEffect(() => {
        const handleCheckout = async (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const button = target.closest('.checkout-trigger');

            if (!button) return;

            const packageId = (button as HTMLElement).dataset.package;
            if (!packageId) return;

            try {
                // 1. Initial Loading State
                button.classList.add('opacity-50', 'pointer-events-none');
                const originalText = button.innerHTML;
                button.innerHTML = 'Processing...';

                // 2. Call Checkout API
                const response = await fetch('/api/payment/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ packageId }),
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || 'Failed to checkout');

                // 3. Open Midtrans Snap
                window.snap.pay(data.snapToken, {
                    onSuccess: function (result: MidtransResult) {
                        console.log('Payment Success:', result);
                        router.push('/dashboard?status=payment_success');
                        router.refresh();
                    },
                    onPending: function (result: MidtransResult) {
                        console.log('Payment Pending:', result);
                        router.push('/dashboard?status=payment_pending');
                    },
                    onError: function (result: MidtransResult) {
                        console.log('Payment Error:', result);
                        alert('Pembayaran gagal. Silakan coba lagi.');
                    },
                    onClose: function () {
                        console.log('Customer closed the popup without finishing the payment');
                    }
                });

                // Reset button
                button.classList.remove('opacity-50', 'pointer-events-none');
                button.innerHTML = originalText;

            } catch (error) {
                console.error('Checkout error:', error);
                alert(error instanceof Error ? error.message : 'Terjadi kesalahan sistem.');
                button.classList.remove('opacity-50', 'pointer-events-none');
            }
        };

        document.addEventListener('click', handleCheckout);
        return () => document.removeEventListener('click', handleCheckout);
    }, [router]);

    return null; // This component doesn't render anything visible
}
