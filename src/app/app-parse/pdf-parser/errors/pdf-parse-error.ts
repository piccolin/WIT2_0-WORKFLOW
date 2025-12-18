/**
 * @Filename:    pdf-parse-error.ts
 * @Type:        Error
 * @Date:        2025-12-17
 *
 * @Description:
 *   A small, consistent error type for anything that goes wrong while parsing a PDF.
 *
 *   When something fails, we want a "nice" error object that tells us:
 *   - what went wrong (code)
 *   - a human-friendly message (message)
 *   - optional technical details (cause)
 */

export type PdfParseErrorCode =
  | 'NO_FILE'
  | 'LOAD_FAILED'
  | 'WORKER_NOT_CONFIGURED'
  | 'PAGE_READ_FAILED'
  | 'TEXT_EXTRACT_FAILED';

export class PdfParseError extends Error {
  public readonly code: PdfParseErrorCode;
  public override readonly cause?: unknown;

  constructor(code: PdfParseErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'PdfParseError';
    this.code = code;
    this.cause = cause;
  }
}
