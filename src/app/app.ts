import { Component, inject, computed, signal, effect } from '@angular/core';
import { CalendarView } from './pages/calendar-view/calendar-view';
import { CrewSelectionModal } from './shared/components';
import {
  UserSettingsService,
  StorageService,
  AnalyticsService,
  AuthService,
} from './core/services';

@Component({
  selector: 'app-root',
  imports: [CalendarView, CrewSelectionModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private userSettingsService = inject(UserSettingsService);
  private storageService = inject(StorageService);
  private analyticsService = inject(AnalyticsService);
  private authService = inject(AuthService);

  // Check if initial setup is completed
  hasCompletedSetup = computed(() => this.userSettingsService.hasCompletedInitialSetup());
  selectedCrew = computed(() => this.userSettingsService.selectedCrew());

  // Track loading state
  isLoadingData = signal<boolean>(false);

  constructor() {
    // Monitor storage loading state
    effect(() => {
      this.isLoadingData.set(this.storageService.isLoading());
    });

    // Track connection once data is loaded
    effect(() => {
      if (!this.isLoadingData()) {
        const userType = this.authService.isAuthenticated() ? 'authenticated' : 'guest';
        this.analyticsService.trackConnection(userType);
      }
    });
  }

  // Show crew selection modal if setup is not completed and data is loaded
  showCrewSelection = computed(() => !this.hasCompletedSetup() && !this.isLoadingData());
}
