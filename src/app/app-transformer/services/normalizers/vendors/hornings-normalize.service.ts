/**
 * @Filename:    hornings-normalize.service.ts
 * @Type:        Service
 * @Date:        2025-12-29
 *
 * @Description:
 *   TSG normalizer.
 *   Uses the shared base normalization rules. Add hornings-only rules here if needed later.
 */

import { Injectable } from '@angular/core';
import { NormalizerBaseService } from '../normalizer-base.service';

@Injectable({ providedIn: 'root' })
export class HorningsNormalizeService extends NormalizerBaseService {
  // No override needed right now — base normalize() handles standard cleanup.
}

