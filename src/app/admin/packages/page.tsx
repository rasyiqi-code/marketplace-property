import { stackServerApp } from '@/lib/stack';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { PackageTable } from '@/components/admin/PackageTable';

export const dynamic = 'force-dynamic';

export default async function AdminPackagesPage() {
    const user = await stackServerApp.getUser();

    if (!user) redirect('/handler/sign-in');

    // Fetch packages from DB
    const packages = await prisma.listingPackage.findMany({
        orderBy: { price: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Paket Listing</h1>
                <p className="text-gray-500">
                    Kelola paket berlangganan dan top-up untuk user.
                </p>
            </div>

            <PackageTable packages={packages} />
        </div>
    );
}
