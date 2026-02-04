'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyInput } from '@/lib/data/properties';
import { CheckCircle2 } from 'lucide-react';

// Steps
import { StepBasicInfo } from './StepBasicInfo';
import { StepDetails } from './StepDetails';
import { StepFacilities } from './StepFacilities';
import { StepMedia } from './StepMedia';
import { StepVerification } from './StepVerification';
import { LivePreview } from './LivePreview';

const STEPS = [
    { title: 'Info Dasar', icon: '1' },
    { title: 'Detail', icon: '2' },
    { title: 'Fasilitas', icon: '3' },
    { title: 'Media', icon: '4' },
    { title: 'Verifikasi', icon: '5' },
];

interface PostAdWizardProps {
    initialData?: PropertyInput;
    isEditMode?: boolean;
    propertyId?: string;
}

export function PostAdWizard({ initialData, isEditMode = false, propertyId }: PostAdWizardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const [formData, setFormData] = useState<PropertyInput>(initialData || {
        title: '',
        description: '',
        price: 0,
        location: '',
        address: '',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        landArea: 60,
        type: 'Rumah',
        status: 'sale',
        imageUrl: '',
        certificate: 'SHM',
        condition: 'Baru',
        furnishing: 'Unfurnished',
        floors: 1,
        facilities: [],
    });

    const [currentStep, setCurrentStep] = useState(0);

    // Initial restoration from localStorage
    useEffect(() => {
        setIsMounted(true);
        if (!isEditMode) {
            const savedData = localStorage.getItem('proestate_post_ad_data');
            const savedStep = localStorage.getItem('proestate_post_ad_step');

            if (savedData) {
                try {
                    setFormData(JSON.parse(savedData));
                } catch (e) {
                    console.error('Failed to parse saved form data', e);
                }
            }
            if (savedStep) {
                setCurrentStep(parseInt(savedStep, 10));
            }
        }
    }, [isEditMode]);

    // Save state to localStorage
    useEffect(() => {
        if (!isEditMode) {
            localStorage.setItem('proestate_post_ad_data', JSON.stringify(formData));
            localStorage.setItem('proestate_post_ad_step', currentStep.toString());
        }
    }, [formData, currentStep, isEditMode]);

    const updateFormData = (updates: Partial<PropertyInput>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        if (currentStep === 0) {
            if (!formData.latitude || !formData.longitude) {
                alert('Silakan tandai lokasi properti Anda di peta sebelum melanjutkan.');
                return;
            }
        }
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((p) => p + 1);
        }
    };
    const prevStep = () => setCurrentStep((p) => Math.max(0, p - 1));

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (isEditMode && propertyId) {
                // Update via API
                const res = await fetch(`/api/properties/${propertyId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Gagal mengupdate properti');
                }

                // Redirect directly for edit mode
                router.push('/my-properties');
                router.refresh();
            } else {
                // Create via API
                const res = await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    if (res.status === 409) {
                        alert(`PERINGATAN DUPLIKASI:\n\n${errorData.message}`);
                        setIsLoading(false);
                        return; // Stop processing
                    }
                    throw new Error(errorData.error || 'Gagal membuat properti');
                }

                // Clear storage on success
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('proestate_post_ad_data');
                    localStorage.removeItem('proestate_post_ad_step');
                }

                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/my-properties');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Gagal menyimpan properti.');
            setIsLoading(false);
        }
    };

    if (!isMounted) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-green-600 w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold font-heading text-gray-900 mb-3">Selamat! Iklan Tayang.</h3>
                <p className="text-gray-600 text-lg">Properti Anda kini sudah dapat dilihat oleh jutaan pencari properti.</p>
                <p className="text-sm text-gray-400 mt-8">Mengalihkan ke halaman pencarian...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content - Form */}
            <div className="lg:col-span-8 space-y-8">
                {/* Progress Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between">
                            {STEPS.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${idx <= currentStep ? 'bg-primary text-white scale-110' : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <span className={`text-xs font-medium ${idx <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 min-h-[400px]">
                    {currentStep === 0 && <StepBasicInfo data={formData} update={updateFormData} />}
                    {currentStep === 1 && <StepDetails data={formData} update={updateFormData} />}
                    {currentStep === 2 && <StepFacilities data={formData} update={updateFormData} />}
                    {currentStep === 3 && <StepMedia data={formData} update={updateFormData} />}
                    {currentStep === 4 && <StepVerification data={formData} isLoading={isLoading} onSubmit={handleSubmit} />}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Kembali
                    </button>
                    {currentStep < STEPS.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            Lanjut
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Sidebar - Live Preview */}
            <div className="lg:col-span-4">
                <div className="sticky top-24">
                    <LivePreview data={formData} />
                </div>
            </div>
        </div>
    );
}
