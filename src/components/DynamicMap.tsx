'use client';

interface MapProps {
    mapsEmbed?: string;
    address?: string;
    // Keep others for backward compatibility avoiding breakage
    latitude?: number;
    longitude?: number;
    location?: string;
}

import dynamic from 'next/dynamic';

const LazyMap = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-sm">
            Memuat Google Maps...
        </div>
    )
});

export default function DynamicMap(props: MapProps) {
    return <LazyMap {...props} />;
}
