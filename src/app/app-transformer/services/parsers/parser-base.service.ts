/**
 * @Filename:    parser-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors parsers.
 */

import { TransformationRequest } from '../../models/transform.models';

export abstract class ParserBaseService {
  public abstract parse(request: TransformationRequest): Promise<unknown>;
}
