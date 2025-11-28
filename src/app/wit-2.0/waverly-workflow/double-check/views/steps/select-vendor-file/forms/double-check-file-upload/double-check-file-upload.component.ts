// /**
//  * ========================================================================
//  * DoubleCheckFileUploadComponent – Vendor confirmation file upload
//  * ========================================================================
//  *
//  * Single component that handles:
//  * • File selection (PDF/HTML)
//  * • Client-side extraction
//  * • Submit button with loading state
//  * • Reparse / Download (local or admin only)
//  * • Error display + local JSON preview
//  *
//  * Submits via UploadService using FileUploadRequest model.
//  *
//  * Tech: Angular 11+, fully compatible with Angular 20
//  * ========================================================================
//  */
//
// import {
//   Component,
//   Input,
//   ViewChild,
//   ElementRef,
// } from '@angular/core';
// import { DoubleCheckClientApi } from '#app/routes/orders/double-check/use-double-check';
// import { UploadService } from '#app/services/upload.service';
// import { FileUploadRequest } from '#app/models/file-upload-request.model';
// import { environment from '#environments/environment';
//
// @Component({
//   selector: 'wc-app-double-check-file-upload',
//   templateUrl: './double-check-file-upload.component.html',
//   styleUrls: ['./double-check-file-upload.component.scss'],
// })
// export class DoubleCheckFileUploadComponent {
//   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
//
//   @Input() api!: DoubleCheckClientApi;
//
//   // -----------------------------------------------------------------
//   // Derived state from api
//   // -----------------------------------------------------------------
//   get id() { return this.api.id; }
//   get fileName() { return this.api.vendorFileName; }
//   get extractResult() { return this.api.extractor.extractResult; }
//   get error() { return this.api.extractor.error; }
//   get vendorFile() { return this.api.extractor.vendorFile; }
//
//   get isPending() { return this.api.extractor.isParsing; }
//   get allowSubmit() { return !!this.extractResult && !!this.fileName; }
//
//   get isLocal() { return environment.local === true; }
//   get isAdmin() { return (window as any).IS_ADMIN === true; } // replace with real auth
//   get isReviewMode() { return this.api.isReviewMode; }
//
//   constructor(private uploadService: UploadService) {}
//
//   // -----------------------------------------------------------------
//   // UI Handlers
//   // -----------------------------------------------------------------
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files?.length) {
//       this.api.extractor.parse(input.files[0]);
//     }
//   }
//
//   onSubmit(): void {
//     if (!this.allowSubmit || !this.vendorFile) return;
//
//     const request: FileUploadRequest = {
//       id: this.id,
//       intent: 'set_vendor_file',
//       file: this.vendorFile,
//       vendorFileName: this.fileName!,
//       extractResult: this.extractResult!,
//     };
//
//     this.uploadService.uploadVendorFile(request).subscribe({
//       next: () => this.api.setStep(null),
//       error: (err) => console.error('Upload failed', err),
//     });
//   }
//
//   reparse() { this.api.extractor.reparse(); }
//   download() { this.api.extractor.download(); }
// }
