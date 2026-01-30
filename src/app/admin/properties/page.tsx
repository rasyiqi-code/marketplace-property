import { getProperties } from '@/lib/data/properties';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPropertiesPage() {
    // Fetch all properties without filters
    const properties = await getProperties({});

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-white">Kelola Properti</h1>
                    <p className="text-gray-400">Daftar semua properti yang tayang</p>
                </div>
                <Link
                    href="/post-ad"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Properti</span>
                </Link>
            </div>

            <PropertyTable properties={properties} />
        </div>
    );
}
