/**
 * @Filename:    cubitac-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2025-12-29
 *
 * @Description:
 *   Vendor-specific extraction rules for TSG PDFs.
 *
 *   Explanation:
 *   A PDF is basically a picture of text. It is NOT a real form or database.
 *   So we "hunt" for labels (like "Ship To") and then read the text that sits
 *   under or beside those labels.
 *
 *   We use PdfTextBehavioralModel helpers like:
 *   - first("Ship To")          -> find where the label is on the page
 *   - getBelow(label, lines, x) -> read lines beneath the label
 *   - getRight(label, a, b)     -> read tokens to the right of the label
 *   - getTable(label, table)    -> read a table using a header as the start point
 *
 *   Why so strict?
 *   If TSG changes their layout, we WANT this to fail loudly so we notice quickly.
 */

import { Injectable } from '@angular/core';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { PdfGeometry } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/tsg/tsg-extractor.error';
import {ExtractedOrder, ExtractedOrderItem} from "@app/app-transformer/services/extractors/models/extract.model";

@Injectable({ providedIn: 'root' })
export class TsgPdfExtractorService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * This is the main entry point.
   * Provide a PDF (already converted into searchable text),
   * and get back a clean extracted order model for the UI/services.
   */
  public extract(pdf: PdfTextBehaviorialModel): ExtractedOrder {
    // This is our vendor-specific error wrapper so failures are easy to identify.
    const err = new ExtractorError('tsg');

    // ---------------------------------------------------------------
    // Shipping Address
    // ---------------------------------------------------------------
    // Find the "Ship To" label, then read the lines under it.
    const stLabel = pdf.first('Ship To', 'Shipping To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

    const shippingAddress = pdf.getBelow(stLabel, 4, 2);
    if (shippingAddress.length !== 4) throw err.because('Ship To Address incomplete');

    // ---------------------------------------------------------------
    // Shipping Method
    // ---------------------------------------------------------------
    // Find "Shipping Method" and read the value underneath it.
    const shipViaLabel = pdf.first('Shipping Method', 'Shipment Method');
    if (!shipViaLabel) throw err.because('Could not find Ship Via Label');

    const [shippingMethodRaw] = pdf.getBelow(shipViaLabel, 1, 2);
    if (!shippingMethodRaw) throw err.because('Could not find Ship Via');

    const shippingMethod = (shippingMethodRaw ?? '').trim() || undefined;

    // ---------------------------------------------------------------
    // Freight
    // ---------------------------------------------------------------
    // Freight (shipping cost) is printed to the RIGHT of "Shipping Cost".
    const freightLabel = pdf.first('Shipping Cost');
    let freightRaw = '';
    if (freightLabel) {
      freightRaw = pdf.getRight(freightLabel, 1, 1)[0] || '';
    }

    // Money is stored as a string like "123.45" (no $ or commas).
    const freight = freightRaw || undefined;

    // ---------------------------------------------------------------
    // Subtotal / Total
    // ---------------------------------------------------------------
    // Find "Subtotal" and "Total", then read the values on the right.
    const subtotalLabel = pdf.first('Subtotal');
    if (!subtotalLabel) throw err.because('Could not find Order Subtotal Label');

    const [subtotalRaw] = pdf.getRight(subtotalLabel, 1, 3);
    if (!subtotalRaw) throw err.because('Could not find Order Subtotal');

    const subtotal = subtotalRaw;
    if (!subtotal) throw err.because('Could not parse Order Subtotal');

    const totalLabel = pdf.first('Total');
    if (!totalLabel) throw err.because('Could not find Order Total Label');

    const [totalRaw] = pdf.getRight(totalLabel, 1, 3);
    if (!totalRaw) throw err.because('Could not find Order Total');

    const total = totalRaw;
    if (!total) throw err.because('Could not parse Order Total');

    // ---------------------------------------------------------------
    // PO Number
    // ---------------------------------------------------------------
    // PO# is sometimes on the SAME line as the label (not underneath),
    // so we try to grab it from that same line first.
    const poNumberLabel =
      pdf.first('PO#:', 'PO#', 'P.O. Number', 'PO Number') ||
      undefined;

    if (!poNumberLabel) throw err.because('Could not find PO Number Label');

    const poNumber =
      this.extractValueForLabelSameLine(
        pdf,
        poNumberLabel,
        (t) => /^PO#?:?$/i.test(t) || /^PO#:/i.test(t) || /^PO#/i.test(t)
      ) ||
      this.firstNonEmpty([
        (pdf.getRight(poNumberLabel, 1, 2)[0] || '').trim(),
        (pdf.getBelow(poNumberLabel, 1, 2)[0] || '').trim(),
      ]);

    if (!poNumber) throw err.because('Could not find PO Number');

    // ---------------------------------------------------------------
    // Line Items Table
    // ---------------------------------------------------------------
    // The items list is a "table", but in a PDF it can be broken up into many little text pieces.
    // So we first find where the table header is, then read row-by-row beneath it.
    const tblStartLabels = this.uniqueAnchors([
      ...pdf.all('B/O ETA 1'),
      ...pdf.all('B/O ETA'),
    ]);

    // If label search misses (because the header is fragmented),
    // do a best-guess scan looking for a header line containing common column words.
    const headerAnchors = tblStartLabels.length > 0
      ? tblStartLabels
      : this.findTsgTableHeaderAnchors(pdf);

    if (headerAnchors.length === 0) throw err.because('Could not find Line Items Table header');

    // PdfTable tells the parser how to stitch text into columns and rows.
    const table = new PdfTable({
      geometry: {
        lineTolerance: 2,
        joinTolerance: 6,
      },
      parse: {
        minFilledCells: 2,
        blankLineLimit: 8,
      },
      // Different PDFs may label the same column in slightly different ways.
      // This maps variations into consistent column names.
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

    // Run table extraction starting at each possible header location we found.
    for (const anchor of headerAnchors) {
      pdf.getTable(anchor as any, table);
    }

    // Raw rows are just key/value text (strings).
    const rawTableRows: Record<string, string>[] = table.toArray();

    // Convert the raw table rows into our clean UI model.
    const items: ExtractedOrderItem[] = rawTableRows
      .map((row: Record<string, string>) => {
        const item = this.clean(row['Item']) || '';
        const qty = this.clean(row['Qty']) || undefined;
        const description = this.clean(row['Description']) || '';

        // Money gets normalized to "1234.56"
        const each = row['Each'] ?? '';
        const lineTotal = row['Amount'] ?? '';

        const additionalDetails = this.clean(row['Remark']) || undefined;
        const backorder = this.clean(row['BO']) || undefined;

        return {
          item,
          qty,
          each,
          total: lineTotal,
          description,
          additionalDetails,
          backorder,
        };
      })
      // Keep rows that look meaningful (some PDFs include blank or spacer rows).
      .filter((it) => {
        const hasIdentity = !!(it.item || it.description);
        const hasMoney = !!(it.each || it.total);
        return hasIdentity || hasMoney;
      });

    // ---------------------------------------------------------------
    // Output
    // ---------------------------------------------------------------
    // Return the final extracted order for downstream use.
    return {
      poNumber: poNumber,
      shippingMethod: shippingMethod,
      shippingAddress: shippingAddress,

      freight: freight,
      subtotal: subtotal,
      total: total,

      orderItems: items,
    };
  }

  // -----------------------------------------------------------------
  // Anchor / Line helpers
  // -----------------------------------------------------------------

  /**
   * Sometimes the value we need is on the SAME line as the label.
   * This reads that line and grabs the next token(s) after the label.
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
   * If we can’t find the table header by searching labels,
   * scan the page line-by-line and look for a line that contains
   * the key header words (Qty, Item, Description, Amount, etc.).
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

  /**
   * Sometimes our search finds the "same" header more than once.
   * This removes duplicates so we don’t parse the table multiple times.
   */
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

  /**
   * Given multiple possible candidates, return the first one that is not empty.
   */
  private firstNonEmpty(values: string[]): string {
    for (const v of values ?? []) {
      const s = (v ?? '').toString().trim();
      if (s) return s;
    }
    return '';
  }

  /**
   * PDFs often include weird spacing. This collapses multiple spaces and trims.
   * Returns null if it ends up empty.
   */
  private clean(v: string | undefined | null): string | null {
    const s = (v ?? '').toString().replace(/\s+/g, ' ').trim();
    return s.length ? s : null;
  }
}
