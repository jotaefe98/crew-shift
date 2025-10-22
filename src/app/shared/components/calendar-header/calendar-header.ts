import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { CALENDAR_CONFIG } from '../../../core/constants';

@Component({
  selector: 'app-calendar-header',
  imports: [FormsModule, ButtonModule, PopoverModule, DatePickerModule],
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeader {
  // Inputs
  currentMonthYear = input.required<string>();
  selectedDate = input.required<Date>();

  // Outputs for parent communication
  previousMonthClicked = output<void>();
  nextMonthClicked = output<void>();
  todayClicked = output<void>();
  dateSelected = output<Date>();

  // Properties for the date picker
  minDate = CALENDAR_CONFIG.MIN_DATE;
  maxDate: Date | undefined = undefined; // No maximum date

  // Methods
  previousMonth(event?: Event): void {
    if (event) {
      this.preventZoom(event);
    }
    this.previousMonthClicked.emit();
  }

  nextMonth(event?: Event): void {
    if (event) {
      this.preventZoom(event);
    }
    this.nextMonthClicked.emit();
  }

  goToToday(event?: Event): void {
    if (event) {
      this.preventZoom(event);
    }
    this.todayClicked.emit();
  }

  onDateSelect(date: Date): void {
    this.dateSelected.emit(date);
  }

  // Prevent zoom on fast taps
  private preventZoom(event: Event): void {
    // Prevent default behavior that might trigger zoom
    if (event.type === 'touchend' || event.type === 'touchstart') {
      event.preventDefault();
    }
    event.stopPropagation();

    // Additional touch handling for mobile
    const target = event.target as HTMLElement;
    if (target) {
      target.style.touchAction = 'manipulation';

      // Ensure no highlight or callout appears using setProperty for webkit properties
      target.style.setProperty('-webkit-tap-highlight-color', 'transparent');
      target.style.setProperty('-webkit-touch-callout', 'none');
    }

    // Add a small delay to prevent double-tap detection
    const button = (event.target as HTMLElement)?.closest('.p-button') as HTMLElement;
    if (button) {
      button.style.pointerEvents = 'none';
      setTimeout(() => {
        button.style.pointerEvents = 'auto';
      }, 300);
    }
  }
}
