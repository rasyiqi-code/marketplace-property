import { PostAdWizard } from '@/components/post-ad/PostAdWizard';
import { getPropertyForEdit } from '@/lib/data/properties';
import { notFound, redirect } from 'next/navigation';
import { stackServerApp } from '@/lib/stack';

interface EditPropertyPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
    const { id } = await params;
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect('/');
    }

    const initialData = await getPropertyForEdit(id);

    if (!initialData) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-heading text-gray-900 mb-2">Edit Properti</h1>
                <p className="text-gray-600">
                    Perbarui informasi properti Anda.
                </p>
            </div>

            <PostAdWizard
                initialData={initialData}
                isEditMode={true}
                propertyId={id}
            />
        </div>
    );
}
