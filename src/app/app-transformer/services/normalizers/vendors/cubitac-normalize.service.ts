/**
 * @Filename:    cubitac-normalize.service.ts
 * @Type:        Service
 * @Date:        2025-12-29
 *
 * @Description:
 *   TSG normalizer.
 *   Uses the shared base normalization rules. Add Cubitac-only rules here if needed later.
 */

import { Injectable } from '@angular/core';
import { NormalizerBaseService } from '../normalizer-base.service';

@Injectable({ providedIn: 'root' })
export class CubitacNormalizeService extends NormalizerBaseService {
  // No override needed right now — base normalize() handles standard cleanup.
}

