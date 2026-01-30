'use client';

import { PropertyInput } from '@/lib/data/properties';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface StepProps {
    data: PropertyInput;
    update: (data: Partial<PropertyInput>) => void;
}

export function StepMedia({ data, update }: StepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pb-4 border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-heading text-gray-900">Upload Media</h2>
                <p className="text-gray-500 text-sm">Foto berkualitas tinggi adalah kunci penjualan. Masukkan URL foto terbaik properti Anda.</p>
            </div>

            {/* Image Placeholder - Since we don't have real backend upload yet */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="text-primary w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Klik atau Drag Foto ke Sini</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    (Mockup: Karena belum ada file storage, silakan masukkan URL gambar langsung di bawah ini)
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Foto Utama</label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <ImageIcon size={18} />
                        </span>
                        <input
                            type="url"
                            value={data.imageUrl}
                            onChange={(e) => update({ imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Tips: Gunakan link gambar public dari Unsplash atau Imgur untuk testing.
                </p>
            </div>
        </div>
    );
}
