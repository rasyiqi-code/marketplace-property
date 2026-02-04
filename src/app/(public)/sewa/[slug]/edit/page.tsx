import { PostAdWizard } from '@/components/post-ad/PostAdWizard';
import { getPropertyBySlug, getPropertyForEdit } from '@/lib/data/properties';
import { notFound, redirect } from 'next/navigation';
import { stackServerApp } from '@/lib/stack';

interface EditPropertyPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function EditSewaPropertyPage({ params }: EditPropertyPageProps) {
    const { slug } = await params;
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect('/handler/sign-in');
    }

    // Try finding by slug/ID for rent status
    const property = await getPropertyBySlug(slug, 'rent');

    if (!property) {
        notFound();
    }

    // Check ownership
    if (property.userId !== user.id) {
        redirect('/my-properties');
    }

    const initialData = await getPropertyForEdit(property.id);

    if (!initialData) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">Edit Iklan Sewa</h1>
                <p className="text-gray-600">
                    Perbarui informasi properti Anda untuk menarik lebih banyak penyewa.
                </p>
            </div>

            <PostAdWizard
                initialData={initialData}
                isEditMode={true}
                propertyId={property.id}
            />
        </div>
    );
}
