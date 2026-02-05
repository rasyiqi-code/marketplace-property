import { stackServerApp } from '@/lib/stack';
import Link from 'next/link';
import { redirect } from 'next/navigation';

/**
 * AdminLayout - Layout untuk admin dashboard
 * Menggunakan Stack Auth untuk autentikasi
 * 
 * TODO: Implementasi role checking melalui Stack Auth teams/permissions
 * Saat ini hanya memeriksa autentikasi
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await stackServerApp.getUser();

    // Redirect ke login jika belum autentikasi
    if (!user) {
        redirect('/handler/sign-in');
    }

    // Pengecekan role ADMIN
    const adminIds = process.env.ADMIN_IDS?.split(',') || [];
    const isBypassAdmin = adminIds.includes(user.id);

    // @ts-expect-error - Menangani custom metadata atau field role dari Stack Auth
    if (user.role !== 'ADMIN' && user.metadata?.role !== 'ADMIN' && !isBypassAdmin) {
        redirect('/');
    }

    const displayName = user.displayName || user.primaryEmail?.split('@')[0] || 'Admin';

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:block fixed h-full z-10 text-white">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link href="/" className="font-heading text-xl font-bold text-white tracking-wider">
                        ProEstate <span className="text-xs bg-red-600 px-2 py-0.5 rounded ml-2">ADMIN</span>
                    </Link>
                </div>
                <div className="p-4 space-y-1">
                    <Link href="/admin" className="flex items-center px-4 py-3 bg-slate-800 text-white font-medium rounded-lg">
                        📊 Overview
                    </Link>
                    <Link href="/admin/properties" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors">
                        🏢 Properties
                    </Link>
                    <Link href="/admin/users" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors">
                        👥 Users
                    </Link>
                    <Link href="/admin/settings" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors">
                        ⚙️ Settings
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-bold text-lg">
                            {displayName[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{displayName}</p>
                            <p className="text-xs text-slate-500 truncate">Administrator</p>
                        </div>
                    </div>
                    <Link
                        href="/handler/sign-out"
                        className="w-full block text-center py-2 px-4 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
                {children}
            </main>
        </div>
    );
}
