/**
 * @Filename:    mapper-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors mappers.
 */

import { TransformationRequest } from '../../models/transform.models';

export abstract class MapperBaseService {
  public abstract mapToModel(input: unknown, request: TransformationRequest): unknown;
}
