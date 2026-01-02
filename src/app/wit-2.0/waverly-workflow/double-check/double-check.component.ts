import {Component} from '@angular/core';
import {FileUploadComponent, FileUploadPayloadEvent} from "@app/app-building-blocks/forms/file-upload/file-upload.component";
import {TransformerSelectorService} from "@app/app-transformer/services/transformers/transformer-selector.service";
import {FileType, OrderType, TransformationRequest, Vendors} from "@app/app-transformer/models/transform.models";

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

  constructor(private transformerSelectorService: TransformerSelectorService) {
  }

  // -----------------------------------------------------------------
  // UI Config
  // -----------------------------------------------------------------
  public allowedExtensions: string[] = ['csv', 'pdf', 'json', 'xml'];
  public maxSizeMb: number = 5;

  // -----------------------------------------------------------------
  // Listeners
  // -----------------------------------------------------------------
  async onUploadCompleted(fileUploadPayloadEvent:FileUploadPayloadEvent){
    let transformationRequest: TransformationRequest = {
      fileType:   FileType.Html,
      vendor:     Vendors.UsCabinet,
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
