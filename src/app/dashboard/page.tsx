import { auth } from '@/auth';

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-heading text-gray-900">Selamat Datang, {session?.user?.name}!</h1>
                <p className="text-gray-600">Kelola properti dan akun Anda di sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Total Iklan</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-400 mt-2">Iklan aktif ditayangkan</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Dilihat</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-400 mt-2">Total kunjungan properti</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Pesan Masuk</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-400 mt-2">Pertanyaan dari calon pembeli</p>
                </div>
            </div>
        </div>
    );
}
