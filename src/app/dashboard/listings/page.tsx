import { auth } from '@/auth';
import { getUserProperties } from '@/actions/properties';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MyListingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const properties = await getUserProperties(session.user.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Iklan Saya</h1>
                    <p className="text-gray-600">Kelola properti yang Anda sewakan atau jual</p>
                </div>
                <Link
                    href="/post-ad"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Pasang Iklan Baru</span>
                </Link>
            </div>

            <PropertyTable properties={properties} />
        </div>
    );
}
