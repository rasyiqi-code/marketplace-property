'use client';

import { PropertyInput } from '@/lib/data/properties';
import { useState, useEffect } from 'react';
import { Loader2, Check, Plus, X } from 'lucide-react';

interface StepProps {
    data: PropertyInput;
    update: (data: Partial<PropertyInput>) => void;
}

interface Facility {
    id: string;
    name: string;
    icon: string | null;
}

export function StepFacilities({ data, update }: StepProps) {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customName, setCustomName] = useState('');
    const selectedFacilities = data.facilities || [];

    useEffect(() => {
        async function fetchFacilities() {
            try {
                const res = await fetch('/api/facilities');
                if (res.ok) {
                    const items = await res.json();
                    setFacilities(items);
                }
            } catch (err) {
                console.error('Failed to fetch facilities', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFacilities();
    }, []);

    const toggleFacility = (id: string) => {
        const current = [...selectedFacilities];
        const index = current.indexOf(id);

        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }

        update({ facilities: current });
    };

    const handleAddCustom = () => {
        if (!customName.trim()) return;

        // Create a temporary ID for local UI tracking
        // The backend will handle the actual creation/linking
        const newId = `custom:${customName.trim()}`;

        // Check if already exists in facilities or selected
        if (selectedFacilities.includes(newId)) {
            setCustomName('');
            setIsAddingCustom(false);
            return;
        }

        const newFacility: Facility = {
            id: newId,
            name: customName.trim(),
            icon: '✨'
        };

        setFacilities(prev => [...prev, newFacility]);
        update({ facilities: [...selectedFacilities, newId] });
        setCustomName('');
        setIsAddingCustom(false);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-gray-500">Memuat daftar fasilitas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pb-4 border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-heading text-gray-900">Fasilitas Properti</h2>
                <p className="text-gray-500 text-sm">Pilih fasilitas yang tersedia untuk meningkatkan nilai jual properti Anda.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((facility) => {
                    const isSelected = selectedFacilities.includes(facility.id);
                    return (
                        <div
                            key={facility.id}
                            onClick={() => toggleFacility(facility.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                ? 'bg-primary/5 border-primary text-primary'
                                : 'bg-white border-gray-100 hover:border-primary/30 text-gray-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                    {facility.icon || '✨'}
                                </div>
                                <span className="font-semibold text-sm">{facility.name}</span>
                            </div>
                            {isSelected && (
                                <div className="bg-primary text-white p-1 rounded-full scale-in">
                                    <Check size={14} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Custom Facility Button/Input */}
                {!isAddingCustom ? (
                    <button
                        onClick={() => setIsAddingCustom(true)}
                        className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary hover:text-primary transition-all duration-200 bg-gray-50/50"
                    >
                        <Plus size={20} />
                        <span className="font-semibold text-sm">Fasilitas Lainnya</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-primary bg-white animate-in zoom-in duration-200">
                        <input
                            autoFocus
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                            placeholder="Ketik fasilitas..."
                            className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                        />
                        <button
                            onClick={handleAddCustom}
                            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => { setIsAddingCustom(false); setCustomName(''); }}
                            className="text-gray-400 p-2 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            {facilities.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 italic">Daftar fasilitas belum tersedia.</p>
                </div>
            )}
        </div>
    );
}
