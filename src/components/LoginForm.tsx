'use client';

import { useActionState } from 'react';
import { authenticate } from '@/actions/auth'; // We need to create this action
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="nama@email.com"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Ingat saya
                    </label>
                </div>
                <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary/80">
                        Lupa password?
                    </a>
                </div>
            </div>

            {errorMessage && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {errorMessage}
                </div>
            )}

            <button
                aria-disabled={isPending}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                disabled={isPending}
            >
                {isPending ? <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> : null}
                {isPending ? 'Sedang Masuk...' : 'Masuk'}
            </button>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                    Belum punya akun?{' '}
                    <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </form>
    );
}
