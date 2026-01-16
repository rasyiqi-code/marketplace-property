import { MapPin, Bed, Bath, Square, User, Share2, Heart, Phone, Mail } from 'lucide-react';
import { getPropertyById, getRelatedProperties } from '@/actions/properties';
import { PropertyCard } from '@/components/PropertyCard';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DynamicMap from '@/components/DynamicMap';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    const relatedProperties = await getRelatedProperties(id, property.type);

    // Mock images for grid layout (using the same image multiple times if only one exists)
    const images = [property.imageUrl, property.imageUrl, property.imageUrl, property.imageUrl, property.imageUrl];

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">

            <main className="container pt-6 px-4">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <Link href="/" className="hover:text-primary">Beranda</Link>
                    <span>/</span>
                    <Link href="/search" className="hover:text-primary">{property.status === 'sale' ? 'Dijual' : 'Disewa'}</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{property.location}</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[300px]">{property.title}</span>
                </div>

                {/* Media Gallery */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
                    {/* Main Image */}
                    <div className="col-span-4 md:col-span-2 row-span-2 relative bg-gray-100 group">
                        <Image
                            src={images[0]}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute top-4 left-4 z-10">
                            <span className={`px-3 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide text-white shadow-sm ${property.status === 'sale' ? 'bg-[#034E96]' : 'bg-[#E0193E]'}`}>
                                {property.status === 'sale' ? 'Dijual' : 'Disewa'}
                            </span>
                        </div>
                    </div>
                    {/* Sub Images */}
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={images[1]} alt="Gallery 2" fill className="object-cover hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={images[2]} alt="Gallery 3" fill className="object-cover hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={images[3]} alt="Gallery 4" fill className="object-cover hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={images[4]} alt="Gallery 5" fill className="object-cover hover:opacity-90 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold hover:bg-black/50 transition-colors">
                            Lihat Semua Foto
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-8">
                        {/* Header Info */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">{property.title}</h1>
                                <div className="text-gray-500 flex items-center gap-2 mb-4">
                                    <MapPin size={18} className="text-gray-400" />
                                    {property.address}
                                </div>
                                <div className="text-3xl font-bold text-primary font-heading">
                                    {property.price}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                                    <Share2 size={20} />
                                </button>
                                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 mb-8 sticky top-0 bg-white z-10 pt-2">
                            <div className="flex gap-8 overflow-x-auto">
                                {['Ringkasan', 'Informasi', 'Fasilitas', 'Lokasi'].map((tab, i) => (
                                    <button
                                        key={tab}
                                        className={`pb-4 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Specs Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-xs">
                            <h2 className="text-lg font-bold font-heading mb-4 text-gray-900">Spesifikasi Utama</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><Bed size={16} /> Kamar Tidur</span>
                                    <span className="font-semibold text-gray-900">{property.bedrooms}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><Bath size={16} /> Kamar Mandi</span>
                                    <span className="font-semibold text-gray-900">{property.bathrooms}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><Square size={16} /> Luas Bangunan</span>
                                    <span className="font-semibold text-gray-900">{property.area} m²</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><MapPin size={16} /> Lokasi</span>
                                    <span className="font-semibold text-gray-900 truncate">{property.location.split(',')[0]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold font-heading mb-4 text-gray-900">Deskripsi</h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed font-sans text-sm md:text-base">
                                <p className="whitespace-pre-line">{property.description}</p>
                            </div>
                        </div>

                        {/* Facilities (Mock) */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold font-heading mb-4 text-gray-900">Fasilitas</h2>
                            <div className="flex flex-wrap gap-3">
                                {['Keamanan 24 Jam', 'Taman', 'Carport', 'Akses Jalan Lebar', 'Bebas Banjir'].map((item) => (
                                    <span key={item} className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 font-medium border border-gray-100">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold font-heading mb-4 text-gray-900">Lokasi</h2>
                            <p className="text-gray-500 mb-4 flex items-start gap-2 text-sm">
                                <MapPin className="mt-0.5 flex-shrink-0 text-primary" size={16} />
                                {property.address}
                            </p>
                            <div className="w-full h-[300px] bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative z-0">
                                <DynamicMap location={property.location} address={property.address} />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                                            {property.agent.photo ? (
                                                <Image src={property.agent.photo} alt={property.agent.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={24} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{property.agent.name}</div>
                                            <div className="text-sm text-gray-500">Agen Properti</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                            <Phone size={20} />
                                            WhatsApp
                                        </button>
                                        <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 transition-colors">
                                            <Mail size={20} />
                                            Hubungi via Email
                                        </button>
                                        <button className="w-full text-primary hover:underline text-sm font-medium py-2">
                                            Lihat Listing Lainnya
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Dilindungi oleh <span className="font-semibold">ProEstate Verified</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Properties */}
                {
                    relatedProperties.length > 0 && (
                        <div className="mt-12 pt-12 border-t border-gray-100">
                            <h2 className="text-2xl font-bold font-heading mb-6 text-gray-900">Properti Serupa</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedProperties.map((prop) => (
                                    <PropertyCard key={prop.id} property={prop} />
                                ))}
                            </div>
                        </div>
                    )
                }
            </main>
        </div>
    );
}
