'use client';

import { useState } from 'react';
import { LayoutGrid, Map as MapIcon, ChevronDown } from 'lucide-react';
import { PropertyCardMUI } from '@/components/PropertyCardMUI';
import { PropertyDTO } from '@/lib/data/properties';
import dynamic from 'next/dynamic';

const PropertyMapSearch = dynamic(() => import('@/components/PropertyMapSearch'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-500">
            Memuat Peta Properti...
        </div>
    )
});

interface SearchResultsProps {
    properties: PropertyDTO[];
}

export function SearchResults({ properties }: SearchResultsProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    return (
        <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <LayoutGrid size={18} />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <MapIcon size={18} />
                        Peta
                    </button>
                </div>

                <div className="text-sm font-medium text-gray-500">
                    Urutkan: <span className="text-gray-900 font-bold border-b border-primary cursor-pointer inline-flex items-center gap-1">Terbaru <ChevronDown size={14} /></span>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <>
                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCardMUI key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <div className="text-gray-400 mb-4 text-6xl">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada properti ditemukan</h3>
                            <p className="text-gray-500">Coba ubah filter pencarian Anda atau gunakan kata kunci lain.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="animate-in fade-in duration-500">
                    {properties.length > 0 ? (
                        <PropertyMapSearch properties={properties} />
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada data untuk ditampilkan di peta</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
