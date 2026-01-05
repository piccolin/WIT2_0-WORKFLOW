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
 */

import { Injectable } from '@angular/core';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/hornings/hornings-extractor.error';
import { ExtractedOrder, ExtractedOrderItem } from '@app/app-transformer/services/extractors/models/extract.model';

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
    // Find the "Ship To" label, then read the lines under it.
    const stLabel = pdf.first('Ship To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

    const shippingAddress = pdf.getBelow(stLabel, 4, 2);
    if (shippingAddress.length !== 4) throw err.because('Ship To Address incomplete');

    // ---------------------------------------------------------------
// Shipping Method
// ---------------------------------------------------------------
// Find "Ship VIA" and read the value underneath it.
    const shipViaHits = pdf.all('Ship VIA', 'Ship Via') ?? [];

// STRICT RULE: accept ONLY a label that is exactly "Ship VIA" (not "Ship VIA F.O.B.")
    const shipViaLabel = shipViaHits.find((h: any) => {
      const labelText = String(h?.label ?? h?.text ?? '').toUpperCase();
      return labelText.includes('SHIP VIA') && !labelText.includes('F.O.B');
    });

// In this PDF there is only "Ship VIA F.O.B.", so shipViaLabel will be undefined,
// and shippingMethod should become undefined.
    const shippingMethod = shipViaLabel
      ? ((pdf.getBelow(shipViaLabel, 1, 1)[0] ?? '').trim() || undefined)
      : undefined;



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
      shippingAddress: shippingAddress,

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



}
