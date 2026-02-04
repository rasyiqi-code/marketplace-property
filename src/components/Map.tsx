'use client';

interface MapProps {
    mapsEmbed?: string;
    address?: string;
}

export default function Map({ mapsEmbed, address }: MapProps) {
    if (!mapsEmbed) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
                Peta tidak tersedia
            </div>
        );
    }

    let embedSrc = mapsEmbed;
    if (mapsEmbed.includes('<iframe')) {
        const match = mapsEmbed.match(/src="([^"]+)"/);
        if (match) embedSrc = match[1];
    }

    return (
        <div className="w-full h-full relative z-0">
            <iframe
                src={embedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={address || "Property Location"}
            ></iframe>
        </div>
    );
}
