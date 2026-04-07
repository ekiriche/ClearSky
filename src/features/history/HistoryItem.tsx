import { Clock, X } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';
import type { HistoryItem } from '../../types';

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

type Props = {
  item: HistoryItem;
};

export function HistoryItem({ item }: Props) {
  const searchCity = useWeatherStore((s) => s.searchCity);
  const removeHistoryItem = useWeatherStore((s) => s.removeHistoryItem);

  const formattedDate = formatRelativeTime(item.searchedAt);

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white border border-blue-100 shadow-sm px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => searchCity(item.city)}
          className="text-sm font-medium text-slate-700 hover:text-blue-500 transition-colors truncate cursor-pointer"
        >
          {item.city}
        </button>
        <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" aria-hidden="true" />
        <span className="text-xs text-slate-400 whitespace-nowrap">{formattedDate}</span>
      </div>
      <button
        onClick={() => removeHistoryItem(item.city)}
        aria-label={`Remove ${item.city}`}
        className="flex items-center justify-center h-6 w-6 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
