/* ============================================================================
  FILE: base-compare.service.ts
  - Generic compare methods only (no rulesets here)
  - Returns full CompareRuleResult every time
============================================================================ */

//import { CompareRuleResult, CompareRuleSet } from '/comparator.models';

import {CompareRuleResult, CompareRuleSet} from "@wit/waverly-workflow/Comparator/Model/comparator.models";

export abstract class BaseCompareService {

  protected exactMatchString(
    itemA: string | null | undefined,
    itemB: string | null | undefined,
    ruleSet: CompareRuleSet,
    itemC?: string | null | undefined   //added for itemC
  ): CompareRuleResult {

    if (itemA == null || itemB == null || (itemC !== undefined && itemC == null)) {
      return this.failRule(ruleSet, ruleSet.missingMessage || ruleSet.failMessage, itemA, itemB, itemC);
    }

    if ((itemA === itemB) && (itemC == null || itemA === itemC))  {
      return this.passRule(ruleSet, itemA, itemB, itemC);
    }

    return this.failRule(ruleSet, ruleSet.failMessage, itemA, itemB, itemC);
  }

  protected exactMatchNumber(
    itemA: number | null | undefined,
    itemB: number | null | undefined,
    ruleSet: CompareRuleSet,
    itemC?: number | null | undefined
  ): CompareRuleResult {

    if (itemA == null || itemB == null || (itemC !== undefined && itemC == null)) {
      return this.failRule(ruleSet, ruleSet.missingMessage || ruleSet.failMessage, itemA, itemB, itemC);
    }

    if ((itemA === itemB)  && (itemC == null || itemA === itemC)) {
      return this.passRule(ruleSet, itemA, itemB, itemC);
    }

    return this.failRule(ruleSet, ruleSet.failMessage, itemA, itemB, itemC);
  }

  /**
   * Money tolerance compare (cents)
   * - centsTolerance: 1 = $0.01, 5 = $0.05
   */
  protected moneyToleranceNumber(
    itemA: number | null | undefined,
    itemB: number | null | undefined,
    centsTolerance: number,
    ruleSet: CompareRuleSet
  ): CompareRuleResult {

    if (itemA == null || itemB == null) {
      return this.failRule(ruleSet, ruleSet.missingMessage || ruleSet.failMessage, itemA, itemB);
    }

    const aCents = Math.round(itemA * 100);
    const bCents = Math.round(itemB * 100);
    const diffCents = Math.abs(aCents - bCents);

    if (diffCents <= centsTolerance) {
      return this.passRule(ruleSet, itemA, itemB);
    }

    const msg = `${ruleSet.failMessage} (delta=$${(diffCents / 100).toFixed(2)})`;
    return this.failRule(ruleSet, msg, itemA, itemB);
  }

  /**
   * Fuzzy Address compare (A vs B vs C)
   *
   * - All three values are REQUIRED
   * - Normalizes addresses into comparable fingerprints
   * - Handles abbreviations (st/street, ave/avenue, etc.)
   * - Ignores case, punctuation, and extra whitespace
   *
   * Supports:
   * - string
   * - string[]
   */
  protected fuzzyMatchString(
    itemA: string | string[] | null | undefined,
    itemB: string | string[] | null | undefined,
    itemC: string | string[] | null | undefined,
    ruleSet: CompareRuleSet
  ): CompareRuleResult {

    // -----------------------------------------------------------------
    // Missing check (ALL THREE REQUIRED)
    // -----------------------------------------------------------------
    if (itemA == null || itemB == null || itemC == null) {
      return this.failRule(
        ruleSet,
        ruleSet.missingMessage || ruleSet.failMessage,
        itemA,
        itemB,
        itemC
      );
    }

    // -----------------------------------------------------------------
    // Normalize all three
    // -----------------------------------------------------------------
    const aKey = this.addressFingerprint(itemA);
    const bKey = this.addressFingerprint(itemB);
    const cKey = this.addressFingerprint(itemC);

    // -----------------------------------------------------------------
    // Compare
    // -----------------------------------------------------------------
    if (aKey === bKey && aKey === cKey) {
      return this.passRule(ruleSet, itemA, itemB, itemC);
    }

    // -----------------------------------------------------------------
    // Fail with diagnostic clarity
    // -----------------------------------------------------------------
    const mismatches: string[] = [];
    if (aKey !== bKey) mismatches.push('A != B');
    if (aKey !== cKey) mismatches.push('A != C');

    const msg = `${ruleSet.failMessage} (${mismatches.join(', ')})`;

    return this.failRule(
      ruleSet,
      msg,
      { raw: itemA, normalized: aKey },
      { raw: itemB, normalized: bKey },
      { raw: itemC, normalized: cKey }
    );
  }


