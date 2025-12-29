/**
 * @Filename:    pdf-geometry.ts
 * @Type:        Helper
 * @Date:        2025-12-17
 *
 * @Description:
 *   Geometry helpers for working with PDF text orderItems that have X/Y coordinates.
 *
 *   A PDF does not store “lines” like Word does.
 *   It stores lots of tiny text fragments placed at X/Y coordinates.
 *   To support “get what’s below this label”, we first group fragments into visual lines.
 *
 *   Coder’s note:
 *   The Y positions are often slightly inconsistent even on the same visual line,
 *   so we group with a tolerance.
 */

import { PdfTextItemModel } from '@app/app-parse/pdf-parser/models/pdf-text-item.model';

/**
 * A "visual line" on a PDF page (built from many text fragments with similar Y).
 */
export interface PdfTextLineModel {
  /** Representative Y coordinate for the whole line. */
  y: number;
  /** All fragments that appear on this line. */
  items: PdfTextItemModel[];
}

/**
 * A merged chunk of text produced by joining fragments that are close together on the same line.
 */
export interface PdfCoalescedTextChunkModel {
  /** The merged text (ex: "Unit $" instead of "Unit" + "$"). */
  text: string;
  /** Left edge of the merged chunk. */
  x: number;
  /** Right edge of the merged chunk (x + width-ish). */
  right: number;
  /** Y coordinate for the line. */
  y: number;
}

export class PdfGeometry {
  /**
   * Group individual PDF text fragments into "visual lines".
   *
   * @param items All extracted text orderItems for a page
   * @param yTolerance How close Y values must be to be considered the same line
   */
  public static buildLines(items: PdfTextItemModel[], yTolerance = 2): PdfTextLineModel[] {
    if (!items?.length) return [];

    // Sort top-to-bottom (by y), then left-to-right (by x).
    const sorted: PdfTextItemModel[] = [...items].sort((a: PdfTextItemModel, b: PdfTextItemModel) => {
      const dy = a.y - b.y;
      if (Math.abs(dy) > yTolerance) return dy;
      return a.x - b.x;
    });

    const lines: PdfTextLineModel[] = [];

    for (const item of sorted) {
      const line = lines.find((l: PdfTextLineModel) => Math.abs(l.y - item.y) <= yTolerance);

      if (!line) {
        lines.push({ y: item.y, items: [item] });
        continue;
      }

      line.items.push(item);
      line.y = PdfGeometry.averageY(line.items);
    }

    // Ensure each line's orderItems are left-to-right.
    for (const line of lines) {
      line.items.sort((a: PdfTextItemModel, b: PdfTextItemModel) => a.x - b.x);
    }

    // Final sort: top-to-bottom by Y.
    lines.sort((a: PdfTextLineModel, b: PdfTextLineModel) => a.y - b.y);

    return lines;
  }

  /**
   * Find which line an item belongs to.
   *
   * @param lines Lines created by buildLines()
   * @param item A specific text fragment
   * @param yTolerance Must match the tolerance used in buildLines()
   */
  public static findLineIndexForItem(lines: PdfTextLineModel[], item: PdfTextItemModel, yTolerance = 2): number {
    if (!lines?.length) return -1;

    for (let i = 0; i < lines.length; i++) {
      if (Math.abs(lines[i].y - item.y) <= yTolerance) return i;
    }

    return -1;
  }

  /**
   * Merge nearby fragments into bigger readable chunks (for headers or labels).
   *
   * Layman explanation:
   * PDF text often arrives in pieces:
   *   "Unit" and "$" may be separate fragments even though humans see "Unit $".
   * This merges pieces that are close together horizontally.
   *
   * @param line A visual line (from buildLines)
   * @param joinTolerance Maximum gap (in PDF units) allowed between fragments to be merged
   */
  public static coalesceLineText(line: PdfTextLineModel, joinTolerance = 6): PdfCoalescedTextChunkModel[] {
    const items: PdfTextItemModel[] = [...(line.items ?? [])].sort(
      (a: PdfTextItemModel, b: PdfTextItemModel) => a.x - b.x
    );

    const chunks: PdfCoalescedTextChunkModel[] = [];
    let current: PdfCoalescedTextChunkModel | null = null;

    for (const it of items) {
      const token = (it.text ?? '').replace(/\s+/g, ' ').trim();
      if (!token) continue;

      const right = it.x + Math.max(0, it.width ?? 0);

      if (!current) {
        current = { text: token, x: it.x, right, y: line.y };
        continue;
      }

      const gap = it.x - current.right;

      if (gap <= joinTolerance) {
        // Join onto the current chunk
        current.text = `${current.text} ${token}`.replace(/\s+/g, ' ').trim();
        current.right = Math.max(current.right, right);
      } else {
        // Start a new chunk
        chunks.push(current);
        current = { text: token, x: it.x, right, y: line.y };
      }
    }

    if (current) chunks.push(current);

    return chunks;
  }

  // -----------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------

  private static averageY(items: PdfTextItemModel[]): number {
    if (!items.length) return 0;
    const sum = items.reduce((acc: number, it: PdfTextItemModel) => acc + (it.y ?? 0), 0);
    return sum / items.length;
  }
}
