import { Injectable } from '@angular/core';
import { TsgCanonicalizationPipelineService } from './vendor-specific/tsg-canonicalization-pipeline.service';
import { CanonicalizationRequest, Vendors } from '../../models/canonicalization.models';

/**
 * @Filename:    canonicalization-vendor-selector-pipeline.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   Selects the correct vendor-specific canonicalization pipeline based on the request.vendor.
 *   Only TSG is wired today; other vendors can be added incrementally.
 *
 * @Data Sources:
 *   - CanonicalizationRequest.vendor
 *
 * @Services Used:
 *   - TsgCanonicalizationPipelineService:
 *     1) Handles TSG canonicalization end-to-end
 *
 * @TODOs:
 *   - Add additional vendor pipelines (Cubitac, ForeverMark, GHI, US Cabinet, Wolf, Matrix Cabinets, Hornings Supply).
 *   - Add a clearer error shape (instead of throwing generic Error) if needed by UI.
 *
 * @Notes:
 *   - This selector is intentionally thin: choose a pipeline and delegate.
 */
type VendorPipeline = {
  canonicalize(request: CanonicalizationRequest): Promise<any>;
};

@Injectable({ providedIn: 'root' })
export class CanonicalizationVendorSelectorPipelineService {

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(
    private tsgPipeline: TsgCanonicalizationPipelineService
  ) {}

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Returns the vendor-specific pipeline instance.
   */
  public getPipeline(vendor: Vendors): VendorPipeline {
    switch (vendor) {
      case Vendors.Tsg:
        return this.tsgPipeline;

      default:
        throw new Error(`No canonicalization pipeline registered for vendor: ${vendor}`);
    }
  }

  /**
   * Convenience method: select + run in one call.
   */
  public canonicalize(request: CanonicalizationRequest): Promise<any> {
    return this.getPipeline(request.vendor).canonicalize(request);
  }

  // -----------------------------------------------------------------
  // UI Listeners
  // -----------------------------------------------------------------
  // Reserved (not used for services)
}
