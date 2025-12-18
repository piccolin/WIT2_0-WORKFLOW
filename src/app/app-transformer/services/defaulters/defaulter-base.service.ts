/**
 * @Filename:    defaulter-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors defaulters.
 */

import { TransformationRequest } from '../../models/transform.models';

export abstract class DefaulterBaseService {
  public abstract applyDefaults(input: unknown, request: TransformationRequest): unknown;
}