  /**
   * Normalize address text for fuzzy comparison.
   * Handles:
   * - case insensitivity
   * - punctuation removal
   * - whitespace collapse
   * - common street/unit abbreviations
   * - ordinal normalizations (optional basic)
   */

  private addressFingerprint(addr: string | string[]): string {
    const text = Array.isArray(addr) ? addr.join(' ') : addr;
    return this.normalizeAddressText(text);
  }

  private normalizeAddressText(input: string): string {
    if (!input) return '';

    let s = input.toLowerCase();

    s = s.replace(/&/g, ' and ');
    s = s.replace(/#/g, ' apt ');
    s = s.replace(/[^a-z0-9\s]/g, ' ');

    // Directions
    s = s.replace(/\b(n)\b/g, ' north ');
    s = s.replace(/\b(s)\b/g, ' south ');
    s = s.replace(/\b(e)\b/g, ' east ');
    s = s.replace(/\b(w)\b/g, ' west ');

    // Units
    s = s.replace(/\b(apartment|apt)\b/g, ' apt ');
    s = s.replace(/\b(suite|ste)\b/g, ' ste ');
    s = s.replace(/\b(unit)\b/g, ' unit ');

    // Street types
    const streetMap: Array<[RegExp, string]> = [
      [/\b(st|st\.)\b/g, ' street '],
      [/\b(rd|rd\.)\b/g, ' road '],
      [/\b(ave|ave\.)\b/g, ' avenue '],
      [/\b(blvd|blvd\.)\b/g, ' boulevard '],
      [/\b(dr|dr\.)\b/g, ' drive '],
      [/\b(ln|ln\.)\b/g, ' lane '],
      [/\b(ct|ct\.)\b/g, ' court '],
      [/\b(pl|pl\.)\b/g, ' place '],
      [/\b(pkwy|pkwy\.)\b/g, ' parkway '],
      [/\b(hwy|hwy\.)\b/g, ' highway '],
    ];

    for (const [pattern, replacement] of streetMap) {
      s = s.replace(pattern, replacement);
    }

    // Ordinals: 1st → 1, 2nd → 2
    s = s.replace(/\b(\d+)(st|nd|rd|th)\b/g, '$1');

    return s.replace(/\s+/g, ' ').trim();
  }


  // -----------------------------------------------------------------
  // Helpers (consistent output)
  // -----------------------------------------------------------------

  protected passRule(ruleSet: CompareRuleSet, itemAValue?: unknown, itemBValue?: unknown, itemCValue?: unknown): CompareRuleResult {
    return {
      ruleId: ruleSet.ruleId,
      field: ruleSet.field,
      passed: true,
      decision: 'ALLOW',
      message: ruleSet.passMessage,
      itemAValue,
      itemBValue,
      itemCValue
    };
  }

  protected failRule(ruleSet: CompareRuleSet, message: string, itemAValue?: unknown, itemBValue?: unknown, itemCValue?: unknown): CompareRuleResult {
    return {
      ruleId: ruleSet.ruleId,
      field: ruleSet.field,
      passed: false,
      decision: ruleSet.failDecision,
      message,
      itemAValue,
      itemBValue,
      itemCValue
    };
  }
}
