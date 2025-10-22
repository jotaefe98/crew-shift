import { inject, Injectable } from '@angular/core';
import { increment } from '@angular/fire/firestore';
import { UserType, DailyStats } from '../models/analytics.models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private firestoreService = inject(FirestoreService);
  private hasTrackedConnection = false;

  /**
   * Tracks a user connection for the current day.
   * Only tracks once per session.
   */
  async trackConnection(userType: UserType): Promise<void> {
    if (this.hasTrackedConnection) {
      return;
    }

    try {
      const today = this.getTodayKey();

      // Prepare increment updates
      const updates: Partial<Record<keyof DailyStats, any>> = {
        totalConnections: increment(1),
      };

      if (userType === 'guest') {
        updates.guestConnections = increment(1);
      } else {
        updates.authConnections = increment(1);
      }

      // Use setDocument with merge to create or update in one call
      await this.firestoreService.setDocument('analytics', today, updates);
      this.hasTrackedConnection = true;
    } catch (error) {
      console.error('Error tracking connection:', error);
    }
  }

  /**
   * Tracks a modification (shift create/update/delete).
   */
  async trackModification(): Promise<void> {
    try {
      const today = this.getTodayKey();

      // Use setDocument with merge to create or update in one call
      await this.firestoreService.setDocument('analytics', today, {
        totalModifications: increment(1),
      });
    } catch (error) {
      console.error('Error tracking modification:', error);
    }
  }

  /**
   * Gets the current date in YYYY-MM-DD format for the document key.
   */
  private getTodayKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
