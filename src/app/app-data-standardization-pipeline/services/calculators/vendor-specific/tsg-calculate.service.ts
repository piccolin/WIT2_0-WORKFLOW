/**
 * @Filename:    tsg-calculate.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Computes derived values for TSG (totals, rollups, etc.).
 */

import { Injectable } from '@angular/core';
import { CalculatorBaseService } from '../calculator-base.service';
import { CanonicalizationRequest } from '../../../models/canonicalization.models';

@Injectable({
  providedIn: 'root'
})
export class TsgCalculateService extends CalculatorBaseService {

  public override calculate(input: unknown, request: CanonicalizationRequest): unknown {
    // TODO: compute totals/subtotals/etc.
    return input;
  }

}
