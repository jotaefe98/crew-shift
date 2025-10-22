import {
  Component,
  input,
  output,
  computed,
  inject,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { ShiftType } from '../../../core/models';
import { SHIFT_CONFIG } from '../../../core/constants';
import { ShiftService } from '../../../core/services';

export interface DayTypeOption {
  type: ShiftType;
  label: string;
  description: string;
  severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
  icon: string;
  isOriginal?: boolean;
}

@Component({
  selector: 'app-day-type-selector',
  imports: [Dialog, Button, Divider, Tag],
  templateUrl: './day-type-selector.html',
  styleUrl: './day-type-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTypeSelector {
  visible = input<boolean>(false);
  selectedDate = input<Date | null>(null);
  currentShiftType = input<ShiftType | null>(null);
  originalShiftType = input<ShiftType | null>(null);
  isModified = input<boolean>(false);
  currentCrew = input.required<string>();

  visibleChange = output<boolean>();
  dayTypeSelected = output<{ date: Date; shiftType: ShiftType }>();

  private shiftService = inject(ShiftService);

  // Two-way binding property for dialog visibility
  dialogVisible = signal(false);

  constructor() {
    // Sync input visible with internal dialogVisible signal
    effect(() => {
      this.dialogVisible.set(this.visible());
    });

    // Emit changes when dialogVisible changes
    effect(() => {
      const isVisible = this.dialogVisible();
      this.visibleChange.emit(isVisible);
    });
  }

  // Make ShiftType enum available in template
  readonly ShiftType = ShiftType;

  dayTypeOptions = computed(() => {
    const originalType = this.originalShiftType();
    const isModified = this.isModified();

    const baseOptions: DayTypeOption[] = [
      {
        type: ShiftType.OFF,
        label: 'Day Off',
        description: 'Rest day',
        severity: 'success',
        icon: 'pi pi-calendar-times',
      },
      {
        type: ShiftType.EARLY,
        label: 'Early Shift',
        description: '6:00 AM - 2:00 PM',
        severity: 'info',
        icon: 'pi pi-sun',
      },
      {
        type: ShiftType.LATE,
        label: 'Late Shift',
        description: '2:00 PM - 10:00 PM',
        severity: 'warn',
        icon: 'pi pi-moon',
      },
      {
        type: ShiftType.ANNUAL_LEAVE,
        label: 'Annual Leave',
        description: 'Vacation day',
        severity: 'secondary',
        icon: 'pi pi-calendar-plus',
      },
    ];

    // If modified, mark the original type option as original
    if (isModified && originalType) {
      const originalOptionIndex = baseOptions.findIndex((opt) => opt.type === originalType);
      if (originalOptionIndex !== -1) {
        baseOptions[originalOptionIndex] = {
          ...baseOptions[originalOptionIndex],
          label: `${baseOptions[originalOptionIndex].label} (Original)`,
          isOriginal: true,
        };
      }
    }

    return baseOptions;
  });

  formattedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  annualLeaveInfo = computed(() => {
    const date = this.selectedDate();
    if (!date) return { used: 0, total: SHIFT_CONFIG.ANNUAL_LEAVE_LIMIT };

    const year = date.getFullYear();
    const usedDays = this.shiftService.getAnnualLeaveUsage(this.currentCrew(), year);

    return {
      used: usedDays,
      total: SHIFT_CONFIG.ANNUAL_LEAVE_LIMIT,
    };
  });

  isAnnualLeaveAtLimit = computed(() => {
    const info = this.annualLeaveInfo();
    return info.used >= info.total;
  });

  canSelectAnnualLeave = computed(() => {
    const currentType = this.currentShiftType();
    const info = this.annualLeaveInfo();

    // If current type is already annual leave, allow deselection
    if (currentType === ShiftType.ANNUAL_LEAVE) {
      return true;
    }

    // If at limit, don't allow new annual leave
    return info.used < info.total;
  });

  onDayTypeSelect(event: Event, shiftType: ShiftType): void {
    // Prevent event bubbling and default behavior to avoid touch event issues on mobile
    event.preventDefault();
    event.stopPropagation();

    const date = this.selectedDate();
    if (!date) return;

    // Check if selecting annual leave and at limit
    if (shiftType === ShiftType.ANNUAL_LEAVE && !this.canSelectAnnualLeave()) {
      return;
    }

    this.dayTypeSelected.emit({ date, shiftType });
    this.dialogVisible.set(false);
  }

  isCurrentType(shiftType: ShiftType): boolean {
    return this.currentShiftType() === shiftType;
  }

  getCurrentTypeLabel = computed(() => {
    const currentType = this.currentShiftType();
    const options = this.dayTypeOptions();
    const option = options.find((opt) => opt.type === currentType);
    return option?.label || 'Unknown';
  });

  shouldShowAnnualLeaveWarning(): boolean {
    const currentType = this.currentShiftType();
    return this.isAnnualLeaveAtLimit() && currentType !== ShiftType.ANNUAL_LEAVE;
  }

  shouldShowDisabledMessage(option: DayTypeOption): boolean {
    return (
      option.type === ShiftType.ANNUAL_LEAVE &&
      !this.canSelectAnnualLeave() &&
      !this.isCurrentType(option.type)
    );
  }

  getOptionClasses(option: DayTypeOption): string {
    const baseClasses = 'day-type-option';
    const isSelected = this.isCurrentType(option.type);
    const isDisabled = option.type === ShiftType.ANNUAL_LEAVE && !this.canSelectAnnualLeave();

    return `${baseClasses} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
  }
}
