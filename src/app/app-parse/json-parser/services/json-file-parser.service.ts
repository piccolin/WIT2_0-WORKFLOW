/**
 * @Filename:    json-file-parser.service.ts
 * @Type:        Service
 * @Date:        2026-01-09
 *
 * @Description:
 *   Standalone JSON parser.
 *    - Accepts a raw JSON string
 *    - Validates it is not empty
 *    - Parses with JSON.parse()
 *    - Fallback: uses DOMParser to decode HTML-escaped JSON, then JSON.parse() again
 *
 *   Throws JsonParseError with a consistent code/message/cause contract.
 */

import { Injectable } from '@angular/core';
import { JsonParseError } from '../errors/json-parse-error';

// -----------------------------------------------------------------
// Service
// -----------------------------------------------------------------
@Injectable({
  providedIn: 'root',
})
export class JsonFileParserService {
  /**
   * Parse a JSON string into a typed object.
   *
   * Notes:
   * - Primary path: JSON.parse()
   * - Fallback path: DOMParser decode (for HTML-escaped JSON), then JSON.parse()
   */
  public parse<T = unknown>(json: string): T {
    // -------------------------------------------------------------
    // 1) Guard: empty input
    // -------------------------------------------------------------
    if (!json || !json.trim()) {
      throw new JsonParseError('EMPTY_FILE', 'JSON is empty.');
    }

    // -------------------------------------------------------------
    // 2) Try direct JSON.parse first (normal case)
    // -------------------------------------------------------------
    try {
      return JSON.parse(json) as T;
    } catch (cause1) {
      // Continue to fallback
    }

    // -------------------------------------------------------------
    // 3) Fallback: decode HTML-escaped JSON using DOMParser
    //
    // Why:
    // - Sometimes JSON is copied from a vendor page and contains:
    //   &quot;   &amp;   &#39;   etc.
    // - DOMParser can decode these entities reliably.
    // -------------------------------------------------------------
    let decoded = '';
    try {
      const doc = new DOMParser().parseFromString(json, 'text/html');

      // Prefer body text; fallback to documentElement text if needed.
      decoded =
        (doc.body?.textContent ?? doc.documentElement?.textContent ?? '').trim();

      if (!decoded) {
        throw new Error('DOMParser produced empty text content.');
      }
    } catch (cause2) {
      throw new JsonParseError(
        'CLEAN_FAILED',
        'Failed to decode JSON text using DOMParser.',
        cause2
      );
    }

    // -------------------------------------------------------------
    // 4) Try JSON.parse again after decoding
    // -------------------------------------------------------------
    try {
      return JSON.parse(decoded) as T;
    } catch (cause3) {
      const msg =
        cause3 instanceof Error
          ? cause3.message
          : 'Unknown JSON parse error.';
      throw new JsonParseError('PARSE_FAILED', msg, cause3);
    }
  }
}
