import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
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

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID query parameter is required" },
        { status: 400 }
      );
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: `${id}/`,
    });

    let isTruncated = true;

    let contents: {
      name: string;
      lastModified: Date;
      size: number;
    }[] = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3.send(command);

      if (Contents) {
        contents = contents.concat(
          Contents.map((content) => ({
            name: content.Key!,
            lastModified: content.LastModified!,
            size: content.Size!,
          }))
        );
      }

      isTruncated = IsTruncated!;

      if (isTruncated) {
        command.input.ContinuationToken = NextContinuationToken!;
      }
    }

    return NextResponse.json({ contents });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
