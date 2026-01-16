'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        type: searchParams.get('type') || '',
        location: searchParams.get('location') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        bedrooms: searchParams.get('bedrooms') || '',
    });

    const handleApply = () => {
        const params = new URLSearchParams();
        if (filters.type) params.set('type', filters.type);
        if (filters.location) params.set('location', filters.location);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <aside className="bg-white border border-border rounded-xl p-6 h-fit">
            <h3 className="text-lg font-semibold mb-6 pb-4 border-b border-border">Filter Pencarian</h3>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-foreground">Tipe Properti</label>
                <select
                    className="w-full p-2.5 border border-border rounded-xl text-sm outline-none bg-white cursor-pointer"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">Semua Tipe</option>
                    <option value="house">Rumah</option>
                    <option value="apartment">Apartemen</option>
                    <option value="villa">Villa</option>
                    <option value="land">Tanah</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-foreground">Lokasi</label>
                <input
                    type="text"
                    placeholder="Kota atau Daerah"
                    className="w-full p-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-foreground">Range Harga</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full p-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full p-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-foreground">Kamar Tidur</label>
                <div className="flex gap-2 items-center">
                    {['', '1', '2', '3'].map((num) => (
                        <button
                            key={num || 'any'}
                            type="button"
                            className={`flex-1 p-2 rounded-lg text-sm border font-medium transition-all ${filters.bedrooms === num
                                ? 'bg-primary text-white border-primary'
                                : 'bg-transparent text-foreground border-border hover:bg-muted'
                                }`}
                            onClick={() => setFilters({ ...filters, bedrooms: num })}
                        >
                            {num ? `${num}+` : 'Any'}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="w-full bg-primary text-white border-none p-3 rounded-xl font-medium cursor-pointer mt-4 hover:opacity-90 transition-opacity"
                onClick={handleApply}
            >
                Terapkan Filter
            </button>
        </aside>
    );
}
