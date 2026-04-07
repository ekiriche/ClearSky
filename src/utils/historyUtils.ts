import type { HistoryItem } from '../types';

export function upsertHistoryItem(history: HistoryItem[], newItem: HistoryItem): HistoryItem[] {
  const filtered = history.filter((item) => item.city.toLowerCase() !== newItem.city.toLowerCase());
  return [newItem, ...filtered];
}
