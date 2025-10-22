import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { UserSettings, WeekStartDay, CrewType } from '../models';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private _settings = signal<UserSettings>(this.loadSettings());

  // Public computed signals
  settings = computed(() => this._settings());
  weekStartDay = computed(() => this._settings().weekStartDay);
  showShiftLabels = computed(() => this._settings().showShiftLabels);
  theme = computed(() => this._settings().theme);
  selectedCrew = computed(() => this._settings().selectedCrew);
  hasCompletedInitialSetup = computed(() => this._settings().hasCompletedInitialSetup);
  orderedWeekDays = computed(() => {
    const defaultDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startDay = this.weekStartDay();
    return [...defaultDays.slice(startDay), ...defaultDays.slice(0, startDay)];
  });

  constructor() {
    this.authService.user$.subscribe(async (user) => {
      await this.storageService.waitForInitialization();
      const newSettings = this.loadSettings();
      this._settings.set(newSettings);
    });

    this.storageService.onDataChange().subscribe(() => {
      const newSettings = this.loadSettings();
      this._settings.set(newSettings);
    });
  }

  async updateSettings(newSettings: Partial<UserSettings>): Promise<void> {
    const currentSettings = this._settings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    this._settings.set(updatedSettings);
    await this.saveSettings(updatedSettings);
  }

  async updateWeekStartDay(weekStartDay: WeekStartDay): Promise<void> {
    await this.updateSettings({ weekStartDay });
  }

  async updateShowShiftLabels(showShiftLabels: boolean): Promise<void> {
    await this.updateSettings({ showShiftLabels });
  }

  async updateSelectedCrew(crew: CrewType): Promise<void> {
    await this.updateSettings({
      selectedCrew: crew,
      hasCompletedInitialSetup: true,
    });
  }

  private loadSettings(): UserSettings {
    return this.storageService.getUserSettings();
  }

  private async saveSettings(settings: UserSettings): Promise<void> {
    await this.storageService.setUserSettings(settings);
  }
}
