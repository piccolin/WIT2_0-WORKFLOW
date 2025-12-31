import { Injectable } from '@angular/core';
import { TsgTransformerService } from './vendors/tsg-transformer.service';
import { TransformationRequest, Vendors } from '../../models/transform.models';
import {CubitacPdfExtractorService} from "@app/app-transformer/services/extractors/vendors/cubitac/cubitac-pdf-extractor.service";
import {CubitacTransformerService} from "@app/app-transformer/services/transformers/vendors/cubitac-transformer.service";
import {
  HorningsTransformerService
} from "@app/app-transformer/services/transformers/vendors/hornings-transformer.service";


/**
 * @Filename:    transformer-selector.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   Selects the correct vendors canonicalization pipeline based on the request.vendor.
 *   Only TSG is wired today; other vendors can be added incrementally.
 *
 * @Data Sources:
 *   - TransformationRequest.vendor
 *
 * @Services Used:
 *   - TsgTransformerService:
 *     1) Handles TSG canonicalization end-to-end
 *
 * @TODOs:
 *   - Add additional vendor transformers (Cubitac, ForeverMark, GHI, US Cabinet, Wolf, Matrix Cabinets, Hornings Supply).
 *   - Add a clearer error shape (instead of throwing generic Error) if needed by UI.
 *
 * @Notes:
 *   - This selector is intentionally thin: choose a pipeline and delegate.
 */
type VendorTransform = {
  transform(request: TransformationRequest): Promise<any>;
};

@Injectable({ providedIn: 'root' })
export class TransformerSelectorService {

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(
    private   tsgPipeline: TsgTransformerService,
    private   cubitacPipeline: CubitacTransformerService,
    private   horningsPipeline: HorningsTransformerService
  ) {}

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Returns the vendors pipeline instance.
   */
  public getTransformer(vendor: Vendors): VendorTransform {
    switch (vendor) {
      case Vendors.Tsg:
        return this.tsgPipeline;

      case Vendors.Cubitac:
        return this.cubitacPipeline;

      case Vendors.HorningsSupply:
        return this.horningsPipeline;


      default:
        throw new Error(`No canonicalization pipeline registered for vendor: ${vendor}`);
    }
  }

  /**
   * Convenience method: select + run in one call.
   */
  public transform(request: TransformationRequest): Promise<any> {
    return this.getTransformer(request.vendor).transform(request);
  }

  // -----------------------------------------------------------------
  // UI Listeners
  // -----------------------------------------------------------------
  // Reserved (not used for services)
}
