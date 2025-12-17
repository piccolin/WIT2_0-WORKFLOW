import { CommonModule } from '@angular/common';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '@app/app-building-blocks/spinner/services/spinner.service';

/**
 * @Filename:    FileUploadComponent
 * @Type:        Component
 * @Date:        2025-12-08
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   File upload component with two UX modes:
 *    1) simple: classic "Choose file" + Upload
 *    2) dragDrop: professional dropzone (drag & drop or click to browse) + Upload
 *
 *   Restricts uploads to: *.csv, *.pdf, *.json, *.xml
 *   Restricts uploads by size via maxFileSizeBytes/maxFileSizeMb inputs
 *
 * @Notes:
 *   - Browser "accept" filters the picker; validation also enforces allowed types/sizes on drop.
 */

@Component({
  selector: 'wc-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {

  // -----------------------------------------------------------------
  // Inputs (setters listen for change like ngChanges)
  // -----------------------------------------------------------------
  @Input() set uploadUi(value: 'simple' | 'dragDrop') {
    this._uploadUi = value === 'simple' ? 'simple' : 'dragDrop';
  }
  public get uploadUi(): 'simple' | 'dragDrop' {
    return this._uploadUi;
  }
  private _uploadUi: 'simple' | 'dragDrop' = 'dragDrop';

  // File extensions: default csv/pdf/json/xml (caller may override)
  @Input() set allowedExtensions(value: string[] | null | undefined) {
    this._allowedExtensions = Array.isArray(value) && value.length > 0 ? value : ['csv', 'pdf', 'json', 'xml'];
    this.acceptAttr = this._allowedExtensions.map((e) => `.${e.toLowerCase()}`).join(',');
  }
  public get allowedExtensions(): string[] {
    return this._allowedExtensions;
  }
  private _allowedExtensions: string[] = ['csv', 'pdf', 'json', 'xml'];

  // Max file size (bytes) - default 25 MB
  @Input() set maxFileSizeBytes(value: number | null | undefined) {
    const normalized = typeof value === 'number' && value > 0 ? Math.floor(value) : (25 * 1024 * 1024);
    this._maxFileSizeBytes = normalized;
  }
  public get maxFileSizeBytes(): number {
    return this._maxFileSizeBytes;
  }
  private _maxFileSizeBytes: number = 25 * 1024 * 1024;

  // Convenience: allow setting max file size in MB (overrides maxFileSizeBytes)
  @Input() set maxFileSizeMb(value: number | null | undefined) {
    if (typeof value === 'number' && value > 0) {
      this._maxFileSizeBytes = Math.floor(value * 1024 * 1024);
    }
  }

  // -----------------------------------------------------------------
  // Runtime State
  // -----------------------------------------------------------------
  public selectedFile: File | null = null;
  public uploadProgress: number | null = null;
  public uploadError: string | null = null;
  public uploadSuccess: boolean = false;

  public isDragOver: boolean = false;
  public isUploading: boolean = false;

  // Bound to <input type="file" [accept]="acceptAttr">
  public acceptAttr: string = '.csv,.pdf,.json,.xml';

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(private http: HttpClient, private loader: SpinnerService) {}

  // -----------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------
  ngOnInit(): void {
    // no-op for now
  }

  // -----------------------------------------------------------------
  // UI Handlers
  // -----------------------------------------------------------------
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.trySetSelectedFile(input.files[0]);
      input.value = ''; // allows re-selecting the same file
    }
  }

  public onBrowseClick(fileInput: HTMLInputElement): void {
    if (this.isUploading) return;
    fileInput.click();
  }

  public onDropzoneKeydown(event: KeyboardEvent, fileInput: HTMLInputElement): void {
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.onBrowseClick(fileInput);
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isUploading) return;
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  public onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (this.isUploading) return;

    const files = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : null;
    if (!files || files.length === 0) return;

    this.trySetSelectedFile(files[0]);
  }

  public onClearSelection(): void {
    if (this.isUploading) return;
    this.selectedFile = null;
    this.resetStatus();
  }

  public onUploadClick(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please choose a file before uploading.';
      this.uploadSuccess = false;
      return;
    }

    // Safety net (in case something bypassed UI)
    if (!this.isAllowedFile(this.selectedFile)) {
      this.uploadError = `Unsupported file type. Allowed: ${this.allowedExtensionsDisplay}.`;
      this.uploadSuccess = false;
      return;
    }

    if (!this.isAllowedSize(this.selectedFile)) {
      this.uploadError = `File is too large. Max size: ${this.maxFileSizeDisplay}.`;
      this.uploadSuccess = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const uploadUrl = '/api/upload';

    this.loader.show();
    this.isUploading = true;
    this.uploadError = null;
    this.uploadSuccess = false;
    this.uploadProgress = 0;

    this.http
      .post(uploadUrl, formData, { reportProgress: true, observe: 'events' })
      .pipe(
        finalize(() => {
          this.isUploading = false;
          this.loader.hide();
        })
      )
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadSuccess = true;
            this.uploadProgress = 100;
          }
        },
        error: (err) => {
          // eslint-disable-next-line no-console
          console.error('File upload failed', err);
          this.uploadError = 'File upload failed. Please try again.';
          this.uploadSuccess = false;
          this.uploadProgress = null;
        }
      });
  }

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
  public get allowedExtensionsDisplay(): string {
    return this.allowedExtensions.map((e) => `*.${e.toLowerCase()}`).join(', ');
  }

  public get maxFileSizeDisplay(): string {
    return this.formatBytes(this.maxFileSizeBytes);
  }

  public get selectedFileMeta(): string {
    if (!this.selectedFile) return '';
    const size = this.formatBytes(this.selectedFile.size);
    const type = this.selectedFile.type ? this.selectedFile.type : 'Unknown type';
    return `${type} • ${size}`;
  }

  private trySetSelectedFile(file: File): void {
    if (!this.isAllowedFile(file)) {
      this.selectedFile = null;
      this.resetStatus();
      this.uploadError = `Unsupported file type. Allowed: ${this.allowedExtensionsDisplay}.`;
      return;
    }

    if (!this.isAllowedSize(file)) {
      this.selectedFile = null;
      this.resetStatus();
      this.uploadError = `File is too large. Max size: ${this.maxFileSizeDisplay}.`;
      return;
    }

    this.selectedFile = file;
    this.resetStatus();
  }

  private isAllowedFile(file: File): boolean {
    const name = (file?.name || '').trim().toLowerCase();
    const dot = name.lastIndexOf('.');
    if (dot < 0) return false;
    const ext = name.substring(dot + 1);
    return this.allowedExtensions.map((e) => e.toLowerCase()).includes(ext);
  }

  private isAllowedSize(file: File): boolean {
    const size = file?.size || 0;
    return size > 0 && size <= this.maxFileSizeBytes;
  }

  private resetStatus(): void {
    this.uploadError = null;
    this.uploadSuccess = false;
    this.uploadProgress = null;
  }

  private formatBytes(bytes: number): string {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded} ${sizes[i]}`;
  }
}
