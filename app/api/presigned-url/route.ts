import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const file = searchParams.get("file");
    const id = searchParams.get("id");

    if (!file) {
      return NextResponse.json(
        { error: "File query parameter is required" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID query parameter is required" },
        { status: 400 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${id}/${file}`,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
