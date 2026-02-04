/**
 * DEV-ONLY MANUAL TEST FILE
 * This file is NOT part of Angular runtime.
 * Import it temporarily to validate comparator logic.
 */


import {
  SalesPurchaseConfirmationComparatorService
} from "@wit/waverly-workflow/Comparator/sales-purchase-confirmation-order-comparator.service";
import {ExtractedOrder} from "@app/app-transformer/services/extractors/models/extract.model";

const comparator = new SalesPurchaseConfirmationComparatorService();

// -----------------------------------------------------------------------------
// Test Data
// -----------------------------------------------------------------------------
const sales: ExtractedOrder = {
  shippingAddress: ['John Doe', '123 Main St. Apt 6 Taylor L', 'Allentown PA 18101'],
  subtotal: '100',
  total: '1000000',
  orderItems: [
    {
      item: 'D12',
      qty: '1',
      each: '100',
      total: '100',
      description: 'Base cabinet',
    },
  ],
};

const purchase: ExtractedOrder = {
  shippingAddress: ['John Doe', '123 Main St APT 6 taylor ln', 'Allentown PA 18101'],
  subtotal: '100',
  total: '10000.34',
  orderItems: [
    {
      item: 'D12',
      qty: '1',
      each: '100',
      total: '100',
      description: 'Base cabinet',
    },
  ],
};

const confirmation: ExtractedOrder = {
  shippingAddress: ['John Doe', '123 Main street apartment 6 taylor-- Lan ', 'Allentown PA :18101'],
  subtotal: '100',
  total: '10000.34',
  orderItems: [
    {
      item: 'D12',
      qty: '12',
      each: '100',
      total: '200',
      description: 'Base cabinet',
    },
  ],
};

// -----------------------------------------------------------------------------
// Run Comparison
// -----------------------------------------------------------------------------
const results = comparator.compare(sales, purchase, confirmation);

// -----------------------------------------------------------------------------
// Output
// -----------------------------------------------------------------------------
// console.group('🧪 Comparator Test Results');
// console.table(
//   results.map(r => ({
//     ruleId: r.ruleId,
//     field: r.field,
//     passed: r.passed,
//     decision: r.decision,
//   }))
// );
// console.groupEnd();

console.group('🧪 Comparator Test Results');
console.log('Raw results:', results);
console.groupEnd();

console.table(
  results.map(r => ({
    ruleId: r.ruleId,
    field: r.field,
    passed: r.passed,
    decision: r.decision,
  }))
);


const failed = results.filter(r => !r.passed);
console.log('❌ Failed rules:', failed);
