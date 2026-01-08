/**
 * @Filename:    prokitchen-xml-extractor.service.ts
 * @Type:        Service
 * @Date:        2026-01-08
 *
 * @Description:
 *   Vendor-specific extraction rules for ProKitchen XML files.
 *
 *   Explanation:
 *   XML is structured data, but vendors still vary in tag names and nesting.
 *   So we:
 *   - locate known parent blocks (projectDetails, design, customer, Items)
 *   - read values from specific child tags (contractNo, orderNo, shipmentAddress, ItemInfo...)
 *   - compute totals when the XML does not provide them (qty * price)
 *
 *   Why so strict?
 *   If ProKitchen changes their XML layout, we WANT this to fail loudly
 *   so we notice quickly and fix the mapping.
 */

import { Injectable } from '@angular/core';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/prokitchen/prokitchen-extractor.error';
import {
  ExtractedOrder,
  ExtractedOrderItem,
} from '@app/app-transformer/services/extractors/models/extract.model';

@Injectable({ providedIn: 'root' })
export class ProkitchenXmlExtractorService {
  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Main entry point.
   * Provide an XMLDocument (already parsed), and get back a clean extracted order model.
   */
  public extract(xml: XMLDocument): ExtractedOrder {
    const err = new ExtractorError('prokitchen');

    // ---------------------------------------------------------------
    // Root blocks
    // ---------------------------------------------------------------
    const projectDetails = this.firstByTag(xml, 'projectDetails');
    if (!projectDetails) throw err.because('Could not find <projectDetails> block');

    const design = this.firstByTag(projectDetails, 'design');
    if (!design) throw err.because('Could not find <design> block');

    const customer = this.firstByTag(projectDetails, 'customer');
    if (!customer) throw err.because('Could not find <customer> block');

    // Items are commonly under a different branch, so search from the whole XML doc.
    const itemsParent = this.firstByTag(xml, 'Items');
    if (!itemsParent) throw err.because('Could not find <Items> block');

    // ---------------------------------------------------------------
    // PO Number (best-effort)
    // ---------------------------------------------------------------
    // ProKitchen commonly leaves contractNo/orderNo blank depending on workflow.
    // We treat whichever is present as poNumber.
    const contractNo = this.childText(design, 'contractNo');
    const orderNo = this.childText(design, 'orderNo');

    const poNumber = (contractNo || orderNo || '').trim() || undefined;

    // ---------------------------------------------------------------
    // Shipping Address (from customer -> shipmentAddress)
    // ---------------------------------------------------------------
    // In the sample ProKitchen XML, customer.invoiceTo is often empty,
    // and customer.shipmentAddress contains the actual delivery address.
    const shipmentAddress = this.firstByTag(customer, 'shipmentAddress');
    if (!shipmentAddress) throw err.because('Could not find <customer><shipmentAddress> block');

    const shippingAddress = this.readAddressLines(shipmentAddress);
    if (!shippingAddress.length) throw err.because('Could not extract Shipping Address');

    // ---------------------------------------------------------------
    // Line Items
    // ---------------------------------------------------------------
    const itemNodes = this.allByTag(itemsParent, 'ItemInfo');
    if (!itemNodes.length) throw err.because('Could not find any <ItemInfo> items');

    const orderItems: ExtractedOrderItem[] = itemNodes.map((node, idx) => {
      const sku = this.childText(node, 'sku').trim();
      if (!sku) throw err.because(`Missing <sku> for ItemInfo at index ${idx + 1}`);

      const desc = this.childText(node, 'description').trim();
      if (!desc) throw err.because(`Missing <description> for sku "${sku}"`);

      const qtyRaw = this.childText(node, 'qty');
      const priceRaw = this.childText(node, 'price');

      const qtyNum = this.toNumber(qtyRaw, 1);
      const priceNum = this.toNumber(priceRaw, NaN);
      if (!Number.isFinite(priceNum)) throw err.because(`Missing/invalid <price> for sku "${sku}"`);

      const lineTotal = qtyNum * priceNum;

      const additionalDetails = this.joinNonEmpty([
        this.formatDims(
          this.childText(node, 'width'),
          this.childText(node, 'height'),
          this.childText(node, 'depth')
        ),
        this.formatCounts(
          this.childText(node, 'numUpperDoors'),
          this.childText(node, 'numLowerDoors'),
          this.childText(node, 'numDrawers')
        ),
      ]);

      return {
        item: sku,
        qty: this.formatQty(qtyNum),
        each: this.formatMoney(priceNum),
        total: this.formatMoney(lineTotal),
        description: desc,
        additionalDetails: additionalDetails || undefined,
      };
    });

    // ---------------------------------------------------------------
    // Totals (computed)
    // ---------------------------------------------------------------
    const subtotalNum = orderItems.reduce((sum, it) => sum + this.toNumber(it.total, 0), 0);

    // ProKitchen XML sample does not provide tax/freight/discount as top-level totals.
    // So total == subtotal unless you later add options/totals mapping.
    const totalNum = subtotalNum;

    return {
      poNumber,
      shippingAddress,
      shippingMethod: undefined,

      subtotal: this.formatMoney(subtotalNum),
      total: this.formatMoney(totalNum),

      orderItems,
    };
  }

