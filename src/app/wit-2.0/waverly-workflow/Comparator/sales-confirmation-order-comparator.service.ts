/* ============================================================================
  FILE: sales-confirmation-order-comparator.service.ts
  - Specific comparator
  - Extends BaseCompareService (uses generic compare methods)
  - Loops through SALES_CONFIRMATION_RULE_SETS (basic for-loop)
  - Uses switch(ruleType) to decide which compare method to invoke
  - Returns an array of outcomes (CompareRuleResult[])
============================================================================ */

import { Injectable } from '@angular/core';
import { BaseCompareService } from './base-compare.service';
import {
  SALES_CONFIRMATION_RULE_SETS
} from "@wit/waverly-workflow/Comparator/Rules/sales-confirmation.compare-rule-sets";
import {CompareRuleResult} from "@wit/waverly-workflow/Comparator/Model/comparator.models";


// Replace with your generated AppSync types when ready
type SalesOrder = any;
type ConfirmationOrder = any;

@Injectable({ providedIn: 'root' })
export class SalesConfirmationOrderComparatorService extends BaseCompareService {

  public compare(itemA: SalesOrder, itemB: ConfirmationOrder): Array<CompareRuleResult> {
    const outcomes: Array<CompareRuleResult> = [];

    for (let i = 0; i < SALES_CONFIRMATION_RULE_SETS.length; i++) {
      const rule = SALES_CONFIRMATION_RULE_SETS[i];

      const aVal = rule.itemAValue(itemA);
      const bVal = rule.itemBValue(itemB);

      let outcome: CompareRuleResult;

      switch (rule.ruleType) {
        case 'EXACT_STRING':
          outcome = this.exactMatchString(aVal as (string | null | undefined), bVal as (string | null | undefined), rule);
          break;

        case 'EXACT_NUMBER':

          outcome = this.exactMatchNumber(aVal as (number | null | undefined), bVal as (number | null | undefined), rule);
          break;

        case 'MONEY_TOLERANCE_NUMBER':
          outcome = this.moneyToleranceNumber(
            aVal as (number | null | undefined),
            bVal as (number | null | undefined),
            rule.centsTolerance || 0,
            rule
          );
          break;

        default:
          // If a ruleType is not supported, treat it as a BLOCK so it can't silently pass.
          outcome = this.failRule(
            rule,
            `Unsupported ruleType: ${String((rule as any).ruleType)}`,
            aVal,
            bVal
          );
          break;
      }

      outcomes.push(outcome);
    }

    return outcomes;
  }
}
