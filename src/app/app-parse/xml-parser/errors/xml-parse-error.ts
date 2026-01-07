/**
 * @Filename:    xml-parse-error.ts
 * @Type:        Error
 * @Date:        2026-01-02
 *
 * @Description:
 *   A small, consistent error type for anything that goes wrong while parsing an XML file.
 *
 *   When something fails, we want a "nice" error object that tells us:
 *   - what went wrong (code)
 *   - a human-friendly message (message)
 *   - optional technical details (cause)
 */

export type XmlParseErrorCode =
  | 'NO_FILE'
  | 'READ_FAILED'
  | 'EMPTY_FILE'
  | 'STRIP_FAILED'
  | 'CLEAN_FAILED'
  | 'PARSE_FAILED';

export class XmlParseError extends Error {
  public readonly code: XmlParseErrorCode;
  public override readonly cause?: unknown;

  constructor(code: XmlParseErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'XmlParseError';
    this.code = code;
    this.cause = cause;
  }
}
