import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/login'); // Middleware handles this too, but double safety
    }

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:block fixed h-full z-10 text-white">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link href="/" className="font-heading text-xl font-bold text-white tracking-wider">ProEstate <span className="text-xs bg-red-600 px-2 py-0.5 rounded ml-2">ADMIN</span></Link>
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
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{session.user.name}</p>
                            <p className="text-xs text-slate-500 truncate">Administrator</p>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="w-full py-2 px-4 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
                {children}
            </main>
        </div>
    );
}
