/**
 * @Filename:    pdf-text-normalize.util.ts
 * @Type:        Utility
 * @Date:        2025-12-17
 *
 * @Description:
 *   Normalizes text so searching is more reliable.
 *   Example: "Ship   To" becomes "Ship To".
 */

/** CODER's NOTE:
 *
 * There are really two different “normalizations” going on:
 *
 * Parser-normalization (mechanical)
 * Stuff like trimming, collapsing whitespace, making label search stable ("Ship To" → "Ship To").
 * This is part of parsing, because it affects how we locate text on the page.
 *
 * Business-normalization (semantic)
 * Stuff like vendor field cleanup, currency formatting, SKU rules, canonical mappings, etc.
 * This belongs in your pipeline normalizers.
 *
 */
export function normalizePdfText(value: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}
