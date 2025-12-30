/**
 * @Filename:    cubitac-calculate.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Computes derived values for Cubitac (totals, rollups, etc.).
 */

import { Injectable } from '@angular/core';
import { CalculatorBaseService } from '../calculator-base.service';
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";

@Injectable({
  providedIn: 'root'
})
export class CubitacCalculateService extends CalculatorBaseService {

  public override calculate(input: ExtractedOrder): ExtractedOrder {
    // TODO: compute totals/subtotals/etc.
    return input;
  }

}
