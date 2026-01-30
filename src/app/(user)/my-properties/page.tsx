import { stackServerApp } from '@/lib/stack';
import { getUserProperties, getDashboardStats } from '@/lib/data/properties';
import { PropertyCardMUI } from '@/components/PropertyCardMUI';
import { Plus, Edit, TrendingUp, Eye, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { DeletePropertyButton } from '@/components/DeletePropertyButton';

/**
 * Halaman My Properties - Standalone (No Sidebar)
 * Menampilkan daftar properti milik user dengan opsi Edit & Delete
 */
export default async function MyPropertiesPage() {
    const user = await stackServerApp.getUser();

    // Redirect login
    if (!user) {
        redirect('/handler/sign-in');
    }

    const [properties, stats] = await Promise.all([
        getUserProperties(user.id),
        getDashboardStats() // Read from data layer
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-gray-900">Properti Saya</h1>
                    <p className="text-gray-600">Kelola iklan properti yang Anda tayangkan.</p>
                </div>
                <Link
                    href="/post-ad"
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Tambah Properti
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Iklan</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg text-green-600">
                        <Eye size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Dilihat</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Minat Masuk</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
                    </div>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image src="/images/house-placeholder.png" alt="No properties" width={32} height={32} className="opacity-40" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada properti</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Anda belum memasang iklan properti apapun. Mulai pasang iklan sekarang untuk menjangkau calon pembeli.
                    </p>
                    <Link
                        href="/post-ad"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        <Plus size={16} />
                        Pasang Iklan Baru
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="relative group">
                            <PropertyCardMUI property={property} showWishlist={false} />

                            {/* Action Overlay */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg backdrop-blur-sm shadow-sm z-10">
                                <Link
                                    href={`/my-properties/${property.id}/edit`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Edit Properti"
                                >
                                    <Edit size={18} />
                                </Link>
                                <DeletePropertyButton propertyId={property.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
