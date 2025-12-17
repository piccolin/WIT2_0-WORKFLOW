/**
 * @Filename:    normalizer-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendor-specific normalizers.
 */

import { CanonicalizationRequest } from '../../models/canonicalization.models';

export abstract class NormalizerBaseService {
  public abstract normalize(input: unknown, request: CanonicalizationRequest): unknown;
}
