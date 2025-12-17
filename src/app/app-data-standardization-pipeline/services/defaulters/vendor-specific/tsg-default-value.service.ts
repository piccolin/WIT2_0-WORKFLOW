/**
 * @Filename:    tsg-default-value.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Applies missing-value defaults for TSG inputs without overwriting real values.
 */

import { Injectable } from '@angular/core';
import { DefaulterBaseService } from '../defaulter-base.service';
import { CanonicalizationRequest } from '../../../models/canonicalization.models';

@Injectable({
  providedIn: 'root'
})
export class TsgDefaultValueService extends DefaulterBaseService {

  public override applyDefaults(input: unknown, request: CanonicalizationRequest): unknown {
    // TODO: set defaults only when fields are missing (null/undefined/empty).
    return input;
  }

}
