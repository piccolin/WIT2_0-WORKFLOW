/**
 * @Filename:    woocommerce-parse.service.ts
 * @Type:        Service
 * @Date:        2026-01-09
 *
 * @Description:
 *   Vendor-specific PARSER stage for WooCommerce JSON exports.
 *
 *   Layman explanation:
 *   - The user uploads a JSON file (WooCommerce order export).
 *   - We read it as text.
 *   - We parse it into a real JS object using JsonFileParserService (JSON.parse + DOMParser fallback).
 *   - Then the WooCommerce extractor applies vendor-specific mapping rules.
 *
 *   Coder’s note:
 *   This service is intentionally thin. All “WooCommerce rules” live in the extractor,
 *   so they’re easy to unit test and easy to evolve without touching Angular wiring.
 */

import { Injectable } from '@angular/core';

import { ParserBaseService } from '../parser-base.service';
import { TransformationRequest } from '../../../models/transform.models';

import { JsonFileParserService } from '@app/app-parse/json-parser/services/json-file-parser.service';
import { JsonParseError } from '@app/app-parse/json-parser/errors/json-parse-error';

@Injectable({ providedIn: 'root' })
export class WoocommerceParseService extends ParserBaseService {
  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------

  constructor(private readonly jsonParser: JsonFileParserService) {
    super();
  }

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Parse a user-uploaded JSON file into a structured JS object.
   *
   * IMPORTANT:
   * Your TransformationRequest must contain the uploaded File somewhere.
   * This method supports a few common shapes, so you don’t have to refactor everything at once.
   */
  public override async parse(request: TransformationRequest): Promise<unknown> {
    const file = this.getFileFromRequest(request);
    const jsonText: string = await this.readFileAsText(file);

    // JsonFileParserService handles:
    // - empty checks
    // - JSON.parse()
    // - DOMParser decode fallback for HTML-escaped JSON
    return this.jsonParser.parse(jsonText);
  }

  // -----------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(String(reader.result || ''));

      reader.readAsText(file, 'utf-8');
    });
  }

  /**
   * Try to locate the uploaded JSON File from a request.
   *
   * explanation:
   * Different apps store uploads in different request shapes.
   * We check a few likely places to keep integration painless.
   */
  private getFileFromRequest(request: TransformationRequest): File {
    // NOTE: We use "as any" because TransformationRequest varies by app.
    const anyReq = request as any;

    const candidate: unknown =
      anyReq?.file ??
      anyReq?.jsonFile ??
      anyReq?.payload?.file ??
      anyReq?.payload?.jsonFile ??
      anyReq?.input?.file ??
      anyReq?.input?.jsonFile;

    if (!(candidate instanceof File)) {
      throw new JsonParseError(
        'NO_FILE',
        'WooCommerce parser expected an uploaded JSON File on the request (e.g., request.file or request.payload.file).'
      );
    }

    return candidate;
  }
}
