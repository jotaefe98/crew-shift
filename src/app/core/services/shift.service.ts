import { Injectable, inject, signal } from '@angular/core';
import { ShiftType, CrewType, ShiftDay, ShiftCycleInfo } from '../models';
import { SHIFT_CONFIG, SHIFT_TYPE_DEFINITIONS, BANK_HOLIDAYS } from '../constants';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private analyticsService = inject(AnalyticsService);

  // Signal to trigger reactivity when shifts are modified
  private shiftModificationTrigger = signal<number>(0);

  constructor() {
    this.authService.user$.subscribe(async () => {
      await this.storageService.waitForInitialization();
      this.shiftModificationTrigger.update((value) => value + 1);
    });

    this.storageService.onDataChange().subscribe(() => {
      this.shiftModificationTrigger.update((value) => value + 1);
    });
  }

  getShiftForDate(date: Date, crew: CrewType): ShiftType {
    const cycleInfo = this.getShiftCycleInfo(date, crew);
    return SHIFT_CONFIG.SHIFT_PATTERN[cycleInfo.dayInCycle - 1];
  }

  getShiftCycleInfo(date: Date, crew: CrewType): ShiftCycleInfo {
    const crewConfig = SHIFT_CONFIG.CREWS[crew];
    const cycleStartDate = crewConfig.cycleStartDate;

    const daysSinceStart = this.getDaysDifference(cycleStartDate, date);

    // Calculate which day in the cycle (1-9)
    const dayInCycle = (daysSinceStart % SHIFT_CONFIG.CYCLE_LENGTH) + 1;

    const cycleNumber = Math.floor(daysSinceStart / SHIFT_CONFIG.CYCLE_LENGTH) + 1;

    const shiftType = SHIFT_CONFIG.SHIFT_PATTERN[dayInCycle - 1];

    return {
      dayInCycle,
      cycleNumber,
      shiftType,
    };
  }

  getShiftDay(date: Date, crew: CrewType): ShiftDay {
    const originalShiftType = this.getShiftForDate(date, crew);
    const modification = this.storageService.getShiftModification(date, crew);

    const shiftType = modification ? modification.modifiedType : originalShiftType;
    const isModified = modification !== null;

    return {
      date: new Date(date),
      shiftType,
      isHoliday: this.isHoliday(date),
      isModified,
      originalShiftType: isModified ? originalShiftType : undefined,
    };
  }

  getAnnualLeaveUsage(crew: string, year: number): number {
    const crewType = crew as CrewType;
    return this.storageService.getAnnualLeaveUsage(crewType, year);
  }

  getModificationTrigger(): number {
    return this.shiftModificationTrigger();
  }

  async updateShiftType(date: Date, shiftType: ShiftType, crew: CrewType): Promise<void> {
    const originalShiftType = this.getShiftForDate(date, crew);

    // If the new shift type is the same as the original, remove any existing modification
    if (shiftType === originalShiftType) {
      await this.storageService.removeShiftModification(date, crew);
    } else {
      // Save the modification
      await this.storageService.saveShiftModification(date, originalShiftType, shiftType, crew);
    }

    // Track modification in analytics
    await this.analyticsService.trackModification();
  }

  async restoreAllDays(): Promise<void> {
    await this.storageService.clearAllShiftModifications();
    // Track modification in analytics (restoring is also a modification action)
    await this.analyticsService.trackModification();
  }

  private isHoliday(date: Date): boolean {
    const dateString = this.formatDateToISO(date);
    return (BANK_HOLIDAYS as readonly string[]).includes(dateString);
  }

  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getDaysDifference(startDate: Date, endDate: Date): number {
    const timestampStart = Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const timestampEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const diffTime = timestampEnd - timestampStart;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
