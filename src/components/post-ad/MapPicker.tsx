'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface MapPickerProps {
    lat?: number;
    lng?: number;
    mapsEmbed?: string;
    onChange: (lat: number, lng: number, embed: string) => void;
}

export default function MapPicker({ lat, lng, mapsEmbed, onChange }: MapPickerProps) {
    const [inputValue, setInputValue] = useState(mapsEmbed || '');
    const hasInitialized = useRef(false);

    // Helper: Ekstraksi src dari iframe atau link
    const getPreviewSrc = useCallback((input: string) => {
        let src = '';
        if (input.includes('<iframe')) {
            const match = input.match(/src="([^"]+)"/);
            if (match) src = match[1];
        } else if (input.startsWith('http')) {
            src = input;
        }
        return src;
    }, []);

    // Derived state: previewSrc diturunkan langsung dari inputValue
    const previewSrc = useMemo(() => getPreviewSrc(inputValue), [inputValue, getPreviewSrc]);

    // Helper: Ekstraksi koordinat
    const extractCoords = useCallback((src: string) => {
        const latMatch = src.match(/!3d(-?\d+\.\d+)/);
        const lngMatch = src.match(/!2d(-?\d+\.\d+)/);
        return {
            extractedLat: latMatch ? parseFloat(latMatch[1]) : null,
            extractedLng: lngMatch ? parseFloat(lngMatch[1]) : null
        };
    }, []);

    // Effect untuk inisialisasi awal koordinat jika mapsEmbed sudah ada tapi lat/lng masih kosong (misal saat restore dari localStorage)
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            // Hanya jalankan auto-sync jika kita punya embed tapi tidak punya koordinat
            if (previewSrc && (!lat || !lng)) {
                const { extractedLat, extractedLng } = extractCoords(previewSrc);
                if (extractedLat !== null && extractedLng !== null) {
                    onChange(extractedLat, extractedLng, inputValue);
                }
            }
        }
    }, [extractCoords, inputValue, lat, lng, onChange, previewSrc]);

    const handleInputChange = (val: string) => {
        setInputValue(val);

        // Langsung hitung dan beritahu parent saat input berubah
        const nextPreviewSrc = getPreviewSrc(val);
        const { extractedLat, extractedLng } = extractCoords(nextPreviewSrc);

        if (extractedLat !== null && extractedLng !== null) {
            onChange(extractedLat, extractedLng, val);
        } else if (val === '') {
            onChange(0, 0, '');
        } else {
            // Jika ada teks tapi tidak ada koordinat (misal link pendek), tetap kirim teksnya ke parent
            onChange(lat || 0, lng || 0, val);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Cara Mendapatkan Kode Embed:</p>
                    <ol className="list-decimal ml-4 space-y-1 opacity-90">
                        <li>Buka Google Maps, cari lokasi properti.</li>
                        <li>Klik tombol <strong>Bagikan</strong> (Share).</li>
                        <li>Pilih tab <strong>Sematkan peta</strong> (Embed a map).</li>
                        <li>Klik <strong>Salin HTML</strong> dan tempel di bawah.</li>
                    </ol>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tempel Kode Embed / Iframe Google Maps</label>
                <textarea
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-xs h-24"
                />
            </div>

            {previewSrc && (
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Pratinjau Lokasi:</label>
                    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-300 shadow-inner">
                        <iframe
                            src={previewSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
