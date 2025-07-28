import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { auth0 } from '../../../lib/auth0';

const REQUIRED_ENV_VARS = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET_NAME'];

REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing env var: ${key}`);
  }
});

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log('🔐 Getting session...');
    const session = await auth0.getSession(req);

    if (!session || !session.user) {
      console.warn('🚫 Unauthorized: No session or user found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const fileType = body.fileType;

    if (!fileType) {
      console.warn('📄 Missing fileType in request body');
      return NextResponse.json({ message: 'Missing fileType' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      console.warn(`❌ Invalid fileType: ${fileType}`);
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    const fileExt = fileType.split('/')[1];
    const fileName = crypto.randomBytes(16).toString('hex') + `.${fileExt}`;
    const key = `uploads/${session.user.sub}/${fileName}`;

    console.log(`📝 Generating signed URL for key: ${key}`);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read',
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

    console.log(`✅ Signed URL generated: ${uploadURL}`);
    console.log(`🌐 Public image URL: ${imageUrl}`);

    return NextResponse.json({ success: true, uploadURL, imageUrl });
  } catch (error: any) {
    console.error('🔥 S3 Upload Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        message: 'Server error occurred while generating S3 signed URL',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
