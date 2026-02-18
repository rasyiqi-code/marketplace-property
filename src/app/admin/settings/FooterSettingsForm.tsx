'use client';

import React, { useState, useEffect } from 'react';

interface FooterSettings {
    description: string;
    socials: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
    };
    contact: {
        email: string;
        phone: string;
        address: string;
    };
}

const DEFAULT_SETTINGS: FooterSettings = {
    description: 'Platform properti terpercaya untuk menemukan rumah impian Anda. Jual, beli, dan sewa properti dengan mudah dan aman.',
    socials: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
    },
    contact: {
        email: 'support@proestate.id',
        phone: '+62 21 5555 6666',
        address: 'Jakarta, Indonesia',
    },
};

export default function FooterSettingsForm() {
    const [settings, setSettings] = useState<FooterSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings?key=footer_settings');
            const data = await res.json();
            if (data && data.value) {
                setSettings(data.value);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'footer_settings',
                    value: settings,
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Pengaturan footer berhasil disimpan!' });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Gagal menyimpan pengaturan' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-gray-500">Memuat pengaturan...</div>;

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Branding & Deskripsi</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Footer</label>
                        <textarea
                            value={settings.description}
                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Media Sosial (URL)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                        <input
                            type="text"
                            value={settings.socials.facebook}
                            onChange={(e) => setSettings({
                                ...settings,
                                socials: { ...settings.socials, facebook: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                        <input
                            type="text"
                            value={settings.socials.twitter}
                            onChange={(e) => setSettings({
                                ...settings,
                                socials: { ...settings.socials, twitter: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input
                            type="text"
                            value={settings.socials.instagram}
                            onChange={(e) => setSettings({
                                ...settings,
                                socials: { ...settings.socials, instagram: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                            type="text"
                            value={settings.socials.linkedin}
                            onChange={(e) => setSettings({
                                ...settings,
                                socials: { ...settings.socials, linkedin: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Dukungan</label>
                        <input
                            type="email"
                            value={settings.contact.email}
                            onChange={(e) => setSettings({
                                ...settings,
                                contact: { ...settings.contact, email: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                        <input
                            type="text"
                            value={settings.contact.phone}
                            onChange={(e) => setSettings({
                                ...settings,
                                contact: { ...settings.contact, phone: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor</label>
                        <input
                            type="text"
                            value={settings.contact.address}
                            onChange={(e) => setSettings({
                                ...settings,
                                contact: { ...settings.contact, address: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Menyimpan...' : 'Simpan Pengaturan Footer'}
                </button>
            </div>
        </form>
    );
}
