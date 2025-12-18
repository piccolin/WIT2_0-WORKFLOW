/**
 * @Filename:    tsg-decorate.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors decorators.
 */

import { TransformationRequest } from '../../models/transform.models';

export abstract class DecoratorBaseService {
  public abstract decorate(input: unknown, request: TransformationRequest): unknown;
}
