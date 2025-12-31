/**
 * @Filename:    hornings-default-value.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Applies missing-value defaults for Hornings inputs without overwriting real values.
 */

import { Injectable } from '@angular/core';
import { DefaulterBaseService } from '../defaulter-base.service';
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";

@Injectable({
  providedIn: 'root'
})
export class HorningsDefaultValueService extends DefaulterBaseService {

  public override applyDefaults(input: ExtractedOrder): ExtractedOrder {
    // TODO: set defaults only when fields are missing (null/undefined/empty).
    return input;
  }

}
