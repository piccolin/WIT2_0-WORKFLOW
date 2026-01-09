/**
 * @Filename:    woocommerce-json-extractor.service.ts
 * @Type:        Service
 * @Date:        2026-01-09
 *
 * @Description:
 *   Vendor-specific extraction rules for WooCommerce JSON order exports.
 *
 *   Explanation:
 *   JSON is structured data, but exports still vary by plugin/report format.
 *   So we:
 *   - validate the root shape (array -> first order)
 *   - read known keys (order_number, shipping_*, order_subtotal, order_total, products[])
 *   - compute line totals (qty * item_price) for predictable downstream use
 *
 *   Why so strict?
 *   If WooCommerce export format changes, we WANT this to fail loudly
 *   so we notice quickly and fix the mapping.
 */

import { Injectable } from '@angular/core';

import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/woocommerce/woocommerce-extractor.error';
import {
  ExtractedOrder,
  ExtractedOrderItem,
} from '@app/app-transformer/services/extractors/models/extract.model';

type AnyRecord = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class WoocommerceJsonExtractorService {
  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Main entry point.
   * Provide parsed JSON (already JSON.parse'd), and get back a clean extracted order model.
   *
   * Expected input shape (from the sample export):
   *   [ { order_number: "...", shipping_first_name: "...", products: [ ... ] } ]
   */
  public extract(json: unknown): ExtractedOrder {
    const err = new ExtractorError('woocommerce');

    // ---------------------------------------------------------------
    // Root shape
    // ---------------------------------------------------------------
    if (!Array.isArray(json)) throw err.because('Expected root JSON to be an array of orders');
    if (!json.length) throw err.because('Orders array is empty');

    // In this export format, the JSON file typically contains one order per file.
    // We take the first order and fail if it does not look like an order.
    const order = json[0] as AnyRecord;
    if (!order || typeof order !== 'object') throw err.because('First order is not an object');

    // ---------------------------------------------------------------
    // PO Number (Woo order number)
    // ---------------------------------------------------------------
     const poNumber = this.str(order['P.O.Number']).trim() || undefined;
    // if (!poNumber) throw err.because('Missing order_number');

    // ---------------------------------------------------------------
    // Shipping Method
    // ---------------------------------------------------------------
    const shippingMethod = this.str(order['shipping_method']).trim() || undefined;

    // ---------------------------------------------------------------
    // Shipping Address
    // ---------------------------------------------------------------
    const shippingAddress = this.readShippingAddress(order);
    if (!shippingAddress.length) throw err.because('Could not extract Shipping Address');

    // ---------------------------------------------------------------
    // Line Items
    // ---------------------------------------------------------------
    const products = order['products'];
    if (!Array.isArray(products)) throw err.because('Missing products[] array');

    if (!products.length) throw err.because('products[] is empty');

    const orderItems: ExtractedOrderItem[] = products.map((p: AnyRecord, idx: number) => {
      const sku = this.str(p?.['sku']).trim();
      if (!sku) throw err.because(`Missing products[${idx}].sku`);

      const desc = this.str(p?.['name']).trim();
      if (!desc) throw err.because(`Missing products[${idx}].name for sku "${sku}"`);

      const qtyNum = this.toNumber(p?.['qty_minus_refund'], NaN);
      if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
        throw err.because(`Missing/invalid qty_minus_refund for sku "${sku}"`);
      }

      const eachNum = this.toNumber(p?.['item_price'], NaN);
      if (!Number.isFinite(eachNum)) throw err.because(`Missing/invalid item_price for sku "${sku}"`);

      const lineTotalNum = qtyNum * eachNum;

      return {
        item: sku,
        qty: this.formatQty(qtyNum),
        each: this.formatMoney(eachNum),
        total: this.formatMoney(lineTotalNum),
        description: desc,
        additionalDetails: undefined,
      };
    });

    // ---------------------------------------------------------------
    // Totals (best-effort from file + computed fallback)
    // ---------------------------------------------------------------
    // Prefer explicit order_subtotal/order_total when present, otherwise compute.
    const subtotalNumFromFile = this.toNumber(order['order_subtotal'], NaN);
    const computedSubtotalNum = orderItems.reduce(
      (sum, it) => sum + this.toNumber(it.total, 0),
      0
    );

    const subtotalNum = Number.isFinite(subtotalNumFromFile)
      ? subtotalNumFromFile
      : computedSubtotalNum;

    const totalNumFromFile = this.toNumber(order['order_total'], NaN);
    const totalNum = Number.isFinite(totalNumFromFile) ? totalNumFromFile : subtotalNum;

    // Optional totals (only if present)
    const discountNum = this.toNumber(order['cart_discount'], NaN);
    const taxNum = this.toNumber(order['order_total_tax'], NaN);
    const freightNum = this.toNumber(order['order_shipping'], NaN);

    return {
      poNumber,

      shippingAddress,
      shippingMethod,

      subtotal: this.formatMoney(subtotalNum),
      discount: Number.isFinite(discountNum) ? this.formatMoney(discountNum) : undefined,
      tax: Number.isFinite(taxNum) ? this.formatMoney(taxNum) : undefined,
      freight: Number.isFinite(freightNum) ? this.formatMoney(freightNum) : undefined,
      total: this.formatMoney(totalNum),

      orderItems,
    };
  }

  // -----------------------------------------------------------------
  // Mapping helpers
  // -----------------------------------------------------------------

  private readShippingAddress(order: AnyRecord): string[] {
    const first = this.str(order['shipping_first_name']).trim();
    const last = this.str(order['shipping_last_name']).trim();
    const name = this.joinNonEmpty([first, last], ' ').trim();

    const line1 = this.str(order['shipping_address']).trim();

    const city = this.str(order['shipping_city']).trim();
    const state = this.str(order['shipping_state']).trim();
    const zip = this.str(order['shipping_postcode']).trim();

    const line2 = this.joinNonEmpty(
      [
        city,
        this.joinNonEmpty([state, zip], ' ').trim(),
      ],
      ', '
    ).trim();

    const country = this.str(order['shipping_country']).trim();

    // Typical format:
    //  [ "Jeffrey Barr", "4900 Lake Rd", "Franklin, VT 05457", "US" ]
    return [name, line1, line2, country]
      .map((s) => (s || '').trim())
      .filter(Boolean);
  }

  // -----------------------------------------------------------------
  // Value helpers (same spirit as your XML extractor)
  // -----------------------------------------------------------------

  private str(v: unknown): string {
    return (v ?? '').toString();
  }

  private toNumber(raw: unknown, fallback: number): number {
    if (raw === null || raw === undefined) return fallback;

    // Handles numbers and numeric strings safely.
    const s = String(raw).trim();
    if (!s) return fallback;

    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  }

  private formatMoney(n: number): string {
    // Keep totals predictable for downstream services/UI.
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  private formatQty(n: number): string {
    // qty is optional string in the model; avoid "1.0" noise when possible.
    if (Number.isInteger(n)) return String(n);
    return String(n);
  }

  private joinNonEmpty(parts: Array<string>, sep: string = ' '): string {
    return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(sep).trim();
  }
}
