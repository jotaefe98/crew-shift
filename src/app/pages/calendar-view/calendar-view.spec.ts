import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarView } from './calendar-view';

describe('CalendarView', () => {
  let component: CalendarView;
  let fixture: ComponentFixture<CalendarView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarView, NoopAnimationsModule], // NoopAnimationsModule para evitar errores con PrimeNG
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with current date', () => {
      expect(component.selectedDate()).toBeInstanceOf(Date);
      expect(component.currentMonthYear()).toContain('2025'); // Año actual
    });
  });

  describe('Calendar Navigation', () => {
    it('should navigate to previous month', () => {
      // Arrange: Establish known date (January 2025)
      const initialDate = new Date(2025, 0, 15); // January 15, 2025
      component.selectedDate.set(initialDate);
      component.onDateSelect(initialDate);

      const initialMonth = component.currentMonthYear();

      // Act: Ir al mes anterior
      component.previousMonth();
      fixture.detectChanges();

      // Assert: Verify that it changed to the previous month
      const newMonth = component.currentMonthYear();
      expect(newMonth).not.toBe(initialMonth);
      expect(newMonth).toContain('December'); // December 2024
    });

    it('should navigate to next month', () => {
      // Arrange: Establish known date (January 2025)
      const initialDate = new Date(2025, 0, 15); // January 15, 2025
      component.selectedDate.set(initialDate);
      component.onDateSelect(initialDate);

      const initialMonth = component.currentMonthYear();

      // Act: Navigate to next month
      component.nextMonth();
      fixture.detectChanges();

      // Assert: Verify that it changed to the next month
      const newMonth = component.currentMonthYear();
      expect(newMonth).not.toBe(initialMonth);
      expect(newMonth).toContain('February'); // February 2025
    });

    it('should go to today when goToToday is called', () => {
      // Arrange: Navigate to a different date
      const pastDate = new Date(2020, 5, 15); // June 2020
      component.onDateSelect(pastDate);

      // Act: Go back to today
      component.goToToday();
      fixture.detectChanges();

      // Assert: Verify that we are in the current month
      const currentMonth = component.currentMonthYear();
      expect(currentMonth).toContain('2025');
    });
  });

  describe('Calendar Generation', () => {
    it('should generate 42 calendar days (6 weeks)', () => {
      const calendarDays = component.calendarDays();
      expect(calendarDays.length).toBe(42); // 6 weeks × 7 days = 42
    });

    it('should generate 6 weeks of calendar data', () => {
      const calendarWeeks = component.calendarWeeks();
      expect(calendarWeeks.length).toBe(6);

      // Each week should have 7 days
      calendarWeeks.forEach((week) => {
        expect(week.length).toBe(7);
      });
    });

    it('should correctly identify today', () => {
      const today = new Date();
      const calendarDays = component.calendarDays();

      // Find today's date in the calendar
      const todayInCalendar = calendarDays.find((day) => day.isToday);

      if (todayInCalendar) {
        expect(todayInCalendar.dayNumber).toBe(today.getDate());
        expect(todayInCalendar.isOtherMonth).toBe(false);
      }
    });

    it('should mark other month days correctly', () => {
      const calendarDays = component.calendarDays();
      const otherMonthDays = calendarDays.filter((day) => day.isOtherMonth);
      const currentMonthDays = calendarDays.filter((day) => !day.isOtherMonth);

      // There should be other month days to fill the 6 weeks
      expect(otherMonthDays.length).toBeGreaterThan(0);
      expect(currentMonthDays.length).toBeGreaterThan(0);

      // Total should be 42
      expect(otherMonthDays.length + currentMonthDays.length).toBe(42);
    });
  });

  describe('Date Selection', () => {
    it('should update selected date when onDateSelect is called', () => {
      const testDate = new Date(2025, 5, 15); // June 15, 2025

      component.onDateSelect(testDate);

      expect(component.selectedDate().getTime()).toBe(testDate.getTime());
    });

    it('should update current month when selecting date from different month', () => {
      const initialMonth = component.currentMonthYear();
      const differentMonthDate = new Date(2025, 11, 25); // December 25, 2025

      component.onDateSelect(differentMonthDate);
      fixture.detectChanges();

      const newMonth = component.currentMonthYear();
      expect(newMonth).not.toBe(initialMonth);
      expect(newMonth).toContain('December');
    });
  });
});
