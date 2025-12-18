/**
 * @Filename:    pdf-text-item.model.ts
 * @Type:        Model
 * @Date:        2025-12-17
 *
 * @Description:
 *   One text fragment extracted from the PDF with coordinates.
 *
 *   A PDF is not a Word doc. It’s more like a "drawing" with text placed at positions.
 *   pdf.js gives us little text pieces (fragments) + where each piece sits on the page.
 */

export interface PdfTextItemModel {
  pageNumber: number;

  /** The actual text we extracted from the PDF. */
  text: string;

  /**
   * Coordinates in "viewport space" (like screen coordinates):
   * - x increases to the RIGHT
   * - y increases DOWN
   *
   * Coder’s note:
   * pdf.js transforms raw PDF coordinates into viewport coordinates using a viewport transform.
   * That makes comparisons like "below this label" practical.
   */
  x: number;
  y: number;

  /** Bounding box dimensions for the text fragment. */
  width: number;
  height: number;
}
