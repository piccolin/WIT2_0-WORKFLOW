/**
 * @Filename:    xml-file-parser.service.ts
 * @Type:        Service
 * @Date:        2026-01-02
 *
 * @Description:
 *   Standalone HTML file parser.
 *    - Reads a File into raw HTML text
 *    - Removes HTML comments
 *    - Strips specific tags (script/meta/link/noscript/style)
 *    - Collapses whitespace + removes empty lines
 *    - Returns a parsed DocumentFragment (template.content)
 *
 *   Throws HtmlParseError with a consistent code/message/cause contract.
 */

import { Inject, Injectable } from '@angular/core';
import {XmlParseError, XmlParseErrorCode} from '../errors/xml-parse-error';


// -----------------------------------------------------------------
// Service
// -----------------------------------------------------------------
@Injectable({
  providedIn: 'root',
})
export class XmlFileParserService {

  public parse(xml: string): XMLDocument {
    if (!xml || !xml.trim()) {
      throw new Error('XML is empty.');
    }

    const doc: XMLDocument = new DOMParser().parseFromString(xml, 'application/xml');

    // Most browsers expose parse errors via <parser error>
    const errors: HTMLCollectionOf<Element> = doc.getElementsByTagName('parsererror');
    if (errors && errors.length > 0) {
      const msg: string = (errors[0].textContent || '').trim() || 'Unknown XML parse error.';
      throw new XmlParseError('PARSE_FAILED', msg, "failed to read");
    }

    return doc;
  }
}
