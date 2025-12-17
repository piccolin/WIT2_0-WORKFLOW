/**
 * @Filename:    SalesOrderItemsGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * ========================================================================
 * SalesOrderItemsGraphqlService – Sales Order Item Data GraphQL Operations
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service';

// Queries
import { getSalesOrderItems, listSalesOrderItems } from '@scr/graphql/queries';
// Mutations
import { createSalesOrderItems, updateSalesOrderItems, deleteSalesOrderItems } from '@scr/graphql/mutations';
// Subscriptions
import { onCreateSalesOrderItems, onUpdateSalesOrderItems, onDeleteSalesOrderItems } from '@scr/graphql/subscriptions';

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
export class SalesOrderItemsGraphqlService extends BaseGraphqlService {

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
  public getSalesOrderItems(id: string): Observable<any> {
    const variables = { id };
    return this.query(getSalesOrderItems, variables, 'GetSalesOrderItems');
  }

  public listSalesOrderItems(limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit, filter, nextToken };
    return this.query(listSalesOrderItems, variables, 'ListSalesOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createSalesOrderItems(input: any): Observable<any> {
    return this.create(input, createSalesOrderItems, 'CreateSalesOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updateSalesOrderItems(input: any): Observable<any> {
    return this.update(input, updateSalesOrderItems, 'UpdateSalesOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deleteSalesOrderItems(input: any): Observable<any> {
    return this.delete(input, deleteSalesOrderItems, 'DeleteSalesOrderItems');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreateSalesOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onCreateSalesOrderItems, variables || {}, 'OnCreateSalesOrderItems');
  }

  public onUpdateSalesOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onUpdateSalesOrderItems, variables || {}, 'OnUpdateSalesOrderItems');
  }

  public onDeleteSalesOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onDeleteSalesOrderItems, variables || {}, 'OnDeleteSalesOrderItems');
  }

} // End class
