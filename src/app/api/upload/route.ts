import { stackServerApp } from '@/lib/stack';
import { uploadToR2 } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Simple Image Hashing (MD5) to detect exact duplicates
        // In the future, this can be improved with perceptual hashing (aHash/dHash)
        const crypto = await import('crypto');
        const fileHash = crypto.createHash('md5').update(buffer).digest('hex');

        // Create a unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `uploads/${user.id}/${timestamp}.${extension}`;

        const url = await uploadToR2(buffer, fileName, file.type);

        return NextResponse.json({ url, hash: fileHash });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        }, { status: 500 });
    }
}
