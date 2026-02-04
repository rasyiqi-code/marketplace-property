'use client';

import { useState, useEffect } from 'react';
import { User, Building2, FileText, Phone, Save, Loader2, BadgeCheck, AlertCircle, CheckCircle, Clock, ArrowUpCircle } from 'lucide-react';
import { UpgradeRequestModal } from './UpgradeRequestModal';

interface SellerProfile {
    phone: string;
    bio: string;
    company: string;
    accountType: 'INDIVIDUAL' | 'AGENT' | 'AGENCY';
    photo: string | null;
}

interface UpgradeRequest {
    id: string;
    requestedType: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    adminNote: string | null;
}

export function SellerProfileSettings() {
    const [profile, setProfile] = useState<SellerProfile>({
        phone: '',
        bio: '',
        company: '',
        accountType: 'INDIVIDUAL',
        photo: null,
    });
    const [upgradeRequest, setUpgradeRequest] = useState<UpgradeRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Fetch profile
            const profileRes = await fetch('/api/user/seller-profile');
            const profileData = await profileRes.json();
            setProfile({
                phone: profileData.phone || '',
                bio: profileData.bio || '',
                company: profileData.company || '',
                accountType: profileData.accountType || 'INDIVIDUAL',
                photo: profileData.photo || null,
            });

            // Fetch upgrade request status
            const requestRes = await fetch('/api/user/upgrade-request');
            const requestData = await requestRes.json();
            if (requestData.hasRequest) {
                setUpgradeRequest(requestData.request);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/seller-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: profile.phone,
                    bio: profile.bio,
                    company: profile.company,
                }),
            });
            if (res.ok) {
                alert('Profil seller berhasil disimpan!');
            } else {
                alert('Gagal menyimpan profil.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan network.');
        } finally {
            setIsSaving(false);
        }
    };

    const getAccountTypeLabel = (type: string) => {
        switch (type) {
            case 'AGENT': return 'Agent Properti';
            case 'AGENCY': return 'Agency Properti';
            default: return 'Individual';
        }
    };

    if (isLoading) return <div className="p-4 bg-gray-50 rounded-lg animate-pulse h-96"></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <User size={24} />
                <h2 className="text-xl font-bold font-heading text-gray-900">Profil Seller</h2>
            </div>

            <p className="text-gray-500 text-sm mb-6">
                Lengkapi profil Anda sebagai seller properti. Informasi ini akan ditampilkan pada listing properti Anda.
            </p>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Account Type - Read Only dengan Upgrade Button */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <BadgeCheck size={16} />
                        Tipe Akun
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg text-gray-900">{getAccountTypeLabel(profile.accountType)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {profile.accountType === 'INDIVIDUAL'
                                        ? 'Akun pemilik properti individual'
                                        : 'Akun profesional terverifikasi'}
                                </p>
                            </div>
                            {profile.accountType === 'INDIVIDUAL' && !upgradeRequest && (
                                <button
                                    type="button"
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold"
                                >
                                    <ArrowUpCircle size={16} />
                                    Upgrade
                                </button>
                            )}
                        </div>

                        {/* Status Upgrade Request */}
                        {upgradeRequest && (
                            <div className={`mt-3 p-3 rounded-lg border ${upgradeRequest.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
                                    upgradeRequest.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                                        'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-start gap-2">
                                    {upgradeRequest.status === 'PENDING' && <Clock className="text-yellow-600 mt-0.5" size={18} />}
                                    {upgradeRequest.status === 'APPROVED' && <CheckCircle className="text-green-600 mt-0.5" size={18} />}
                                    {upgradeRequest.status === 'REJECTED' && <AlertCircle className="text-red-600 mt-0.5" size={18} />}
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${upgradeRequest.status === 'PENDING' ? 'text-yellow-800' :
                                                upgradeRequest.status === 'APPROVED' ? 'text-green-800' :
                                                    'text-red-800'
                                            }`}>
                                            {upgradeRequest.status === 'PENDING' && `Request Upgrade ke ${getAccountTypeLabel(upgradeRequest.requestedType)} - Menunggu Review Admin`}
                                            {upgradeRequest.status === 'APPROVED' && 'Request Approved! Reload halaman untuk melihat perubahan.'}
                                            {upgradeRequest.status === 'REJECTED' && 'Request Ditolak'}
                                        </p>
                                        {upgradeRequest.adminNote && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                <strong>Admin:</strong> {upgradeRequest.adminNote}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Phone size={16} />
                        Nomor WhatsApp
                    </label>
                    <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="08123456789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <p className="text-xs text-gray-400 italic">
                        Nomor ini akan digunakan untuk tombol WhatsApp di listing properti Anda.
                    </p>
                </div>

                {/* Company (hanya untuk AGENT/AGENCY) */}
                {(profile.accountType === 'AGENT' || profile.accountType === 'AGENCY') && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Building2 size={16} />
                            Nama Perusahaan/Agency
                        </label>
                        <input
                            type="text"
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                            placeholder="PT. ProEstate Realty"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                )}

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FileText size={16} />
                        Bio / Deskripsi
                    </label>
                    <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Ceritakan tentang Anda atau pengalaman Anda di bidang properti..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    />
                    <p className="text-xs text-gray-400 italic">
                        Bio akan ditampilkan di halaman detail properti untuk memberikan kepercayaan kepada calon pembeli.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Simpan Profil Seller
                </button>
            </form>

            {/* Upgrade Request Modal */}
            <UpgradeRequestModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onSuccess={loadData}
            />
        </div>
    );
}
