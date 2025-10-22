import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService, AuthUser } from '../../../core/services';

@Component({
  selector: 'app-auth-login',
  imports: [ButtonModule, CardModule, MessageModule],
  template: `
    <div class="auth-container">
      @if (authService.error()) {
      <div class="error-section">
        <p-message severity="error" [text]="authService.error()!" />
        <p-button
          label="Try Again"
          icon="pi pi-refresh"
          (onClick)="retryAuth()"
          [loading]="authService.loading()"
          styleClass="p-button-sm p-button-text retry-button"
        />
      </div>
      } @if (authService.loading()) {
      <div class="loading-section">
        <p-message severity="info" text="Signing you in..." />
      </div>
      }

      <div class="auth-welcome">
        <h2>Welcome to Crew Shift</h2>
        <p>Sign in to save your preferences and access your crew schedules from any device.</p>
      </div>

      <div class="auth-actions">
        <p-button
          label="Sign in with Google"
          icon="pi pi-google"
          (onClick)="signInWithGoogle()"
          [loading]="authService.loading()"
          [disabled]="authService.loading()"
          styleClass="p-button-lg google-button"
        />

        <div class="divider">
          <span>or</span>
        </div>

        <p-button
          label="Continue as Guest"
          icon="pi pi-user"
          (onClick)="continueAsGuest()"
          [loading]="false"
          [disabled]="authService.loading()"
          styleClass="p-button-lg p-button-outlined guest-button"
        />
      </div>

      <div class="auth-info">
        <p class="info-text">
          <i class="pi pi-info-circle"></i>
          Signing in allows you to sync your preferences across devices and backup your data.
        </p>
        <p class="mobile-info">
          <i class="pi pi-mobile"></i>
          On mobile devices, you'll be redirected to complete sign-in.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        padding: 2rem;
        max-width: 400px;
        margin: 0 auto;
      }

      .auth-welcome {
        text-align: center;
        margin-bottom: 2rem;
      }

      .auth-welcome h2 {
        margin: 0 0 1rem 0;
        color: var(--primary-color);
        font-size: 1.75rem;
        font-weight: 600;
      }

      .auth-welcome p {
        margin: 0;
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      .auth-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      :host ::ng-deep .google-button {
        width: 100%;
        justify-content: center;
        background: #4285f4;
        border-color: #4285f4;
      }

      :host ::ng-deep .google-button:hover {
        background: #3367d6;
        border-color: #3367d6;
      }

      :host ::ng-deep .guest-button {
        width: 100%;
        justify-content: center;
      }

      .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 0.5rem 0;
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--surface-border);
      }

      .divider span {
        padding: 0 1rem;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
      }

      .auth-info {
        text-align: center;
      }

      .info-text {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        line-height: 1.4;
      }

      .info-text i {
        margin-right: 0.5rem;
        color: var(--primary-color);
      }

      .error-section {
        margin-bottom: 1rem;
        text-align: center;
      }

      .loading-section {
        margin-bottom: 1rem;
      }

      :host ::ng-deep .retry-button {
        margin-top: 0.5rem;
      }

      .mobile-info {
        margin: 0.5rem 0 0 0;
        color: var(--text-color-secondary);
        font-size: 0.8rem;
        line-height: 1.4;
        display: none;
      }

      .mobile-info i {
        margin-right: 0.5rem;
        color: var(--primary-color);
      }

      :host ::ng-deep p-message {
        margin-bottom: 1rem;
      }

      @media (max-width: 768px) and (pointer: coarse) {
        .mobile-info {
          display: block;
        }
      }

      @media (max-width: 480px) {
        .auth-container {
          padding: 1.5rem 1rem;
        }

        .auth-welcome h2 {
          font-size: 1.5rem;
        }

        .mobile-info {
          display: block;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginComponent {
  protected authService = inject(AuthService);

  // Outputs
  authSuccess = output<AuthUser>();
  guestMode = output<void>();

  async signInWithGoogle(): Promise<void> {
    try {
      this.authService.clearError(); // Clear any previous errors
      const user = await this.authService.signInWithGoogle();
      if (user) {
        this.authSuccess.emit(user);
      }
      // For mobile devices, the method returns null because of redirect
      // The success will be handled by the auth state listener
    } catch (error) {
      console.error('Google sign-in failed:', error);
      // Error is already handled by the service and displayed in the template
    }
  }

  retryAuth(): void {
    // Simply retry the sign-in process
    this.signInWithGoogle();
  }

  continueAsGuest(): void {
    this.guestMode.emit();
  }
}
