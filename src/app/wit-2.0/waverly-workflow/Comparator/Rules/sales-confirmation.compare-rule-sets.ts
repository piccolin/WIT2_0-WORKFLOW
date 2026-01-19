/* ============================================================================
  FILE: sales-confirmation.compare-rule-sets.ts
  - The ruleset the comparator will loop through
  - Mix of string + number + tolerant compares
============================================================================ */

import { CompareRuleDefinition } from '../Model/comparator.models';

// Replace with your generated AppSync types when ready
type SalesOrder = any;
type ConfirmationOrder = any;

export const SALES_CONFIRMATION_RULE_SETS: Array<CompareRuleDefinition<SalesOrder, ConfirmationOrder>> = [
  {
    ruleId: 'purchase-order-id-match',
    field: 'PurchaseOrderId',
    ruleType: 'EXACT_STRING',
    failDecision: 'BLOCK',
    passMessage: 'PurchaseOrderId matches between Sales Order and Confirmation Order.',
    failMessage: 'PurchaseOrderId does not match between Sales Order and Confirmation Order.',
    missingMessage: 'PurchaseOrderId is missing on one side and cannot be compared.',
    itemAValue: (itemA) => itemA?.PurchaseOrderId,
    itemBValue: (itemB) => itemB?.PurchaseOrderId
  },

  {
    ruleId: 'total-amount-match-within-tolerance',
    field: 'totalAmount',
    ruleType: 'MONEY_TOLERANCE_NUMBER',
    centsTolerance: 1,
    failDecision: 'BLOCK',
    passMessage: 'Total amount matches within tolerance.',
    failMessage: 'Total amount differs beyond allowed tolerance.',
    missingMessage: 'Total amount is missing on one side and cannot be compared.',
    itemAValue: (itemA) => itemA?.totalAmount,
    itemBValue: (itemB) => itemB?.totalAmount
  }

  // Add more rules here...
];
