import {
  Injectable,
  inject,
  signal,
  computed,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface DataLoadCompletionCallback {
  (): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector);

  // State signals
  private _currentUser = signal<AuthUser | null>(null);
  private _loading = signal<boolean>(true);
  private _error = signal<string | null>(null);

  // Callback to wait for data loading after sign in
  private dataLoadCallback: DataLoadCompletionCallback | null = null;

  // Computed values
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  // Observable for auth state changes
  user$: Observable<User | null> = user(this.auth);

  constructor() {
    // Initialize auth state listener
    this.initializeAuthState();
  }

  /**
   * Register a callback that will be called to wait for data loading completion
   */
  registerDataLoadCallback(callback: DataLoadCompletionCallback): void {
    this.dataLoadCallback = callback;
  }

  /**
   * Initialize auth state listener
   */
  private initializeAuthState(): void {
    this.user$.subscribe({
      next: (user: User | null) => {
        if (user) {
          this._currentUser.set({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } else {
          this._currentUser.set(null);
        }
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Auth state change error:', error);
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }

  async signInWithGoogle(): Promise<AuthUser | null> {
    return runInInjectionContext(this.injector, async () => {
      try {
        this._loading.set(true);
        this._error.set(null);

        const provider = new GoogleAuthProvider();
        // Add additional scopes if needed
        provider.addScope('profile');
        provider.addScope('email');

        // Set additional security parameters
        provider.setCustomParameters({
          prompt: 'select_account',
          // hd: 'yourdomain.com' // Uncomment and set to restrict to specific domain
        });

        this._error.set(null);

        const result = await signInWithPopup(this.auth, provider);

        if (result.user) {
          const authUser: AuthUser = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };

          this._currentUser.set(authUser);

          // Wait for data to load from Firestore before resolving
          if (this.dataLoadCallback) {
            await this.dataLoadCallback();
          }

          return authUser;
        }

        return null;
      } catch (error: any) {
        console.error('Google sign-in error:', error);

        // Handle specific Firebase Auth errors
        let errorMessage = 'Failed to sign in with Google';

        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign in was cancelled. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
          errorMessage = 'Sign in was blocked by your browser. Please allow popups and try again.';
        } else if (error.code === 'auth/cancelled-popup-request') {
          errorMessage = 'Sign in was cancelled. Please try again.';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.code === 'auth/unauthorized-domain') {
          errorMessage = 'This domain is not authorized for OAuth operations.';
        } else if (error.code === 'auth/internal-error') {
          errorMessage = 'An internal error occurred. Please try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        this._error.set(errorMessage);

        throw error;
      } finally {
        // Always set loading to false since we're using popup for all devices
        this._loading.set(false);
      }
    });
  }

  async signOut(): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        this._loading.set(true);
        this._error.set(null);

        await signOut(this.auth);
        this._currentUser.set(null);
        localStorage.clear();
        window.location.reload();
      } catch (error: any) {
        console.error('Sign out error:', error);
        this._error.set(error.message || 'Failed to sign out');
        throw error;
      } finally {
        this._loading.set(false);
      }
    });
  }

  clearError(): void {
    this._error.set(null);
  }

  /**
   * Detect if the current device is mobile
   */
  private isMobileDevice(): boolean {
    // Check for mobile user agents
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUserAgent = mobileRegex.test(navigator.userAgent);

    // Check for narrow screens (but be more specific than just width)
    const isNarrowScreen = window.innerWidth <= 768;

    // Check for touch capability
    const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Return true if it's a mobile user agent OR (narrow screen AND touch support)
    return isMobileUserAgent || (isNarrowScreen && hasTouchSupport);
  }
}
