/**
 * @Filename:    hornings-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2025-12-30
 *
 * @Description:
 *   Vendor-specific extraction rules for Hornings PDFs.
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
 *   If Hornings changes their layout, we WANT this to fail loudly so we notice quickly.
 *
 *   To-Do
 *   -Shipping Method when extracted has to be corrected
 */

import { Injectable } from '@angular/core';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/hornings/hornings-extractor.error';
import { ExtractedOrder, ExtractedOrderItem } from '@app/app-transformer/services/extractors/models/extract.model';
import { PdfGeometry } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';


@Injectable({ providedIn: 'root' })
export class HorningsPdfExtractorService {
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
    const err = new ExtractorError('hornings');

    // ---------------------------------------------------------------
    // Shipping Address
    // ---------------------------------------------------------------

    const stLabel = pdf.first('Ship To:', 'Ship To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

// Read a few extra lines (PDFs can vary), then trim/clean
    const shippingAddressRaw = pdf.getBelow(stLabel, 10, 45);
    const shippingLines = (shippingAddressRaw ?? [])
      .map((s) => (s ?? '').trim())
      .filter(Boolean);

// Stop when we hit the next section of the document.
// (In Hornings PDFs, these labels appear after the address block.) :contentReference[oaicite:1]{index=1}
    const STOP_MARKERS = [
      /^waverly\b/i,             // Sold To block starts (WAVERLY CABINETS, INC.)
      /^customer\s+p\.?o\.?/i,
      /^ship\s+via/i,
      /^f\.?o\.?b\.?/i,
      /^terms\b/i,
      /^item\s+description\b/i,
      /^order\s+number\b/i,
    ];

    const cleanedAddress: string[] = [];
    for (const line of shippingLines) {
      // If we reached the next section, stop collecting address lines
      if (STOP_MARKERS.some((rx) => rx.test(line))) break;

      // Extra safety: never allow FOB lines to be part of shippingAddress
      const normalized = line.toUpperCase().replace(/[^A-Z0-9]+/g, '');
      if (normalized === 'FOB' || normalized.startsWith('FOB')) continue;

      cleanedAddress.push(line);
    }

// Hornings "Ship To" is sometimes 4 lines, sometimes 5+ (pickup instructions)
    if (cleanedAddress.length < 4) throw err.because('Ship To Address incomplete');

// Keep a sane max so we don’t drift (pickup blocks can be longer)
    const shippingAddressFinal = cleanedAddress.slice(0, 6);


    // ---------------------------------------------------------------
    // Shipping Method (Hornings) - Reliable strategy
    // ---------------------------------------------------------------
    // In these PDFs, the "Ship VIA" text is often part of a header line
    // ("Customer P.O. Comment Ship VIA F.O.B. FPP Terms") and NOT the field label.
    // The actual method/value is on the next line under that header region.
    // So we anchor from "Customer P.O." and parse the next line.
    const customerPoHeader = pdf.first('Customer P.O.', 'Customer P.O');
    let shippingMethod: string | undefined = undefined;

    if (customerPoHeader) {
      // Read the full line under the "Customer P.O." header area
      // (this is where we see: COLLINS1230 FC-$499 12.31.25 N NET 30)
      const lineUnder = this.readFullLineBelowAnchor(pdf, customerPoHeader, 1);

      // If it’s blank or date-only, no method
      if (lineUnder && !this.isDateLike(lineUnder)) {
        const picked = this.pickHorningsShipMethod(lineUnder);
        shippingMethod = picked || undefined;
      }
      console.log('Hornings method parse lineUnder(Customer P.O.):', lineUnder);
      console.log('Hornings method picked:', shippingMethod);

    }


    // ---------------------------------------------------------------
    // Freight
    // ---------------------------------------------------------------
    // Freight (shipping cost) is printed to the RIGHT of the freight label.
    // NOTE: The Hornings PDF uses "Freight:" (not "Shipping Cost").
    const freightLabel = pdf.first('Freight:', 'Freight', 'Shipping Cost');
    let freightRaw = '';
    if (freightLabel) {
      freightRaw = pdf.getRight(freightLabel, 1, 3)[0] || '';
    }
    const freight = this.getDollars(freightRaw) || undefined;

    // ---------------------------------------------------------------
    // Subtotal
    // ---------------------------------------------------------------
    // "Net Order" is the subtotal label in Hornings PDFs.
    const subtotalLabel = pdf.first('Net Order', 'Net Order:');
    if (!subtotalLabel) throw err.because('Could not find Order Subtotal Label');

    const [subtotalRaw] = pdf.getRight(subtotalLabel, 1, 3);
    if (!subtotalRaw) throw err.because('Could not find Order Subtotal');

    const subtotal = this.getDollars(subtotalRaw);
    if (!subtotal) throw err.because('Could not parse Order Subtotal');

    // ---------------------------------------------------------------
    // Discount
    // ---------------------------------------------------------------
    const discountLabel = pdf.first('Less Discount', 'Less Discount:');
    if (!discountLabel) throw err.because('Could not find Order Discount Label');

    const [discountRaw] = pdf.getRight(discountLabel, 1, 3);
    if (!discountRaw) throw err.because('Could not find Order Discount');

    const discount = this.getDollars(discountRaw);
    if (!discount) throw err.because('Could not parse Order Discount');

    // ---------------------------------------------------------------
    // Tax
    // ---------------------------------------------------------------
    const taxLabel = pdf.first('Sales Tax', 'Sales Tax:');
    if (!taxLabel) throw err.because('Could not find Sales Tax Label');

    const [taxRaw] = pdf.getRight(taxLabel, 1, 3);
    if (!taxRaw) throw err.because('Could not find Sales Tax');

    const tax = this.getDollars(taxRaw);
    if (!tax) throw err.because('Could not parse Sales Tax');

    // ---------------------------------------------------------------
    // Total
    // ---------------------------------------------------------------
    const totalLabel = pdf.first('Order Total', 'Order Total:');
    if (!totalLabel) throw err.because('Could not find Order Total Label');

    const [totalRaw] = pdf.getRight(totalLabel, 1, 3);
    if (!totalRaw) throw err.because('Could not find Order Total');

    const total = this.getDollars(totalRaw);
    if (!total) throw err.because('Could not parse Order Total');

    // ---------------------------------------------------------------
    // PO Number
    // ---------------------------------------------------------------
    const poNumberLabel = pdf.first('Customer P.O.', 'Customer P.O');
    if (!poNumberLabel) throw err.because('Could not find PO Number Label');

    const [poNumberRaw] = pdf.getBelow(poNumberLabel, 1);
    const poNumber = (poNumberRaw ?? '').trim();
    if (!poNumber) throw err.because('Could not find PO Number');

    // ---------------------------------------------------------------
    // Line Items Table
    // ---------------------------------------------------------------
    // Find table header(s) by the "Item Description" column label.
    const tblStartLabels = pdf.all('Item Description');
    if (!tblStartLabels?.length) throw err.because('Could not find Line Items Table header');

    // PdfTable tells the parser how to stitch text into columns and rows.
    const table = new PdfTable({
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

    // Run table extraction starting at each possible header location we found.
    for (const anchor of tblStartLabels) {
      pdf.getTable(anchor as any, table);
    }

    // Raw rows are just key/value text (strings).
    const rawTableRows: Record<string, string>[] = table.toArray();

    // Convert the raw table rows into our clean UI model.
    const items: ExtractedOrderItem[] = rawTableRows
      .map((row: Record<string, string>) => {
        const description = this.clean(row['Description']) || '';
        const qty = this.clean(row['Ordered']) || undefined;

        const each = this.getDollars(row['Price']);
        const lineTotal = this.getDollars(row['Amount']);

        const backorder = this.clean(row['BO']) || undefined;
        const shipped = this.clean(row['Shipped']) || undefined;

        return {
          // Hornings uses description as the "item" identifier.
          item: description,
          qty,
          description,
          each,
          total: lineTotal,
          backorder,
          shipped,
        } as unknown as ExtractedOrderItem;
      })
      // Keep rows that look meaningful (some PDFs include blank or spacer rows).
      // NOTE: Hornings PDFs were picking totals from the bottom of the page as extra rows.
      // To prevent that, ONLY keep rows that have a real numeric quantity.
      .filter((it: any) => {
        const desc = (it?.description ?? '').toString().trim();
        const qtyNum = this.parsePositiveInt(it?.qty);

        // Must have a real quantity
        if (qtyNum <= 0) return false;

        // Hornings line items in this PDF always start with vendor item prefixes.
        // This prevents "Comment", "N", "Freight", and totals from being treated as items.
        if (!/^(GHI|JIFFY)\b/i.test(desc)) return false;

        return true;
      });


    // ---------------------------------------------------------------
    // Output
    // ---------------------------------------------------------------
    // Return the final extracted order for downstream use.
    return {
      poNumber: poNumber,
      shippingMethod: shippingMethod,
      shippingAddress: shippingAddressFinal,

      freight: freight,
      subtotal: subtotal,
      discount: discount,
      tax: tax,
      total: total,

      orderItems: items,
    } as unknown as ExtractedOrder;
  }

  // -----------------------------------------------------------------
  // Small parsing helpers
  // -----------------------------------------------------------------

  /**
   * Money normalizer.
   * Examples:
   *  "$1,234.50" -> "1234.50"
   *  "(12.34)"   -> "-12.34"
   * Returns "" if it can’t produce a usable number string.
   */
  private getDollars(v: string | undefined | null): string {
    const raw = (v ?? '').toString().trim();
    if (!raw) return '';

    const isNegative = /^\(.*\)$/.test(raw);

    const cleaned = raw
      .replace(/[(),$]/g, '')
      .replace(/\s+/g, '')
      .trim();

    const normalized = cleaned.replace(/[^0-9.]/g, '');
    if (!normalized) return '';

    return isNegative ? `-${normalized}` : normalized;
  }

  /**
   * PDFs often include weird spacing. This collapses multiple spaces and trims.
   * Returns null if it ends up empty.
   */
  private clean(v: string | undefined | null): string | null {
    const s = (v ?? '').toString().replace(/\s+/g, ' ').trim();
    return s.length ? s : null;
  }

  /**
   * Returns a positive integer if the value looks like a qty ("1", "2", "10").
   * Otherwise returns 0.
   */
  private parsePositiveInt(v: string | undefined | null): number {
    const s = (v ?? '').toString().trim();
    if (!s) return 0;

    // Strip any non-digits (some PDFs include spacing or stray chars)
    const digitsOnly = s.replace(/[^\d]/g, '');
    if (!digitsOnly) return 0;

    const n = parseInt(digitsOnly, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  /**
   * Hornings "Ship VIA" often has no real method.
   * If the value under the label looks like a date or is mostly numeric, treat it as blank.
   */
  private looksLikeRealShippingMethod(v: string): boolean {
    const s = (v ?? '').trim();
    if (!s) return false;

    // Common date patterns: 12/30/25, 12/30/2025, etc.
    const looksLikeDate =
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s) ||
      /^\d{4}-\d{2}-\d{2}$/.test(s);

    if (looksLikeDate) return false;

    // If it’s mostly numbers/symbols, not a “method”.
    const letters = (s.match(/[A-Za-z]/g) ?? []).length;
    return letters > 0;
  }
  /**
   * Hornings PDFs have a totals/summary block at the bottom.
   * Sometimes table parsing accidentally turns those lines into "items".
   */
  private isHorningsSummaryRow(desc: string): boolean {
    const s = (desc ?? '').toString().replace(/\s+/g, ' ').trim().toLowerCase();

    const badStarts = [
      'net order',
      'less discount',
      'freight',
      'sales tax',
      'order total',
      'entered by',
      '$', // "$309 Freight ---- ..."
    ];

    return badStarts.some((b) => s.startsWith(b));
  }
  /**
   * True if a value contains at least one digit.
   * Used to validate qty/money columns.
   */
  private hasNumber(v: string | undefined | null): boolean {
    return /\d/.test((v ?? '').toString());
  }
  /**
   * Parse money strings into a number.
   * Returns 0 when not parsable.
   */
  private parseMoney(v: string | undefined | null): number {
    const s = (v ?? '').toString().trim();
    if (!s) return 0;

    const isNegative = /^\(.*\)$/.test(s);
    const cleaned = s.replace(/[(),$]/g, '').replace(/\s+/g, '').trim();
    const normalized = cleaned.replace(/[^0-9.]/g, '');
    if (!normalized) return 0;

    const n = parseFloat(normalized);
    if (!Number.isFinite(n)) return 0;

    return isNegative ? -n : n;
  }

  /**
   * Detect whether a "Ship VIA" label hit is actually part of "Ship VIA F.O.B."
   *
   * Why needed:
   * PdfTextSearch strips punctuation and matches only the "Ship VIA" portion,
   * so pdf.first('Ship VIA') will still match a line that says "Ship VIA F.O.B."
   * We detect this by checking the NEXT token on the same line.
   */
  private isFobVariantLabel(pdf: PdfTextBehaviorialModel, anchor: any): boolean {
    const page = pdf.getPage(anchor?.pageNumber);
    if (!page) return false;

    const lineTolerance = 2;
    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const anchorItems: any[] = Array.isArray(anchor?.items) ? anchor.items : [];
    if (!anchorItems.length) return false;

    const firstAnchorItem = anchorItems[0];
    const lastAnchorItem = anchorItems[anchorItems.length - 1];

    const lineIndex = PdfGeometry.findLineIndexForItem(lines, firstAnchorItem, lineTolerance);
    if (lineIndex < 0) return false;

    const line = lines[lineIndex];
    const items = (line?.items ?? [])
      .slice()
      .sort((a: any, b: any) => (a?.x ?? 0) - (b?.x ?? 0));

    // Find where the label ends on this line (use the last token of the matched label)
    const lastIdx = items.findIndex((it: any) => it === lastAnchorItem);
    if (lastIdx < 0) return false;

    // Check the next token on the same line
    const next = items[lastIdx + 1];
    const nextKey = (String(next?.text ?? '') || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '');

    return nextKey === 'FOB';
  }

  private readFullLineBelowAnchor(pdf: PdfTextBehaviorialModel, anchor: any, offsetLines: number): string {
    const page = pdf.getPage(anchor?.pageNumber);
    if (!page) return '';

    const lineTolerance = 2;
    const lines = PdfGeometry.buildLines(page.items, lineTolerance);

    const anchorItems: any[] = Array.isArray(anchor?.items) ? anchor.items : [];
    if (!anchorItems.length) return '';

    const anchorLineIdx = PdfGeometry.findLineIndexForItem(lines, anchorItems[0], lineTolerance);
    if (anchorLineIdx < 0) return '';

    const target = lines[anchorLineIdx + offsetLines];
    if (!target) return '';

    return (target.items ?? [])
      .slice()
      .sort((a: any, b: any) => (a?.x ?? 0) - (b?.x ?? 0))
      .map((it: any) => String(it?.text ?? '').trim())
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private isDateLike(s: string | undefined | null): boolean {
    const v = (s ?? '').toString().trim();
    if (!v) return false;

    return (
      /^\d{1,2}\.\d{1,2}\.\d{2,4}$/.test(v) ||   // 12.5.25
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(v) ||   // 12/5/2025
      /^\d{4}-\d{2}-\d{2}$/.test(v)              // 2025-12-05
    );
  }

  private pickHorningsShipMethod(line: string): string | undefined {
    const s = (line ?? '').replace(/\s+/g, ' ').trim();
    if (!s) return undefined;

    // 1) Price-coded method: FC-$499
    const moneyMethod = s.match(/\b[A-Z]{1,3}-\$\d[\d,]*\b/i);
    if (moneyMethod?.[0]) return moneyMethod[0];

    // 2) Pickup-style method: "PU MON 12.22"
    // Grab from "PU" up to the date token
    const pu = s.match(/\bPU\b.*?\b\d{1,2}\.\d{1,2}\b/i);
    if (pu?.[0]) return pu[0].trim();

    return undefined;
  }

  // private readFullLinesBelowAnchor(pdf: PdfTextBehaviorialModel, anchor: any, count: number): string[] {
  //   const page = pdf.getPage(anchor?.pageNumber);
  //   if (!page) return [];
  //
  //   const lineTolerance = 2;
  //   const lines = PdfGeometry.buildLines(page.items, lineTolerance);
  //
  //   const anchorItems: any[] = Array.isArray(anchor?.items) ? anchor.items : [];
  //   if (!anchorItems.length) return [];
  //
  //   const anchorLineIdx = PdfGeometry.findLineIndexForItem(lines, anchorItems[0], lineTolerance);
  //   if (anchorLineIdx < 0) return [];
  //
  //   return lines
  //     .slice(anchorLineIdx, anchorLineIdx + 1 + count) // include label line + below lines
  //     .map((ln: any) =>
  //       (ln?.items ?? [])
  //         .slice()
  //         .sort((a: any, b: any) => (a?.x ?? 0) - (b?.x ?? 0))
  //         .map((it: any) => String(it?.text ?? '').trim())
  //         .filter(Boolean)
  //         .join(' ')
  //         .replace(/\s+/g, ' ')
  //         .trim()
  //     )
  //     .filter(Boolean);
  // }

}
