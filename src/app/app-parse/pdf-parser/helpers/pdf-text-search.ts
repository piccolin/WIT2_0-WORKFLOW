/**
 * @Filename:    pdf-text-search.ts
 * @Type:        Helper
 * @Date:        2025-12-17
 *
 * @Description:
 *   Searches PDF pages for labels like "Ship To", "Subtotal", "P.O. Number", etc.
 *
 *   Layman explanation:
 *   PDF text can be split into multiple pieces. For example:
 *     "P.O."  +  "Number"
 *   This helper tries to match labels even when they are split across adjacent tokens.
 */

import { PdfPageText } from '@app/app-parse/pdf-parser/models/pdf-page-text.model';
import { PdfLabelHitModel } from '@app/app-parse/pdf-parser/models/pdf-label-hit.model';
import {PdfGeometry} from "@app/app-parse/pdf-parser/helpers/pdf-geometry";

export class PdfTextSearch {
  /**
   * Find all matches for the given labels.
   * Labels are tried in the order given.
   */
  public static findAll(pages: PdfPageText[], labels: string[]): PdfLabelHitModel[] {
    const wanted = labels
      .map(l => ({ raw: l, key: this.toSearchKey(l) }))
      .filter(l => !!l.key);

    const hits: PdfLabelHitModel[] = [];

    for (const page of pages) {
      const lines = PdfGeometry.buildLines(page.items);

      for (const line of lines) {
        // Work with tokens (text items) on this line.
        const tokens = line.items
          .map(i => ({ item: i, key: this.toSearchKey(i.text) }))
          .filter(t => !!t.key);

        if (tokens.length === 0) continue;

        // Try to match each label by concatenating consecutive token keys.
        for (const label of wanted) {
          const labelKey = label.key;

          for (let start = 0; start < tokens.length; start++) {
            let combined = '';

            for (let end = start; end < tokens.length; end++) {
              combined += tokens[end].key;

              if (combined === labelKey) {
                const matchedItems = tokens.slice(start, end + 1).map(t => t.item);
                hits.push(new PdfLabelHitModel({ pageNumber: page.pageNumber, label: label.raw, items: matchedItems }));
                break;
              }

              // If combined is already longer than what we need, stop early.
              if (combined.length > labelKey.length) break;
            }
          }
        }
      }
    }

    // Sort in reading order: page, top->bottom (y), left->right (x).
    return hits.sort((a, b) => (a.pageNumber - b.pageNumber) || (a.y - b.y) || (a.x - b.x));
  }

  /** Convenience: find the first match for any label. */
  public static findFirst(pages: PdfPageText[], labels: string[]): PdfLabelHitModel | undefined {
    return this.findAll(pages, labels)[0];
  }

  /**
   * Convert text into a "search key".
   * We remove non-alphanumeric characters so punctuation differences don't break matches.
   *
   * Example:
   *   "P.O. Number" -> "PONUMBER"
   *   "Ship   To:"  -> "SHIPTO"
   */
  private static toSearchKey(text: string | undefined | null): string {
    const s = (text ?? '').toUpperCase().trim();
    // Keep only letters+numbers for forgiving matches.
    return s.replace(/[^A-Z0-9]+/g, '');
  }
}
