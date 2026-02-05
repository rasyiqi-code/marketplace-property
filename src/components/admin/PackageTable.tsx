'use client';

import { useState } from 'react';
import { ListingPackage } from '@prisma/client';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PackageForm } from './PackageForm';

interface PackageTableProps {
    packages: ListingPackage[];
}

export function PackageTable({ packages }: PackageTableProps) {
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ListingPackage | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleCreate = () => {
        setEditingPackage(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (pkg: ListingPackage) => {
        setEditingPackage(pkg);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal menghapus paket');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus paket.');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSuccess = () => {
        router.refresh();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Daftar Paket Listing</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Tambah Paket
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Nama Paket</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4 text-center">Kuota</th>
                                <th className="px-6 py-4 text-center">Durasi</th>
                                <th className="px-6 py-4">Tipe</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {packages.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {pkg.name}
                                        {pkg.description && (
                                            <p className="text-xs text-gray-400 font-normal mt-0.5 line-clamp-1">
                                                {pkg.description}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(pkg.price))}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                                            {pkg.listingLimit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">
                                        {pkg.durationDays} Hari
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${pkg.type === 'SUBSCRIPTION'
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'bg-orange-50 text-orange-700'
                                            }`}>
                                            {pkg.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(pkg)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pkg.id)}
                                                disabled={isDeleting === pkg.id}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting === pkg.id ? (
                                                    <span className="w-4 h-4 block border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {packages.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Belum ada paket listing. Silakan buat baru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PackageForm
                initialData={editingPackage}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
