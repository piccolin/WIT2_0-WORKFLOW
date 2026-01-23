import { Inject, Injectable } from '@angular/core';
import {SAVE_UPLOAD_RECORD_URL} from "@app/app.config.token";


export type UploadStatus = 'UPLOADED' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface CreateUploadRecordRequest {
  bucket: string;
  key: string;
  originalFileName: string;
  fileType: string;      // pdf | json | xml | html | csv | other
  contentType: string;
  sizeBytes: number;

  // optional (nice for future filtering)
  vendor?: string;
  orderType?: string;
  status?: UploadStatus;
}

export interface UploadRecordResponse {
  fileId: string;
  bucket: string;
  key: string;
  originalFileName: string;
  fileType: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
  status: UploadStatus;
}

@Injectable({ providedIn: 'root' })
export class UploadRecordService {
  constructor(@Inject(SAVE_UPLOAD_RECORD_URL) private saveUrl: string) {}

  public async createRecord(req: CreateUploadRecordRequest): Promise<UploadRecordResponse> {
    const res = await fetch(this.saveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Save upload record failed (${res.status}): ${text}`);
    }

    return (await res.json()) as UploadRecordResponse;
  }
}
