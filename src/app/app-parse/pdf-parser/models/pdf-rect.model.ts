/**
 * @Filename:    pdf-rect.model.ts
 * @Type:        Model
 * @Date:        2025-12-17
 *
 * @Description:
 *   A simple rectangle (bounding box) in page coordinates.
 *   Think: "where on the page is this text located?"
 */

export interface PdfRectModel {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectRight(r: PdfRectModel): number {
  return r.x + r.width;
}

export function rectBottom(r: PdfRectModel): number {
  return r.y + r.height;
}
