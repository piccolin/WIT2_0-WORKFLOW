/**
 * @Filename:    dashboard.component.ts
 * @Type:        Component (Angular Standalone)
 * @Date:        2026-01-30
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   DashboardComponent – app shell layout with a collapsible left navigation.
 *    1) Uses Angular Material sidenav + toolbar for a clean, responsive layout
 *    2) Supports "collapsed" (icons-only) and "expanded" (icon + label) nav modes
 *    3) Switches to mobile-friendly overlay sidenav for small screens
 *
 * @Data Sources:
 *   - Navigation items → local config list rendered into the side nav
 *
 * @Services Used:
 *   - BreakpointObserver:
 *     1) detects handset sizing to switch between "side" vs "over" nav behavior
 *
 * @TODOs:
 *   - [Optional] Replace placeholder nav links with real feature routes
 *
 * @Notes:
 *   - Standalone component imports Angular Material modules directly.
 */

import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';


import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {MatCard} from "@angular/material/card";
type MatchStatus = 'ok' | 'warn' | 'stop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    LayoutModule,

    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatCard
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class DashboardComponent implements OnDestroy {

  // -----------------------------------------------------------------
  // Runtime State
  // -----------------------------------------------------------------

  public isCollapsed: boolean = false;
  public isHandset: boolean = false;

  public readonly appTitle: string = 'Dashboard';

  public readonly navItems: Array<{
    label: string;
    icon: string;
    route: string;
    exact?: boolean;
  }> = [
    { label: 'Dashboard',      icon: 'dashboard',   route: '/dashboard/home', exact: true },
    { label: 'Mange Orders',   icon: 'event',       route: '/dashboard/schedule' },
    { label: 'Double Check',   icon: 'groups',      route: '/dashboard/teams' },
    ];

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------

  private readonly destroy$ = new Subject<void>();

  // -----------------------------------------------------------------
  // View References
  // -----------------------------------------------------------------

  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;

  // -----------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        takeUntil(this.destroy$)
      )
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;

        // Mobile: keep the nav in full mode (icons-only is less useful on small screens)
        if (isHandset) {
          this.isCollapsed = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -----------------------------------------------------------------
  // UI Handlers - User Action Handlers
  // -----------------------------------------------------------------

  public toggleCollapse(): void {
    // Collapse only makes sense in desktop "side" mode.
    if (this.isHandset) return;
    this.isCollapsed = !this.isCollapsed;
  }

  public toggleSidenav(): void {
    // Mobile: open/close overlay nav
    if (!this.sidenav) return;
    this.sidenav.toggle();
  }

  public closeSidenavIfHandset(): void {
    // Mobile: close the nav after selecting a page.
    if (!this.isHandset || !this.sidenav) return;
    this.sidenav.close();
  }

  // -----------------------------------------------------------------
// Business Logic
// -----------------------------------------------------------------



// Placeholder financials (wire to real data later)
  public readonly revenue: number = 168000;
  public readonly cogs: number = 115660;

  public get grossProfit(): number {
    return this.revenue - this.cogs;
  }

  public get grossProfitMargin(): number {
    return this.revenue > 0 ? this.grossProfit / this.revenue : 0;
  }

// Placeholder order totals (wire to real data later)
  public readonly salesOrderTotal: number = 12500;
  public readonly purchaseOrderTotal: number = 12500;
  public readonly confirmationOrderTotal: number = 12600;

  public get salesOrderStatus(): MatchStatus {
    return this.calcMatchStatus(this.salesOrderTotal, this.purchaseOrderTotal, this.confirmationOrderTotal);
  }

  public get purchaseOrderStatus(): MatchStatus {
    return this.calcMatchStatus(this.purchaseOrderTotal, this.salesOrderTotal, this.confirmationOrderTotal);
  }

  public get confirmationOrderStatus(): MatchStatus {
    return this.calcMatchStatus(this.confirmationOrderTotal, this.salesOrderTotal, this.purchaseOrderTotal);
  }

  public statusIcon(status: MatchStatus): string {
    if (status === 'ok') return 'check_circle';
    if (status === 'warn') return 'warning';
    return 'cancel';
  }

  public statusLabel(status: MatchStatus): string {
    if (status === 'ok') return 'Match';
    if (status === 'warn') return 'Close';
    return 'Mismatch';
  }

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------

  private calcMatchStatus(sourceValue: number, compareA: number, compareB: number): MatchStatus {
    // 1) Exact match => green check
    if (sourceValue === compareA && sourceValue === compareB) return 'ok';

    // 2) Close enough (within 1%) => caution
    const withinA = this.percentDiff(sourceValue, compareA) <= 0.01;
    const withinB = this.percentDiff(sourceValue, compareB) <= 0.01;
    if (withinA && withinB) return 'warn';

    // 3) Anything else => red stop
    return 'stop';
  }

  private percentDiff(a: number, b: number): number {
    const denom = Math.max(Math.abs(a), 1);
    return Math.abs(a - b) / denom;
  }

}
