/**
 * @Filename:    PurchaseOrderGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * ========================================================================
 * PurchaseOrderGraphqlService – Purchase Order Data GraphQL Operations
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service';

// Queries
import { getPurchaseOrder, listPurchaseOrders } from '@scr/graphql/queries';
// Mutations
import { createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from '@scr/graphql/mutations';
// Subscriptions
import { onCreatePurchaseOrder, onUpdatePurchaseOrder, onDeletePurchaseOrder } from '@scr/graphql/subscriptions';

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
export class PurchaseOrderGraphqlService extends BaseGraphqlService {

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
  public getPurchaseOrder(id: string): Observable<any> {
    const variables = { id };
    return this.query(getPurchaseOrder, variables, 'GetPurchaseOrder');
  }

  public listPurchaseOrders(limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit, filter, nextToken };
    return this.query(listPurchaseOrders, variables, 'ListPurchaseOrders');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createPurchaseOrder(input: any): Observable<any> {
    return this.create(input, createPurchaseOrder, 'CreatePurchaseOrder');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updatePurchaseOrder(input: any): Observable<any> {
    return this.update(input, updatePurchaseOrder, 'UpdatePurchaseOrder');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deletePurchaseOrder(input: any): Observable<any> {
    return this.delete(input, deletePurchaseOrder, 'DeletePurchaseOrder');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreatePurchaseOrder(variables?: any): Observable<any> {
    return this.subscribe(onCreatePurchaseOrder, variables || {}, 'OnCreatePurchaseOrder');
  }

  public onUpdatePurchaseOrder(variables?: any): Observable<any> {
    return this.subscribe(onUpdatePurchaseOrder, variables || {}, 'OnUpdatePurchaseOrder');
  }

  public onDeletePurchaseOrder(variables?: any): Observable<any> {
    return this.subscribe(onDeletePurchaseOrder, variables || {}, 'OnDeletePurchaseOrder');
  }

} // End class
