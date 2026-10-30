export interface Trip {
  id: string;
  name: string;
  destination: string;
  start: string; // ISO date string YYYY-MM-DD
  end: string;
  budget: number;
  spent: number;
  image: string;
  travelers: number;
  status: 'upcoming' | 'active' | 'completed';
  favorite: boolean;
  progress: number;
  notes?: string;
}

export interface Activity {
  id: string;
  tripId: string;
  day: number;
  title: string;
  time: string;
  category: ActivityCategory;
  done: boolean;
  notes: string;
}

export type ActivityCategory =
  | 'Food'
  | 'Sightseeing'
  | 'Transport'
  | 'Stay'
  | 'Adventure'
  | 'Shopping'
  | 'Relax'
  | 'Other';

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
}

export type ExpenseCategory =
  | 'Transport'
  | 'Stay'
  | 'Food'
  | 'Activities'
  | 'Shopping'
  | 'Other';

export type ThemeMode = 'light' | 'dark';

export type PageName =
  | 'landing'
  | 'dashboard'
  | 'explore'
  | 'trips'
  | 'itinerary'
  | 'expenses';
