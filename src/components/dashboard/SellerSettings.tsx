'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Save, Loader2 } from 'lucide-react';

export function SellerSettings() {
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/user/seller-settings')
            .then(res => res.json())
            .then(data => {
                setWhatsappMessage(data.whatsappMessage || '');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/seller-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsappMessage }),
            });
            if (res.ok) {
                alert('Pengaturan Seller berhasil disimpan!');
            } else {
                alert('Gagal menyimpan pengaturan.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan network.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-4 bg-gray-50 rounded-lg animate-pulse h-32"></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <MessageSquare size={24} />
                <h2 className="text-xl font-bold font-heading text-gray-900">Pengaturan Pesan WhatsApp</h2>
            </div>

            <p className="text-gray-500 text-sm mb-6">
                Atur pesan otomatis yang akan dikirim pembeli saat mereka menghubungi Anda melalui WhatsApp. Gunakan variabel {'{property_title}'} untuk memasukkan judul properti secara otomatis.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Pesan WhatsApp Default</label>
                    <textarea
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        placeholder="Contoh: Halo, saya tertarik dengan properti {property_title}. Bisa minta info lebih lanjut?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    />
                    <p className="text-xs text-gray-400 italic">
                        Preview: Halo, saya tertarik dengan properti "Rumah Mewah di Jakarta"...
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Simpan Pengaturan Pesan
                </button>
            </form>
        </div>
    );
}
