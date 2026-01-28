/* ============================================================================
  FILE: purchase-confirmation-order-comparator.service.ts
  - Comparator for Purchase vs Confirmation orderItems[] (2-way)
  - Extends BaseCompareService (uses generic compare methods)
  - Loops through PURCHASE_CONFIRMATION_ORDER_ITEMS_RULE_SETS (basic for-loop)
  - Uses switch(ruleType) to decide which compare method to invoke
  - Returns an array of outcomes (CompareRuleResult[])
============================================================================ */

import { Injectable } from '@angular/core';

import { BaseCompareService } from './base-compare.service';
import { CompareRuleResult } from '@wit/waverly-workflow/Comparator/Model/comparator.models';

import { PURCHASE_CONFIRMATION_ORDER_ITEMS_RULE_SETS } from '@wit/waverly-workflow/Comparator/Rules/purchase-confirmation.compare-rule-sets';

// Replace with your generated AppSync types when ready
type PurchaseOrder = any;
type ConfirmationOrder = any;

@Injectable({ providedIn: 'root' })
export class PurchaseConfirmationOrderItemsComparatorService extends BaseCompareService {

  /**
   * Compare Purchase Order vs Confirmation Order using shared rule definitions.
   */
  public compare(po: PurchaseOrder, co: ConfirmationOrder): CompareRuleResult[] {
    const outcomes: CompareRuleResult[] = [];

    for (const rule of PURCHASE_CONFIRMATION_ORDER_ITEMS_RULE_SETS) {
      const aVal = rule.itemAValue(po);
      const bVal = rule.itemBValue(co);

      let outcome: CompareRuleResult;

      switch (rule.ruleType) {
        case 'EXACT_STRING':
          outcome = this.exactMatchString(
            aVal as (string | null | undefined),
            bVal as (string | null | undefined),
            rule
          );
          break;

        case 'EXACT_NUMBER':
          outcome = this.exactMatchNumber(
            aVal as (number | null | undefined),
            bVal as (number | null | undefined),
            rule
          );
          break;

        // case 'MONEY_TOLERANCE_NUMBER':
        //   outcome = this.moneyToleranceNumber(
        //     aVal as (number | null | undefined),
        //     bVal as (number | null | undefined),
        //     rule
        //   );
        //   break;

        // case 'FUZZY_STRING':
        //   outcome = this.fuzzyMatchString(
        //     aVal as (string | null | undefined),
        //     bVal as (string | null | undefined),
        //     rule
        //   );
        //   break;

        default:
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
