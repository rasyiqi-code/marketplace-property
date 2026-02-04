'use client';

import { PropertyInput } from '@/lib/data/properties';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

export function LivePreview({ data }: { data: PropertyInput }) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Live Preview</h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Updating
                </span>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 group">
                {/* Image Area */}
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                    {data.imageUrl ? (
                        <Image
                            src={data.imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(e) => {
                                // Fallback if image load fails implies URL is invalid/incomplete
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <div className="w-12 h-12 mb-2 opacity-50">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium uppercase tracking-wide">Menunggu Upload Foto</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide text-white shadow-sm ${data.status === 'sale' ? 'bg-[#034E96]' : 'bg-[#E0193E]'}`}>
                            {data.status === 'sale' ? 'Dijual' : 'Disewa'}
                        </span>
                        <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide text-[#034E96] bg-white shadow-sm border border-gray-100">
                            {data.type}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="text-2xl font-bold text-primary font-heading mb-1">
                        {data.price ? formatPrice(data.price) : 'Rp --,---,---'}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                        {data.title || 'Judul Properti Preview'}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin size={14} className="mr-1" />
                        <span className="truncate">{data.location || 'Lokasi detail akan muncul di sini'}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4 flex-wrap">
                        {data.bedrooms > 0 && (
                            <div className="flex items-center gap-1.5" title="Kamar Tidur">
                                <Bed size={16} className="text-gray-400" />
                                <span className="font-semibold">{data.bedrooms}</span>
                            </div>
                        )}
                        {data.bathrooms > 0 && (
                            <div className="flex items-center gap-1.5" title="Kamar Mandi">
                                <Bath size={16} className="text-gray-400" />
                                <span className="font-semibold">{data.bathrooms}</span>
                            </div>
                        )}
                        {data.area > 0 && data.type !== 'Tanah' && (
                            <div className="flex items-center gap-1.5" title="Luas Bangunan/Unit">
                                <Square size={16} className="text-gray-400" />
                                <span className="font-semibold">{data.area} m²</span>
                            </div>
                        )}
                        {data.landArea !== undefined && data.landArea > 0 && (
                            <div className="flex items-center gap-1.5" title="Luas Tanah">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="font-semibold">{data.landArea} m² (LT)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">Tips Cepat & Anti-Duplikasi</h4>
                        <div className="text-xs text-blue-800 leading-relaxed space-y-1">
                            <p>• Judul menarik dan foto kualitas tinggi meningkatkan minat pembeli hingga 40%.</p>
                            <p>• <strong>Hindari Duplikasi:</strong> Pastikan kombinasi Alamat, Luas, dan Titik Koordinat Peta unik untuk properti Anda.</p>
                            <p>• Gunakan foto asli; sistem kami mendeteksi penggunaan foto yang sudah ada di iklan lain.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
