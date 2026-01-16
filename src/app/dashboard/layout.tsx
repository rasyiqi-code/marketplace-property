import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link href="/" className="font-heading text-xl font-bold text-primary">ProEstate</Link>
                </div>
                <div className="p-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center px-4 py-3 bg-blue-50 text-primary font-medium rounded-lg">
                        🏠 Dashboard
                    </Link>
                    <Link href="/dashboard/listings" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-lg transition-colors">
                        📋 Iklan Saya
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-lg transition-colors">
                        👤 Profil
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                            {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{session.user.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Keluar
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
