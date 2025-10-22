/**
 * User settings and preferences models
 */

import { CrewType } from './shift.models';

export interface UserSettings {
  weekStartDay: WeekStartDay;
  showShiftLabels: boolean;
  theme?: 'light' | 'dark' | 'auto';
  selectedCrew?: CrewType;
  hasCompletedInitialSetup?: boolean;
}

export enum WeekStartDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const WEEK_START_DAY_OPTIONS = [
  { value: WeekStartDay.SUNDAY, label: 'Sunday' },
  { value: WeekStartDay.MONDAY, label: 'Monday' },
  { value: WeekStartDay.TUESDAY, label: 'Tuesday' },
  { value: WeekStartDay.WEDNESDAY, label: 'Wednesday' },
  { value: WeekStartDay.THURSDAY, label: 'Thursday' },
  { value: WeekStartDay.FRIDAY, label: 'Friday' },
  { value: WeekStartDay.SATURDAY, label: 'Saturday' },
] as const;

export const DEFAULT_USER_SETTINGS: UserSettings = {
  weekStartDay: WeekStartDay.SUNDAY,
  showShiftLabels: true,
  theme: 'auto',
};
