import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { auth0 } from '../../../lib/auth0'; // Make sure this is correctly set up

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // ✅ FIXED: Pass req to getSession
    const session = await auth0.getSession(req);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { fileType } = await req.json();

    // ✅ Strict file type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // ✅ Secure filename and scoped S3 key
    const fileExt = fileType.split('/')[1];
    const fileName = crypto.randomBytes(16).toString('hex') + `.${fileExt}`;
    const key = `uploads/${session.user.sub}/${fileName}`;

    // ✅ Generate signed URL for upload
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read', // Optional — remove for private uploads
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

    // ✅ Construct final image URL
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

    return NextResponse.json({ success: true, uploadURL, imageUrl });
  } catch (error: any) {
    console.error('🔥 S3 Upload Error:', error); // ✅ Full error logging
    return NextResponse.json(
      { message: 'Server error', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
