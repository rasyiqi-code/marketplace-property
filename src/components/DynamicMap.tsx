'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the Map component with SSR disabled
// This wrapper is necessary because Next.js Server Components don't support { ssr: false } directly
const LazyMap = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
            Peta Memuat...
        </div>
    )
});

interface MapProps {
    address: string;
    location: string;
}

export default function DynamicMap(props: MapProps) {
    return <LazyMap {...props} />;
}
