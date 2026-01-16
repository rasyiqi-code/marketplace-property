export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-white">Pengaturan</h1>
                <p className="text-gray-400">Konfigurasi sistem ProEstate</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Situs</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Situs</label>
                        <input
                            type="text"
                            defaultValue="ProEstate Marketplace"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Kontak</label>
                        <input
                            type="email"
                            defaultValue="support@proestate.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Keamanan</h3>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="font-medium text-gray-900">Maintenance Mode</p>
                        <p className="text-sm text-gray-500">Tutup akses publik sementara</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
}
