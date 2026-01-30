'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyInput } from '@/lib/data/properties';
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react';

export function PostAdForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<PropertyInput>({
        title: '',
        description: '',
        price: 0,
        location: '',
        address: '',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        type: 'Rumah',
        status: 'sale',
        imageUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Gagal menyimpan properti');
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/search?sort=newest');
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Gagal menyimpan properti. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-green-50 rounded-xl p-8 text-center border border-green-100 flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Iklan Berhasil Terbit!</h3>
                <p className="text-gray-600">Properti Anda kini sudah online dan bisa dilihat oleh calon pembeli.</p>
                <p className="text-sm text-gray-500 mt-4">Mengalihkan ke halaman pencarian...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                <UploadCloud className="text-primary" />
                Informasi Properti
            </h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Iklan *</label>
                    <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Contoh: Rumah Minimalis Siap Huni di Jakarta Selatan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Lengkap *</label>
                    <textarea
                        required
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Jelaskan detail properti, keunggulan, dan fasilitas sekitar..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp) *</label>
                    <input
                        required
                        type="number"
                        name="price"
                        min="0"
                        value={formData.price || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`cursor-pointer border rounded-lg p-2 text-center transition-colors ${formData.status === 'sale' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="status"
                                value="sale"
                                checked={formData.status === 'sale'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            Dijual
                        </label>
                        <label className={`cursor-pointer border rounded-lg p-2 text-center transition-colors ${formData.status === 'rent' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="status"
                                value="rent"
                                checked={formData.status === 'rent'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            Disewa
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Properti</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                        <option value="Rumah">Rumah</option>
                        <option value="Apartemen">Apartemen</option>
                        <option value="Ruko">Ruko</option>
                        <option value="Tanah">Tanah</option>
                        <option value="Villa">Villa</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Luas Bangunan (m²) *</label>
                    <input
                        required
                        type="number"
                        name="area"
                        min="1"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kamar Tidur</label>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, bedrooms: Math.max(0, p.bedrooms - 1) }))}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                            -
                        </button>
                        <span className="font-semibold text-lg w-8 text-center">{formData.bedrooms}</span>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, bedrooms: p.bedrooms + 1 }))}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kamar Mandi</label>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, bathrooms: Math.max(0, p.bathrooms - 1) }))}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                            -
                        </button>
                        <span className="font-semibold text-lg w-8 text-center">{formData.bathrooms}</span>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, bathrooms: p.bathrooms + 1 }))}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
                    <input
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nama Jalan, Nomor, RT/RW"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi (Kota/Daerah) *</label>
                    <input
                        required
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Contoh: Jakarta Selatan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Foto Utama</label>
                    <input
                        type="url"
                        name="imageUrl"
                        required
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Masukkan link gambar yang valid (bisa dari Unsplash atau image hosting lain).</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                    {isLoading ? 'Menyimpan...' : 'Tayangkan Iklan Sekarang'}
                </button>
            </div>
        </form>
    );
}
