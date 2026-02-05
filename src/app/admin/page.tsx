import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Users, Home, ArrowUpCircle, Clock } from 'lucide-react';

export default async function AdminDashboardPage() {
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();

    // Count pending upgrade requests
    const pendingUpgradeRequests = await (prisma.accountUpgradeRequest.count({
        where: { status: 'PENDING' }
    }));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-heading text-gray-900">Admin Overview</h1>
                <p className="text-gray-600">Statistik sistem saat ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-primary" size={20} />
                        <h3 className="font-bold text-gray-500 text-sm uppercase">Total Users</h3>
                    </div>
                    <p className="text-4xl font-bold text-primary">{userCount}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Home className="text-primary" size={20} />
                        <h3 className="font-bold text-gray-500 text-sm uppercase">Total Properties</h3>
                    </div>
                    <p className="text-4xl font-bold text-primary">{propertyCount}</p>
                </div>

                {/* Upgrade Requests Card */}
                <Link
                    href="/admin/upgrade-requests"
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm border-2 border-yellow-200 hover:border-yellow-300 transition-all hover:shadow-md group"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <ArrowUpCircle className="text-yellow-600" size={20} />
                            <h3 className="font-bold text-gray-700 text-sm uppercase">Upgrade Requests</h3>
                        </div>
                        {pendingUpgradeRequests > 0 && (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {pendingUpgradeRequests}
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-yellow-700">{pendingUpgradeRequests}</p>
                        <p className="text-sm text-yellow-600">pending</p>
                    </div>
                    {pendingUpgradeRequests > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-yellow-700">
                            <Clock size={14} />
                            <span>Membutuhkan review</span>
                        </div>
                    )}
                    <div className="mt-3 text-sm font-bold text-yellow-700 group-hover:text-yellow-800">
                        Review Requests →
                    </div>
                </Link>
            </div>

            {/* Recent Activity Mockup */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Aktivitas Terbaru</h3>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 italic">Belum ada aktivitas tercatat.</p>
                </div>
            </div>
        </div>
    );
}
