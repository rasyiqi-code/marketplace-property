'use client';

import { useState } from 'react';
import { PropertyDTO } from '@/lib/data/properties';
import { Trash2, ExternalLink, Star, Edit } from 'lucide-react';
import Link from 'next/link';

interface PropertyTableProps {
    properties: PropertyDTO[];
}

export function PropertyTable({ properties: initialProperties }: PropertyTableProps) {
    const [properties, setProperties] = useState(initialProperties);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus properti ini?')) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal menghapus properti');

            setProperties((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Failed to delete property:', error);
            alert('Gagal menghapus properti.');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        setIsToggling(id);
        try {
            const res = await fetch(`/api/admin/properties/${id}/feature`, { method: 'PATCH' });
            if (!res.ok) throw new Error('Gagal mengubah status featured');

            setProperties((prev) => prev.map((p) =>
                p.id === id ? { ...p, featured: !currentStatus } : p
            ));
        } catch (error) {
            console.error('Failed to toggle featured:', error);
            alert('Gagal mengubah status featured.');
        } finally {
            setIsToggling(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Judul</th>
                            <th className="px-6 py-4">Lokasi</th>
                            <th className="px-6 py-4">Harga</th>
                            <th className="px-6 py-4">Featured</th>
                            <th className="px-6 py-4">Tipe</th>
                            <th className="px-6 py-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {properties.map((property) => (
                            <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={property.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'}
                                            alt={property.title}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={property.title}>
                                            {property.title}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{property.location}</td>
                                <td className="px-6 py-4 font-medium text-primary">{property.price}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleFeatured(property.id, property.featured)}
                                        disabled={isToggling === property.id}
                                        className={`transition-colors p-1 rounded-full hover:bg-gray-100 ${property.featured ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        title={property.featured ? 'Hapus dari Featured' : 'Jadikan Featured'}
                                    >
                                        <Star className={`w-5 h-5 ${property.featured ? 'fill-current' : ''}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'sale'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-green-50 text-green-700'
                                            }`}
                                    >
                                        {property.status === 'sale' ? 'Dijual' : 'Disewa'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/property/${property.id}`}
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                            title="Lihat"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/properties/${property.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            disabled={isDeleting === property.id}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            title="Hapus"
                                        >
                                            {isDeleting === property.id ? (
                                                <span className="animate-spin w-4 h-4 block border-2 border-red-600 border-t-transparent rounded-full"></span>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {properties.length === 0 && (
                <div className="p-8 text-center text-gray-400">Belum ada properti.</div>
            )}
        </div>
    );
}
