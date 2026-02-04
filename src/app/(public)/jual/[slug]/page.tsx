import { MapPin, User, Phone, Mail, BadgeCheck } from 'lucide-react';
import { getPropertyBySlug, getRelatedProperties } from '@/lib/data/properties';
import { PropertyCardMUI } from '@/components/PropertyCardMUI';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PropertyDetailTabs } from '@/components/PropertyDetailTabs';
import { stackServerApp } from '@/lib/stack';

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug, 'sale');
    const user = await stackServerApp.getUser();

    if (!property) {
        notFound();
    }

    const relatedProperties = await getRelatedProperties(property.id, property.type);

    // Use real images from propertyImages or fallback to imageUrl
    const displayImages = property.propertyImages.length > 0
        ? property.propertyImages.map((img: { url: string }) => img.url)
        : [property.imageUrl, property.imageUrl, property.imageUrl, property.imageUrl, property.imageUrl];

    // Ensure we have at least 5 elements for the grid layout
    const galleryImages = [...displayImages];
    while (galleryImages.length < 5) {
        galleryImages.push(property.imageUrl);
    }

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            <main className="container pt-6 px-4">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <Link href="/" className="hover:text-primary">Beranda</Link>
                    <span>/</span>
                    <Link href="/search?status=sale" className="hover:text-primary">Dijual</Link>
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
                            src={galleryImages[0]}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide text-white shadow-sm bg-[#034E96]">
                                Dijual
                            </span>
                        </div>
                    </div>
                    {/* Sub Images */}
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={galleryImages[1]} alt="Gallery 2" fill className="object-cover hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={galleryImages[2]} alt="Gallery 3" fill className="object-cover hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={galleryImages[3]} alt="Gallery 4" fill className="object-cover hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative bg-gray-100 cursor-pointer">
                        <Image src={galleryImages[4]} alt="Gallery 5" fill className="object-cover hover:opacity-90 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold hover:bg-black/50 transition-colors">
                            Lihat Semua Foto
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-8">
                        <PropertyDetailTabs property={property} />
                    </div>

                    {/* Right Sidebar (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-primary/20">
                                            {property.seller.photo ? (
                                                <Image src={property.seller.photo} alt={property.seller.name || "Seller"} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"><User size={24} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-gray-900">{property.seller.name || 'ProEstate User'}</div>
                                                {property.seller.verified && (
                                                    <BadgeCheck className="text-primary" size={18} />
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {property.seller.accountType === 'AGENCY' ? 'Agency Properti' :
                                                    property.seller.accountType === 'AGENT' ? 'Agen Properti' :
                                                        'Individual'}
                                            </div>
                                            {property.seller.company && (
                                                <div className="text-xs text-gray-400 mt-1">{property.seller.company}</div>
                                            )}
                                        </div>
                                    </div>

                                    {property.seller.bio && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="text-sm text-gray-600 line-clamp-3">{property.seller.bio}</p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {property.seller.phone ? (
                                            <a
                                                href={`https://wa.me/${property.seller.phone.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                                                    property.seller.whatsappMessage?.replace('{property_title}', property.title) ||
                                                    `Halo ${property.seller.name || 'Seller'}, saya tertarik dengan properti "${property.title}" yang saya lihat di ProEstate.`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-center"
                                            >
                                                <Phone size={20} />
                                                WhatsApp
                                            </a>
                                        ) : null}
                                        <a
                                            href={`mailto:${property.seller.email}?subject=${encodeURIComponent(`Tertarik dengan properti: ${property.title}`)}&body=${encodeURIComponent(`Halo ${property.seller.name || 'Seller'},\n\nSaya tertarik dengan properti "${property.title}" yang berada di ${property.location}.\n\nBisa tolong berikan informasi lebih lanjut?`)}`}
                                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 transition-colors text-center"
                                        >
                                            <Mail size={20} />
                                            Hubungi via Email
                                        </a>
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
                {relatedProperties.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <h2 className="text-2xl font-bold font-heading mb-6 text-gray-900">Properti Serupa</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProperties.map((prop) => (
                                <PropertyCardMUI key={prop.id} property={prop} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
