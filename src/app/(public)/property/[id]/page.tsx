import { getPropertyById } from '@/lib/data/properties';
import { notFound, redirect } from 'next/navigation';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    // Redirect to the new SEO-friendly URL
    const statusPath = property.status === 'sale' ? 'jual' : 'sewa';
    const slug = property.slug || id; // Fallback to ID if slug is missing for some reason

    redirect(`/${statusPath}/${slug}`);
}
