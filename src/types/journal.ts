export type ProductivityLevel = 'Yes' | 'Somewhat' | 'No';

export interface JournalEntry {
  id: string;
  date: string;
  activities: string;
  dailyReflection: string;
  pictureOfTheDay?: string;
  productivity: ProductivityLevel;
  gratitude: string;
  spiritualWin: string;
  mentalWin: string;
  physicalWin: string;
  learningOfTheDay: string;
  createdAt: string;
} 