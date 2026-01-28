/**
 * @Filename:    cubitac-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2026-01-28
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
 *
 *   TO-DO
 *   -Shipping Address extraction has to be corrected
 *
 *   FIX (Item + Description):
 *   - Some Cubitac PDFs get parsed such that "ITEM" and "DESCRIPTION" are merged
 *     (e.g., one cell becomes "TCD-15/18 Trimmable Cutlery Divider").
 *   - This service now detects merged cells and splits them:
 *       item = first token
 *       description = rest of line
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
    // Shipping Address (Cubitac)
    //   - Address is under "SHIP TO"
    //   - There is a blank line after the label
    //   - Right column text can spill into the same row (e.g., PROJECTED DELIVERY DATE)
    // ---------------------------------------------------------------
    const stLabel = pdf.first('SHIP TO', 'Ship To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

    // Pull a few lines so we can skip blank + junk safely
    const below = pdf.getBelow(stLabel, 10, 80).map(v => (v ?? '').trim());

    // Helper: remove right-column spillover from a line
    const stripRightColumnJunk = (line: string) => {
      // Add more stop-words if you see them bleeding into the Ship To line
      const STOP_WORDS = ['PROJECTED DELIVERY DATE', 'DELIVERY DATE'];
      let out = line;

      for (const stop of STOP_WORDS) {
        const idx = out.toUpperCase().indexOf(stop);
        if (idx >= 0) out = out.slice(0, idx).trim();
      }
      return out;
    };

    // 1) Skip blanks
    // 2) Skip date-only lines like 11/21/2025 (often the projected delivery date value)
    // 3) Strip right-column labels that got appended to the address line
    const cleaned = below
      .filter(Boolean)
      .filter(line => !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(line))
      .map(stripRightColumnJunk)
      .filter(Boolean);

    // Take first 2–3 address lines (street + city/state/zip, sometimes name line)
    const shippingAddress = cleaned.slice(0, 3);

    // Validate (your example is 2 lines; some are 3)
    if (shippingAddress.length < 2) throw err.because('Could not find Ship To Address');

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

    // PdfTable tells the parser how to stitch text into columns and rows.
    const table = new PdfTable({
      geometry: {
        lineTolerance: 2,
        joinTolerance: 6,
      },
      parse: {
        minFilledCells: 2,
        blankLineLimit: 10,

        // Stop parsing as soon as we hit footer/totals lines so they don't become "items".
        stopPredicate: (_row: any, rawLineText: string) => {
          const t = (rawLineText ?? '').toString().replace(/\s+/g, ' ').trim().toLowerCase();

          // Cubitac footer starts around here in your PDF:
          // "Grand Total Signature", "Quote Expires", "*This delivery date..."
          if (
            t.includes('grand total') ||
            t.includes('signature') ||
            t.includes('please sign') ||
            t.includes('by signing') ||
            t.includes('quote expires') ||
            t.startsWith('*this delivery date') ||
            t.startsWith('sub') ||          // "SubTotal"
            t.startsWith('subtotal') ||
            t.startsWith('discount') ||
            t.startsWith('shipping')
          ) {
            return true;
          }


          //existing footer rules
          return (
            t.startsWith('net order') ||
            t.startsWith('less discount') ||
            t.startsWith('sales tax') ||
            t.startsWith('order total') ||
            t.startsWith('entered by') ||
            // "$309 Freight ---- ..." (varies, keep it broad)
            (/^\$\s*\d+/.test(t) && t.includes('freight')) ||
            // Cubitac can end with "Style Total"
            t.includes('style total')
          );
        },
      },

      // Different PDFs may label the same column in slightly different ways.
      // This maps variations into consistent column names.
      columnNamer: (col: string) => {
        const c = (col ?? '').replace(/\s+/g, ' ').trim().toUpperCase();

        // ✅ IMPORTANT FIX:
        // Sometimes header comes through as "ITEM DESCRIPTION" (merged)
        // Preserve it so we can split item/description later.
        if (c === 'ITEM DESCRIPTION' || c === 'ITEM  DESCRIPTION') return 'ITEM_DESCRIPTION';

        switch (c) {
          case 'ITEM DESCRIPTION': // extra safety
            return 'ITEM_DESCRIPTION';
          case 'DESCRIPTION':
            return 'DESCRIPTION';
          case 'UNIT $':
            return 'EACH';
          case 'PRICE':
            return 'PRICE';
          case 'AMOUNT':
            return 'AMOUNT';
          case 'BACK ORDER':
            return 'BO';
          default:
            return c;
        }
      },
    });

    for (const anchor of tblStartLabels) {
      pdf.getTable(anchor, table);
    }

    const rawRows: Record<string, string>[] = table.toArray();

    const items: ExtractedOrderItem[] = rawRows
      .map((row: Record<string, string>) => {
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

        // -----------------------------------------------------------
        //  Item + Description Fix
        // -----------------------------------------------------------
        const itemCell = this.clean(this.cell(row, ['ITEM'])) || '';
        const descCell = this.clean(this.cell(row, ['DESCRIPTION', 'DESC'])) || '';

        // If the parser merged columns, this will often be populated
        const combinedCell =
          this.clean(this.cell(row, ['ITEM_DESCRIPTION', 'ITEM DESCRIPTION', 'ITEMDESC', 'ITEMDESC.'])) || '';

        const { item, description } = this.resolveItemAndDescription(itemCell, descCell, combinedCell);

        // EXTRACT ONLY (no currency normalization)
        const each = this.clean(this.cell(row, ['PRICE', 'EACH', 'UNIT PRICE', 'UNIT $'])) || undefined;
        const lineTotal = this.clean(this.cell(row, ['AMOUNT', 'TOTAL', 'EXTENDED'])) || undefined;

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
      // .filter((it: any) => {
      //   const hasItem = !!(it?.item ?? '').toString().trim();
      //   const hasQty = !!(it?.qty ?? '').toString().trim();
      //   return hasItem && hasQty;
      // });

      .filter((it: any) => {
        const item = (it?.item ?? '').toString().trim();
        const qty = (it?.qty ?? '').toString().trim();
        const each = (it?.each ?? '').toString().trim();
        const total = (it?.total ?? '').toString().trim();

        //  Qty must be a number (real line items)
        const qtyIsNumeric = /^\d+(\.\d+)?$/.test(qty);

        // Must have money values (Cubitac items always have PRICE + AMOUNT)
        const hasMoney = !!each && !!total;

        //  Exclude date-as-item rows (like 12/25/2025)
        const itemLooksLikeDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(item);

        return !!item && qtyIsNumeric && hasMoney && !itemLooksLikeDate;
      });


    // ---------------------------------------------------------------
    // Output (EXTRACTED RAW STRINGS)
    // ---------------------------------------------------------------
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
  // ✅ Item/Description helpers
  // -----------------------------------------------------------------

  /**
   * Cubitac sometimes yields:
   *   ITEM = "TUK Touch Up Kit" and DESCRIPTION empty
   * OR a merged column like:
   *   ITEM_DESCRIPTION = "TUK Touch Up Kit"
   *
   * This makes sure we always return item + description separately.
   */
  private resolveItemAndDescription(
    itemCell: string,
    descCell: string,
    combinedCell: string
  ): { item: string; description: string } {
    const item = (itemCell ?? '').trim();
    const description = (descCell ?? '').trim();
    const combined = (combinedCell ?? '').trim();

    // Case 1: perfect parse already
    if (item && description) return { item, description };

    // Case 2: ITEM has everything (common failure mode)
    if (item && !description) {
      return this.splitItemAndDescription(item);
    }

    // Case 3: merged column exists
    if (!item && !description && combined) {
      return this.splitItemAndDescription(combined);
    }

    // Case 4: ITEM empty but DESCRIPTION has something (rare)
    if (!item && description) {
      const split = this.splitItemAndDescription(description);
      return split.item ? split : { item: '', description };
    }

    return { item: item || '', description: description || '' };
  }

  /**
   * Split "TCD-15/18 Trimmable Cutlery Divider" into:
   *   item = "TCD-15/18"
   *   description = "Trimmable Cutlery Divider"
   *
   * NOTE:
   * This assumes Cubitac's item code is the FIRST token.
   * If you ever see item codes with spaces, we can enhance this.
   */
  private splitItemAndDescription(text: string): { item: string; description: string } {
    const s = (text ?? '').toString().replace(/\s+/g, ' ').trim();
    if (!s) return { item: '', description: '' };

    const firstSpace = s.indexOf(' ');
    if (firstSpace < 0) return { item: s, description: '' };

    const item = s.slice(0, firstSpace).trim();
    const description = s.slice(firstSpace + 1).trim();

    return { item, description };
  }

  // -----------------------------------------------------------------
  // Anchor / Line helpers
  // -----------------------------------------------------------------

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

    const xMin = leftCenter !== null ? (leftCenter + headerCenter) / 2 : headerCenter - 160;
    const xMax = rightCenter !== null ? (headerCenter + rightCenter) / 2 : headerCenter + 160;

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
    return x + w / 2;
  }
}
