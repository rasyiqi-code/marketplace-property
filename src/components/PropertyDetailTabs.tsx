'use client';

import { useState } from 'react';
import { Bed, Bath, Square, MapPin, Award, Home, Layers, Calendar, ChevronRight } from 'lucide-react';
import { PropertyDetailDTO } from '@/lib/data/properties';
import DynamicMap from './DynamicMap';

interface Props {
    property: PropertyDetailDTO;
}

export function PropertyDetailTabs({ property }: Props) {
    const [activeTab, setActiveTab] = useState('ringkasan');

    const tabs = [
        { id: 'ringkasan', label: 'Ringkasan' },
        { id: 'informasi', label: 'Informasi' },
        { id: 'fasilitas', label: 'Fasilitas' },
        { id: 'media', label: 'Media' },
        { id: 'lokasi', label: 'Lokasi' },
    ];

    return (
        <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-40 shadow-sm -mx-4 px-4 md:mx-0 md:px-0 h-12 overflow-hidden">
                <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar h-full items-center overflow-y-hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`h-full px-1 font-bold text-sm whitespace-nowrap border-b-2 transition-all duration-200 flex items-center ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'ringkasan' && (
                    <div className="space-y-5">
                        {/* Header Section: Price & Title */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                            {property.status === 'rent' ? 'Disewa' : 'Dijual'}
                                        </span>
                                        <span className="text-gray-400 text-xs font-medium">ID: {property.id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-900 leading-tight">
                                        {property.title}
                                    </h1>
                                    <div className="text-gray-500 flex items-center gap-1.5 text-sm">
                                        <MapPin size={16} className="text-primary/60" />
                                        {property.address}
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Harga Penawaran</p>
                                    <div className="text-3xl font-black text-primary font-heading tracking-tight">
                                        {property.price}
                                    </div>
                                </div>
                            </div>

                            {/* Core Specs Grid - 3 Column Layout */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/50">
                                    <div className="bg-white p-2 rounded-lg shadow-xs text-primary"><Bed size={20} /></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">KT</span>
                                        <span className="text-sm font-bold text-gray-900">{property.bedrooms} Kamar</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/50">
                                    <div className="bg-white p-2 rounded-lg shadow-xs text-primary"><Bath size={20} /></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">KM</span>
                                        <span className="text-sm font-bold text-gray-900">{property.bathrooms} Kamar</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/50">
                                    <div className="bg-white p-2 rounded-lg shadow-xs text-primary"><Layers size={20} /></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Luas</span>
                                        <span className="text-sm font-bold text-gray-900">{property.area} m²</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/50">
                                    <div className="bg-white p-2 rounded-lg shadow-xs text-primary"><Award size={20} /></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Legalitas</span>
                                        <span className="text-sm font-bold text-gray-900 truncate max-w-[80px]">{property.certificate || 'SHM'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Highlights Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    Deskripsi Properti
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                                    {property.description}
                                </p>
                                <button
                                    onClick={() => setActiveTab('informasi')}
                                    className="mt-3 text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                    Baca Selengkapnya <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-primary mb-2">💡 Quick Highlight</h3>
                                    <p className="text-sm text-primary/80 leading-relaxed font-medium italic">
                                        "{property.bedrooms} Kamar Tidur & {property.bathrooms} Kamar Mandi di {property.location}. Properti {property.condition || 'siap huni'} dengan luas {property.area} m²."
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-primary/10">
                                    <div className="flex -space-x-2">
                                        {property.facilities.slice(0, 3).map((f, i) => (
                                            <div key={f.id} className="w-6 h-6 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center text-[10px] shadow-sm transform hover:z-10 transition-all cursor-help" title={f.name}>
                                                {f.icon || '✨'}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">
                                        {property.facilities.length > 0 ? `${property.facilities.length} Fasilitas Tersedia` : 'Fasilitas Standar Lengkap'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'informasi' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold font-heading mb-6 text-gray-900 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                Spesifikasi Detail Properi
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Luas Bangunan</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <Layers size={14} className="text-primary/40" /> {property.area} m²
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Luas Tanah</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <Square size={14} className="text-primary/40" /> {property.landArea || '-'} m²
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Sertifikat / Legalitas</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <Award size={14} className="text-primary/40" /> {property.certificate || 'SHM'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Kondisi Properti</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <Home size={14} className="text-primary/40" /> {property.condition || '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Pilihan Perabotan</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <Calendar size={14} className="text-primary/40" /> {property.furnishing || '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Tingkat / Lantai</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <Layers size={14} className="text-primary/40" /> {property.floors || '1'} Lantai
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold font-heading mb-4 text-gray-900 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                Deskripsi Lengkap
                            </h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed">
                                <p className="whitespace-pre-line text-sm md:text-base font-medium">
                                    {property.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'fasilitas' && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                Fasilitas Unggulan
                            </h2>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                {property.facilities.length} Fasilitas Tersedia
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {property.facilities.length > 0 ? (
                                property.facilities.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:border-primary/20 hover:bg-white transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                                            {item.icon || '✨'}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{item.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 flex flex-col items-center gap-3 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <Layers size={32} />
                                    </div>
                                    <p className="text-gray-400 italic text-sm max-w-xs">Belum ada informasi fasilitas khusus untuk properti ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-8">
                        {property.videoUrl ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
                                <h2 className="text-lg font-bold font-heading mb-4 text-gray-900">Video Properti</h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-gray-200">
                                    {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${property.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=)|&v=)([^#&?]*)/)?.[1] || ''}`}
                                            className="w-full h-full"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <a href={property.videoUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors flex flex-col items-center gap-2">
                                                <span className="font-bold">Klik untuk Lihat Video</span>
                                                <span className="text-xs opacity-50">{property.videoUrl}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {property.virtualTourUrl ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
                                <h2 className="text-lg font-bold font-heading mb-4 text-gray-900">Virtual Tour 360°</h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <iframe
                                        src={property.virtualTourUrl}
                                        className="w-full h-full"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        ) : null}

                        {!property.videoUrl && !property.virtualTourUrl && (
                            <div className="bg-gray-50 rounded-xl p-20 text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">Tidak ada video atau virtual tour untuk properti ini.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'lokasi' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
                            <h2 className="text-lg font-bold font-heading mb-4 text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                Lokasi Geografis
                            </h2>
                            <p className="text-gray-600 mb-6 flex items-start gap-2 text-sm md:text-base">
                                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                                {property.address}
                            </p>
                            <div className="w-full h-[450px] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                                <DynamicMap
                                    mapsEmbed={property.mapsEmbed ?? undefined}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
