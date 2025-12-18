/**
 * @Filename:    normalizer-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors normalizers.
 */

import { TransformationRequest } from '../../models/transform.models';

export abstract class NormalizerBaseService {
  public abstract normalize(input: unknown, request: TransformationRequest): unknown;
}
