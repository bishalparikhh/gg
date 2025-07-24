import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { auth0 } from '../../../lib/auth0'; // ✅ Ensure only logged-in users can upload

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Check Auth0 session
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { fileType } = await req.json();

    // ✅ 2. Strictly validate allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // ✅ 3. Generate secure unique filename
    const fileExt = fileType.split('/')[1]; // e.g. 'jpeg'
    const fileName = crypto.randomBytes(16).toString('hex') + `.${fileExt}`;
    const key = `uploads/${session.user.sub}/${fileName}`; // ✅ user-scoped path

    // ✅ 4. Pre-signed S3 URL with limited permissions
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read', // ⚠️ optional; remove if you want private files
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

    return NextResponse.json({ success: true, uploadURL, imageUrl });
  } catch (error: any) {
    console.error('🔥 S3 Upload Error:', error.message);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}