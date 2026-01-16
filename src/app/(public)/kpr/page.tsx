import { MortgageCalculator } from '@/components/MortgageCalculator';

export default function KprPage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">


            <main className="container py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Simulasi KPR Properti</h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Hitung estimasi cicilan bulanan rumah impian Anda dengan mudah menggunakan kalkulator simulasi KPR kami.
                        </p>
                    </div>

                    <MortgageCalculator />

                    {/* SEO / Info Content */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-heading font-bold text-lg mb-3 text-primary">Apa itu KPR?</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Kredit Pemilikan Rumah (KPR) adalah fasilitas kredit yang diberikan oleh perbankan kepada para nasabah perorangan yang akan membeli atau memperbaiki rumah.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-heading font-bold text-lg mb-3 text-primary">Persyaratan Umum</h3>
                            <ul className="text-sm text-gray-600 list-disc pl-4 space-y-2">
                                <li>WNI dan berdomisili di Indonesia</li>
                                <li>Usia minimal 21 tahun</li>
                                <li>Memiliki penghasilan tetap</li>
                                <li>Dokumen lengkap (KTP, NPWP, Slip Gaji)</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-heading font-bold text-lg mb-3 text-primary">Tips Pengajuan</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Pastikan rasio cicilan tidak melebihi 30% dari penghasilan bulanan Anda agar pengajuan lebih mudah disetujui oleh bank.
                            </p>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
}
