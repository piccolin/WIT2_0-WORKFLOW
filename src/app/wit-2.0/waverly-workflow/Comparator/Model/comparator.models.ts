/* ============================================================================
  FILE: comparator.models.ts
  - ALL shared comparator types live here (per request)
============================================================================ */

export type Decision = 'ALLOW' | 'WARN' | 'BLOCK';

/**
 * Which compare method the comparator should invoke.
 * Add more as you add more generic compare methods.
 */
export type CompareRuleType =
  | 'EXACT_STRING'
  | 'EXACT_NUMBER'
  | 'MONEY_TOLERANCE_NUMBER'
  | 'FUZZY_STRING';


/**
 * Base rule configuration (messages + fail decision).
 * Pass always returns decision = ALLOW.
 */
export interface CompareRuleSet {
  ruleId: string;
  field: string;

  // What decision should be returned when the rule FAILS?
  failDecision: Exclude<Decision, 'ALLOW'>; // WARN | BLOCK

  // Messages
  passMessage: string;
  failMessage: string;

  // Optional when itemA/itemB is null/undefined
  missingMessage?: string;
}

/**
 * Result of evaluating one rule.
 * Always returned, regardless of pass/fail.
 */
export interface CompareRuleResult {
  ruleId: string;
  field: string;

  passed: boolean;
  decision: Decision;
  message: string;

  // Optional: helpful for logging/audit
  itemAValue?: unknown;
  itemBValue?: unknown;
  // Optional: present only when rules include itemCValue
  itemCValue?: unknown;
}

/**
 * Generic rule definition that can compare any two item types.
 * The comparator will:
 *  1) extract itemAValue + itemBValue
 *  2) switch(ruleType) to choose compare method
 */
export interface CompareRuleDefinition<A, B, C = undefined> extends CompareRuleSet {
  ruleType: CompareRuleType;

  itemAValue: (itemA: A) => unknown;
  itemBValue: (itemB: B) => unknown;
  // Optional third extractor
  itemCValue?: (itemC: C) => unknown;

  // Optional config for tolerant numeric compares
  centsTolerance?: number;
}
