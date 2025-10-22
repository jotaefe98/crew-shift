import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDay } from './calendar-day';

describe('CalendarDay', () => {
  let component: CalendarDay;
  let fixture: ComponentFixture<CalendarDay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDay],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarDay);
    component = fixture.componentInstance;

    // Configure inputs
    fixture.componentRef.setInput('dayNumber', 15);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the day number', () => {
    expect(component.dayNumber()).toBe(15);
  });

  it('should have correct default values', () => {
    expect(component.isToday()).toBe(false);
    expect(component.isSelected()).toBe(false);
    expect(component.isOtherMonth()).toBe(false);
    expect(component.hasEvents()).toBe(false);
  });

  it('should generate correct CSS classes', () => {
    const classes = component.dayClasses();

    expect(classes['calendar-day']).toBe(true);
    expect(classes['calendar-day--today']).toBe(false);
    expect(classes['calendar-day--selected']).toBe(false);
    expect(classes['calendar-day--other-month']).toBe(false);
    expect(classes['calendar-day--has-events']).toBe(false);
  });

  it('should generate correct CSS classes when isToday is true', () => {
    fixture.componentRef.setInput('isToday', true);
    fixture.detectChanges();

    const classes = component.dayClasses();
    expect(classes['calendar-day--today']).toBe(true);
  });

  it('should generate correct CSS classes when isSelected is true', () => {
    fixture.componentRef.setInput('isSelected', true);
    fixture.detectChanges();

    const classes = component.dayClasses();
    expect(classes['calendar-day--selected']).toBe(true);
  });

  it('should generate correct CSS classes when isOtherMonth is true', () => {
    fixture.componentRef.setInput('isOtherMonth', true);
    fixture.detectChanges();

    const classes = component.dayClasses();
    expect(classes['calendar-day--other-month']).toBe(true);
  });

  it('should generate correct CSS classes when hasEvents is true', () => {
    fixture.componentRef.setInput('hasEvents', true);
    fixture.detectChanges();

    const classes = component.dayClasses();
    expect(classes['calendar-day--has-events']).toBe(true);
  });
});
