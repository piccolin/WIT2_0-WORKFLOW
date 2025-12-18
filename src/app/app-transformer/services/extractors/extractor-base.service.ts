/**
 * @Filename:    extractor-base.service.ts
 * @Type:        Base Class
 * @Date:        2025-12-17
 *
 * @Description:
 *   Base contract for all vendors extractors.
 */

export abstract class ExtractorBaseService {
  public abstract parse(request: any): Promise<unknown>;
}
