'use client';

import { PropertyInput } from '@/lib/data/properties';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface StepProps {
    data: PropertyInput;
    update: (data: Partial<PropertyInput>) => void;
}

export function StepMedia({ data, update }: StepProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset states
        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengupload gambar');
            }

            const result = await response.json();
            update({ imageUrl: result.url, imageHash: result.hash });
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(error instanceof Error ? error.message : 'Terjadi kesalahan saat upload');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        update({ imageUrl: '' });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pb-4 border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-heading text-gray-900">Upload Media</h2>
                <p className="text-gray-500 text-sm">Foto berkualitas tinggi adalah kunci penjualan. Masukkan foto terbaik properti Anda.</p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
            />

            {!data.imageUrl ? (
                <div
                    onClick={triggerFileInput}
                    className={`bg-slate-50 border-2 border-dashed ${uploadError ? 'border-red-300' : 'border-slate-300'} rounded-2xl p-12 text-center hover:bg-slate-100 transition-colors cursor-pointer group`}
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {isUploading ? (
                            <Loader2 className="text-primary w-10 h-10 animate-spin" />
                        ) : (
                            <UploadCloud className={`w-10 h-10 ${uploadError ? 'text-red-500' : 'text-primary'}`} />
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {isUploading ? 'Sedang Mengupload...' : 'Klik untuk Upload Foto Utama'}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Maksimal ukuran file 5MB. Format JPG, PNG, atau WebP.
                    </p>
                    {uploadError && (
                        <p className="text-red-500 text-sm mt-4 font-medium">{uploadError}</p>
                    )}
                </div>
            ) : (
                <div className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-100">
                    <Image
                        src={data.imageUrl}
                        alt="Property Preview"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={removeImage}
                            className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                            Foto Utama
                        </span>
                        <button
                            onClick={triggerFileInput}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                            <ImageIcon size={16} />
                            Ganti Foto
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube/Vimeo)</label>
                    <input
                        type="url"
                        value={data.videoUrl || ''}
                        onChange={(e) => update({ videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-400">Masukkan link YouTube agar pembeli bisa melihat video properti.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Tour 360° URL</label>
                    <input
                        type="url"
                        value={data.virtualTourUrl || ''}
                        onChange={(e) => update({ virtualTourUrl: e.target.value })}
                        placeholder="https://my.matterport.com/show/..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-400">Masukkan link virtual tour (misal Matterport atau 3dvista).</p>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Foto Utama (Opsi Lanjutan)</label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <ImageIcon size={18} />
                        </span>
                        <input
                            type="url"
                            value={data.imageUrl}
                            onChange={(e) => update({ imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
