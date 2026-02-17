
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function PropertyIdPage({ params }: { params: { id: string } }) {
    const property = await prisma.property.findUnique({
        where: { id: params.id },
        select: { status: true, slug: true }
    });

    if (!property) {
        notFound();
    }

    // Redirect to the correct canonical URL
    // status is likely 'sale' or 'rent' (lowercase), but let's be safe
    const isSale = property.status.toLowerCase() === 'sale';
    const base = isSale ? 'jual' : 'sewa';
    // Use slug if available, otherwise use ID (if [slug] page supports it) - assuming for now it does or we just redirect
    // If [slug] page requires slug, and slug is null, we might be stuck unless [slug] page logic handles ID.
    // Let's assume we can redirect to /jual/ID if slug is null.
    const identifier = property.slug || params.id;

    redirect(`/${base}/${identifier}`);
}
