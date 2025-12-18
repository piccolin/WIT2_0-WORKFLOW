import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpinnerService } from '@app/app-building-blocks/spinner/services/spinner.service';

/**
 * @Filename:    file-upload.component.ts
 * @Type:        Component
 * @Date:        2025-12-18
 *
 * @Description:
 *   Local-only file picker/dropzone that emits the file (and optionally content)
 *   to the parent component. No server calls.
 *
 *   Restricts uploads to: *.csv, *.pdf, *.json, *.xml
 *   Restricts uploads by size via maxFileSizeBytes/maxFileSizeMb inputs
 */

export interface FileUploadPayloadEvent {
  file: File;
  name: string;
  extension: string;
  size: number;
  mimeType: string;
  arrayBuffer: ArrayBuffer;
  text?: string; // present for non-pdf (csv/json/xml) by default
}

export interface FileUploadErrorEvent {
  file?: File;
  message: string;
  error?: any;
}

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

  /**
   * If true, the component also decodes text for csv/json/xml.
   * For pdf, only ArrayBuffer is emitted.
   */
  @Input() public emitTextContent: boolean = true;

  // -----------------------------------------------------------------
  // Outputs
  // -----------------------------------------------------------------
  /** Fires immediately when a file is selected/dropped and passes validation. */
  @Output() public selected: EventEmitter<File> = new EventEmitter<File>();

  /** Fires as the file is read locally (0..100). */
  @Output() public progressChanged: EventEmitter<number> = new EventEmitter<number>();

  /** Fires when user clicks Upload and the file is read and ready to use. */
  @Output() public uploaded: EventEmitter<FileUploadPayloadEvent> = new EventEmitter<FileUploadPayloadEvent>();

  /** Fires on validation/read errors. */
  @Output() public failed: EventEmitter<FileUploadErrorEvent> = new EventEmitter<FileUploadErrorEvent>();

  /** Fires when selection is cleared. */
  @Output() public cleared: EventEmitter<void> = new EventEmitter<void>();

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
  constructor(private loader: SpinnerService) {}

  // -----------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------
  ngOnInit(): void {
    // no-op
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
    this.cleared.emit();
  }

  public async onUploadClick(): Promise<void> {
    if (!this.selectedFile) {
      this.uploadError = 'Please choose a file before uploading.';
      this.uploadSuccess = false;
      this.failed.emit({ message: this.uploadError });
      return;
    }

    const file = this.selectedFile;

    // Safety net (in case something bypassed UI)
    if (!this.isAllowedFile(file)) {
      this.uploadError = `Unsupported file type. Allowed: ${this.allowedExtensionsDisplay}.`;
      this.uploadSuccess = false;
      this.failed.emit({ file, message: this.uploadError });
      return;
    }

    if (!this.isAllowedSize(file)) {
      this.uploadError = `File is too large. Max size: ${this.maxFileSizeDisplay}.`;
      this.uploadSuccess = false;
      this.failed.emit({ file, message: this.uploadError });
      return;
    }

    this.loader.show();
    this.isUploading = true;
    this.uploadError = null;
    this.uploadSuccess = false;
    this.uploadProgress = 0;
    this.progressChanged.emit(0);

    try {
      const { arrayBuffer, text } = await this.readFile(file, (p) => {
        this.uploadProgress = p;
        this.progressChanged.emit(p);
      });

      this.uploadProgress = 100;
      this.progressChanged.emit(100);
      this.uploadSuccess = true;

      this.uploaded.emit({
        file,
        name: file.name,
        extension: this.getExtension(file.name),
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        arrayBuffer,
        text,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Local file read failed', e);
      this.uploadError = 'File read failed. Please try again.';
      this.uploadSuccess = false;
      this.uploadProgress = null;
      this.failed.emit({ file, message: this.uploadError, error: e });
    } finally {
      this.isUploading = false;
      this.loader.hide();
    }
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
      this.failed.emit({ file, message: this.uploadError });
      return;
    }

    if (!this.isAllowedSize(file)) {
      this.selectedFile = null;
      this.resetStatus();
      this.uploadError = `File is too large. Max size: ${this.maxFileSizeDisplay}.`;
      this.failed.emit({ file, message: this.uploadError });
      return;
    }

    this.selectedFile = file;
    this.resetStatus();
    this.selected.emit(file);
  }

  private isAllowedFile(file: File): boolean {
    const ext = this.getExtension(file?.name || '');
    if (!ext) return false;
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

  private getExtension(filename: string): string {
    const name = (filename || '').trim().toLowerCase();
    const dot = name.lastIndexOf('.');
    if (dot < 0) return '';
    return name.substring(dot + 1);
  }

  private async readFile(file: File, onProgress: (p: number) => void): Promise<{ arrayBuffer: ArrayBuffer; text?: string }> {
    const arrayBuffer = await this.readAsArrayBuffer(file, onProgress);

    const ext = this.getExtension(file.name);
    const isPdf = ext === 'pdf';

    if (!this.emitTextContent || isPdf) {
      return { arrayBuffer };
    }

    const text = new TextDecoder('utf-8').decode(arrayBuffer);
    return { arrayBuffer, text };
  }

  private readAsArrayBuffer(file: File, onProgress: (p: number) => void): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(reader.error);
      reader.onabort = () => reject(new Error('File read aborted'));

      reader.onprogress = (evt: ProgressEvent<FileReader>) => {
        if (!evt.lengthComputable) return;
        const p = Math.round((100 * evt.loaded) / evt.total);
        onProgress(p);
      };

      reader.onload = () => {
        const result = reader.result;
        if (result instanceof ArrayBuffer) resolve(result);
        else reject(new Error('Unexpected FileReader result type'));
      };

      reader.readAsArrayBuffer(file);
    });
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
