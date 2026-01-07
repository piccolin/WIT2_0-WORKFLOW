/**
 * @Filename:    wolf-html-extractor.service.ts
 * @Type:        Service
 * @Date:        2026-01-07
 *
 * @Description:
 *   Vendor-specific extraction rules for Wolf HTML order/cart pages.
 *
 *   Explanation:
 *   The HtmlFileParserService reads the HTML file and returns a DocumentFragment.
 *   We then query the fragment for the elements we need and return the extracted values.
 *
 *   If Wolf changes their HTML layout, we WANT extraction to fail loudly so we notice quickly.
 */

import { Injectable } from '@angular/core';

import { HtmlFileParserService } from '@app/app-parse/html-parser/services/html-file-parser.service';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/wolf/wolf-extractor.error';
import { ExtractedOrder, ExtractedOrderItem } from '@app/app-transformer/services/extractors/models/extract.model';

@Injectable({ providedIn: 'root' })
export class WolfHtmlExtractorService {
  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(private readonly htmlParser: HtmlFileParserService) {}

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Main entry point.
   * Provide an HTML file and get back the extracted order model.
   */
  public async extract(file?: File | null): Promise<ExtractedOrder> {
    const doc = await this.htmlParser.parseToDoc(file);
    return this.extractFromDoc(doc);
  }

  /**
   * Extract from a prepared DocumentFragment.
   * Useful for unit tests (no file I/O required).
   */
  public extractFromDoc(doc: DocumentFragment): ExtractedOrder {
    const err = new ExtractorError('wolf');

    // ---------------------------------------------------------------
    // Summary header table (PO Number, Ship To, Shipping Method, etc.)
    // ---------------------------------------------------------------

    let poNumber: string | undefined;
    let shippingAddress: string[] = [];
    let shippingMethod: string | undefined;

    const headerRows = Array.from(doc.querySelectorAll('.summary-header-table tr'));
    if (!headerRows.length) throw err.because('Could not find Summary Header Table Rows');

    headerRows.forEach((row) => {
      const keyRaw = this.text(row.querySelector('td:first-child'));
      const valRaw = this.text(row.querySelector('td:last-child'));

      const key = this.snakeCase(keyRaw);

      if (key === 'po_number') {
        poNumber = valRaw || undefined;
      } else if (key === 'shipping_method') {
        const method = (valRaw.split(' – ')[0] ?? '').trim();
        shippingMethod = method || undefined;
      } else if (key === 'ship_to') {
        shippingAddress = this.splitLines(valRaw);
      }
    });

    if (!poNumber) throw err.because('Could not find PO Number');
    if (!shippingAddress.length) throw err.because('Could not parse Shipping Address');

    // ---------------------------------------------------------------
    // Totals block
    // ---------------------------------------------------------------

    const totalsEl = doc.querySelector('.total-price-table');
    if (!totalsEl) throw err.because('Could not find Totals Element');

    const subtotalText =
      this.text(totalsEl.querySelector(`[data-test-id="text-price-subtotal"]`)) || '$0.01';
    const taxText = this.text(totalsEl.querySelector(`[data-test-id="text-price-tax"]`)) || '$0.01';
    const totalText =
      this.text(totalsEl.querySelector(`[data-test-id="text-price-total"]`)) || '$0.01';

    const subtotal = this.getDollars(subtotalText);
    const tax = this.getDollars(taxText);
    const total = this.getDollars(totalText);

    // NOTE:
    // Wolf pages (in the snippet you shared) don’t reliably expose a separate “freight/shipping cost”
    // in the totals table, so we keep freight undefined (unless you want to add a selector later).
    const freight: string | undefined = undefined;

    // ---------------------------------------------------------------
    // Line items
    // ---------------------------------------------------------------

    const itemRows = Array.from(doc.querySelectorAll('.product-list-table tr'));
    if (!itemRows.length) throw err.because('Could not find Cart Item Elements');

    const orderItems: ExtractedOrderItem[] = itemRows
      .map((el) => {
        // Skip header/empty rows by requiring a product title element
        const itemName = this.text(el.querySelector(`[data-test-id="btn-product-details"]`));
        if (!itemName) return null;

        const eachRaw = this.text(el.querySelector(`[data-test-id="text-product-item-cost"]`));
        const qtyRaw = this.text(el.querySelector(`[data-test-id="text-product-qty"]`));
        const totalRaw = this.text(el.querySelector('td:last-child'));

        const each = this.getDollars(this.extractPrice(eachRaw));
        const qty = this.extractQty(qtyRaw);
        const lineTotal = this.getDollars(totalRaw);

        return {
          item: itemName,
          description: itemName,
          qty,
          each,
          total: lineTotal,
        };
      })
      .filter(Boolean) as ExtractedOrderItem[];

    if (!orderItems.length) throw err.because('Could not parse any line items');

    // ---------------------------------------------------------------
    // Output
    // ---------------------------------------------------------------

    return {
      poNumber,
      shippingAddress,
      shippingMethod,

      subtotal,
      tax,
      freight,
      total,

      orderItems,
    };
  }

  // -----------------------------------------------------------------
  // Helpers: Text / parsing
  // -----------------------------------------------------------------

  /**
   * Safe textContent read with whitespace collapse + trim.
   */
  private text(el: Element | null): string {
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Break a multi-line block into clean lines.
   * Wolf "Ship To" often contains line breaks.
   */
  private splitLines(text: string): string[] {
    return (text ?? '')
      .split(/\r?\n/)
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  /**
   * Convert labels like:
   *  "Shipping Method" -> "shipping_method"
   *  "Ship To" -> "ship_to"
   */
  private snakeCase(input: string): string {
    return (input ?? '')
      .replace(/[^\w\s]/g, ' ')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * Extract a money-like substring from a text (keeps "$" if present).
   * Examples:
   *  "Each: $12.34" -> "$12.34"
   *  "$12.34 / ea"  -> "$12.34"
   *  "12.34"        -> "12.34"
   */
  private extractPrice(text: string): string {
    const s = (text ?? '').trim();
    if (!s) return '$0.01';

    // Try currency first
    const m1 = s.match(/\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\$\s*\d+(?:\.\d{2})?/);
    if (m1?.[0]) return m1[0].replace(/\s+/g, '');

    // Fallback to first number
    const m2 = s.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?/);
    return (m2?.[0] ?? '0.01').trim();
  }

  /**
   * Convert any "$1,234.56" / "1234.56" into a clean "1234.56" string.
   * Defaults are handled by callers (they pass "$0.01" when missing).
   */
  private getDollars(text: string): string {
    const raw = (text ?? '').trim();
    const cleaned = raw.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return '0.01';
    return n.toFixed(2);
  }

  /**
   * Extract qty from text like:
   *  "Qty: 3" -> "3"
   *  "3"      -> "3"
   *  ""       -> "0"
   */
  private extractQty(text: string): string {
    const s = (text ?? '').trim();
    const m = s.match(/\d+/);
    return (m?.[0] ?? '0').trim();
  }
}
