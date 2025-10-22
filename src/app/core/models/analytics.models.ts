export interface DailyStats {
  totalConnections: number;
  guestConnections: number;
  authConnections: number;
  totalModifications: number;
}

export type UserType = 'guest' | 'authenticated';
