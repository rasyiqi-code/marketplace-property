export interface NavbarUser {
    id: string;
    displayName?: string | null;
    primaryEmail?: string | null;
    profileImageUrl?: string | null;
}

export interface NavLink {
    label: string;
    href: string;
}
