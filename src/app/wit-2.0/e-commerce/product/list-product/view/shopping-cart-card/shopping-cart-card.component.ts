/**
 * ========================================================================
 * ShoppingCartCardComponent – Product Card for Shopping Cart Addition
 * ========================================================================
 *
 * Standalone component rendering a product card for cabinet products, mimicking Waverly Cabinets' design.
 * Displays image, title, price, and add-to-cart button based on CabinetProduct data.
 *
 * • Responsive grid-friendly layout
 * • Hover effects for interactivity
 * • Emits add-to-cart event
 *
 * Tech: Angular 18+, standalone, RxJS for events
 * ========================================================================
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import generated types from Amplify API
import { CabinetProduct } from '@app/API.service';

// -----------------------------------------------------------------
// Component Decorator
// -----------------------------------------------------------------
@Component({
  selector: 'app-shopping-cart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart-card.component.html',
  styleUrls: ['./shopping-cart-card.component.scss'],
})
export class ShoppingCartCardComponent {
  // -----------------------------------------------------------------
  // Inputs (setters listen for change like ngChanges)
  // -----------------------------------------------------------------
  @Input() product!: CabinetProduct;

  // -----------------------------------------------------------------
  // Outputs
  // -----------------------------------------------------------------
  @Output() addToCart = new EventEmitter<CabinetProduct>();

  // -----------------------------------------------------------------
  // Runtime State
  // -----------------------------------------------------------------
  isHovered = false;

  // -----------------------------------------------------------------
  // UI Handlers - User Action Handlers
  // -----------------------------------------------------------------
  onAddToCart(): void {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }

  // -----------------------------------------------------------------
  // UI Listeners
  // -----------------------------------------------------------------
  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}
