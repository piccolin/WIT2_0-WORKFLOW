/**
 * @Filename:    pdf-page-text.model.ts
 * @Type:        Model
 * @Date:        2025-12-17
 *
 * @Description:
 *   Holds all extracted text fragments for ONE page of the PDF.
 */

import { PdfTextItemModel } from '@app/app-parse/pdf-parser/models/pdf-text-item.model';

export class PdfPageText {
  constructor(
    public readonly pageNumber: number,
    public readonly items: PdfTextItemModel[],
    public readonly pageWidth: number,
    public readonly pageHeight: number
  ) {}
}
