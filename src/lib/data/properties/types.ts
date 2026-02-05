export interface PropertyDTO {
    id: string;
    title: string;
    slug: string | null;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: 'sale' | 'rent';
    imageUrl: string;
    featured: boolean;
    priority?: number;
    urgency?: 'NONE' | 'HOT_DEAL' | 'DISTRESS_SALE';
    latitude?: number | null;
    longitude?: number | null;
    mapsEmbed?: string | null;
    videoUrl?: string | null;
    virtualTourUrl?: string | null;
}

export interface PropertyDetailDTO extends PropertyDTO {
    description: string;
    address: string;
    userId: string | null;
    seller: {
        name: string | null;
        email: string;
        phone: string | null;
        photo: string | null;
        whatsappMessage: string | null;
        verified: boolean;
        accountType: string;
        bio: string | null;
        company: string | null;
    };
    propertyImages: {
        id: string;
        url: string;
        caption: string | null;
        isPrimary: boolean;
    }[];
    facilities: {
        id: string;
        name: string;
        icon: string | null;
    }[];
    landArea: number | null;
    certificate: string | null;
    condition: string | null;
    furnishing: string | null;
    floors: number | null;
    mapsEmbed?: string | null;
    videoUrl?: string | null;
    virtualTourUrl?: string | null;
}

export interface DashboardStats {
    totalProperties: number;
    totalViews: number;
    totalInquiries: number;
}

export interface PropertyInput {
    title: string;
    description: string;
    price: number;
    location: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: 'sale' | 'rent';
    imageUrl: string;
    featured?: boolean;
    landArea?: number;
    certificate?: string;
    condition?: string;
    furnishing?: string;
    floors?: number;
    latitude?: number;
    longitude?: number;
    imageHash?: string;
    mapsEmbed?: string;
    videoUrl?: string;
    virtualTourUrl?: string;
    facilities?: string[]; // Array of facility IDs
}

export interface SearchFilters {
    query?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    bedrooms?: number;
}
