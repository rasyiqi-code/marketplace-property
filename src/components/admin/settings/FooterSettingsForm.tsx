'use client';

import React, { useActionState } from 'react';
import { updateFooterSettings } from '@/lib/actions/setting';
import { Alert, Button, CircularProgress } from '@mui/material';
import { Save } from 'lucide-react';

export interface FooterSettings {
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

interface FooterSettingsFormProps {
    initialSettings?: FooterSettings | null;
}

export default function FooterSettingsForm({ initialSettings }: FooterSettingsFormProps) {
    const settings = initialSettings || DEFAULT_SETTINGS;

    // Using simple form action without complex state management for inputs since we rely on native form behavior or detailed state if needed.
    // However, to make it interactive with "value" attributes, we need state. 
    // Or we can just use "defaultValue" which is simpler for this case.

    // @ts-expect-error - useActionState type mismatch with server action return type
    const [state, formAction, isPending] = useActionState(updateFooterSettings, {});

    return (
        <form action={formAction} className="space-y-6">
            {state.success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {state.message}
                </Alert>
            )}

            {state.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {state.error}
                </Alert>
            )}

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Branding & Deskripsi</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Footer</label>
                        <textarea
                            name="about"
                            defaultValue={settings.description}
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
                            name="facebook"
                            defaultValue={settings.socials?.facebook}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
                        <input
                            type="text"
                            name="twitter"
                            defaultValue={settings.socials?.twitter}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            defaultValue={settings.socials?.instagram}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            defaultValue={settings.socials?.linkedin}
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
                            name="email"
                            defaultValue={settings.contact?.email}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                        <input
                            type="text"
                            name="phone"
                            defaultValue={settings.contact?.phone}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor</label>
                        <input
                            type="text"
                            name="address"
                            defaultValue={settings.contact?.address}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                    sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                >
                    {isPending ? 'Menyimpan...' : 'Simpan Pengaturan Footer'}
                </Button>
            </div>
        </form>
    );
}
