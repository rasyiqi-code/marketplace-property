'use client';

import { PropertyInput } from '@/actions/properties';
import { Loader2 } from 'lucide-react';

interface StepProps {
    data: PropertyInput;
    isLoading: boolean;
    onSubmit: () => void;
}

export function StepVerification({ data, isLoading, onSubmit }: StepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pb-4 border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-heading text-gray-900">Verifikasi & Terbit</h2>
                <p className="text-gray-500 text-sm">Cek kembali semua data sebelum menayangkan iklan.</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-6">
                Harap pastikan semua data sudah benar. Setelah diterbitkan, iklan akan langsung muncul di hasil pencarian.
            </div>

            <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Judul</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">{data.title}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Harga</span>
                    <span className="font-medium text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.price)}
                    </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Lokasi</span>
                    <span className="font-medium text-gray-900">{data.location}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Spesifikasi</span>
                    <span className="font-medium text-gray-900">
                        {data.bedrooms} KT • {data.bathrooms} KM • {data.area} m²
                    </span>
                </div>
            </div>

            <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : null}
                {isLoading ? 'Sedang Menerbitkan...' : 'Terbitkan Iklan Sekarang'}
            </button>
        </div>
    );
}
