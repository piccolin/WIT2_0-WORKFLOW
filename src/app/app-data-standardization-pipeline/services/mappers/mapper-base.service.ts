/**
 * @Filename:    mapper-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendor-specific mappers.
 */

import { CanonicalizationRequest } from '../../models/canonicalization.models';

export abstract class MapperBaseService {
  public abstract mapToModel(input: unknown, request: CanonicalizationRequest): unknown;
}
