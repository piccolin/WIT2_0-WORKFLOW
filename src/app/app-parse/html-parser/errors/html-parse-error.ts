/**
 * @Filename:    html-parse-error.ts
 * @Type:        Error
 * @Date:        2026-01-02
 *
 * @Description:
 *   A small, consistent error type for anything that goes wrong while parsing an HTML file.
 *
 *   When something fails, we want a "nice" error object that tells us:
 *   - what went wrong (code)
 *   - a human-friendly message (message)
 *   - optional technical details (cause)
 */

export type HtmlParseErrorCode =
  | 'NO_FILE'
  | 'READ_FAILED'
  | 'EMPTY_FILE'
  | 'STRIP_FAILED'
  | 'CLEAN_FAILED'
  | 'PARSE_FAILED';

export class HtmlParseError extends Error {
  public readonly code: HtmlParseErrorCode;
  public override readonly cause?: unknown;

  constructor(code: HtmlParseErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'HtmlParseError';
    this.code = code;
    this.cause = cause;
  }
}
