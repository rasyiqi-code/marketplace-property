import { PropertyCard } from './PropertyCard';
import { getFeaturedProperties } from '@/actions/properties';

export async function FeaturedSection() {
    const properties = await getFeaturedProperties();

    return (
        <section className="py-16">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">Properti Pilihan Terbaik</h2>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Rekomendasi properti eksklusif yang dikurasi khusus untuk Anda dengan harga dan lokasi terbaik.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </section>
    );
}
