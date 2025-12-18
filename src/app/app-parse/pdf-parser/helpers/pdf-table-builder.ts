/**
 * @Filename:    pdf-table-builder.ts
 * @Type:        Helper
 * @Date:        2025-12-17
 *
 * @Description:
 *   Generic (vendor-agnostic) PDF table builder.
 *
 *   Layman explanation:
 *   A PDF table is just text placed at x/y positions.
 *   We:
 *   1) Find the header line (the line containing the anchor label)
 *   2) Use header x-positions as “column boundaries”
 *   3) Walk lines below, assigning each token into a column by x
 *
 *   Coder’s note:
 *   This is heuristic by design. Different vendors may require small tuning via options.
 */

import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfLabelHitModel } from '@app/app-parse/pdf-parser/models/pdf-label-hit.model';
import { PdfGeometry, PdfCoalescedTextChunkModel } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';
import { PdfTable, PdfTableRow } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';

export class PdfTableBuilder {
  /**
   * Append rows from the table found at this anchor (a header label) into the given table.
   */
  public static appendFromAnchor(pdf: PdfTextBehaviorialModel, anchor: PdfLabelHitModel, table: PdfTable): void {
    const page = pdf.getPage(anchor.pageNumber);
    if (!page) return;

    const geometry = table.options.geometry ?? {};
    const parse = table.options.parse ?? {};

    const lineTolerance = geometry.lineTolerance ?? 2;
    const joinTolerance = geometry.joinTolerance ?? 6;

    const minFilledCells = parse.minFilledCells ?? 2;
    const blankLineLimit = parse.blankLineLimit ?? 3;
    const stopPredicate = parse.stopPredicate;

    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    // 1) Find the header line index (line containing the anchor label).
    const anchorItem = anchor.items[0];
    const headerLineIndex =
      anchorItem ? PdfGeometry.findLineIndexForItem(lines, anchorItem, lineTolerance) : -1;

    if (headerLineIndex < 0) return;

    const headerLine = lines[headerLineIndex];

    // 2) Convert header fragments into readable header chunks.
    const headerChunks: PdfCoalescedTextChunkModel[] =
      PdfGeometry.coalesceLineText(headerLine, joinTolerance)
        .sort((a: PdfCoalescedTextChunkModel, b: PdfCoalescedTextChunkModel) => a.x - b.x);

    if (headerChunks.length < 2) return;

    // First time only: define the table’s columns from the header.
    if (table.columns.length === 0) {
      table.setColumns(headerChunks.map((c: PdfCoalescedTextChunkModel) => c.text));
    }

    // 3) Build boundaries: midpoints between each adjacent header column.
    const boundaries: number[] = [];
    for (let i = 0; i < headerChunks.length - 1; i++) {
      boundaries.push((headerChunks[i].x + headerChunks[i + 1].x) / 2);
    }

    // Walk the lines below the header and assign tokens to columns by x-position.
    let blankStreak = 0;

    for (let i = headerLineIndex + 1; i < lines.length; i++) {
      const line = lines[i];

      const rawLineText = line.items
        .map(it => it.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      const row: PdfTableRow = {};
      for (const col of table.columns) row[col] = '';

      for (const item of line.items) {
        const text = (item.text ?? '').trim();
        if (!text) continue;

        const colIndex = PdfTableBuilder.findColumnIndex(item.x, boundaries);
        const colName = table.columns[colIndex] ?? table.columns[table.columns.length - 1];

        row[colName] = `${row[colName]} ${text}`.replace(/\s+/g, ' ').trim();
      }

      const filledCount = Object.values(row)
        .map((v: string) => (v ?? '').trim())
        .filter((v: string) => v.length > 0).length;

      // Optional caller-defined stop rule (keeps this helper vendor-agnostic).
      if (stopPredicate?.(row, rawLineText) === true) {
        break;
      }

      // Ignore noise/blank lines; stop after too many in a row.
      if (filledCount < minFilledCells) {
        blankStreak++;
        if (blankStreak >= blankLineLimit) break;
        continue;
      }

      blankStreak = 0;
      table.addRow(row);
    }
  }

  /**
   * Given an X coordinate, decide which column it belongs to using boundaries.
   */
  private static findColumnIndex(x: number, boundaries: number[]): number {
    for (let i = 0; i < boundaries.length; i++) {
      if (x < boundaries[i]) return i;
    }
    return boundaries.length; // last column
  }
}
