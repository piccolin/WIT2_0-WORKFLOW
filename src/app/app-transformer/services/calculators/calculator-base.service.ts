/**
 * @Filename:    calculator-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors calculators.
 */

import { TransformationRequest } from '../../models/transform.models';

export abstract class CalculatorBaseService {
  public abstract calculate(input: unknown, request: TransformationRequest): unknown;
}
