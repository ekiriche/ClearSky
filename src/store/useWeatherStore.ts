import { create } from 'zustand';
import type { WeatherData, HistoryItem, WeatherError } from '../types';
import { fetchWeather } from '../services/weatherService';
import { upsertHistoryItem } from '../utils/historyUtils';

const STORAGE_KEY = 'clearsky_history';

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // silently swallow storage errors
  }
}

function isWeatherError(e: unknown): e is WeatherError {
  return typeof e === 'object' && e !== null && 'kind' in e && 'message' in e;
}

type WeatherState = {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  history: HistoryItem[];
  lastRemoved: { item: HistoryItem; index: number } | null;
};

type WeatherActions = {
  searchCity: (city: string) => Promise<void>;
  removeHistoryItem: (city: string) => void;
  undoRemove: () => void;
};

export const useWeatherStore = create<WeatherState & WeatherActions>((set, get) => ({
  weather: null,
  loading: false,
  error: null,
  history: loadHistory(),
  lastRemoved: null,

  searchCity: async (city: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWeather(city);
      const nextHistory = upsertHistoryItem(get().history, {
        city: data.city,
        searchedAt: Date.now(),
      });
      set({ weather: data, loading: false, history: nextHistory, lastRemoved: null });
      saveHistory(nextHistory);
    } catch (e) {
      const message = isWeatherError(e) ? e.message : 'Unable to reach weather service.';
      set({ loading: false, error: message });
    }
  },

  removeHistoryItem: (city: string) => {
    const { history } = get();
    const index = history.findIndex((item) => item.city === city);
    if (index === -1) return;
    const item = history[index];
    const nextHistory = history.filter((_, i) => i !== index);
    set({ history: nextHistory, lastRemoved: { item, index } });
    saveHistory(nextHistory);
  },

  undoRemove: () => {
    const { lastRemoved, history } = get();
    if (!lastRemoved) return;
    const nextHistory = [...history];
    nextHistory.splice(lastRemoved.index, 0, lastRemoved.item);
    set({ history: nextHistory, lastRemoved: null });
    saveHistory(nextHistory);
  },
}));
