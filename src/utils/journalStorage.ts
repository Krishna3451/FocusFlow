import { JournalEntry } from '../types/journal';

const STORAGE_KEY = 'journal_entries';

export const saveJournalEntry = (entry: JournalEntry): void => {
  const entries = getJournalEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const getJournalEntries = (): JournalEntry[] => {
  const entriesJson = localStorage.getItem(STORAGE_KEY);
  return entriesJson ? JSON.parse(entriesJson) : [];
};

export const getJournalEntryById = (id: string): JournalEntry | undefined => {
  const entries = getJournalEntries();
  return entries.find(entry => entry.id === id);
};

export const deleteJournalEntry = (id: string): void => {
  const entries = getJournalEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
}; 