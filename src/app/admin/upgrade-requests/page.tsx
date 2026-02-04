import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Building2 } from 'lucide-react';
import { UpgradeRequestActions } from '@/components/admin/UpgradeRequestActions';

export default async function AdminUpgradeRequestsPage() {
    const requests = await (prisma.accountUpgradeRequest.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    }) as any);

    const pendingCount = requests.filter((r: any) => r.status === 'PENDING').length;

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
                >
                    <ArrowLeft size={20} />
                    Kembali ke Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900">
                            Account Upgrade Requests
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Review dan approve/reject request upgrade dari user
                        </p>
                    </div>
                    {pendingCount > 0 && (
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2">
                            <p className="text-sm font-bold text-yellow-800">
                                {pendingCount} request menunggu review
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Clock className="mx-auto text-gray-300" size={64} />
                    <p className="text-gray-500 mt-4">Belum ada request upgrade</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Upgrade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.map((request: any) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="text-gray-400" size={16} />
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {request.user.name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {request.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {request.requestedType === 'AGENCY' && <Building2 className="text-primary" size={16} />}
                                            <span className="font-bold text-gray-700">
                                                {request.currentType} → {request.requestedType}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {request.reason || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {request.status === 'PENDING' && <Clock size={12} />}
                                            {request.status === 'APPROVED' && <CheckCircle size={12} />}
                                            {request.status === 'REJECTED' && <XCircle size={12} />}
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(request.createdAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <UpgradeRequestActions
                                            requestId={request.id}
                                            status={request.status}
                                            adminNote={request.adminNote}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
