/* ============================================================================
  FILE: sales-po-confirmation-comparator.service.ts
  - Specific comparator
  - Extends BaseCompareService (uses generic compare methods)
  - Loops through SALES_PO_CONFIRMATION_RULE_SETS (basic for-loop)
  - Uses switch(ruleType) to decide which compare method to invoke
  - Returns an array of outcomes (CompareRuleResult[])
============================================================================ */

import { Injectable } from '@angular/core';
import { BaseCompareService } from './base-compare.service';
import { CompareRuleResult } from '@wit/waverly-workflow/Comparator/Model/comparator.models';
import {
  SALES_PURCHASE_CONFIRMATION_RULE_SETS
} from "@wit/waverly-workflow/Comparator/Rules/sales-purchase-confirmation.compare-rule-sets";

// Replace with your generated AppSync types when ready
type SalesOrder = any;
type PurchaseOrder = any;
type ConfirmationOrder = any;

@Injectable({ providedIn: 'root' })
export class SalesPurchaseConfirmationComparatorService extends BaseCompareService {

  public compare(
    itemA: SalesOrder,
    itemB: PurchaseOrder,
    itemC: ConfirmationOrder
  ): Array<CompareRuleResult> {

    const outcomes: Array<CompareRuleResult> = [];

    for (let i = 0; i < SALES_PURCHASE_CONFIRMATION_RULE_SETS.length; i++) {
      const rule = SALES_PURCHASE_CONFIRMATION_RULE_SETS[i];

      const aVal = rule.itemAValue(itemA);
      const bVal = rule.itemBValue(itemB);
      const cVal = rule.itemCValue?.(itemC);

      let outcome: CompareRuleResult;

      switch (rule.ruleType) {

        case 'EXACT_STRING':
          outcome = this.exactMatchString(
            aVal as (string | null | undefined),
            bVal as (string | null | undefined),
            rule,
            cVal as (string | null | undefined)
          );
          break;

        case 'EXACT_NUMBER':
          outcome = this.exactMatchNumber(
            aVal as (number | null | undefined),
            bVal as (number | null | undefined),
            rule,
            cVal as (number | null | undefined)
          );
          break;

        case 'MONEY_TOLERANCE_NUMBER':
          // NOTE:
          // Money tolerance is currently defined for 2-value compares.
          // If you want 3-way tolerance, add a moneyToleranceNumber3() to BaseCompareService.
          outcome = this.moneyToleranceNumber(
            aVal as (number | null | undefined),
            bVal as (number | null | undefined),
            rule.centsTolerance || 0,
            rule
          );
          break;

        case 'FUZZY_STRING':
          outcome = this.fuzzyMatchString(
            aVal as (string | string[] | null | undefined),
            bVal as (string | string[] | null | undefined),
            cVal as (string | string[] | null | undefined),
            rule
          );
          break;

        default:
          // If a ruleType is not supported, treat it as a BLOCK so it can't silently pass.
          outcome = this.failRule(
            rule,
            `Unsupported ruleType: ${String((rule as any).ruleType)}`,
            aVal,
            bVal,
            cVal
          );
          break;
      }

      outcomes.push(outcome);
    }

    return outcomes;
  }
}
