/**
 * @Filename:    defaulter-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendor-specific defaulters.
 */

import { CanonicalizationRequest } from '../../models/canonicalization.models';

export abstract class DefaulterBaseService {
  public abstract applyDefaults(input: unknown, request: CanonicalizationRequest): unknown;
}
