/**
 * @Filename:    uscd-html-extractor.service.ts
 * @Type:        Service
 * @Date:        2026-01-05
 *
 * @Description:
 *   Vendor-specific extraction rules for USCD HTML order/cart pages.
 *
 *   Explanation:
 *   The HtmlFileParserService reads the HTML file and returns a DocumentFragment.
 *   We then query the fragment for the elements we need and return the raw strings
 *   exactly as they appear (no normalization, no calculations).
 *
 *   If USCD changes their HTML layout, we WANT extraction to fail loudly so we notice quickly.
 */

import { Injectable } from '@angular/core';

import { HtmlFileParserService } from '@app/app-parse/html-parser/services/html-file-parser.service';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/uscd/uscd-extractor.error';
import { ExtractedOrder, ExtractedOrderItem } from '@app/app-transformer/services/extractors/models/extract.model';

@Injectable({ providedIn: 'root' })
export class UscdHtmlExtractorService {
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
    const err = new ExtractorError('uscd');

    // ---------------------------------------------------------------
    // Totals block
    // ---------------------------------------------------------------

    const subtotalEl = doc.querySelector('.data.table.table-totals tr.totals.sub .price');
    if (!subtotalEl) throw err.because('Could not find Subtotal Element');

    const shippingMethodEl = doc.querySelector('.data.table.table-totals tr.totals.shipping .mark .value');
    if (!shippingMethodEl) throw err.because('Could not find Shipping Method Element');

    const shippingCostEl = doc.querySelector('.data.table.table-totals tr.totals.shipping .amount .price');
    if (!shippingCostEl) throw err.because('Could not find Shipping Cost Element');

    const taxEl = doc.querySelector('.data.table.table-totals tr.totals-tax .amount .price');

    const totalEl = doc.querySelector('.data.table.table-totals tr.totals.grand .amount .price');
    if (!totalEl) throw err.because('Could not find Order Total Element');

    const subtotal = this.text(subtotalEl);
    const freight = this.text(shippingCostEl);
    const tax = taxEl ? this.text(taxEl) : undefined;
    const total = this.text(totalEl);
    const shippingMethod = this.text(shippingMethodEl) || undefined;

    if (!subtotal) throw err.because('Subtotal text was empty');
    if (!freight) throw err.because('Shipping Cost text was empty');
    if (!total) throw err.because('Total text was empty');

    // ---------------------------------------------------------------
    // Line items
    // ---------------------------------------------------------------

    const itemsEls = Array.from(doc.querySelectorAll('li.product-item'));
    if (!itemsEls.length) throw err.because('Could not find Cart Item Elements');

    const orderItems: ExtractedOrderItem[] = itemsEls.map((el) => {
      const item = this.text(el.querySelector('.product-item-name')) || 'ParseError';
      const qty = this.text(el.querySelector('.details-qty .value')) || '0';
      const lineTotal = this.text(el.querySelector('.cart-price .price')) || '0';
      const each = this.text(el.querySelector('.price-including-tax .price')) || '';

      return {
        item,
        qty,
        description: item,
        total: lineTotal,
        each: each || lineTotal, // keep something useful if "each" isn't present
      };
    });

    // ---------------------------------------------------------------
    // Shipping address
    // ---------------------------------------------------------------

    const shippingEl = doc.querySelector('.shipping-address-item');
    if (!shippingEl) throw err.because('Could not find Shipping Address Element');

    // Remove control nodes that add noise to the address block.
    shippingEl.querySelectorAll('div').forEach((e) => e.remove());

    // Convert links/spans into plain text so we can read the address as lines.
    shippingEl.querySelectorAll('a, span').forEach((e) => e.replaceWith(e.textContent ?? ''));

    const shippingAddress = this.splitLines(this.cleanHtml(shippingEl.innerHTML));
    if (!shippingAddress.length) throw err.because('Could not parse Shipping Address');

    // ---------------------------------------------------------------
    // Output (raw strings, no normalization)
    // ---------------------------------------------------------------

    return {
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
  // Helpers: Text / HTML
  // -----------------------------------------------------------------

  /**
   * Safe textContent read with whitespace collapse + trim.
   */
  private text(el: Element | null): string {
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Convert address HTML into readable text while preserving line breaks.
   * Addresses commonly use <br> tags and mixed inline elements.
   */
  private cleanHtml(html: string): string {
    return (html ?? '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p\s*>/gi, '\n')
      .replace(/<\/li\s*>/gi, '\n')
      .replace(/<\/div\s*>/gi, '\n')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+\n/g, '\n')
      .replace(/\n\s+/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  /**
   * Break a multi-line block into clean lines.
   * This is needed because addresses are not single strings; they are multiple lines.
   */
  private splitLines(text: string): string[] {
    return (text ?? '')
      .split(/\r?\n/)
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }
}
