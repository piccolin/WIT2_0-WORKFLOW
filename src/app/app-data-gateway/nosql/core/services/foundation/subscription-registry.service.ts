/**
 * @Filename:    subscription-registry.service.ts
 * @Type:        Service (Angular)
 * @Date:        2026-01-26
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   SubscriptionRegistryService – Centralized subscription tracking & cleanup.
 *   - Keeps Angular components clean by centralizing unsubscription
 *   - Supports:
 *       a) manual "scope" cleanup (destroy a view / component / feature module)
 *       b) automatic cleanup on Angular navigation (optional; enabled by default)
 *
 * Usage:
 *   // In component:
 *   private scope = this.subs.createScope('MyComponent');
 *
 *   ngOnInit() {
 *     this.subs.track(this.scope, this.tenantDb.observeTenants().subscribe(...));
 *   }
 *
 *   ngOnDestroy() {
 *     this.subs.destroyScope(this.scope);
 *   }
 */

import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

export type SubscriptionScope = string;
export type UnsubscribableLike = { unsubscribe(): void };

@Injectable({
  providedIn: 'root'
})
export class SubscriptionRegistryService {

  /**
   * Toggle: automatically clean up scopes that are marked as "routeScoped"
   * whenever Angular navigation starts.
   */
  private readonly AUTO_CLEANUP_ON_NAVIGATION: boolean = true;

  private readonly scopes = new Map<SubscriptionScope, Set<UnsubscribableLike>>();
  private readonly routeScoped = new Set<SubscriptionScope>();

  constructor(private readonly router: Router) {
    if (this.AUTO_CLEANUP_ON_NAVIGATION) {
      this.router.events
        .pipe(filter((e) => e instanceof NavigationStart))
        .subscribe(() => {
          // Destroy only route-scoped subscriptions on navigation
          for (const scope of Array.from(this.routeScoped)) {
            this.destroyScope(scope);
          }
        });
    }

    console.log('💾 UI On-Load Event: %s initiated via constructor', this.constructor.name);
  }

  // -----------------------------------------------------------------
  // Scope Management
  // -----------------------------------------------------------------

  /**
   * Create a named scope to group subscriptions.
   * Example scopes:
   * - "AdminUsersPage"
   * - "TenantSwitcher"
   * - "HouseholdProfileForm"
   */
  public createScope(scopeName: string, options?: { routeScoped?: boolean }): SubscriptionScope {
    const scope: SubscriptionScope = scopeName;

    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, new Set<UnsubscribableLike>());
    }

    if (options?.routeScoped) {
      this.routeScoped.add(scope);
    }

    return scope;
  }

  /**
   * Track a subscription under a scope.
   * Returns the same subscription for convenience.
   */
  public track<T extends UnsubscribableLike>(scope: SubscriptionScope, sub: T): T {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, new Set<UnsubscribableLike>());
    }
    this.scopes.get(scope)!.add(sub);
    return sub;
  }

  /**
   * Unsubscribe everything in a scope and remove it.
   */
  public destroyScope(scope: SubscriptionScope): void {
    const set = this.scopes.get(scope);
    if (!set) return;

    for (const sub of Array.from(set)) {
      try {
        sub.unsubscribe();
      } catch (e) {
        console.warn(`⚠️ SubscriptionRegistryService failed to unsubscribe for scope <${scope}>`, e);
      }
    }

    set.clear();
    this.scopes.delete(scope);
    this.routeScoped.delete(scope);
  }

  /**
   * Destroy ALL scopes (rare; use with caution).
   * Useful for hard sign-out flows.
   */
  public destroyAll(): void {
    for (const scope of Array.from(this.scopes.keys())) {
      this.destroyScope(scope);
    }
  }
}
