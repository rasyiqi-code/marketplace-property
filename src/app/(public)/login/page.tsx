import { LoginForm } from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <span className="font-heading text-3xl font-bold text-primary">ProEstate</span>
                </Link>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 font-heading">
                    Masuk ke akun Anda
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Atau{' '}
                    <Link href="/" className="font-medium text-primary hover:text-primary/50">
                        kembali ke beranda
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 border border-gray-100">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
