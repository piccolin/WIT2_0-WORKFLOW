import {Injectable} from '@angular/core';
import {TransformationRequest} from '../../../models/transform.models';

import {TsgParseService} from '@app/app-transformer/services/parsers/vendors/tsg-parse.service';
import {TsgNormalizeService} from '@app/app-transformer/services/normalizers/vendors/tsg-normalize.service';
import {TsgDefaultValueService} from '@app/app-transformer/services/defaulters/vendors/tsg-default-value.service';
import {TsgCalculateService} from '@app/app-transformer/services/calculators/vendors/tsg-calculate.service';
import {TsgDecorateService} from '@app/app-transformer/services/decorators/vendors/tsg-decorate.service';
import {TsgMapToModelService} from '@app/app-transformer/services/mappers/vendors/tsg-map-to-model.service';
import {IntegrationPayloadGraphqlService} from "@app/app-data/services/stores/graphql/integration-payload-graphql.service";
import {IntegrationPayload, PayLoadType} from "@scr/API";
import {PdfTextModelJsonUtilService} from "@app/app-parse/pdf-parser/utils/pdf-text-model-to-json.util";
import {PdfPageText} from "@app/app-parse/pdf-parser/models/pdf-page-text.model";
import {TsgPdfExtractorService} from "@app/app-transformer/services/extractors/vendors/tsg/tsg-pdf-extractor";
import {PdfTextBehaviorialModel} from "@app/app-parse/pdf-parser/models/pdf-text-behaviorial.model";

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
   * NOTE: Using `any` for now so the handoff compiles while implementation is completed.
   */
  public async transform(request: TransformationRequest): Promise<any> {

    // 1) Parse vendor file into a predictable intermediate structure
    const parsedPdf = await this.parseService.parse(request);
    console.log("parsedPdf: \n%o", parsedPdf);

    // 2) Save payload as JSON
    // @ts-ignore
    const pdfTextModelAsJSON = this.pdfTextModelJsonUtilService.pagesToJson(parsedPdf['pages'] as Array<PdfPageText>)
    console.log("pdfTextModelAsJSOObj:\n%o", JSON.stringify(pdfTextModelAsJSON, null, 2))

    // 3) Save JSON payload to DB
    // let input: Partial <IntegrationPayload> = {
    //   payload: pdfTextModelAsJSON.toString(),
    //   type:    PayLoadType.CONFRINATION
    // }
    // this.integrationPayloadGraphqlService.createIntegrationPayload(input)

    // 4) Extract to temporary model
    const extracted =  this.tsgPdfExtractorService.extract(parsedPdf as PdfTextBehaviorialModel);
    console.log(extracted)

    // 4) Normalize values (dates, IDs, casing, number formats, etc.)
    const normalized = this.normalizeService.normalize(extracted, request);

    // 5) Apply defaults for required fields not present in vendor file
    const withDefaults = this.defaultValueService.applyDefaults(normalized, request);

    // 6) Calculate derived fields
    const calculated = this.calculateService.calculate(withDefaults, request);

    // 7) Decorate/enrich
    const decorated = this.decorateService.decorate(calculated, request);

    // 8) Map to canonical DB schema (Partial<SalesOrder>)
    return this.mapToModelService.mapToModel(decorated, request);

    // 9) write to DB
  }

  // -----------------------------------------------------------------
  // UI Listeners
  // -----------------------------------------------------------------
  // Reserved (not used for services)
}
