/* ============================================================================
  FILE: sales-purchase-order-items.compare-rule-sets.ts
  - Ruleset for comparing Sales vs Purchase orderItems[]
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

export interface ExtractedOrder {
  orderItems: ExtractedOrderItem[];
  // other fields exist but are not used in this ruleset
}

// Replace with your generated AppSync types when ready
type SalesOrder = ExtractedOrder;
type PurchaseOrder = ExtractedOrder;

// -----------------------------------------------------------------------------
// Canonicalization helpers (array -> stable string)
// -----------------------------------------------------------------------------

function normText(v: unknown): string {
  return String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Key used to align items across orders.
 * Assumption: `item` is stable/unique enough. If duplicates exist, we can upgrade the key.
 */
function itemKey(it: ExtractedOrderItem): string {
  return normText(it.item);
}

function canonicalItemList(items: ExtractedOrderItem[] | null | undefined): string {
  const list = (items ?? [])
    .map(i => itemKey(i))
    .filter(Boolean)
    .sort();

  return list.join('|');
}

function canonicalQtyByItem(items: ExtractedOrderItem[] | null | undefined): string {
  const pairs = (items ?? [])
    .map(i => `${itemKey(i)}=${normText(i.qty ?? '')}`)
    .filter(p => !p.startsWith('='))
    .sort();

  return pairs.join('|');
}

function canonicalDescriptionByItem(items: ExtractedOrderItem[] | null | undefined): string {
  const pairs = (items ?? [])
    .map(i => `${itemKey(i)}=${normText(i.description ?? '')}`)
    .filter(p => !p.startsWith('='))
    .sort();

  return pairs.join('|');
}

// -----------------------------------------------------------------------------
// Rule sets
// -----------------------------------------------------------------------------

export const SALES_PURCHASE_ORDER_ITEMS_RULE_SETS: Array<
  CompareRuleDefinition<SalesOrder, PurchaseOrder, never>
> = [

  // -------------------------------------------------------------
  // 1) Item list match
  // -------------------------------------------------------------
  {
    ruleId: 'order-items-item-list-match',
    field: 'orderItems.item',
    ruleType: 'EXACT_STRING',
    failDecision: 'BLOCK',
    passMessage: 'Order items (item list) match between Sales Order and Purchase Order.',
    failMessage: 'Order items (item list) do not match between Sales Order and Purchase Order.',
    missingMessage: 'Order items are missing on one side and cannot be compared.',
    itemAValue: (a) => canonicalItemList(a?.orderItems),
    itemBValue: (b) => canonicalItemList(b?.orderItems),
  },

  // -------------------------------------------------------------
  // 2) Qty match (per item)
  // -------------------------------------------------------------
  {
    ruleId: 'order-items-qty-match',
    field: 'orderItems.qty',
    ruleType: 'EXACT_STRING',
    failDecision: 'BLOCK',
    passMessage: 'Order item quantities match between Sales Order and Purchase Order.',
    failMessage: 'Order item quantities do not match between Sales Order and Purchase Order.',
    missingMessage: 'Order item quantities are missing on one side and cannot be compared.',
    itemAValue: (a) => canonicalQtyByItem(a?.orderItems),
    itemBValue: (b) => canonicalQtyByItem(b?.orderItems),
  },

  // -------------------------------------------------------------
  // 3) Description match (per item)
  // -------------------------------------------------------------
  {
    ruleId: 'order-items-description-match',
    field: 'orderItems.description',
    ruleType: 'EXACT_STRING',
    failDecision: 'WARN',
    passMessage: 'Order item descriptions match between Sales Order and Purchase Order.',
    failMessage: 'Order item descriptions do not match between Sales Order and Purchase Order.',
    missingMessage: 'Order item descriptions are missing on one side and cannot be compared.',
    itemAValue: (a) => canonicalDescriptionByItem(a?.orderItems),
    itemBValue: (b) => canonicalDescriptionByItem(b?.orderItems),
  },
];
