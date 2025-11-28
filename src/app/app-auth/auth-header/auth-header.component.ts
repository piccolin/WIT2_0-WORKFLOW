import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { signOut } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { Hub } from 'aws-amplify/utils';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.css'
})
export class AuthHeaderComponent implements OnInit, OnDestroy {
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
        this.router.navigate(['/signup'], { replaceUrl: true });
      }
    });
  }

  async logout(): Promise<void> {
    try {
      await signOut();
      // Hub listener above will handle instant UI update + redirect
    } catch (error) {
      console.error('Logout error:', error);
      this.router.navigate(['/signup'], { replaceUrl: true });
    }
  }

  ngOnDestroy(): void {
    // Properly clean up the Hub listener
    this.stopHubListener?.();
  }
}
