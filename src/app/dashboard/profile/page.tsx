import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">Profil Saya</h1>
                <p className="text-gray-600">Informasi akun Anda</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                        {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{session.user.name}</h2>
                        <p className="text-gray-500">{session.user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                            {session.user.role}
                        </span>
                    </div>
                </div>

                <form className="space-y-4 opacity-50 pointer-events-none">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
                            <input
                                type="text"
                                defaultValue={session.user.name?.split(' ')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            defaultValue={session.user.email || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            readOnly
                        />
                    </div>
                    <div className="pt-4">
                        <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold">Simpan Perubahan</button>
                    </div>
                </form>
                <p className="text-xs text-center text-gray-400 mt-4">Edit profil belum tersedia di versi demo ini.</p>
            </div>
        </div>
    );
}
