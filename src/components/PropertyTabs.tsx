'use client';

import { useEffect, useState } from 'react';

const tabs = [
    { id: 'ringkasan', label: 'Ringkasan' },
    { id: 'informasi', label: 'Informasi' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'media', label: 'Media' },
    { id: 'lokasi', label: 'Lokasi' },
];

export function PropertyTabs() {
    const [activeTab, setActiveTab] = useState('ringkasan');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120; // Offset for sticky header

            for (const tab of [...tabs].reverse()) {
                const element = document.getElementById(tab.id);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveTab(tab.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Sticky header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveTab(id);
        }
    };

    return (
        <div className="border-b border-gray-200 mb-8 sticky top-0 bg-white z-40 pt-2 transition-all">
            <div className="flex gap-8 overflow-x-auto no-scrollbar container px-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`pb-4 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
