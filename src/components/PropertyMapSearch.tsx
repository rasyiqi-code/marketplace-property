'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PropertyDTO } from '@/lib/data/properties';
import { useEffect } from 'react';
import Link from 'next/link';

// Fix for Leaflet default icon issue in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapSearchProps {
    properties: PropertyDTO[];
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function PropertyMapSearch({ properties }: PropertyMapSearchProps) {
    // Filter properties that have coordinates
    const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);

    // Default center to Jakarta if no properties or first property
    const defaultCenter: [number, number] = propertiesWithCoords.length > 0
        ? [propertiesWithCoords[0].latitude as number, propertiesWithCoords[0].longitude as number]
        : [-6.2088, 106.8456];

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {propertiesWithCoords.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.latitude as number, property.longitude as number]}
                    >
                        <Popup className="property-popup">
                            <div className="w-48">
                                <div className="relative h-24 w-full mb-2 overflow-hidden rounded-md">
                                    <img
                                        src={property.imageUrl}
                                        alt={property.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h3 className="font-bold text-sm truncate">{property.title}</h3>
                                <p className="text-primary font-bold text-xs mb-1">{property.price}</p>
                                <div className="flex text-[10px] text-gray-500 gap-2 mb-2">
                                    <span>{property.bedrooms} KT</span>
                                    <span>{property.bathrooms} KM</span>
                                    <span>{property.area} m²</span>
                                </div>
                                <Link
                                    href={`/property/${property.id}`}
                                    className="block text-center bg-primary text-white text-[10px] py-1.5 rounded font-bold hover:bg-primary-dark transition-colors"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <ChangeView center={defaultCenter} />
            </MapContainer>
        </div>
    );
}
