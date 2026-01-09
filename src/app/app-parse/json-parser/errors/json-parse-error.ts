/**
 * @Filename:    json-parse-error.ts
 * @Type:        Error
 * @Date:        2026-01-09
 *
 * @Description:
 *   A small, consistent error type for anything that goes wrong while parsing a JSON file/string.
 *
 *   When something fails, we want a "nice" error object that tells us:
 *   - what went wrong (code)
 *   - a human-friendly message (message)
 *   - optional technical details (cause)
 */

export type JsonParseErrorCode =
  | 'NO_FILE'
  | 'READ_FAILED'
  | 'EMPTY_FILE'
  | 'CLEAN_FAILED'
  | 'PARSE_FAILED';

export class JsonParseError extends Error {
  public readonly code: JsonParseErrorCode;
  public override readonly cause?: unknown;

  constructor(code: JsonParseErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'JsonParseError';
    this.code = code;
    this.cause = cause;
  }
}
