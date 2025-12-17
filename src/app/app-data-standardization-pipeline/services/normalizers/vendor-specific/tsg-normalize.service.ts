/**
 * @Filename:    tsg-normalize.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Normalizes parsed TSG data into a consistent shape for downstream steps.
 */

import { Injectable } from '@angular/core';
import { NormalizerBaseService } from '../normalizer-base.service';
import { CanonicalizationRequest } from '../../../models/canonicalization.models';

@Injectable({
  providedIn: 'root'
})
export class TsgNormalizeService extends NormalizerBaseService {

  public override normalize(input: unknown, request: CanonicalizationRequest): unknown {
    // TODO: trim strings, standardize dates, standardize currency, etc.
    return input;
  }

}
