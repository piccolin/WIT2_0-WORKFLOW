/**
 * @Filename:    cubitac-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2025-12-30
 *
 * @Description:
 *   Vendor-specific extraction rules for Cubitac PDFs.
 *
 *   Explanation:
 *   A PDF is basically a picture of text. It is NOT a real form or database.
 *   So we "hunt" for labels (like "Ship To") and then read the text that sits
 *   under or beside those labels.
 *
 *   We use PdfTextBehaviorialModel helpers like:
 *   - first("Ship To")          -> find where the label is on the page
 *   - getBelow(label, lines, n) -> read lines beneath the label (join up to n fragments per line)
 *   - getRight(label, a, b)     -> read tokens to the right of the label (scan up to b lines)
 *   - getTable(label, table)    -> read a table using a header as the start point
 *
 *   IMPORTANT:
 *   This service ONLY EXTRACTS. It does NOT normalize values.
 *   (Normalization happens later in the pipeline.)
 *
 *   Why so strict?
 *   If Cubitac changes their layout, we WANT this to fail loudly so we notice quickly.
 */

import { Injectable } from '@angular/core';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable, PdfTableRow } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { PdfGeometry } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/cubitac/cubitac-extractor.error';
import { ExtractedOrder, ExtractedOrderItem } from '@app/app-transformer/services/extractors/models/extract.model';

