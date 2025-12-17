import { Component } from '@angular/core';
import {FileUploadComponent} from "@app/app-building-blocks/forms/file-upload/file-upload.component";

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

  // -----------------------------------------------------------------
  // UI Config
  // -----------------------------------------------------------------
  public allowedExtensions: string[] = ['csv', 'pdf', 'json', 'xml'];

  // Option 1: MB helper (recommended for readability)
  public maxSizeMb: number = 25;

  // Option 2: Bytes (if you prefer precision)
  // public maxSizeBytes: number = 25 * 1024 * 1024;

}
