/**
 * @Filename:    parser-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendor-specific parsers.
 */

import { CanonicalizationRequest } from '../../models/canonicalization.models';

export abstract class ParserBaseService {
  public abstract parse(request: CanonicalizationRequest): Promise<unknown>;
}
