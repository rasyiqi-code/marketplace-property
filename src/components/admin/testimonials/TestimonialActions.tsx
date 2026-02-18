'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteTestimonial } from '@/lib/actions/testimonial';
import { useRouter } from 'next/navigation';

export default function TestimonialActions({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
            await deleteTestimonial(id);
            router.refresh(); // Or rely on server action revalidate
        }
    };

    return (
        <div className="flex justify-end gap-1">
            <Link href={`/admin/testimonials/${id}`}>
                <Tooltip title="Edit">
                    <IconButton size="small" color="primary">
                        <Edit size={16} />
                    </IconButton>
                </Tooltip>
            </Link>
            <Tooltip title="Hapus">
                <IconButton size="small" color="error" onClick={handleDelete}>
                    <Trash2 size={16} />
                </IconButton>
            </Tooltip>
        </div>
    );
}
