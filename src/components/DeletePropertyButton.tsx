'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeletePropertyButtonProps {
    propertyId: string;
}

export function DeletePropertyButton({ propertyId }: DeletePropertyButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus properti ini?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/properties/${propertyId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Gagal menghapus properti');
            }

            router.refresh();
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Gagal menghapus properti');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full flex justify-center disabled:opacity-50"
            title="Hapus Properti"
        >
            <Trash2 size={18} />
        </button>
    );
}
