/**
 * Shift-related models and types
 */

export enum ShiftType {
  EARLY = 'early',
  LATE = 'late',
  OFF = 'off',
  ANNUAL_LEAVE = 'annual_leave',
}

export enum CrewType {
  DAVID = 'david',
  TREVOR = 'trevor',
  PADDY = 'paddy',
}

export interface ShiftDay {
  date: Date;
  shiftType: ShiftType;
  isHoliday: boolean;
  isModified: boolean;
  originalShiftType?: ShiftType;
}

export interface CrewConfig {
  name: CrewType;
  displayName: string;
  cycleStartDate: Date;
  cycleLength: number;
  shiftPattern: ShiftType[];
}

export interface ShiftCycleInfo {
  dayInCycle: number;
  cycleNumber: number;
  shiftType: ShiftType;
}
