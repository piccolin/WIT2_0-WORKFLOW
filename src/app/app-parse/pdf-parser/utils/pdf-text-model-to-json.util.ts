/**
 * @Filename:    pdf-text-model-json.service.ts
 * @Type:        Service
 * @Date:        2025-12-18
 *
 * @Description:
 *   Converts PdfTextBehaviorialModel (and nested PdfPageText/orderItems) into a plain
 *   JSON-safe object (no class instances / prototypes).
 *
 *   Output shape matches your DevTools dump:
 *     { pages: [ { pageNumber, pageWidth, pageHeight, orderItems: [...] }, ... ] }
 */

import { Injectable } from '@angular/core';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfPageText } from '@app/app-parse/pdf-parser/models/pdf-page-text.model';

export interface PdfTextModelJson {
  pages: PdfTextPageJson[];
}

export interface PdfTextPageJson {
  pageNumber: number;
  pageWidth?: number;
  pageHeight?: number;
  items: PdfTextItemJson[];
}

export interface PdfTextItemJson {
  pageNumber: number;
  text: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

@Injectable({ providedIn: 'root' })
export class PdfTextModelJsonUtilService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /** PdfTextBehaviorialModel -> plain JSON object */
  public toJson(model: PdfTextBehaviorialModel): PdfTextModelJson {
    return {
      pages: (model?.pages ?? []).map((p) => this.pageToJson(p)),
    };
  }

  /** Convenience stringify (pretty by default). */
  public toJsonString(model: PdfTextBehaviorialModel, pretty = true): string {
    return JSON.stringify(this.toJson(model), null, pretty ? 2 : 0);
  }

  /** If you already have pages: PdfPageText[] (without wrapper model). */
  public pagesToJson(pages: PdfPageText[]): PdfTextModelJson {
    return { pages: (pages ?? []).map((p) => this.pageToJson(p)) };
  }

  // -----------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------

  private pageToJson(p: any): PdfTextPageJson {
    return {
      pageNumber: this.toNum(p?.pageNumber) ?? 0,
      pageWidth: this.toNum(p?.pageWidth),
      pageHeight: this.toNum(p?.pageHeight),
      items: (Array.isArray(p?.items) ? p.items : []).map((it: any) => this.itemToJson(it)),
    };
  }

  private itemToJson(it: any): PdfTextItemJson {
    return {
      pageNumber: this.toNum(it?.pageNumber) ?? 0,
      text: String(it?.text ?? ''),
      x: this.toNum(it?.x),
      y: this.toNum(it?.y),
      width: this.toNum(it?.width),
      height: this.toNum(it?.height),
    };
  }

  private toNum(v: any): number | undefined {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim().length) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
    return undefined;
  }
}

/**
 * Example usage:
 *
 * constructor(private pdfJson: PdfTextModelJsonService) {}
 *
 * const jsonObj = this.pdfJson.toJson(pdfTextModel);
 * const jsonStr = this.pdfJson.toJsonString(pdfTextModel, true);
 */
