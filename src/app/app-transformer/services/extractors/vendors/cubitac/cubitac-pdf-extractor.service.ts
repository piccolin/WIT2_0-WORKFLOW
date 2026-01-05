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
    const shipViaLabel = pdf.first('Ship Via', 'SHIP VIA');
    if (!shipViaLabel) throw err.because('Could not find Ship Via Label');

    // NOTE:
    // Cubitac header/value cells are center-justified.
    // getBelow() uses a rightward window and can accidentally grab the NEXT column (Salesperson).
    // So we extract Ship Via by the center of its column between PO and SALESPERSON.
    const poHeaderForBounds = pdf.first('PO');
    const salesPersonHeaderForBounds = pdf.first('SALESPERSON', 'Salesperson');

    const shippingMethodRaw =
      this.extractCenteredColumnValueBelow(pdf, shipViaLabel, poHeaderForBounds, salesPersonHeaderForBounds) ||
      (pdf.getBelow(shipViaLabel, 1, 25)[0] || '');

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

    // NOTE:
    // PO is printed UNDER the "PO" header, and it's the LEFTMOST value on that value line.
    // Because the values are center-justified, getBelow() can miss the PO token and pick the next column.
    // So we read the full line directly below the header and take the first token.
    const poValueLine = this.getFullLineTextBelow(pdf, poNumberLabel);
    const poNumber = this.firstToken(poValueLine);

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

    // const table = new PdfTable({
    //   geometry: {
    //     lineTolerance: 2,
    //     joinTolerance: 6,
    //   },
    //   parse: {
    //     minFilledCells: 2,
    //     blankLineLimit: 10,
    //     // Cubitac PDFs often end the table with a "Style Total" row/section.
    //     stopPredicate: (_row: PdfTableRow, rawLineText: string) => /style\s+total/i.test(rawLineText ?? ''),
    //   },
    //   // Keep columns predictable, but DO NOT normalize values.
    //   columnNamer: (raw: string) => (raw ?? '').replace(/\s+/g, ' ').trim().toUpperCase(),
    // });

    // PdfTable tells the parser how to stitch text into columns and rows.
    const table = new PdfTable({
      geometry: {
        lineTolerance: 2,
        joinTolerance: 6,
      },
      parse: {
        minFilledCells: 2,
        blankLineLimit: 10,

        // Hornings PDFs have totals/footer text below the table.
        // Stop parsing as soon as we hit those footer lines so they don't become "items".
        stopPredicate: (_row: any, rawLineText: string) => {
          const t = (rawLineText ?? '').toString().replace(/\s+/g, ' ').trim().toLowerCase();
          return (
            t.startsWith('net order') ||
            t.startsWith('less discount') ||
            t.startsWith('sales tax') ||
            t.startsWith('order total') ||
            t.startsWith('entered by') ||
            // This line shows up in your PDF footer and was being pulled into table rows:
            // "$309 Freight ---- ..." (exact wording varies, so keep it broad)
            /^\$\s*\d+/.test(t) && t.includes('freight')
          );
        },
      },

      // Different PDFs may label the same column in slightly different ways.
      // This maps variations into consistent column names.
      columnNamer: (col: string) => {
        switch ((col ?? '').replace(/\s+/g, ' ').trim()) {
          case 'Item Description':
            return 'Description';
          case 'Unit $':
            return 'Each';
          case 'Back Order':
            return 'BO';
          default:
            return col;
        }
      },
    });


    for (const anchor of tblStartLabels) {
      pdf.getTable(anchor, table);
    }

    const rawRows: Record<string, string>[] = table.toArray();

    const items: ExtractedOrderItem[] = rawRows
      .map((row: Record<string, string>) => {
        const item = this.clean(this.cell(row, ['ITEM'])) || '';

        // -----------------------------------------------------------
        // Qty Fix
        // -----------------------------------------------------------
        // Cubitac includes an unlabeled row-number column BEFORE QTY.
        // Table parsing can fold that row-number into the QTY cell.
        // Example:
        //   QTY = "2 1"   (row-number 2, real qty 1)
        // We "skip" the unlabeled column by taking the LAST integer in QTY.
        const qtyRaw = this.clean(this.cell(row, ['QTY'])) || undefined;
        const qty = this.extractQtySkippingIndex(qtyRaw) || undefined;

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
        const hasItem = !!(it?.item ?? '').toString().trim();
        const hasQty = !!(it?.qty ?? '').toString().trim();
        return hasItem && hasQty;
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

  /**
   * Read the full text line directly BELOW the provided header/label.
   * This ignores column windows so it works with center-justified values.
   */
  private getFullLineTextBelow(pdf: PdfTextBehaviorialModel, anchor: any): string {
    const page = pdf.getPage(anchor?.pageNumber);
    if (!page) return '';

    const lineTolerance = 2;
    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const anchorItem = anchor?.items?.[0];
    if (!anchorItem) return '';

    const anchorLineIndex = PdfGeometry.findLineIndexForItem(lines, anchorItem, lineTolerance);
    if (anchorLineIndex < 0) return '';

    const nextLine = lines[anchorLineIndex + 1];
    if (!nextLine?.items?.length) return '';

    return nextLine.items
      .slice()
      .sort((a: any, b: any) => (a?.x ?? 0) - (b?.x ?? 0))
      .map((it: any) => String(it?.text ?? '').trim())
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract the value centered under a column header on the line below.
   * Uses left/right neighbor headers to avoid bleeding into the next column.
   */
  private extractCenteredColumnValueBelow(
    pdf: PdfTextBehaviorialModel,
    header: any,
    leftNeighbor?: any,
    rightNeighbor?: any
  ): string {
    const page = pdf.getPage(header?.pageNumber);
    if (!page) return '';

    const lineTolerance = 2;
    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const headerItem = header?.items?.[0];
    if (!headerItem) return '';

    const headerLineIndex = PdfGeometry.findLineIndexForItem(lines, headerItem, lineTolerance);
    if (headerLineIndex < 0) return '';

    const valueLine = lines[headerLineIndex + 1];
    if (!valueLine?.items?.length) return '';

    const headerCenter = this.centerX(header);
    const leftCenter = leftNeighbor ? this.centerX(leftNeighbor) : null;
    const rightCenter = rightNeighbor ? this.centerX(rightNeighbor) : null;

    const xMin = leftCenter !== null ? ((leftCenter + headerCenter) / 2) : (headerCenter - 160);
    const xMax = rightCenter !== null ? ((headerCenter + rightCenter) / 2) : (headerCenter + 160);

    const tokens = valueLine.items
      .slice()
      .sort((a: any, b: any) => (a?.x ?? 0) - (b?.x ?? 0))
      .filter((it: any) => {
        const t = String(it?.text ?? '').trim();
        if (!t) return false;

        const c = this.itemCenterX(it);
        return c >= xMin && c <= xMax;
      })
      .map((it: any) => String(it?.text ?? '').trim())
      .filter(Boolean);

    return tokens.join(' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Skip the unlabeled row-number column that gets folded into QTY.
   * If QTY looks like "2 1" (rowIndex + qty), return "1".
   */
  private extractQtySkippingIndex(qtyRaw: string | undefined | null): string {
    const s = (qtyRaw ?? '').toString().replace(/\s+/g, ' ').trim();
    if (!s) return '';

    const parts = s.split(' ').filter(Boolean);

    // If it's exactly two integers, treat it as: [rowIndex] [qty]
    if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
      return parts[1];
    }

    // If it starts with an integer and ends with an integer, keep the last integer.
    // (Some PDFs may include extra spacing or fragments.)
    const numericParts = parts.filter(p => /^\d+$/.test(p));
    if (numericParts.length >= 2) {
      return numericParts[numericParts.length - 1];
    }

    return s;
  }

  private firstToken(line: string): string {
    const s = (line ?? '').toString().trim();
    if (!s) return '';
    return (s.split(/\s+/)[0] || '').trim();
  }

  private centerX(label: any): number {
    const x1 = Number(label?.x ?? 0);
    const x2 = Number(label?.right ?? x1);
    return (x1 + x2) / 2;
  }

  private itemCenterX(it: any): number {
    const x = Number(it?.x ?? 0);
    const w = Number(it?.width ?? 0);
    return x + (w / 2);
  }
}
