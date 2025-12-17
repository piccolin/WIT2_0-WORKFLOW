/**
 * @Filename:    PurchaseOrderItemsGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * ========================================================================
 * PurchaseOrderItemsGraphqlService – Purchase Order Item Data GraphQL Operations
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service';

// Queries
import { getPurchaseOrderItems, listPurchaseOrderItems } from '@scr/graphql/queries';
// Mutations
import { createPurchaseOrderItems, updatePurchaseOrderItems, deletePurchaseOrderItems } from '@scr/graphql/mutations';
// Subscriptions
import { onCreatePurchaseOrderItems, onUpdatePurchaseOrderItems, onDeletePurchaseOrderItems } from '@scr/graphql/subscriptions';

// -----------------------------------------------------------------
// Runtime State
// -----------------------------------------------------------------
// No additional state needed

// -----------------------------------------------------------------
// DI
// -----------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderItemsGraphqlService extends BaseGraphqlService {

  // -----------------------------------------------------------------
  // Lifecycle - Constructor
  // -----------------------------------------------------------------
  constructor() {
    super();
    console.log('💾 UI On-Load Event: %s initiated via constructor', this.constructor.name);
  }

  // -----------------------------------------------------------------
  // Queries
  // -----------------------------------------------------------------
  public getPurchaseOrderItems(id: string): Observable<any> {
    const variables = { id };
    return this.query(getPurchaseOrderItems, variables, 'GetPurchaseOrderItems');
  }

  public listPurchaseOrderItems(limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit, filter, nextToken };
    return this.query(listPurchaseOrderItems, variables, 'ListPurchaseOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createPurchaseOrderItems(input: any): Observable<any> {
    return this.create(input, createPurchaseOrderItems, 'CreatePurchaseOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updatePurchaseOrderItems(input: any): Observable<any> {
    return this.update(input, updatePurchaseOrderItems, 'UpdatePurchaseOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deletePurchaseOrderItems(input: any): Observable<any> {
    return this.delete(input, deletePurchaseOrderItems, 'DeletePurchaseOrderItems');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreatePurchaseOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onCreatePurchaseOrderItems, variables || {}, 'OnCreatePurchaseOrderItems');
  }

  public onUpdatePurchaseOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onUpdatePurchaseOrderItems, variables || {}, 'OnUpdatePurchaseOrderItems');
  }

  public onDeletePurchaseOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onDeletePurchaseOrderItems, variables || {}, 'OnDeletePurchaseOrderItems');
  }

} // End class
