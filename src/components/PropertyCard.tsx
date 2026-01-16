import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

export interface PropertyProps {
    id: string;
    title: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: 'sale' | 'rent';
    imageUrl: string;
}

export function PropertyCard({ property }: { property: PropertyProps }) {
    return (
        <Link href={`/property/${property.id}`} className="group bg-white border border-transparent rounded-xl overflow-hidden transition-all duration-300 relative flex flex-col shadow hover:-translate-y-1 hover:shadow-lg">
            <div className="relative w-full pt-[66.67%] bg-slate-100">
                <span className={`absolute top-3 left-3 px-3 py-1.5 rounded-md text-xs font-semibold z-10 shadow-sm tracking-wide text-white ${property.status === 'sale' ? 'bg-[#034E96]/95' : 'bg-[#E0193E]'}`}>
                    {property.status === 'sale' ? 'DIJUAL' : 'DISEWA'}
                </span>
                <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover w-full h-full absolute top-0 left-0 transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-4 flex-1 flex flex-col gap-1.5">
                <div className="font-heading text-xl font-bold text-primary mb-0 tracking-tight">{property.price}</div>
                <h3 className="font-sans text-[0.95rem] font-medium text-slate-800 leading-snug line-clamp-2 overflow-hidden">{property.title}</h3>

                <div className="text-slate-500 text-sm mb-3 flex items-center gap-1">
                    <MapPin size={16} />
                    {property.location}
                </div>

                <div className="flex items-center gap-4 mt-auto pt-3 border-t border-slate-100 text-slate-500 text-xs font-medium">
                    <div className="flex items-center gap-1">
                        <Bed size={18} />
                        <span>{property.bedrooms} Kamar</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath size={18} />
                        <span>{property.bathrooms} Toilet</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Square size={18} />
                        <span>{property.area} m²</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
