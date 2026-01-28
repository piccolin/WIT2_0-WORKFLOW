/* ============================================================================
  FILE: purchase-confirmation.compare-rule-sets.ts
  - Ruleset for comparing Purchase vs Confirmation orderItems[]
  - We compare ONLY: item, qty, description
  - Since orderItems is an array, we canonicalize it into stable strings:
      - normalize text (trim/lower/collapse whitespace)
      - sort consistently
      - join into a single comparable representation
============================================================================ */

import type { CompareRuleDefinition } from '../Model/comparator.models';

// -----------------------------------------------------------------------------
// Models (use your real extracted models if available)
// -----------------------------------------------------------------------------

export interface ExtractedOrderItem {
  item: string;
  qty?: string;
  each: string;
  total: string;
  description: string;
  backorder?: string;
  additionalDetails?: string;
}

type PurchaseOrder = { orderItems?: ExtractedOrderItem[] } | any;
type ConfirmationOrder = { orderItems?: ExtractedOrderItem[] } | any;

// -----------------------------------------------------------------------------
// Canonicalization helpers (make arrays comparable as stable strings)
// -----------------------------------------------------------------------------

function normText(v: unknown): string {
  return String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function safeItems(items?: ExtractedOrderItem[]): ExtractedOrderItem[] {
  return Array.isArray(items) ? items : [];
}

/**
 * Canonical list of item names.
 * Example output: "hinge-123|panel-a|toe-kick"
 */
function canonicalItemList(items?: ExtractedOrderItem[]): string {
  const list = safeItems(items)
    .map(i => normText(i?.item))
    .filter(Boolean)
    .sort();

  return list.join('|');
}

/**
 * Canonical "item -> qty" representation.
 * Example output: "hinge-123=2|panel-a=10|toe-kick=1"
 */
function canonicalQtyByItem(items?: ExtractedOrderItem[]): string {
  const pairs = safeItems(items)
    .map(i => {
      const item = normText(i?.item);
      const qty = normText(i?.qty);
      if (!item) return '';
      return `${item}=${qty}`;
    })
    .filter(Boolean)
    .sort();

  return pairs.join('|');
}

/**
 * Canonical "item -> description" representation.
 * Example output: "hinge-123=soft close|panel-a=base panel"
 */
function canonicalDescriptionByItem(items?: ExtractedOrderItem[]): string {
  const pairs = safeItems(items)
    .map(i => {
      const item = normText(i?.item);
      const desc = normText(i?.description);
      if (!item) return '';
      return `${item}=${desc}`;
    })
    .filter(Boolean)
    .sort();

  return pairs.join('|');
}

// -----------------------------------------------------------------------------
// Rule set: Purchase vs Confirmation (orderItems[])
// -----------------------------------------------------------------------------

export const PURCHASE_CONFIRMATION_ORDER_ITEMS_RULE_SETS: Array<
  CompareRuleDefinition<PurchaseOrder, ConfirmationOrder>
> = [
  // -------------------------------------------------------------
  // 1) Item names match (set equality)
  // -------------------------------------------------------------
  {
    ruleId: 'po-co-order-items-item-match',
    field: 'orderItems.item',
    ruleType: 'EXACT_STRING',
    failDecision: 'BLOCK',
    passMessage: 'Order items (item names) match between Purchase Order and Confirmation Order.',
    failMessage: 'Order items (item names) do not match between Purchase Order and Confirmation Order.',
    missingMessage: 'Order items are missing on one side and cannot be compared.',
    itemAValue: (po) => canonicalItemList(po?.orderItems),
    itemBValue: (co) => canonicalItemList(co?.orderItems),
  },

  // -------------------------------------------------------------
  // 2) Qty match per item
  // -------------------------------------------------------------
  {
    ruleId: 'po-co-order-items-qty-match',
    field: 'orderItems.qty',
    ruleType: 'EXACT_STRING',
    failDecision: 'WARN',
    passMessage: 'Order item quantities match between Purchase Order and Confirmation Order.',
    failMessage: 'Order item quantities do not match between Purchase Order and Confirmation Order.',
    missingMessage: 'Order item quantities are missing on one side and cannot be compared.',
    itemAValue: (po) => canonicalQtyByItem(po?.orderItems),
    itemBValue: (co) => canonicalQtyByItem(co?.orderItems),
  },

  // -------------------------------------------------------------
  // 3) Description match per item
  // -------------------------------------------------------------
  {
    ruleId: 'po-co-order-items-description-match',
    field: 'orderItems.description',
    ruleType: 'EXACT_STRING',
    failDecision: 'WARN',
    passMessage: 'Order item descriptions match between Purchase Order and Confirmation Order.',
    failMessage: 'Order item descriptions do not match between Purchase Order and Confirmation Order.',
    missingMessage: 'Order item descriptions are missing on one side and cannot be compared.',
    itemAValue: (po) => canonicalDescriptionByItem(po?.orderItems),
    itemBValue: (co) => canonicalDescriptionByItem(co?.orderItems),
  },
];
