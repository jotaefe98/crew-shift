import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { DEFAULT_USER_SETTINGS, ShiftType } from '../../../core/models';

@Component({
  selector: 'app-calendar-day',
  imports: [],
  templateUrl: './calendar-day.html',
  styleUrl: './calendar-day.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDay {
  dayNumber = input.required<number>();
  isToday = input<boolean>(false);
  isSelected = input<boolean>(false);
  isOtherMonth = input<boolean>(false);
  hasEvents = input<boolean>(false);
  shiftType = input<ShiftType | null>(null);
  isHoliday = input<boolean>(false);
  isModified = input<boolean>(false);
  date = input<Date | null>(null);
  showShiftLabels = input<boolean>(DEFAULT_USER_SETTINGS.showShiftLabels);

  dayClicked = output<Date>();

  private touchStartX = 0;
  private touchStartY = 0;
  private touchMoved = false;

  dayClasses = computed(() => ({
    'calendar-day': true,
    'calendar-day--today': this.isToday(),
    'calendar-day--selected': this.isSelected(),
    'calendar-day--other-month': this.isOtherMonth(),
    'calendar-day--has-events': this.hasEvents(),
    'calendar-day--early': this.shiftType() === ShiftType.EARLY,
    'calendar-day--late': this.shiftType() === ShiftType.LATE,
    'calendar-day--off': this.shiftType() === ShiftType.OFF,
    'calendar-day--annual-leave': this.shiftType() === ShiftType.ANNUAL_LEAVE,
    'calendar-day--holiday': this.isHoliday() && !this.isOtherMonth(),
    'calendar-day--modified': this.isModified() && !this.isOtherMonth(),
  }));

  shiftDescription = computed(() => {
    const shift = this.shiftType();
    switch (shift) {
      case ShiftType.EARLY:
        return 'Early';
      case ShiftType.LATE:
        return 'Late';
      case ShiftType.OFF:
        return 'Off';
      case ShiftType.ANNUAL_LEAVE:
        return 'A/L';
      default:
        return null;
    }
  });

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchMoved = false;
  }

  onTouchMove(event: TouchEvent): void {
    const moveThreshold = 10; // pixels
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    const deltaX = Math.abs(touchX - this.touchStartX);
    const deltaY = Math.abs(touchY - this.touchStartY);

    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      this.touchMoved = true;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    // Only trigger click if touch didn't move (not scrolling)
    if (!this.touchMoved) {
      event.preventDefault();
      const date = this.date();
      if (date) {
        this.dayClicked.emit(date);
      }
    }
    this.touchMoved = false;
  }

  onDayClick(event: Event): void {
    // Prevent event bubbling and default behavior to avoid touch event issues on mobile
    event.preventDefault();
    event.stopPropagation();

    const date = this.date();
    if (date) {
      this.dayClicked.emit(date);
    }
  }
}
