/**
 * @Filename:    tsg-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2025-12-18
 *
 * @Description:
 *   Vendor-specific extraction rules for TSG PDFs.
 *
 *   Layman explanation:
 *   A PDF is not a “real table” or “real form”.
 *   It’s just text placed on a page at x/y positions.
 *
 *   Our PdfTextBehaviorialModel gives us human-friendly helpers like:
 *   - first("Ship To") -> find the label location
 *   - getBelow(label, 4, 2) -> read lines underneath the label
 *   - getRight(label, 1, 3) -> read tokens to the right
 *   - getTable(label, table) -> build table rows from a header label
 *
 *   Coder’s note:
 *   These rules are intentionally strict.
 *   If TSG changes their layout, we WANT extraction to fail loudly so we can fix it.
 */

import { Injectable } from '@angular/core';

import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { PdfGeometry } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';

import { ConfirmationOrder } from '@scr/API';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/tsg/tsg-extractor.error';

export interface TsgConfirmationItemModel {
  item?: string | null;
  qty?: string | null;
  description?: string | null;
  each?: number | null;
  total?: number | null;
  additional_details?: string | null;
  backorder?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TsgPdfExtractorService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  public extract(pdf: PdfTextBehaviorialModel): Partial<ConfirmationOrder> {
    const err = new ExtractorError('tsg');

    // ---------------------------------------------------------------
    // Shipping Address
    // ---------------------------------------------------------------

    const stLabel = pdf.first('Ship To', 'Shipping To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

    const shipping_address = pdf.getBelow(stLabel, 4, 2);
    if (shipping_address.length !== 4) throw err.because('Ship To Address incomplete');

    // ---------------------------------------------------------------
    // Shipping Method
    // ---------------------------------------------------------------

    const shipViaLabel = pdf.first('Shipping Method', 'Shipment Method');
    if (!shipViaLabel) throw err.because('Could not find Ship Via Label');

    const [shipping_method] = pdf.getBelow(shipViaLabel, 1, 2);
    if (!shipping_method) throw err.because('Could not find Ship Via');

    // ---------------------------------------------------------------
    // Freight
    // ---------------------------------------------------------------

    const freightLabel = pdf.first('Shipping Cost');
    let freight = '';
    if (freightLabel) {
      freight = pdf.getRight(freightLabel, 1, 1)[0] || '';
    }

    // ---------------------------------------------------------------
    // Subtotal / Total
    // ---------------------------------------------------------------

    const subtotalLabel = pdf.first('Subtotal');
    if (!subtotalLabel) throw err.because('Could not find Order Subtotal Label');

    const [subtotal] = pdf.getRight(subtotalLabel, 1, 3);
    if (!subtotal) throw err.because('Could not find Order Subtotal');

    const totalLabel = pdf.first('Total');
    if (!totalLabel) throw err.because('Could not find Order Total Label');

    const [total] = pdf.getRight(totalLabel, 1, 3);
    if (!total) throw err.because('Could not find Order Total');

    // ---------------------------------------------------------------
    // PO Number (fix: value is often on SAME LINE as label)
    // ---------------------------------------------------------------

    const poNumberLabel =
      pdf.first('PO#:', 'PO#', 'P.O. Number', 'PO Number') ||
      undefined;

    if (!poNumberLabel) throw err.because('Could not find PO Number Label');

    /**
     * Coder’s note:
     * Some label hits end up “wide” (label search may include extra tokens),
     * which can make getRight() return nothing because it starts AFTER anchor.right.
     *
     * So we read PO using a strict same-line scan FIRST, then fall back to model helpers.
     */
    const po_number = this.extractValueForLabelSameLine(pdf, poNumberLabel, (t) => /^PO#?:?$/i.test(t) || /^PO#:/i.test(t) || /^PO#/i.test(t))
      || this.firstNonEmpty([
        (pdf.getRight(poNumberLabel, 1, 2)[0] || '').trim(),
        (pdf.getBelow(poNumberLabel, 1, 2)[0] || '').trim(),
      ]);

    if (!po_number) throw err.because('Could not find PO Number');

    // ---------------------------------------------------------------
    // Line Items Table
    // ---------------------------------------------------------------

    /**
     * IMPORTANT:
     * Header is commonly fragmented like: "B/O" + "ETA" + "1"
     * so searching only "B/O ETA" can miss depending on search/token join.
     *
     * Strategy:
     *  1) Try label search hits ("B/O ETA 1" then "B/O ETA")
     *  2) If none, fall back to a heuristic header-line scan
     */
    const tblStartLabels = this.uniqueAnchors([
      ...pdf.all('B/O ETA 1'),
      ...pdf.all('B/O ETA'),
    ]);

    const headerAnchors = tblStartLabels.length > 0
      ? tblStartLabels
      : this.findTsgTableHeaderAnchors(pdf);

    if (headerAnchors.length === 0) throw err.because('Could not find Line Items Table header');

    const table = new PdfTable({
      geometry: {
        lineTolerance: 2,
        joinTolerance: 6,
      },
      parse: {
        minFilledCells: 2,
        blankLineLimit: 8,
      },
      columnNamer: (col: string) => {
        const c = (col ?? '').replace(/\s+/g, ' ').trim();

        switch (c) {
          case '...':
            return 'Qty';
          case 'Unit $':
          case 'Unit$':
            return 'Each';
          case 'B/O ETA':
          case 'B/O ETA 1':
            return 'BO';
          default:
            return c;
        }
      },
    });

    for (const anchor of headerAnchors) {
      pdf.getTable(anchor as any, table);
    }

    const rawTableRows: Record<string, string>[] = table.toArray();

    const items: TsgConfirmationItemModel[] = rawTableRows
      .map((row: Record<string, string>) => ({
        item: this.clean(row['Item']) ?? null,
        qty: this.clean(row['Qty']) ?? null,
        description: this.clean(row['Description']) ?? null,
        each: this.parseDollars(row['Each'] ?? ''),
        total: this.parseDollars(row['Amount'] ?? ''),
        additional_details: this.clean(row['Remark']) ?? null,
        backorder: this.clean(row['BO']) ?? null,
      }))
      .filter((it) => !!it.item || !!it.description || (it.total !== null && it.total !== 0));

    // ---------------------------------------------------------------
    // Output (include debug table block for console validation)
    // ---------------------------------------------------------------

    return {
      po_number: po_number,
      shipping_method: (shipping_method ?? '').trim() || null,
      shipping_address: shipping_address,

      freight: this.parseDollars(freight),
      subtotal: this.parseDollars(subtotal),
      total: this.parseDollars(total),

      items: items as any,

      extracted_table: {
        anchorStrategy: tblStartLabels.length > 0 ? 'labelSearch' : 'heuristicLineScan',
        anchorCount: headerAnchors.length,
        columns: [...(table.columns ?? [])],
        rowCount: rawTableRows.length,
        rows: rawTableRows,
      },
    } as any as Partial<ConfirmationOrder>;
  }

  // -----------------------------------------------------------------
  // Anchor / Line helpers
  // -----------------------------------------------------------------

  /**
   * Extract a value that lives on the SAME LINE as the label token.
   * Used for PO# where value frequently appears to the right on the same line.
   */
  private extractValueForLabelSameLine(
    pdf: PdfTextBehaviorialModel,
    anchor: any,
    isLabelToken: (text: string) => boolean,
    tokenCount = 1
  ): string {
    const page = pdf.getPage(anchor?.pageNumber);
    if (!page) return '';

    const lineTolerance = 2;
    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const anchorItem = anchor?.items?.[0];
    if (!anchorItem) return '';

    const anchorLineIndex = PdfGeometry.findLineIndexForItem(lines, anchorItem, lineTolerance);
    if (anchorLineIndex < 0) return '';

    const line = lines[anchorLineIndex];
    const items = (line?.items ?? [])
      .slice()
      .sort((a: any, b: any) => (a?.x ?? 0) - (b?.x ?? 0));

    const labelIndex = items.findIndex((it: any) => isLabelToken(String(it?.text ?? '').trim()));
    if (labelIndex < 0) return '';

    const start = labelIndex + 1;

    const tokens: string[] = [];
    for (let i = start; i < items.length; i++) {
      const t = String(items[i]?.text ?? '').trim();
      if (!t) continue;

      tokens.push(t);
      if (tokens.length >= Math.max(1, tokenCount)) break;
    }

    return tokens.join(' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Heuristic: find the header line by scanning for multiple known header words.
   * Returns "anchor-like" objects compatible with pdf.getTable(anchor, table).
   */
  private findTsgTableHeaderAnchors(pdf: PdfTextBehaviorialModel): any[] {
    const anchors: any[] = [];
    const lineTolerance = 2;

    const mustHave = ['Qty', 'Item', 'Description', 'Amount'];
    const shouldHave = ['B/O', 'ETA', 'Unit', '$', 'Remark', '...'];

    for (const page of (pdf as any).pages ?? []) {
      const pageItems: any[] = Array.isArray(page?.items) ? page.items : [];
      if (!pageItems.length) continue;

      const lines = PdfGeometry.buildLines(pageItems, lineTolerance);

      for (const line of lines ?? []) {
        const lineItems: any[] = Array.isArray(line?.items) ? line.items : [];
        if (!lineItems.length) continue;

        const text = lineItems
          .slice()
          .sort((a, b) => (a?.x ?? 0) - (b?.x ?? 0))
          .map((it) => String(it?.text ?? '').trim())
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (!text) continue;

        const hasAllMust = mustHave.every((w) => text.includes(w));
        const hasSomeShould = shouldHave.some((w) => text.includes(w));

        if (!hasAllMust || !hasSomeShould) continue;

        const xs = lineItems.map((it) => Number(it?.x ?? 0));
        const rights = lineItems.map((it) => {
          const x = Number(it?.x ?? 0);
          const w = Number(it?.width ?? 0);
          const r = typeof it?.right === 'number' ? it.right : (x + w);
          return Number.isFinite(r) ? r : x;
        });

        anchors.push({
          label: 'TSG_TABLE_HEADER',
          pageNumber: page.pageNumber,
          x: Math.min(...xs),
          right: Math.max(...rights),
          items: lineItems,
        });
      }
    }

    return this.uniqueAnchors(anchors);
  }

  private uniqueAnchors(hits: any[]): any[] {
    const seen = new Set<string>();
    const out: any[] = [];

    for (const h of hits ?? []) {
      const page = h?.pageNumber ?? 0;
      const x = typeof h?.x === 'number' ? h.x.toFixed(1) : '0';
      const key = `${page}:${x}`;

      if (seen.has(key)) continue;
      seen.add(key);
      out.push(h);
    }

    return out;
  }

  private firstNonEmpty(values: string[]): string {
    for (const v of values ?? []) {
      const s = (v ?? '').toString().trim();
      if (s) return s;
    }
    return '';
  }

  private clean(v: string | undefined | null): string | null {
    const s = (v ?? '').toString().replace(/\s+/g, ' ').trim();
    return s.length ? s : null;
  }

  // -----------------------------------------------------------------
  // Money parsing (lightweight)
  // -----------------------------------------------------------------

  /**
   * Convert "$1,234.56" (or "1,234.56") into a number.
   *
   * PDFs often include dollar signs and commas. We strip those out safely.
   *
   * Coder’s note:
   * If you want money parsing as a pipeline normalizer later, move this into a normalizer service.
   */
  private parseDollars(input: string): number | null {
    const raw = (input ?? '').toString().trim();
    if (!raw) return null;

    const isNegative = raw.startsWith('(') && raw.endsWith(')');

    const cleaned = raw
      .replace(/\$/g, '')
      .replace(/,/g, '')
      .replace(/[()]/g, '')
      .trim();

    const value = Number.parseFloat(cleaned);
    if (Number.isNaN(value)) return null;

    return isNegative ? -value : value;
  }
}
