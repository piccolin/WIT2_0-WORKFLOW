import { SalesPurchaseOrderItemsComparatorService } from './sales-purchase-order-comparator.service';

const comparator = new SalesPurchaseOrderItemsComparatorService();

// ONE SCENARIO (start as PASS). Then you edit qty/desc to see FAIL.
const sales = {
  orderItems: [
    { item: 'JIFFY KIT - SHG - # M883-3067', qty: '10', each: '13.99', total: '13.99', description: 'STONE HARBOR GRAY' },
    { item: 'GHI W2130', qty: '2', each: '90.77', total: '181.54', description: 'STONE HARBOR GRAY' },
    { item: 'GHI W2730', qty: '2', each: '114.68', total: '229.36', description: 'STONE HARBOR GRAY' },
  ],
};

const purchase = {
  orderItems: [
    // same items → should PASS
   // { item: 'JIFFY KIT - SHG - # M883-3067', qty: '10', each: '13.99', total: '13.99', description: 'STONE HARBOR Gray' },
    //{ item: 'GHI W2130', qty: '2', each: '90.77', total: '181.54', description: 'STONE HARBOR GRAY' },
    { item: 'GHI W2730', qty: '2', each: '114.68', total: '229.36', description: 'STONE HARBOR GRAY' },
    { item: 'JIFFy KIT - SHG - # M883-3067', qty: '10', each: '13.99', total: '13.99', description: 'STONE HARBOR Gray' },
    { item: 'GHI W2130', qty: '2', each: '90.77', total: '181.54', description: 'STONE HARBOR GRAY' }
  ],
};

const results = comparator.compare(sales, purchase);

console.table(
  results.map(r => ({
    ruleId: r.ruleId,
    field: r.field,
    passed: r.passed,
    decision: r.decision,
  }))
);

console.log('Failed:', results.filter(r => !r.passed));
