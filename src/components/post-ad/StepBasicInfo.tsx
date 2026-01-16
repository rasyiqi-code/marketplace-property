'use client';

import { PropertyInput } from '@/actions/properties';

interface StepProps {
    data: PropertyInput;
    update: (data: Partial<PropertyInput>) => void;
}

export function StepBasicInfo({ data, update }: StepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pb-4 border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-heading text-gray-900">Informasi Dasar</h2>
                <p className="text-gray-500 text-sm">Isi detail utama properti untuk memulai iklan Anda.</p>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Properti</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => update({ title: e.target.value })}
                    placeholder="Contoh: Rumah Minimalis Modern dengan Kolam Renang Privat"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-lg"
                    autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">Judul yang jelas membantu pembeli menemukan properti Anda lebih cepat.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
                    <div className="flex gap-4 p-1 bg-gray-50 rounded-lg border border-gray-200">
                        <button
                            onClick={() => update({ status: 'sale' })}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all shadow-sm ${data.status === 'sale'
                                    ? 'bg-white text-primary border border-gray-200 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Dijual
                        </button>
                        <button
                            onClick={() => update({ status: 'rent' })}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all shadow-sm ${data.status === 'rent'
                                    ? 'bg-white text-primary border border-gray-200 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Disewa
                        </button>
                    </div>
                </div>

                {/* Property Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Properti</label>
                    <select
                        value={data.type}
                        onChange={(e) => update({ type: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                    >
                        <option value="Rumah">Rumah</option>
                        <option value="Apartemen">Apartemen</option>
                        <option value="Ruko">Ruko</option>
                        <option value="Tanah">Tanah</option>
                        <option value="Villa">Villa</option>
                        <option value="Kantor">Kantor</option>
                    </select>
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi (Kota/Daerah)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                    <input
                        type="text"
                        value={data.location}
                        onChange={(e) => update({ location: e.target.value })}
                        placeholder="Cari lokasi atau nama kota..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                <textarea
                    rows={2}
                    value={data.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Nama Jalan, Nomor, RT/RW, Kecamatan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
            </div>
        </div>
    );
}
