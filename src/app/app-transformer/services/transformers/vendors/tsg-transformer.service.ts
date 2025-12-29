/**
 * @Filename:    tsg-transformer.service.ts
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   TSG-specific canonicalization pipeline.
 *   Orchestrates the end-to-end flow:
 *     1) Parse vendor file content into a standard intermediate shape
 *     2) Normalize values/fields into consistent formats
 *     3) Apply defaults where the vendor file omits data we require
 *     4) Calculate derived fields (totals, rates, etc.)
 *     5) Decorate/enrich with extra metadata if needed
 *     6) Map to our canonical DB schema model (Partial<SalesOrder>)
 *
 * @Data Sources:
 *   - Vendor file upload content (CSV / PDF / JSON / XML)
 *   - TransformationRequest (vendor + order type + contextual info)
 *
 * @Services Used:
 *   - TsgParseService:
 *     1) Converts TSG file into a predictable intermediate structure
 *   - TsgNormalizeService:
 *     1) Cleans and normalizes parsed values
 *   - TsgDefaultValueService:
 *     1) Adds required defaults when values are missing
 *   - TsgCalculateService:
 *     1) Computes derived/calculated fields
 *   - TsgDecorateService:
 *     1) Adds optional enrichment / metadata
 *   - TsgMapToModelService:
 *     1) Maps the processed data to our canonical schema shape
 *
 * @TODOs:
 *   - Return type should become Promise<Partial<SalesOrder>> once the mapper is implemented.
 *   - Add consistent error handling + structured validation errors per stage.
 *   - Add logging hooks (optional) for troubleshooting vendor payloads.
 *
 * @Notes:
 *   - Keep this service orchestration-only. Business logic belongs in stage services.
 */
import {Injectable} from '@angular/core';
import {SalesOrderMapResult, TransformationRequest, Vendors} from '../../../models/transform.models';
import {TsgParseService} from '@app/app-transformer/services/parsers/vendors/tsg-parse.service';
import {TsgNormalizeService} from '@app/app-transformer/services/normalizers/vendors/tsg-normalize.service';
import {TsgDefaultValueService} from '@app/app-transformer/services/defaulters/vendors/tsg-default-value.service';
import {TsgCalculateService} from '@app/app-transformer/services/calculators/vendors/tsg-calculate.service';
import {TsgDecorateService} from '@app/app-transformer/services/decorators/vendors/tsg-decorate.service';
import {TsgMapToModelService} from '@app/app-transformer/services/mappers/vendors/tsg-map-to-model.service';
import {IntegrationPayloadGraphqlService} from "@app/app-data/services/stores/graphql/integration-payload-graphql.service";
import {PdfTextModelJsonUtilService} from "@app/app-parse/pdf-parser/utils/pdf-text-model-to-json.util";
import {TsgPdfExtractorService} from "@app/app-transformer/services/extractors/vendors/tsg/tsg-pdf-extractor.service";
import {PdfTextBehaviorialModel} from "@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model";
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";
import {SalesOrder} from "@scr/API";

@Injectable({ providedIn: 'root' })
export class TsgTransformerService {

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(
    private parseService: TsgParseService,
    private integrationPayloadGraphqlService: IntegrationPayloadGraphqlService,
    private pdfTextModelJsonUtilService:PdfTextModelJsonUtilService,
    private tsgPdfExtractorService: TsgPdfExtractorService,
    private normalizeService: TsgNormalizeService,
    private defaultValueService: TsgDefaultValueService,
    private calculateService: TsgCalculateService,
    private decorateService: TsgDecorateService,
    private mapToModelService: TsgMapToModelService
  ) {}

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /**
   * Runs the TSG canonicalization pipeline and returns a canonical partial model.
   */
  public async transform(request: TransformationRequest): Promise<void> {

    // 1) Parse vendor file into a predictable intermediate structure
    const parsedPdf = await this.parseService.parse(request);
    console.log("parsedPdf: \n%o", parsedPdf);

    // 2) Extract to temporary model
    const extractedOrder: ExtractedOrder =  this.tsgPdfExtractorService.extract(parsedPdf as PdfTextBehaviorialModel);
    console.log("extractedOrder: \n%o", extractedOrder)

    // 3) Store Input Model

    // 4) Normalize values (dates, IDs, casing, number formats, etc.)
    const normalizedExtractedOrder: ExtractedOrder  = this.normalizeService.normalize(extractedOrder);
    console.log("normalizedExtractedOrder: \n%o", normalizedExtractedOrder)

    // 5) Apply defaults for required fields not present in vendor file
    const extractedOrderWithDefaults: ExtractedOrder  = this.defaultValueService.applyDefaults(normalizedExtractedOrder);
    console.log("extractedOrderWithDefaults: \n%o", extractedOrderWithDefaults)

    // 6) Calculate derived fields
    const calculatedExtractedOrderWithDefaults: ExtractedOrder  = this.calculateService.calculate(extractedOrderWithDefaults);
    console.log("calculatedExtractedOrderWithDefaults: \n%o", calculatedExtractedOrderWithDefaults)

    // 7) Decorate/enrich
    const decoratedCalculatedExtractedOrderWithDefaults: ExtractedOrder  = this.decorateService.decorate(calculatedExtractedOrderWithDefaults);
    console.log("decoratedCalculatedExtractedOrderWithDefaults: \n%o", decoratedCalculatedExtractedOrderWithDefaults)

    // 7) Map to canonical DB schema (Partial<SalesOrder>)
    const salesOrderAndItems: SalesOrderMapResult =  <SalesOrderMapResult>this.mapToModelService.mapToModel(decoratedCalculatedExtractedOrderWithDefaults,Vendors.Tsg);
    console.log("salesOrder: \n%o", salesOrderAndItems?.salesOrder)
    console.log("salesOrderItems: \n%o", salesOrderAndItems?.salesOrderItems)

    // 8) Write to DB
  }

  // -----------------------------------------------------------------
  // UI Listeners
  // -----------------------------------------------------------------
  // Reserved (not used for services)
}
