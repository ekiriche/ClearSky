import { useWeatherStore } from '../../store/useWeatherStore';
import { HistoryItem } from './HistoryItem';

export function HistoryList() {
  const history = useWeatherStore((s) => s.history);

  if (history.length === 0) return null;

  return (
    <section className="w-full max-w-md flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Recent Searches
      </h2>
      <ul className="flex flex-col gap-2">
        {history.map((item) => (
          <HistoryItem key={item.city} item={item} />
        ))}
      </ul>
    </section>
  );
}
