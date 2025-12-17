/**
 * @Filename:    SalesOrderGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   Service for handling SalesOrder-related GraphQL queries, mutations, and subscriptions.
 *
 * @Data Sources:
 *   - AWS AppSync GraphQL API → Amplify v6 codegen (graphql/ folder)
 *
 * @Services Used:
 *   - BaseGraphqlService:
 *     1) wraps Amplify generateClient + RxJS Observables for query/mutation/subscription
 *
 * @TODOs:
 *   - [Optional] Add GSI-backed listBy* queries if/when schema adds @index directives
 *
 * @Notes:
 *   - One-liner wrappers: pass codegen document + variables to BaseGraphqlService
 *
 * ========================================================================
 * SalesOrderGraphqlService – Sales Order Data GraphQL Operations
 * ========================================================================
 *
 * • Queries: Get/list sales orders
 * • Mutations: Create/update/delete sales orders
 * • Subscriptions: Real-time listeners for create/update/delete events
 *
 * Tech: Angular 11+ compatible, Amplify v6 codegen (graphql/ folder), RxJS 7+
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service'; // Adjust path to your base service

// Queries
import { getSalesOrder, listSalesOrders} from '@scr/graphql/queries';
// Mutations
import { createSalesOrder, updateSalesOrder,  deleteSalesOrder} from '@scr/graphql/mutations';
// Subscriptions
import { onCreateSalesOrder, onUpdateSalesOrder, onDeleteSalesOrder} from '@scr/graphql/subscriptions'; // Adjust path to your codegen output

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
export class SalesOrderGraphqlService extends BaseGraphqlService {

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
  // Get a single sales order by ID
  public getSalesOrder(id: string): Observable<any> {
    const variables = { id };
    return this.query(getSalesOrder, variables, 'GetSalesOrder');
  }

  // List all sales orders (paginated)
  public listSalesOrders(limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit, filter, nextToken };
    return this.query(listSalesOrders, variables, 'ListSalesOrders');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createSalesOrder(input: any): Observable<any> {
    return this.create(input, createSalesOrder, 'CreateSalesOrder');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updateSalesOrder(input: any): Observable<any> {
    return this.update(input, updateSalesOrder, 'UpdateSalesOrder');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deleteSalesOrder(input: any): Observable<any> {
    return this.delete(input, deleteSalesOrder, 'DeleteSalesOrder');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreateSalesOrder(variables?: any): Observable<any> {
    return this.subscribe(onCreateSalesOrder, variables || {}, 'OnCreateSalesOrder');
  }

  public onUpdateSalesOrder(variables?: any): Observable<any> {
    return this.subscribe(onUpdateSalesOrder, variables || {}, 'OnUpdateSalesOrder');
  }

  public onDeleteSalesOrder(variables?: any): Observable<any> {
    return this.subscribe(onDeleteSalesOrder, variables || {}, 'OnDeleteSalesOrder');
  }

} // End class
