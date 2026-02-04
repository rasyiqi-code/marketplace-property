import { NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
    { label: 'Dijual', href: '/search?status=sale' },
    { label: 'Disewa', href: '/search?status=rent' },
    { label: 'Properti Baru', href: '/search?sort=newest' },
    { label: 'KPR', href: '/kpr' },
];
