/**
 * @Filename:    cubitac-pdf-extractor.service.ts
 * @Type:        Service
 * @Date:        2025-12-29
 *
 * @Description:
 *   Vendor-specific extraction rules for TSG PDFs.
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
 *   If TSG changes their layout, we WANT this to fail loudly so we notice quickly.
 */

import { Injectable } from '@angular/core';
import { PdfTextBehaviorialModel } from '@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model';
import { PdfTable } from '@app/app-parse/pdf-parser/models/pdf-table-behaviorial.model';
import { PdfGeometry } from '@app/app-parse/pdf-parser/helpers/pdf-geometry';
import { ExtractorError } from '@app/app-transformer/services/extractors/vendors/tsg/tsg-extractor.error';
import {ExtractedOrder, ExtractedOrderItem} from "@app/app-transformer/services/extractors/models/extract.model";

@Injectable({ providedIn: 'root' })
export class ProkitchenXmlExtractorService {

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * This is the main entry point.
   * Provide a PDF (already converted into searchable text),
   * and get back a clean extracted order model for the UI/services.
   */
  public extract(xml: XMLDocument): any {
    let projectDetailsParent = this.firstByTag(xml, "projectDetails")
    let result = this.childText(projectDetailsParent, "firstName")
    console.log("result:", result)
  }

  public  firstByTag(root: Document | Element, tagName: string): Element | null {
    const nodes: HTMLCollectionOf<Element> = root.getElementsByTagName(tagName);
    return nodes.length ? nodes[0] : null;
  }

  public  allByTag(root: Document | Element, tagName: string): Array<Element> {
    const nodes: HTMLCollectionOf<Element> = root.getElementsByTagName(tagName);
    const list: Array<Element> = [];

    for (let i = 0; i < nodes.length; i++) {
      list.push(nodes[i]);
    }

    return list;
  }

  public  text(el: Element | null | undefined): string {
    return (el?.textContent || '').trim();
  }

  public  childText(parent: Element | null | undefined, childTagName: string): string {
    if (!parent) return '';
    return this.text(this.firstByTag(parent, childTagName));
  }

}
