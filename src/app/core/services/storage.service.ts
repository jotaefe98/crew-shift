import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { ShiftType, CrewType, UserSettings } from '../models';
import { LOCAL_STORAGE_KEYS, FIRESTORE_KEYS } from '../constants';
import { DEFAULT_USER_SETTINGS } from '../models';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

export interface StorageData {
  crew_shift_modifications: ShiftModification[];
  crew_shift_settings: UserSettings;
}

export interface ShiftModification {
  date: string; // ISO date string
  originalType: ShiftType;
  modifiedType: ShiftType;
  crew: CrewType;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly SHIFT_MODIFICATIONS_KEY = LOCAL_STORAGE_KEYS.MODIFICATIONS;
  private readonly USER_SETTINGS_KEY = LOCAL_STORAGE_KEYS.SETTINGS;
  private readonly FIRESTORE_DATA_COLLECTION = FIRESTORE_KEYS.USER_DATA;

  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);

  private shiftModificationsCache: ShiftModification[] | null = null;
  private userSettingsCache: UserSettings = DEFAULT_USER_SETTINGS;
  private cacheInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private lastUserId: string | null = null;
  private firestoreUnsubscribe: (() => void) | null = null;
  private isLoadingFromFirestore = false;

  private dataChanged$ = new Subject<void>();
  private dataLoadedResolve: (() => void) | null = null;
  private dataLoadedPromise: Promise<void> | null = null;

  constructor() {
    this.initializationPromise = this.initializeCache();
    this.setupAuthListener();
    this.registerAuthCallback();
  }

  private registerAuthCallback(): void {
    this.authService.registerDataLoadCallback(async () => {
      if (this.dataLoadedPromise) await this.dataLoadedPromise;
    });
  }

  onDataChange() {
    return this.dataChanged$.asObservable();
  }

  isLoading(): boolean {
    return this.isLoadingFromFirestore;
  }

  private setupAuthListener(): void {
    this.authService.user$.subscribe(async (user) => {
      const newUserId = user?.uid || null;

      // Only reinitialize if the user changed (not on initial load)
      if (this.cacheInitialized && this.lastUserId !== newUserId) {
        // Unsubscribe from previous Firestore listener
        if (this.firestoreUnsubscribe) {
          this.firestoreUnsubscribe();
          this.firestoreUnsubscribe = null;
        }

        this.isLoadingFromFirestore = true;
        this.dataLoadedPromise = new Promise<void>((resolve) => {
          this.dataLoadedResolve = resolve;
        });

        // Reset cache state
        this.cacheInitialized = false;
        this.lastUserId = newUserId;

        // Reinitialize cache with new user data
        this.initializationPromise = this.initializeCache();
        await this.initializationPromise;
      } else if (!this.cacheInitialized) {
        // Store the initial user ID
        this.lastUserId = newUserId;
      }
    });
  }

  async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  private async initializeCache(): Promise<void> {
    // Wait for auth to initialize before checking user
    await this.waitForAuthInitialization();

    // Check if user is authenticated and has document in Firestore
    const currentUser = this.authService.currentUser();

    if (currentUser) {
      // If user is authenticated, check/create document and load from Firestore
      await this.checkUserDocumentExists(currentUser.uid);
    } else {
      // If user is not authenticated, load from localStorage
      const allStorageData = this.getAllStorageDataFromLocalStorage();
      this.shiftModificationsCache = allStorageData.crew_shift_modifications;
      this.userSettingsCache = allStorageData.crew_shift_settings;
    }

    this.cacheInitialized = true;
  }

  private async waitForAuthInitialization(): Promise<void> {
    try {
      // This will resolve as soon as Firebase Auth emits the first value (user or null)
      await firstValueFrom(this.authService.user$);
    } catch (error) {
      console.error('❌ Error waiting for auth initialization:', error);
    }
  }

  private async checkUserDocumentExists(userId: string): Promise<void> {
    try {
      this.isLoadingFromFirestore = true;

      const userDocument = await this.firestoreService.readDocument(
        this.FIRESTORE_DATA_COLLECTION,
        userId
      );

      if (userDocument) {
        // Load data from Firestore
        const firestoreData = userDocument as StorageData;

        // Update caches with Firestore data
        this.shiftModificationsCache = firestoreData.crew_shift_modifications || [];
        this.userSettingsCache = firestoreData.crew_shift_settings || DEFAULT_USER_SETTINGS;

        // Setup real-time listener for changes
        this.setupFirestoreListener(userId);
      } else {
        // Get current data from localStorage
        const localData = this.getAllStorageDataFromLocalStorage();

        // Create document in Firestore with current data
        await this.firestoreService.createDocument(
          this.FIRESTORE_DATA_COLLECTION,
          userId,
          localData
        );

        // Update caches with the data that was just created
        this.shiftModificationsCache = localData.crew_shift_modifications;
        this.userSettingsCache = localData.crew_shift_settings;

        localStorage.removeItem(this.SHIFT_MODIFICATIONS_KEY);
        localStorage.removeItem(this.USER_SETTINGS_KEY);
      }

      this.isLoadingFromFirestore = false;

      // Resolve the data loaded promise
      if (this.dataLoadedResolve) {
        this.dataLoadedResolve();
        this.dataLoadedResolve = null;
        this.dataLoadedPromise = null;
      }
    } catch (error) {
      console.error('Error checking user document:', error);
      this.isLoadingFromFirestore = false;

      // Resolve even on error to prevent hanging
      if (this.dataLoadedResolve) {
        this.dataLoadedResolve();
        this.dataLoadedResolve = null;
        this.dataLoadedPromise = null;
      }
    }
  }

  private getAllStorageDataFromLocalStorage(): StorageData {
    const shiftModificationsRaw = localStorage.getItem(this.SHIFT_MODIFICATIONS_KEY);
    const userSettingsRaw = localStorage.getItem(this.USER_SETTINGS_KEY);

    // Parse shift modifications
    let shiftModifications: ShiftModification[] = [];
    try {
      if (shiftModificationsRaw) {
        shiftModifications = JSON.parse(shiftModificationsRaw);
      }
    } catch (error) {
      console.error('Failed to parse shift modifications from localStorage:', error);
    }

    let userSettings: UserSettings = DEFAULT_USER_SETTINGS;
    try {
      if (userSettingsRaw) {
        userSettings = JSON.parse(userSettingsRaw) as UserSettings;
      }
    } catch (error) {
      console.error('Failed to parse user settings from localStorage:', error);
    }

    return {
      crew_shift_modifications: shiftModifications,
      crew_shift_settings: userSettings,
    };
  }

  /**
   * Convert a Date to YYYY-MM-DD format in local timezone
   */
  private static formatDateToLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async saveShiftModification(
    date: Date,
    originalType: ShiftType,
    modifiedType: ShiftType,
    crew: CrewType
  ): Promise<void> {
    await this.waitForInitialization();

    const dateString = StorageService.formatDateToLocalString(date);
    const modification: ShiftModification = {
      date: dateString,
      originalType,
      modifiedType,
      crew,
      timestamp: Date.now(),
    };

    const modifications = [...(this.shiftModificationsCache || [])];

    const filteredModifications = modifications.filter(
      (mod) => !(mod.date === dateString && mod.crew === crew)
    );

    filteredModifications.push(modification);

    try {
      const currentUser = this.authService.currentUser();

      if (currentUser) {
        // Save to Firestore
        await this.firestoreService.updateDocument(
          this.FIRESTORE_DATA_COLLECTION,
          currentUser.uid,
          {
            crew_shift_modifications: filteredModifications,
          }
        );
      } else {
        localStorage.setItem(this.SHIFT_MODIFICATIONS_KEY, JSON.stringify(filteredModifications));
      }

      this.shiftModificationsCache = filteredModifications;

      if (!currentUser) {
        this.dataChanged$.next();
      }
    } catch (error) {
      console.error('Failed to save shift modification:', error);
    }
  }

  getShiftModifications(): ShiftModification[] {
    if (!this.cacheInitialized) this.initializeCache();

    return this.shiftModificationsCache || [];
  }

  getShiftModification(date: Date, crew: CrewType): ShiftModification | null {
    if (!this.cacheInitialized) this.initializeCache();

    const dateString = StorageService.formatDateToLocalString(date);

    const foundModification =
      this.shiftModificationsCache?.find((mod) => mod.date === dateString && mod.crew === crew) ||
      null;

    return foundModification;
  }

  async removeShiftModification(date: Date, crew: CrewType): Promise<void> {
    await this.waitForInitialization();

    const dateString = StorageService.formatDateToLocalString(date);

    const modifications = [...(this.shiftModificationsCache || [])];

    const filteredModifications = modifications.filter(
      (mod) => !(mod.date === dateString && mod.crew === crew)
    );

    if (filteredModifications.length === modifications.length) return;

    try {
      const currentUser = this.authService.currentUser();

      if (currentUser) {
        await this.firestoreService.updateDocument(
          this.FIRESTORE_DATA_COLLECTION,
          currentUser.uid,
          {
            crew_shift_modifications: filteredModifications,
          }
        );
      } else {
        localStorage.setItem(this.SHIFT_MODIFICATIONS_KEY, JSON.stringify(filteredModifications));
      }

      this.shiftModificationsCache = filteredModifications;

      if (!currentUser) {
        this.dataChanged$.next();
      }
    } catch (error) {
      console.error('Failed to remove modification:', error);
    }
  }

  getAnnualLeaveUsage(crew: CrewType, year: number): number {
    const modifications = this.getShiftModifications();

    const yearString = year.toString();
    const annualLeaveCount = modifications.filter(
      (mod) =>
        mod.crew === crew && mod.modifiedType === 'annual_leave' && mod.date.startsWith(yearString)
    ).length;

    return annualLeaveCount;
  }

  async clearAllShiftModifications(): Promise<void> {
    await this.waitForInitialization();

    try {
      const currentUser = this.authService.currentUser();

      if (currentUser) {
        await this.firestoreService.updateDocument(
          this.FIRESTORE_DATA_COLLECTION,
          currentUser.uid,
          {
            crew_shift_modifications: [],
          }
        );
      } else {
        localStorage.removeItem(this.SHIFT_MODIFICATIONS_KEY);
      }

      this.shiftModificationsCache = [];

      if (!currentUser) {
        this.dataChanged$.next();
      }
    } catch (error) {
      console.error('Failed to clear shift modifications:', error);
    }
  }

  async clearAllData(): Promise<void> {
    await this.clearAllShiftModifications();
    // Maybe clear user settings too in the future
  }

  getUserSettings(): UserSettings {
    if (!this.cacheInitialized) this.initializeCache();
    return this.userSettingsCache;
  }

  async setUserSettings(settings: UserSettings): Promise<void> {
    await this.waitForInitialization();

    try {
      const currentUser = this.authService.currentUser();

      if (currentUser) {
        await this.firestoreService.updateDocument(
          this.FIRESTORE_DATA_COLLECTION,
          currentUser.uid,
          {
            crew_shift_settings: settings,
          }
        );
      } else {
        localStorage.setItem(this.USER_SETTINGS_KEY, JSON.stringify(settings));
      }

      this.userSettingsCache = settings;
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  private setupFirestoreListener(userId: string): void {
    if (this.firestoreUnsubscribe) {
      this.firestoreUnsubscribe();
    }

    this.firestoreUnsubscribe = this.firestoreService.onDocumentSnapshot<StorageData>(
      this.FIRESTORE_DATA_COLLECTION,
      userId,
      (data) => {
        if (data) {
          this.shiftModificationsCache = data.crew_shift_modifications || [];
          this.userSettingsCache = data.crew_shift_settings || DEFAULT_USER_SETTINGS;
          this.dataChanged$.next();
        }
      }
    );
  }
}
