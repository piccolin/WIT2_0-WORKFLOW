/**
 * @Filename:    hornings-map-to-model.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 *
 * @Description:
 *   Maps the processed Hornings object into our canonical DB schema as a Partial<...>.
 */

import { Injectable } from '@angular/core';
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";
import {SalesOrderMapResult, Vendors} from "@app/app-transformer/models/transform.models";
import {MapperBaseService} from "@app/app-transformer/services/mappers/mapper-base.service";

@Injectable({
  providedIn: 'root'
})
export class HorningsMapToModelService extends MapperBaseService {

  public override mapToModel(input: ExtractedOrder, vendor: Vendors): SalesOrderMapResult{
    //map to Partial<SalesOrder>
    return this.buildSalesOrderAndItems(input, vendor);
  }
}
