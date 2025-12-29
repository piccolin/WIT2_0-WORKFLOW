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
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";
import {SalesOrderMapResult, Vendors} from "@app/app-transformer/models/transform.models";

@Injectable({
  providedIn: 'root'
})
export class TsgMapToModelService extends MapperBaseService {

  public override mapToModel(input: ExtractedOrder, vendor: Vendors): SalesOrderMapResult{
    //map to Partial<SalesOrder>
    return this.buildSalesOrderAndItems(input, vendor);
  }
}
