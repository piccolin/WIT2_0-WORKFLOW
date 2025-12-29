/**
 * @Filename:    mapper-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-29
 *
 * @Description:
 *   Shared mapping logic that converts a normalized ExtractedOrder into:
 *   - SalesOrder (the header / parent record)
 *   - SalesOrderItems[] (the line items / child records)
 *
 *   Explanation:
 *   Extractors, normalizers,...etc. produce an ExtractedOrder because every vendor PDF is different.
 *   The rest of the system works best with a single canonical (destination model) in this case
 *   (SalesOrder & SalesOrderItems).
 *
 *   This base class provides consistent mapping helpers so each vendor mapper stays small.
 *
 */

import { ExtractedOrder, ExtractedOrderItem } from '@app/app-transformer/services/extractors/models/extract.model';
import { SalesOrder, SalesOrderItems } from '@scr/API';
import {SalesOrderMapResult, Vendors} from '@app/app-transformer/models/transform.models';

export abstract class MapperBaseService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Vendor mappers must implement this and return BOTH:
   * - salesOrder (header)
   * - salesOrderItems (lines)
   */
  public abstract mapToModel(input: ExtractedOrder, vendor: Vendors): SalesOrderMapResult;

  // -----------------------------------------------------------------
  // Shared mapping helpers for implementations
  // -----------------------------------------------------------------

  /**
   * Builds the SalesOrder (header) using common ExtractedOrder fields.
   * Vendor mappers usually call this and then add any extra fields they know.
   */
  protected buildBaseSalesOrder(input: ExtractedOrder, vendor: Vendors): SalesOrder {
    const purchaseOrderId = this.requiredString(input.poNumber);

    return {
      // Required fields
      id: this.createId(),
      name: this.requiredString(this.getCustomerName(input)),
      email: this.requiredString(this.getCustomerEmail(input)),
      PurchaseOrderId: purchaseOrderId,

      // Vendor
      vendor: String(vendor),

      // Shipping method (free-text)
      shippingMethod: this.cleanOptionalString(input.shippingMethod),

      // Amounts (strings -> numbers)
      subtotal: this.parseFloatSafe(input.subtotal),
      taxAmount: this.parseFloatSafe(input.tax),
      shippingAmount: this.parseFloatSafe(input.freight),
      discountAmount: this.parseFloatSafe(input.discount),
      totalAmount: this.parseFloatSafe(input.total),

      // Optional style/color convenience (if available on ExtractedOrder)
      doorStyles: this.getDoorStyles(input),

      // Store raw extracted values for troubleshooting and future enrichment
      metadata: this.buildMetadata(input, vendor, purchaseOrderId),
    } as any as SalesOrder;
  }

  /**
   * Builds SalesOrderItems[] from ExtractedOrder.orderItems.
   * Many flows persist SalesOrder first, then persist items separately.
   */
  protected buildSalesOrderItems(input: ExtractedOrder): SalesOrderItems[] {
    const purchaseOrderId = this.requiredString(input.poNumber);

    const items = Array.isArray(input.orderItems) ? input.orderItems : [];
    return items
      .map((it) => this.mapItem(it, purchaseOrderId))
      .filter((it) => {
        const hasIdentity = !!(it.itemFullName || it.description);
        const hasNumbers = (it.quantity ?? 0) !== 0 || (it.total ?? 0) !== 0;
        return hasIdentity || hasNumbers;
      });
  }

  /**
   * Convenience helper to return the expected { salesOrder, salesOrderItems } shape.
   * Vendor mappers can call this and optionally tweak fields before returning.
   */
  protected buildSalesOrderAndItems(input: ExtractedOrder, vendor: Vendors): SalesOrderMapResult {
    return {
      salesOrder: this.buildBaseSalesOrder(input, vendor),
      salesOrderItems: this.buildSalesOrderItems(input),
    };
  }

  // -----------------------------------------------------------------
  // Vendor hooks (optional overrides)
  // -----------------------------------------------------------------

  /**
   * If customer data is not available at this stage,
   * return an empty string and let downstream steps fill it in.
   */
  protected getCustomerName(_input: ExtractedOrder): string {
    return '';
  }

  /**
   * If customer data is not available at this stage,
   * return an empty string and let downstream steps fill it in.
   */
  protected getCustomerEmail(_input: ExtractedOrder): string {
    return '';
  }

  /**
   * Default doorStyles mapping from extracted style/color (if present).
   * Override if your domain stores these differently.
   */
  protected getDoorStyles(input: ExtractedOrder): string | undefined {
    const style = this.cleanOptionalString((input as any).style);
    const color = this.cleanOptionalString((input as any).color);

    if (style && color) return `${style} - ${color}`;
    if (style) return style;
    if (color) return color;
    return undefined;
  }

  /**
   * Metadata is a safe place to store raw extracted values (like the full shippingAddress lines)
   * without forcing parsing into Address fields prematurely.
   */
  protected buildMetadata(input: ExtractedOrder, vendor: Vendors, purchaseOrderId: string): string {
    const payload = {
      purchaseOrderId: purchaseOrderId,
      vendor: String(vendor),

      extracted: {
        poNumber: input.poNumber,
        shippingMethod: input.shippingMethod,
        shippingAddress: Array.isArray(input.shippingAddress) ? input.shippingAddress : [],
        subtotal: input.subtotal,
        tax: input.tax,
        freight: input.freight,
        discount: input.discount,
        total: input.total,
      },

      items: (Array.isArray(input.orderItems) ? input.orderItems : []).map((it) => ({
        item: it.item,
        qty: it.qty,
        each: it.each,
        total: it.total,
        description: it.description,
        backorder: it.backorder,
        additionalDetails: it.additionalDetails,
      })),
    };

    return JSON.stringify(payload);
  }

  // -----------------------------------------------------------------
  // Item mapping
  // -----------------------------------------------------------------

  protected mapItem(input: ExtractedOrderItem, purchaseOrderId: string): SalesOrderItems {
    const qty = this.parseIntSafe(input.qty);
    const rate = this.parseFloatSafe(input.each);
    const total = this.parseFloatSafe(input.total);

    return {
      id: this.createId(),
      PurchaseOrderId: purchaseOrderId,

      itemFullName: this.cleanOptionalString(input.item),
      description: this.cleanOptionalString(input.description),

      // Reuse this field as a safe catch-all for extra line notes
      assembly: this.cleanOptionalString(input.additionalDetails),

      quantity: qty,
      rate: rate,
      total: total,

      invoiced: 0,
    } as any as SalesOrderItems;
  }

  // -----------------------------------------------------------------
  // Helpers: IDs
  // -----------------------------------------------------------------

  protected createId(): string {
    const uuid = (globalThis as any)?.crypto?.randomUUID?.();
    if (uuid) return uuid;

    const rand = Math.random().toString(16).slice(2);
    return `${Date.now()}-${rand}`;
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

  protected requiredString(value: any): string {
    return this.cleanString(value);
  }

  // -----------------------------------------------------------------
  // Helpers: Numbers
  // -----------------------------------------------------------------

  protected parseFloatSafe(value: any): number | undefined {
    const raw = this.cleanString(value);
    if (!raw) return undefined;

    const cleaned = raw
      .replace(/\$/g, '')
      .replace(/,/g, '')
      .replace(/[()]/g, '')
      .trim();

    const n = Number.parseFloat(cleaned);
    if (Number.isNaN(n)) return undefined;

    const isNegative = raw.startsWith('(') && raw.endsWith(')');
    return isNegative ? -n : n;
  }

  protected parseIntSafe(value: any): number | undefined {
    const raw = this.cleanString(value);
    if (!raw) return undefined;

    const n = Number.parseInt(raw, 10);
    if (Number.isNaN(n)) return undefined;

    return n;
  }
}

