'use client';

import { useState } from 'react';
import { Calculator, Percent, Calendar } from 'lucide-react';

export function MortgageCalculator() {
    // Default values
    const [price, setPrice] = useState<number>(500000000);
    const [dpPercent, setDpPercent] = useState<number>(20); // 20%
    const [interest, setInterest] = useState<number>(5.5); // 5.5%
    const [tenure, setTenure] = useState<number>(15); // 15 years

    // Derived values
    const dpAmount = price * (dpPercent / 100);
    const loanAmount = price - dpAmount;
    const interestRate = interest / 100 / 12; // Monthly interest rate
    const numberOfPayments = tenure * 12; // Total number of months

    let monthlyPayment = 0;
    if (interest === 0) {
        monthlyPayment = loanAmount / numberOfPayments;
    } else {
        // Mortgage Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, numberOfPayments)) / (Math.pow(1 + interestRate, numberOfPayments) - 1);
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-primary p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Calculator className="text-white/80" size={24} />
                    <h2 className="text-xl font-bold font-heading">Kalkulator KPR</h2>
                </div>
                <p className="text-white/80 text-sm">Simulasikan angsuran KPR properti impian Anda.</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Harga Properti</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{formatCurrency(price)}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Uang Muka (DP) - {dpPercent}%</label>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="5"
                                    value={dpPercent}
                                    onChange={(e) => setDpPercent(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                                />
                            </div>
                            <div className="relative w-24">
                                <input
                                    type="number"
                                    value={dpPercent}
                                    onChange={(e) => setDpPercent(Number(e.target.value))}
                                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-center"
                                />
                                <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Nominal DP: {formatCurrency(dpAmount)}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Suku Bunga (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                value={interest}
                                onChange={(e) => setInterest(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                            <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jangka Waktu (Tahun)</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                            <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[10, 15, 20].map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setTenure(y)}
                                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${tenure === y ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                >
                                    {y} Tahun
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-center border border-slate-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-8 text-center">Estimasi Angsuran Per Bulan</h3>

                    <div className="text-center mb-8">
                        <div className="text-4xl font-bold text-primary font-heading tracking-tight">
                            {formatCurrency(monthlyPayment)}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">*Perhitungan ini adalah estimasi.</p>
                    </div>

                    <div className="space-y-4 border-t border-gray-200 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pokok Pinjaman</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Uang Muka (DP)</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(dpAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Bunga (Est.)</span>
                            <span className="font-semibold text-gray-900">{formatCurrency((monthlyPayment * tenure * 12) - loanAmount)}</span>
                        </div>
                    </div>

                    <button className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20">
                        Ajukan KPR Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}
