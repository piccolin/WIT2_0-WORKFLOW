/**
 * ========================================================================
 * AddProductComponent – Demo for Cabinet Product CRUD
 * ========================================================================
 *
 * Component demonstrating write (create) and read (list/get) operations
 * for CabinetProduct via CabinetProductGraphqlService. Includes form for input and display
 * of results with error handling and full type safety from Amplify codegen.
 *
 * • Form to create a new cabinet product
 * • Button-triggered create and list actions
 * • Real-time display of created/listed products
 *
 * Tech: Angular 11+ compatible (no signals/inject), RxJS 6+, Amplify v6 (typed via API.ts)
 * ========================================================================
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import the service
import { CabinetProductGraphqlService } from "@app/app-data/stores/cabinet-product-graphql.service";
import {CabinetProduct, CreateCabinetProductMutation, GetCabinetProductQuery, ListCabinetProductsQuery} from "@app/API.service";

// -----------------------------------------------------------------
// Component Decorator
// -----------------------------------------------------------------
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  // -----------------------------------------------------------------
  // Inputs (setters listen for change like ngChanges)
  // -----------------------------------------------------------------
  // No @Input() needed for this demo – standalone usage

  // -----------------------------------------------------------------
  // Outputs
  // -----------------------------------------------------------------
  // No @Output() needed for this demo

  // -----------------------------------------------------------------
  // Runtime State
  // -----------------------------------------------------------------
  // Form for creating a cabinet product
  createForm: FormGroup;

  // Simplified array of products (extracted from query result for easy HTML)
  products: CabinetProduct[] = [];

  // Loading state
  isLoading = false;

  // Error message
  errorMessage: string | null = null;

  // Optional: Single product details (from get by ID)
  singleProduct: CabinetProduct | null = null;

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(
    private fb: FormBuilder,
    private cabinetService: CabinetProductGraphqlService
  ) {
    // Initialize form with validators for required fields (moved to constructor for immediate availability)
    this.createForm = this.fb.group({
      wSKU: ['', [Validators.required, Validators.minLength(3)]],
      vSKU: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', Validators.required],
      doorStyle: ['', Validators.required],
      // Optional fields
      discount: [0],
      costFactor: [1.0],
      retailPrice: [0],
      height: [0],
      width: [0],
      publish: [false]
    });
  }

  // -----------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------
  ngOnInit() {
    // Initial read: Load existing products on component init
    this.loadProducts();
  }

  // -----------------------------------------------------------------
  // TrackBy for performance
  // -----------------------------------------------------------------
  trackById(index: number, item: CabinetProduct): string {
    // Brief why: Improves *ngFor perf by tracking unique IDs
    return item.id;
  }

  // -----------------------------------------------------------------
  // UI Handlers - User Action Handlers
  // -----------------------------------------------------------------
  // Handle form submission to create a new cabinet product (write to DB)
  onCreateProduct() {
    if (this.createForm.invalid) {
      // Mark all fields as touched for validation display
      this.createForm.markAllAsTouched();
      this.errorMessage = 'Please fill required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Prepare input from form (write operation – typed as Partial<CabinetProduct>)
    const input: Partial<CabinetProduct> = {
      ...this.createForm.value,
      // Add any defaults or transformations if needed
      publish: this.createForm.value.publish || false
    };

    // Call service to create (returns typed Observable)
    this.cabinetService.createCabinetProduct(input).subscribe({
      next: (result: CreateCabinetProductMutation) => {
        console.log('✅ Created CabinetProduct:', result.createCabinetProduct);
        this.isLoading = false;
        // Reset form after success
        this.createForm.reset();
        // Clear single product view if open
        this.singleProduct = null;
        // Refresh the list to show new item (re-read)
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Create failed:', err);
        this.errorMessage = 'Failed to create product. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Load and display list of cabinet products (read from DB)
  loadProducts() {
    this.isLoading = true;
    this.errorMessage = null;
    // Clear single product view on refresh
    this.singleProduct = null;
    this.products = []; // Reset array
    this.cabinetService.listCabinetProducts(10).subscribe({ // Limit to 10 for demo
      next: (result: ListCabinetProductsQuery) => {
        // Extract items from query result to simplify HTML, filter out nulls for type safety
        this.products = (result.listCabinetProducts?.items || []).filter((item): item is CabinetProduct => item !== null);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Load failed:', err);
        this.errorMessage = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  // Optional: Get single product by ID (demo read by ID)
  getProductById(id: string) {
    if (!id) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.cabinetService.getCabinetProduct(id).subscribe({
      next: (result: GetCabinetProductQuery) => {
        const product = result.getCabinetProduct;
        if (product) {
          console.log('✅ Got CabinetProduct:', product);
          this.singleProduct = product;
        } else {
          this.errorMessage = 'Product not found.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Get failed:', err);
        this.errorMessage = 'Failed to get product.';
        this.isLoading = false;
      }
    });
  }
}
