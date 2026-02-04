import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SalesPurchaseOrderItemsComparatorService
} from "@wit/waverly-workflow/Comparator/sales-purchase-order-comparator.service";



type Decision = 'ALLOW' | 'WARN' | 'BLOCK';

@Component({
  selector: 'app-comparator-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:16px; max-width: 1100px; margin: 0 auto;">
      <h2 style="margin:0 0 12px;">Comparator Test (Sales vs Purchase)</h2>
      <p style="margin:0 0 16px; opacity:0.8;">
        Paste/edit Sales & Purchase JSON below, then click "Run Compare".
      </p>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h3 style="margin:0 0 8px;">Sales JSON</h3>
          <textarea
            [(ngModel)]="salesJson"
            rows="16"
            style="width:100%; font-family: monospace; padding:10px;"
          ></textarea>
        </div>

        <div>
          <h3 style="margin:0 0 8px;">Purchase JSON</h3>
          <textarea
            [(ngModel)]="purchaseJson"
            rows="16"
            style="width:100%; font-family: monospace; padding:10px;"
          ></textarea>
        </div>
      </div>

      <div style="margin-top: 12px; display:flex; gap:12px; align-items:center;">
        <button (click)="runCompare()" style="padding:10px 14px; cursor:pointer;">
          Run Compare
        </button>

        <span *ngIf="error" style="color:#c00;">{{ error }}</span>
      </div>

      <div *ngIf="results?.length" style="margin-top: 16px;">
        <h3 style="margin:0 0 8px;">Results</h3>

        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">ruleId</th>
              <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">field</th>
              <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">passed</th>
              <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">decision</th>
              <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">message</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let r of results">
              <td style="padding:8px; border-bottom:1px solid #eee;">{{ r.ruleId }}</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">{{ r.field }}</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">{{ r.passed }}</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">
                <span [style.fontWeight]="'600'">{{ r.decision }}</span>
              </td>
              <td style="padding:8px; border-bottom:1px solid #eee;">{{ r.message }}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:10px; opacity:0.85;">
          Final decision: <b>{{ finalDecision }}</b>
        </div>
      </div>
    </div>
  `,
})
export class ComparatorTestComponent {
  // Starter JSON (you can replace with Hornings sample)
  salesJson = JSON.stringify(
    {
      orderItems: [
        { item: 'D12', qty: '1', each: '100', total: '100', description: 'Base cabinet' },
        { item: 'W30', qty: '2', each: '80', total: '160', description: 'Wall cabinet' },
      ],
    },
    null,
    2
  );

  purchaseJson = JSON.stringify(
    {
      orderItems: [
        { item: 'D12', qty: '1', each: '100', total: '100', description: 'Base cabinet' },
        { item: 'W30', qty: '2', each: '80', total: '160', description: 'Wall cabinet' },
      ],
    },
    null,
    2
  );

  results: Array<any> = [];
  finalDecision: Decision = 'ALLOW';
  error = '';

  constructor(private readonly comparator: SalesPurchaseOrderItemsComparatorService) {}

  runCompare(): void {
    this.error = '';
    this.results = [];
    this.finalDecision = 'ALLOW';

    try {
      const sales = JSON.parse(this.salesJson);
      const purchase = JSON.parse(this.purchaseJson);

      const results = this.comparator.compare(sales, purchase);
      this.results = results;

      // Compute the final decision (BLOCK > WARN > ALLOW)
      const hasBlock = results.some(r => r.decision === 'BLOCK' && !r.passed);
      const hasWarn = results.some(r => r.decision === 'WARN' && !r.passed);

      this.finalDecision = hasBlock ? 'BLOCK' : hasWarn ? 'WARN' : 'ALLOW';
    } catch (e: any) {
      this.error = `Invalid JSON: ${e?.message ?? 'unknown error'}`;
    }
  }
}
