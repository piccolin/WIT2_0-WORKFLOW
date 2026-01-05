/**
 * @Filename:    cubitac-parse.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Vendor-specific PARSER stage for US Cabinet Depot.
 *
 *   Layman explanation:
 *   - The user uploads a PDF.
 *   - We turn that PDF into searchable text coordinates (PdfParserService).
 *   - Then we apply TSG-specific "find this label, read below/right" rules (TsgPdfExtractor).
 *
 *   Coder’s note:
 *   This service is intentionally thin. All “Cubitac rules” live in CubitacPdfExtractor,
 *   so they’re easy to unit test and easy to evolve without touching Angular wiring.
 */

import { Injectable } from '@angular/core';
import { ParserBaseService } from '../parser-base.service';
import { TransformationRequest } from '../../../models/transform.models';
import { PdfParserService } from '@app/app-parse/pdf-parser/services/pdf-parser.service';
import { PdfParseError } from '@app/app-parse/pdf-parser/errors/pdf-parse-error';
import {HtmlFileParserService} from "@app/app-parse/html-parser/services/html-file-parser.service";
import {HtmlParseError} from "@app/app-parse/html-parser/errors/html-parse-error";

@Injectable({ providedIn: 'root' })
export class USCabinetDepotParseService extends ParserBaseService {

  constructor(private readonly HtmlParser: HtmlFileParserService) {
    super();
  }

  /**
   * Parse a user-uploaded PDF into a structured TSG object.
   *
   * IMPORTANT:
   * Your TransformationRequest must contain the uploaded File somewhere.
   * This method supports a few common shapes, so you don’t have to refactor everything at once.
   */
  public override async parse(request: TransformationRequest): Promise<unknown> {
    const file = this.getFileFromRequest(request);

    // Turn the PDF into a searchable model (text + coordinates).
   return await this.HtmlParser.parse(file);
  }

  // -----------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------

  /**
   * Try to locate the uploaded html File from a request.
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
      anyReq?.htmlFile ??
      anyReq?.payload?.file ??
      anyReq?.payload?.htmlFile ??
      anyReq?.input?.file ??
      anyReq?.input?.htmlFile;

    if (!(candidate instanceof File)) {
      throw new HtmlParseError(
        'NO_FILE',
        'US Cabinet Depot parser expected an uploaded HTML File on the request (e.g., request.file or request.payload.file).'
      );
    }

    return candidate;
  }
}
