'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HERO_IMAGES } from '@/data/mockData';

export function Hero() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    };

    const handleSearch = () => {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative h-[600px] w-full flex items-end justify-center pb-12 mb-8 overflow-hidden">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                {HERO_IMAGES.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Hero Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Dark Overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg hidden md:block"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg hidden md:block"
            >
                <ChevronRight size={32} />
            </button>

            {/* Slider Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {HERO_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="container flex justify-center relative z-10 w-full px-4">
                <div className="bg-gradient-to-r from-[#034E96]/95 to-[#033C78]/95 p-4 md:p-6 rounded-xl w-full max-w-[800px] shadow-2xl flex flex-col items-center text-white backdrop-blur-sm">
                    <h1 className="text-xl md:text-2xl font-semibold mb-2 text-center font-heading leading-tight">
                        Jual Beli dan Sewa Properti Jadi Mudah
                    </h1>

                    <div className="flex gap-4 md:gap-8 mb-4 w-full justify-center border-b border-white/20">
                        <button className="text-white font-semibold pb-2 text-sm md:text-base relative after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[3px] after:bg-white after:rounded-t-sm">
                            Dijual
                        </button>
                        <button className="text-white/70 hover:text-white font-medium pb-2 text-sm md:text-base transition-colors">
                            Disewa
                        </button>
                        <button className="text-white/70 hover:text-white font-medium pb-2 text-sm md:text-base transition-colors">
                            Properti Baru
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row w-full bg-white p-1.5 rounded-lg gap-2">
                        <div className="flex-1 flex items-center">
                            <input
                                type="text"
                                placeholder="Lokasi, keyword, area, project, developer"
                                className="w-full border-none outline-none px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-accent hover:bg-red-700 text-white border-none px-6 py-2 md:px-8 md:py-2.5 rounded-md font-semibold text-sm md:text-base cursor-pointer transition-colors w-full md:w-auto"
                        >
                            Cari
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
