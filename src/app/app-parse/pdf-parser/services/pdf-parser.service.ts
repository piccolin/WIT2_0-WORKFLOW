/**
 * @Filename:    pdf-parser.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Client-side PDF parsing service using pdfjs-dist.
 *   Input is a user-uploaded PDF (File).
 *
 *   What this does:
 *   - Reads the PDF in the browser
 *   - Extracts text fragments + their coordinates per page
 *   - Returns a PdfTextBehaviorialModel that supports searching + relative extraction + tables.
 *
 *   Coder’s note (IMPORTANT):
 *   pdf.js requires a worker file to parse without freezing the UI.
 *   Easiest Angular setup:
 *     1) Copy: node_modules/pdfjs-dist/build/pdf.worker.mjs
 *        -> src/assets/pdf.worker.mjs
 *     2) Ensure angular.json assets include src/assets
 *     3) workerSrc below points to /assets/pdf.worker.mjs
 */

import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy, TextItem } from 'pdfjs-dist/types/src/display/api';

import { PdfParseError } from '@app/app-parse/pdf-parser/errors/pdf-parse-error';
import { PdfTextItemModel } from '@app/app-parse/pdf-parser/models/pdf-text-item.model';
import { PdfPageText } from '@app/app-parse/pdf-parser/models/pdf-page-text.model';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';

@Injectable({ providedIn: 'root' })
export class PdfParserService {
  private workerInitialized = false;

  /**
   * Parse an uploaded PDF file into searchable text + coordinates.
   */
  public async parse(file: File): Promise<PdfTextBehaviorialModel> {
    if (!file) {
      throw new PdfParseError('NO_FILE', 'No PDF file was provided.');
    }

    await this.ensureWorkerConfigured();

    const data = new Uint8Array(await file.arrayBuffer());

    let doc: PDFDocumentProxy;
    try {
      const task = pdfjsLib.getDocument({ data });
      doc = await task.promise;
    } catch (e) {
      throw new PdfParseError('LOAD_FAILED', 'Could not open PDF. The file may be corrupt or password-protected.', e);
    }

    const pages: PdfPageText[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      try {
        const page = await doc.getPage(pageNumber);
        pages.push(await this.extractPage(page, pageNumber));
      } catch (e) {
        throw new PdfParseError('PAGE_READ_FAILED', `Could not read page ${pageNumber}.`, e);
      }
    }

    // Optional cleanup; helps memory on big PDFs.
    try { await doc.cleanup(); } catch { /* ignore */ }

    return new PdfTextBehaviorialModel(pages);
  }

  // -----------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------

  private async extractPage(page: PDFPageProxy, pageNumber: number): Promise<PdfPageText> {
    const viewport = page.getViewport({ scale: 1 });

    let textContent: Awaited<ReturnType<PDFPageProxy['getTextContent']>>;
    try {
      textContent = await page.getTextContent();
    } catch (e) {
      throw new PdfParseError('TEXT_EXTRACT_FAILED', `Could not extract text from page ${pageNumber}.`, e);
    }

    const items: PdfTextItemModel[] = [];

    for (const anyItem of textContent.items) {
      if (!('str' in anyItem)) continue;

      const ti = anyItem as TextItem;
      const text = (ti.str ?? '').trim();
      if (!text) continue;

      // Convert PDF transform into viewport (screen-like) coordinates.
      const tx = pdfjsLib.Util.transform(viewport.transform, ti.transform);
      const x = tx[4];
      const y = tx[5];

      const width = Math.abs((ti.width ?? 0) * viewport.scale);
      const height = Math.max(1, Math.abs((ti.height ?? 0) * viewport.scale));

      items.push({ pageNumber, text, x, y, width, height });
    }

    return new PdfPageText(pageNumber, items, viewport.width, viewport.height);
  }

  private async ensureWorkerConfigured(): Promise<void> {
    if (this.workerInitialized) return;

    //worker dedicated to process for performance & smooth UI
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.mjs';

    this.workerInitialized = true;
  }
}
