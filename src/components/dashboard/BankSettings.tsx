'use client';

import { useState, useEffect } from 'react';
import { Landmark, Save, Loader2 } from 'lucide-react';

export function BankSettings() {
    const [bankName, setBankName] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [bankHolder, setBankHolder] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/user/bank')
            .then(res => res.json())
            .then(data => {
                setBankName(data.bankName || '');
                setBankAccount(data.bankAccount || '');
                setBankHolder(data.bankHolder || '');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/bank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bankName, bankAccount, bankHolder }),
            });
            if (res.ok) {
                alert('Detail bank berhasil disimpan!');
            } else {
                alert('Gagal menyimpan detail bank.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan network.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-4 bg-gray-50 rounded-lg animate-pulse h-40"></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <Landmark size={24} />
                <h2 className="text-xl font-bold font-heading text-gray-900">Informasi Rekening Bank</h2>
            </div>

            <p className="text-gray-500 text-sm mb-6">
                Informasi ini akan ditampilkan kepada pembeli saat mereka mengajukan transaksi untuk properti Anda.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nama Bank</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Contoh: Bank BCA, Mandiri, BRI"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nomor Rekening</label>
                        <input
                            type="text"
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)}
                            placeholder="Masukkan nomor rekening Anda"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Nama Pemilik Rekening</label>
                        <input
                            type="text"
                            value={bankHolder}
                            onChange={(e) => setBankHolder(e.target.value)}
                            placeholder="Nama sesuai buku tabungan"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Simpan Informasi Bank
                </button>
            </form>
        </div>
    );
}
