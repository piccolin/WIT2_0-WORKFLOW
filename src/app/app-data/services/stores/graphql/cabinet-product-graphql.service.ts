/**
 * ========================================================================
 * CabinetProductGraphqlService – Cabinet Product Data GraphQL Operations
 * ========================================================================
 *
 * Service for handling cabinet product-related queries, mutations, and subscriptions.
 * Extends BaseGraphqlService for one-liner wrappers around Amplify v6 GraphQL ops.
 *
 * • Queries: Get/list cabinet products by ID, SKU, brand/doorStyle, or general
 * • Mutations: Create/update/delete cabinet products
 * • Subscriptions: Real-time listeners for create/update/delete events
 *
 * Tech: Angular 18+, Amplify v6 codegen (graphql/ folder), RxJS 7+
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// v6: Direct imports from codegen (no gql wrapper needed – documents are pre-tagged)
import {
  // Queries
  getCabinetProduct,
  listCabinetProducts,
  listCabinetProductBywSku,
  listCabinetProductByvSku,
  listCabinetProductByBrandAndDoorStyle
} from '@scr/graphql/queries'; // Adjust path to your codegen output (e.g., src/graphql/queries.ts)

import {
  // Mutations
  createCabinetProduct,
  updateCabinetProduct,
  deleteCabinetProduct
} from '@scr/graphql/mutations'; // Adjust path to your codegen output (e.g., src/graphql/mutations.ts)

import {
  // Subscriptions
  onCreateCabinetProduct,
  onUpdateCabinetProduct,
  onDeleteCabinetProduct
} from '@scr/graphql/subscriptions';

import {BaseGraphqlService} from "@app/app-data/services/core/base-graphql.service"; // Adjust path to your codegen output (e.g., src/graphql/subscriptions.ts)


// -----------------------------------------------------------------
// Runtime State
// -----------------------------------------------------------------
// No additional state needed – leverages base client & debug

// -----------------------------------------------------------------
// DI
// -----------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class CabinetProductGraphqlService extends BaseGraphqlService {

  // -----------------------------------------------------------------
  // Lifecycle - Constructor
  // -----------------------------------------------------------------
  constructor() {
    super();
    console.log("💾 UI On-Load Event: %s initiated via constructor", this.constructor.name);
  }

  // -----------------------------------------------------------------
  // Queries
  // -----------------------------------------------------------------
  // Get a single cabinet product by ID
  public getCabinetProduct(id: string, limit?: number): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { id, limit: queryLimit };
    // One-liner: Pass query doc + vars directly to base
    return this.query(getCabinetProduct, variables, 'GetCabinetProduct');
  }

  // List all cabinet products (paginated)
  public listCabinetProducts(limit?: number): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit };
    // One-liner: Pass query doc + vars directly to base
    return this.query(listCabinetProducts, variables, 'ListCabinetProducts');
  }

  // List cabinet products by wSKU (GSI: bywSku)
  public listCabinetProductBywSku(wSKU: string, sortDirection?: string, limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { wSKU, sortDirection, limit: queryLimit, filter, nextToken };
    // One-liner: Pass query doc + vars directly to base
    return this.query(listCabinetProductBywSku, variables, 'ListCabinetProductBywSku');
  }

  // List cabinet products by vSKU (GSI: byvSku)
  public listCabinetProductByvSku(vSKU: string, sortDirection?: string, limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { vSKU, sortDirection, limit: queryLimit, filter, nextToken };
    // One-liner: Pass query doc + vars directly to base
    return this.query(listCabinetProductByvSku, variables, 'ListCabinetProductByvSku');
  }

  // List cabinet products by brand and doorStyle (GSI: byBrandAndDoorStyle, sortKey: doorStyle)
  public listCabinetProductByBrandAndDoorStyle(brand: string, doorStyle: string, sortDirection?: string, limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { brand, doorStyle, sortDirection, limit: queryLimit, filter, nextToken };
    // One-liner: Pass query doc + vars directly to base
    return this.query(listCabinetProductByBrandAndDoorStyle, variables, 'ListCabinetProductByBrandAndDoorStyle');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  // Create a new cabinet product (1 GQL statement)
  public createCabinetProduct(input: any): Observable<any> {
    // One-liner: Just pass input + mutation doc to base
    return this.create(input, createCabinetProduct, 'CreateCabinetProduct');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  // Update an existing cabinet product (1 GQL statement)
  public updateCabinetProduct(input: any): Observable<any> {
    // One-liner: Just pass input + mutation doc to base
    return this.update(input, updateCabinetProduct, 'UpdateCabinetProduct');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  // Delete a cabinet product (1 GQL statement)
  public deleteCabinetProduct(input: any): Observable<any> {
    // One-liner: Just pass input + mutation doc to base
    return this.delete(input, deleteCabinetProduct, 'DeleteCabinetProduct');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  // Listen for new cabinet product creations
  public onCreateCabinetProduct(variables?: any): Observable<any> {
    // One-liner: Pass subscription doc + vars directly to base (owner/filter as needed)
    return this.subscribe(onCreateCabinetProduct, variables || {}, 'OnCreateCabinetProduct');
  }

  // Listen for cabinet product updates
  public onUpdateCabinetProduct(variables?: any): Observable<any> {
    // One-liner: Pass subscription doc + vars directly to base (owner/filter as needed)
    return this.subscribe(onUpdateCabinetProduct, variables || {}, 'OnUpdateCabinetProduct');
  }

  // Listen for cabinet product deletions
  public onDeleteCabinetProduct(variables?: any): Observable<any> {
    // One-liner: Pass subscription doc + vars directly to base (owner/filter as needed)
    return this.subscribe(onDeleteCabinetProduct, variables || {}, 'OnDeleteCabinetProduct');
  }

} // End class
