import { prisma } from '@/lib/db';
import { ListingPackage } from '@prisma/client';
import { stackServerApp } from '@/lib/stack';
import { CheckoutButton } from '@/components/payment/CheckoutButton';

export default async function PricingPage() {
    const packages = await prisma.listingPackage.findMany({
        orderBy: { price: 'asc' }
    });

    const user = await stackServerApp.getUser();

    return (
        <div className="min-h-screen bg-neutral-900 py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                    Pilih Paket <span className="text-primary">Terbaik</span> Anda
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Mulai pasang iklan properti Anda sekarang. Pilih paket yang sesuai dengan kebutuhan Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {packages.map((pkg: ListingPackage) => (
                    <div
                        key={pkg.id}
                        className={`relative rounded-2xl p-8 border ${pkg.price.toNumber() > 500000
                            ? 'bg-neutral-800 border-primary shadow-2xl shadow-primary/10 scale-105'
                            : 'bg-neutral-800/50 border-neutral-700'
                            }`}
                    >
                        {pkg.price.toNumber() > 500000 && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Recommended
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                            <p className="text-gray-400 text-sm h-12">{pkg.description}</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-white">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price.toNumber())}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                                {pkg.type === 'SUBSCRIPTION' ? '/ bulan' : `/ ${pkg.listingLimit} listing`}
                            </span>
                        </div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-gray-300 text-sm">
                                <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                                {pkg.listingLimit >= 9999 ? 'Listing Tanpa Batas' : `Kuota ${pkg.listingLimit} Listing`}
                            </li>
                            <li className="flex items-center text-gray-300 text-sm">
                                <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                                Aktif selama {pkg.durationDays} Hari
                            </li>
                            <li className="flex items-center text-gray-300 text-sm">
                                <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                                Priority Support
                            </li>
                        </ul>

                        <CheckoutButton
                            packageId={pkg.id}
                            isLoggedIn={!!user}
                            className="py-4 bg-primary text-black rounded-xl font-bold hover:bg-white hover:scale-[1.02] transition-all"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}


