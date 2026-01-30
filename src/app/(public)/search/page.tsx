import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { PropertyCardMUI } from '@/components/PropertyCardMUI';
import { getProperties } from '@/lib/data/properties';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    const query = typeof params.query === 'string' ? params.query : undefined;
    const type = typeof params.type === 'string' ? params.type : undefined;
    const status = typeof params.status === 'string' ? params.status : undefined;
    const minPrice = typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined;
    const bedrooms = typeof params.bedrooms === 'string' ? Number(params.bedrooms) : undefined;

    const properties = await getProperties({
        query,
        type,
        status,
        minPrice,
        maxPrice,
        bedrooms,
    });

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            <main className="container py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Hasil Pencarian Properti</h1>
                    <p className="text-gray-500">Menampilkan {properties.length} properti yang sesuai dengan kriteria Anda.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <FilterSidebar />
                    </div>

                    {/* Results Grid */}
                    <div className="lg:col-span-3">
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
                    </div>
                </div>
            </main>
        </div>
    );
}
