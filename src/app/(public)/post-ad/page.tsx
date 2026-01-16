import { PostAdWizard } from '@/components/post-ad/PostAdWizard';

export default function PostAdPage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            <main className="container py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Pasang Iklan Properti</h1>
                        <p className="text-gray-600">
                            Isi detail properti Anda dalam 4 langkah mudah.
                        </p>
                    </div>

                    <PostAdWizard />
                </div>
            </main>
        </div>
    );
}
