/**
 * Application-wide constants
 */

import { ShiftType, CrewType } from '../models';

// Calendar configuration
export const CALENDAR_CONFIG = {
  DAYS_IN_WEEK: 7,
  WEEKS_IN_CALENDAR: 6,
  TOTAL_CALENDAR_DAYS: 42, // 6 weeks × 7 days
  MIN_DATE: new Date(2025, 0, 1), // January 1, 2025
  WEEK_DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const,
  WEEK_DAYS_FULL: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const,
} as const;

// Bank holidays for 2025 and 2026
export const BANK_HOLIDAYS = [
  '2025-01-01', // 1 January - New Year's Day
  '2025-02-03', // 3 February - St. Brigid's Day
  '2025-03-17', // 17 March - St. Patrick's Day
  '2025-04-21', // 21 April - Easter Monday
  '2025-05-05', // 5 May - May Bank Holiday
  '2025-06-02', // 2 June - June Bank Holiday
  '2025-08-04', // 4 August - August Bank Holiday
  '2025-10-27', // 27 October - October Bank Holiday
  '2025-12-25', // 25 December - Christmas Day
  '2025-12-26', // 26 December - St. Stephen's Day
  '2026-01-01', // 1 January - New Year's Day
  '2026-02-02', // 2 February - St. Brigid's Day
  '2026-03-17', // 17 March - St. Patrick's Day
  '2026-04-06', // 6 April - Easter Monday
  '2026-05-04', // 4 May - May Bank Holiday
  '2026-06-01', // 1 June - June Bank Holiday
  '2026-08-03', // 3 August - August Bank Holiday
  '2026-10-26', // 26 October - October Bank Holiday
  '2026-12-25', // 25 December - Christmas Day
  '2026-12-26', // 26 December - St. Stephen's Day
] as const;

// Shift configuration
export const SHIFT_CONFIG = {
  CYCLE_LENGTH: 9,
  SHIFT_PATTERN: [
    ShiftType.EARLY,
    ShiftType.EARLY,
    ShiftType.EARLY, // Days 1-3: Early shift
    ShiftType.LATE,
    ShiftType.LATE,
    ShiftType.LATE, // Days 4-6: Late shift
    ShiftType.OFF,
    ShiftType.OFF,
    ShiftType.OFF, // Days 7-9: Days off
  ],
  CREWS: {
    [CrewType.DAVID]: {
      name: CrewType.DAVID,
      displayName: "David's Crew",
      cycleStartDate: new Date(2024, 11, 30), // December 30, 2024
      cycleLength: 9,
    },
    [CrewType.TREVOR]: {
      name: CrewType.TREVOR,
      displayName: "Trevor's Crew",
      cycleStartDate: new Date(2025, 0, 2), // January 2, 2025
      cycleLength: 9,
    },
    [CrewType.PADDY]: {
      name: CrewType.PADDY,
      displayName: "Paddy's Crew",
      cycleStartDate: new Date(2025, 0, 5), // January 5, 2025
      cycleLength: 9,
    },
  },
  ANNUAL_LEAVE_LIMIT: 31,
} as const;

// Shift colors for UI
export const SHIFT_COLORS = {
  [ShiftType.EARLY]: {
    background: '#fef3c7', // Yellow background
    border: '#f59e0b', // Yellow border
    text: '#92400e', // Dark yellow text
  },
  [ShiftType.LATE]: {
    background: '#fed7aa', // Orange background
    border: '#ea580c', // Orange border
    text: '#9a3412', // Dark orange text
  },
  [ShiftType.OFF]: {
    background: '#dcfce7', // Green background
    border: '#16a34a', // Green border
    text: '#166534', // Dark green text
  },
  [ShiftType.ANNUAL_LEAVE]: {
    background: '#e9d5ff', // Purple background
    border: '#9333ea', // Purple border
    text: '#6b21a8', // Dark purple text
  },
} as const;

// Shift type definitions for UI display
export const SHIFT_TYPE_DEFINITIONS = [
  { type: ShiftType.EARLY, label: 'Early Shift', description: '6:00 AM - 2:00 PM' },
  { type: ShiftType.LATE, label: 'Late Shift', description: '2:00 PM - 10:00 PM' },
  { type: ShiftType.OFF, label: 'Day Off', description: 'Rest day' },
  { type: ShiftType.ANNUAL_LEAVE, label: 'Annual Leave', description: 'Vacation day' },
] as const;

// Calendar indicators for special days
export const CALENDAR_INDICATORS = [
  {
    symbol: '●',
    label: 'Bank Holiday',
    color: '#dc2626',
    backgroundColor: undefined,
    border: undefined,
    size: 'large',
    centered: true,
  },
  {
    symbol: '□',
    label: 'Modified',
    color: 'transparent',
    backgroundColor: 'transparent',
    border: '2px dashed #dc2626',
  },
] as const;

// Date formats
export const DATE_FORMATS = {
  MONTH_YEAR: 'long',
  FULL_DATE: 'en-US',
  ISO_DATE: 'YYYY-MM-DD',
} as const;

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_TIME: 300,
  ANIMATION_DURATION: 200,
  MODAL_Z_INDEX: 1000,
} as const;

// Application routes
export const ROUTES = {
  DASHBOARD: '/dashboard',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
} as const;

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  MODIFICATIONS: 'crew_shift_modifications',
  SETTINGS: 'crew_shift_settings',
  THEME: 'crew_shift_theme',
  LANGUAGE: 'crew_shift_language',
} as const;

export const FIRESTORE_KEYS = {
  USER_DATA: 'user_data',
} as const;

// API endpoints (if needed in the future)
export const API_ENDPOINTS = {
  BASE_URL: '/api',
  SHIFTS: '/shifts',
  EMPLOYEES: '/employees',
  CALENDAR: '/calendar',
} as const;

// Theme constants
export const THEME = {
  PRIMARY_COLOR: '#007bff',
  SECONDARY_COLOR: '#6c757d',
  SUCCESS_COLOR: '#28a745',
  WARNING_COLOR: '#ffc107',
  DANGER_COLOR: '#dc3545',
  INFO_COLOR: '#17a2b8',
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