  // -----------------------------------------------------------------
  // XML helpers (same style as your sample)
  // -----------------------------------------------------------------

  public firstByTag(root: Document | Element, tagName: string): Element | null {
    const nodes: HTMLCollectionOf<Element> = root.getElementsByTagName(tagName);
    return nodes.length ? nodes[0] : null;
  }

  public allByTag(root: Document | Element, tagName: string): Array<Element> {
    const nodes: HTMLCollectionOf<Element> = root.getElementsByTagName(tagName);
    const list: Array<Element> = [];

    for (let i = 0; i < nodes.length; i++) {
      list.push(nodes[i]);
    }

    return list;
  }

  public text(el: Element | null | undefined): string {
    return (el?.textContent || '').trim();
  }

  public childText(parent: Element | null | undefined, childTagName: string): string {
    if (!parent) return '';
    return this.text(this.firstByTag(parent, childTagName));
  }

  // -----------------------------------------------------------------
  // Mapping helpers
  // -----------------------------------------------------------------

  private readAddressLines(addressNode: Element): string[] {
    const address = this.childText(addressNode, 'address');
    const city = this.childText(addressNode, 'city');
    const state = this.childText(addressNode, 'state');
    const zip = this.childText(addressNode, 'zip');
    const country = this.childText(addressNode, 'country');

    // We return string[] because ExtractedOrder.shippingAddress is string[] in your model.
    // Typical format:
    //  [ "8 Brentwood Rd", "Raritan, New Jersey 08869", "United States" ]
    const line1 = address.trim();
    const line2 = this.joinNonEmpty([
      city,
      this.joinNonEmpty([state, zip], ' ').trim(),
    ], ', ');
    const line3 = (country || '').trim();

    return [line1, line2, line3].map((s) => (s || '').trim()).filter(Boolean);
  }

  private toNumber(raw: string | undefined | null, fallback: number): number {
    const s = (raw ?? '').toString().trim();
    if (!s) return fallback;

    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  }

  private formatMoney(n: number): string {
    // Keep totals predictable for downstream services/UI.
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  private formatQty(n: number): string {
    // qty is optional string in the model; avoid "1.0" noise when possible
    if (Number.isInteger(n)) return String(n);
    return String(n);
  }

  private joinNonEmpty(parts: Array<string>, sep: string = ' '): string {
    return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(sep).trim();
  }

  private formatDims(width: string, height: string, depth: string): string {
    const w = (width || '').trim();
    const h = (height || '').trim();
    const d = (depth || '').trim();
    if (!w && !h && !d) return '';
    return `Dims: ${this.joinNonEmpty([w && `W ${w}`, h && `H ${h}`, d && `D ${d}`], ', ')}`;
  }

  private formatCounts(upperDoors: string, lowerDoors: string, drawers: string): string {
    const u = (upperDoors || '').trim();
    const l = (lowerDoors || '').trim();
    const dr = (drawers || '').trim();
    if (!u && !l && !dr) return '';
    return `Counts: ${this.joinNonEmpty([u && `UpperDoors ${u}`, l && `LowerDoors ${l}`, dr && `Drawers ${dr}`], ', ')}`;
  }
}
