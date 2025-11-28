/**
 * ========================================================================
 * ListProductComponent – Fetches & Displays Cabinet Product Cards
 * ========================================================================
 *
 * Standalone container component that queries CabinetProduct data via CabinetProductGraphqlService,
 * renders a grid of ShoppingCartCardComponents for browsing/add-to-cart.
 *
 * • Fetches all products on init (no client filter for publish to ensure visibility)
 * • Responsive grid layout (3-col desktop, 1-col mobile)
 * • Handles loading/error states
 *
 * Tech: Angular 18+, standalone, RxJS for observables
 * ========================================================================
 */

// Import service for data fetching
import { CabinetProductGraphqlService } from '@app/app-data/stores/cabinet-product-graphql.service';

// Import generated types
import { CabinetProduct, ListCabinetProductsQuery } from '@app/API.service';

// Import child card component
import {ShoppingCartCardComponent} from "@wit/e-commerce/product/list-product/view/shopping-cart-card/shopping-cart-card.component";

import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// -----------------------------------------------------------------
// Component Decorator
// -----------------------------------------------------------------
@Component({
  selector: 'app-add-product-list',
  standalone: true,
  imports: [CommonModule, ShoppingCartCardComponent],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit {
  // -----------------------------------------------------------------
  // Inputs (setters listen for change like ngChanges)
  // -----------------------------------------------------------------
  // No @Input() needed – fetches all data

  // -----------------------------------------------------------------
  // Outputs
  // -----------------------------------------------------------------
  // No @Output() needed – standalone usage

  // -----------------------------------------------------------------
  // Runtime State
  // -----------------------------------------------------------------
  products: CabinetProduct[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(
    private cabinetService: CabinetProductGraphqlService
  ) {}

  // DestroyRef for takeUntilDestroyed
  private destroyRef = inject(DestroyRef);

  // -----------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------
  ngOnInit() {
    this.loadProducts();
  }

  // -----------------------------------------------------------------
  // UI Handlers - User Action Handlers
  // -----------------------------------------------------------------
  // Retry fetch on error
  retryFetch(): void {
    this.loadProducts();
  }

  // -----------------------------------------------------------------
  // Data Fetching – EXACT SAME PATTERN AS WORKING COMPONENT
  // -----------------------------------------------------------------
  private loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.products = []; // Reset array

    this.cabinetService.listCabinetProducts(50).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result: ListCabinetProductsQuery) => {
        // Extract items from query result to simplify HTML, filter out nulls for type safety
        this.products = (result.listCabinetProducts?.items || []).filter(
          (item): item is CabinetProduct => item !== null
        );
        console.log('Loaded products:', this.products); // Debug
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load failed:', err);
        this.errorMessage = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  // -----------------------------------------------------------------
  // TrackBy for performance
  // -----------------------------------------------------------------
  trackByWSKU(index: number, item: CabinetProduct): string {
    // Brief why: Improves *ngFor perf by tracking unique wSKU
    return item.wSKU;
  }
}
