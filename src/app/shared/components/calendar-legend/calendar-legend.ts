import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SHIFT_TYPE_DEFINITIONS, CALENDAR_INDICATORS } from '../../../core/constants';

@Component({
  selector: 'app-calendar-legend',
  imports: [],
  templateUrl: './calendar-legend.html',
  styleUrl: './calendar-legend.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarLegend {
  readonly shiftTypes = SHIFT_TYPE_DEFINITIONS;
  readonly indicators = CALENDAR_INDICATORS;
}
