
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { s3Client, s3Bucket } from "../../config/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface UploadObjectInput {
  key: string;
  body: Buffer;
  contentType: string;
}

export async function uploadObject(
  input: UploadObjectInput
): Promise<void> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      IfNoneMatch: "*",
    })
  );
}

export async function deleteObject(
  key: string
): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: s3Bucket,
      Key: key,
    })
  );
}


export async function generateDownloadUrl(
  storageKey: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: s3Bucket,
    Key: storageKey,
    ResponseContentDisposition: "attachment",
  });

  const signedUrl = await getSignedUrl(
    s3Client,
    command,
    {
      expiresIn: 60,
    }
  );

  return signedUrl;
}
