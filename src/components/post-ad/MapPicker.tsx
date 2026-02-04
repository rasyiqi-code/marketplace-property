'use client';

import { useState, useEffect } from 'react';

interface MapPickerProps {
    lat?: number;
    lng?: number;
    mapsEmbed?: string;
    onChange: (lat: number, lng: number, embed: string) => void;
}

export default function MapPicker({ lat, lng, mapsEmbed, onChange }: MapPickerProps) {
    const [embedInput, setEmbedInput] = useState(mapsEmbed || '');
    const [previewSrc, setPreviewSrc] = useState('');

    useEffect(() => {
        if (mapsEmbed) {
            setEmbedInput(mapsEmbed);
            extractAndPreview(mapsEmbed);
        }
    }, [mapsEmbed]);

    const extractAndPreview = (input: string) => {
        let src = '';
        if (input.includes('<iframe')) {
            const match = input.match(/src="([^"]+)"/);
            if (match) src = match[1];
        } else if (input.startsWith('http')) {
            src = input;
        }

        setPreviewSrc(src);

        // Ekstraksi Koordinat dari string Embed untuk anti-duplikasi
        // Contoh: !2d113.2856!3d-6.8940
        const latMatch = src.match(/!3d(-?\d+\.\d+)/);
        const lngMatch = src.match(/!2d(-?\d+\.\d+)/);

        if (latMatch && lngMatch) {
            const extractedLat = parseFloat(latMatch[1]);
            const extractedLng = parseFloat(lngMatch[1]);
            onChange(extractedLat, extractedLng, input);
        } else {
            // Jika tidak ada koordinat (misal link pendek), simpan embed saja
            onChange(lat || 0, lng || 0, input);
        }
    };

    const handleInputChange = (val: string) => {
        setEmbedInput(val);
        extractAndPreview(val);
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
                    value={embedInput}
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
