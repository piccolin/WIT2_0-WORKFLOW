/**
 * @Filename:    extract.models.ts
 * @Type:        Model
 * @Date:        2025-12-29
 *
 * @Description:
 *   Data models for extracted sales-order results.
 *   These interfaces define the structure returned by the extractor and consumed by the UI/services.
 */


// -----------------------------------------------------------------
// Models
// -----------------------------------------------------------------
export interface ExtractedOrderItem {
  item: string;
  qty?: string;
  each: string;
  total: string;
  description: string;
  backorder?: string;
  additionalDetails?: string;
}

export interface ExtractedOrder {
  poNumber?: string;
  shippingAddress: string[];
  shippingMethod?: string;
  shippingMethods?: Array<Record<string, string>>;

  subtotal: string;
  tax?: string;
  freight?: string;
  discount?: string;
  total: string;
  totals?: Array<Record<string, string>>;

  orderItems: ExtractedOrderItem[];

  style?: string;
  color?: string;
}

