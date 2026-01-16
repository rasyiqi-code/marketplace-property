import { PropertyProps } from '@/components/PropertyCard';

export const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
];

export const FEATURED_PROPERTIES: PropertyProps[] = [
    {
        id: '1',
        title: 'Modern Minimalist Home at BSD City',
        price: 'Rp 2.500.000.000',
        location: 'BSD City, Tangerang Selatan',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        type: 'House',
        status: 'sale',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Luxury Apartment in Jaksel',
        price: 'Rp 150.000.000 / thn',
        location: 'Kuningan, Jakarta Selatan',
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        type: 'Apartment',
        status: 'rent',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Classic Villa in Bandung',
        price: 'Rp 4.800.000.000',
        location: 'Dago, Bandung',
        bedrooms: 5,
        bathrooms: 4,
        area: 350,
        type: 'Villa',
        status: 'sale',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'
    }
];
