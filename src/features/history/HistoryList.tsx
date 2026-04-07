import { useWeatherStore } from '../../store/useWeatherStore';
import { HistoryItem } from './HistoryItem';

export function HistoryList() {
  const history = useWeatherStore((s) => s.history);
  const lastRemoved = useWeatherStore((s) => s.lastRemoved);
  const undoRemove = useWeatherStore((s) => s.undoRemove);

  if (history.length === 0) return null;

  return (
    <section className="w-full max-w-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Recent Searches
        </h2>
        {lastRemoved && (
          <button
            onClick={undoRemove}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            Undo
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {history.map((item) => (
          <HistoryItem key={item.city} item={item} />
        ))}
      </div>
    </section>
  );
}
