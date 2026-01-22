/* ============================================================================
  FILE: sales-purchase-order-items-comparator.service.ts
  - Comparator for Sales vs Purchase orderItems[] (2-way)
  - Extends BaseCompareService (uses generic compare methods)
  - Loops through SALES_PURCHASE_ORDER_ITEMS_RULE_SETS (basic for-loop)
  - Uses switch(ruleType) to decide which compare method to invoke
  - Returns an array of outcomes (CompareRuleResult[])
============================================================================ */

import { Injectable } from '@angular/core';

import { BaseCompareService } from './base-compare.service';
//import type { CompareRuleResult } from '../Model/comparator.models';

//import { SALES_PURCHASE_ORDER_ITEMS_RULE_SETS } from './sales-purchase-order-items.compare-rule-sets';
import {CompareRuleResult} from "@wit/waverly-workflow/Comparator/Model/comparator.models";
import {
  SALES_PURCHASE_ORDER_ITEMS_RULE_SETS
} from "@wit/waverly-workflow/Comparator/Rules/sales-purchase.compare-rule-sets";

// Replace with your generated AppSync types when ready
type SalesOrder = any;
type PurchaseOrder = any;

@Injectable({ providedIn: 'root' })
export class SalesPurchaseOrderItemsComparatorService extends BaseCompareService {

  public compare(
    itemA: SalesOrder,
    itemB: PurchaseOrder
  ): Array<CompareRuleResult> {

    
    const outcomes: Array<CompareRuleResult> = [];

    for (let i = 0; i < SALES_PURCHASE_ORDER_ITEMS_RULE_SETS.length; i++) {
      const rule = SALES_PURCHASE_ORDER_ITEMS_RULE_SETS[i];

      const aVal = rule.itemAValue(itemA);
      const bVal = rule.itemBValue(itemB);

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
