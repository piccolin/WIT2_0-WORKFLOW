/**
 * @Filename:    calculator-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendor-specific calculators.
 */

import { CanonicalizationRequest } from '../../models/canonicalization.models';

export abstract class CalculatorBaseService {
  public abstract calculate(input: unknown, request: CanonicalizationRequest): unknown;
}
