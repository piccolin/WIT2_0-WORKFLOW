import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../../../../amplify/data/resource';
import {configureAmplifyOnce} from "@app/app-data-gateway/nosql/core/services/foundation/amplify-bootstrap";

export type Unsubscribable = { unsubscribe(): void };

type AmplifyDataResult<T> = {
  data: T;
  errors?: Array<unknown>;
  nextToken?: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class BaseDataGatewayService {
  protected readonly DEBUG: boolean = false;

  private _client: ReturnType<typeof generateClient<Schema>> | null = null;

  protected get client() {
    if (!this._client) {
      configureAmplifyOnce();              // ✅ guarantee config exists
      this._client = generateClient<Schema>();
    }
    return this._client;
  }

  constructor() {
    console.log('💾 UI On-Load Event: %s initiated via constructor', this.constructor.name);
  }

  protected logDebug(message: string, ...args: Array<unknown>): void {
    if (!this.DEBUG) return;
    console.debug(new Date().toISOString(), message, ...args);
  }

  protected unwrapOrThrow<T>(result: AmplifyDataResult<T>, description: string): T {
    if (result?.errors && result.errors.length > 0) {
      console.error(new Date().toISOString(), `🗄️Error in <${description}>:`, result.errors);
      throw new Error(`Amplify Data error in <${description}>. See console for details.`);
    }
    return result.data;
  }

  protected async safeCall<T>(
    description: string,
    fn: () => Promise<AmplifyDataResult<T>>
  ): Promise<T> {
    try {
      const res = await fn();
      return this.unwrapOrThrow(res, description);
    } catch (error) {
      console.error(new Date().toISOString(), `🗄️Exception in <${description}>:`, error);
      throw error;
    }
  }

  protected asObservable<T>(start: (handlers: {
    next: (value: T) => void;
    error: (err: unknown) => void;
  }) => Unsubscribable): Observable<T> {
    return new Observable<T>((subscriber) => {
      const sub = start({
        next: (value) => subscriber.next(value),
        error: (err) => subscriber.error(err),
      });

      return () => sub.unsubscribe();
    });
  }
}
