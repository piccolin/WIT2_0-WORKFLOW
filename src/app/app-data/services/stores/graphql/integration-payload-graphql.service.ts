/**
 * @Filename:    IntegrationPayloadGraphqlService
 * @Type:        Service
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * ========================================================================
 * IntegrationPayloadGraphqlService – Integration Payload GraphQL Operations
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseGraphqlService } from '@app/app-data/services/core/base-graphql.service';

// Queries
import { getIntegrationPayload, listIntegrationPayloads } from '@scr/graphql/queries';
// Mutations
import { createIntegrationPayload, updateIntegrationPayload, deleteIntegrationPayload } from '@scr/graphql/mutations';
// Subscriptions
import { onCreateIntegrationPayload, onUpdateIntegrationPayload, onDeleteIntegrationPayload } from '@scr/graphql/subscriptions';

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
export class IntegrationPayloadGraphqlService extends BaseGraphqlService {

  // -----------------------------------------------------------------
  // Lifecycle - Constructor
  // -----------------------------------------------------------------
  constructor() {
    super();
    console.log('💾 UI On-Load Event: %s initiated via constructor', this.constructor.name);
  }
  //
  // // -----------------------------------------------------------------
  // // Queries
  // // -----------------------------------------------------------------
  // public getIntegrationPayload(id: string): Observable<any> {
  //   const variables = { id };
  //   return this.query(getIntegrationPayload, variables, 'GetIntegrationPayload');
  // }
  //
  // public listIntegrationPayloads(limit?: number, filter?: any, nextToken?: string): Observable<any> {
  //   const queryLimit = !!limit ? limit : 1000;
  //   const variables = { limit: queryLimit, filter, nextToken };
  //   return this.query(listIntegrationPayloads, variables, 'ListIntegrationPayloads');
  // }

  // -----------------------------------------------------------------
  // Mutations - Creates
  // -----------------------------------------------------------------
  public createIntegrationPayload(input: any): Observable<any> {
    return this.create(input, createIntegrationPayload, 'CreateIntegrationPayload');
  }

  // -----------------------------------------------------------------
  // Mutations - Updates
  // -----------------------------------------------------------------
  public updateIntegrationPayload(input: any): Observable<any> {
    return this.update(input, updateIntegrationPayload, 'UpdateIntegrationPayload');
  }

  // -----------------------------------------------------------------
  // Mutations - Deletes
  // -----------------------------------------------------------------
  public deleteIntegrationPayload(input: any): Observable<any> {
    return this.delete(input, deleteIntegrationPayload, 'DeleteIntegrationPayload');
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------
  public onCreateIntegrationPayload(variables?: any): Observable<any> {
    return this.subscribe(onCreateIntegrationPayload, variables || {}, 'OnCreateIntegrationPayload');
  }

  public onUpdateIntegrationPayload(variables?: any): Observable<any> {
    return this.subscribe(onUpdateIntegrationPayload, variables || {}, 'OnUpdateIntegrationPayload');
  }

  public onDeleteIntegrationPayload(variables?: any): Observable<any> {
    return this.subscribe(onDeleteIntegrationPayload, variables || {}, 'OnDeleteIntegrationPayload');
  }

} // End class
