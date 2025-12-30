/**
 * @Filename:    cubitac-default-value.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Applies missing-value defaults for Cuibtac inputs without overwriting real values.
 */

import { Injectable } from '@angular/core';
import { DefaulterBaseService } from '../defaulter-base.service';
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";

@Injectable({
  providedIn: 'root'
})
export class CubitacDefaultValueService extends DefaulterBaseService {

  public override applyDefaults(input: ExtractedOrder): ExtractedOrder {
    // TODO: set defaults only when fields are missing (null/undefined/empty).
    return input;
  }

}
