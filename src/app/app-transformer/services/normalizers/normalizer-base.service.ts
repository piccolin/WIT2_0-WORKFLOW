/**
 * @Filename:    normalizer-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-29
 *
 * @Description:
 *   Shared normalization logic for all vendor outputs.
 *
 *   Explanation:
 *   Extractors read raw text from PDFs. That raw text can include:
 *   - extra spaces
 *   - dollar signs and commas in currency
 *   - negatives formatted like "(123.45)"
 *
 *   This base class standardizes the full ExtractedOrder object so downstream steps
 *   always receive predictable values.
 *
 *   Why array helpers exist:
 *   Some values live inside arrays (shippingAddress lines, orderItems, totals, etc.).
 *   Normalizing only the top-level object would leave those nested strings uncleaned.
 *   The helpers iterate through arrays and normalize each element so the entire object
 *   graph is consistent.
 */

import {
  ExtractedOrder,
  ExtractedOrderItem,
} from '@app/app-transformer/services/extractors/models/extract.model';

export abstract class NormalizerBaseService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Default normalizer for ExtractedOrder.
   * Vendor normalizers can override if they need additional vendor-specific rules,
   * but most vendors should be able to use this as-is.
   */
  public normalize(input: ExtractedOrder): ExtractedOrder {
    const output: ExtractedOrder = {
      ...input,
    };

    // ---------------------------------------------------------------
    // Top-level strings
    // ---------------------------------------------------------------

    output.poNumber = this.cleanOptionalString(output.poNumber);
    output.shippingMethod = this.cleanOptionalString(output.shippingMethod);

    // Multiple address lines must each be cleaned individually.
    output.shippingAddress = Array.isArray(output.shippingAddress)
      ? output.shippingAddress.map((s) => this.cleanString(s))
      : [];

    // ---------------------------------------------------------------
    // Money fields (keep as strings, but normalized)
    // ---------------------------------------------------------------

    output.subtotal = this.normalizeMoney(output.subtotal);
    output.total = this.normalizeMoney(output.total);

    output.tax = this.cleanOptionalMoney(output.tax);
    output.freight = this.cleanOptionalMoney(output.freight);
    output.discount = this.cleanOptionalMoney(output.discount);

    // ---------------------------------------------------------------
    // Key/value collections (trim only)
    // ---------------------------------------------------------------

    output.shippingMethods = this.cleanRecordArray(output.shippingMethods);
    output.totals = this.cleanRecordArray(output.totals);

    // ---------------------------------------------------------------
    // Line items
    // ---------------------------------------------------------------

    output.orderItems = Array.isArray(output.orderItems)
      ? output.orderItems.map((it) => this.normalizeItem(it))
      : [];

    return output;
  }

  // -----------------------------------------------------------------
  // Item normalization
  // -----------------------------------------------------------------

  protected normalizeItem(it: ExtractedOrderItem): ExtractedOrderItem {
    return {
      ...it,
      item: this.cleanString(it.item),
      description: this.cleanString(it.description),

      qty: this.cleanOptionalString(it.qty),

      each: this.normalizeMoney(it.each),
      total: this.normalizeMoney(it.total),

      additionalDetails: this.cleanOptionalString(it.additionalDetails),
      backorder: this.cleanOptionalString(it.backorder),
    };
  }

  // -----------------------------------------------------------------
  // Helpers: Strings
  // -----------------------------------------------------------------

  protected cleanString(value: any): string {
    return (value ?? '').toString().replace(/\s+/g, ' ').trim();
  }

  protected cleanOptionalString(value: any): string | undefined {
    const s = this.cleanString(value);
    return s ? s : undefined;
  }

  // -----------------------------------------------------------------
  // Helpers: Money
  // -----------------------------------------------------------------

  protected normalizeMoney(value: any): string {
    const raw = this.cleanString(value);
    if (!raw) return '';

    const normalized = this.parseMoneyString(raw);
    return normalized ?? raw;
  }

  protected cleanOptionalMoney(value: any): string | undefined {
    const raw = this.cleanString(value);
    if (!raw) return undefined;

    const normalized = this.parseMoneyString(raw);
    return (normalized ?? raw) || undefined;
  }

  /**
   * Convert common PDF money formats into a standard numeric string.
   *
   * Examples:
   * - "$1,234.56"   -> "1234.56"
   * - "(1,234.56)"  -> "-1234.56"
   *
   * If it can’t be parsed, return null.
   */
  public parseMoneyString(input: string): string | null {
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

    const signed = isNegative ? -value : value;
    return signed.toFixed(2);
  }

  // -----------------------------------------------------------------
  // Helpers: Record arrays
  // -----------------------------------------------------------------

  protected cleanRecordArray(
    arr?: Array<Record<string, string>>
  ): Array<Record<string, string>> | undefined {
    if (!Array.isArray(arr)) return undefined;

    return arr.map((rec) => {
      const out: Record<string, string> = {};

      for (const [k, v] of Object.entries(rec ?? {})) {
        const key = this.cleanString(k);
        if (!key) continue;

        out[key] = this.cleanString(v);
      }

      return out;
    });
  }
}