@Injectable({ providedIn: 'root' })
export class CubitacPdfExtractorService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Main entry point.
   * Provide a PDF (already converted into searchable text),
   * and get back a clean extracted order model for the UI/services.
   */
  public extract(pdf: PdfTextBehaviorialModel): ExtractedOrder {
    const err = new ExtractorError('cubitac');

    // ---------------------------------------------------------------
    // Shipping Address
    // ---------------------------------------------------------------
    const stLabel = pdf.first('Ship To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

    const shippingAddress = pdf.getBelow(stLabel, 3, 45);
    if (shippingAddress.length !== 3) throw err.because('Could not find Ship To Address');

    // ---------------------------------------------------------------
    // Shipping Method
    // ---------------------------------------------------------------
    const shipViaLabel = pdf.first('Ship Via');
    if (!shipViaLabel) throw err.because('Could not find Ship Via Label');

    const [shippingMethodRaw] = pdf.getBelow(shipViaLabel, 1, 25);
    if (!shippingMethodRaw) throw err.because('Could not find Ship Via');

    const shippingMethod = this.clean(shippingMethodRaw) || undefined;

    // ---------------------------------------------------------------
    // Freight (EXTRACT ONLY - DO NOT NORMALIZE)
    // ---------------------------------------------------------------
    const freightLabel = pdf.first('Shipping');
    let freight: string | undefined;
    if (freightLabel) {
      freight = (pdf.getRight(freightLabel, 1, 1)[0] || '0.00').trim();
    }

    // ---------------------------------------------------------------
    // Subtotal / Discount / Total (EXTRACT ONLY - DO NOT NORMALIZE)
    // ---------------------------------------------------------------
    const subtotalLabel = pdf.first('Subtotal');
    if (!subtotalLabel) throw err.because('Could not find Order Subtotal Label');

    const [subtotal] = pdf.getRight(subtotalLabel, 1, 1);
    if (!subtotal) throw err.because('Could not find Order Subtotal');

    const discountLabel = pdf.first('Discount');
    const discount = discountLabel ? (pdf.getRight(discountLabel, 1, 1)[0] || '0') : '0';

    const totalLabel = pdf.first('Order Total:', 'Grand Total:');
    if (!totalLabel) throw err.because('Could not find Order Total Label');

    const [total] = pdf.getRight(totalLabel, 1, 1);
    if (!total) throw err.because('Could not find Order Total');

    // ---------------------------------------------------------------
    // PO Number
    // ---------------------------------------------------------------
    const poNumberLabel = pdf.first('PO');
    if (!poNumberLabel) throw err.because('Could not find PO Number Label');

    const poNumber =
      this.firstNonEmpty([
        this.extractValueForLabelSameLine(
          pdf,
          poNumberLabel,
          (t) => /^PO$/i.test(t) || /^P\.?O\.?$/i.test(t),
          1
        ),
        (pdf.getRight(poNumberLabel, 1, 1)[0] || '').trim(),
        (pdf.getBelow(poNumberLabel, 1, 25)[0] || '').trim(),
      ]);

    if (!poNumber) throw err.because('Could not find PO Number');

    // ---------------------------------------------------------------
    // Door Style / Color
    // ---------------------------------------------------------------
    const styleLabel = pdf.first('STYLE');
    if (!styleLabel) throw err.because('Could not find Door Style Label');

    const [style] = pdf.getRight(styleLabel, 1, 3);

    const colorLabel = pdf.first('COLOR');
    if (!colorLabel) throw err.because('Could not find Color Label');

    const [color] = pdf.getRight(colorLabel, 1, 3);

    // ---------------------------------------------------------------
    // Line Items Table
    // ---------------------------------------------------------------
    const tblStartLabels = this.uniqueAnchors(pdf.all('QTY'));
    if (tblStartLabels.length === 0) throw err.because('Could not find Line Items Table header');

    const table = new PdfTable({
      geometry: {
        lineTolerance: 2,
        joinTolerance: 6,
      },
      parse: {
        minFilledCells: 2,
        blankLineLimit: 10,
        // Cubitac PDFs often end the table with a "Style Total" row/section.
        stopPredicate: (_row: PdfTableRow, rawLineText: string) => /style\s+total/i.test(rawLineText ?? ''),
      },
      // Keep columns predictable, but DO NOT normalize values.
      columnNamer: (raw: string) => (raw ?? '').replace(/\s+/g, ' ').trim().toUpperCase(),
    });

    for (const anchor of tblStartLabels) {
      pdf.getTable(anchor, table);
    }

    const rawRows: Record<string, string>[] = table.toArray();

    const items: ExtractedOrderItem[] = rawRows
      .map((row: Record<string, string>) => {
        const item = this.clean(this.cell(row, ['ITEM'])) || '';
        const qty = this.clean(this.cell(row, ['QTY', 'QTY 1', 'QTY 2'])) || undefined;

        const description = this.clean(this.cell(row, ['DESCRIPTION'])) || '';

        // EXTRACT ONLY (no currency normalization)
        const each = this.clean(this.cell(row, ['PRICE'])) || undefined;
        const lineTotal = this.clean(this.cell(row, ['AMOUNT'])) || undefined;

        const hinge = this.clean(this.cell(row, ['HINGE'])) || undefined;
        const finish = this.clean(this.cell(row, ['FINISH'])) || undefined;

        return {
          item,
          qty,
          each,
          total: lineTotal,
          description,

          // Cubitac-specific extracted fields (kept raw)
          hinge,
          finish,
        } as any as ExtractedOrderItem;
      })
      .filter((it: any) => {
        const hasIdentity = !!(it?.item || it?.description);
        const hasMoney = !!(it?.each || it?.total);
        return hasIdentity || hasMoney;
      });

    // ---------------------------------------------------------------
    // Output (EXTRACTED RAW STRINGS)
    // ---------------------------------------------------------------
    // NOTE:
    // If ExtractedOrder does not yet contain discount/style/color fields,
    // keep the cast and add them to the model when ready.
    return {
      poNumber: poNumber,
      shippingMethod: shippingMethod,
      shippingAddress: shippingAddress,

      freight: freight,
      subtotal: (subtotal ?? '').trim(),
      discount: (discount ?? '').trim(),
      total: (total ?? '').trim(),

      style: (style ?? '').trim() || undefined,
      color: (color ?? '').trim() || undefined,

      orderItems: items,
    } as any as ExtractedOrder;
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
   * Sometimes search finds the "same" header more than once.
   * Remove duplicates so we don’t parse the table multiple times.
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
   * (This is NOT value normalization; it only makes raw text usable.)
   */
  private clean(v: string | undefined | null): string | null {
    const s = (v ?? '').toString().replace(/\s+/g, ' ').trim();
    return s.length ? s : null;
  }

  /**
   * Safely grab a cell from a row using multiple possible column names.
   */
  private cell(row: Record<string, string>, keys: string[]): string {
    for (const k of keys ?? []) {
      const v = row?.[k];
      if (typeof v === 'string' && v.trim().length) return v;
    }
    return '';
  }
}
