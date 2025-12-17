/**
 * @Filename:    ConfirmationOrderGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * ========================================================================
 * ConfirmationOrderGraphqlService – Confirmation Order Data GraphQL Operations
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service';

// Queries
import { getConfirmationOrder, listConfirmationOrders } from '@scr/graphql/queries';
// Mutations
import { createConfirmationOrder, updateConfirmationOrder, deleteConfirmationOrder } from '@scr/graphql/mutations';
// Subscriptions
import { onCreateConfirmationOrder, onUpdateConfirmationOrder, onDeleteConfirmationOrder } from '@scr/graphql/subscriptions';

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
export class ConfirmationOrderGraphqlService extends BaseGraphqlService {

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
  public getConfirmationOrder(id: string): Observable<any> {
    const variables = { id };
    return this.query(getConfirmationOrder, variables, 'GetConfirmationOrder');
  }

  public listConfirmationOrders(limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit, filter, nextToken };
    return this.query(listConfirmationOrders, variables, 'ListConfirmationOrders');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createConfirmationOrder(input: any): Observable<any> {
    return this.create(input, createConfirmationOrder, 'CreateConfirmationOrder');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updateConfirmationOrder(input: any): Observable<any> {
    return this.update(input, updateConfirmationOrder, 'UpdateConfirmationOrder');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deleteConfirmationOrder(input: any): Observable<any> {
    return this.delete(input, deleteConfirmationOrder, 'DeleteConfirmationOrder');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreateConfirmationOrder(variables?: any): Observable<any> {
    return this.subscribe(onCreateConfirmationOrder, variables || {}, 'OnCreateConfirmationOrder');
  }

  public onUpdateConfirmationOrder(variables?: any): Observable<any> {
    return this.subscribe(onUpdateConfirmationOrder, variables || {}, 'OnUpdateConfirmationOrder');
  }

  public onDeleteConfirmationOrder(variables?: any): Observable<any> {
    return this.subscribe(onDeleteConfirmationOrder, variables || {}, 'OnDeleteConfirmationOrder');
  }

} // End class

