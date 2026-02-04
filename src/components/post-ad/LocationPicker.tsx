'use client';

import dynamic from 'next/dynamic';

const LazyMapPicker = dynamic(() => import('./MapPicker'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[200px] bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-200 text-gray-400 gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Memuat Input Peta...</span>
        </div>
    )
});

interface LocationPickerProps {
    lat?: number;
    lng?: number;
    mapsEmbed?: string;
    onChange: (lat: number, lng: number, embed: string) => void;
}

export function LocationPicker(props: LocationPickerProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-900 capitalize">Lokasi Google Maps</label>
                {props.mapsEmbed && (
                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-100">
                        Terpasang
                    </span>
                )}
            </div>
            <LazyMapPicker {...props} />
        </div>
    );
}
