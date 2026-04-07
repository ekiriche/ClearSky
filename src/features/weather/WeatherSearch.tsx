import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';

export function WeatherSearch() {
  const [value, setValue] = useState('');
  const searchCity = useWeatherStore((s) => s.searchCity);
  const loading = useWeatherStore((s) => s.loading);
  const error = useWeatherStore((s) => s.error);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    searchCity(trimmed);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form onSubmit={handleSubmit} className="relative w-full max-w-md">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter city name"
          disabled={loading}
          className="w-full rounded-full border border-blue-100 bg-white py-3 pl-5 pr-12 text-slate-700 shadow-sm outline-none ring-blue-200 placeholder:text-slate-400 focus:ring-2 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
          aria-label="Search"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </form>
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
