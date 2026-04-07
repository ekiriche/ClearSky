import { Clock, X } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';
import type { HistoryItem } from '../../types';

type Props = {
  item: HistoryItem;
};

export function HistoryItem({ item }: Props) {
  const searchCity = useWeatherStore((s) => s.searchCity);
  const removeHistoryItem = useWeatherStore((s) => s.removeHistoryItem);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(item.searchedAt));

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white border border-blue-100 shadow-sm px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => searchCity(item.city)}
          className="text-sm font-medium text-slate-700 hover:text-blue-500 transition-colors truncate"
        >
          {item.city}
        </button>
        <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" aria-hidden="true" />
        <span className="text-xs text-slate-400 whitespace-nowrap">{formattedDate}</span>
      </div>
      <button
        onClick={() => removeHistoryItem(item.city)}
        aria-label={`Remove ${item.city}`}
        className="flex items-center justify-center h-6 w-6 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
