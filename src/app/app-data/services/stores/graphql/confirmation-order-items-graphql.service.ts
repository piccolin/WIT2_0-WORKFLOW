/**
 * @Filename:    ConfirmationOrderItemsGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * ========================================================================
 * ConfirmationOrderItemsGraphqlService – Confirmation Order Item Data GraphQL Operations
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service';

// Queries
import { getConfirmationOrderItems, listConfirmationOrderItems } from '@scr/graphql/queries';
// Mutations
import { createConfirmationOrderItems, updateConfirmationOrderItems, deleteConfirmationOrderItems } from '@scr/graphql/mutations';
// Subscriptions
import { onCreateConfirmationOrderItems, onUpdateConfirmationOrderItems, onDeleteConfirmationOrderItems } from '@scr/graphql/subscriptions';

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
export class ConfirmationOrderItemsGraphqlService extends BaseGraphqlService {

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
  public getConfirmationOrderItems(id: string): Observable<any> {
    const variables = { id };
    return this.query(getConfirmationOrderItems, variables, 'GetConfirmationOrderItems');
  }

  public listConfirmationOrderItems(limit?: number, filter?: any, nextToken?: string): Observable<any> {
    const queryLimit = !!limit ? limit : 1000;
    const variables = { limit: queryLimit, filter, nextToken };
    return this.query(listConfirmationOrderItems, variables, 'ListConfirmationOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createConfirmationOrderItems(input: any): Observable<any> {
    return this.create(input, createConfirmationOrderItems, 'CreateConfirmationOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updateConfirmationOrderItems(input: any): Observable<any> {
    return this.update(input, updateConfirmationOrderItems, 'UpdateConfirmationOrderItems');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deleteConfirmationOrderItems(input: any): Observable<any> {
    return this.delete(input, deleteConfirmationOrderItems, 'DeleteConfirmationOrderItems');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreateConfirmationOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onCreateConfirmationOrderItems, variables || {}, 'OnCreateConfirmationOrderItems');
  }

  public onUpdateConfirmationOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onUpdateConfirmationOrderItems, variables || {}, 'OnUpdateConfirmationOrderItems');
  }

  public onDeleteConfirmationOrderItems(variables?: any): Observable<any> {
    return this.subscribe(onDeleteConfirmationOrderItems, variables || {}, 'OnDeleteConfirmationOrderItems');
  }

} // End class
