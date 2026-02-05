'use client';

import React from 'react';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import Link from 'next/link';

interface CheckoutButtonProps {
    packageId: string;
    isLoggedIn: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function CheckoutButton({
    packageId,
    isLoggedIn,
    className = "",
    children = "Beli Sekarang"
}: CheckoutButtonProps) {
    const { checkout, isLoading } = useCheckout();

    if (!isLoggedIn) {
        return (
            <Link
                href="/handler/sign-in"
                className={`block w-full text-center ${className}`}
            >
                Login untuk Membeli
            </Link>
        );
    }

    return (
        <button
            onClick={() => checkout(packageId)}
            disabled={isLoading}
            className={`w-full ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    );
}
