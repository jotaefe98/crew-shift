import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';
import { UserSettingsService, ShiftService, AuthService } from '../../../core/services';
import { WeekStartDay, WEEK_START_DAY_OPTIONS } from '../../../core/models';

interface DropdownOption {
  label: string;
  value: WeekStartDay;
}

@Component({
  selector: 'app-settings-modal',
  imports: [
    FormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    DividerModule,
    ToggleSwitchModule,
    ConfirmDialogModule,
    MessageModule,
  ],
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="onVisibilityChange($event)"
      [modal]="true"
      [resizable]="false"
      [draggable]="false"
      header="Settings"
      [style]="{ width: '400px' }"
      styleClass="settings-modal"
      [closable]="true"
    >
      <div class="settings-content">
        <div class="setting-group">
          <label for="weekStartDay" class="setting-label">
            <i class="pi pi-calendar" style="margin-right: 8px;"></i>
            Week starts on
          </label>
          <p-select
            id="weekStartDay"
            [ngModel]="tempWeekStartDay()"
            (ngModelChange)="onWeekStartDayChange($event)"
            [options]="weekStartDayOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select day"
            class="setting-dropdown"
          />
          <small class="setting-description">
            Choose which day should be the first day of the week in the calendar
          </small>
        </div>

        <p-divider />

        <div class="setting-group">
          <label for="showDayLabels" class="setting-label">
            <i class="pi pi-eye" style="margin-right: 8px;"></i>
            Show shift labels
          </label>
          <div class="toggle-wrapper">
            <p-toggleswitch
              id="showDayLabels"
              [ngModel]="tempShowDayLabels()"
              (ngModelChange)="onShowDayLabelsChange($event)"
            />
            <span class="toggle-label">
              {{ tempShowDayLabels() ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
          <small class="setting-description">
            Display shift labels (Early, Late, Off, A/L) on each calendar day
          </small>
        </div>

        <p-divider />

        <!-- Authentication Section -->
        <div class="setting-group">
          <label class="setting-label">
            <i class="pi pi-user" style="margin-right: 8px;"></i>
            Account & Sync
          </label>

          @if (authService.error()) {
          <p-message severity="error" [text]="authService.error()!" styleClass="auth-error" />
          } @if (authService.isAuthenticated()) {
          <!-- User is signed in -->
          <div class="user-profile">
            <div class="user-avatar-placeholder">
              <i class="pi pi-user"></i>
            </div>
            <div class="user-info">
              <div class="user-name">{{ authService.currentUser()?.displayName || 'User' }}</div>
              <div class="user-email">{{ authService.currentUser()?.email }}</div>
              <div class="sync-status">
                <i class="pi pi-check-circle sync-icon"></i>
                Data synced across devices
              </div>
            </div>
          </div>
          <p-button
            label="Sign Out"
            icon="pi pi-sign-out"
            styleClass="p-button-outlined p-button-danger sign-out-button"
            (onClick)="signOut()"
            [loading]="authService.loading()"
          />
          } @else {
          <!-- User is not signed in -->
          <div class="auth-benefits">
            <div class="benefit-item">
              <i class="pi pi-sync"></i>
              <span>Sync your preferences across all devices</span>
            </div>
            <div class="benefit-item">
              <i class="pi pi-shield"></i>
              <span>Backup your shift modifications</span>
            </div>
            <div class="benefit-item">
              <i class="pi pi-users"></i>
              <span>Access from anywhere with your account</span>
            </div>
          </div>
          <p-button
            label="Sign in with Google"
            icon="pi pi-google"
            styleClass="google-signin-button"
            (onClick)="signInWithGoogle()"
            [loading]="authService.loading()"
          />
          }
          <small class="setting-description">
            Sign in to sync your preferences and modifications across devices. Your data stays
            private and secure.
          </small>
        </div>

        <p-divider />

        <div class="setting-group">
          <label class="setting-label">
            <i class="pi pi-undo" style="margin-right: 8px;"></i>
            Reset shift modifications
          </label>
          <p-button
            label="Restore All Days"
            [text]="true"
            severity="danger"
            (onClick)="restoreAllDays()"
            class="restore-button"
          />
          <small class="setting-description">
            Remove all manual shift modifications and restore all days to their original shift
            pattern
          </small>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button
            label="Save"
            icon="pi pi-check"
            (onClick)="saveSettings()"
            [disabled]="!hasChanges()"
          />
        </div>
      </ng-template>
    </p-dialog>

    <p-confirmDialog />
  `,
  styles: [
    `
      .settings-content {
        padding: 1rem 0;
      }

      .setting-group {
        margin-bottom: 1.5rem;
      }

      .setting-label {
        display: flex;
        align-items: center;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .setting-dropdown {
        width: 100%;
        margin-bottom: 0.5rem;
      }

      :host ::ng-deep .setting-dropdown {
        width: 100%;
      }

      .setting-description {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        line-height: 1.4;
      }

      .toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .toggle-label {
        font-size: 0.875rem;
        color: var(--text-color);
        font-weight: 500;
      }

      .restore-button {
        width: 100%;
        margin-bottom: 0.5rem;
      }

      :host ::ng-deep .restore-button {
        width: 100%;
      }

      :host ::ng-deep .restore-button .p-button {
        width: 100%;
        justify-content: center;
      }

      /* Authentication Styles */
      .user-profile {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .user-avatar-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary-100);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--surface-border);
      }

      .user-avatar-placeholder i {
        font-size: 1.5rem;
        color: var(--primary-color);
      }

      .user-info {
        flex: 1;
      }

      .user-name {
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }

      .user-email {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        margin-bottom: 0.5rem;
      }

      .sync-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--green-600);
      }

      .sync-icon {
        font-size: 1rem;
      }

      .auth-benefits {
        margin-bottom: 1rem;
      }

      .benefit-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
        color: var(--text-color);
      }

      .benefit-item i {
        color: var(--primary-color);
        font-size: 1rem;
        width: 16px;
      }

      .google-signin-button {
        width: 100%;
        margin-bottom: 0.5rem;
      }

      :host ::ng-deep .google-signin-button {
        width: 100%;
        background: #4285f4;
        border-color: #4285f4;
      }

      :host ::ng-deep .google-signin-button:hover {
        background: #3367d6 !important;
        border-color: #3367d6 !important;
      }

      .sign-out-button {
        width: 100%;
        margin-bottom: 0.5rem;
      }

      :host ::ng-deep .sign-out-button {
        width: 100%;
      }

      :host ::ng-deep .auth-error {
        margin-bottom: 1rem;
      }

      .dialog-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }

      :host ::ng-deep .settings-modal {
        .p-dialog-header {
          padding: 1.25rem 1.5rem 1rem 1.5rem;
        }

        .p-dialog-content {
          padding: 0 1.5rem;
        }

        .p-dialog-footer {
          padding: 1rem 1.5rem 1.25rem 1.5rem;
        }
      }

      @media (max-width: 480px) {
        :host ::ng-deep .settings-modal .p-dialog {
          width: 90vw !important;
          margin: 1rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsModal {
  private userSettingsService = inject(UserSettingsService);
  private shiftService = inject(ShiftService);
  private confirmationService = inject(ConfirmationService);
  protected authService = inject(AuthService);

  // Inputs
  visible = input.required<boolean>();

  // Outputs
  visibilityChange = output<boolean>();

  // Component state - use computed to always get fresh values from service
  tempWeekStartDay = signal<WeekStartDay>(WeekStartDay.SUNDAY);
  tempShowDayLabels = signal<boolean>(false);

  // Track if user has made changes in this session
  private userMadeChanges = signal<boolean>(false);

  // Get current values from service as computed signals
  private currentWeekStartDay = computed(() => this.userSettingsService.weekStartDay());
  private currentShowShiftLabels = computed(() => this.userSettingsService.showShiftLabels());

  // Computed properties
  hasChanges = computed(
    () =>
      this.tempWeekStartDay() !== this.currentWeekStartDay() ||
      this.tempShowDayLabels() !== this.currentShowShiftLabels()
  );

  weekStartDayOptions: DropdownOption[] = WEEK_START_DAY_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  constructor() {
    // Initialize temp values with current settings from service
    effect(() => {
      // Only update temp values if user hasn't made changes yet
      if (!this.userMadeChanges()) {
        this.tempWeekStartDay.set(this.currentWeekStartDay());
        this.tempShowDayLabels.set(this.currentShowShiftLabels());
      }
    });
  }

  onWeekStartDayChange(value: WeekStartDay): void {
    this.tempWeekStartDay.set(value);
    this.userMadeChanges.set(true);
  }

  onShowDayLabelsChange(value: boolean): void {
    this.tempShowDayLabels.set(value);
    this.userMadeChanges.set(true);
  }

  async saveSettings(): Promise<void> {
    // Save the temporary settings to the service
    await this.userSettingsService.updateWeekStartDay(this.tempWeekStartDay());
    await this.userSettingsService.updateShowShiftLabels(this.tempShowDayLabels());

    // Reset change tracking
    this.userMadeChanges.set(false);

    // Close the modal
    this.visibilityChange.emit(false);
  }

  closeWithoutSaving(): void {
    // Reset temporary settings to current service values
    this.tempWeekStartDay.set(this.currentWeekStartDay());
    this.tempShowDayLabels.set(this.currentShowShiftLabels());

    // Reset change tracking
    this.userMadeChanges.set(false);

    // Close the modal
    this.visibilityChange.emit(false);
  }

  onVisibilityChange(visible: boolean): void {
    if (!visible) {
      // Modal is being closed (including by the X button)
      this.closeWithoutSaving();
    }
  }

  closeModal(): void {
    this.closeWithoutSaving();
  }

  restoreAllDays(): void {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to restore all days to their original shift pattern? This will remove all manual modifications.',
      header: 'Restore All Days',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Yes, Restore',
      rejectLabel: 'Cancel',
      accept: async () => {
        await this.shiftService.restoreAllDays();
        // Close the modal after restoring
        this.visibilityChange.emit(false);
      },
    });
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
      // Clear any previous errors
      this.authService.clearError();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      // Error is already handled by the service
    }
  }

  async signOut(): Promise<void> {
    this.confirmationService.confirm({
      message:
        "Are you sure you want to sign out? Your local data will be preserved, but you won't be able to sync across devices.",
      header: 'Sign Out',
      icon: 'pi pi-question-circle',
      acceptIcon: 'pi pi-sign-out',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Yes, Sign Out',
      rejectLabel: 'Cancel',
      accept: async () => {
        try {
          await this.authService.signOut();
          this.authService.clearError();
        } catch (error) {
          console.error('Sign out failed:', error);
        }
      },
    });
  }
}
