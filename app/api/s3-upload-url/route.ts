import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const { fileType } = await req.json();

  const fileExt = fileType.split('/')[1]; // 'jpeg' or 'png'
  const fileName = crypto.randomBytes(16).toString('hex') + `.${fileExt}`;
  const key = `uploads/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read', // allow public access
  });

  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

  return NextResponse.json({ uploadURL, imageUrl });
}
