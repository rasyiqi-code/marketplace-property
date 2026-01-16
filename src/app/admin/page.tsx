import { prisma } from '@/lib/db';

export default async function AdminDashboardPage() {
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    const agentCount = await prisma.agent.count();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-heading text-gray-900">Admin Overview</h1>
                <p className="text-gray-600">Statistik sistem saat ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Total Users</h3>
                    <p className="text-4xl font-bold text-primary">{userCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Total Properties</h3>
                    <p className="text-4xl font-bold text-primary">{propertyCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Total Agents</h3>
                    <p className="text-4xl font-bold text-primary">{agentCount}</p>
                </div>
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
