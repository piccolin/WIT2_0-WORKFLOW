/**
 * @Filename:    cubitac-decorate.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Adds helpful computed/diagnostic fields that are not strictly required by the DB schema,
 *   but make debugging and downstream mapping easier.
 */

import { Injectable } from '@angular/core';
import { DecoratorBaseService } from '../decorator-base.service';
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";

@Injectable({
  providedIn: 'root'
})
export class CubitacDecorateService extends DecoratorBaseService {

  public override decorate(input: ExtractedOrder): ExtractedOrder {
    // TODO: decorate with convenience fields / flags / normalized metadata.
    return input;
  }

}
