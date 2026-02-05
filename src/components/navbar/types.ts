export interface NavbarUser {
    id: string;
    displayName?: string | null;
    primaryEmail?: string | null;
    profileImageUrl?: string | null;
}

export interface UserStatus {
    listingLimit: number;
    propertyCount: number;
    accountType: 'INDIVIDUAL' | 'AGENT' | 'AGENCY';
    isPremium: boolean;
}

export interface NavLink {
    label: string;
    href: string;
}
