import type { HistoryItem } from '../types';

const MAX_HISTORY = 10;

export function upsertHistoryItem(history: HistoryItem[], newItem: HistoryItem): HistoryItem[] {
  const filtered = history.filter((item) => item.city.toLowerCase() !== newItem.city.toLowerCase());
  return [newItem, ...filtered].slice(0, MAX_HISTORY);
}
