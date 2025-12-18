/**
 * @Filename:    pdf-label-hit.model.ts
 * @Type:        Model
 * @Date:        2025-12-17
 *
 * @Description:
 *   Represents a "found label" in the PDF, like "Ship To" or "Subtotal".
 *
 *   When we search for "Ship To", we want to remember:
 *   - which page it’s on
 *   - where it is located (x/y/width/height)
 *   - which text fragments made up the label (some PDFs split labels into pieces)
 */

import { PdfTextItemModel } from '@app/app-parse/pdf-parser/models/pdf-text-item.model';

export class PdfLabelHitModel {
  public readonly pageNumber: number;
  public readonly label: string;

  /** The PDF text fragments that matched the label (1 or more fragments). */
  public readonly items: PdfTextItemModel[];

  /** Bounding box (calculated from the matched fragments). */
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;

  constructor(args: { pageNumber: number; label: string; items: PdfTextItemModel[] }) {
    this.pageNumber = args.pageNumber;
    this.label = args.label;
    this.items = args.items;

    const xs = args.items.map(i => i.x);
    const ys = args.items.map(i => i.y);
    const rights = args.items.map(i => i.x + i.width);
    const bottoms = args.items.map(i => i.y + i.height);

    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const right = Math.max(...rights);
    const bottom = Math.max(...bottoms);

    this.x = left;
    this.y = top;
    this.width = Math.max(0, right - left);
    this.height = Math.max(0, bottom - top);
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get bottom(): number {
    return this.y + this.height;
  }
}
