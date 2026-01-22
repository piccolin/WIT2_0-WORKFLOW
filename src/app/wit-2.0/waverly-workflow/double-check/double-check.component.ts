import {Component} from '@angular/core';
import {FileUploadComponent, FileUploadPayloadEvent} from "@app/app-building-blocks/forms/file-upload/file-upload.component";
import {TransformerSelectorService} from "@app/app-transformer/services/transformers/transformer-selector.service";
import {FileType, OrderType, TransformationRequest, Vendors} from "@app/app-transformer/models/transform.models";

import { S3UploadService } from '@app/app-building-blocks/forms/file-upload/s3-upload.service';
//import type { FileUploadPayloadEvent } from '@app/app-building-blocks/forms/file-upload/file-upload.component';


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

  constructor(private transformerSelectorService: TransformerSelectorService, private s3UploadService: S3UploadService) {
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
