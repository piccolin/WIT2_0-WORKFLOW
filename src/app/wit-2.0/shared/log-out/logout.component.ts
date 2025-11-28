import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { signOut } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { Hub } from 'aws-amplify/utils';

@Component({
  selector: 'wc-shared-log-out',
  standalone: true,
  templateUrl: './logout.component.html',
  styleUrl: './log-out.component.css'
})
export class LogoutComponent implements OnInit, OnDestroy {
  authenticator = inject(AuthenticatorService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // This now holds the stop function returned by Hub.listen()
  private stopHubListener: (() => void) | undefined;

  ngOnInit(): void {
    // Keep UI in sync with AuthenticatorService
    this.authenticator.subscribe(() => this.cdr.markForCheck());

    // Listen to Amplify Hub for instant sign-out detection (official way in Gen2)
    this.stopHubListener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedOut') {
        this.cdr.markForCheck();
        this.router.navigate(['/signin'], { replaceUrl: true });
      }
    });
  }

  async logout(): Promise<void> {
    try {
      await signOut();
      // Hub listener above will handle instant UI update + redirect
    } catch (error) {
      console.error('Logout error:', error);
      await this.router.navigate(['/signin'], {replaceUrl: true});
    }
  }

  ngOnDestroy(): void {
    // Properly clean up the Hub listener
    this.stopHubListener?.();
  }
}
