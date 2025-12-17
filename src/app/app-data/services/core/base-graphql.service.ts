/**
 * ========================================================================
 * BaseGraphqlService – Helper for GraphQL Operations
 * ========================================================================
 *
 * Centralized service for queries, mutations, subscriptions with AWS Amplify v6 (modular/Gen 2).
 * Wraps generateClient for type-safe GraphQL calls, returns RxJS Observables.
 *
 * • Supports query, create, update, delete, subscribe
 * • Built-in error handling and debug logging
 * • RxJS integration for Angular async patterns
 *
 * Tech: Angular 18+, Amplify v6 (^6.0.0), RxJS 7+
 * ========================================================================
 */

import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// -----------------------------------------------------------------
// DI - Client Instance (singleton for efficiency)
// -----------------------------------------------------------------
@Injectable({
  providedIn: 'root' // Available everywhere in the app
})
export class BaseGraphqlService {
  private client = generateClient(); // v6: Generate once, reuse across ops
  private DEBUG: boolean = false; // Set to true to see extra logs for debugging

  // -----------------------------------------------------------------
  // Lifecycle - Constructor
  // -----------------------------------------------------------------
  constructor() {
    // Log when this service is created
    console.log('💾 UI On-Load Event: %s started', this.constructor.name);
  }

    // This method gets data from the backend (like a list or a single item)
  public query<Data>(
    query: any, // The GraphQL query document (imported from ./graphql/queries)
    variables: any = {}, // Extra details for the query (like IDs or filters)
    queryDescription?: string // Optional name for the query
  ): Observable<Data> {
    // Create a name for the query (use provided name or get it from the query)
    const description = queryDescription || query.definitions[0].name.value;

    // Log what we’re doing if debug is on
    if (this.DEBUG) {
      console.debug(new Date().toISOString(), `🗄️ Asking for <${description}> with details:`, variables);
    }

    // v6: client.graphql returns Promise<{ data: Data; errors?: [] }>, wrap in from()
    return from(
      this.client.graphql({
        query,
        variables,
      }) as Promise<{ data: Data; errors?: any[] }>
    ).pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          console.error(new Date().toISOString(), `🗄️ Error in <${description}> query:`, result.errors);
          throw new Error(`Query ${description} failed`);
        }
        return result.data as Data;
      }),
      catchError((error) => {
        console.error(new Date().toISOString(), `🗄️ Unexpected error in <${description}>:`, error);
        return throwError(() => new Error(`Query ${description} failed unexpectedly`));
      })
    );
  }

  // This method creates a new record in the backend
  public create<Data>(
    input: any, // The data to create
    mutation: any, // The GraphQL mutation document (imported from ./graphql/mutations)
    mutationDescription?: string // Optional name for the mutation
  ): Observable<Data> {
    // Create a name for the mutation
    const description = mutationDescription || mutation.definitions[0].name.value;

    // Log what we’re doing if debug is on
    if (this.DEBUG) {
      console.debug(new Date().toISOString(), `🗄️ Creating <${description}> with data:`, input);
    }

    // v6: client.graphql with mutation
    return from(
      this.client.graphql({
        query: mutation,
        variables: { input }
      }) as Promise<{ data: Data; errors?: any[] }>
    ).pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          console.error(new Date().toISOString(), `🗄️ Error in <${description}> creation:`, result.errors);
          throw new Error(`Creation ${description} failed`);
        }
        return result.data as Data;
      }),
      catchError((error) => {
        console.error(new Date().toISOString(), `🗄️ Unexpected error in <${description}> creation:`, error);
        return throwError(() => new Error(`Creation ${description} failed unexpectedly`));
      })
    );
  }

  // This method updates an existing record in the backend
  public update<Data>(
    input: any, // The updated data
    mutation: any, // The GraphQL mutation document
    mutationDescription?: string // Optional name for the mutation
  ): Observable<Data> {
    // Create a name for the mutation
    const description = mutationDescription || mutation.definitions[0].name.value;

    // Log what we’re doing if debug is on
    if (this.DEBUG) {
      console.debug(new Date().toISOString(), `🗄️ Updating <${description}> with data:`, input);
    }

    // v6: client.graphql with mutation
    return from(
      this.client.graphql({
        query: mutation,
        variables: { input }
      }) as Promise<{ data: Data; errors?: any[] }>
    ).pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          console.error(new Date().toISOString(), `🗄️ Error in <${description}> update:`, result.errors);
          throw new Error(`Update ${description} failed`);
        }
        return result.data as Data;
      }),
      catchError((error) => {
        console.error(new Date().toISOString(), `🗄️ Unexpected error in <${description}> update:`, error);
        return throwError(() => new Error(`Update ${description} failed unexpectedly`));
      })
    );
  }

  // This method deletes a record from the backend
  public delete<Data>(
    input: any, // The data to identify the record to delete
    mutation: any, // The GraphQL mutation document
    mutationDescription?: string // Optional name for the mutation
  ): Observable<Data> {
    // Create a name for the mutation
    const description = mutationDescription || mutation.definitions[0].name.value;

    // Log what we’re doing if debug is on
    if (this.DEBUG) {
      console.debug(new Date().toISOString(), `🗄️ Deleting <${description}> with data:`, input);
    }

    // v6: client.graphql with mutation
    return from(
      this.client.graphql({
        query: mutation,
        variables: { input }
      }) as Promise<{ data: Data; errors?: any[] }>
    ).pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          console.error(new Date().toISOString(), `🗄️ Error in <${description}> deletion:`, result.errors);
          throw new Error(`Deletion ${description} failed`);
        }
        return result.data as Data;
      }),
      catchError((error) => {
        console.error(new Date().toISOString(), `🗄️ Unexpected error in <${description}> deletion:`, error);
        return throwError(() => new Error(`Deletion ${description} failed unexpectedly`));
      })
    );
  }

  // This method sets up a subscription to listen for real-time updates
  public subscribe<Data>(
    subscription: any, // The GraphQL subscription document (imported from ./graphql/subscriptions)
    variables: any = {}, // Extra details for the subscription
    subscriptionDescription?: string // Optional name for the subscription
  ): Observable<Data> {
    // Create a name for the subscription
    const description = subscriptionDescription || subscription.definitions[0].name.value;

    // Log what we’re doing if debug is on
    if (this.DEBUG) {
      console.debug(new Date().toISOString(), `🗄️ Subscribing to <${description}> with details:`, variables);
    }

    // v6: client.graphql for subs returns Observable directly—no from() needed
    const subscriptionObservable = this.client.graphql({
      query: subscription,
      variables
    }) as Observable<{ data: Data; errors?: any[] }>;

    return subscriptionObservable.pipe(
      map((result) => {
        if (result.errors && result.errors.length > 0) {
          console.error(new Date().toISOString(), `🗄️ Error in <${description}> subscription:`, result.errors);
          throw new Error(`Subscription ${description} failed`);
        }
        return result.data as Data;
      }),
      catchError((error) => {
        console.error(new Date().toISOString(), `🗄️ Unexpected error in <${description}> subscription:`, error);
        return throwError(() => new Error(`Subscription ${description} failed unexpectedly`));
      })
    );
  }
}
