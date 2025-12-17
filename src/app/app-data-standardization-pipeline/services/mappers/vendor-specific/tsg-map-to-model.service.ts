/**
 * @Filename:    tsg-map-to-model.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Maps the processed TSG object into our canonical DB schema as a Partial<...>.
 */

import { Injectable } from '@angular/core';
import { MapperBaseService } from '../mapper-base.service';
import { CanonicalizationRequest } from '../../../models/canonicalization.models';

@Injectable({
  providedIn: 'root'
})
export class TsgMapToModelService extends MapperBaseService {

  public override mapToModel(input: unknown, request: CanonicalizationRequest): unknown {
    // TODO: map to Partial<SalesOrder | PurchaseOrder | ConfirmationOrder> based on request.orderType.
    return input;
  }

}
