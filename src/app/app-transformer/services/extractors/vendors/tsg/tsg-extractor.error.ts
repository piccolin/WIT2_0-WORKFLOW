/**
 * @Filename:    tsg-extractor.error.ts
 * @Type:        Error
 * @Date:        2025-12-17
 *
 * @Description:
 *   Simple vendor-scoped error helper for extraction failures.
 *
 *   Layman explanation:
 *   Instead of throwing random strings, we throw a consistent Error type
 *   that identifies which vendor failed and why.
 *
 *   TODO: send email upon error
 */

export class ExtractorError extends Error {
  constructor(private readonly vendor: string, message = 'Extractor failed') {
    super(message);
    this.name = 'ExtractorError';
  }

  /**
   * Create a new error message while preserving the vendor identity.
   *
   * Coder’s note:
   * This style keeps calling code clean:
   *   throw err.because("Could not find Ship To Label");
   */
  public because(reason: string): ExtractorError {
    return new ExtractorError(this.vendor, `[${this.vendor}] ${reason}`);
  }
}
