import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import {Router, ActivatedRoute, RouterOutlet} from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { getCurrentUser } from 'aws-amplify/auth';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AmplifyAuthenticatorModule, RouterOutlet],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authenticator = inject(AuthenticatorService);
  private cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  ngOnInit(): void {
    // Poll authStatus every 250ms until authenticated (max ~8s to prevent infinite loop)
    this.sub.add(
      interval(250)
        .pipe(takeWhile(() => !this.sub.closed, true))
        .subscribe(() => {
          this.cdr.detectChanges(); // Ensure facade updates are detected

          // Check authStatus (official simple string from docs)
          if (this.authenticator.authStatus === 'authenticated' && this.authenticator.user) {
            // Tokens may not be ready yet – wait & confirm
            setTimeout(async () => {
              try {
                await getCurrentUser(); // Hydrates/validates session
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/product';
                console.log('Login success → redirecting to', returnUrl);
                await this.router.navigateByUrl(returnUrl);
              } catch (error) {
                console.warn('Tokens still loading, retrying...');
                // One retry if needed
                setTimeout(() => this.redirectIfReady(), 300);
              }
            }, 400); // 400ms magic delay for token readiness in v5.1.6
            this.sub.unsubscribe(); // Stop polling on first success
          }
        })
    );
  }

  // Helper for retry
  private async redirectIfReady(): Promise<void> {
    try {
      await getCurrentUser();
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/product';
      await this.router.navigateByUrl(returnUrl);
    } catch {
      // Still not ready – let polling handle it
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}


