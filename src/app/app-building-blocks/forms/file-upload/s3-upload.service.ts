import { Inject, Injectable } from '@angular/core';
import {PRESIGN_FUNCTION_URL} from "@app/app.config.token";


export interface PresignResponse {
  uploadUrl: string;
  bucket: string;
  key: string;
  expiresInSeconds: number;
}

export interface S3UploadedFileRef {
  bucket: string;
  key: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
}

@Injectable({ providedIn: 'root' })
export class S3UploadService {

  constructor(
    @Inject(PRESIGN_FUNCTION_URL) private presignUrl: string
  ) {}

  // -------------------------------------------------------------
  // Request a presigned PUT URL from Lambda
  // -------------------------------------------------------------
  private async presign(file: File): Promise<PresignResponse> {
    const contentType = file.type || 'application/octet-stream';

    const res = await fetch(this.presignUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Presign failed (${res.status}): ${text}`);
    }

    return (await res.json()) as PresignResponse;
  }

  // -------------------------------------------------------------
  // Upload file bytes directly to S3
  // -------------------------------------------------------------
  private async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    const contentType = file.type || 'application/octet-stream';

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`S3 upload failed (${res.status}): ${text}`);
    }
  }

  // -------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------
  public async uploadFile(file: File): Promise<S3UploadedFileRef> {
    const presign = await this.presign(file);
    await this.uploadToS3(presign.uploadUrl, file);

    return {
      bucket: presign.bucket,
      key: presign.key,
      originalFileName: file.name,
      contentType: file.type || 'application/octet-stream',
      sizeBytes: file.size
    };
  }
}
