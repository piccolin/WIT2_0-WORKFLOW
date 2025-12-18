/**
 * @Filename:    tsg-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2025-12-18
 *
 * @Description:
 *   Vendor-specific extraction rules for TSG PDFs.
 *
 *   Layman explanation:
 *   A PDF is not a “real table” or “real form”.
 *   It’s just text placed on a page at x/y positions.
 *
 *   Our PdfTextBehaviorialModel gives us human-friendly helpers like:
 *   - first("Ship To") -> find the label location
 *   - getBelow(label, 4, 2) -> read lines underneath the label
 *   - getRight(label, 1, 3) -> read tokens to the right
 *   - getTable(label, table) -> build table rows from a header label
 *
 *   Coder’s note:
 *   These rules are intentionally strict.
 *   If TSG changes their layout, we WANT extraction to fail loudly so we can fix it.
 */

import { Injectable } from '@angular/core';

import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import {ConfirmationOrder} from "@scr/API";
import {ExtractorError} from "@app/app-transformer/services/extractors/vendors/tsg/tsg-extractor.error";


export interface TsgConfirmationItemModel {
  item?: string | null;
  qty?: string | null;
  description?: string | null;
  each?: number | null;
  total?: number | null;
  additional_details?: string | null;
  backorder?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TsgPdfExtractorService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  public extract(pdf: PdfTextBehaviorialModel): Partial<ConfirmationOrder> {
    const err = new ExtractorError('tsg');

    // ---------------------------------------------------------------
    // Shipping Address
    // ---------------------------------------------------------------

    const stLabel = pdf.first('Ship To');
    if (!stLabel) throw err.because('Could not find Ship To Label');

    const shipping_address = pdf.getBelow(stLabel, 4, 2);
    if (shipping_address.length !== 4) throw err.because('Ship To Address incomplete');

    // ---------------------------------------------------------------
    // Shipping Method
    // ---------------------------------------------------------------

    const shipViaLabel = pdf.first('Shipping Method', 'Shipment Method');
    if (!shipViaLabel) throw err.because('Could not find Ship Via Label');

    const [shipping_method] = pdf.getBelow(shipViaLabel, 1, 2);
    if (!shipping_method) throw err.because('Could not find Ship Via');

    // ---------------------------------------------------------------
    // Freight
    // ---------------------------------------------------------------

    const freightLabel = pdf.first('Shipping Cost');
    let freight = '';
    if (freightLabel) {
      freight = pdf.getRight(freightLabel, 1, 1)[0] || '';
    }

    // ---------------------------------------------------------------
    // Subtotal / Total
    // ---------------------------------------------------------------

    const subtotalLabel = pdf.first('Subtotal');
    if (!subtotalLabel) throw err.because('Could not find Order Subtotal Label');

    const [subtotal] = pdf.getRight(subtotalLabel, 1, 3);
    if (!subtotal) throw err.because('Could not find Order Subtotal');

    const totalLabel = pdf.first('Total');
    if (!totalLabel) throw err.because('Could not find Order Total Label');

    const [total] = pdf.getRight(totalLabel, 1, 3);
    if (!total) throw err.because('Could not find Order Total');

    // ---------------------------------------------------------------
    // PO Number
    // ---------------------------------------------------------------

    const poNumberLabel = pdf.first('P.O. Number');
    if (!poNumberLabel) throw err.because('Could not find PO Number Label');

    const [po_number] = pdf.getBelow(poNumberLabel, 1, 2);
    if (!po_number) throw err.because('Could not find PO Number');

    // ---------------------------------------------------------------
    // Line Items Table
    // ---------------------------------------------------------------

    const tblStartLabels = pdf.all('B/O ETA');

    /**
     * Layman explanation:
     * We create a "table container" and keep appending rows into it.
     * Some PDFs repeat the same table header on multiple pages, so we gather ALL header hits.
     *
     * Coder’s note:
     * columnNamer is a *normalization hook* so vendor weird headers map to stable names.
     */
    const table = new PdfTable({
      columnNamer: (col: string) => {
        switch (col) {
          case '...':
            return 'Qty';
          case 'Unit $':
            return 'Each';
          case 'B/O ETA':
          case 'B/O ETA 1':
            return 'BO';
          default:
            return col;
        }
      },
    });

    for (const label of tblStartLabels) {
      pdf.getTable(label, table);
    }

    /**
     * IMPORTANT:
     * PdfTable rows are dictionary-like objects. Using row['ColName'] avoids TS typing issues.
     */
    const items: TsgConfirmationItemModel[] = table.toArray().map((row: Record<string, string>) => ({
      item: row['Item'] ?? null,
      qty: row['Qty'] ?? null,
      description: row['Description'] ?? null,
      each: this.parseDollars(row['Each'] ?? ''),
      total: this.parseDollars(row['Amount'] ?? ''),
      additional_details: row['Remark'] ?? null,
      backorder: row['BO'] ?? null,
    }));

    // ---------------------------------------------------------------
    // Output
    // ---------------------------------------------------------------

    /**
     * Coder’s note:
     * This maps the extractor output into Partial<ConfirmationOrder>.
     * If your ConfirmationOrder fields differ (e.g., `lineItems` instead of `items`),
     * change the mapping here only.
     */
    return {
      po_number: (po_number ?? '').trim() || null,
      shipping_method: (shipping_method ?? '').trim() || null,
      shipping_address: shipping_address,

      freight: this.parseDollars(freight),
      subtotal: this.parseDollars(subtotal),
      total: this.parseDollars(total),

      items: items as any,
    } as Partial<ConfirmationOrder>;
  }

  // -----------------------------------------------------------------
  // Money parsing (lightweight)
  // -----------------------------------------------------------------

  /**
   * Convert "$1,234.56" (or "1,234.56") into a number.
   *
   * Layman explanation:
   * PDFs often include dollar signs and commas. We strip those out safely.
   *
   * Coder’s note:
   * If you want money parsing as a pipeline normalizer later, move this into a normalizer service.
   */
  private parseDollars(input: string): number | null {
    const raw = (input ?? '').toString().trim();
    if (!raw) return null;

    // Handle parentheses as negative amounts: "(12.34)" => -12.34
    const isNegative = raw.startsWith('(') && raw.endsWith(')');

    const cleaned = raw
      .replace(/\$/g, '')
      .replace(/,/g, '')
      .replace(/[()]/g, '')
      .trim();

    const value = Number.parseFloat(cleaned);
    if (Number.isNaN(value)) return null;

    return isNegative ? -value : value;
  }
}
