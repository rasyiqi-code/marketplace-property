'use client';

import { PropertyInput } from '@/actions/properties';
import { Bed, Bath, Square, DollarSign } from 'lucide-react';

interface StepProps {
    data: PropertyInput;
    update: (data: Partial<PropertyInput>) => void;
}

export function StepDetails({ data, update }: StepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pb-4 border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-heading text-gray-900">Detail Properti</h2>
                <p className="text-gray-500 text-sm">Spesifikasi teknis dan harga penawaran.</p>
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga Penawaran</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                    <input
                        type="number"
                        min="0"
                        value={data.price || ''}
                        onChange={(e) => update({ price: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xl font-semibold text-gray-900"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Square size={16} /> Luas Bangunan (m²)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={data.area}
                        onChange={(e) => update({ area: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Bed size={16} /> Kamar Tidur
                    </label>
                    <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button onClick={() => update({ bedrooms: Math.max(0, data.bedrooms - 1) })} className="w-10 hover:bg-white rounded shadow-sm transition-all">-</button>
                        <input
                            type="number"
                            value={data.bedrooms}
                            onChange={(e) => update({ bedrooms: Number(e.target.value) })}
                            className="flex-1 bg-transparent text-center outline-none w-full"
                        />
                        <button onClick={() => update({ bedrooms: data.bedrooms + 1 })} className="w-10 hover:bg-white rounded shadow-sm transition-all">+</button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Bath size={16} /> Kamar Mandi
                    </label>
                    <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button onClick={() => update({ bathrooms: Math.max(0, data.bathrooms - 1) })} className="w-10 hover:bg-white rounded shadow-sm transition-all">-</button>
                        <input
                            type="number"
                            value={data.bathrooms}
                            onChange={(e) => update({ bathrooms: Number(e.target.value) })}
                            className="flex-1 bg-transparent text-center outline-none w-full"
                        />
                        <button onClick={() => update({ bathrooms: data.bathrooms + 1 })} className="w-10 hover:bg-white rounded shadow-sm transition-all">+</button>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Lengkap</label>
                <textarea
                    rows={6}
                    value={data.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="Ceritakan tentang properti Anda, lingkungan sekitar, akses, dan keunggulan lainnya..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y"
                />
            </div>
        </div>
    );
}
