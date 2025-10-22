import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
  effect,
} from '@angular/core';
import {
  CalendarDay,
  CalendarLegend,
  CrewInfo,
  CalendarHeader,
  DayTypeSelector,
} from '../../shared/components';
import { CALENDAR_CONFIG, DATE_FORMATS } from '../../core/constants';
import { ShiftService, UserSettingsService } from '../../core/services';
import { CrewType, ShiftDay, ShiftType } from '../../core/models';

interface CalendarDayData {
  dayNumber: number;
  isToday: boolean;
  isOtherMonth: boolean;
  date: Date;
  uniqueId: string;
  shiftData: ShiftDay;
}

@Component({
  selector: 'app-calendar-view',
  imports: [CalendarDay, CalendarLegend, CrewInfo, CalendarHeader, DayTypeSelector],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarView {
  private today = new Date();
  private currentDate = signal(new Date());
  private shiftService = inject(ShiftService);
  private userSettingsService = inject(UserSettingsService);

  // Get current crew from user settings
  currentCrew = computed(() => this.userSettingsService.selectedCrew() || CrewType.DAVID);
  selectedDate = signal<Date>(new Date());

  // Day type selector modal
  showDayTypeSelector = signal<boolean>(false);
  selectedDayForEdit = signal<Date | null>(null);
  selectedDayShiftType = signal<ShiftType | null>(null);
  selectedDayOriginalType = signal<ShiftType | null>(null);
  selectedDayIsModified = signal<boolean>(false);

  // Get week days based on user settings
  weekDays = computed(() => this.userSettingsService.orderedWeekDays());

  // Show shift labels in calendar days based on user settings
  showShiftLabels = computed(() => this.userSettingsService.showShiftLabels());

  currentMonthYear = computed(() => {
    const date = this.currentDate();
    return date.toLocaleDateString(DATE_FORMATS.FULL_DATE, {
      month: DATE_FORMATS.MONTH_YEAR,
      year: 'numeric',
    });
  });

  // Generate calendar days
  calendarDays = computed(() => {
    const currentDate = this.currentDate();

    // Access the modification trigger to make this computed reactive to shift changes
    this.shiftService.getModificationTrigger();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);

    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();

    const weekStartDay = this.userSettingsService.weekStartDay();

    // Calculate how many days from previous month to show
    const adjustedFirstDay = (firstDayWeekday - weekStartDay + 7) % 7;

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const previousMonthLastDay = new Date(prevYear, prevMonth + 1, 0);
    const previousMonthDays = previousMonthLastDay.getDate();

    const days: CalendarDayData[] = [];

    // Add days from the previous month
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const dayNumber = previousMonthDays - i;
      const date = new Date(prevYear, prevMonth, dayNumber);
      const shiftData = this.shiftService.getShiftDay(date, this.currentCrew());

      days.push({
        dayNumber,
        isToday: this.isSameDay(date, this.today),
        isOtherMonth: true,
        date,
        uniqueId: `${prevYear}-${prevMonth}-${dayNumber}`,
        shiftData,
      });
    }

    // Add days from the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const shiftData = this.shiftService.getShiftDay(date, this.currentCrew());

      days.push({
        dayNumber: day,
        isToday: this.isSameDay(date, this.today),
        isOtherMonth: false,
        date,
        uniqueId: `${year}-${month}-${day}`,
        shiftData,
      });
    }

    // Add days from the next month to fill the 6 weeks
    const remainingDays = CALENDAR_CONFIG.TOTAL_CALENDAR_DAYS - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYear, nextMonth, day);
      const shiftData = this.shiftService.getShiftDay(date, this.currentCrew());

      days.push({
        dayNumber: day,
        isToday: this.isSameDay(date, this.today),
        isOtherMonth: true,
        date,
        uniqueId: `${nextYear}-${nextMonth}-${day}`,
        shiftData,
      });
    }

    return days;
  });

  // Split the days into weeks
  calendarWeeks = computed(() => {
    const days = this.calendarDays();
    const weeks: CalendarDayData[][] = [];

    for (let i = 0; i < days.length; i += CALENDAR_CONFIG.DAYS_IN_WEEK) {
      weeks.push(days.slice(i, i + CALENDAR_CONFIG.DAYS_IN_WEEK));
    }

    return weeks;
  });

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // Methods to navigate between months
  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  onDateSelect(date: Date): void {
    if (date) {
      this.selectedDate.set(date);
      this.currentDate.set(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  goToToday(): void {
    const today = new Date();
    this.currentDate.set(today);
    this.selectedDate.set(today);
  }

  onDayClick(date: Date): void {
    // Don't allow editing days from other months
    const currentDate = this.currentDate();
    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      return;
    }

    // Get current shift type for the selected day
    const shiftData = this.shiftService.getShiftDay(date, this.currentCrew());

    this.selectedDayForEdit.set(date);
    this.selectedDayShiftType.set(shiftData.shiftType);
    this.selectedDayOriginalType.set(shiftData.originalShiftType || null);
    this.selectedDayIsModified.set(shiftData.isModified);
    this.showDayTypeSelector.set(true);
  }

  async onDayTypeSelected(event: { date: Date; shiftType: ShiftType }): Promise<void> {
    // Update the shift type for the selected day
    await this.shiftService.updateShiftType(event.date, event.shiftType, this.currentCrew());

    // Close the modal
    this.showDayTypeSelector.set(false);
    this.selectedDayForEdit.set(null);
    this.selectedDayShiftType.set(null);
  }

  onDayTypeSelectorVisibilityChange(visible: boolean): void {
    this.showDayTypeSelector.set(visible);
    if (!visible) {
      this.selectedDayForEdit.set(null);
      this.selectedDayShiftType.set(null);
      this.selectedDayOriginalType.set(null);
      this.selectedDayIsModified.set(false);
    }
  }
}
