'use client';

import { useState, useEffect } from 'react';
import { ListingPackage } from '@prisma/client';
import { X } from 'lucide-react';

interface PackageFormProps {
    initialData?: Omit<Partial<ListingPackage>, 'price'> & { price?: number };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PackageForm({ initialData, isOpen, onClose, onSuccess }: PackageFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        listingLimit: 1,
        durationDays: 30,
        type: 'SUBSCRIPTION'
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: Number(initialData.price) || 0,
                listingLimit: initialData.listingLimit || 1,
                durationDays: initialData.durationDays || 30,
                type: initialData.type || 'SUBSCRIPTION'
            });
        } else {
            // Reset for create mode
            setFormData({
                name: '',
                description: '',
                price: 0,
                listingLimit: 1,
                durationDays: 30,
                type: 'SUBSCRIPTION'
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = initialData?.id
                ? `/api/admin/packages/${initialData.id}`
                : '/api/admin/packages';

            const method = initialData?.id ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save package');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan paket.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg">
                        {initialData?.id ? 'Edit Paket' : 'Tambah Paket Baru'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Contoh: Pro Agent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            rows={2}
                            placeholder="Deskripsi singkat..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (IDR)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kuota Listing</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.listingLimit}
                                onChange={(e) => setFormData({ ...formData, listingLimit: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Hari)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.durationDays}
                                onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                            >
                                <option value="SUBSCRIPTION">Subscription</option>
                                <option value="TOPUP">Top Up</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
