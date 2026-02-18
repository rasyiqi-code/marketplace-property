import { prisma } from '@/lib/db';
import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const orderId = formData.get('orderId') as string;

        if (!file || !orderId) {
            return NextResponse.json({ error: "File dan Order ID wajib ada" }, { status: 400 });
        }

        // 1. Verify Order Ownership
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order || order.userId !== user.id) {
            return NextResponse.json({ error: "Order tidak ditemukan atau bukan milik Anda" }, { status: 404 });
        }

        // 2. Save File (In real app, use cloud storage like S3/Cloudinary)
        // For development/mock, we save to public/uploads/proofs
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public/uploads/proofs');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
        }

        const filename = `${orderId}-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/proofs/${filename}`;

        // 3. Update Order with Proof URL
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentProof: fileUrl,
                status: 'PENDING' // Ensure status is pending for admin check
            }
        });

        return NextResponse.json({ success: true, url: fileUrl });

    } catch (error) {
        console.error('Manual proof upload error:', error);
        return NextResponse.json({ error: "Gagal mengunggah bukti" }, { status: 500 });
    }
}
