import { auth } from '@/auth';
import Link from 'next/link';

export async function Navbar() {
    const session = await auth();

    return (
        <header className="bg-primary border-b border-white/10 flex flex-col">
            <div className="container flex items-center justify-between h-14 px-4">
                <div className="flex">
                    <Link href="/" className="font-heading text-xl font-bold text-white flex items-center gap-2">
                        ProEstate
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/post-ad" className="bg-transparent border border-white text-white px-[0.85rem] py-[0.35rem] rounded-[4px] text-[0.8rem] font-semibold cursor-pointer transition-all hover:bg-white/10">
                        Pasang Iklan
                    </Link>

                    {session ? (
                        <Link
                            href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                            className="bg-white text-primary border border-white px-[0.85rem] py-[0.35rem] rounded-[4px] text-[0.8rem] font-bold cursor-pointer transition-all hover:bg-gray-100 flex items-center gap-2"
                        >
                            <span>{session.user.name?.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-transparent border border-white text-white px-[0.85rem] py-[0.35rem] rounded-[4px] text-[0.8rem] font-semibold cursor-pointer transition-all hover:bg-white/10"
                        >
                            Masuk
                        </Link>
                    )}
                </div>
            </div>
            <div className="bg-black/10 h-10 flex items-center">
                <div className="container w-full">
                    <nav className="flex gap-5 overflow-x-auto scrollbar-hide">
                        <Link href="/search?status=sale" className="text-[0.85rem] font-medium text-white/90 whitespace-nowrap relative pb-1 hover:text-white">
                            Dijual
                        </Link>
                        <Link href="/search?status=rent" className="text-[0.85rem] font-medium text-white/90 whitespace-nowrap relative pb-1 hover:text-white">
                            Disewa
                        </Link>
                        <Link href="/search?sort=newest" className="text-[0.85rem] font-medium text-white/90 whitespace-nowrap relative pb-1 hover:text-white">
                            Properti Baru
                        </Link>
                        <Link href="/kpr" className="text-[0.85rem] font-medium text-white/90 whitespace-nowrap relative pb-1 hover:text-white">
                            KPR
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
