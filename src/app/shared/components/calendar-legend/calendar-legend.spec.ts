import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarLegend } from './calendar-legend';

describe('CalendarLegend', () => {
  let component: CalendarLegend;
  let fixture: ComponentFixture<CalendarLegend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarLegend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarLegend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
