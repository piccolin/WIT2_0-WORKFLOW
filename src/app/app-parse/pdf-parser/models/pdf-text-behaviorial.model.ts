/**
 * @Filename:    pdf-text-behaviorial.model.ts
 * @Type:        Model
 * @Date:        2025-12-17
 *
 * @Description:
 *   Main "document" model returned by PdfParserService.
 *
 *   This is the object your vendor parsers interact with:
 *   - first(...)     -> find the first matching label
 *   - all(...)       -> find all label matches
 *   - getBelow(...)  -> get lines of text below a label
 *   - getRight(...)  -> get tokens to the right of a label
 *   - getTable(...)  -> build/append a table from a header label
 */

import { PdfPageText } from '@app/app-parse/pdf-parser/models/pdf-page-text.model';
import { PdfLabelHitModel } from '@app/app-parse/pdf-parser/models/pdf-label-hit.model';
import { PdfTextSearch } from '@app/app-parse/pdf-parser/helpers/pdf-text-search';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { PdfTableBuilder } from '@app/app-parse/pdf-parser/helpers/pdf-table-builder';
import { PdfGeometry } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';

export class PdfTextBehaviorialModel {
  constructor(public readonly pages: PdfPageText[]) {}

  // ---------------------------------------------------------------
  // Basic access
  // ---------------------------------------------------------------

  public getPage(pageNumber: number): PdfPageText | undefined {
    return this.pages.find(p => p.pageNumber === pageNumber);
  }

  // ---------------------------------------------------------------
  // Label search
  // ---------------------------------------------------------------

  public first(...labels: string[]): PdfLabelHitModel | undefined {
    return PdfTextSearch.findFirst(this.pages, labels);
  }

  public all(...labels: string[]): PdfLabelHitModel[] {
    return PdfTextSearch.findAll(this.pages, labels);
  }

  // ---------------------------------------------------------------
  // Relative extraction helpers (below/right)
  // ---------------------------------------------------------------

  /**
   * Get N lines of text below a label.
   *
   * @param anchor              The label hit returned by first()/all()
   * @param lineCount           How many lines to read below the label
   * @param maxFragmentsPerLine Some PDFs split a "visual line" into multiple fragments.
   *                            This limits how many fragments we join per returned line.
   */
  public getBelow(anchor: PdfLabelHitModel, lineCount: number, maxFragmentsPerLine = 1): string[] {
    const page = this.getPage(anchor.pageNumber);
    if (!page) return [];

    // A “line” in a PDF is not a real line like a Word doc — it’s text pieces with similar Y coordinates.
    // We group items into lines using a small tolerance.
    const lineTolerance = 2;

    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const anchorItem = anchor.items[0];
    const anchorLineIndex = anchorItem
      ? PdfGeometry.findLineIndexForItem(lines, anchorItem, lineTolerance)
      : -1;

    if (anchorLineIndex < 0) return [];

    const results: string[] = [];
    const columnX = anchor.x;

    /**
     * CODER’s NOTE:
     *  “Same column” is a best-guess window to avoid accidentally grabbing other nearby fields.
     *  We scan rightward from the label, but not the entire page.
     */
    const pageWidth = page.pageWidth ?? 0;
    const columnWidth = Math.min(320, Math.max(0, pageWidth - columnX));
    const xMin = columnX - 5;
    const xMax = columnX + columnWidth;

    for (let i = anchorLineIndex + 1; i < lines.length && results.length < lineCount; i++) {
      const line = lines[i];

      const inColumn = line.items
        .filter(it => it.x >= xMin && it.x <= xMax)
        .sort((a, b) => a.x - b.x)
        .slice(0, Math.max(1, maxFragmentsPerLine));

      const text = inColumn
        .map(it => it.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (text) results.push(text);
    }

    return results;
  }

  /**
   * Get tokens to the right of a label.
   *
   * @param anchor    The label hit returned by first()/all()
   * @param count     How many tokens to return
   * @param maxLines  Search the same line plus up to N-1 lines below (useful when values wrap)
   */
  public getRight(anchor: PdfLabelHitModel, count: number, maxLines = 1): string[] {
    const page = this.getPage(anchor.pageNumber);
    if (!page) return [];

    const lineTolerance = 2;

    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const anchorItem = anchor.items[0];
    const anchorLineIndex = anchorItem
      ? PdfGeometry.findLineIndexForItem(lines, anchorItem, lineTolerance)
      : -1;

    if (anchorLineIndex < 0) return [];

    const results: string[] = [];
    const minX = anchor.right + 6; // padding so we don’t re-grab the label

    for (let i = anchorLineIndex; i < lines.length && i < anchorLineIndex + Math.max(1, maxLines); i++) {
      const line = lines[i];

      const rights = line.items
        .filter(it => it.x >= minX)
        .sort((a, b) => a.x - b.x);

      for (const it of rights) {
        const t = (it.text ?? '').trim();
        if (!t) continue;

        results.push(t);
        if (results.length >= count) return results;
      }
    }

    return results;
  }

  // ---------------------------------------------------------------
  // Table extraction
  // ---------------------------------------------------------------

  /**
   * Append rows from the table at the given anchor into the provided PdfTable.
   */
  public getTable(anchor: PdfLabelHitModel, table: PdfTable): void {
    PdfTableBuilder.appendFromAnchor(this, anchor, table);
  }
}
