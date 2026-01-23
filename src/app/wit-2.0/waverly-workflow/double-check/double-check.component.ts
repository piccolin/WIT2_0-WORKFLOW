import {Component} from '@angular/core';
import {FileUploadComponent, FileUploadPayloadEvent} from "@app/app-building-blocks/forms/file-upload/file-upload.component";
import {TransformerSelectorService} from "@app/app-transformer/services/transformers/transformer-selector.service";
import {FileType, OrderType, TransformationRequest, Vendors} from "@app/app-transformer/models/transform.models";

import { S3UploadService } from '@app/app-building-blocks/forms/file-upload/s3-upload.service';
//import type { FileUploadPayloadEvent } from '@app/app-building-blocks/forms/file-upload/file-upload.component';

import { UploadRecordService } from '@app/app-building-blocks/forms/file-upload/upload-record.service';



@Component({
  selector: 'app-double-check',
  standalone: true,
  imports: [
    FileUploadComponent
  ],
  templateUrl: './double-check.component.html',
  styleUrl: './double-check.component.scss'
})
export class DoubleCheckComponent {

  constructor(private transformerSelectorService: TransformerSelectorService,
              private s3UploadService: S3UploadService,
              private uploadRecordService: UploadRecordService) {
  }

  // -----------------------------------------------------------------
  // UI Config
  // -----------------------------------------------------------------
  public allowedExtensions: string[] = ['csv', 'pdf', 'json', 'xml', 'html', 'htm'];
  public maxSizeMb: number = 5;

  // -----------------------------------------------------------------
  // Listeners
  // -----------------------------------------------------------------
  public lastUploadedS3Ref: any= null;
  async onUploadCompleted(fileUploadPayloadEvent:FileUploadPayloadEvent){

    // 1) Upload original file to S3 (NEW)
    const s3Ref = await this.s3UploadService.uploadFile(fileUploadPayloadEvent.file);
    this.lastUploadedS3Ref = s3Ref;
    console.log('✅ Uploaded to S3:', s3Ref);

    // 2) Save metadata to DynamoDB
    const record = await this.uploadRecordService.createRecord({
      bucket: s3Ref.bucket,
      key: s3Ref.key,
      originalFileName: s3Ref.originalFileName,
      fileType: (s3Ref.key.split('/')[1] || 'other'), // because your key is uploads/<type>/...
      contentType: s3Ref.contentType,
      sizeBytes: s3Ref.sizeBytes,
      status: 'UPLOADED',

      // optional (set if you want)
      //vendor: 'WooCommerce',
      //orderType: 'Confirmation'
    });

    console.log('✅ Saved upload record (DynamoDB):', record);

    // 3) Continue your existing transform as-is
    let transformationRequest: TransformationRequest = {
      fileType:   FileType.Pdf,
      vendor:     Vendors.Cubitac,
      orderType:  OrderType.Confirmation,
      file:       fileUploadPayloadEvent.file,
      rawText:    undefined
    }
    await this.transform(transformationRequest)
  }

  // -----------------------------------------------------------------
  // Business Logic
  // -----------------------------------------------------------------
  async transform(transformationRequest: TransformationRequest){
    await this.transformerSelectorService.transform(transformationRequest)
  }

}
