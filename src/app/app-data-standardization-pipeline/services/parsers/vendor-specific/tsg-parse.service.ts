/**
 * @Filename:    tsg-parse.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Parses a TSG file into a structured object.
 */

import { Injectable } from '@angular/core';
import { ParserBaseService } from '../parser-base.service';
import { CanonicalizationRequest } from '../../../models/canonicalization.models';

@Injectable({
  providedIn: 'root'
})
export class TsgParseService extends ParserBaseService {

  public override async parse(request: CanonicalizationRequest): Promise<unknown> {
    // TODO: Parse based on request.orderType and known TSG file type.
    return Promise.resolve({});
  }

}
