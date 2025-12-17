/**
 * @Filename:    tsg-decorate.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendor-specific decorators.
 */

import { CanonicalizationRequest } from '../../models/canonicalization.models';

export abstract class DecoratorBaseService {
  public abstract decorate(input: unknown, request: CanonicalizationRequest): unknown;
}
